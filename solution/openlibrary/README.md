# OpenLibrary MCP Server

Serveur MCP (Model Context Protocol) pour rechercher des livres et auteurs via l'API [OpenLibrary](https://openlibrary.org).

## Tools exposés

| Tool | Description |
|---|---|
| `search_books` | Rechercher des livres par titre, auteur ou mot-clé |
| `search_authors` | Rechercher des auteurs par nom |
| `get_book_details` | Obtenir les détails d'un livre via sa clé OpenLibrary |

## Installation

```bash
npm install
npm run build
```

## Configuration MCP

Ajouter dans votre config MCP (ex: `claude_desktop_config.json`) :

```json
{
  "mcpServers": {
    "openlibrary": {
      "command": "node",
      "args": ["<chemin-absolu>/dist/index.js"]
    }
  }
}
```

## Exemples d'utilisation

- Rechercher un livre : `search_books({ query: "le petit prince" })`
- Rechercher un auteur : `search_authors({ query: "Victor Hugo" })`
- Détails d'un livre : `get_book_details({ key: "/works/OL45883W" })`
