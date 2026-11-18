## Agent Logs (MANDATORY)

The `agentlogs/` folder is the project's living documentation. Updating it is part of every task. A task is NOT finished until the logs are updated. Before starting any task, read these files first so you know the current state.

### Files

1. `agentlogs/architecture.md`: architecture and data flow
2. `agentlogs/files.md`: summary of every file
3. `agentlogs/changelog.md`: running history of changes

### When to update

After ANY change that creates, deletes, renames, or meaningfully edits a file, or changes how data moves. Do it in the same task, before telling the user you are done. Do not batch updates for later.

### architecture.md (rewrite in place, keep it current)

- Overview: what the app is, stack, folder structure (short tree).
- Navigation and routing: how screens connect and what triggers each transition.
- Data flow: for each feature, trace the path file by file, like
  `Screen -> hook -> service/util -> storage or API -> back to UI`.
  Name the real files and functions involved.
- State management: where state lives, who reads it, who writes it.
- External dependencies: libraries and services, and what each one is used for.
- Config and assets: how env, theme, images, and paths are wired.
- A Mermaid diagram of the main flow when it helps.
Edit the existing text so it always describes the project as it is NOW. Never leave outdated descriptions.

### files.md (one entry per file, edit in place)

Use this format for each file, grouped by folder:

```
### path/to/file.tsx
- Purpose: one line on what it does
- How it works: 2 to 4 lines on the logic
- Uses: files or libraries it depends on
- Used by: files that import or render it
- Gotchas: anything non-obvious (omit if none)
```

Add entries for new files, update entries for changed files, delete entries for removed files.

### changelog.md (append only, newest on top)

For each task add an entry:

```
## YYYY-MM-DD HH:MM: short title
- What changed: files touched and what was done
- Why: the reason or the user's request
- Impact: what else might be affected
- Known issues / TODO: anything left unfinished or risky
```

Keep entries short. Roll up entries older than 30 days into a few lines.

### Rules

- Be specific. Use real file names, function names, and paths. No vague text like "handles logic".
- Never document things that do not exist. If you are unsure how something works, read the code first.
- If you notice the logs disagree with the code, fix the logs.
- Keep it readable by a beginner: plain language, short sentences.
- At the end of every task, tell the user which log files you updated.