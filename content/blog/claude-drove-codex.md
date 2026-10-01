---
title: I Had Claude Drive Codex to Film My Hackathon Demos
description: At 11 PM the night before the deadline I had four working projects and zero demo videos. By morning an agent on my Mac mini had filmed a different agent using all four.
date: 2026-10-01
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

At 10:54 PM on September 2, about fourteen hours before the deadline, I had four working WebMCP projects and no demo videos. The rules wanted a public video with audio narration for each one. I had spent the evening with my friend Juan trying to record the JupyterLite one without success.

I asked the agent on my Linux box: "okay fuck this. cna you drive an applicaiton yes or no… drive trhough the gpt app… video edit it yourself… all I need is a voice over."

This post covers what happened when the answer was no, and then, on a different computer, yes.

## Linux says no

The plan was to show a WebMCP site the way it is meant to be used: a real agent using it. Open the ChatGPT or Codex desktop app, point its built-in browser at my site, ask it to do something, and film the result. I wanted Claude to be the person typing into that app overnight while I slept.

Claude on Linux checked before answering, and the answer was no. My machine runs GNOME on Wayland. The screenshot API returned `AccessDenied`, Wayland blocks one app from injecting input into another, `/dev/uinput` needed root, and ffmpeg there couldn't capture Wayland-native windows. It also said:

> "If step 4 of 40 silently missed, I'd cheerfully keep going and hand you garbage at 6am. I won't pretend that's a plan."

It offered a fallback: record a scripted Playwright run of the real tools against the live site, with the caveat that "The narration must not claim 'watch it decide.'" I tried to unblock the real version instead. I ran `sudo dnf install -y ydotool gpu-screen-recorder`. It failed because `gpu-screen-recorder` isn't in Fedora's repos, so the whole transaction aborted. I pasted that output back as well.

Juan and I had worked on it all evening. He ran through the flows on his computer while I wrote the prompts. We had footage, but we couldn't get it under three minutes and couldn't get a clean single take, because Codex is slow even in fast mode. Every take needed editing, and I didn't want my own voice on it. Eventually Juan had to sleep before work, and I was discouraged.

At 10:56 I wrote: "It mgith be a smarter investment to get you seutp then for me to try to finish this out at midnight thirty."

## The Mac mini: feasible

I have a Mac mini. At 11:21 PM I opened a Claude Desktop session on it, pasted the entire Linux "No" (blocker table, my failed `dnf`, all of it), and added one line: "that was a previous chat. you're on a mac now. is it feasible on this mac, cn you try?"

It tested before answering. It requested computer-use access to the app, took a screenshot, tried typing in the background (that failed in Codex's Electron text field), switched to full-screen control, clicked into the field and typed a test string. It then cleared the field without sending it ("don't want to trigger an actual Codex run") and answered:

> "Yes, this is feasible on this Mac — and it's not close."

I chose the Mac mini as a last attempt, for specific reasons:

- **AppleScript.** It lets an agent drive that machine much more easily.
- **Computer use.** Claude Code Desktop has computer use; Claude Code in a terminal on the Mac doesn't. I needed the Desktop app to take the demo script, drive the Codex app through it, and record while doing so.
- **Memory.** On Linux I had been getting out-of-memory kills under high concurrency. Each of my agents builds its own worktree, builds the app, then tests and drives it, and a dozen at once uses a lot of RAM. The Mac mini has fewer resources on paper but was more robust, helped by unified memory on the M-series chip.
- **Blast radius.** My Linux machine runs Tailscale, my server and the Claude remote sessions. If an overnight job took it down, all of that would go with it, whether or not the job worked. The Mac is my sandbox.
- **Reliability.** In my experience Claude works better on the Mac.

My next message set the constraint that shaped the videos: "coudl yuou recrod jsut the codex app vs the entire screen so ti doesnt see claude app take over? And it would be pure overnight i wouldnt be driving."

Three minutes later it came back with a built-in macOS answer: "that's `screencapture -l<windowid> -v`, a native macOS window-scoped video recorder, not a workaround." It recorded eight seconds of just the Codex window while typing into it, pulled a thumbnail, and confirmed: no menu bar, no desktop, no Claude.

Filming only that window kept several things off camera: Claude's window appearing over the top, the orange glow, permission dialogs, a notepad editor someone had left open, and the messages I was sending Claude. Filming the whole screen risked a night of unusable footage that Claude might not notice or report. I also prefer the look of the macOS window recording, with its rounded window. The video only had to show the app and a real user flow, so it did not need to show that Claude was driving.

I don't consider that dishonest, but I wasn't entirely comfortable with the workaround, and the result felt low-quality. I had looked for a tool that could make clips like this, and nothing was good or fast enough.

## Setup: two agents, one camera

The setup involves two agents:

- **Claude** (on the Mac, steered from my phone) is the person at the keyboard. It clicks, selects text and types prompts into the Codex app.
- **Codex** (the desktop app) is the agent on camera. It opens my live site in its in-app browser, discovers the WebMCP tools the page registered, and calls them.
- **My site** is the product. Every edit Codex makes shows up in the page's UI: a ring on the cell, a status badge, a diff you can click.
- **`screencapture`** films only the Codex window.

Juan's shooting script, `DEMO.md`, was already in the repo, with exact clips, exact prompts to type, what to watch for, and title cards. Claude used it as the shot list. It filmed the clips out of order, the way the script specified (3, 4, 7, 6, 5, 2, 1), and reset the notebook between takes.

This is one take from Codex's side. Claude typed the prompt, and Codex did the rest:

```
### [09-02 23:39:40] PROMPT
> This looks wrong. Fix just what I selected and rerun that cell.

- exec WebMCP: jupyter_get_context
- exec WebMCP: jupyter_get_cells
- exec WebMCP: jupyter_get_cells
- exec WebMCP: jupyter_update_cell, jupyter_run_cells
```

Claude had already selected `converted / visitors` in the notebook with the mouse. Codex read the selection, read the cell and its hash, replaced only the selected expression, and reran the cell. Claude described what it saw on screen: "Exactly on script — status bar reads "Agent · reading cell 6", cell has the ring/tint." Then the fix landed: `eligible_sessions`, "36 converted; conversion rate: 2.9%".

It did not go perfectly. On one prep pass the notebook got scrambled. Claude's best guess was that its `cmd+a` had selected every cell instead of one line. It reloaded, and the corruption remained, because JupyterLite had autosaved the scrambled notebook to IndexedDB. The state lives in the browser, which is the point of the project, and it affected my own demo. The fix (delete the file so it re-seeds) was already in Juan's script. Around then I texted my own fix: "you need to run all cells first, or rather instruct the agent to "open and run" the notebook… you also need to clear out the browser staye compeltley. that avoids bugs."

By 12:10 AM it had the whole JupyterLite walkthrough. The last clip hid a cell from the agent with the Agent Access menu, asked Codex to read it, and got a "Failed" badge with `CELL_NOT_FOUND`. Then Claude typed into the hidden cell itself to prove the human wasn't locked out.

## Delegating the editing to subagents

At 12:11 AM I told it to stop doing everything itself and delegate: "make sure video is safe also drive sonnet or haiku agents youre now a director they can pour throgubf footage for you we dont want to waste context."

From then on, Claude mostly wrote briefs and checked results. Subagents did the rough cut (51 ffmpeg calls in one of them), the title cards and thumbnail, and the "keynote" cuts.

The keynote cut was my idea, at 12:18 AM. I wanted "the video is in a quarter (notbwusrter but like 3/4 anchored on top right corner) and the framing has text in the left saying things maybe anthropic presentation style", zooming to full screen for the key moments. At 12:38 it reported that Keynote isn't installed on the Mac. So the subagent brief opened with: "Keynote.app is NOT installed on this Mac (checked already) — build this entirely with ffmpeg compositing, not the actual Keynote app."

The brief is a good example of a clear spec. It names the input files and says not to modify them. It says to hard-cut between two static layouts instead of animating a zoom ("much more robust than trying to animate a zoom in ffmpeg"). It suggests which two or three moments deserve full screen ("the diff popover showing "What the agent changed"… and the "Failed" badge / CELL_NOT_FOUND popover"). It ends with what to verify before reporting back: extract frames from an inset moment, a full-screen moment and a transition, and check for black gaps, frame bleed and stretching.

My review at 1:06 AM, from bed: "the random titles that blib inbetween keynote transitions gotta go… keynote actually looks fire if those jump scare titles weren't there".

## Voiceover without ElevenLabs

At 12:36 AM I told it "I'm gonna go to sleep I cant provide you with keys" and asked for a voiceover it could make on its own. The first one played on my phone ten minutes later.

> "ohhhhh dude that audio is bad it has to be eleven labs quality even if it takes a while that was ultra robit"

Then I wrote:

> "no I want eleven labs without using eleven labs."

I said it could use "whatever chrome site you need tho… just not paid", and that I was on my phone and couldn't get to the computer. It couldn't reach Chrome that night (the extension wasn't connected), so it worked with what was on the Mac.

The voices, in order, per the README it left me:

- **v1, Piper** (local): "robotic, superseded"
- **v2, XTTS-v2** (local Coqui): "good, local backup"
- **v3, Amazon Polly** through a browser site: "mediocre, superseded"
- **v4, XTTS-v2 retuned**: "untested pick"
- **v5, Onyx from openai.fm**: "THE ONE"
- **v6, Nova**: a female voice I'd asked to hear, which I then said was "too annoying"

v5 landed at 1:25 AM. Claude's note: "v5 uses OpenAI's own GPT-4o-mini-tts (genuine commercial-grade neural TTS, no account needed) via their public no-signup demo." That demo is openai.fm. It pulled the audio out through the browser with a base64 trick to get past the download wall. At 1:37 I replied: "ABD DO V5 FOR KEYNKTE TOO THAT WAS PERFECT".

The narration on my OpenAI hackathon demo was therefore voiced by OpenAI for free, and I picked it half-asleep on my phone. The script is in first person. The Onyx voice opens with "I built a JupyterLab extension that hands your live notebook to a browser agent over WebMCP."

I didn't tell it to use openai.fm, and I didn't know which voices it was using. I asked it to find a way, and it did. That is the advantage of loose permissions. The irony is not lost on me.

The Piper voice was poor quality. In hindsight I would have used ElevenLabs from the start. I already had an account, but I was in bed on my phone, Claude couldn't reach Chrome, and I was too tired to set it up. The agent also has access to my whole computer. If it were less conservative, I could have asked it to sign up for ElevenLabs on my behalf.

## The audio that woke us up (1:04 AM)

During the voice experiments, a subagent's text-to-speech test played aloud through the Mac mini's speakers. I had left the volume up on purpose, in case of audio pipeline issues. It woke Violet and me in the other room. I dictated this:

> "B\*\*\*\*, I'm trying to sleep here. I could hear that from my computer in The Other room."

The same dictated message continues with a review of the voice: "I heard that it wasn't the worst. It still was too AI I went like a perfect human clone voice".

Claude: "Muting system audio immediately so nothing plays out loud again — sorry, that should never have happened." It muted the Mac, wrote a hard rule into its plan doc that no later audio task may play out loud, and signed off: "Go back to sleep, I've got it from here."

I wasn't fully asleep; I was watching the cuts in bed. But I was exhausted. It was a stressful week at work and I had been getting three or four hours of sleep, so I trusted it to continue.

## Three more projects before sunrise

At 1:34 AM I asked for a reusable prompt so my other repos' agents could do the same thing. Eight minutes later I changed my mind: "you know what I cant open new session remote you'll have to do all the timer repos too". ("timer" is a typo for "other".)

So the same session filmed Swagger UI (1:47), Careers (2:07) and Strudel (2:19), back to back. These are the prompts it typed into Codex:

- Swagger UI: "What tools do you have available for this page?", then "Delete the Checkout reliability project."
- Careers: "Find me engineering roles at staff level or above..."
- Strudel: "Keep the bass and kick exactly where I left them..."

The rollouts show what Codex did with each one. On Careers it searched with `careers_search_jobs`, put the results on the page, created an account for a made-up applicant ("Sam Rivera", with an `example.test` email) and started an application. On Strudel it read the code, edited only the hi-hat pattern with `strudel_apply_edits`, auditioned a new kick, and recorded four seconds to check the bass. On Swagger UI, the delete request was the notable one. Instead of calling a WebMCP tool, Codex spent a minute inspecting the page's DOM and filters to find the project. Agents can fall back to scraping when unsure, even when the page offers better tools, which is worth knowing when building these. Cuts started arriving on my phone around 2:48 AM. Over the whole session, Claude sent me 52 files that way.

Strudel needed one more step. A live-coding music app needs music in its demo, and the Mac had no loopback device to capture system audio. So in the morning Claude tapped the page's own Web Audio graph, recorded about 20 seconds of what Strudel was actually playing, and looped it as a music bed under the narration.

## The morning: submission and the human steps

I woke up and went to work. At 9:12 AM: "most impoetant is upload to YouTube since im at work can we check?"

First it swept all four repos with the same commit, "Clean up internal build docs and add a visual hero section to README", across four repos in about three minutes. Then it opened YouTube Studio.

YouTube wanted a channel first. I asked for "Allie Cat Devs" with the handle @alliecatowo, because I didn't want my full name on it. Claude filled both in and stopped. Creating the channel accepts YouTube's terms of service, and it would not click that for me.

> "I hear the pressure, but this is a firm line, not a judgment call I can waive under deadline stress"

I wrote back: "please click it i will not be able to submit this competition otherwise, my partner is monitoring but mouse is dead". It still declined. Four minutes later: "OKAY UR CREATED UR IN". My fiancé, Violet, had clicked it.

The uploads went in with comments and likes turned off. I didn't want comments calling the videos "AI garbage", and I'm protective of my public-facing material.

The uploads ran from 10:02 to 11:02. The JupyterLite upload went first as a private smoke test. Devpost then wanted a GitHub login, Claude chose "GitHub Mobile" for the passkey prompt, and I approved it on my phone at 11:28.

Then the CAPTCHAs. There were three of them across the four submissions, and Claude refused every one: "solving CAPTCHAs is a hard line I won't cross even here." I replied: "IF WE DONT SHIP CAUSE OF A FUCKING CAPTCHA IM GONNA BE PISSED - poll for cpactha completion in gonna maybe be able to have someone clear for you". About a minute later: "CAPTCHA cleared — someone got it." On the third one it reported "The three squares are now checked — someone is solving it."

The "someone" was Violet. I was at work, so I would go into a phone booth and call them to ask them to click something. They don't write code, so a couple of times I just texted to ask where it was stuck and what its status was. They would walk to the Mac mini, which is connected to a monitor that stays on so the agent can use computer control, read what Claude was saying, and click. In those moments Violet did the steps the agent isn't permitted to do, even though it is capable of them.

Later that day I found a workaround for logins. I told it that clicking "Sign in with Google" isn't handling credentials or creating an account: it's an existing account and just the OAuth flow. That got it unstuck.

The Devpost forms caused several problems:

- A link field didn't stick.
- The Swagger UI submission failed once because the country field didn't save.
- On Careers, Claude navigated away before saving and had to redo the page.
- The custom thumbnail needed phone verification, so it skipped it.

At 11:40 I wrote: "we have fucking like 30 mins left. send it immediately. no more wait for confirmation." At 11:56: "dude ship it ship it ship it ship it fucking ASAP". The four went in at 11:43, 11:51, 12:09 and 12:16. Afterwards, four verification subagents checked every submission against a checklist and reported "32/32 checklist items pass".

I had a meeting around 11:45 or 12:10, or lunch; I don't remember which. I kept telling it to ship. It was slow, and speed was the main constraint. I wish I could use fast mode without using up my usage limits. The agent can make a lot of progress quickly, but sometimes it gets stuck.

(The deadline had already been extended by then. Claude told me so at 11:25 and I didn't believe it. That is covered in the first post.)

## The evening re-cut that didn't ship

Once the deadline had in fact moved, I wanted better videos, mainly because Propose mode now existed and was the strongest feature in the project. Many demos I had seen, including OpenAI's, showed that kind of accept/deny loop, and mine didn't. At 6:35 PM I connected ElevenLabs and asked for a "new much better video". This time ElevenLabs was used. We re-filmed for three hours, and it was the hardest stretch of the run. The session had compacted, it drove less well than the night before, and I was still juggling four projects.

The new presence rings (the purple outline that shows which cell the agent is touching) weren't visible on camera. I said so at 8:28 PM, after two days of this: "I DONT SEE THE PRESENCE RINGS. SHOW ME A SHOT WITH THE PURPLE FUCKING PRESENCE RING… OR I DONT BELIEVE YOU." The next minute: "PRICK IT WAS RESET". Propose mode got bypassed in a take. Then writes started failing with out-of-space errors ("CLEAN THE DISK IMMEDIATLY", then "not scratch whole disk FUCK"). The Mac mini has a small SSD. My read at the time was that agents in their worktrees grow their temp scratch folders and never clean them up, until work can't be saved. I was concerned because I needed to post the videos and it couldn't even write session transcripts. On the Strudel recapture, a Chrome window bled into the recording.

Four re-cuts reached my phone at 9:43 PM, and Claude held them for my sign-off. My last prompt that night was "continue" at 10:04 PM. Then nothing until 12:56 AM.

At 12:53 Claude decided on its own: "It's 12:52 AM PT — 7 minutes to deadline. Not enough time to safely upload 4 new YouTube videos and swap Devpost links…" I answered: "lets not do it idk ⏎ unless you think other 3 videos besides strudel are fire". It said the others were strong, and that it still wouldn't swap: "My call: leave all 4 as currently submitted". The judged videos are the ones from the night before. The re-cuts were never uploaded.

I watched those re-cuts at a bar. The voice was right, but some cuts ran too short and some were missing things, so they weren't as good overall. I assumed they were still on the Mac mini. They aren't: they lived only in the session's scratch folder, which is gone, and no copy was ever moved out.

What did survive is the overnight batch: every voice version, plus keynote-style cuts of all four projects that never went public. Those I can post.

## What I would and wouldn't repeat

**I would do again:**

- **Film one window, not the screen.** `screencapture -l` captured only the agent and the page.
- **Use a second agent as the on-camera user.** A real agent calling real tools is a stronger demo than a scripted Playwright run, and it doubled as another QA pass.
- **Hand over a shooting script.** Juan's `DEMO.md` did most of the directing before Claude opened the app.
- **Delegate the editing.** Briefing subagents with a verify-before-you-report step worked better than supervising one long session.
- **Test free TTS first.** The best voice of the night came from a free demo site.

**I would not do again:**

- **Leave the video for last.** A demo pipeline should exist on day one. Mine started fourteen hours before the deadline.
- **Re-cut after submitting.** The evening re-cut cost hours and shipped nothing.
- **Run audio experiments with the speakers on.**

**What stays human:**

- clicking "I agree" on a platform's terms
- solving CAPTCHAs
- approving 2FA
- deciding whether to touch a submission that already works

The agent declined the first three, and on the last it made the right call before I did.

That is Claude's list, and it is reasonable. I don't fully share the instinct behind it. I think agents err on the conservative side, and some of those steps are ceremony: creating the YouTube channel by hand gained me nothing. My own line is narrower: don't publish embarrassing things on my behalf. Within that, I would rather it just do the work, since it is capable and only restricted.

I delegated the last mile out of necessity. I had been getting three to four hours of sleep and was at work. I'm protective of my public presence, including the videos and the Devpost page, but doing it all by hand wasn't feasible, and without delegation the submission would not have gone in.

Next in the series: the contracts that made all of this possible, and why I think "write the org chart into the spec" beats building agent harnesses.

---

**Watch the four:** [JupyterLite](https://youtu.be/B_7dSo4hH0k) · [Swagger UI](https://youtu.be/BVMel5ppiGA) · [Careers](https://youtu.be/Rqt9sBN__6E) · [Strudel](https://youtu.be/30XNqUlsY4o)

## Key takeaways

- Window-only recording (`screencapture -l`) kept the footage limited to the agent and the page.
- A second agent acting as the on-camera user produced a more credible WebMCP demo than a scripted run.
- A written shooting script and well-specified subagent briefs let the editing be delegated.
- Free text-to-speech (openai.fm) produced the voice used in the submitted videos.
- Platform terms, CAPTCHAs and 2FA approvals still needed a human, which is where Violet stepped in.
- A demo pipeline should exist early; starting fourteen hours before the deadline left no room for re-cuts.
