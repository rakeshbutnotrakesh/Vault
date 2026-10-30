import { ToolDefinition, CodeSnippet, DevNote, DevTask, ColorPalette, UserSettings } from '../types';

export const TOOLS: ToolDefinition[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    category: 'Workspace',
    description: 'Overview of recently used tools, active snippets, pinned notes, and pending tasks',
    iconName: 'LayoutDashboard',
    shortcut: 'Alt+1'
  },
  {
    id: 'polyglot',
    name: 'Polyglot Studio',
    category: 'Workspace',
    description: 'Worldwide language directory (70+ languages), Rosetta Stone cross-syntax comparison & universal model transpiler',
    iconName: 'Globe',
    badge: '70+ Langs',
    shortcut: 'Alt+P'
  },
  {
    id: 'code-vault',
    name: 'Code Vault',
    category: 'Management',
    description: 'Searchable snippet repository supporting 70+ languages worldwide with templates, tags, and categories',
    iconName: 'Code2',
    shortcut: 'Alt+2'
  },
  {
    id: 'json-tools',
    name: 'JSON Formatter',
    category: 'Utilities',
    description: 'Validate, format, minify, and inspect JSON with exact syntax line/col errors',
    iconName: 'Braces',
    shortcut: 'Alt+3'
  },
  {
    id: 'markdown',
    name: 'Markdown Editor',
    category: 'Editors',
    description: 'Side-by-side Markdown workspace with live preview, word statistics, and export',
    iconName: 'FileText',
    shortcut: 'Alt+4'
  },
  {
    id: 'html-playground',
    name: 'HTML Playground',
    category: 'Playgrounds',
    description: 'Isolated live HTML/CSS canvas with multi-device responsive preview modes',
    iconName: 'Globe',
    shortcut: 'Alt+5'
  },
  {
    id: 'css-playground',
    name: 'CSS Playground',
    category: 'Playgrounds',
    description: 'Interactive CSS testing suite with flexbox, grid, glassmorphism, and animation presets',
    iconName: 'Palette',
    shortcut: 'Alt+6'
  },
  {
    id: 'js-playground',
    name: 'JS Playground',
    category: 'Playgrounds',
    description: 'Sandboxed JavaScript runner with captured console output and execution telemetry',
    iconName: 'Terminal',
    shortcut: 'Alt+7'
  },
  {
    id: 'text-tools',
    name: 'Text Toolkit',
    category: 'Utilities',
    description: 'Batch text operations: casing, whitespace cleanup, deduplication, line sorting & find-replace',
    iconName: 'Type',
    shortcut: 'Alt+8'
  },
  {
    id: 'base64',
    name: 'Base64 Studio',
    category: 'Utilities',
    description: 'Bidirectional UTF-8 text encoder/decoder and file-to-DataURI generator',
    iconName: 'Binary',
    shortcut: 'Alt+9'
  },
  {
    id: 'color-studio',
    name: 'Color Studio',
    category: 'Utilities',
    description: 'HEX/RGB/HSL conversion, WCAG contrast analyzer, harmonic palette builder',
    iconName: 'Pipette'
  },
  {
    id: 'regex',
    name: 'Regex Tester',
    category: 'Utilities',
    description: 'Live regular expression tester with capture group inspection and pattern library',
    iconName: 'Regex'
  },
  {
    id: 'diff',
    name: 'Diff Checker',
    category: 'Utilities',
    description: 'Side-by-side & unified text comparison highlighting additions, deletions and modifications',
    iconName: 'GitCompare'
  },
  {
    id: 'notes',
    name: 'Dev Notes',
    category: 'Management',
    description: 'Fast programming notebooks with markdown rendering, categories, and pinning',
    iconName: 'BookOpen'
  },
  {
    id: 'tasks',
    name: 'Task Manager',
    category: 'Management',
    description: 'Developer task board with Kanban workflow, project filters, and priority queues',
    iconName: 'CheckSquare'
  },
  {
    id: 'settings',
    name: 'Settings & Backup',
    category: 'Workspace',
    description: 'Application appearance, full JSON data export/import, and shortcut reference',
    iconName: 'Settings'
  }
];

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  favorites: ['code-vault', 'json-tools', 'regex', 'js-playground'],
  recentTools: ['code-vault', 'json-tools', 'markdown'],
  editorFontSize: 14,
  sidebarCollapsed: false
};

export const INITIAL_SNIPPETS: CodeSnippet[] = [
  {
    id: 'snip-1',
    title: 'TypeScript Debounce Utility',
    description: 'Standard debounce implementation preserving "this" and argument typing with trailing call execution.',
    language: 'typescript',
    category: 'Utilities',
    tags: ['typescript', 'utility', 'performance', 'debounce'],
    isFavorite: true,
    createdAt: '2026-10-25T10:00:00Z',
    updatedAt: '2026-10-25T10:00:00Z',
    code: `export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delayMs: number
): (...args: Parameters<T>) => void {
  let timerId: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args: Parameters<T>) {
    if (timerId !== null) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      fn.apply(this, args);
      timerId = null;
    }, delayMs);
  };
}`
  },
  {
    id: 'snip-2',
    title: 'Exponential Backoff Fetch with Retry',
    description: 'Resilient HTTP client wrapper implementing exponential delay with jitter for transient 5xx failures.',
    language: 'typescript',
    category: 'Backend',
    tags: ['fetch', 'async', 'retry', 'network'],
    isFavorite: true,
    createdAt: '2026-10-26T14:30:00Z',
    updatedAt: '2026-10-26T14:30:00Z',
    code: `async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 3,
  backoffMs = 300
): Promise<Response> {
  try {
    const res = await fetch(url, options);
    if (!res.ok && retries > 0 && res.status >= 500) {
      throw new Error(\`Server error: \${res.status}\`);
    }
    return res;
  } catch (err) {
    if (retries <= 0) throw err;
    const jitter = Math.random() * 100;
    await new Promise((r) => setTimeout(r, backoffMs + jitter));
    return fetchWithRetry(url, options, retries - 1, backoffMs * 2);
  }
}`
  },
  {
    id: 'snip-3',
    title: 'Python Binary Search with Bisect Logic',
    description: 'Fast recursive binary search returning the index of target in a sorted list or -1 if absent.',
    language: 'python',
    category: 'Algorithms',
    tags: ['python', 'algorithms', 'binary-search'],
    isFavorite: false,
    createdAt: '2026-10-27T08:15:00Z',
    updatedAt: '2026-10-27T08:15:00Z',
    code: `def binary_search(arr: list[int], target: int) -> int:
    low, high = 0, len(arr) - 1

    while low <= high:
        mid = (low + high) // 2
        val = arr[mid]
        if val == target:
            return mid
        elif val < target:
            low = mid + 1
        else:
            high = mid - 1

    return -1

# Example usage:
nums = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
print(f"Index of 23: {binary_search(nums, 23)}")`
  },
  {
    id: 'snip-4',
    title: 'SQL Upsert Pattern (PostgreSQL)',
    description: 'Idempotent insert into accounts with conflict resolution on unique email field.',
    language: 'sql',
    category: 'Database',
    tags: ['sql', 'postgres', 'upsert'],
    isFavorite: false,
    createdAt: '2026-10-28T11:45:00Z',
    updatedAt: '2026-10-28T11:45:00Z',
    code: `INSERT INTO user_profiles (id, email, display_name, updated_at)
VALUES ($1, $2, $3, NOW())
ON CONFLICT (email)
DO UPDATE SET
  display_name = EXCLUDED.display_name,
  updated_at = NOW()
RETURNING id, email, display_name, updated_at;`
  },
  {
    id: 'snip-5',
    title: 'Rust Safe Concurrency Worker Pool',
    description: 'Zero-cost thread pool channel message passing with Mutex and Arc.',
    language: 'rust',
    category: 'Backend',
    tags: ['rust', 'concurrency', 'threads', 'systems'],
    isFavorite: true,
    createdAt: '2026-10-29T09:00:00Z',
    updatedAt: '2026-10-29T09:00:00Z',
    code: `use std::sync::{mpsc, Arc, Mutex};
use std::thread;

pub struct ThreadPool {
    workers: Vec<Worker>,
    sender: Option<mpsc::Sender<Job>>,
}

type Job = Box<dyn FnOnce() + Send + 'static>;

struct Worker {
    id: usize,
    thread: Option<thread::JoinHandle<()>>,
}

impl ThreadPool {
    pub fn new(size: usize) -> ThreadPool {
        assert!(size > 0);
        let (sender, receiver) = mpsc::channel();
        let receiver = Arc::new(Mutex::new(receiver));
        let mut workers = Vec::with_capacity(size);

        for id in 0..size {
            workers.push(Worker::new(id, Arc::clone(&receiver)));
        }
        ThreadPool { workers, sender: Some(sender) }
    }
}`
  },
  {
    id: 'snip-6',
    title: 'Go Goroutine Worker Fan-Out & Fan-In',
    description: 'Idiomatic Go concurrency pipeline with bounded worker pool and context cancellation.',
    language: 'go',
    category: 'Backend',
    tags: ['go', 'concurrency', 'goroutines', 'channels'],
    isFavorite: false,
    createdAt: '2026-10-29T14:00:00Z',
    updatedAt: '2026-10-29T14:00:00Z',
    code: `package main

import (
	"context"
	"fmt"
	"sync"
	"time"
)

func worker(ctx context.Context, id int, jobs <-chan int, results chan<- string, wg *sync.WaitGroup) {
	defer wg.Done()
	for {
		select {
		case <-ctx.Done():
			return
		case j, ok := <-jobs:
			if !ok {
				return
			}
			time.Sleep(20 * time.Millisecond)
			results <- fmt.Sprintf("worker %d processed job %d", id, j)
		}
	}
}`
  }
];

export const INITIAL_NOTES: DevNote[] = [
  {
    id: 'note-1',
    title: 'Idempotency in Distributed Systems',
    content: `# Idempotency Keys in Distributed APIs

When designing POST operations that charge cards, submit orders, or mutate external states:

### Core Requirements
1. **Client-Generated Key**: UUID v4 header \`Idempotency-Key: <uuid>\`.
2. **Atomic Lock**: Cache lock on key with TTL (e.g. 120 seconds) while processing.
3. **Cached Response Payload**: Store the finalized HTTP status + response body for 24-48 hours.
4. **Concurrent Re-entrant**: If another request arrives while lock is active, return \`409 Conflict\` or await completion.

\`\`\`http
POST /v1/payments
Idempotency-Key: 7b31ff5e-8551-4e78-bc57-01efebdb8cf2
Content-Type: application/json

{
  "amount": 4900,
  "currency": "USD"
}
\`\`\`
`,
    category: 'Architecture',
    tags: ['api-design', 'distributed-systems', 'idempotency'],
    isPinned: true,
    isFavorite: true,
    createdAt: '2026-10-26T16:00:00Z',
    updatedAt: '2026-10-26T16:00:00Z'
  },
  {
    id: 'note-2',
    title: 'Git Cherry-Pick & Conflict Resolution',
    content: `# Git Precision Hotfix Workflow

To pull a single production patch into staging without merging development branches:

1. Locate commit hash in main:
   \`git log --oneline -n 5\`
2. Checkout target staging branch:
   \`git checkout staging && git pull\`
3. Apply specific commit:
   \`git cherry-pick <commit-hash>\`
4. If conflicts occur:
   \`git status\` -> resolve files -> \`git add <files>\` -> \`git cherry-pick --continue\`
5. Push to remote:
   \`git push origin staging\`
`,
    category: 'DevOps',
    tags: ['git', 'cli', 'workflow'],
    isPinned: false,
    isFavorite: false,
    createdAt: '2026-10-28T09:20:00Z',
    updatedAt: '2026-10-28T09:20:00Z'
  }
];

export const INITIAL_TASKS: DevTask[] = [
  {
    id: 'task-1',
    title: 'Refactor auth token refresh interceptor',
    description: 'Ensure queued 401 requests retry synchronously once the new JWT is obtained from refresh endpoint.',
    status: 'in-progress',
    priority: 'high',
    project: 'Auth Service',
    dueDate: '2026-11-05',
    createdAt: '2026-10-29T10:00:00Z',
    updatedAt: '2026-10-29T10:00:00Z'
  },
  {
    id: 'task-2',
    title: 'Add database index on created_at timestamp',
    description: 'Slow query log flagged audit_logs query scanning 450k rows without index.',
    status: 'todo',
    priority: 'urgent',
    project: 'Database',
    dueDate: '2026-11-02',
    createdAt: '2026-10-29T11:00:00Z',
    updatedAt: '2026-10-29T11:00:00Z'
  },
  {
    id: 'task-3',
    title: 'Configure OpenAPI 3.1 Swagger documentation',
    description: 'Generate typesafe schemas directly from Zod models in API router.',
    status: 'review',
    priority: 'medium',
    project: 'API Docs',
    dueDate: '2026-11-10',
    createdAt: '2026-10-27T15:00:00Z',
    updatedAt: '2026-10-30T08:00:00Z'
  },
  {
    id: 'task-4',
    title: 'Migrate legacy CSS classes to Tailwind design tokens',
    description: 'Clean up inline styles across client reporting widgets.',
    status: 'done',
    priority: 'low',
    project: 'Frontend UI',
    createdAt: '2026-10-24T12:00:00Z',
    updatedAt: '2026-10-28T17:00:00Z'
  }
];

export const INITIAL_PALETTES: ColorPalette[] = [
  {
    id: 'pal-1',
    name: 'Cyberpunk Neon Matrix',
    colors: ['#0f172a', '#6366f1', '#06b6d4', '#10b981', '#f59e0b'],
    createdAt: '2026-10-25T12:00:00Z'
  },
  {
    id: 'pal-2',
    name: 'Obsidian Slate IDE',
    colors: ['#090d16', '#161f30', '#3b82f6', '#94a3b8', '#f8fafc'],
    createdAt: '2026-10-26T15:00:00Z'
  }
];
