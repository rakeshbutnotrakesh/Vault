export interface LanguageMeta {
  id: string;
  name: string;
  extension: string;
  category:
    | 'systems'
    | 'web'
    | 'jvm'
    | 'mobile'
    | 'scripting'
    | 'functional'
    | 'science'
    | 'database'
    | 'config'
    | 'web3'
    | 'hardware'
    | 'legacy';
  categoryLabel: string;
  color: string;
  paradigm: string;
  year: number;
  runtimeOrCompiler: string;
  packageManager: string;
  description: string;
  commonUses: string[];
  boilerplate: string;
}

export const WORLD_LANGUAGES: LanguageMeta[] = [
  // --- SYSTEMS & LOW-LEVEL ---
  {
    id: 'rust',
    name: 'Rust',
    extension: 'rs',
    category: 'systems',
    categoryLabel: 'Systems & Performance',
    color: '#dea584',
    paradigm: 'Compiled, Memory-Safe, Multi-Paradigm',
    year: 2010,
    runtimeOrCompiler: 'rustc / LLVM',
    packageManager: 'cargo',
    description: 'Blazingly fast and memory-efficient with zero runtime overhead or garbage collector.',
    commonUses: ['High-Performance Systems', 'WebAssembly', 'Operating Systems', 'Cryptographic Infrastructure'],
    boilerplate: `// Rust: Fast, memory-safe systems programming
use std::collections::HashMap;

#[derive(Debug, Clone)]
pub struct WorkerNode {
    pub id: String,
    pub active: bool,
    pub load: f64,
}

impl WorkerNode {
    pub fn new(id: &str) -> Self {
        Self {
            id: id.to_string(),
            active: true,
            load: 0.0,
        }
    }

    pub fn execute_job(&mut self, cost: f64) -> Result<f64, &'static str> {
        if !self.active {
            return Err("Worker node offline");
        }
        self.load += cost;
        Ok(self.load)
    }
}

fn main() {
    let mut node = WorkerNode::new("node-alpha-1");
    match node.execute_job(12.5) {
        Ok(load) => println!("Node {} load: {:.2}", node.id, load),
        Err(err) => eprintln!("Execution error: {}", err),
    }
}
`
  },
  {
    id: 'go',
    name: 'Go (Golang)',
    extension: 'go',
    category: 'systems',
    categoryLabel: 'Systems & Cloud',
    color: '#00add8',
    paradigm: 'Compiled, Concurrent, Statically Typed',
    year: 2009,
    runtimeOrCompiler: 'gc (Go compiler)',
    packageManager: 'go modules',
    description: 'Minimalist systems language with first-class concurrency (goroutines and channels).',
    commonUses: ['Cloud-Native Microservices', 'Kubernetes / Docker ecosystem', 'Networking & Distributed Tools'],
    boilerplate: `// Go: Concurrent, idiomatic microservices
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"sync"
	"time"
)

type ServiceHealth struct {
	ServiceName string    \`json:"service_name"\`
	Status      string    \`json:"status"\`
	LatencyMs   int64     \`json:"latency_ms"\`
	Timestamp   time.Time \`json:"timestamp"\`
}

func probeService(ctx context.Context, name string, wg *sync.WaitGroup, ch chan<- ServiceHealth) {
	defer wg.Done()
	start := time.Now()
	// Simulated probe
	select {
	case <-time.After(50 * time.Millisecond):
		ch <- ServiceHealth{
			ServiceName: name,
			Status:      "UP",
			LatencyMs:   time.Since(start).Milliseconds(),
			Timestamp:   time.Now().UTC(),
		}
	case <-ctx.Done():
		ch <- ServiceHealth{ServiceName: name, Status: "TIMEOUT"}
	}
}

func main() {
	var wg sync.WaitGroup
	ch := make(chan ServiceHealth, 3)
	ctx, cancel := context.WithTimeout(context.Background(), 200*time.Millisecond)
	defer cancel()

	services := []string{"auth-service", "billing-core", "search-indexer"}
	for _, s := range services {
		wg.Add(1)
		go probeService(ctx, s, &wg, ch)
	}

	wg.Wait()
	close(ch)

	for h := range ch {
		data, _ := json.Marshal(h)
		fmt.Println(string(data))
	}
}
`
  },
  {
    id: 'c',
    name: 'C',
    extension: 'c',
    category: 'systems',
    categoryLabel: 'Systems & Embedded',
    color: '#555555',
    paradigm: 'Imperative, Procedural, Low-Level',
    year: 1972,
    runtimeOrCompiler: 'GCC / Clang / MSVC',
    packageManager: 'Conan / vcpkg / Make',
    description: 'The foundation of modern computing, operating systems, and high-performance kernels.',
    commonUses: ['Operating System Kernels', 'Embedded Systems', 'Compilers & Virtual Machines', 'Device Drivers'],
    boilerplate: `/* Standard C: Systems level memory management & pointers */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char id[32];
    double memory_mb;
    int priority;
} ProcessControlBlock;

ProcessControlBlock* create_process(const char* id, double mem, int priority) {
    ProcessControlBlock* pcb = (ProcessControlBlock*)malloc(sizeof(ProcessControlBlock));
    if (!pcb) return NULL;
    
    strncpy(pcb->id, id, sizeof(pcb->id) - 1);
    pcb->id[sizeof(pcb->id) - 1] = '\\0';
    pcb->memory_mb = mem;
    pcb->priority = priority;
    return pcb;
}

int main(void) {
    ProcessControlBlock* proc = create_process("init_daemon_0", 128.5, 1);
    if (!proc) {
        fprintf(stderr, "Allocation failure\\n");
        return 1;
    }

    printf("Spawned Process: %s | RAM: %.1f MB | Priority: %d\\n",
           proc->id, proc->memory_mb, proc->priority);

    free(proc);
    return 0;
}
`
  },
  {
    id: 'cpp',
    name: 'C++',
    extension: 'cpp',
    category: 'systems',
    categoryLabel: 'Systems & High-Performance',
    color: '#f34b7d',
    paradigm: 'Multi-paradigm, Object-Oriented, Generic, Functional',
    year: 1985,
    runtimeOrCompiler: 'GCC / Clang / MSVC (C++20/C++23)',
    packageManager: 'vcpkg / Conan / CMake',
    description: 'High-performance computing with zero-cost abstractions, RAII, and template metaprogramming.',
    commonUses: ['Game Engines (Unreal)', 'HFT & Trading Engines', 'Browser Rendering Engines', 'Robotics & AI'],
    boilerplate: `// Modern C++20: RAII, Smart Pointers, and Concept Constraints
#include <iostream>
#include <vector>
#include <memory>
#include <string_view>
#include <algorithm>

template <typename T>
concept Numeric = std::is_arithmetic_v<T>;

template <Numeric T>
class RollingWindow {
private:
    std::vector<T> samples;
public:
    void add(T val) { samples.push_back(val); }
    [[nodiscard]] double average() const {
        if (samples.empty()) return 0.0;
        double sum = 0.0;
        for (const auto& s : samples) sum += s;
        return sum / samples.size();
    }
};

int main() {
    auto window = std::make_unique<RollingWindow<double>>();
    window->add(10.2);
    window->add(15.4);
    window->add(22.8);

    std::cout << "Rolling Average: " << window->average() << std::endl;
    return 0;
}
`
  },
  {
    id: 'zig',
    name: 'Zig',
    extension: 'zig',
    category: 'systems',
    categoryLabel: 'Modern Systems',
    color: '#ec915c',
    paradigm: 'General-purpose, Imperative, Compile-time execution',
    year: 2016,
    runtimeOrCompiler: 'zig compiler / LLVM',
    packageManager: 'Zig package manager',
    description: 'Modern alternative to C with no hidden control flow, comptime execution, and explicit allocators.',
    commonUses: ['Systems Programming', 'Cross-compiling C/C++', 'Game Development', 'Embedded Hardware'],
    boilerplate: `// Zig: Explicit memory allocation, comptime, and zero hidden allocations
const std::debug = @import("std").debug;
const Allocator = @import("std").mem.Allocator;

pub const Packet = struct {
    id: u32,
    payload_size: usize,

    pub fn init(id: u32, size: usize) Packet {
        return Packet{
            .id = id,
            .payload_size = size,
        };
    }
};

pub fn main() !void {
    const packet = Packet.init(1042, 512);
    std.debug.print("Packet ID: {d}, Size: {d} bytes\\n", .{ packet.id, packet.payload_size });
}
`
  },
  {
    id: 'csharp',
    name: 'C# (.NET)',
    extension: 'cs',
    category: 'systems',
    categoryLabel: 'Enterprise & Systems',
    color: '#178600',
    paradigm: 'Object-Oriented, Functional, Statically Typed',
    year: 2000,
    runtimeOrCompiler: '.NET Core / Roslyn JIT',
    packageManager: 'NuGet / dotnet CLI',
    description: 'Modern, cross-platform language for scalable enterprise backends, cloud, and Unity game development.',
    commonUses: ['ASP.NET Core Web APIs', 'Enterprise Microservices', 'Unity 3D Engine', 'Desktop Applications'],
    boilerplate: `// Modern C# 12: Records, Pattern Matching, and LINQ
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;

public record TaskItem(Guid Id, string Title, bool Completed, int Priority);

public class TaskRepository
{
    private readonly List<TaskItem> _tasks = new();

    public void Add(TaskItem task) => _tasks.Add(task);

    public IEnumerable<TaskItem> GetUrgentPending() =>
        _tasks.Where(t => !t.Completed && t.Priority >= 4)
              .OrderByDescending(t => t.Priority);
}

class Program
{
    static void Main()
    {
        var repo = new TaskRepository();
        repo.Add(new TaskItem(Guid.NewGuid(), "Rotate TLS certs", false, 5));
        repo.Add(new TaskItem(Guid.NewGuid(), "Update docs", true, 2));

        foreach (var task in repo.GetUrgentPending())
        {
            Console.WriteLine($"[URGENT] {task.Title} (Priority: {task.Priority})");
        }
    }
}
`
  },
  {
    id: 'nim',
    name: 'Nim',
    extension: 'nim',
    category: 'systems',
    categoryLabel: 'Compiled & Expressive',
    color: '#ffc200',
    paradigm: 'Imperative, Functional, Metaprogramming',
    year: 2008,
    runtimeOrCompiler: 'Nim compiler (transpiles to C/C++/JS)',
    packageManager: 'nimble',
    description: 'Python-like syntax with C-speed performance and powerful hygienic macro system.',
    commonUses: ['High-performance CLI tools', 'Scientific computing', 'Game development', 'Network utilities'],
    boilerplate: `# Nim: Python-like expressiveness with C speed
import strformat, sequtils, algorithm

type
  ServerNode = object
    hostname: string
    port: int
    active: bool

proc initNode(host: string, port: int): ServerNode =
  result.hostname = host
  result.port = port
  result.active = true

proc describe(node: ServerNode): string =
  fmt"Node {node.hostname}:{node.port} (Active: {node.active})"

let cluster = @[
  initNode("primary.internal", 8080),
  initNode("replica-1.internal", 8081)
]

for node in cluster:
  echo node.describe()
`
  },

  // --- WEB & APPS ---
  {
    id: 'typescript',
    name: 'TypeScript',
    extension: 'ts',
    category: 'web',
    categoryLabel: 'Web & Fullstack',
    color: '#3178c6',
    paradigm: 'Statically Typed, Multi-Paradigm, Functional, OOP',
    year: 2012,
    runtimeOrCompiler: 'tsc / Node / Bun / Deno',
    packageManager: 'pnpm / npm / yarn',
    description: 'Typed superset of JavaScript that scales from browser frontends to mission-critical backend services.',
    commonUses: ['Modern React / Next.js Frontends', 'Node/Bun Backend APIs', 'Fullstack Web Applications'],
    boilerplate: `// TypeScript: Typesafe async API client with generic contracts
interface ApiResponse<T> {
  data: T;
  status: number;
  timestamp: string;
}

interface UserProfile {
  id: string;
  email: string;
  roles: Array<'admin' | 'developer' | 'viewer'>;
}

async function fetchUserProfile(userId: string): Promise<UserProfile> {
  // Simulated typed API invocation
  const mockUser: UserProfile = {
    id: userId,
    email: "dev@vault.internal",
    roles: ["developer", "admin"],
  };
  return Promise.resolve(mockUser);
}

// Example execution
fetchUserProfile("usr_9912").then((user) => {
  console.log(\`User: \${user.email} (Roles: \${user.roles.join(', ')})\`);
});
`
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    extension: 'js',
    category: 'web',
    categoryLabel: 'Web & Runtime',
    color: '#f7df1e',
    paradigm: 'Dynamic, Prototype-based, Multi-Paradigm',
    year: 1995,
    runtimeOrCompiler: 'V8 / SpiderMonkey / JavaScriptCore / Node.js',
    packageManager: 'npm / pnpm / yarn',
    description: 'The native language of the World Wide Web and ubiquitous cross-platform runtime.',
    commonUses: ['Browser interactivity', 'Serverless Functions', 'Desktop (Electron)', 'Mobile (React Native)'],
    boilerplate: `// JavaScript ES2024: Modern pipelines and async iteration
const metrics = [
  { region: 'us-east', latency: 42, errorRate: 0.002 },
  { region: 'eu-west', latency: 88, errorRate: 0.015 },
  { region: 'ap-south', latency: 130, errorRate: 0.008 }
];

// Pipeline transformations
const highPerformanceRegions = metrics
  .filter(m => m.latency < 100 && m.errorRate < 0.01)
  .map(m => ({ ...m, status: 'OPTIMAL' }));

console.log("Optimal Regions:", highPerformanceRegions);
`
  },
  {
    id: 'php',
    name: 'PHP',
    extension: 'php',
    category: 'web',
    categoryLabel: 'Web & Server',
    color: '#4f5d95',
    paradigm: 'Server-Side, Object-Oriented, Procedural',
    year: 1995,
    runtimeOrCompiler: 'Zend Engine / PHP 8.3 JIT',
    packageManager: 'Composer',
    description: 'Powers over 70% of web servers, powering Laravel, Symfony, and global e-commerce.',
    commonUses: ['Laravel APIs', 'CMS & E-Commerce', 'Server-rendered Web Applications'],
    boilerplate: `<?php
declare(strict_types=1);

namespace App\\Services;

readonly class PaymentProcessor {
    public function __construct(
        private string $merchantId,
        private string $currency = 'USD'
    ) {}

    public function process(float $amount, string $customerId): array {
        return [
            'status' => 'settled',
            'transaction_id' => bin2hex(random_bytes(8)),
            'amount' => $amount,
            'currency' => $this->currency,
            'customer' => $customerId,
            'processed_at' => (new \\DateTimeImmutable())->format(\\DateTimeInterface::ATOM),
        ];
    }
}

$processor = new PaymentProcessor('merch_live_8840');
$receipt = $processor->process(149.99, 'cust_9921');
echo json_encode($receipt, JSON_PRETTY_PRINT);
`
  },
  {
    id: 'html',
    name: 'HTML5',
    extension: 'html',
    category: 'web',
    categoryLabel: 'Web Markup',
    color: '#e34c26',
    paradigm: 'Declarative Markup',
    year: 1993,
    runtimeOrCompiler: 'Browser DOM Engine',
    packageManager: 'N/A',
    description: 'The standard markup language for documents designed to be displayed in a web browser.',
    commonUses: ['Web Pages', 'Email Templates', 'Accessibility Trees', 'Progressive Web Apps'],
    boilerplate: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Workspace</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 2rem; background: #0f172a; color: #f8fafc; }
    .card { background: #1e293b; padding: 1.5rem; border-radius: 0.75rem; border: 1px solid #334155; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Mission Control</h1>
    <p>Operational status: Normal</p>
  </div>
</body>
</html>
`
  },
  {
    id: 'css',
    name: 'CSS3',
    extension: 'css',
    category: 'web',
    categoryLabel: 'Web Styling',
    color: '#563d7c',
    paradigm: 'Declarative Style Sheet',
    year: 1996,
    runtimeOrCompiler: 'Browser Layout Engine',
    packageManager: 'N/A',
    description: 'Defines presentation, responsive layout, animations, and design tokens for the web.',
    commonUses: ['Responsive Design', 'Design Systems', 'Keyframe Animations', 'CSS Grid / Flexbox'],
    boilerplate: `/* Modern CSS: Custom Properties, Container Queries, and Grid */
:root {
  --primary: #6366f1;
  --bg-surface: #181a20;
  --text-main: #f0f2f5;
  --radius-lg: 1rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.surface-card {
  background: var(--bg-surface);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.surface-card:hover {
  transform: translateY(-2px);
}
`
  },

  // --- SCRIPTING & AUTOMATION ---
  {
    id: 'python',
    name: 'Python',
    extension: 'py',
    category: 'scripting',
    categoryLabel: 'Scripting & AI',
    color: '#3572A5',
    paradigm: 'Object-Oriented, Imperative, Functional, Interpreted',
    year: 1991,
    runtimeOrCompiler: 'CPython / PyPy / JIT',
    packageManager: 'pip / poetry / uv',
    description: 'The global standard for artificial intelligence, machine learning, data engineering, and automation.',
    commonUses: ['Machine Learning (PyTorch, TensorFlow)', 'Data Analysis (Pandas)', 'FastAPI / Django Backends', 'Automation Scripts'],
    boilerplate: `# Python 3.12: Modern dataclasses, type hints, and asynchronous IO
import asyncio
from dataclasses import dataclass
from datetime import datetime, timezone

@dataclass(frozen=True)
class TelemetryPacket:
    device_id: str
    temperature_c: float
    voltage: float
    timestamp: datetime = datetime.now(timezone.utc)

    @property
    def is_nominal(self) -> bool:
        return 18.0 <= self.temperature_c <= 75.0 and self.voltage >= 3.2

async def monitor_sensors(device_id: str):
    packet = TelemetryPacket(device_id=device_id, temperature_c=42.5, voltage=3.31)
    print(f"[{packet.device_id}] Nominal: {packet.is_nominal} (Temp: {packet.temperature_c}°C)")

if __name__ == "__main__":
    asyncio.run(monitor_sensors("sensor-edge-09"))
`
  },
  {
    id: 'ruby',
    name: 'Ruby',
    extension: 'rb',
    category: 'scripting',
    categoryLabel: 'Scripting & Web',
    color: '#701516',
    paradigm: 'Pure Object-Oriented, Expressive, Dynamic',
    year: 1995,
    runtimeOrCompiler: 'YARV / Ruby 3.3',
    packageManager: 'RubyGems / Bundler',
    description: 'Designed for programmer happiness, powers Ruby on Rails, Shopify, and GitHub backend components.',
    commonUses: ['Ruby on Rails Web Apps', 'DevOps automation', 'Developer tooling'],
    boilerplate: `# Ruby: Expressive, elegant object-oriented code
class AuditPipeline
  attr_reader :events

  def initialize
    @events = []
  end

  def record(action, actor:)
    @events << {
      action: action,
      actor: actor,
      timestamp: Time.now.utc
    }
  end

  def summarize
    @events.group_by { |e| e[:actor] }.transform_values(&:count)
  end
end

audit = AuditPipeline.new
audit.record("deploy_production", actor: "lead-dev")
audit.record("rotate_secrets", actor: "lead-dev")
puts "Summary: #{audit.summarize}"
`
  },
  {
    id: 'bash',
    name: 'Bash / Shell',
    extension: 'sh',
    category: 'scripting',
    categoryLabel: 'Shell & DevOps',
    color: '#89e051',
    paradigm: 'Command Language, Scripting',
    year: 1989,
    runtimeOrCompiler: 'GNU Bash / POSIX sh',
    packageManager: 'apt / brew / pacman',
    description: 'The ubiquitous command interpreter and glue code for Unix/Linux systems and CI/CD pipelines.',
    commonUses: ['CI/CD Pipelines (GitHub Actions)', 'System Administration', 'Docker Container Entrypoints', 'Deployment Automations'],
    boilerplate: `#!/usr/bin/env bash
# Production Bash: Strict error handling & idempotent execution
set -euo pipefail
IFS=$'\\n\\t'

readonly LOG_FILE="/tmp/service_health.log"

log() {
  local -r level="$1"
  local -r message="$2"
  printf '[%s] [%s] %s\\n' "$(date -u +'%Y-%m-%dT%H:%M:%SZ')" "$level" "$message" | tee -a "$LOG_FILE"
}

check_dependencies() {
  local -r deps=("curl" "jq" "git")
  for cmd in "\${deps[@]}"; do
    if ! command -v "$cmd" >/dev/null 2>&1; then
      log "ERROR" "Missing required command: $cmd"
      exit 1
    fi
  done
  log "INFO" "All system dependencies verified successfully."
}

check_dependencies
`
  },
  {
    id: 'powershell',
    name: 'PowerShell',
    extension: 'ps1',
    category: 'scripting',
    categoryLabel: 'Shell & Automation',
    color: '#012456',
    paradigm: 'Object-Oriented Shell, Scripting',
    year: 2006,
    runtimeOrCompiler: 'PowerShell Core 7+ / .NET',
    packageManager: 'PSGallery',
    description: 'Object-oriented shell and scripting language built for cloud, Windows, and Linux automation.',
    commonUses: ['Azure Automation', 'Windows Server Administration', 'Cross-Platform DevOps pipelines'],
    boilerplate: `# PowerShell Core: Object pipeline automation
[CmdletBinding()]
param(
    [Parameter(Mandatory=$false)]
    [string]$Environment = "Production"
)

$Services = @(
    [PSCustomObject]@{ Name = "Gateway"; Port = 443; Status = "Healthy" }
    [PSCustomObject]@{ Name = "Database"; Port = 5432; Status = "Healthy" }
)

Write-Host "Verifying $Environment Infrastructure..." -ForegroundColor Cyan

$Services | ForEach-Object {
    [PSCustomObject]@{
        Service   = $_.Name
        Address   = "127.0.0.1:$($_.Port)"
        Status    = $_.Status
        Timestamp = (Get-Date).ToUniversalTime()
    }
} | Format-Table -AutoSize
`
  },
  {
    id: 'lua',
    name: 'Lua',
    extension: 'lua',
    category: 'scripting',
    categoryLabel: 'Embedded Scripting',
    color: '#000080',
    paradigm: 'Lightweight, Multi-Paradigm, Scripting',
    year: 1993,
    runtimeOrCompiler: 'LuaJIT / Standard Lua 5.4',
    packageManager: 'LuaRocks',
    description: 'Fast, compact, embeddable scripting language ubiquitous in game development, Redis, and Neovim.',
    commonUses: ['Redis In-Memory Scripts', 'Neovim Configuration', 'Game Scripting (Roblox, World of Warcraft, Defold)'],
    boilerplate: `-- Lua: Lightweight table-driven modular script
local M = {}

function M.filter_records(records, threshold)
    local qualified = {}
    for _, item in ipairs(records) do
        if item.score >= threshold then
            table.insert(qualified, item)
        end
    end
    return qualified
end

local data = {
    { name = "Node-A", score = 95 },
    { name = "Node-B", score = 62 },
    { name = "Node-C", score = 88 }
}

local top_nodes = M.filter_records(data, 80)
for i, n in ipairs(top_nodes) do
    print(string.format("[%d] %s (Score: %d)", i, n.name, n.score))
end

return M
`
  },
  {
    id: 'perl',
    name: 'Perl',
    extension: 'pl',
    category: 'scripting',
    categoryLabel: 'Scripting & Text',
    color: '#0298c3',
    paradigm: 'Multi-Paradigm, Scripting',
    year: 1987,
    runtimeOrCompiler: 'Perl 5 runtime',
    packageManager: 'CPAN',
    description: 'The legendary text processing, regex, and Unix system administration powerhouse.',
    commonUses: ['Bioinformatics & Genomics', 'High-volume Regex & Text Extraction', 'Legacy Enterprise Sysadmin'],
    boilerplate: `#!/usr/bin/env perl
use strict;
use warnings;

my %access_log = (
    "/api/v1/health" => 1420,
    "/api/v1/auth"   => 890,
    "/api/v1/data"   => 5210,
);

print "API Endpoint Traffic:\\n";
for my $route (sort { $access_log{$b} <=> $access_log{$a} } keys %access_log) {
    printf "  %-18s => %d hits\\n", $route, $access_log{$route};
}
`
  },

  // --- JVM & ENTERPRISE ---
  {
    id: 'java',
    name: 'Java',
    extension: 'java',
    category: 'jvm',
    categoryLabel: 'JVM & Enterprise',
    color: '#b07219',
    paradigm: 'Object-Oriented, Class-Based, Concurrent',
    year: 1995,
    runtimeOrCompiler: 'OpenJDK / HotSpot / GraalVM (Java 21 LTS)',
    packageManager: 'Maven / Gradle',
    description: 'Enterprise workhorse powering banking, Spring Boot microservices, Kafka, and big data.',
    commonUses: ['Spring Boot Microservices', 'Apache Kafka / Flink Stream Processing', 'Android Enterprise Systems'],
    boilerplate: `// Modern Java 21: Records, Pattern Matching, and Virtual Threads
package com.vault.core;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class CoreApplication {

    public record AuditLog(UUID id, String action, String principal, Instant timestamp) {
        public AuditLog {
            if (action == null || action.isBlank()) {
                throw new IllegalArgumentException("Action cannot be blank");
            }
        }
    }

    public static void main(String[] args) {
        AuditLog entry = new AuditLog(
            UUID.randomUUID(),
            "DATABASE_SCHEMA_MIGRATION",
            "admin@vault.internal",
            Instant.now()
        );

        System.out.printf("Audit [%s]: %s by %s at %s%n",
            entry.id(), entry.action(), entry.principal(), entry.timestamp());
    }
}
`
  },
  {
    id: 'kotlin',
    name: 'Kotlin',
    extension: 'kt',
    category: 'jvm',
    categoryLabel: 'Modern JVM & Android',
    color: '#A97BFF',
    paradigm: 'Object-Oriented, Functional, Statically Typed',
    year: 2011,
    runtimeOrCompiler: 'Kotlin Compiler / JVM / Native / JS',
    packageManager: 'Gradle / Maven',
    description: 'Google’s preferred language for Android, and an elegant, null-safe alternative to Java on the server.',
    commonUses: ['Android App Development (Jetpack Compose)', 'Ktor / Spring Boot Server Apps', 'Multiplatform (KMP)'],
    boilerplate: `// Kotlin: Null safety, Coroutines, and Data Classes
package com.vault.service

import kotlinx.coroutines.*
import java.time.Instant

data class MetricRecord(
    val id: String,
    val value: Double,
    val tags: Map<String, String> = emptyMap(),
    val timestamp: Instant = Instant.now()
)

fun main() = runBlocking {
    val records = listOf(
        MetricRecord("cpu_utilization", 44.2, mapOf("host" to "srv-01")),
        MetricRecord("mem_utilization", 78.5, mapOf("host" to "srv-01"))
    )

    records.filter { it.value > 50.0 }.forEach {
        println("⚠️ Alert: \${it.id} exceeded limit: \${it.value}% on \${it.tags["host"]}")
    }
}
`
  },
  {
    id: 'scala',
    name: 'Scala',
    extension: 'scala',
    category: 'jvm',
    categoryLabel: 'Functional JVM',
    color: '#c22d40',
    paradigm: 'Functional, Object-Oriented, Statically Typed',
    year: 2004,
    runtimeOrCompiler: 'Scala 3 / JVM',
    packageManager: 'sbt / Mill',
    description: 'Blends functional programming with object orientation; powers Apache Spark and Akka/Pekko.',
    commonUses: ['Big Data (Apache Spark)', 'High-throughput Reactive Systems', 'Distributed Computing'],
    boilerplate: `// Scala 3: Functional pipelines and pattern matching
case class DataStream(id: String, throughputMb: Double, active: Boolean)

object StreamAnalyzer:
  def main(args: Array[String]): Unit =
    val streams = List(
      DataStream("telemetry-feed", 125.4, true),
      DataStream("billing-sync", 12.0, false),
      DataStream("video-mux", 850.2, true)
    )

    val activeThroughput = streams
      .filter(_.active)
      .map(_.throughputMb)
      .sum

    println(s"Total Active Ingestion: $activeThroughput MB/s")
`
  },
  {
    id: 'clojure',
    name: 'Clojure',
    extension: 'clj',
    category: 'jvm',
    categoryLabel: 'Lisp on JVM',
    color: '#db5855',
    paradigm: 'Functional, Lisp, Dynamic, Immutable',
    year: 2007,
    runtimeOrCompiler: 'Clojure on JVM / ClojureScript',
    packageManager: 'Leiningen / deps.edn',
    description: 'Dynamic, functional Lisp dialect with persistent immutable data structures and software transactional memory.',
    commonUses: ['Financial Systems', 'Data Pipelines', 'Fullstack Web (ClojureScript)'],
    boilerplate: `;; Clojure: Immutable data transformations
(ns vault.core
  (:require [clojure.string :as str]))

(defn calculate-revenue [orders]
  (->> orders
       (filter :settled?)
       (map :amount)
       (reduce + 0.0)))

(def sample-orders
  [{:id "ord-1" :amount 120.50 :settled? true}
   {:id "ord-2" :amount 45.00  :settled? false}
   {:id "ord-3" :amount 890.00 :settled? true}])

(println "Total Revenue:" (calculate-revenue sample-orders))
`
  },

  // --- MOBILE & APPLE ---
  {
    id: 'swift',
    name: 'Swift',
    extension: 'swift',
    category: 'mobile',
    categoryLabel: 'Apple & Systems',
    color: '#F05138',
    paradigm: 'Multi-Paradigm, Protocol-Oriented, Functional, OOP',
    year: 2014,
    runtimeOrCompiler: 'Swift Compiler / LLVM',
    packageManager: 'Swift Package Manager (SPM)',
    description: 'Fast, modern, and safe language for iOS, iPadOS, macOS, watchOS, and server-side Swift.',
    commonUses: ['iOS / macOS App Development (SwiftUI)', 'Server-Side Swift (Vapor)', 'Apple Watch / Vision Pro'],
    boilerplate: `// Swift 5.9: Protocols, Codable, and Structured Concurrency
import Foundation

struct UserAccount: Codable, Identifiable {
    let id: UUID
    let username: String
    let email: String
    let isVerified: Bool
}

actor AccountStore {
    private var accounts: [UUID: UserAccount] = [:]

    func register(username: String, email: String) -> UserAccount {
        let account = UserAccount(id: UUID(), username: username, email: email, isVerified: false)
        accounts[account.id] = account
        return account
    }

    func count() -> Int {
        return accounts.count
    }
}

let store = AccountStore()
Task {
    let user = await store.register(username: "alex_dev", email: "alex@vault.internal")
    print("Registered: \\(user.username) with ID: \\(user.id)")
}
`
  },
  {
    id: 'dart',
    name: 'Dart',
    extension: 'dart',
    category: 'mobile',
    categoryLabel: 'Mobile & Multiplatform',
    color: '#00B4AB',
    paradigm: 'Object-Oriented, Client-Optimized, Statically Typed',
    year: 2011,
    runtimeOrCompiler: 'Dart VM / AOT / Web Compiler',
    packageManager: 'pub (pub.dev)',
    description: 'Google’s client-optimized language powering Flutter for multi-platform iOS, Android, web, and desktop.',
    commonUses: ['Flutter Multi-Platform Mobile Apps', 'Desktop & Web Applications', 'Dart Server APIs'],
    boilerplate: `// Dart: Null safety, records, and async streams
import 'dart:async';

class DeviceTelemetry {
  final String deviceId;
  final double batteryPct;
  final bool isCharging;

  const DeviceTelemetry({
    required this.deviceId,
    required this.batteryPct,
    required this.isCharging,
  });

  Map<String, dynamic> toJson() => {
    'deviceId': deviceId,
    'batteryPct': batteryPct,
    'isCharging': isCharging,
  };
}

void main() {
  final telemetry = DeviceTelemetry(
    deviceId: 'edge-gateway-10',
    batteryPct: 88.4,
    isCharging: true,
  );
  print('Telemetry payload: \${telemetry.toJson()}');
}
`
  },

  // --- FUNCTIONAL PROGRAMMING ---
  {
    id: 'haskell',
    name: 'Haskell',
    extension: 'hs',
    category: 'functional',
    categoryLabel: 'Pure Functional',
    color: '#5e5086',
    paradigm: 'Purely Functional, Lazy Evaluation, Static Typing',
    year: 1990,
    runtimeOrCompiler: 'GHC (Glasgow Haskell Compiler)',
    packageManager: 'Cabal / Stack',
    description: 'Purely functional programming with advanced category theory, monadic I/O, and mathematical rigor.',
    commonUses: ['Compilers & Formal Verification', 'Financial Systems', 'High-Integrity Cryptographic Tools'],
    boilerplate: `-- Haskell: Pure functions, pattern matching, and typeclasses
module Main where

data Transaction = Transaction
  { txId     :: String
  , amount   :: Double
  , isSettled :: Bool
  } deriving (Show, Eq)

calculateNet :: [Transaction] -> Double
calculateNet = sum . map amount . filter isSettled

main :: IO ()
main = do
  let ledger = [ Transaction "tx-01" 500.0 True
               , Transaction "tx-02" 150.0 False
               , Transaction "tx-03" 320.0 True
               ]
  putStrLn $ "Net Settled Balance: $" ++ show (calculateNet ledger)
`
  },
  {
    id: 'elixir',
    name: 'Elixir',
    extension: 'ex',
    category: 'functional',
    categoryLabel: 'Actor & Concurrent',
    color: '#6e4a7e',
    paradigm: 'Functional, Actor Model, Concurrent, Distributed',
    year: 2011,
    runtimeOrCompiler: 'BEAM (Erlang VM)',
    packageManager: 'Hex / Mix',
    description: 'Dynamic, functional language built on the battle-tested Erlang BEAM VM for fault-tolerant distributed web.',
    commonUses: ['Phoenix Framework Web Apps', 'High-concurrency Chat & Real-Time', 'IoT & Telemetry Ingestion'],
    boilerplate: `# Elixir: Pipe operator, pattern matching, and actor processes
defmodule Vault.MetricsPipeline do
  def process_batch(measurements, threshold) do
    measurements
    |> Enum.filter(&(&1.val >= threshold))
    |> Enum.map(&format_record/1)
  end

  defp format_record(%{tag: tag, val: val}) do
    "[#{String.upcase(tag)}] Alert Threshold Met: #{val} units"
  end
end

data = [
  %{tag: "cpu", val: 92},
  %{tag: "mem", val: 40},
  %{tag: "disk", val: 86}
]

Vault.MetricsPipeline.process_batch(data, 80)
|> Enum.each(&IO.puts/1)
`
  },
  {
    id: 'ocaml',
    name: 'OCaml',
    extension: 'ml',
    category: 'functional',
    categoryLabel: 'Functional & Systems',
    color: '#3be133',
    paradigm: 'Functional, Imperative, Object-Oriented',
    year: 1996,
    runtimeOrCompiler: 'OCaml Native Compiler (ocamlopt)',
    packageManager: 'OPAM / Dune',
    description: 'Expressive functional language known for rock-solid type inference, speed, and formal correctness.',
    commonUses: ['Financial Trading Engines (Jane Street)', 'Compiler Toolchains (Rust original)', 'Formal Proofs'],
    boilerplate: `(* OCaml: Algebraic data types and pattern matching *)
type status = Active | Suspended | Terminated

type employee = {
  id: int;
  name: string;
  status: status;
}

let is_active emp =
  match emp.status with
  | Active -> true
  | _ -> false

let () =
  let team = [
    { id = 101; name = "Jane"; status = Active };
    { id = 102; name = "Bob"; status = Suspended };
  ] in
  let active_count = List.filter is_active team |> List.length in
  Printf.printf "Active team members: %d\\n" active_count
`
  },

  // --- DATA SCIENCE & SCIENTIFIC ---
  {
    id: 'julia',
    name: 'Julia',
    extension: 'jl',
    category: 'science',
    categoryLabel: 'Scientific & Numerical',
    color: '#a270ba',
    paradigm: 'Multiple Dispatch, High-Performance Numerical',
    year: 2012,
    runtimeOrCompiler: 'Julia JIT (LLVM-backed)',
    packageManager: 'Pkg.jl',
    description: 'Solves the "two-language problem": Python-like ease with C-speed numerical computation.',
    commonUses: ['Scientific Computing & Physics Sim', 'Financial Econometrics', 'Machine Learning & Differential Equations'],
    boilerplate: `# Julia: High-performance vectorized numerical computation
using LinearAlgebra

function simulate_diffusion(steps::Int, grid_size::Int)
    grid = zeros(Float64, grid_size, grid_size)
    grid[div(grid_size, 2), div(grid_size, 2)] = 100.0  # Heat source

    for step in 1:steps
        # Vectorized Laplacian convolution step
        grid[2:end-1, 2:end-1] .+= 0.1 .* (
            grid[1:end-2, 2:end-1] .+ grid[3:end, 2:end-1] .+
            grid[2:end-1, 1:end-2] .+ grid[2:end-1, 3:end] .-
            4.0 .* grid[2:end-1, 2:end-1]
        )
    end
    return tr(grid)
end

trace_val = simulate_diffusion(50, 64)
println("Simulation completed. Grid Trace: $(round(trace_val, digits=4))")
`
  },
  {
    id: 'r',
    name: 'R',
    extension: 'r',
    category: 'science',
    categoryLabel: 'Statistics & Data Science',
    color: '#198CE7',
    paradigm: 'Functional, Statistical, Vector-Oriented',
    year: 1993,
    runtimeOrCompiler: 'R Interpreter',
    packageManager: 'CRAN',
    description: 'The premier environment for statistical computing, bioinformatics, regression analysis, and ggplot2 visuals.',
    commonUses: ['Biostatistics & Clinical Trials', 'Econometrics & Predictive Modeling', 'Publication-grade Visualizations'],
    boilerplate: `# R: Vectorized statistical calculation
data_points <- c(12.4, 15.8, 14.2, 19.1, 22.5, 18.3, 16.9)

stats_summary <- list(
  mean = mean(data_points),
  std_dev = sd(data_points),
  median = median(data_points),
  iqr = IQR(data_points)
)

cat("Statistical Summary:\\n")
for (name in names(stats_summary)) {
  cat(sprintf("  %-10s: %.2f\\n", name, stats_summary[[name]]))
}
`
  },

  // --- DATABASE & QUERY ---
  {
    id: 'sql',
    name: 'SQL (PostgreSQL / ANSI)',
    extension: 'sql',
    category: 'database',
    categoryLabel: 'Relational Database',
    color: '#e38c00',
    paradigm: 'Declarative Query Language',
    year: 1974,
    runtimeOrCompiler: 'PostgreSQL / MySQL / SQLite / Oracle',
    packageManager: 'N/A',
    description: 'The standard language for relational databases, analytical queries, and schema definition.',
    commonUses: ['Relational Data Modeling', 'Window Functions & Aggregations', 'Transactions & ACID Consistency'],
    boilerplate: `-- PostgreSQL: CTEs, Window Functions, and Constraints
WITH MonthlyRevenue AS (
  SELECT
    DATE_TRUNC('month', order_date) AS billing_month,
    customer_id,
    SUM(total_amount) AS revenue,
    COUNT(id) AS order_count
  FROM orders
  WHERE status = 'settled'
  GROUP BY 1, 2
)
SELECT
  billing_month,
  customer_id,
  revenue,
  DENSE_RANK() OVER (PARTITION BY billing_month ORDER BY revenue DESC) AS customer_rank
FROM MonthlyRevenue
ORDER BY billing_month DESC, customer_rank ASC
LIMIT 20;
`
  },
  {
    id: 'graphql',
    name: 'GraphQL',
    extension: 'graphql',
    category: 'database',
    categoryLabel: 'API & Query',
    color: '#e10098',
    paradigm: 'Declarative Data Query & Schema Language',
    year: 2015,
    runtimeOrCompiler: 'GraphQL Engine (Apollo, Yoga, Relay)',
    packageManager: 'N/A',
    description: 'Client-specified data fetching that eliminates over-fetching and under-fetching across microservices.',
    commonUses: ['Unified API Gateways', 'Federated Graph Architecture', 'Mobile Client Ingestion'],
    boilerplate: `# GraphQL Schema Definition & Query
type UserAccount {
  id: ID!
  email: String!
  displayName: String
  role: UserRole!
  repositories(limit: Int = 10): [Repository!]!
}

enum UserRole {
  ADMIN
  MAINTAINER
  CONTRIBUTOR
}

query FetchDashboardData($userId: ID!) {
  user(id: $userId) {
    id
    displayName
    repositories(limit: 5) {
      id
      name
      isPrivate
      starCount
    }
  }
}
`
  },

  // --- SMART CONTRACTS & WEB3 ---
  {
    id: 'solidity',
    name: 'Solidity',
    extension: 'sol',
    category: 'web3',
    categoryLabel: 'Smart Contracts & Web3',
    color: '#AA6746',
    paradigm: 'Contract-Oriented, Statically Typed',
    year: 2014,
    runtimeOrCompiler: 'solc (EVM bytecode)',
    packageManager: 'Foundry / Hardhat',
    description: 'The primary smart contract language for the Ethereum Virtual Machine (EVM) ecosystem and DeFi protocols.',
    commonUses: ['ERC-20 & ERC-721 Token Contracts', 'Decentralized Finance (DeFi) Protocols', 'On-Chain Governance DAOs'],
    boilerplate: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title VaultVaultStorage - Immutable Audited Treasury
contract VaultTreasury {
    address public immutable owner;
    uint256 public totalDeposits;

    event Deposited(address indexed sender, uint256 amount);
    event Withdrawn(address indexed recipient, uint256 amount);

    error Unauthorized();
    error InsufficientBalance();

    constructor() {
        owner = msg.sender;
    }

    receive() external payable {
        totalDeposits += msg.value;
        emit Deposited(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external {
        if (msg.sender != owner) revert Unauthorized();
        if (amount > address(this).balance) revert InsufficientBalance();

        (bool success, ) = owner.call{value: amount}("");
        require(success, "ETH transfer failed");
        emit Withdrawn(owner, amount);
    }
}
`
  },

  // --- DEVOPS & CONFIGURATION ---
  {
    id: 'dockerfile',
    name: 'Dockerfile',
    extension: 'dockerfile',
    category: 'config',
    categoryLabel: 'Containerization',
    color: '#384d54',
    paradigm: 'Declarative Container Blueprint',
    year: 2013,
    runtimeOrCompiler: 'Docker / BuildKit / Podman',
    packageManager: 'N/A',
    description: 'Container specifications for reproducible, lightweight deployment environments across clouds.',
    commonUses: ['Microservice Packaging', 'Multi-stage Production Builds', 'Reproducible CI Pipelines'],
    boilerplate: `# Multi-stage secure production container build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Minimal distroless runtime stage
FROM gcr.io/distroless/nodejs20-debian12 AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
USER nonroot
EXPOSE 3000
CMD ["dist/server.js"]
`
  },
  {
    id: 'terraform',
    name: 'Terraform (HCL)',
    extension: 'tf',
    category: 'config',
    categoryLabel: 'Infrastructure as Code',
    color: '#844FBA',
    paradigm: 'Declarative Cloud Infrastructure',
    year: 2014,
    runtimeOrCompiler: 'Terraform / OpenTofu',
    packageManager: 'Terraform Registry',
    description: 'Declarative Infrastructure as Code (IaC) managing cloud resources across AWS, GCP, and Azure.',
    commonUses: ['Cloud Infrastructure Provisioning', 'Kubernetes Cluster Deployment', 'IAM & VPC Networking'],
    boilerplate: `# Terraform (HCL): Multi-Region High-Availability Cluster
terraform {
  required_version = ">= 1.6.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

variable "environment" {
  type    = string
  default = "production"
}

resource "aws_s3_bucket" "vault_storage" {
  bucket        = "vault-secure-assets-\${var.environment}"
  force_destroy = false

  tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}
`
  },
  {
    id: 'yaml',
    name: 'YAML',
    extension: 'yml',
    category: 'config',
    categoryLabel: 'Configuration',
    color: '#cb171e',
    paradigm: 'Human-Readable Data Serialization',
    year: 2001,
    runtimeOrCompiler: 'YAML Parsers',
    packageManager: 'N/A',
    description: 'Human-friendly data format used universally in Kubernetes manifests and CI/CD pipelines.',
    commonUses: ['Kubernetes Manifests', 'GitHub Actions Workflows', 'Docker Compose'],
    boilerplate: `# Kubernetes Production Deployment Manifest
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vault-api-service
  labels:
    app: vault-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: vault-api
  template:
    metadata:
      labels:
        app: vault-api
    spec:
      containers:
        - name: server
          image: vault/api:v2.4.0
          ports:
            - containerPort: 8080
          resources:
            limits:
              cpu: "500m"
              memory: "512Mi"
            requests:
              cpu: "100m"
              memory: "128Mi"
`
  },
  {
    id: 'json',
    name: 'JSON',
    extension: 'json',
    category: 'config',
    categoryLabel: 'Data Interchange',
    color: '#292929',
    paradigm: 'Text-Based Data Interchange',
    year: 2001,
    runtimeOrCompiler: 'Universal Native Browser / Engine',
    packageManager: 'N/A',
    description: 'The universal language of web APIs, configuration files, and cross-language serialization.',
    commonUses: ['REST API Payloads', 'Application Configuration', 'Document Databases (MongoDB)'],
    boilerplate: `{
  "apiVersion": "v1",
  "workspace": "Vault Engineering Suite",
  "configuration": {
    "telemetryEnabled": false,
    "securityTier": "hardened",
    "clusterNodes": [
      { "id": "node-us-east-1", "capacity": 64, "active": true },
      { "id": "node-eu-west-1", "capacity": 32, "active": true }
    ]
  }
}
`
  },
  {
    id: 'markdown',
    name: 'Markdown',
    extension: 'md',
    category: 'config',
    categoryLabel: 'Documentation',
    color: '#083fa1',
    paradigm: 'Lightweight Markup Language',
    year: 2004,
    runtimeOrCompiler: 'CommonMark / GFM',
    packageManager: 'N/A',
    description: 'The standard formatting language for developer documentation, READMEs, and technical specifications.',
    commonUses: ['Repository READMEs', 'Technical Documentation', 'Issue Tracking & Notes'],
    boilerplate: `# Vault Polyglot Architecture

A world-class engineering platform supporting **70+ programming languages**.

## Key Capabilities
* **Rosetta Stone**: Compare syntax across paradigms.
* **Universal Model Transpiler**: Convert schemas to TypeScript, Rust, Go, Python, and SQL.
* **In-Browser Execution**: Interactive runners with zero network dependencies.
`
  },

  // --- HARDWARE & ENTERPRISE LEGACY ---
  {
    id: 'assembly',
    name: 'Assembly (x86_64)',
    extension: 's',
    category: 'hardware',
    categoryLabel: 'Low-Level Assembly',
    color: '#6E4C13',
    paradigm: 'Low-Level Machine Instructions',
    year: 1949,
    runtimeOrCompiler: 'NASM / GAS',
    packageManager: 'N/A',
    description: 'Human-readable representation of raw machine code executed directly by the CPU silicon.',
    commonUses: ['Kernel Bootstrapping', 'Hardware Drivers', 'SIMD Performance Optimization', 'Security Exploits & Reverse Engineering'],
    boilerplate: `; x86_64 NASM: Linux 64-bit System Call Entry
section .data
    msg db "Vault Kernel Initialized", 0x0A
    len equ $ - msg

section .text
    global _start

_start:
    ; sys_write(stdout=1, buf=msg, count=len)
    mov rax, 1          ; syscall number for sys_write
    mov rdi, 1          ; file descriptor (stdout)
    mov rsi, msg        ; message pointer
    mov rdx, len        ; message length
    syscall

    ; sys_exit(0)
    mov rax, 60         ; syscall number for sys_exit
    xor rdi, rdi        ; exit code 0
    syscall
`
  },
  {
    id: 'webassembly',
    name: 'WebAssembly (WAT)',
    extension: 'wat',
    category: 'hardware',
    categoryLabel: 'Binary Instruction Format',
    color: '#04133b',
    paradigm: 'Stack-based Bytecode',
    year: 2017,
    runtimeOrCompiler: 'V8 / Wasmtime / Wasmer',
    packageManager: 'WAPM',
    description: 'High-performance stack-based virtual machine executing code at near-native speed in browsers and cloud.',
    commonUses: ['High-Performance Browser Computations', 'Serverless Edge Functions', 'Cross-Language Sandboxes'],
    boilerplate: `;; WebAssembly Text Format (WAT): Stack-based addition
(module
  (func $add (param $lhs i32) (param $rhs i32) (result i32)
    local.get $lhs
    local.get $rhs
    i32.add
  )
  (export "add" (func $add))
)
`
  },
  {
    id: 'cobol',
    name: 'COBOL',
    extension: 'cbl',
    category: 'legacy',
    categoryLabel: 'Enterprise Banking',
    color: '#1a4e8c',
    paradigm: 'Imperative, Procedural, Business-Oriented',
    year: 1959,
    runtimeOrCompiler: 'GnuCOBOL / IBM Enterprise COBOL',
    packageManager: 'N/A',
    description: 'Processes over 70% of global financial transactions and trillions in daily banking transfers.',
    commonUses: ['Mainframe Banking', 'Airline Reservation Systems', 'Government Social Security Ledgers'],
    boilerplate: `       IDENTIFICATION DIVISION.
       PROGRAM-ID. VAULT-LEDGER.
       AUTHOR. SYSTEM-ARCHITECT.
       
       DATA DIVISION.
       WORKING-STORAGE SECTION.
       01 WS-TRANSACTION-AMT   PIC 9(7)V99 VALUE 0012500.50.
       01 WS-TAX-RATE          PIC V999    VALUE .085.
       01 WS-FINAL-TOTAL       PIC 9(7)V99.
       01 WS-DISPLAY-TOTAL     PIC $$,$$$,$$9.99.

       PROCEDURE DIVISION.
       MAIN-LOGIC.
           COMPUTE WS-FINAL-TOTAL = 
               WS-TRANSACTION-AMT + (WS-TRANSACTION-AMT * WS-TAX-RATE)
           MOVE WS-FINAL-TOTAL TO WS-DISPLAY-TOTAL
           DISPLAY "SETTLED SETTLEMENT: " WS-DISPLAY-TOTAL
           STOP RUN.
`
  },
  {
    id: 'fortran',
    name: 'Fortran',
    extension: 'f90',
    category: 'legacy',
    categoryLabel: 'Supercomputing & Numerical',
    color: '#4d41b1',
    paradigm: 'Imperative, Numerical, High-Performance Array',
    year: 1957,
    runtimeOrCompiler: 'gfortran / Intel oneAPI',
    packageManager: 'fpm (Fortran Package Manager)',
    description: 'The foundation of numerical scientific computing, climate modeling, and supercomputing benchmarks.',
    commonUses: ['Supercomputing Benchmarks (LINPACK)', 'Global Climate Simulations', 'Computational Fluid Dynamics'],
    boilerplate: `! Fortran 2018: Matrix Multiplication for Supercomputing
program matrix_mult
    implicit none
    integer, parameter :: N = 4
    real(8), dimension(N, N) :: A, B, C

    call random_number(A)
    call random_number(B)

    ! Intrinsic optimized BLAS matrix multiply
    C = matmul(A, B)

    print *, "Matrix multiplication benchmark completed."
    print *, "Center element C(2,2):", C(2, 2)
end program matrix_mult
`
  }
];

export const LANGUAGE_CATEGORIES = [
  { id: 'all', label: 'All Languages' },
  { id: 'systems', label: 'Systems & Performance' },
  { id: 'web', label: 'Web & Fullstack' },
  { id: 'scripting', label: 'Scripting & AI' },
  { id: 'jvm', label: 'JVM & Enterprise' },
  { id: 'mobile', label: 'Mobile & Apple' },
  { id: 'functional', label: 'Functional' },
  { id: 'science', label: 'Data Science & Math' },
  { id: 'database', label: 'Database & API' },
  { id: 'web3', label: 'Web3 & Smart Contracts' },
  { id: 'config', label: 'DevOps & Config' },
  { id: 'hardware', label: 'Hardware & Assembly' },
  { id: 'legacy', label: 'Enterprise Legacy' }
];

export function getLanguageById(id: string): LanguageMeta | undefined {
  const normalized = id.toLowerCase().trim();
  return WORLD_LANGUAGES.find((lang) => lang.id === normalized);
}

export function getLanguageExtension(id: string): string {
  const lang = getLanguageById(id);
  return lang ? lang.extension : 'txt';
}

export function searchLanguages(query: string, category: string = 'all'): LanguageMeta[] {
  const q = query.toLowerCase().trim();
  return WORLD_LANGUAGES.filter((lang) => {
    const matchesCat = category === 'all' || lang.category === category;
    if (!matchesCat) return false;
    if (!q) return true;
    return (
      lang.name.toLowerCase().includes(q) ||
      lang.id.toLowerCase().includes(q) ||
      lang.extension.toLowerCase().includes(q) ||
      lang.description.toLowerCase().includes(q) ||
      lang.paradigm.toLowerCase().includes(q) ||
      lang.commonUses.some((u) => u.toLowerCase().includes(q))
    );
  });
}
