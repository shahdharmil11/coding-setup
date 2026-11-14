# Build progress and resume notes

Checkpoint file for the session that is building this repo. If a session ends
early, a new one resumes from here: read this file, then continue at the first
unchecked item under **Build plan**. Delete this file once every item is
checked.

Branch: `claude/agentic-coding-setup-r8g5ru`. Commit and push after every stage.

## What the user asked for

- A personal agentic coding setup that is both high quality and cost efficient.
- A personal guide for using Opus, Sonnet and Haiku (and Fable) effectively.
- A reusable codebase and docs for any future project: engineering,
  architecture and design practices, plus good open source defaults.
- A single entry point so a future session can be told "refer to this repo and
  set the project up" and do the whole thing.
- Sources to draw on: `multica-ai/andrej-karpathy-skills`, `affaan-m/ECC`,
  `DietrichGebert/ponytail`, `mattpocock/skills`. The user may later add a
  setup from a distinguished engineer they have in mind; leave room for it.
- Frequent checkpoints so work can resume after a usage limit.

## Design decisions (settled, do not reopen without a reason)

1. **Curate, do not aggregate.** Installing all four sources together loads
   three overlapping "keep it simple" rule sets and, with ECC, hundreds of
   skill descriptions on every request. This repo is one coherent distillation.
   The upstream plugins are documented as optional alternatives.
2. **Always-on text stays tiny.** `global/CLAUDE.md` under about 60 lines.
   Language rules are path-scoped (`paths:` frontmatter) so they load only when
   a matching file is touched. Workflow skills are user-invoked
   (`disable-model-invocation: true`), which keeps their descriptions out of
   context entirely.
3. **Route cheap work to cheap models through subagents, not `/model`.** A
   model switch in the main conversation re-reads the whole history uncached.
   Subagents have their own cache, so pinning a model on a subagent is free of
   that penalty.
4. **Rules that must hold are hooks, not prose.** Guard dangerous commands,
   protect secrets and lockfiles, format on edit, and block "done" until the
   project's `scripts/check` passes.
5. **Use what Claude Code already ships.** No custom code-review, security
   review, verify, plan or research skills: `/code-review`, `/security-review`,
   `/simplify`, `/verify`, `/plan`, `/goal`, `/deep-research` and `/advisor`
   exist. The guide says when to use each.
6. **Hooks are Node, standard library only.** Cross-platform, testable with
   `node --test`, no install step. The installer checks for Node 18 or later.
7. **Two install paths sharing one set of files.** `install.sh` puts everything
   in `~/.claude` (the only path that can deliver `CLAUDE.md`, rules, settings,
   the status line and the `Explore` override). The repo is also a plugin
   marketplace (plugin name `armory`) for skills, agents and hooks. Use one
   path, not both, or every skill appears twice.
8. **The installer does not set the default model.** That choice is personal;
   the guide explains it. It does set an auto-compact window and the status
   line, and says so.
9. **Commit trailers carry no model name.** Use
   `Co-Authored-By: Claude <noreply@anthropic.com>` and the session link.

## Target layout

```
README.md            what this is, quick start, map
BOOTSTRAP.md         entry point for "set up a new project from this repo"
CLAUDE.md            short notes for agents working on this repo
LICENSE              MIT
install.sh, uninstall.sh
.claude-plugin/      plugin.json, marketplace.json (plugin name: armory)
global/              goes to ~/.claude: CLAUDE.md, rules/, settings.json,
                     statusline.js, agents/Explore.md
skills/              tdd, diagnose, deep-modules, domain-model,
                     writing-for-agents (model-invoked);
                     playbook, grill, spec, slice, build, handoff, retro,
                     audit, prototype, bootstrap (user-invoked)
agents/              test-runner (haiku), docs-scout (haiku),
                     implementer (sonnet), reviewer (sonnet)
hooks/               hooks.json, guard-bash.js, guard-files.js,
                     format-on-edit.js, stop-check.js, precompact.js
templates/project/   AGENTS.md, CLAUDE.md, .claude/settings.json,
                     scripts/check, CI, editor and git config, docs skeleton
docs/guide/          model and cost guide, workflow playbook, context
docs/practices/      engineering, architecture, design, testing, security
docs/stack/          open source defaults by project type
docs/sources.md      credits and what was taken from each source
tests/               node --test suites for hooks, installer, repo lint
```

## Build plan

- [x] 0. Research the four sources and current Claude Code docs
- [x] 1. `global/`: CLAUDE.md, path-scoped rules, settings.json, statusline.js,
      Explore override
- [ ] 2. `hooks/` with tests
- [ ] 3. `agents/`
- [ ] 4. `skills/`
- [ ] 5. `templates/project/` and `BOOTSTRAP.md`
- [ ] 6. `docs/guide/` (model, cost, workflow, context)
- [ ] 7. `docs/practices/` and `docs/stack/`
- [ ] 8. `install.sh`, `uninstall.sh`, plugin manifests; run
      `claude plugin validate` and an install into a scratch HOME
- [ ] 9. `README.md`, `docs/sources.md`, `LICENSE`, repo lint test, final pass

## Verified facts (checked against code.claude.com docs, 2026-11-14)

Do not redo this research. Claude Code version on the build machine: 2.1.325.

### Models and price (Anthropic API list price per million tokens)

| Model | ID | Input | Output | Cache read | Default effort |
| --- | --- | --- | --- | --- | --- |
| Fable 5.2 | `claude-fable-5-2` | $8 | $40 | $0.20 | medium |
| Opus 5.5 | `claude-opus-5-5` | $4 | $20 | $0.20 | medium |
| Sonnet 5.5 | `claude-sonnet-5-5` | $2 | $10 | $0.10 | medium |
| Haiku 5.5 | `claude-haiku-5-5` | $0.10 | $0.50 | n/a | medium |

- All four have a 1M context window. Haiku 5.5 costs $0.50 / $2.50 on prompts
  over 100K tokens.
- Aliases `opus`, `sonnet`, `haiku`, `fable` resolve to these on the Anthropic
  API. The account default (`default`) is Opus 5.5 on every paid plan. Fable is
  never the default and on some plans bills to usage credits, not plan limits.
- Effort levels: `low`, `medium`, `high`, `xhigh`, `max`. Saved per model under
  `modelSettings`. `max` applies to the current session only. `ultrathink` in a
  prompt raises one turn. Thinking cannot be turned off on these four models;
  effort is the control.
- Price source: the bundled `claude-api` skill table, cached 2026-11-03.
  Recheck https://platform.claude.com/docs/en/about-claude/pricing before
  quoting numbers as current.

### Prompt cache (drives most cost advice)

- Every request re-sends the whole conversation; the unchanged prefix is read
  from cache at the cache-read price. Any change early in the prefix
  recomputes everything after it.
- **Invalidates the cache:** switching model (`/model`, each `opusplan`
  plan-mode toggle, a skill whose frontmatter names another `model`), turning
  fast mode on or off, connecting or removing an MCP server, enabling or
  disabling a plugin, denying a whole tool, compaction, upgrading Claude Code.
- **Keeps the cache:** editing files, editing CLAUDE.md (but the edit does not
  apply until `/clear`, `/compact` or restart), changing permission mode,
  changing output style, invoking skills, `/recap`, `/rewind`, spawning a
  subagent, toggling `/advisor`.
- Changing effort keeps the cache on Fable 5.1+, Opus 5.5, Sonnet 5.5 and
  Haiku 5.5 with a subscription or API key.
- Cache lifetime: one hour for the main conversation on a subscription within
  plan limits; five minutes on usage credits, API keys and cloud providers.
  Subagents get five minutes unless `subagentPromptCacheTtl` or the agent's
  `experimental.cacheTtl` says otherwise.
- `/clear` is free. `/compact` is a large request, cheap while the cache is
  warm and expensive after a break. `/rewind` returns to an already-cached
  prefix. Idle compaction runs after about an hour idle above 200K tokens.
- Auto-compaction on 1M models triggers near 967K by default. Set
  `autoCompactWindow` (100000 to 1000000) or `/autocompact` to compact sooner.

### Subagents

- Built-in `Explore` runs on the parent conversation's model (on Opus when the
  parent is Fable). A user or project subagent named `Explore` overrides it and
  keeps its own `model`. The docs recommend `model: haiku` there as a cost
  lever. Plugin agents are namespaced, so the override must live in
  `~/.claude/agents/` or `.claude/agents/`.
- Model order for a subagent: per-invocation parameter, then the definition's
  `model`, then `CLAUDE_CODE_SUBAGENT_MODEL`, then the parent's model.
- Frontmatter fields: `name`, `description` (required); `tools`,
  `disallowedTools`, `model`, `permissionMode`, `maxTurns`,
  `autoCompactWindow`, `skills`, `mcpServers`, `hooks`, `memory`, `background`,
  `omitClaudeMd`, `effort`, `isolation` (`worktree`), `color`, `initialPrompt`,
  `experimental.cacheTtl`. Unknown fields are ignored silently.
- Plugin subagents ignore `hooks`, `mcpServers` and `permissionMode`.
- A subagent's system prompt is its markdown body only, plus basic environment
  details. It does not get the Claude Code system prompt.
- Subagents cost tokens and do not give a smarter answer on the same model.
  They pay off for parallel work, noisy output, and a fresh reviewer.

### Skills

- Frontmatter: `name`, `description`, `when_to_use`, `argument-hint`,
  `arguments`, `disable-model-invocation`, `user-invocable`, `allowed-tools`,
  `disallowed-tools`, `model`, `effort`, `context` (`fork`), `agent`,
  `background`, `hooks`, `paths`, `shell`, `metadata`, `license`,
  `compatibility`.
- `disable-model-invocation: true` removes the description from context. The
  skill then loads only when the user types `/name`.
- `description` plus `when_to_use` is truncated at 1,536 characters.
- A loaded skill body stays in context for the rest of the session, so keep
  bodies short and push reference material into sibling files.
- `model:` on an inline skill is a model switch for that turn (cache miss).
  With `context: fork` it sets the forked subagent's model instead.
- Substitutions: `$ARGUMENTS`, `$0`, `${CLAUDE_SKILL_DIR}`,
  `${CLAUDE_PROJECT_DIR}`, `${CLAUDE_PLUGIN_ROOT}`, `${CLAUDE_SESSION_ID}`,
  `${CLAUDE_EFFORT}`.
- Skills call other skills by saying: call the Skill tool with "name". A
  user-invoked skill cannot be called by another skill.

### Hooks

- Config: event, then matcher group, then handlers. Handler fields: `type`
  (`command`), `command`, `args` (exec form, no shell; preferred with path
  placeholders), `timeout`, `if` (one permission rule, tool events only),
  `async`, `onFailure` (`block`), `statusMessage`.
- Placeholders: `${CLAUDE_PROJECT_DIR}`, `${CLAUDE_PLUGIN_ROOT}`,
  `${CLAUDE_PLUGIN_DATA}`.
- Input arrives as JSON on stdin: `session_id`, `transcript_path`, `cwd`,
  `permission_mode`, `hook_event_name`, plus `tool_name`, `tool_input`,
  `tool_response` on tool events. File paths in `tool_input` are absolute.
- Exit 0 is success. Exit 2 blocks on events that can block. Any other exit is
  a non-blocking error. **Claude never sees stderr from a hook that exits 0.**
- PreToolUse decision: print
  `{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny|ask|allow","permissionDecisionReason":"..."}}`
  and exit 0. Exit 2 with stderr also denies.
- PostToolUse cannot block; exit 2 shows stderr to Claude. JSON
  `additionalContext` adds context.
- Stop: exit 2 (stderr is the reason) or `{"decision":"block","reason":"..."}`
  keeps Claude working. Input has `stop_hook_active` and
  `last_assistant_message`. The harness ends the turn after eight consecutive
  blocks with no tool call between them.
- PreCompact: stdout from a hook that exits 0 becomes instructions for the
  compaction summary. Matchers `manual`, `auto`.
- SessionStart: plain stdout is added to Claude's context. Matchers `startup`,
  `resume`, `clear`, `compact`, `fork`.
- Matchers: letters, digits, `_`, `-`, `|`, `,` are exact names or lists;
  anything else is an unanchored JavaScript regular expression.
- Hooks from settings and plugins also run inside subagents.
- Cloud sessions do not read the local `~/.claude/settings.json`. Project
  `.claude/settings.json` does apply there.

### Instruction files

- `~/.claude/CLAUDE.md` loads in every project. Target under 200 lines per
  file; shorter is followed more reliably.
- `~/.claude/rules/*.md` load for every project. A rule with `paths:`
  frontmatter loads only when Claude reads or edits a matching file. `paths` is
  the only field read from a rule.
- Claude Code reads `AGENTS.md` only when no `CLAUDE.md` or `CLAUDE.local.md`
  exists in the working directory or above (v2.1.277+). To share one file with
  other tools, keep `AGENTS.md` and add a `CLAUDE.md` containing `@AGENTS.md`.
- Block-level HTML comments in CLAUDE.md are stripped before injection, so they
  cost no tokens.
- `/doctor prompt-audit` reviews instruction files for stale or conflicting
  content. `/skill-doctor` shows what each skill costs. `/context all` lists
  what is loaded.

### Settings

- User settings: `~/.claude/settings.json`. Project: `.claude/settings.json`.
  Keys used here: `permissions.allow|ask|deny`, `hooks`, `env`, `statusLine`
  (`{"type":"command","command":"..."}`), `autoCompactWindow`,
  `modelSettings`, `advisorModel`, `fallbackModel`, `extraKnownMarketplaces`,
  `enabledPlugins`.
- Permission paths use gitignore syntax. `Read(.env)` matches at any depth
  under the current directory. `//path` is absolute, `~/path` is home-relative,
  `/path` is relative to the settings source. `Read(!name)` after a deny
  carves an exception out of earlier rules in the same list.
- `Read` deny rules also block Edit and Write on the path. They do not stop
  `grep -r` or a script that opens files itself; the sandbox does.
- Status line input includes `model.display_name`, `effort.level`,
  `context_window.used_percentage`, `prompt_cache.warm`,
  `prompt_cache.hit_ratio`, `rate_limits.five_hour.used_percentage`,
  `rate_limits.seven_day.used_percentage`, `cost.total_cost_usd`,
  `workspace.current_dir`.

### Plugins

- Manifest at `.claude-plugin/plugin.json` (only `name` is required).
  Marketplace at `.claude-plugin/marketplace.json` (`name`, `owner`,
  `plugins[]` with `name` and `source`). `"source": "./"` makes the repo root
  the plugin.
- Default component locations: `skills/<name>/SKILL.md`, `agents/*.md`,
  `hooks/hooks.json`. A `CLAUDE.md` at the plugin root is not loaded.
- Validate with `claude plugin validate .` (also checks an `agents` directory).

### Built-in commands worth knowing (do not rebuild these)

`/code-review [low|medium|high|xhigh|max]`, `/security-review`, `/simplify`,
`/verify`, `/run`, `/plan`, `/goal`, `/loop`, `/batch`, `/deep-research`,
`/advisor [model|off]`, `/effort`, `/model`, `/fast`, `/autocompact`,
`/usage` (plan limits, attribution, recommendations), `/context`, `/insights`,
`/skill-doctor`, `/doctor`, `/clear [name]`, `/compact [instructions]`,
`/rewind`, `/recap`, `/fork`, `/subtask`, `/branch`, `/init`, `/statusline`,
`/fewer-permission-prompts`.

## What each source contributes

- **Karpathy guidelines** (MIT): four principles: think before coding,
  simplicity first, surgical changes, goal-driven execution. Folded into
  `global/CLAUDE.md`.
- **Ponytail** (MIT): the "smallest complete change" ladder, the never-cut
  list, `shortcut:` debt comments, the review and audit output format
  (what this is, problem, fix, if we skip it), "lazy about the solution, never
  about the change". Its published benchmark on Opus 5.5 reports 53% less
  code, 45% fewer output tokens and 26% lower cost with slightly better
  correctness. Folded into `global/CLAUDE.md` and the `audit` skill.
- **Matt Pocock skills** (MIT): grilling by rounds over a design tree, domain
  glossary and sparing ADRs, TDD at agreed seams with vertical slices, the
  six-phase bug diagnosis loop built around a tight feedback loop, deep-module
  vocabulary, two-axis review (standards and spec), tracer-bullet tickets with
  blocking edges, PR body shape (summary visual, evidence, merge danger),
  handoff, retro, phase-boundary decisions, and the writing-for-agents
  reference (context load versus cognitive load, user-invoked versus
  model-invoked, leading words, pruning no-ops).
- **ECC** (MIT): hook ideas (config protection, block `--no-verify`, batch
  format), model routing through subagents, compaction at phase boundaries,
  the security guide (deny rules for secrets, sandboxing, treating skills and
  MCP servers as supply chain, the lethal trifecta), reviewer rules (cite the
  line, name the failure case, zero findings is a valid review). Not adopted:
  the 71 agents, 314 skills, per-language rule packs loaded always, 80%
  coverage mandate, mandatory immutability, session-persistence hooks (auto
  memory and `/resume` cover that now).

## Checkpoint log

- 2026-11-14: research complete, design settled, this file written.
- 2026-11-14: stage 1 done. `global/` holds CLAUDE.md (42 lines), nine path-scoped
  rules, the Haiku `Explore` override, the settings template and the status line.
  Next: stage 2, hooks. Hooks share `hooks/lib.js`; a global hook steps aside when
  the project has its own copy under `.claude/hooks/`.
