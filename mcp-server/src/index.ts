import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  createServer,
  Tool,
  ToolRequest,
  ToolResponse,
} from '@modelcontextprotocol/sdk/server';

// Simple JSON file storage so the MCP server can keep its own copy of
// companies and journal entries, independent of the browser localStorage DB.

type Company = {
  id: string;
  name: string;
  entity_type: string;
  created_at: string;
  [key: string]: unknown;
};

type JournalLine = {
  account_name: string;
  debit: number;
  credit: number;
  [key: string]: unknown;
};

type JournalEntry = {
  id: string;
  company_id: string;
  entry_code: string;
  entry_date: string;
  voucher_type: string;
  narration: string;
  book_period: string;
  lines: JournalLine[];
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
};

type DbSchema = {
  companies: Company[];
  journal_entries: JournalEntry[];
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_DIR = join(__dirname, '..', '..', '.mcp-data');
const DB_PATH = join(DATA_DIR, 'db.json');

function ensureDbFile(): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!existsSync(DB_PATH)) {
    const empty: DbSchema = { companies: [], journal_entries: [] };
    writeFileSync(DB_PATH, JSON.stringify(empty, null, 2), 'utf8');
  }
}

function loadDb(): DbSchema {
  ensureDbFile();
  const raw = readFileSync(DB_PATH, 'utf8');
  try {
    const parsed = JSON.parse(raw) as DbSchema;
    return {
      companies: Array.isArray(parsed.companies) ? parsed.companies : [],
      journal_entries: Array.isArray(parsed.journal_entries) ? parsed.journal_entries : [],
    };
  } catch {
    const empty: DbSchema = { companies: [], journal_entries: [] };
    writeFileSync(DB_PATH, JSON.stringify(empty, null, 2), 'utf8');
    return empty;
  }
}

function saveDb(db: DbSchema): void {
  ensureDbFile();
  writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
}

function generateId(): string {
  return `id_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Gemini client + AI journal planning
// ─────────────────────────────────────────────────────────────────────────────

type ChatRole = 'user' | 'assistant';

type ChatMessage = {
  role: ChatRole;
  text: string;
};

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite-preview';

// Same structure as the frontend AI page, but the app will usually handle
// persisting the final entries. MCP just returns the plan.
type AiLineDraft = {
  account_name: string;
  debit?: number;
  credit?: number;
};

type AiJournalDraft = {
  voucher_type?: string;
  entry_date?: string;
  narration?: string;
  lines: AiLineDraft[];
};

type AiPlan = {
  assistantText: string;
  requires_confirmation: boolean;
  questions: string[];
  journalEntries: AiJournalDraft[];
};

const AI_SYSTEM_PROMPT = `You are a helpful accounting assistant inside a bookkeeping product.

Goal:
- Understand normal human requests.
- Enter journal entries when the user request is clear enough.
- If anything is unclear or missing, ask short clarifying questions and set requires_confirmation=true (do NOT create entries yet).
- Ensure journal entry drafts balance (total debit equals total credit).
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
          "credit": number
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
- You are used from a local MCP server talking to a CA accounting app.
- Be concise and India-focused in examples and narration.`;

async function callGeminiPlan(params: {
  model?: string;
  systemPrompt?: string;
  history: ChatMessage[];
}): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set for the MCP server');
  }

  const model = params.model || GEMINI_MODEL;
  const systemPrompt = params.systemPrompt || AI_SYSTEM_PROMPT;
  const contents = params.history.map((m) => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: String(m.text ?? '') }],
  }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        systemInstruction: { role: 'user', parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: { temperature: 0.2 },
      }),
    },
  );

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Gemini error: ${response.status} - ${text}`);
  }

  const data = JSON.parse(text) as any;
  const parts = data?.candidates?.[0]?.content?.parts;
  const assistantText = Array.isArray(parts)
    ? parts.map((p) => p?.text ?? '').join('').trim()
    : '';

  return assistantText || '';
}

// ─────────────────────────────────────────────────────────────────────────────
// Tools
// ─────────────────────────────────────────────────────────────────────────────

const listCompaniesTool: Tool = {
  name: 'list_companies',
  description: 'List all companies known to the MCP accounting server.',
  inputSchema: {
    type: 'object',
    properties: {},
  },
  async invoke(_req: ToolRequest): Promise<ToolResponse> {
    const db = loadDb();
    return {
      content: [
        {
          type: 'json',
          data: db.companies,
        },
      ],
    };
  },
};

const getCompanyTool: Tool = {
  name: 'get_company',
  description: 'Fetch a single company by id.',
  inputSchema: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'Company id' },
    },
    required: ['id'],
  },
  async invoke(req: ToolRequest): Promise<ToolResponse> {
    const { id } = req.params as { id: string };
    const db = loadDb();
    const company = db.companies.find((c) => c.id === id) ?? null;
    return {
      content: [
        {
          type: 'json',
          data: company,
        },
      ],
    };
  },
};

const listJournalEntriesTool: Tool = {
  name: 'list_journal_entries',
  description:
    'List journal entries for a company, optionally filtered by date range or voucher type.',
  inputSchema: {
    type: 'object',
    properties: {
      company_id: { type: 'string', description: 'Company id' },
      fromDate: { type: 'string', description: 'Start date (YYYY-MM-DD)', nullable: true },
      toDate: { type: 'string', description: 'End date (YYYY-MM-DD)', nullable: true },
      voucherType: { type: 'string', description: 'Voucher type code like JRN, SLS, etc.', nullable: true },
    },
    required: ['company_id'],
  },
  async invoke(req: ToolRequest): Promise<ToolResponse> {
    const { company_id, fromDate, toDate, voucherType } = req.params as {
      company_id: string;
      fromDate?: string | null;
      toDate?: string | null;
      voucherType?: string | null;
    };

    const db = loadDb();
    let entries = db.journal_entries.filter((e) => e.company_id === company_id);

    if (fromDate) {
      entries = entries.filter((e) => e.entry_date >= fromDate);
    }
    if (toDate) {
      entries = entries.filter((e) => e.entry_date <= toDate);
    }
    if (voucherType) {
      entries = entries.filter((e) => e.voucher_type === voucherType);
    }

    entries = entries.sort((a, b) => a.entry_date.localeCompare(b.entry_date));

    return {
      content: [
        {
          type: 'json',
          data: entries,
        },
      ],
    };
  },
};

const createJournalEntryTool: Tool = {
  name: 'create_journal_entry',
  description:
    'Create a new journal entry for a company. This is a thin wrapper around the app journal format.',
  inputSchema: {
    type: 'object',
    properties: {
      company_id: { type: 'string' },
      entry_date: { type: 'string', description: 'Date in YYYY-MM-DD format' },
      voucher_type: { type: 'string', description: 'Voucher type code like JRN, SLS, etc.' },
      narration: { type: 'string' },
      book_period: { type: 'string', description: 'Book period label or key, e.g. 2025-2026' },
      lines: {
        type: 'array',
        description: 'Journal lines with debit/credit amounts in numbers.',
        items: {
          type: 'object',
          properties: {
            account_name: { type: 'string' },
            debit: { type: 'number' },
            credit: { type: 'number' },
          },
          required: ['account_name'],
        },
      },
    },
    required: ['company_id', 'entry_date', 'voucher_type', 'narration', 'book_period', 'lines'],
  },
  async invoke(req: ToolRequest): Promise<ToolResponse> {
    const { company_id, entry_date, voucher_type, narration, book_period, lines } = req.params as {
      company_id: string;
      entry_date: string;
      voucher_type: string;
      narration: string;
      book_period: string;
      lines: JournalLine[];
    };

    const db = loadDb();
    const nowIso = new Date().toISOString();
    const entry: JournalEntry = {
      id: generateId(),
      company_id,
      entry_code: `MCP-${Date.now().toString(36).toUpperCase()}`,
      entry_date,
      voucher_type,
      narration,
      book_period,
      lines,
      created_at: nowIso,
      updated_at: nowIso,
    };

    db.journal_entries.push(entry);
    saveDb(db);

    return {
      content: [
        {
          type: 'json',
          data: entry,
        },
      ],
    };
  },
};

const geminiJournalPlanTool: Tool = {
  name: 'gemini_journal_plan',
  description:
    'Call Gemini 3.1 Flash to convert natural language into a structured journal plan JSON (assistantText, requires_confirmation, questions, journalEntries).',
  inputSchema: {
    type: 'object',
    properties: {
      history: {
        type: 'array',
        description: 'Chat history messages in order, including the latest user request.',
        items: {
          type: 'object',
          properties: {
            role: {
              type: 'string',
              enum: ['user', 'assistant'],
            },
            text: { type: 'string' },
          },
          required: ['role', 'text'],
        },
      },
      model: {
        type: 'string',
        description:
          'Optional Gemini model name. Defaults to GEMINI_MODEL env or gemini-3.1-flash-lite-preview.',
      },
      systemPrompt: {
        type: 'string',
        description:
          'Optional custom system prompt. If omitted, uses the built-in accounting assistant prompt.',
      },
    },
    required: ['history'],
  },
  async invoke(req: ToolRequest): Promise<ToolResponse> {
    const { history, model, systemPrompt } = req.params as {
      history: ChatMessage[];
      model?: string;
      systemPrompt?: string;
    };

    const raw = await callGeminiPlan({ history, model, systemPrompt });

    // Try to extract a JSON object; if it fails, return the raw text.
    let parsed: AiPlan | null = null;
    const trimmed = raw.trim();
    let jsonText: string | null = null;
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      jsonText = trimmed;
    } else {
      const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
      if (fenceMatch?.[1]) {
        jsonText = fenceMatch[1].trim();
      } else {
        const first = trimmed.indexOf('{');
        const last = trimmed.lastIndexOf('}');
        if (first >= 0 && last > first) {
          jsonText = trimmed.slice(first, last + 1);
        }
      }
    }

    if (jsonText) {
      try {
        const candidate = JSON.parse(jsonText) as AiPlan;
        if (
          typeof candidate.assistantText === 'string' &&
          typeof candidate.requires_confirmation === 'boolean' &&
          Array.isArray(candidate.questions) &&
          Array.isArray(candidate.journalEntries)
        ) {
          parsed = candidate;
        }
      } catch {
        parsed = null;
      }
    }

    return {
      content: [
        {
          type: 'json',
          data: {
            raw,
            plan: parsed,
          },
        },
      ],
    };
  },
};

async function main() {
  const server = createServer(
    {
      name: 'ca-accounting-mcp',
      version: '0.1.0',
      description: 'MCP server exposing CA Accounting companies and journal entries.',
    },
    {
      tools: [
        listCompaniesTool,
        getCompanyTool,
        listJournalEntriesTool,
        createJournalEntryTool,
        geminiJournalPlanTool,
      ],
    },
  );

  await server.start();
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start CA Accounting MCP server', err);
  process.exit(1);
});

