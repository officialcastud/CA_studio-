'use client';

import { useEffect, useRef, useState } from 'react';
import { Sparkles, Trash2 } from 'lucide-react';
import { useCompany } from '@/hooks/useCompany';
import {
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  listJournalEntries,
} from '@/lib/offlineDb';
import { invalidateEntriesCache } from '@/lib/accounting/computeEngine';
import { expandManualJournalLines } from '@/lib/accounting/inventoryJournal';
import { generateUniqueEntryCode } from '@/lib/utils/entryCodeGenerator';
import { findExistingAccountName, normalizeAccountName } from '@/lib/chartOfAccounts';
import { MASTER_COA } from '@/lib/masterCOA';
import type { Company } from '@/types/company';
import type { InventorySubLine, JournalEntry, JournalLine, VoucherType } from '@/types/journal';

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
  entry_date?: string;
  narration?: string;
  lines: AiLineDraft[];
};

type AiAction =
  | { type: 'create'; entry: AiJournalDraft }
  | { type: 'update'; entry_code: string; entry: AiJournalDraft }
  | { type: 'delete'; entry_code: string };

type AiPlan = {
  assistantText: string;
  requires_confirmation: boolean;
  questions: string[];
  // New unified actions array
  actions: AiAction[];
  // Legacy field kept for backward compatibility
  journalEntries?: AiJournalDraft[];
};

function safeTodayIso(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function bookPeriodFromDate(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  const month = d.getMonth();
  const year = d.getFullYear();
  const fyStartYear = month < 3 ? year - 1 : year;
  return `${fyStartYear}-${fyStartYear + 1}`;
}

function normalizeVoucherType(input?: string): VoucherType {
  const v = input?.trim().toLowerCase();
  if (!v) return 'JRN';
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
    const parsed = JSON.parse(jsonText) as Record<string, unknown>;
    if (typeof parsed.assistantText !== 'string') return null;
    if (typeof parsed.requires_confirmation !== 'boolean') return null;
    if (!Array.isArray(parsed.questions)) return null;

    // Normalize actions: support both new `actions` array and legacy `journalEntries`
    let actions: AiAction[] = [];

    if (Array.isArray(parsed.actions)) {
      for (const a of parsed.actions) {
        if (!a || typeof a !== 'object') continue;
        const action = a as Record<string, unknown>;
        if (action.type === 'create' && action.entry && typeof action.entry === 'object') {
          const entry = action.entry as AiJournalDraft;
          if (Array.isArray(entry.lines)) actions.push({ type: 'create', entry });
        } else if (
          action.type === 'update' &&
          typeof action.entry_code === 'string' &&
          action.entry &&
          typeof action.entry === 'object'
        ) {
          const entry = action.entry as AiJournalDraft;
          if (Array.isArray(entry.lines))
            actions.push({ type: 'update', entry_code: action.entry_code, entry });
        } else if (action.type === 'delete' && typeof action.entry_code === 'string') {
          actions.push({ type: 'delete', entry_code: action.entry_code });
        }
      }
    }

    // Legacy: convert journalEntries → create actions
    if (Array.isArray(parsed.journalEntries) && actions.length === 0) {
      for (const je of parsed.journalEntries) {
        if (!je || !Array.isArray((je as AiJournalDraft).lines)) continue;
        for (const ln of (je as AiJournalDraft).lines) {
          if (!ln || typeof (ln as AiLineDraft).account_name !== 'string') continue;
        }
        actions.push({ type: 'create', entry: je as AiJournalDraft });
      }
    }

    return {
      assistantText: parsed.assistantText as string,
      requires_confirmation: parsed.requires_confirmation as boolean,
      questions: parsed.questions as string[],
      actions,
    };
  } catch {
    return null;
  }
}

/** Build compact journal entries context for the system prompt (cap at 300 entries). */
function buildEntriesContext(companyId: string): string {
  const entries = listJournalEntries(companyId);
  if (entries.length === 0) return 'No journal entries yet.';

  const capped = entries.slice(-300);
  const lines: string[] = [`Total entries: ${entries.length}${entries.length > 300 ? ' (showing last 300)' : ''}`];
  for (const e of capped) {
    const linesSummary = e.lines
      .map(l => `    ${l.account_name}: Dr ${l.debit ?? 0}, Cr ${l.credit ?? 0}`)
      .join('\n');
    lines.push(
      `[${e.entry_code}] ${e.entry_date} | ${e.voucher_type} | "${e.narration}"\n${linesSummary}`
    );
  }
  return lines.join('\n\n');
}

/** Full COA names list (520+). */
const ALL_COA_NAMES = MASTER_COA.map(a => a.name).join(', ');

function buildDynamicSystemPrompt(companyId: string, company: Company): string {
  const entriesContext = buildEntriesContext(companyId);

  return `You are a powerful accounting AI agent inside a bookkeeping product. You have FULL ACCESS to the company's data.

## Company
Name: ${company.name}
Entity Type: ${company.entity_type}

## Your Powers
You can:
- READ all existing journal entries (they are listed below).
- CREATE new journal entries.
- UPDATE existing journal entries (use the entry_code shown in the list).
- DELETE existing journal entries (use the entry_code shown in the list).

## Goal
- Understand normal human requests about accounting.
- Act on them immediately — create, update, or delete journal entries as needed.
- If anything critical is unclear or missing, ask short clarifying questions (requires_confirmation=true).
- Ensure every journal entry is balanced (total debit = total credit).

## Output Format (STRICTLY valid JSON, no markdown, no comments):
{
  "assistantText": string,
  "requires_confirmation": boolean,
  "questions": string[],
  "actions": [
    { "type": "create", "entry": { "voucher_type": string, "entry_date": "YYYY-MM-DD", "narration": string, "lines": [{ "account_name": string, "debit": number, "credit": number, "inventory_sub_lines"?: [...], "tds_section"?: string, "tds_rate"?: number, "tcs_section"?: string, "tcs_rate"?: number }] } },
    { "type": "update", "entry_code": string, "entry": { "voucher_type": string, "entry_date": "YYYY-MM-DD", "narration": string, "lines": [...] } },
    { "type": "delete", "entry_code": string }
  ]
}

## Rules
- When requires_confirmation=true: questions must be non-empty, actions must be [].
- When requires_confirmation=false: questions must be [], actions can be non-empty.
- Ensure debits equal credits in EVERY create/update entry.
- Prefer voucher_type "JRN" if unclear.
- For update actions: provide the FULL replacement entry (all lines), not a partial patch.
- For delete: you MUST confirm the entry_code from the existing entries list below.

## inventory_sub_lines note
If you include inventory_sub_lines for inventory-sensitive accounts, the app will automatically add separate GST lines. Set the counterpart line to the FINAL total (taxable + taxes).

## Chart of Accounts — ${MASTER_COA.length} accounts available
${ALL_COA_NAMES}

## Existing Journal Entries (live data)
${entriesContext}`;
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
    body: JSON.stringify({ model, systemPrompt, history }),
  });

  if (!response.ok) {
    const t = await response.text().catch(() => '');
    throw new Error(`Gemini proxy error: ${response.status}${t ? ` - ${t}` : ''}`);
  }

  const data = (await response.json()) as { text?: string };
  return (data.text ?? '').trim() || 'No response from Gemini.';
}

/** Resolve draft lines into fully expanded JournalLines. */
function resolveLines(
  draftLines: AiLineDraft[],
  companyId: string,
  voucherType: VoucherType
): JournalLine[] {
  const manualDraftLines = draftLines.map(line => {
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

  return expandManualJournalLines(manualDraftLines as any, { voucherType, companyId });
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 1,
  role: 'assistant',
  text: 'Hi! I am your AI accounting agent. I can create, edit, and delete journal entries.\n\nJust describe what you need in plain language. Examples:\n• "Record purchase of ₹1,00,000 on 2026-03-10"\n• "Delete entry JRN-001"\n• "Edit JRN-005 — change the date to 2026-04-01"\n• "Show me all sales entries last month"',
};

function coerceChatMessages(parsed: unknown): ChatMessage[] {
  if (!Array.isArray(parsed)) return [];
  const out: ChatMessage[] = [];
  parsed.forEach((item, idx) => {
    if (!item || typeof item !== 'object') return;
    const obj = item as Record<string, unknown>;
    const role = obj.role;
    const text = obj.text;
    if ((role !== 'user' && role !== 'assistant') || typeof text !== 'string') return;
    const id =
      typeof obj.id === 'number'
        ? obj.id
        : typeof obj.id === 'string' && Number.isFinite(Number(obj.id))
          ? Number(obj.id)
          : idx;
    out.push({ id, role: role as ChatRole, text });
  });
  return out;
}

export default function CompanyAiPage() {
  const { company, companyId, loading } = useCompany();

  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Tracks which companyId has been fully hydrated so the save effect
  // never fires before the loaded messages are in state.
  const [hydratedForId, setHydratedForId] = useState<string | null>(null);

  const chatStorageKey = companyId ? `vaarta_ai_chat_${companyId}` : null;

  // Load chat history from localStorage whenever the company changes.
  // All setXxx calls here are batched by React 18 into a single render,
  // so the save effect below only fires AFTER the loaded messages are in state.
  useEffect(() => {
    if (!companyId) return;
    setHydratedForId(null); // block saving until load is done
    let loaded: ChatMessage[] = [];
    try {
      const raw = window.localStorage.getItem(`vaarta_ai_chat_${companyId}`);
      if (raw) {
        const cleaned = coerceChatMessages(JSON.parse(raw) as unknown);
        if (cleaned.length > 0) loaded = cleaned;
      }
    } catch {
      // ignore; keep empty
    }
    setMessages(loaded.length > 0 ? loaded : [INITIAL_MESSAGE]);
    setHydratedForId(companyId); // allow saving from this render onward
  }, [companyId]);

  // Persist chat to localStorage — only after hydration is confirmed for this company.
  useEffect(() => {
    if (!chatStorageKey || hydratedForId !== companyId) return;
    try {
      window.localStorage.setItem(chatStorageKey, JSON.stringify(messages));
    } catch {
      // ignore quota errors
    }
  }, [chatStorageKey, messages, hydratedForId, companyId]);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages.length]);

  const handleClearChat = () => {
    if (chatStorageKey) {
      try {
        window.localStorage.removeItem(chatStorageKey);
      } catch {
        // ignore
      }
    }
    setMessages([INITIAL_MESSAGE]);
    setError(null);
    // Keep hydratedForId === companyId so saving continues to work normally.
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;
    if (!companyId || !company) return;

    setError(null);

    const split = trimmed
      .split('@')
      .map(s => s.trim())
      .filter(Boolean);

    if (split.length > 1 && !trimmed.endsWith('@')) {
      setError('For multiple transactions, end each with "@". Example: tx1 @ tx2 @');
      return;
    }

    if (split.length > 100) {
      setError('Limit is 100 transactions per message.');
      return;
    }

    const transactions = split.length > 0 ? split : [trimmed];

    const userMessage: ChatMessage = { id: Date.now(), role: 'user', text: trimmed };
    const baseMessages = messages;
    const fullHistory = [...baseMessages, userMessage];
    setMessages(fullHistory);
    setInput('');
    setIsSending(true);

    try {
      const model = 'gemini-3.1-flash-lite-preview';

      for (let txIndex = 0; txIndex < transactions.length; txIndex += 1) {
        const txText = transactions[txIndex];
        const txUserMessage: ChatMessage = {
          id: Date.now() + txIndex + 1,
          role: 'user',
          text: txText,
        };
        // Only send last 10 messages as context to keep API calls fast.
        const recentBase = baseMessages.slice(-10);
        const txHistory = [...recentBase, txUserMessage];

        // Build fresh system prompt with current entries + full COA each time
        const systemPrompt = buildDynamicSystemPrompt(companyId, company);

        const raw = await callGeminiPlan({ model, systemPrompt, history: txHistory });

        const plan = parseAiPlan(raw);
        let assistantText = plan?.assistantText || raw;

        if (plan?.requires_confirmation && plan.questions.length > 0) {
          assistantText = `${assistantText}\n\nPlease answer these to proceed:\n${plan.questions
            .map(q => `• ${q}`)
            .join('\n')}`;
        }

        setMessages(prev => [
          ...prev,
          { id: Date.now() + 1000 + txIndex * 3, role: 'assistant', text: assistantText },
        ]);

        if (plan?.requires_confirmation) return;

        const actions = plan?.actions ?? [];
        if (actions.length === 0) continue;

        const resultParts: string[] = [];
        const errs: string[] = [];

        for (const action of actions) {
          if (action.type === 'create') {
            try {
              const draft = action.entry;
              const entry_date = draft.entry_date?.trim() || safeTodayIso();
              const voucher_type = normalizeVoucherType(draft.voucher_type);
              const narration = draft.narration?.trim() || `AI entry (${voucher_type})`;
              const entry_code = generateUniqueEntryCode(companyId);
              const book_period = bookPeriodFromDate(entry_date);
              const lines = resolveLines(draft.lines ?? [], companyId, voucher_type);
              const created = createJournalEntry({
                company_id: companyId,
                entry_code,
                entry_date,
                voucher_type,
                voucher_number: null,
                lines,
                narration,
                book_period,
              } as any);
              resultParts.push(`Created ${created.entry_code}`);
            } catch (e: any) {
              errs.push(`Create failed: ${e?.message || 'unknown error'}`);
            }
          } else if (action.type === 'update') {
            try {
              const allEntries = listJournalEntries(companyId);
              const existing = allEntries.find(e => e.entry_code === action.entry_code);
              if (!existing) {
                errs.push(`Update failed: entry_code "${action.entry_code}" not found`);
                continue;
              }
              const draft = action.entry;
              const entry_date = draft.entry_date?.trim() || existing.entry_date;
              const voucher_type = normalizeVoucherType(draft.voucher_type) || existing.voucher_type;
              const narration = draft.narration?.trim() || existing.narration;
              const book_period = bookPeriodFromDate(entry_date);
              const lines = resolveLines(draft.lines ?? [], companyId, voucher_type);
              const updated = updateJournalEntry(existing.id, {
                entry_date,
                voucher_type,
                narration,
                book_period,
                lines,
              });
              if (updated) resultParts.push(`Updated ${updated.entry_code}`);
              else errs.push(`Update failed: ${action.entry_code}`);
            } catch (e: any) {
              errs.push(`Update failed: ${e?.message || 'unknown error'}`);
            }
          } else if (action.type === 'delete') {
            try {
              const allEntries = listJournalEntries(companyId);
              const existing = allEntries.find(e => e.entry_code === action.entry_code);
              if (!existing) {
                errs.push(`Delete failed: entry_code "${action.entry_code}" not found`);
                continue;
              }
              deleteJournalEntry(existing.id);
              resultParts.push(`Deleted ${action.entry_code}`);
            } catch (e: any) {
              errs.push(`Delete failed: ${e?.message || 'unknown error'}`);
            }
          }
        }

        invalidateEntriesCache(companyId);

        if (resultParts.length > 0) {
          setMessages(prev => [
            ...prev,
            {
              id: Date.now() + 2000 + txIndex * 3,
              role: 'assistant',
              text: `Done: ${resultParts.join(', ')}`,
            },
          ]);
        }

        if (errs.length > 0) {
          setError(errs.slice(0, 3).join(' | '));
          return;
        }
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
      <div className="mb-3 flex items-center justify-between gap-2 text-xs sm:text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white border border-gray-200 px-2.5 py-1 shadow-sm">
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <Sparkles className="h-3 w-3" />
            </span>
            <span className="uppercase tracking-wide font-semibold text-[11px]">AI Agent</span>
          </div>
          <span className="hidden sm:inline text-gray-400 truncate">
            Full access for{' '}
            <span className="font-medium text-gray-600">{company.name}</span>
          </span>
        </div>

        <button
          type="button"
          onClick={handleClearChat}
          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-medium text-gray-500 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors shadow-sm"
          title="Clear chat history"
        >
          <Trash2 className="h-3 w-3" />
          <span>Clear chat</span>
        </button>
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
              placeholder="Tell the AI agent what to do — create, edit, or delete journal entries in plain language."
            />
          </div>
          <button
            type="button"
            onClick={() => void handleSend()}
            disabled={isSending || !input.trim()}
            className="inline-flex items-center justify-center rounded-xl px-3 sm:px-3.5 py-2 bg-blue-600 text-white text-xs sm:text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:bg-blue-700 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5 sm:mr-1" />
            <span className="hidden sm:inline">{isSending ? 'Working...' : 'Send'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
