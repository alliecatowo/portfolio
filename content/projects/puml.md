---
title: puml
date: 2026-05-14
demo: https://alliecatowo.github.io/puml/editor/
description: "PlantUML-compatible diagrams without Java or Graphviz: a Rust compiler with its own layout engine, emitting SVG/PNG/PDF from a CLI, LSP and in-browser WASM."
featured: true
github: https://github.com/alliecatowo/puml
group: languages-runtimes
image: /images/projects/puml/card.webp
imageAlt: The puml studio editor with PlantUML class source on the left and the SVG class diagram, rendered by the in-browser WASM engine, on the right.
order: 5
seo:
  title: "puml: PlantUML-compatible diagrams in Rust"
  description: "PlantUML-compatible diagrams without Java or Graphviz: a Rust compiler with its own layout engine, emitting SVG/PNG/PDF from a CLI, LSP and in-browser WASM."
slug: puml
status: published
tags:
  - rust
  - diagrams
  - plantuml
  - uml
  - compilers
  - webassembly
  - lsp
  - developer-tools
technologies:
  - Rust
  - WebAssembly
  - winnow
  - resvg
  - svg2pdf
  - LSP
  - Zola
  - CodeMirror
---

**UML that compiles: PlantUML diagrams, no Java, no Graphviz.**

PlantUML is the most expressive text-to-diagram language around, but rendering it takes a JVM and usually Graphviz. That's heavy in CI, awkward in an editor, and impossible in a browser tab. puml is a Rust compiler for the same language that brings its own layout engine, so one binary, or one WebAssembly module, turns `.puml` text into SVG, PNG, JPEG, WebP or PDF.

The quickest way to see it is the [live editor](https://alliecatowo.github.io/puml/editor/): type on the left and the diagram re-renders on the right, entirely in your browser.

![puml editor resolving 19 AWS stdlib includes and rendering a cloud architecture diagram.](/images/projects/puml/editor-aws.webp)

## How it works

Source goes through a frontend (PlantUML, puml's own lighter PicoUML dialect, or an early Mermaid adapter), a preprocessor that handles `!include`, `!define`, conditionals, macros and themes, a parser built on winnow, and a normalizer that turns the syntax tree into a model for each diagram family. Then comes layout, and output as deterministic SVG that `resvg` rasterizes or `svg2pdf` converts. Here is puml drawing its own architecture:

![puml's own architecture, drawn by puml: CLI, LSP and WASM transports feeding the preprocessor, parser, normalizer and renderer.](/images/projects/puml/architecture-overview.webp)

The part that replaces Graphviz is a Sugiyama-style hierarchical layout. It assigns ranks by longest path, reduces edge crossings with barycenter sweeps, then runs a transposition pass that counts actual crossings between adjacent layers and keeps a swap only if the count strictly drops. Edges are routed orthogonally through deterministic channels, and there's a separate spline router for curved edges, whose module doc explains at some length why rounding off the corners of an orthogonal path is not the same thing as a real spline. Sequence diagrams, class diagrams, mind maps, Gantt charts and several others have their own layouts.

Output is deterministic by construction. Layout uses ordered maps throughout, and text is measured with font-free arithmetic, so a render never depends on the fonts installed on the machine. Before any SVG is written, the render is a typed scene that invariant tests check for text collisions, bounds and arrowhead geometry.

## Everywhere the text is

One language service backs three surfaces. The `puml` CLI has `--check`, `--watch` and `--dump ast|model|scene` to inspect every stage. `puml-lsp` is a full language server with completion, hover, rename, formatting and diagnostics. And the WASM build runs the live editor on the docs site, diagnostics included.

![puml editor rendering a component diagram: a load balancer, two app servers, and primary and replica databases.](/images/projects/puml/editor-component.webp)

![puml editor rendering a sequence diagram with alt, opt and loop fragments.](/images/projects/puml/editor-sequence.webp)

## Breadth, honestly

The syntax tree knows 28 diagram kinds, from sequence and class diagrams to Gantt charts, JSON and YAML trees, Salt wireframes, regex railroads and network diagrams. Depth varies a lot between them. The project's own parity map marks some families as stubs and only a handful as broad, and the README calls it "PlantUML-compatible — not a claim of complete 1:1 parity". There's no conformance percentage, because none has been measured. What exists instead is a public feature manifest of what's supported, partial or risky, and a differential harness that renders the same fixtures through puml and the real PlantUML JAR and compares element counts, text and colours.

![The puml gallery of 288 rendered examples, filterable by diagram family.](/images/projects/puml/examples-grid.webp)

## How it was built

puml was an experiment in fast, AI-assisted engineering, which the README says openly: 1,383 commits and about 800 merged pull requests between May 14 and June 5, 2026. The guardrails are what held it together: deterministic output, snapshot and invariant tests, visual baselines, a binary-size gate, and scripts that stop files and modules from growing into monoliths.

## Status

It's an early v0.1, MIT licensed, and paused since June 2026. The [docs site](https://alliecatowo.github.io/puml/), [gallery](https://alliecatowo.github.io/puml/gallery/) and editor are live. There are no published packages yet, so the CLI and language server are built from source:

```sh
git clone https://github.com/alliecatowo/puml.git && cd puml
cargo build --release
./target/release/puml hello.puml
```
