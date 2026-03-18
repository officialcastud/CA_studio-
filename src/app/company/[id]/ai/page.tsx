'use client';

import { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useCompany } from '@/hooks/useCompany';
import { createJournalEntry, listJournalEntries } from '@/lib/offlineDb';
import { invalidateEntriesCache } from '@/lib/accounting/computeEngine';
import { expandManualJournalLines } from '@/lib/accounting/inventoryJournal';
import { findExistingAccountName, normalizeAccountName } from '@/lib/chartOfAccounts';
import { generateUniqueShortEntryCode } from '@/lib/utils/entryCodeGenerator';
import type { InventorySubLine, JournalLine, VoucherType } from '@/types/journal';

type ChatRole = 'user' | 'assistant';

interface ChatMessage {
  id: number;
  role: ChatRole;
  text: string;
}

type AiLineDraft = {
  account_name: string;
  debit?: number;
  credit?: number;
  inventory_sub_lines?: InventorySubLine[];
  tds_section?: string;
  tds_rate?: number;
  tcs_section?: string;
  tcs_rate?: number;
};

type AiJournalDraft = {
  voucher_type?: string;
  entry_date?: string; // YYYY-MM-DD
  narration?: string;
  lines: AiLineDraft[];
};

type AiPlan = {
  assistantText: string;
  requires_confirmation: boolean;
  questions: string[];
  journalEntries: AiJournalDraft[];
};

function safeTodayIso(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function bookPeriodFromDate(dateStr: string): string {
  // Matches ManualEntryDialog:
  // fyStartYear = month < 3 ? year - 1 : year
  const d = new Date(`${dateStr}T00:00:00`);
  const month = d.getMonth(); // 0-indexed
  const year = d.getFullYear();
  const fyStartYear = month < 3 ? year - 1 : year;
  return `${fyStartYear}-${fyStartYear + 1}`;
}

function normalizeVoucherType(input?: string): VoucherType {
  const v = input?.trim().toLowerCase();
  if (!v) return 'JRN';
  // Accept both labels and codes from user prompts.
  if (v === 'jrn' || v === 'journal' || v === 'journal entry') return 'JRN';
  if (v === 'sls' || v === 'sales') return 'SLS';
  if (v === 'pur' || v === 'purchase') return 'PUR';
  if (v === 'rct' || v === 'receipt') return 'RCT';
  if (v === 'pmt' || v === 'payment') return 'PMT';
  if (v === 'cnt' || v === 'contra') return 'CNT';
  if (v === 'dn' || v === 'debit note') return 'DN';
  if (v === 'cn' || v === 'credit note') return 'CN';
  if (v === 'pay') return 'PAY';
  return 'JRN';
}

function extractJsonObject(text: string): string | null {
  const raw = text.trim();
  if (!raw) return null;

  if (raw.startsWith('{') && raw.endsWith('}')) return raw;

  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenceMatch?.[1]) {
    const candidate = fenceMatch[1].trim();
    if (candidate.startsWith('{')) return candidate;
  }

  const firstBrace = raw.indexOf('{');
  const lastBrace = raw.lastIndexOf('}');
  if (firstBrace >= 0 && lastBrace > firstBrace) return raw.slice(firstBrace, lastBrace + 1);
  return null;
}

function parseAiPlan(rawText: string): AiPlan | null {
  const jsonText = extractJsonObject(rawText);
  if (!jsonText) return null;

  try {
    const parsed = JSON.parse(jsonText) as Partial<AiPlan>;
    if (typeof parsed.assistantText !== 'string') return null;
    if (typeof parsed.requires_confirmation !== 'boolean') return null;
    if (!Array.isArray(parsed.questions)) return null;
    if (!Array.isArray(parsed.journalEntries)) return null;

    for (const je of parsed.journalEntries) {
      if (!je || !Array.isArray(je.lines)) return null;
      for (const ln of je.lines) {
        if (!ln || typeof ln.account_name !== 'string') return null;
      }
    }

    return parsed as AiPlan;
  } catch {
    return null;
  }
}

async function callGeminiPlan(params: {
  model: string;
  systemPrompt: string;
  history: ChatMessage[];
}): Promise<string> {
  const { model, systemPrompt, history } = params;

  const response = await fetch('/.netlify/functions/gemini-plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      systemPrompt,
      history,
    }),
  });

  if (!response.ok) {
    const t = await response.text().catch(() => '');
    throw new Error(`Gemini proxy error: ${response.status}${t ? ` - ${t}` : ''}`);
  }

  const data = await response.json() as { text?: string };
  return (data.text ?? '').trim() || 'No response from Gemini.';
}

const AI_SYSTEM_PROMPT = `You are a helpful accounting assistant inside a bookkeeping product.

Goal:
- Understand normal human requests.
- Enter journal entries when the user request is clear enough.
- If anything is unclear or missing, ask short clarifying questions and set requires_confirmation=true (do NOT create entries yet).
- Ensure journal entry drafts balance (total debit equals total credit).
- You will receive EXACTLY ONE transaction text as input (no '@' separators). Output journalEntries for ONLY that transaction.
- You MAY choose new account names freely. The app will auto-classify unknown names into account_group and nature using its internal COA logic and safe fallbacks.
- If the user asks to "create COA" or "new accounts", interpret it as creating journal entries using new account names (no separate master COA editing is required).

Rules:
- Output MUST be valid JSON only (no markdown, no comments, no extra text).
- JSON schema:
{
  "assistantText": string,
  "requires_confirmation": boolean,
  "questions": string[],
  "journalEntries": [
    {
      "voucher_type": string,
      "entry_date": string,
      "narration": string,
      "lines": [
        {
          "account_name": string,
          "debit": number,
          "credit": number,
          "inventory_sub_lines"?: [
            {
              "inventory_name": string,
              "hsn_sac": string,
              "unit": string,
              "qty": number,
              "rate": number,
              "discount_percent": number,
              "cgst_percent": number,
              "sgst_percent": number,
              "igst_percent": number
            }
          ],
          "tds_section"?: string,
          "tds_rate"?: number,
          "tcs_section"?: string,
          "tcs_rate"?: number
        }
      ]
    }
  ]
}

Constraints:
- Create at least 2 lines per journal entry when journalEntries is non-empty.
- When requires_confirmation=true:
  - questions must be non-empty (2-5 short questions)
  - journalEntries must be [].
  - assistantText must clearly ask the user to answer the questions and tell them you will create entries after they confirm.
- When requires_confirmation=false:
  - questions must be []
  - if the user asked to create/update/record transactions, journalEntries must be non-empty and balanced.
- Ensure debits equal credits BEFORE responding (for any journalEntries you include).
- Prefer voucher_type = "JRN" if unclear.

Special note:
- If you include inventory_sub_lines for inventory-sensitive accounts, the app will automatically add separate GST lines from CGST/SGST/IGST percentages in the sub-lines.
- In that case, set the counterpart line amount to the FINAL total (taxable + taxes).`;

export default function CompanyAiPage() {
  const { company, companyId, loading } = useCompany();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: 'assistant',
      text:
        'Hi! Ask me in normal language to create journal entries. Example: "Record purchase on 2026-03-10 for 1,00,000 with GST" ',
    },
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const hydratedRef = useRef(false);

  const chatStorageKey = companyId ? `vaarta_ai_chat_${companyId}` : null;

  const coerceChatMessages = (parsed: unknown): ChatMessage[] => {
    if (!Array.isArray(parsed)) return [];
    const out: ChatMessage[] = [];
    parsed.forEach((item, idx) => {
      if (!item || typeof item !== 'object') return;
      const obj = item as any;
      const role = obj.role;
      const text = obj.text;
      if ((role !== 'user' && role !== 'assistant') || typeof text !== 'string') return;
      const id =
        typeof obj.id === 'number'
          ? obj.id
          : typeof obj.id === 'string'
            ? Number.isFinite(Number(obj.id))
              ? Number(obj.id)
              : idx
            : idx;
      out.push({ id, role, text });
    });
    return out;
  };

  // Hydrate chat history from localStorage (per company).
  useEffect(() => {
    hydratedRef.current = false;
    if (!companyId) return;
    try {
      const raw = window.localStorage.getItem(`vaarta_ai_chat_${companyId}`);
      if (!raw) {
        hydratedRef.current = true;
        return;
      }
      const parsed = JSON.parse(raw) as unknown;
      const cleaned = coerceChatMessages(parsed);
      if (cleaned.length > 0) setMessages(cleaned);
    } catch {
      // Ignore localStorage errors; keep in-memory chat.
    } finally {
      hydratedRef.current = true;
    }
  }, [companyId]);

  // Persist chat history locally on every change.
  useEffect(() => {
    if (!chatStorageKey) return;
    if (!hydratedRef.current) return;
    try {
      window.localStorage.setItem(chatStorageKey, JSON.stringify(messages));
    } catch {
      // Ignore quota/storage errors.
    }
  }, [chatStorageKey, messages]);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages.length]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;
    if (!companyId || !company) return;

    // Batch format:
    // - Use '@' as a delimiter: each transaction must be followed by '@'.
    // - We will process each transaction sequentially to keep JSON + Gemini size small.
    const MAX_TRANSACTIONS_PER_PROMPT = 100;
    const parsedTxs = trimmed
      .split('@')
      .map(t => t.trim())
      .filter(Boolean);

    const transactions = parsedTxs.length > 0 ? parsedTxs : [trimmed];
    const truncated = transactions.length > MAX_TRANSACTIONS_PER_PROMPT;
    const txsToProcess = truncated ? transactions.slice(0, MAX_TRANSACTIONS_PER_PROMPT) : transactions;

    setError(null);
    const userMessage: ChatMessage = {
      id: Date.now(),
      role: 'user',
      text: trimmed,
    };

    const baseMessages = messages;
    setMessages([...messages, userMessage]);
    setInput('');
    setIsSending(true);

    try {
      // Hardcode model to avoid exposing VITE_* env values in the browser bundle.
      const model = 'gemini-3.1-flash-preview';

      // Precompute existing entry codes once for speed + avoid duplicates.
      const existingCodes = new Set(listJournalEntries(companyId).map(e => e.entry_code));

      const nextEntryCode = () => {
        const code = generateUniqueShortEntryCode(existingCodes);
        existingCodes.add(code);
        return code;
      };

      const overallCreatedCodes: string[] = [];
      const overallErrors: string[] = [];

      if (truncated) {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 2,
            role: 'assistant',
            text: `You sent ${transactions.length} transactions. I will process only the first ${MAX_TRANSACTIONS_PER_PROMPT} to stay stable. Remaining will be ignored.`,
          },
        ]);
      }

      for (let idx = 0; idx < txsToProcess.length; idx += 1) {
        const txText = txsToProcess[idx];

        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1000 + idx,
            role: 'assistant',
            text: `Processing transaction ${idx + 1}/${txsToProcess.length}...`,
          },
        ]);

        // Send ONLY this transaction to Gemini, but keep the previous chat context.
        const modelHistory: ChatMessage[] = [
          ...baseMessages,
          {
            id: Date.now() + 2000 + idx,
            role: 'user',
            text: txText,
          },
        ];

        try {
          const raw = await callGeminiPlan({
            model,
            systemPrompt: AI_SYSTEM_PROMPT,
            history: modelHistory,
          });

          const plan = parseAiPlan(raw);

          let assistantText = plan?.assistantText || raw;
          if (plan?.requires_confirmation && plan.questions.length > 0) {
            assistantText = `${assistantText}\n\nPlease answer these to proceed:\n${plan.questions
              .map(q => `- ${q}`)
              .join('\n')}`;
          }

          setMessages(prev => [
            ...prev,
            {
              id: Date.now() + 3000 + idx,
              role: 'assistant',
              text: assistantText,
            },
          ]);

          if (plan?.requires_confirmation) {
            // Stop further processing until user answers questions.
            return;
          }

          const entriesToCreate = plan?.journalEntries ?? [];
          if (entriesToCreate.length === 0) continue;

          const createdCodesForTx: string[] = [];
          const errorsForTx: string[] = [];

          for (const draft of entriesToCreate) {
            const entry_date = draft.entry_date?.trim() || safeTodayIso();
            const voucher_type = normalizeVoucherType(draft.voucher_type);
            const narration = draft.narration?.trim() || `AI journal entry (${voucher_type})`;
            const entry_code = nextEntryCode();
            const book_period = bookPeriodFromDate(entry_date);

            // Canonicalize account names to avoid “COA duplicates” due to spelling/case differences.
            const manualDraftLines = (draft.lines ?? []).map(line => {
              const rawName = line.account_name.trim();
              const normalized = normalizeAccountName(rawName);
              const canonical = findExistingAccountName(companyId, normalized) ?? normalized;
              return {
                account_name: canonical,
                debit: String(line.debit ?? 0),
                credit: String(line.credit ?? 0),
                inventory_sub_lines: line.inventory_sub_lines,
                ...(line.tds_section ? { tds_section: line.tds_section } : {}),
                ...(line.tds_rate != null ? { tds_rate: String(line.tds_rate) } : {}),
                ...(line.tcs_section ? { tcs_section: line.tcs_section } : {}),
                ...(line.tcs_rate != null ? { tcs_rate: String(line.tcs_rate) } : {}),
              };
            });

            const expanded: JournalLine[] = expandManualJournalLines(manualDraftLines as any, {
              voucherType: voucher_type,
              companyId,
            });

            try {
              const created = createJournalEntry({
                company_id: companyId,
                entry_code,
                entry_date,
                voucher_type,
                voucher_number: null,
                lines: expanded,
                narration,
                book_period,
              } as any);
              createdCodesForTx.push(created.entry_code);
            } catch (e: any) {
              errorsForTx.push(e?.message || 'Failed to create entry');
            }
          }

          invalidateEntriesCache(companyId);

          if (createdCodesForTx.length > 0) {
            overallCreatedCodes.push(...createdCodesForTx);
            setMessages(prev => [
              ...prev,
              {
                id: Date.now() + 4000 + idx,
                role: 'assistant',
                text: `Created journal entries for transaction ${idx + 1}: ${createdCodesForTx.join(', ')}`,
              },
            ]);
          }

          if (errorsForTx.length > 0) {
            overallErrors.push(...errorsForTx.slice(0, 3));
            setError(
              `Some entries failed while processing transaction ${idx + 1}. ` +
                `First error: ${errorsForTx[0] || 'Unknown error'}`
            );
          }
        } catch (e: any) {
          overallErrors.push(e?.message || 'Gemini failed for this transaction');
          setError(`Failed processing transaction ${idx + 1}. ${e?.message || ''}`);
        }
      }

      if (overallCreatedCodes.length > 0) {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 9000,
            role: 'assistant',
            text: `Done. Created ${overallCreatedCodes.length} journal entries: ${overallCreatedCodes.slice(0, 20).join(', ')}${
              overallCreatedCodes.length > 20 ? '...' : ''
            }`,
          },
        ]);
      }
    } catch (e: any) {
      setError(e?.message || 'Something went wrong while talking to Gemini.');
    } finally {
      setIsSending(false);
    }
  };

  if (loading || !companyId || !company) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="mb-3 flex items-center gap-2 text-xs sm:text-sm text-gray-500">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white border border-gray-200 px-2.5 py-1 shadow-sm">
          <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Sparkles className="h-3 w-3" />
          </span>
          <span className="uppercase tracking-wide font-semibold text-[11px]">AI Workspace</span>
        </div>
        <span className="hidden sm:inline text-gray-400 truncate">
          Chatting for <span className="font-medium text-gray-600">{company.name}</span>
        </span>
      </div>

      <div className="flex-1 min-h-0 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col">
        <div
          ref={scrollRef}
          className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-4 py-3 sm:py-4 space-y-3 sm:space-y-4 bg-gray-50"
        >
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[92%] sm:max-w-[80%] md:max-w-[70%] rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-[15px] leading-relaxed tracking-[0.01em] ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.text}</p>
              </div>
            </div>
          ))}

          {error && (
            <div className="text-xs sm:text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 bg-white/90 backdrop-blur flex items-end gap-2 px-3 sm:px-4 py-2.5 sm:py-3">
          <div className="flex-1">
            <textarea
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  void handleSend();
                }
              }}
              className="block w-full resize-none rounded-xl bg-gray-50 text-gray-900 text-sm sm:text-[15px] leading-relaxed border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 px-3.5 py-2.5 sm:px-4 sm:py-2.5 placeholder:text-gray-400 outline-none"
              placeholder="Describe 1+ transactions in normal language. Separate each transaction with '@' (example: 'Purchase ... @ Sales ... @'). I will process them one by one."
            />
          </div>
          <button
            type="button"
            onClick={() => void handleSend()}
            disabled={isSending || !input.trim()}
            className="inline-flex items-center justify-center rounded-xl px-3 sm:px-3.5 py-2 bg-blue-600 text-white text-xs sm:text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:bg-blue-700 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5 sm:mr-1" />
            <span className="hidden sm:inline">{isSending ? 'Thinking...' : 'Ask AI'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

