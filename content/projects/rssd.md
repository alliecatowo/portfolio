---
title: rssd
slug: rssd
description: 'A file-based RSS daemon: feeds become a tree of atomically written XML entries with revision history, a tail-able JSONL event log, and a vim-style TUI.'
date: 2026-09-15
status: published
featured: false
group: agent-systems-devtools
technologies:
  - Python
  - uv
  - lxml
  - feedparser
  - httpx
  - Textual
  - VitePress
tags:
  - developer-tools
  - rss
  - filesystem
  - daemon
  - unix
  - tui
github: https://github.com/alliecatowo/rssd
demo: https://alliecatowo.github.io/rssd/
image: /images/projects/rssd/card.webp
imageAlt: 'rssd docs site: "The filesystem is the API", a daemon that turns RSS and Atom feeds into a directory tree.'
seo:
  title: 'rssd: a file-based RSS daemon with a TUI'
---

**The filesystem is the API.**

rssd watches a folder of subscription files, polls the feeds, and writes every entry as its own XML file in a per-feed folder. There's no database, no socket and no client library. Anything that can read a directory is a client: `grep`, `find`, `tail -F`, your editor. The bundled reader, `rss`, plays by the same rules and has no private channel to the daemon. That's why there are two binaries: `rssd` writes the tree, `rss` only reads it.

```text
demo/
├── feeds.d/     you write
├── store/       rssd writes
│   └── rust-blog/entries/
│       ├── …update.xml
│       ├── …update.r1.xml
│       └── …update.r2.xml
└── var/events.jsonl
```

_Adapted from the README's example tree: you write `feeds.d/`, the daemon writes `store/`, each revision of an entry is its own file with the plain name pointing at the newest, and `var/events.jsonl` is there to `tail -F`._

<video class="w-full h-auto rounded-lg" width="1300" height="732" autoplay muted loop playsinline poster="/images/projects/rssd/demo-poster.webp" aria-label="A terminal recording: ls lists entry files in the rust-blog folder of the demo store, then the rss terminal reader opens with a feed list, an entry list and a reader pane. The cursor moves to the rust-blog feed, opens an entry and steps through two more entries.">
  <source src="/images/projects/rssd/demo.webm" type="video/webm">
  <source src="/images/projects/rssd/demo.mp4" type="video/mp4">
</video>

_Recorded in the offline fixture mode, so the feeds are the repo's committed fixtures rather than live fetches. First the files themselves (`ls` on one feed's `entries/` folder, including the `.r1.xml` revisions), then the `rss` reader walking the same folder._

## Three invariants

- **Writes are atomic.** Every file is written to a temp name in the same directory, fsynced, re-parsed with a strict XML parser, then renamed into place. A reader never sees half a file, and malformed XML never lands. A `SIGKILL` can only leave a temp file behind, which is swept on the next start.
- **The tree is the truth.** Each entry carries its own ID and content hash, so `rm -rf var/` is fully recoverable by rescanning, and the rebuild writes nothing.
- **Files only change when content does,** so `mtime` means what you'd expect.

When a publisher edits a post, each version is kept as its own `.rN.xml` file, the plain name links to the newest, and `rss diff` compares them. Changes are detected by hashing the rendered semantic content rather than raw bytes, so a reordered attribute or a rotating ad token can't fake a revision. Publisher HTML is mapped onto a small fixed XML vocabulary, and each entry records where its body came from; rssd never makes content up.

## A polite client with an honest log

It uses conditional GET, honours `Cache-Control` and `Retry-After`, and backs off per feed with jitter. Full-text fetching is opt-in per subscription. The event log's guarantee is carefully worded: if you see `entry.new`, the file exists and is complete. The converse isn't promised, so consumers reconcile when the daemon starts.

The `rss` reader addresses entries by ID prefix, position or path, and `rss tui` is a modal three-pane reader with `hjkl`, `/`, and `:set` working the way vim taught you.

## How it was built

Spec first, then code, in one evening on 15 September 2026: a 587-line spec and nine commits. Byte-exact captures of seven real feeds (including the GitHub blog, go.dev, Hacker News and xkcd) plus a local fixture server mean the whole thing runs with no network. The README counts about 300 tests. It's a small, sharp design exercise rather than a daily-driver reader, and it isn't on PyPI (the `rssd` name there belongs to someone else), so run it from source with uv. [Docs](https://alliecatowo.github.io/rssd/), [spec](https://github.com/alliecatowo/rssd/blob/main/SPEC.md), MIT.
