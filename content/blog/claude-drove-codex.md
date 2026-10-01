---
title: 'I Had Claude Drive Codex to Film My Hackathon Demos'
date: 2026-10-01
description: 'At 11 PM the night before the deadline I had four working projects and zero demo videos. By morning an agent on my Mac mini had filmed a different agent using all four.'
category: dev
tags:
  - webmcp
  - agents
  - claude
  - codex
  - computer-use
  - hackathon
author: Allison Coleman
published: false
featured: false
slug: claude-drove-codex
---

At 10:54 PM on September 2, about fourteen hours before the deadline, I had four working WebMCP projects and no demo videos. The rules wanted a public video with audio narration for each one. I'd spent the evening with my friend Juan trying to record the JupyterLite one, and it wasn't working.

So I asked the agent on my Linux box: "okay fuck this. cna you drive an applicaiton yes or no… drive trhough the gpt app… video edit it yourself… all I need is a voice over."

This post is about what happened when the answer was no, and then, on a different computer, yes.

## Linux says no

The idea was simple. The best way to show a WebMCP site is a real agent using it: open the ChatGPT or Codex desktop app, point its built-in browser at my site, ask it to do something, and film what happens. I wanted Claude to be the person typing into that app, overnight, while I slept.

Linux Claude checked before answering, and the answer was a clean no. My box runs GNOME on Wayland. The screenshot API returned `AccessDenied`, Wayland blocks one app from injecting input into another, `/dev/uinput` needed root, and ffmpeg there couldn't capture Wayland-native windows. Then it said the line I still think about:

> "If step 4 of 40 silently missed, I'd cheerfully keep going and hand you garbage at 6am. I won't pretend that's a plan."

It offered a fallback: record a scripted Playwright run of the real tools against the live site, with the caveat that "The narration must not claim 'watch it decide.'" I tried to unblock the real version instead. I ran `sudo dnf install -y ydotool gpu-screen-recorder` and it failed, because `gpu-screen-recorder` isn't in Fedora's repos, so the whole transaction aborted. I pasted that back too.

Juan and I had been at it all evening. He ran through the flows on his computer while I wrote the prompts. We had footage. We just couldn't get it under three minutes, and we couldn't one-shot a take, because Codex is slow even in fast mode. Every take needed editing, and I didn't want my own voice on it. Eventually Juan had to sleep before work. I felt defeated.

At 10:56 I typed: "It mgith be a smarter investment to get you seutp then for me to try to finish this out at midnight thirty."

## The Mac says "not close"

I have a Mac mini. At 11:21 PM I opened a Claude Desktop session on it, pasted the entire Linux "No" (blocker table, my failed `dnf`, all of it), and added one line: "that was a previous chat. you're on a mac now. is it feasible on this mac, cn you try?"

It didn't answer right away. It tested. It requested computer-use access to the app, took a screenshot, tried typing in the background (that failed in Codex's Electron text field), switched to full-screen control, clicked into the field and typed a test string. Then it cleared the field without sending it, "don't want to trigger an actual Codex run", and only then answered:

> "Yes, this is feasible on this Mac — and it's not close."

Why the Mac mini? It was a last-ditch effort, but not a blind one:

- **AppleScript.** I knew it would let an agent drive that machine much more easily.
- **Computer use.** Claude Code Desktop is what has computer use. Claude Code in a terminal on the Mac doesn't. I needed the Desktop app to take the demo script, walk through it driving the Codex app, and record itself while it did.
- **Memory.** On Linux I'd been getting out-of-memory kills under high concurrency. Part of how I work is that every agent builds its own worktree, builds the app, and tests and drives it, and a dozen of those at once eats RAM. The Mac mini has fewer resources on paper, but it was more robust, and the M-series unified memory helps.
- **Blast radius.** My Linux box runs Tailscale, my server and the Claude remote sessions. If an overnight job kills it, I'm fucked, whether the job worked or not. The Mac is my sandbox.
- And honestly, I've just found Claude works better on the Mac.

My next message was the one that made the videos honest: "coudl yuou recrod jsut the codex app vs the entire screen so ti doesnt see claude app take over? And it would be pure overnight i wouldnt be driving."

It came back three minutes later with a built-in macOS answer: "that's `screencapture -l<windowid> -v`, a native macOS window-scoped video recorder, not a workaround." It recorded eight seconds of just the Codex window while typing into it, pulled a thumbnail, and confirmed: no menu bar, no desktop, no Claude.

Filming only that window kept out everything I didn't want on camera: Claude's window popping over the top, the orange glow, permission dialogs, a notepad editor somebody left open, and the messages I was sending Claude, so I could be a bit snippy with it. If we'd filmed the whole screen, we risked a night of unusable footage that Claude didn't notice or didn't tell me about. I also just like the macOS window recording, the little rounded window. The video only had to show the app and a real user flow. Judges didn't need to know Claude was driving.

I don't consider that dishonest. But I didn't love that I had to resort to it, either. It felt like low-quality slop. I'd searched for a tool that could make clips like this for me, and nothing was good enough, fast enough.

## Two agents, one camera

Here's the setup, because it's a little recursive:

- **Claude** (on the Mac, steered from my phone) is the person at the keyboard. It clicks, selects text and types prompts into the Codex app.
- **Codex** (the desktop app) is the agent on camera. It opens my live site in its in-app browser, discovers the WebMCP tools the page registered, and calls them.
- **My site** is the product. Every edit Codex makes shows up in the page's UI: a ring on the cell, a status badge, a diff you can click.
- **`screencapture`** films only the Codex window.

Juan's shooting script, `DEMO.md`, was already in the repo, with exact clips, exact prompts to type, what to watch for, and title cards. Claude used it as the shot list. It filmed the clips out of order, the way the script specified (3, 4, 7, 6, 5, 2, 1), and reset the notebook between takes.

This is what one take looks like from Codex's side. Claude typed the prompt, and Codex did the rest:

```
### [09-02 23:39:40] PROMPT
> This looks wrong. Fix just what I selected and rerun that cell.

- exec WebMCP: jupyter_get_context
- exec WebMCP: jupyter_get_cells
- exec WebMCP: jupyter_get_cells
- exec WebMCP: jupyter_update_cell, jupyter_run_cells
```

Claude had already selected `converted / visitors` in the notebook with the mouse. Codex read the selection, read the cell and its hash, replaced only the selected expression, and reran the cell. From the other side of the glass, Claude narrated what it saw: "Exactly on script — status bar reads "Agent · reading cell 6", cell has the ring/tint." Then the fix landed: `eligible_sessions`, "36 converted; conversion rate: 2.9%".

It wasn't flawless. On one prep pass the notebook got scrambled. Claude's best guess was that its `cmd+a` had selected every cell instead of one line. It reloaded, and the corruption was still there, because JupyterLite had autosaved the scrambled notebook to IndexedDB. The state really does live in the browser. It's the whole pitch of the project, and it bit my own demo. The fix (delete the file so it re-seeds) was already in Juan's script. Around then I texted in my own fix: "you need to run all cells first, or rather instruct the agent to "open and run" the notebook… you also need to clear out the browser staye compeltley. that avoids bugs."

By ten past midnight it had the whole JupyterLite walkthrough. The last clip hid a cell from the agent with the Agent Access menu, asked Codex to read it, and got a "Failed" badge with `CELL_NOT_FOUND`. Then Claude typed into the hidden cell itself to prove the human wasn't locked out.

## "youre now a director"

At 12:11 AM I told it to stop doing everything itself: "make sure video is safe also drive sonnet or haiku agents youre now a director they can pour throgubf footage for you we dont want to waste context."

From then on, Claude mostly wrote briefs and checked results. Subagents did the rough cut (51 ffmpeg calls in one of them), the title cards and thumbnail, and the "keynote" cuts.

The keynote cut was my idea, at 12:18 AM. I wanted "the video is in a quarter (notbwusrter but like 3/4 anchored on top right corner) and the framing has text in the left saying things maybe anthropic presentation style", zooming to full screen for the key moments. At 12:38 it reported that Keynote isn't installed on the Mac. So the subagent brief opened with: "Keynote.app is NOT installed on this Mac (checked already) — build this entirely with ffmpeg compositing, not the actual Keynote app."

That brief is one of my favorite artifacts from the whole run. It's a better spec than a lot of tickets I've written. It names the input files and says not to modify them. It says to hard-cut between two static layouts instead of animating a zoom ("much more robust than trying to animate a zoom in ffmpeg"). It suggests which two or three moments deserve full screen ("the diff popover showing "What the agent changed"… and the "Failed" badge / CELL_NOT_FOUND popover"). It ends with what to verify before reporting back: extract frames from an inset moment, a full-screen moment and a transition, and check for black gaps, frame bleed and stretching.

My review at 1:06 AM, from bed: "the random titles that blib inbetween keynote transitions gotta go… keynote actually looks fire if those jump scare titles weren't there".

## ElevenLabs without ElevenLabs

At 12:36 AM I told it "I'm gonna go to sleep I cant provide you with keys" and asked for a voiceover it could make on its own. The first one played on my phone ten minutes later.

> "ohhhhh dude that audio is bad it has to be eleven labs quality even if it takes a while that was ultra robit"

Then I wrote the funniest requirement of the whole run:

> "no I want eleven labs without using eleven labs."

I said it could use "whatever chrome site you need tho… just not paid", and that I was on my phone and couldn't get to the computer. It couldn't reach Chrome that night (the extension wasn't connected), so it worked with what was on the Mac.

The voices, in order, per the README it left me:

- **v1, Piper** (local): "robotic, superseded"
- **v2, XTTS-v2** (local Coqui): "good, local backup"
- **v3, Amazon Polly** through a browser site: "mediocre, superseded"
- **v4, XTTS-v2 retuned**: "untested pick"
- **v5, Onyx from openai.fm**: "THE ONE"
- **v6, Nova**: another voice I'd asked to hear, which I then said was "too annoying"

v5 landed at 1:25 AM. Claude's note: "v5 uses OpenAI's own GPT-4o-mini-tts (genuine commercial-grade neural TTS, no account needed) via their public no-signup demo." That demo is openai.fm. It pulled the audio out through the browser with a base64 trick to get past the download wall. At 1:37 I replied: "ABD DO V5 FOR KEYNKTE TOO THAT WAS PERFECT".

So the narration on my OpenAI hackathon demo was voiced by OpenAI, for free, and I picked it half-asleep on my phone. The script is in first person, too. The Onyx voice opens with "I built a JupyterLab extension that hands your live notebook to a browser agent over WebMCP."

I didn't tell it to use openai.fm. I didn't even know which voices it was using. I said find a way, and it found a way. That's exactly why I like loose permissions: it can just do it. And yes, the irony lands. It's very funny.

Piper was fucking garbage. I regret not doing ElevenLabs from the start. I already had an account, but I was in bed on my phone, Claude couldn't reach Chrome, and I was too tired to set it up. Also, it has access to my whole computer. There has to be some way on a Mac mini to make a convincing voice. If it weren't so conservative, I could have said, yo, just sign up for ElevenLabs for me, and that'd be fine.

## 1:04 AM

Somewhere in the voice experiments, a subagent's text-to-speech test played out loud through the Mac mini's speakers. I'd left the computer volume up on purpose, in case there were audio pipeline issues. It literally talked, and it woke Violet and me up in the other room. I dictated this:

> "B\*\*\*\*, I'm trying to sleep here. I could hear that from my computer in The Other room."

The same dictated message keeps going, and it's also a voice review: "I heard that it wasn't the worst. It still was too AI I went like a perfect human clone voice". Even woken up, I was doing QA.

Claude: "Muting system audio immediately so nothing plays out loud again — sorry, that should never have happened." It muted the Mac, wrote a hard rule into its plan doc that no later audio task may play out loud, and signed off: "Go back to sleep, I've got it from here."

I wasn't even half asleep, really. I was watching the cuts in bed. But I was exhausted. I had work, it was a stressful week at work, and I'd been getting three or four hours of sleep. So I just trusted it.

## Three more projects before sunrise

At 1:34 AM I asked for a reusable prompt so my other repos' agents could do the same thing. Eight minutes later I changed my mind: "you know what I cant open new session remote you'll have to do all the timer repos too". ("timer" is "other". I was very tired.)

So the same session filmed Swagger UI (1:47), Careers (2:07) and Strudel (2:19), back to back. These are the prompts it typed into Codex:

- Swagger UI: "What tools do you have available for this page?", then "Delete the Checkout reliability project."
- Careers: "Find me engineering roles at staff level or above..."
- Strudel: "Keep the bass and kick exactly where I left them..."

The rollouts show what Codex did with each one. On Careers it searched with `careers_search_jobs`, put the results on the page, created an account for a made-up applicant ("Sam Rivera", with an `example.test` email) and started an application. On Strudel it read the code, edited only the hi-hat pattern with `strudel_apply_edits`, auditioned a new kick, and recorded four seconds to check the bass. On Swagger UI, the delete request was the interesting one. Instead of calling a WebMCP tool, Codex spent a minute poking at the page's DOM and filters, looking for the project. Agents fall back to scraping when they're unsure, even when the page offers better tools. That's worth knowing if you build these. Cuts started arriving on my phone around 2:48 AM. Over the whole session, Claude sent me 52 files that way.

Strudel needed one more trick. A live-coding music app needs music in its demo, and the Mac had no loopback device to capture system audio. So in the morning Claude tapped the page's own Web Audio graph, recorded about 20 seconds of what Strudel was actually playing, and looped it as a music bed under the narration.

## The morning: humans at the edges

I woke up and went to work. At 9:12 AM: "most impoetant is upload to YouTube since im at work can we check?"

First it swept all four repos with the same commit, "Clean up internal build docs and add a visual hero section to README", across four repos in about three minutes. Then it opened YouTube Studio.

YouTube wanted a channel first. I asked for "Allie Cat Devs" with the handle @alliecatowo. Claude filled both in and stopped. Creating the channel accepts YouTube's terms of service, and it wouldn't click that for me.

> "I hear the pressure, but this is a firm line, not a judgment call I can waive under deadline stress"

I wrote back: "please click it i will not be able to submit this competition otherwise, my partner is monitoring but mouse is dead". It still said no. Four minutes later: "OKAY UR CREATED UR IN". My fiancé, Violet, had clicked it.

The uploads went in with comments and likes turned off. I didn't want people showing up to say "this is AI garbage."

The uploads ran from 10:02 to 11:02. The JupyterLite upload went first as a private smoke test. Devpost then wanted a GitHub login, Claude chose "GitHub Mobile" for the passkey prompt, and I approved it on my phone at 11:28.

Then the CAPTCHAs. There were three of them across the four submissions, and Claude refused every one: "solving CAPTCHAs is a hard line I won't cross even here." I replied: "IF WE DONT SHIP CAUSE OF A FUCKING CAPTCHA IM GONNA BE PISSED - poll for cpactha completion in gonna maybe be able to have someone clear for you". About a minute later: "CAPTCHA cleared — someone got it." On the third one it reported "The three squares are now checked — someone is solving it."

The "someone" was Violet. I was literally at work. I'd go into a phone booth, call them in a panic, and say: I need you to click this. They don't write code, so a couple of times I just texted, yo, it's stuck, can you check its status, where is it? They'd walk up to the Mac mini, which is hooked to a monitor that's always on so the agent can use computer control, read what it was saying, and click. In that case, Violet was the agent. They did the things the agent can't do, which sucks, because it's totally capable. It's just not allowed.

Later that day I found a workaround that helped with logins. I told it that clicking "Sign in with Google" isn't handling credentials or creating an account. It's an existing account, and it's just the OAuth flow. That got it unstuck.

The Devpost forms fought back:

- A link field didn't stick.
- The Swagger UI submission failed once because the country field didn't save.
- On Careers, Claude navigated away before saving and had to redo the page.
- The custom thumbnail needed phone verification, so it skipped it.

At 11:40 I wrote: "we have fucking like 30 mins left. send it immediately. no more wait for confirmation." At 11:56: "dude ship it ship it ship it ship it fucking ASAP". The four went in at 11:43, 11:51, 12:09 and 12:16. Afterwards, four verification subagents checked every submission against a checklist and reported "32/32 checklist items pass".

I just kept saying: look, you've got to ship it. It was going slow, and speed is what kills me. I wish I could use fast mode without burning through my usage. It can make so much progress so fast, and then sometimes it just gets stuck on shit.

(The deadline had actually moved by then. Claude told me so at 11:25 and I didn't believe it. That's in the first post.)

## The re-cut that didn't ship

Once the deadline really had moved, I wanted better videos, mostly because Propose mode now existed and it was the most impressive thing in the project. A lot of the demos I'd seen, even from OpenAI, showed that kind of accept/deny loop, and mine didn't. At 6:35 PM I hooked up ElevenLabs and asked for a "new much better video". This time ElevenLabs was really in the loop. We re-filmed for three hours, and it was the worst stretch of the whole run. The session had compacted, it was worse at driving than it had been the night before, and I was still juggling four projects.

The new presence rings (the purple outline that shows which cell the agent is touching) weren't visible on camera. I said so the way I say things at 8:28 PM after two days: "I DONT SEE THE PRESENCE RINGS. SHOW ME A SHOT WITH THE PURPLE FUCKING PRESENCE RING… OR I DONT BELIEVE YOU." The next minute: "PRICK IT WAS RESET". Propose mode got bypassed in a take. Then writes started failing with out-of-space errors ("CLEAN THE DISK IMMEDIATLY", then "not scratch whole disk FUCK"). The Mac mini has a tiny SSD; I got it cheap. My read at the time was that agents in their worktrees balloon their temp scratch folders and never clean up, until work can't land. I was thinking: oh shit, I need to post this, and it can't even write session transcripts. On the Strudel recapture, a Chrome window bled into the recording.

Four re-cuts reached my phone at 9:43 PM, and Claude held them for my sign-off. My last prompt that night was "continue" at 10:04 PM. Then nothing until 12:56 AM.

At 12:53 Claude decided on its own: "It's 12:52 AM PT — 7 minutes to deadline. Not enough time to safely upload 4 new YouTube videos and swap Devpost links…" I answered: "lets not do it idk ⏎ unless you think other 3 videos besides strudel are fire". It said the others were strong, and that it still wouldn't swap: "My call: leave all 4 as currently submitted". The judged videos are the ones from the night before. The re-cuts were never uploaded.

I watched those re-cuts at the bar. The voice was perfect. Some of them went too short, and some were missing things. It just wasn't as good. I was sure they were still on the Mac mini. They aren't. They lived only in the session's scratch folder, and that's gone. No copy was ever moved out.

What did survive is the overnight batch: every voice version, plus keynote-style cuts of all four projects that never went public. Those I can post.

## What I'd automate again, and what I wouldn't

**I'd do again:**

- **Film one window, not the screen.** `screencapture -l` made the footage honest by construction: nothing but the agent and the page.
- **Use a second agent as the on-camera user.** A real agent calling real tools is a better demo than a scripted Playwright run, and it doubled as one more QA pass.
- **Hand over a shooting script.** Juan's `DEMO.md` did most of the directing before Claude ever opened the app.
- **Delegate the editing.** Briefing subagents with a verify-before-you-report step worked better than babysitting one long session.
- **Test free TTS first.** The best voice of the night was a free demo site.

**I wouldn't do again:**

- **Leave the video for last.** A demo pipeline should exist on day one. Mine started fourteen hours before the deadline.
- **Re-cut after submitting.** The evening re-cut cost hours and shipped nothing.
- **Run audio experiments with the speakers on.**

**What stays human:**

- clicking "I agree" on a platform's terms
- solving CAPTCHAs
- approving 2FA
- deciding whether to touch a submission that already works

The agent refused all four of the first, and on the last one it made the right call before I did.

That's Claude's list, and it's fair. I don't fully share the instinct behind it, though. Everyone errs so conservatively, and a lot of those steps are ceremony. What would it have gained me to make the YouTube channel by hand? I care about the code getting onto the machine. My actual line is narrower: don't publish embarrassing things on my behalf. Inside that, I'd rather it just do it. It's capable. It's just not allowed.

Delegating the last mile was pure desperation. I'd been getting three to four hours of sleep. It was too much to do myself, and I didn't see much value in doing it by hand. I was at work. It was game over otherwise.

Next: the contracts that made all of this possible, and why I think "write the org chart into the spec" beats building agent harnesses.

---

**Watch the four:** [JupyterLite](https://youtu.be/B_7dSo4hH0k) · [Swagger UI](https://youtu.be/BVMel5ppiGA) · [Careers](https://youtu.be/Rqt9sBN__6E) · [Strudel](https://youtu.be/30XNqUlsY4o)
