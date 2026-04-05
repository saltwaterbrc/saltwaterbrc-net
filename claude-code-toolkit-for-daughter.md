# Claude Code Toolkit — Brian's Setup Guide

This is a guide to all the customizations, automations, and tools Dad has built with Claude Code over the past couple months. Copy the pieces you want into your own `~/.claude/` directory.

---

## Table of Contents
1. [What is Claude Code?](#what-is-claude-code)
2. [Directory Structure](#directory-structure)
3. [MCP Servers (Connected Tools)](#mcp-servers)
4. [Session Auto-Summarizer Hook](#session-auto-summarizer-hook)
5. [Scheduled Tasks](#scheduled-tasks)
6. [Specialized Agents Available](#specialized-agents)
7. [Skills (Slash Commands)](#skills)
8. [Project SKILL.md (CLAUDE.md Alternative)](#project-skillmd)
9. [Obsidian Integration](#obsidian-integration)
10. [How to Set It Up](#how-to-set-it-up)

---

## What is Claude Code?

Claude Code is Claude running as a CLI/desktop agent that can read/write files, run shell commands, browse the web, and use tools. It's like having Claude as a pair programmer/assistant that lives in your terminal and has access to your filesystem.

Key concepts:
- **`~/.claude/`** — Global config directory (settings, hooks, scheduled tasks)
- **`.claude/`** (in a project) — Project-level config (SKILL.md, settings.local.json)
- **`CLAUDE.md`** (in a project root) — Instructions Claude reads at the start of every conversation in that project
- **Skills** — Markdown files that teach Claude how to do specific things (like slash commands)
- **Hooks** — Shell scripts that run automatically on events (session start, stop, tool calls)
- **MCP Servers** — External tools Claude can connect to (Cloudflare, Gmail, Obsidian, etc.)
- **Scheduled Tasks** — Cron-like jobs that run Claude on a schedule

---

## Directory Structure

```
~/.claude/
  settings.json          # Global settings (MCP servers, hooks)
  hooks/
    session-summarizer.sh # Auto-logs every session to Obsidian
  scheduled-tasks/
    morning-briefing/SKILL.md
    obsidian-inbox-processor/SKILL.md
    connection-finder/SKILL.md
    review-prediction-performance/SKILL.md
    weekly-gsc-review/SKILL.md
    monthly-security-audit/SKILL.md

your-project/
  .claude/
    SKILL.md              # Project-specific instructions Claude always reads
    settings.local.json   # Project-specific permissions
```

---

## MCP Servers

MCP (Model Context Protocol) servers give Claude access to external tools. These go in `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "obsidian": {
      "command": "npx",
      "args": ["-y", "mcp-obsidian", "/path/to/your/obsidian/vault"]
    }
  }
}
```

### MCP Servers Dad Uses
- **Cloudflare** — Manage Workers, D1 databases, KV namespaces, R2 buckets directly from Claude. Connected via the Claude Code MCP marketplace (search "cloudflare" in settings).
- **Gmail** — Search emails, read threads, create drafts. Also from the MCP marketplace.
- **Obsidian** — Read/write to an Obsidian vault. Uses `mcp-obsidian` npm package.
- **Claude in Chrome** — Control a Chrome browser tab (navigate, click, screenshot, read pages). Great for web automation.
- **Claude Preview** — Start dev servers and preview them with screenshots, clicks, and accessibility tree inspection.

### How to connect MCP servers
In Claude Code, use the `/mcp` command or edit `~/.claude/settings.json` directly. For marketplace ones (Cloudflare, Gmail), Claude Code will prompt you to connect them.

---

## Session Auto-Summarizer Hook

This is one of the coolest things — every time a Claude Code session ends, a hook automatically:
1. Reads the session transcript
2. Sends it to Claude Haiku (fast, cheap) via the Anthropic API
3. Writes a structured summary to an Obsidian vault session log
4. Updates the project's CLAUDE.md with a "Recent Sessions" section so the next conversation has context

### Setup

**`~/.claude/settings.json`** — add the hook:
```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "/path/to/session-summarizer.sh",
            "timeout": 30000
          }
        ]
      }
    ]
  }
}
```

**`session-summarizer.sh`** (save to `~/.claude/hooks/`):
```bash
#!/bin/bash
# Session Summarizer - Stop hook for Claude Code
# Summarizes session transcript into Obsidian vault + updates project CLAUDE.md

set -euo pipefail

OBSIDIAN_VAULT="/path/to/your/obsidian/vault"  # CHANGE THIS
SESSION_LOG="$OBSIDIAN_VAULT/_claude-session-log.md"
MAX_RECENT_SESSIONS=5

INPUT=$(cat)
TRANSCRIPT_PATH=$(echo "$INPUT" | jq -r '.transcript_path // empty')
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // empty')
CWD=$(echo "$INPUT" | jq -r '.cwd // empty')

if [ -z "$TRANSCRIPT_PATH" ] || [ ! -f "$TRANSCRIPT_PATH" ]; then
  exit 0
fi

PROJECT_NAME=$(basename "${CWD:-unknown}")
TIMESTAMP=$(date '+%Y-%m-%d %H:%M')
CLAUDE_MD="${CWD}/CLAUDE.md"

# Dedup: skip if already summarized
DEDUP_DIR="$OBSIDIAN_VAULT/.session-dedup"
mkdir -p "$DEDUP_DIR"
if [ -n "$SESSION_ID" ] && [ -f "$DEDUP_DIR/$SESSION_ID" ]; then
  exit 0
fi

# Skip tiny transcripts
FILESIZE=$(stat -f%z "$TRANSCRIPT_PATH" 2>/dev/null || echo 0)
if [ "$FILESIZE" -lt 5000 ]; then
  [ -n "$SESSION_ID" ] && touch "$DEDUP_DIR/$SESSION_ID"
  exit 0
fi

# Extract condensed transcript
CONDENSED=$(jq -r '
  select(.type == "user" or .type == "assistant") |
  if .type == "user" then
    "USER: " + (
      if (.message.content | type) == "array" then
        ([.message.content[] | select(.type == "text") | .text] | join(" "))
      elif (.message.content | type) == "string" then
        .message.content
      else "(non-text)" end
    )
  elif .type == "assistant" then
    "CLAUDE: " + (
      if (.message.content | type) == "array" then
        ([.message.content[] | select(.type == "text") | .text] | join(" "))
      elif (.message.content | type) == "string" then
        .message.content
      else "(tool use)" end
    )
  else empty end
' "$TRANSCRIPT_PATH" 2>/dev/null | cut -c1-500 | head -200)

LINE_COUNT=$(echo "$CONDENSED" | wc -l | tr -d ' ')
if [ "$LINE_COUNT" -lt 4 ]; then
  [ -n "$SESSION_ID" ] && touch "$DEDUP_DIR/$SESSION_ID"
  exit 0
fi

# Summarize with Anthropic API (Haiku - fast and cheap)
ANTHROPIC_KEY="${ANTHROPIC_API_KEY:-}"
# Try reading from .env files if not set
for envfile in "${CWD}/.env" "$HOME/.env"; do
  if [ -z "$ANTHROPIC_KEY" ] && [ -f "$envfile" ]; then
    KEY=$(grep -E '^ANTHROPIC_API_KEY=' "$envfile" 2>/dev/null | head -1 | cut -d= -f2- | tr -d '"'"'" || true)
    [ -n "$KEY" ] && ANTHROPIC_KEY="$KEY"
  fi
done

PROMPT="Summarize this Claude Code session. Project: $CWD

Write in this exact format (no extra text):

## $TIMESTAMP | $PROJECT_NAME

### What was done
- (2-5 bullet points of key actions/changes)

### Decisions made
- (any architectural or strategic decisions, or 'None')

### Follow-ups
- (anything left incomplete or worth revisiting, or 'None')

---

Rules: Be specific (file names, services, tools). Skip trivial actions. Under 15 lines total."

if [ -n "$ANTHROPIC_KEY" ]; then
  ESCAPED_CONDENSED=$(echo "$CONDENSED" | jq -Rsa .)
  ESCAPED_PROMPT=$(echo "$PROMPT" | jq -Rsa .)
  API_BODY=$(cat <<JSONEOF
{
  "model": "claude-haiku-4-5-20251001",
  "max_tokens": 512,
  "messages": [{"role": "user", "content": [
    {"type": "text", "text": $ESCAPED_PROMPT},
    {"type": "text", "text": $ESCAPED_CONDENSED}
  ]}]
}
JSONEOF
)
  API_RESPONSE=$(curl -s --max-time 15 \
    -H "x-api-key: $ANTHROPIC_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "content-type: application/json" \
    -d "$API_BODY" \
    "https://api.anthropic.com/v1/messages" 2>/dev/null || true)
  SUMMARY=$(echo "$API_RESPONSE" | jq -r '.content[0].text // empty' 2>/dev/null || true)
fi

# Fallback if API unavailable
if [ -z "${SUMMARY:-}" ]; then
  TOPIC=$(echo "$CONDENSED" | grep "^USER:" | head -1 | sed 's/^USER: //' | cut -c1-120)
  SUMMARY="## $TIMESTAMP | $PROJECT_NAME
### What was done
- Session topic: ${TOPIC:-unknown}
- (Auto-summary unavailable)
### Decisions made
- None captured
### Follow-ups
- Review session transcript if needed
---"
fi

[ -n "$SESSION_ID" ] && touch "$DEDUP_DIR/$SESSION_ID"

# Append to Obsidian session log
printf '\n%s\n' "$SUMMARY" >> "$SESSION_LOG"

# Update project CLAUDE.md with rolling recent sessions
if [ -f "$CLAUDE_MD" ]; then
  COMPACT_ENTRY=$(echo "$SUMMARY" | awk '
    /^## / { next }
    /^### What was done/ { in_done=1; next }
    /^### / { in_done=0; next }
    /^---/ { next }
    in_done && /^- / { print }
  ')
  NEW_ENTRY="- **$TIMESTAMP** -- $(echo "$COMPACT_ENTRY" | head -1 | sed 's/^- //')"

  if grep -q "^## Recent Sessions" "$CLAUDE_MD" 2>/dev/null; then
    EXISTING=$(awk '/^## Recent Sessions/{found=1; next} found && /^## /{exit} found && /^- \*\*/{print}' "$CLAUDE_MD")
    NEW_SECTION="## Recent Sessions\n\n${NEW_ENTRY}"
    COUNT=1
    while IFS= read -r line; do
      [ $COUNT -ge $MAX_RECENT_SESSIONS ] && break
      [ -n "$line" ] && { NEW_SECTION="${NEW_SECTION}\n${line}"; COUNT=$((COUNT + 1)); }
    done <<< "$EXISTING"
    TMPFILE=$(mktemp)
    awk -v new_section="$NEW_SECTION" '
      /^## Recent Sessions/ { skip=1; printf "%s\n\n", new_section; next }
      skip && /^## / { skip=0 }
      skip { next }
      { print }
    ' "$CLAUDE_MD" > "$TMPFILE"
    [ -s "$TMPFILE" ] && mv "$TMPFILE" "$CLAUDE_MD" || rm -f "$TMPFILE"
  else
    printf '\n## Recent Sessions\n\n%s\n' "$NEW_ENTRY" >> "$CLAUDE_MD"
  fi
fi

exit 0
```

Make it executable: `chmod +x ~/.claude/hooks/session-summarizer.sh`

**Requirements**: `jq` and `curl` must be installed. Set `ANTHROPIC_API_KEY` in your environment or a `.env` file.

---

## Scheduled Tasks

These are Claude Code agents that run on a schedule. Create them with the `/schedule` command or ask Claude to create one. They live in `~/.claude/scheduled-tasks/<task-id>/SKILL.md`.

### Morning Briefing (Daily)
Scans Outlook email + calendar via Chrome, reads Obsidian vault for recent changes, and produces a structured daily briefing with priorities, action items, schedule, and connections between items.

### Obsidian Inbox Processor (Daily)
Scans recently modified notes, categorizes them (meeting notes, tasks, ideas, research), extracts action items, and creates a `_daily-digest.md` with everything organized.

### Connection Finder (Weekly)
Reads all vault notes, extracts entities (people, companies, topics), finds cross-category connections, and writes a `_connections.md` report suggesting backlinks.

### Weekly Performance Review (Weekly)
Hits the edgewise.pro API to check prediction model accuracy, reviews recent picks, and suggests model improvements.

### Weekly GSC Review (Weekly)
Logs into Google Search Console via Chrome to check site indexing progress, errors, and performance.

### Monthly Security Audit (Monthly)
Reads all API functions for a web project and runs a comprehensive security audit checking for input sanitization, price manipulation, XSS, rate limiting, etc. Scores against a checklist.

---

## Specialized Agents

Claude Code has a huge library of specialized subagents. These are the ones Dad uses most:

### Development
- **Frontend Developer** — React/Vue/Angular, UI implementation, CSS
- **Backend Architect** — System design, APIs, database architecture
- **Senior Developer** — Laravel/Livewire/FluxUI, advanced CSS, Three.js
- **Software Architect** — System design, domain-driven design, architectural patterns
- **Code Reviewer** — Constructive feedback on correctness, security, performance

### DevOps & Infrastructure
- **DevOps Automator** — CI/CD pipelines, infrastructure automation
- **Security Engineer** — Threat modeling, vulnerability assessment, secure code review
- **Database Optimizer** — Schema design, query optimization, indexing

### Content & Marketing
- **SEO Specialist** — Technical SEO, content optimization, organic search growth
- **Content Creator** — Multi-platform content, editorial calendars, brand storytelling
- **Social Media Strategist** — LinkedIn, Twitter, cross-platform campaigns

### Design
- **UX Architect** — Technical architecture and UX foundations
- **UI Designer** — Visual design systems, component libraries
- **Accessibility Auditor** — WCAG standards, assistive technology testing

### Planning & Research
- **Explore** (subagent_type) — Fast codebase exploration, file finding, keyword search
- **Plan** (subagent_type) — Software architect for designing implementation plans
- **Technical Writer** — Developer docs, API references, README files

You access these by asking Claude to use them, or Claude picks them automatically when the task fits. For example: "Use the Security Engineer agent to audit this code."

---

## Skills (Slash Commands)

Skills are markdown files that teach Claude specific workflows. Available ones include:

- `/commit` — Smart git commit with conventional format
- `/simplify` — Review changed code for reuse, quality, efficiency
- `/build-fix` — Build and fix errors
- `/schedule` — Create/manage scheduled tasks
- `/edgely` or `/edgewise` — Full project context for the sports prediction platform
- `/pdf`, `/docx`, `/xlsx`, `/pptx` — Create/read/edit document files

You can create custom skills by putting SKILL.md files in `.claude/` directories.

---

## Project SKILL.md

This is the most powerful thing for a specific project. Put a `.claude/SKILL.md` file in your project root and it gets loaded into every Claude conversation in that directory.

Example structure:
```markdown
# My Project Name

## Overview
What this project does, what tech stack it uses.

## Architecture
Key files, how things connect, important patterns.

## Development Workflow
How to build, deploy, test.

## Known Issues
Current bugs or gotchas Claude should know about.

## Recently Fixed (don't revert)
Things that were fixed and shouldn't be accidentally undone.
```

This saves TONS of time because Claude doesn't have to rediscover your project structure every conversation.

---

## Obsidian Integration

The full Obsidian integration includes:

1. **Session summarizer hook** — Every Claude session gets auto-logged to `_claude-session-log.md`
2. **Morning briefing** — Daily scheduled task that reads email + calendar + vault and creates a briefing
3. **Inbox processor** — Daily digest of recent notes with extracted action items
4. **Connection finder** — Weekly scan for non-obvious relationships between notes
5. **MCP server** — Direct read/write access to vault via `mcp-obsidian`

To use: Install `mcp-obsidian`, add it to settings.json, point it at your vault, and set up the hooks.

---

## How to Set It Up

### Minimum Viable Setup (15 minutes)
1. Install Claude Code (CLI or desktop app)
2. Create `~/.claude/settings.json` with MCP servers you want
3. Create a `CLAUDE.md` or `.claude/SKILL.md` in your main project with architecture notes
4. Start using Claude Code in your project directory

### Full Setup (1-2 hours)
1. Everything above, plus:
2. Copy `session-summarizer.sh` to `~/.claude/hooks/`, update the vault path
3. Add the Stop hook to `~/.claude/settings.json`
4. Set up scheduled tasks with `/schedule` command
5. Connect Cloudflare MCP if you deploy to Cloudflare
6. Connect Gmail MCP if you want email access

### Tips
- **Always have a CLAUDE.md or SKILL.md** — It's the single biggest productivity boost. Claude starts every conversation already knowing your project.
- **Use the Explore agent** — For searching codebases, it's faster than doing it yourself
- **Hooks are powerful** — The session summarizer means you never lose context between sessions
- **Scheduled tasks** — Great for recurring reviews (security audits, performance checks, SEO monitoring)
- **Memory system** — Claude has persistent memory in `~/.claude/projects/*/memory/`. It remembers your preferences across conversations.

---

## What You DON'T Need to Copy

- API keys (get your own)
- Project-specific SKILL.md files (build these for your own projects)
- Permission settings (`.claude/settings.local.json`) — these accumulate as you approve things
- Memory files — Claude builds these organically as you work together

---

*Last updated: March 29, 2026*
*Created by Dad's Claude Code setup for edgewise.pro, microtissues.com, and general productivity*
