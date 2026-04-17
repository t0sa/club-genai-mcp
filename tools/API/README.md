# Task API

A minimal Express API used during the Sfeir GenAI MCP workshop. All data is stored **in-memory** — no database, no authentication, no external dependencies.

## Prerequisites

- Node.js 18+

## Setup

```bash
npm install
npm start
```

The server starts on `http://localhost:3000` by default. Set the `PORT` environment variable to override.

## Routes

| Method | Path                | Description             |
| ------ | ------------------- | ----------------------- |
| GET    | `/api/tasks`        | Return all entries      |
| GET    | `/api/tasks/latest` | Return the latest entry |
| POST   | `/api/tasks`        | Add a new entry         |

## Swagger UI

Interactive API documentation is available at `/api-docs` once the server is running.

## Payload

```json
{
  "pseudo": "string",
  "nom de tache": "string",
  "avancement de la tache": "string"
}
```

## Notes

- Data resets on every server restart.
- No authentication is required.
