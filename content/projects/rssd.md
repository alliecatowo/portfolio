---
title: rssd
date: 2026-09-15
description: "A file-based RSS daemon: feeds become a tree of atomically written XML entries with revision history, a tail-able JSONL event log, and a vim-style TUI."
docs: https://alliecatowo.github.io/rssd/
featured: false
github: https://github.com/alliecatowo/rssd
group: agent-systems-devtools
image: /images/projects/rssd/card.webp
imageAlt: 'rssd docs site: "The filesystem is the API", a daemon that turns RSS and Atom feeds into a directory tree.'
seo:
  title: "rssd: a file-based RSS daemon with a TUI"
  description: "A file-based RSS daemon: feeds become a tree of atomically written XML entries with revision history, a tail-able JSONL event log, and a vim-style TUI."
slug: rssd
status: published
tags:
  - developer-tools
  - rss
  - filesystem
  - daemon
  - unix
  - tui
technologies:
  - Python
  - uv
  - lxml
  - feedparser
  - httpx
  - Textual
  - VitePress
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

*Adapted from the README's example tree: you write `feeds.d/`, the daemon writes `store/`, each revision of an entry is its own file with the plain name pointing at the newest, and `var/events.jsonl` is there to `tail -F`.*

::demo-video
---
height: 732
width: 1300
alt: "A terminal recording: ls lists entry files in the rust-blog folder of the
  demo store, then the rss terminal reader opens with a feed list, an entry list
  and a reader pane. The cursor moves to the rust-blog feed, opens an entry and
  steps through two more entries."
mp4: /images/projects/rssd/demo.mp4
poster: /images/projects/rssd/demo-poster.webp
webm: /images/projects/rssd/demo.webm
---
::

*Recorded in the offline fixture mode, so the feeds are the repo's committed fixtures rather than live fetches. First the files themselves (`ls` on one feed's `entries/` folder, including the `.r1.xml` revisions), then the `rss` reader walking the same folder.*

## Three invariants

- **Writes are atomic.** Every file is written to a temp name in the same directory, fsynced, re-parsed with a strict XML parser, then renamed into place. A reader never sees half a file, and malformed XML never lands. A `SIGKILL` can only leave a temp file behind, which is swept on the next start.
- **The tree is the truth.** Each entry carries its own ID and content hash, so `rm -rf var/` is fully recoverable by rescanning, and the rebuild writes nothing.
- **Files only change when content does,** so `mtime` means what you'd expect.

When a publisher edits a post, each version is kept as its own `.rN.xml` file, the plain name links to the newest, and `rss diff` compares them. Changes are detected by hashing the rendered semantic content rather than raw bytes, so a reordered attribute or a rotating ad token can't fake a revision. Publisher HTML is mapped onto a small fixed XML vocabulary, and each entry records where its body came from; rssd never makes content up.

## A polite client with an honest log

It uses conditional GET, honours `Cache-Control` and `Retry-After`, and backs off per feed with jitter. Full-text fetching is opt-in per subscription. The event log's guarantee is carefully worded: if you see `entry.new`, the file exists and is complete. The converse isn't promised, so consumers reconcile when the daemon starts.

The `rss` reader addresses entries by ID prefix, position or path, and `rss tui` is a modal three-pane reader with `hjkl`, `/`, and `:set` working the way vim taught you.

## How it was built

Spec first, then code, in one evening on 15 September 2026: a 587-line spec and nine commits. Byte-exact captures of seven real feeds (including the GitHub blog, go.dev, Hacker News and xkcd) plus a local fixture server mean the whole thing runs with no network. The README counts about 300 tests. It's a small, sharp design exercise rather than a daily-driver reader, and it's on PyPI as [`rssd-fs`](https://pypi.org/project/rssd-fs/) (the `rssd` name there belongs to someone else). It needs Python 3.12 or later (v0.3.0 lowered that from 3.14 only), and v0.3.0 is the current release:

```sh
brew install alliecatowo/tap/rssd     # macOS and Linux, or:
uv tool install 'rssd-fs[tui]'
rssd add https://go.dev/blog/feed.atom
rssd once
rss tui
```

v0.3.0 (4 October 2026) added `rssd import` and `rssd export` for OPML, so subscriptions can move in and out of other readers. The rest of it is hardening: full-text fetching resolves a host once and connects to the checked address, which closes a DNS rebinding hole; XML entity resolution is off; and subscription URLs must be http or https. Fixes include duplicate polling chains, a 200 response that isn't a feed now counting as a failure, the daemon exiting non-zero if its scheduler dies, and entry files being fsynced. CI runs on Python 3.12 and 3.14. Perf work on the event loop and the TUI refresh is still open, and so is a retention limit for tracked entries.

The `rssd` and `rss` commands then keep their data in your user data directory by default. [Docs](https://alliecatowo.github.io/rssd/), [spec](https://github.com/alliecatowo/rssd/blob/main/SPEC.md), MIT.
