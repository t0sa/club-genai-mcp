# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Coding Rules

Follow the rules defined in [`agent/agent.md`](agent/agent.md) for all code changes.

## Project Overview

This repository prepares a ~1.5-hour Sfeir GenAI workshop session on **MCP (Model Context Protocol)**. The session is structured as:
1. Theory (15 min)
2. Exercise 1 — Using an MCP: participants fetch an `Agent.md` from this repo via the GitHub MCP (15 min)
3. Exercise 2 — Building an MCP: participants develop a MCP server + client that interacts with a live REST API (40 min)
4. Conclusion (5 min)

## Deliverables to Build

### 1. `Agent.md`
A generic agent rules file (used by any AI agent) that enforces:
- Rebuild after every code change to verify compilation
- Write tests for every change
- Run all tests after every change to check for regressions
- Run a linter after every change

### 2. API + Frontend
A REST API with these routes:
```
GET  /          → get all task entries
GET  /latest    → get one (latest) entry
POST /          → create an entry
```

Payload schema:
```json
{
  "pseudo": "string",
  "nom de tache": "string",
  "avancement de la tache": "string"
}
```

The frontend auto-refreshes every 2 seconds to display all entries (read-only display). The API runs on a local IP provided on the day of the session.

### 3. MCP Server + Client (solution)
Participants build a MCP server exposing tools that wrap the above API routes, and a MCP client that lets an AI agent call those tools. The solution version lives in this repo as reference.
