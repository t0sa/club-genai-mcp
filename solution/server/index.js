import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";

const server = new McpServer({
  name: "sfeir-tasks",
  version: "1.0.0",
});

// Tool: get all tasks
server.tool("get_all_tasks", "Retrieve all tasks from the API", {}, async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks`);
    const data = await response.json();
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
  } catch (error) {
    return {
      isError: true,
      content: [{ type: "text", text: `Error fetching tasks: ${error.message}` }],
    };
  }
});

// Tool: get latest task
server.tool("get_latest_task", "Retrieve the most recent task from the API", {}, async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks/latest`);
    if (response.status === 404) {
      return {
        content: [{ type: "text", text: "No tasks found." }],
      };
    }
    const data = await response.json();
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
  } catch (error) {
    return {
      isError: true,
      content: [{ type: "text", text: `Error fetching latest task: ${error.message}` }],
    };
  }
});

// Tool: create a task
server.tool(
  "create_task",
  "Create a new task. Requires pseudo (username), nom_de_tache (task name), and avancement_de_la_tache (task progress).",
  {
    pseudo: z.string().describe("Username of the person"),
    nom_de_tache: z.string().describe("Name of the task"),
    avancement_de_la_tache: z.string().describe("Progress status of the task"),
  },
  async ({ pseudo, nom_de_tache, avancement_de_la_tache }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pseudo,
          "nom de tache": nom_de_tache,
          "avancement de la tache": avancement_de_la_tache,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        return {
          isError: true,
          content: [{ type: "text", text: `API error ${response.status}: ${JSON.stringify(data)}` }],
        };
      }
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    } catch (error) {
      return {
        isError: true,
        content: [{ type: "text", text: `Error creating task: ${error.message}` }],
      };
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
