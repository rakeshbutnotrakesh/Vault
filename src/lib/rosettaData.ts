export interface RosettaSnippet {
  languageId: string;
  languageName: string;
  code: string;
  explanation: string;
}

export interface RosettaConcept {
  id: string;
  title: string;
  description: string;
  snippets: Record<string, RosettaSnippet>;
}

export const ROSETTA_CONCEPTS: RosettaConcept[] = [
  {
    id: 'hello_world',
    title: 'Hello World & Entry Point',
    description: 'Minimal canonical executable program printing to standard output.',
    snippets: {
      rust: {
        languageId: 'rust',
        languageName: 'Rust',
        code: `fn main() {\n    println!("Hello, World!");\n}`,
        explanation: 'Standard entry point using the println! formatting macro.'
      },
      go: {
        languageId: 'go',
        languageName: 'Go',
        code: `package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("Hello, World!")\n}`,
        explanation: 'Main package entry point importing standard library fmt.'
      },
      python: {
        languageId: 'python',
        languageName: 'Python',
        code: `if __name__ == "__main__":\n    print("Hello, World!")`,
        explanation: 'Idiomatic module execution check with native print function.'
      },
      typescript: {
        languageId: 'typescript',
        languageName: 'TypeScript',
        code: `const message: string = "Hello, World!";\nconsole.log(message);`,
        explanation: 'Statically typed string variable logged to stdout.'
      },
      cpp: {
        languageId: 'cpp',
        languageName: 'C++',
        code: `#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}`,
        explanation: 'Standard C++ iostream stream insertion.'
      },
      csharp: {
        languageId: 'csharp',
        languageName: 'C#',
        code: `// C# 10+ Top-level statement\nConsole.WriteLine("Hello, World!");`,
        explanation: 'Modern top-level program in .NET 8.'
      },
      java: {
        languageId: 'java',
        languageName: 'Java',
        code: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
        explanation: 'Canonical Java class with public static void main.'
      },
      kotlin: {
        languageId: 'kotlin',
        languageName: 'Kotlin',
        code: `fun main() {\n    println("Hello, World!")\n}`,
        explanation: 'Top-level main function without class boilerplate.'
      },
      swift: {
        languageId: 'swift',
        languageName: 'Swift',
        code: `import Foundation\n\nprint("Hello, World!")`,
        explanation: 'Top-level executable statement in Swift.'
      },
      zig: {
        languageId: 'zig',
        languageName: 'Zig',
        code: `const std = @import("std");\n\npub fn main() void {\n    std.debug.print("Hello, World!\\n", .{});\n}`,
        explanation: 'Zig standard debug print with empty tuple args.'
      },
      elixir: {
        languageId: 'elixir',
        languageName: 'Elixir',
        code: `IO.puts("Hello, World!")`,
        explanation: 'Native IO module puts function on the BEAM VM.'
      },
      haskell: {
        languageId: 'haskell',
        languageName: 'Haskell',
        code: `main :: IO ()\nmain = putStrLn "Hello, World!"`,
        explanation: 'IO action using standard putStrLn.'
      }
    }
  },
  {
    id: 'http_get',
    title: 'HTTP GET Request',
    description: 'Fetching remote JSON or text over network with standard or idiomatic libraries.',
    snippets: {
      rust: {
        languageId: 'rust',
        languageName: 'Rust (reqwest)',
        code: `use reqwest::Error;\n\n#[tokio::main]\nasync fn main() -> Result<(), Error> {\n    let response = reqwest::get("https://api.github.com/zen")\n        .await?\n        .text()\n        .await?;\n    println!("Zen: {}", response);\n    Ok(())\n}`,
        explanation: 'Asynchronous fetch using tokio runtime and reqwest client.'
      },
      go: {
        languageId: 'go',
        languageName: 'Go (net/http)',
        code: `package main\n\nimport (\n\t"fmt"\n\t"io"\n\t"net/http"\n)\n\nfunc main() {\n\tres, err := http.Get("https://api.github.com/zen")\n\tif err != nil { panic(err) }\n\tdefer res.Body.Close()\n\n\tbody, _ := io.ReadAll(res.Body)\n\tfmt.Println(string(body))\n}`,
        explanation: 'Zero-dependency standard library net/http with body reader.'
      },
      python: {
        languageId: 'python',
        languageName: 'Python (urllib/httpx)',
        code: `import urllib.request\n\nwith urllib.request.urlopen("https://api.github.com/zen") as response:\n    body = response.read().decode("utf-8")\n    print(body)`,
        explanation: 'Standard library urllib.request without third-party dependencies.'
      },
      typescript: {
        languageId: 'typescript',
        languageName: 'TypeScript (Fetch API)',
        code: `async function fetchZen(): Promise<string> {\n  const res = await fetch("https://api.github.com/zen");\n  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);\n  return res.text();\n}\n\nfetchZen().then(console.log);`,
        explanation: 'Standard web Fetch API natively supported in Node 18+, Bun, Deno, and browsers.'
      },
      java: {
        languageId: 'java',
        languageName: 'Java (HttpClient)',
        code: `import java.net.URI;\nimport java.net.http.HttpClient;\nimport java.net.http.HttpRequest;\nimport java.net.http.HttpResponse;\n\npublic class HttpExample {\n    public static void main(String[] args) throws Exception {\n        HttpClient client = HttpClient.newHttpClient();\n        HttpRequest req = HttpRequest.newBuilder(URI.create("https://api.github.com/zen")).build();\n        String body = client.send(req, HttpResponse.BodyHandlers.ofString()).body();\n        System.out.println(body);\n    }\n}`,
        explanation: 'Built-in modern java.net.http.HttpClient introduced in Java 11.'
      },
      csharp: {
        languageId: 'csharp',
        languageName: 'C# (HttpClient)',
        code: `using System.Net.Http;\n\nusing var client = new HttpClient();\nstring body = await client.GetStringAsync("https://api.github.com/zen");\nConsole.WriteLine(body);`,
        explanation: 'Async HTTP call with using declaration disposing the socket handler.'
      }
    }
  },
  {
    id: 'json_handling',
    title: 'JSON Parse & Serialize',
    description: 'Transforming between raw JSON strings and strongly typed data models.',
    snippets: {
      rust: {
        languageId: 'rust',
        languageName: 'Rust (serde_json)',
        code: `use serde::{Serialize, Deserialize};\n\n#[derive(Serialize, Deserialize, Debug)]\nstruct User {\n    id: u64,\n    email: String,\n}\n\nfn main() {\n    let json_str = r#"{"id": 104, "email": "dev@vault.internal"}"#;\n    let user: User = serde_json::from_str(json_str).unwrap();\n    println!("Parsed: {:?}", user);\n\n    let serialized = serde_json::to_string_pretty(&user).unwrap();\n    println!("{}", serialized);\n}`,
        explanation: 'Serde compile-time derive macros with zero-copy deserialization.'
      },
      go: {
        languageId: 'go',
        languageName: 'Go (encoding/json)',
        code: `package main\n\nimport (\n\t"encoding/json"\n\t"fmt"\n)\n\ntype User struct {\n\tID    int    \`json:"id"\`\n\tEmail string \`json:"email"\`\n}\n\nfunc main() {\n\tdata := []byte(\`{"id": 104, "email": "dev@vault.internal"}\`)\n\tvar u User\n\tjson.Unmarshal(data, &u)\n\tfmt.Printf("%+v\\n", u)\n\n\tout, _ := json.MarshalIndent(u, "", "  ")\n\tfmt.Println(string(out))\n}`,
        explanation: 'Standard library struct tags mapping json keys to struct fields.'
      },
      python: {
        languageId: 'python',
        languageName: 'Python (json)',
        code: `import json\n\nraw = '{"id": 104, "email": "dev@vault.internal"}'\ndata = json.loads(raw)\nprint("Parsed:", data["email"])\n\nencoded = json.dumps(data, indent=2)\nprint(encoded)`,
        explanation: 'Standard json.loads and json.dumps with dictionary conversion.'
      },
      typescript: {
        languageId: 'typescript',
        languageName: 'TypeScript',
        code: `interface User {\n  id: number;\n  email: string;\n}\n\nconst raw = '{"id": 104, "email": "dev@vault.internal"}';\nconst user: User = JSON.parse(raw);\nconsole.log(user.email);\n\nconst formatted = JSON.stringify(user, null, 2);\nconsole.log(formatted);`,
        explanation: 'Native JSON.parse with TypeScript interface casting.'
      },
      kotlin: {
        languageId: 'kotlin',
        languageName: 'Kotlin (kotlinx.serialization)',
        code: `import kotlinx.serialization.*\nimport kotlinx.serialization.json.*\n\n@Serializable\ndata class User(val id: Long, val email: String)\n\nfun main() {\n    val jsonStr = """{"id":104,"email":"dev@vault.internal"}"""\n    val user = Json.decodeFromString<User>(jsonStr)\n    println(user)\n}`,
        explanation: 'Type-safe compiler plugin serialization without reflection overhead.'
      }
    }
  },
  {
    id: 'concurrency',
    title: 'Concurrency & Background Tasks',
    description: 'Spawning lightweight concurrent tasks, worker threads, or coroutines.',
    snippets: {
      go: {
        languageId: 'go',
        languageName: 'Go (Goroutines & Channels)',
        code: `package main\n\nimport (\n\t"fmt"\n\t"sync"\n)\n\nfunc worker(id int, wg *sync.WaitGroup, out chan<- string) {\n\tdefer wg.Done()\n\tout <- fmt.Sprintf("Worker %d completed task", id)\n}\n\nfunc main() {\n\tvar wg sync.WaitGroup\n\tch := make(chan string, 3)\n\n\tfor i := 1; i <= 3; i++ {\n\t\twg.Add(1)\n\t\tgo worker(i, &wg, ch)\n\t}\n\n\twg.Wait()\n\tclose(ch)\n\n\tfor msg := range ch {\n\t\tfmt.Println(msg)\n\t}\n}`,
        explanation: 'Lightweight M:N cooperative green threads (goroutines) communicating over channels.'
      },
      rust: {
        languageId: 'rust',
        languageName: 'Rust (tokio / join_all)',
        code: `use tokio::task;\n\n#[tokio::main]\nasync fn main() {\n    let mut handles = vec![];\n    for i in 1..=3 {\n        handles.push(task::spawn(async move {\n            format!("Async worker {} settled", i)\n        }));\n    }\n\n    for h in handles {\n        println!("{}", h.await.unwrap());\n    }\n}`,
        explanation: 'Work-stealing async task spawning with Send + Sync safety guarantees.'
      },
      python: {
        languageId: 'python',
        languageName: 'Python (asyncio)',
        code: `import asyncio\n\nasync def worker(worker_id: int):\n    await asyncio.sleep(0.05)\n    return f"Worker {worker_id} completed"\n\nasync def main():\n    results = await asyncio.gather(*(worker(i) for i in range(1, 4)))\n    for r in results:\n        print(r)\n\nasyncio.run(main())`,
        explanation: 'Single-threaded cooperative event loop using asyncio.gather.'
      },
      typescript: {
        languageId: 'typescript',
        languageName: 'TypeScript (Promise.all)',
        code: `const worker = async (id: number): Promise<string> => {\n  await new Promise((r) => setTimeout(r, 50));\n  return \`Worker \${id} completed\`;\n};\n\nasync function run() {\n  const results = await Promise.all([worker(1), worker(2), worker(3)]);\n  results.forEach((r) => console.log(r));\n}\n\nrun();`,
        explanation: 'Concurrent async microtasks resolved using Promise.all.'
      },
      elixir: {
        languageId: 'elixir',
        languageName: 'Elixir (Task.async_stream)',
        code: `1..3\n|> Task.async_stream(fn id ->\n  :timer.sleep(50)\n  "Worker #{id} completed"\nend)\n|> Enum.each(fn {:ok, res} -> IO.puts(res) end)`,
        explanation: 'BEAM lightweight actor processes with automatic backpressure and error isolation.'
      }
    }
  },
  {
    id: 'hashmap',
    title: 'Dictionary & Hash Map Operations',
    description: 'Key-value map insertion, lookup with fallback, and key-value iteration.',
    snippets: {
      rust: {
        languageId: 'rust',
        languageName: 'Rust',
        code: `use std::collections::HashMap;\n\nlet mut scores: HashMap<&str, i32> = HashMap::new();\nscores.insert("node-a", 95);\nscores.insert("node-b", 82);\n\n// Lookup with fallback\nlet score = scores.get("node-c").copied().unwrap_or(0);\n\nfor (key, val) in &scores {\n    println!("{}: {}", key, val);\n}`,
        explanation: 'Standard library SipHash HashMap with entry API and option unwrapping.'
      },
      go: {
        languageId: 'go',
        languageName: 'Go',
        code: `scores := map[string]int{\n\t"node-a": 95,\n\t"node-b": 82,\n}\n\n// Comma-ok idiom\nval, exists := scores["node-c"]\nif !exists {\n\tval = 0\n}\n\nfor k, v := range scores {\n\tprintln(k, v)\n}`,
        explanation: 'Built-in hash map with two-value comma-ok existence check.'
      },
      python: {
        languageId: 'python',
        languageName: 'Python',
        code: `scores = {"node-a": 95, "node-b": 82}\nscores["node-c"] = 77\n\n# Lookup with fallback\nscore = scores.get("node-missing", 0)\n\nfor k, v in scores.items():\n    print(f"{k}: {v}")`,
        explanation: 'Python dictionary with dict.get() default fallback.'
      },
      typescript: {
        languageId: 'typescript',
        languageName: 'TypeScript',
        code: `const scores: Record<string, number> = {\n  "node-a": 95,\n  "node-b": 82,\n};\n\nconst score = scores["node-c"] ?? 0;\n\nfor (const [key, val] of Object.entries(scores)) {\n  console.log(\`\${key}: \${val}\`);\n}`,
        explanation: 'Object key-value dictionary with nullish coalescing operator (??).'
      }
    }
  },
  {
    id: 'error_handling',
    title: 'Error Handling & Results',
    description: 'Idiomatic exception handling vs functional Result/Option monads.',
    snippets: {
      rust: {
        languageId: 'rust',
        languageName: 'Rust (Result & ? Operator)',
        code: `fn divide(numerator: f64, denominator: f64) -> Result<f64, &'static str> {\n    if denominator == 0.0 {\n        Err("Division by zero")\n    } else {\n        Ok(numerator / denominator)\n    }\n}\n\nfn main() {\n    match divide(10.0, 2.0) {\n        Ok(val) => println!("Result: {}", val),\n        Err(err) => eprintln!("Error: {}", err),\n    }\n}`,
        explanation: 'No exceptions; explicit Result<T, E> enum pattern matching.'
      },
      go: {
        languageId: 'go',
        languageName: 'Go (Multiple Returns)',
        code: `package main\n\nimport (\n\t"errors"\n\t"fmt"\n)\n\nfunc divide(n, d float64) (float64, error) {\n\tif d == 0 {\n\t\treturn 0, errors.New("division by zero")\n\t}\n\treturn n / d, nil\n}\n\nfunc main() {\n\tres, err := divide(10, 0)\n\tif err != nil {\n\t\tfmt.Println("Error:", err)\n\t\treturn\n\t}\n\tfmt.Println("Result:", res)\n}`,
        explanation: 'Explicit error value returned as the last return parameter.'
      },
      python: {
        languageId: 'python',
        languageName: 'Python (try/except)',
        code: `def divide(n: float, d: float) -> float:\n    if d == 0:\n        raise ValueError("Division by zero")\n    return n / d\n\ntry:\n    res = divide(10.0, 0.0)\nexcept ValueError as err:\n    print(f"Caught error: {err}")\nfinally:\n    print("Cleanup executed")`,
        explanation: 'Traditional try-except-finally exception handling.'
      },
      typescript: {
        languageId: 'typescript',
        languageName: 'TypeScript (try/catch)',
        code: `function divide(n: number, d: number): number {\n  if (d === 0) throw new Error("Division by zero");\n  return n / d;\n}\n\ntry {\n  const res = divide(10, 0);\n} catch (err) {\n  if (err instanceof Error) {\n    console.error("Error:", err.message);\n  }\n}`,
        explanation: 'Throw-catch with instanceof type narrowing on caught unknown errors.'
      }
    }
  }
];

export function getRosettaConceptById(id: string): RosettaConcept | undefined {
  return ROSETTA_CONCEPTS.find((c) => c.id === id);
}
