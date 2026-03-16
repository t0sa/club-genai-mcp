import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "openlibrary",
  version: "1.0.0",
});

const OPENLIBRARY_BASE = "https://openlibrary.org";

interface OpenLibraryDoc {
  title?: string;
  author_name?: string[];
  first_publish_year?: number;
  isbn?: string[];
  publisher?: string[];
  language?: string[];
  subject?: string[];
  key?: string;
  edition_count?: number;
}

interface OpenLibraryResponse {
  numFound: number;
  docs: OpenLibraryDoc[];
}

function formatBookResult(doc: OpenLibraryDoc): string {
  const lines: string[] = [];
  if (doc.title) lines.push(`Title: ${doc.title}`);
  if (doc.author_name?.length) lines.push(`Author(s): ${doc.author_name.join(", ")}`);
  if (doc.first_publish_year) lines.push(`First published: ${doc.first_publish_year}`);
  if (doc.isbn?.length) lines.push(`ISBN: ${doc.isbn[0]}`);
  if (doc.publisher?.length) lines.push(`Publisher: ${doc.publisher[0]}`);
  if (doc.edition_count) lines.push(`Editions: ${doc.edition_count}`);
  if (doc.key) lines.push(`URL: ${OPENLIBRARY_BASE}${doc.key}`);
  return lines.join("\n");
}

server.tool(
  "search_books",
  "Search for books on OpenLibrary by title, author, or any keyword",
  {
    query: z.string().describe("Search query (title, keyword, etc.)"),
    limit: z.number().min(1).max(50).default(10).describe("Max number of results (default 10)"),
  },
  async ({ query, limit }) => {
    const url = `${OPENLIBRARY_BASE}/search.json?q=${encodeURIComponent(query)}&limit=${limit}`;
    const res = await fetch(url);
    if (!res.ok) {
      return { content: [{ type: "text" as const, text: `API error: ${res.status} ${res.statusText}` }] };
    }
    const data = (await res.json()) as OpenLibraryResponse;

    if (data.numFound === 0) {
      return { content: [{ type: "text" as const, text: `No books found for "${query}".` }] };
    }

    const results = data.docs.map((doc, i) => `--- Result ${i + 1} ---\n${formatBookResult(doc)}`).join("\n\n");
    const summary = `Found ${data.numFound} books (showing ${data.docs.length}):\n\n${results}`;

    return { content: [{ type: "text" as const, text: summary }] };
  }
);

server.tool(
  "search_authors",
  "Search for authors on OpenLibrary",
  {
    query: z.string().describe("Author name to search for"),
    limit: z.number().min(1).max(50).default(10).describe("Max number of results (default 10)"),
  },
  async ({ query, limit }) => {
    const url = `${OPENLIBRARY_BASE}/search/authors.json?q=${encodeURIComponent(query)}&limit=${limit}`;
    const res = await fetch(url);
    if (!res.ok) {
      return { content: [{ type: "text" as const, text: `API error: ${res.status} ${res.statusText}` }] };
    }
    const data = (await res.json()) as { numFound: number; docs: Array<{ key?: string; name?: string; birth_date?: string; top_work?: string; work_count?: number }> };

    if (data.numFound === 0) {
      return { content: [{ type: "text" as const, text: `No authors found for "${query}".` }] };
    }

    const results = data.docs.map((doc, i) => {
      const lines: string[] = [`--- Author ${i + 1} ---`];
      if (doc.name) lines.push(`Name: ${doc.name}`);
      if (doc.birth_date) lines.push(`Born: ${doc.birth_date}`);
      if (doc.top_work) lines.push(`Top work: ${doc.top_work}`);
      if (doc.work_count) lines.push(`Works: ${doc.work_count}`);
      if (doc.key) lines.push(`URL: ${OPENLIBRARY_BASE}/authors/${doc.key}`);
      return lines.join("\n");
    }).join("\n\n");

    const summary = `Found ${data.numFound} authors (showing ${data.docs.length}):\n\n${results}`;
    return { content: [{ type: "text" as const, text: summary }] };
  }
);

server.tool(
  "get_book_details",
  "Get detailed information about a specific book by its OpenLibrary key (e.g. /works/OL45883W)",
  {
    key: z.string().describe("OpenLibrary work key, e.g. /works/OL45883W"),
  },
  async ({ key }) => {
    const normalizedKey = key.startsWith("/") ? key : `/${key}`;
    const url = `${OPENLIBRARY_BASE}${normalizedKey}.json`;
    const res = await fetch(url);
    if (!res.ok) {
      return { content: [{ type: "text" as const, text: `API error: ${res.status} ${res.statusText}` }] };
    }
    const data = (await res.json()) as Record<string, unknown>;

    const lines: string[] = [];
    if (data["title"]) lines.push(`Title: ${data["title"]}`);
    if (data["subtitle"]) lines.push(`Subtitle: ${data["subtitle"]}`);

    const desc = data["description"];
    if (typeof desc === "string") {
      lines.push(`Description: ${desc}`);
    } else if (desc && typeof desc === "object" && "value" in (desc as Record<string, unknown>)) {
      lines.push(`Description: ${(desc as Record<string, unknown>)["value"]}`);
    }

    if (data["first_publish_date"]) lines.push(`First published: ${data["first_publish_date"]}`);

    const subjects = data["subjects"] as string[] | undefined;
    if (subjects?.length) lines.push(`Subjects: ${subjects.slice(0, 10).join(", ")}`);

    lines.push(`URL: ${OPENLIBRARY_BASE}${normalizedKey}`);

    return { content: [{ type: "text" as const, text: lines.join("\n") }] };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
