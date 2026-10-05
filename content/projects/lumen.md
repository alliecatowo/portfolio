---
title: Lumen
date: 2026-02-12
demo: https://alliecatowo.github.io/lumen/playground
description: "Markdown-native, statically typed language in Rust for AI agent workflows: typed tools, capability grants, effect rows, deterministic mode, WASM playground."
docs: https://alliecatowo.github.io/lumen/
featured: false
github: https://github.com/alliecatowo/lumen
group: languages-runtimes
groupOrder: 2
image: /images/projects/lumen/card.webp
imageAlt: The Lumen browser playground running a pattern-matching program compiled to WebAssembly; the terminal prints "zero, one, many".
seo:
  title: "Lumen: a typed language for AI agent workflows"
  description: "Markdown-native, statically typed language in Rust for AI agent workflows: typed tools, capability grants, effect rows, deterministic mode, WASM playground."
slug: lumen
status: published
tags:
  - programming-language
  - compiler
  - rust
  - ai
  - llm
  - webassembly
  - developer-tools
  - open-source
technologies:
  - Rust
  - Cranelift
  - WebAssembly
  - LSP
  - Tree-sitter
  - VitePress
---

**A programming language where the docs are the source, and every LLM call shows up in the type signature.**

Lumen started from a question: what if an AI agent's program read like a design doc, and the compiler knew exactly which lines could call a model, hit the network or read the clock? The answer is a statically typed language, written in Rust, where a source file is Markdown. In an `.lm.md` file the prose is the documentation and the fenced `lumen` blocks are the program, so the file reads as a document and runs as code.

The fastest way to get it is the [playground](https://alliecatowo.github.io/lumen/playground): pick an example and press Run. The real compiler and VM run in your browser as WebAssembly.

![The Lumen playground running a factorial program; the terminal prints 720.](/images/projects/lumen/playground-factorial.webp)

## What it looks like

Tools are typed declarations, grants attach limits to them, and `bind effect` connects a tool to a named effect:

```lumen
use tool llm.chat as Chat
use tool http.get as HttpGet
grant Chat max_tokens 2000
grant HttpGet timeout_ms 5000
bind effect llm to Chat
bind effect http to HttpGet

cell fetch_data(url: String) -> String / {http}
  return HttpGet(url: url)
end

cell ask_llm(question: String) -> String / {llm}
  return Chat(prompt: question)
end
```

The `/ {http}` and `/ {llm}` parts are effect rows. The compiler infers effects through call chains, so a cell that reaches a model through three helper functions still has to say so, and the error names the call that caused it. Grants such as token budgets, timeouts and allowed domains are checked again at runtime when a tool is dispatched.

Add `@deterministic true` to a file and that effect information becomes a rule. This program doesn't compile, because `uuid()` is nondeterministic:

```lumen
@deterministic true

cell main() -> String
  return uuid()
end
```

The same goes for time, randomness, HTTP, LLM calls and any tool without a declared effect: all rejected before anything runs.

## Under the hood

The compiler has seven stages: Markdown extraction, a lexer, a hand-written recursive-descent parser with Pratt parsing for expressions, a resolver that infers effects and evaluates grants, a typechecker with exhaustive matching and `where` constraints on record fields, constraint validation, and lowering to a Lua-style bytecode of 32-bit register instructions.

A register VM runs that bytecode. Algebraic effects (`perform`, `handle`, `resume`) are implemented with dedicated opcodes and one-shot continuations and covered by end-to-end tests:

```lumen
effect Get
  cell get() -> Int
end

cell main() -> Int / {Get}
  let result = handle
    let x = perform Get.get()
    x + 10
  with
    Get.get() =>
      resume(32)
  end
  return result
end
```

Hot cells can be compiled to native code by a tiered Cranelift JIT, which falls back to the interpreter for anything it doesn't support. And the same VM compiles to WebAssembly, which is how the playground works.

## The toolchain

A language only feels real once it's pleasant to use, so Lumen ships a CLI (`lumen run`, `check`, `fmt`, `repl` and `emit`), a language server with hover docs drawn from the Markdown around your code, a tree-sitter grammar, and an editor extension on [Open VSX](https://open-vsx.org/extension/alliecatowo/lumen) (`alliecatowo.lumen`). The [docs site](https://alliecatowo.github.io/lumen/) has a language tour and reference.

![Lumen docs home: "The AI-Native Programming Language", with the pink LM document logo.](/images/projects/lumen/docs-home.webp)

## How it was built

About 350 commits, most of them in one intense agent-assisted week in February 2026, for roughly 210,000 lines of Rust across a workspace that now publishes four crates (`lumen-cli`, `lumen-compiler`, `lumen-runtime` and `lumen-lsp`). Work that's still on branches, like a hybrid JIT rework and a self-hosted lexer and parser, isn't part of the released language yet, and the package registry's backend isn't deployed.

## Trying it

The playground needs nothing installed. To install the CLI:

```sh
brew install alliecatowo/tap/lumen
# or the release binary
curl -fsSL https://raw.githubusercontent.com/alliecatowo/lumen/main/scripts/install.sh | sh
# or from crates.io
cargo install lumen-cli
```

Version 0.6.0 is current everywhere: the [`lumen-cli`](https://crates.io/crates/lumen-cli) crate provides the `lumen` binary (and a `wares` package tool), [`lumen-wasm`](https://www.npmjs.com/package/lumen-wasm) on npm (`npm install lumen-wasm`) is the browser and edge build, and the editor extension is `alliecatowo.lumen` on Open VSX (`code --install-extension alliecatowo.lumen` on VSCodium or code-server). Then `lumen run hello.lm.md`. The [repo](https://github.com/alliecatowo/lumen) has the source. MIT licensed.
