---
title: patchrun
date: 2026-05-14
description: Run any command in a disposable Git worktree and get back the patch it would have made, then apply, save, or discard it. A small Go CLI.
featured: false
github: https://github.com/alliecatowo/patchrun
group: agent-systems-devtools
image: /images/projects/patchrun/card.webp
imageAlt: "Terminal running patchrun on a sample repo: the command exited 0, two files changed with 4 insertions and 4 deletions, and a menu offers apply, save, view, keep worktree or discard."
seo:
  title: "patchrun: run commands in a disposable worktree"
  description: Run any command in a disposable Git worktree and get back the patch it would have made, then apply, save, or discard it. A small Go CLI.
slug: patchrun
status: published
tags:
  - developer-tools
  - git
  - cli
  - agents
  - dry-run
technologies:
  - Go
  - Git
  - PTY
  - GoReleaser
---

**Command in, patch out.**

Lots of commands rewrite your repo: package installs, code generators, codemods, formatters, framework CLIs, and whatever an AI assistant just suggested. Most of them have no dry-run flag. patchrun gives all of them the same one:

```bash
patchrun -- npx shadcn@latest add button
```

It runs the command in a throwaway copy of your repo and hands you back exactly what it changed, as a patch. Then you choose: apply, save, view, keep or discard.

::demo-video
---
height: 800
width: 1200
alt: A terminal recording of patchrun on a small sample repo. It runs a
  var-to-const codemod script in a disposable worktree and lists the two changed
  files, then I view the patch, apply it, and the sample repo's status shows
  both files modified.
mp4: /images/projects/patchrun/demo.mp4
poster: /images/projects/patchrun/demo-poster.webp
webm: /images/projects/patchrun/demo.webm
---
::

*Recorded against a throwaway sample repo: patchrun runs a `var` to `const` codemod in a worktree, shows the diffstat and the apply / save / view / keep / discard menu, then I view the patch and apply it. A status check afterwards lists the two modified files.*

## How it works

1. Snapshot the repo into a detached Git worktree in a temp directory.
2. Replay your uncommitted changes (staged, unstaged and untracked) into it and commit them as a baseline.
3. Run the command there, with live output, and a pseudo-terminal for interactive scaffolders.
4. Diff the result against the baseline.

Step 2 is the clever bit. Because your own work-in-progress becomes the baseline, the diff contains only what the command did, and you can use patchrun on a dirty tree.

It is **not a sandbox**. The command still runs as you, with your permissions; patchrun only keeps it away from your working tree.

## The details that make it scriptable

- If your repo changed while the command ran, patchrun checks before applying, with an optional 3-way fallback and a `--check` mode that writes nothing.
- `--json` output and documented exit codes (5: the command failed, 6: the patch didn't apply, 7: you discarded it, 9: timeout).
- Saved patches get a sidecar with the commit, command, exit code, duration and diffstat.
- A guard refuses to delete anything that isn't inside its own temp directory with the expected prefix.
- Tests inject real filesystem faults instead of using mocks.

That makes it a natural gate between an agent's proposed command and your working tree.

## Status

Built over 14 and 15 May 2026: 12 commits, written with a coding agent and then hardened by hand. MIT. There are no releases yet, but it installs with Go:

```bash
go install github.com/alliecatowo/patchrun/cmd/patchrun@latest
```

Windows support is best-effort. The repo has [example patches](https://github.com/alliecatowo/patchrun/tree/main/examples) captured from a codemod, a prettier run and `shadcn add button`.
