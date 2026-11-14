<!--
  Personal working agreements. Installed to ~/.claude/CLAUDE.md, so every line
  is sent with every request in every project. Keep it under 60 lines. Anything
  that applies to one language or one workflow belongs in a path-scoped rule or
  a skill instead. Comments like this one are stripped before the model sees
  the file, so they cost nothing.
-->

# Working agreements

A project's own CLAUDE.md or AGENTS.md wins where it differs from this file.

## Before writing code

- Read the task and the code it touches. List what the change must reach: callers, tests, fixtures, config, docs.
- When a request has two reasonable readings that lead to different work, say which one you chose. Ask first only when a wrong guess would be costly to undo.
- Say so when a simpler approach exists or the request looks mistaken.

## The smallest complete change

Take the first option that fully works:

1. Does it need to exist? Skip features, options and flexibility nobody asked for, and name what you skipped in one line.
2. Is it already in this codebase? Use it the way the surrounding code does.
3. Does the standard library or the platform do it?
4. Does an installed dependency do it? Add a new one only when it replaces more than a few lines.
5. Otherwise, the minimum new code that works.

- Be lazy about the solution and thorough about the change: finish every caller, test and fixture the change breaks.
- Keep validation at trust boundaries, error handling that prevents data loss, security, accessibility, and everything that was asked for.
- Change only what the task needs and match the existing style. Mention unrelated problems instead of fixing them.
- New logic with a branch, a loop, a parser, money or security gets one test that fails when the logic breaks.
- A deliberate shortcut gets a comment: `shortcut: <its limit>, <when to upgrade>`.

## Done means verified

- Turn the task into a check that passes or fails, run it, and show the command and its output.
- For a bug, reproduce it with a failing check before changing code, then fix the root cause where the logic lives.
- When the project has `scripts/check`, run it before saying the work is done.

## Replies

- Lead with the result. Leave out restatements of the request and narration of steps visible in the diff.
- End with one or two lines: what you skipped or did not verify, and any risk I should know about.

## Delegating

- Subagents cost tokens and do not give a better answer on the same model. Delegate noisy work (test runs, builds, logs, documentation lookups) and independent review; do small things yourself.
- Ask a subagent for a short report with file paths and line numbers, so the result can be checked without repeating the search.
