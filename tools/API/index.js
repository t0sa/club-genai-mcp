const express = require("express");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const PORT = process.env.PORT || 3000;

// --- In-memory store ---
const tasks = [];
let nextId = 1;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Swagger setup ---
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sfeir GenAI Task API",
      version: "1.0.0",
      description: "In-memory task API for the MCP workshop",
    },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: [__filename],
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- Routes ---

/**
 * @openapi
 * /api/tasks:
 *   get:
 *     summary: Return all tasks
 *     responses:
 *       200:
 *         description: Array of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
app.get("/api/tasks", (_req, res) => {
  res.json(tasks);
});

/**
 * @openapi
 * /api/tasks/latest:
 *   get:
 *     summary: Return the latest task
 *     responses:
 *       200:
 *         description: The most recently created task
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: No tasks found
 */
app.get("/api/tasks/latest", (_req, res) => {
  if (tasks.length === 0) {
    return res.status(404).json({ error: "No tasks found" });
  }
  res.json(tasks[tasks.length - 1]);
});

/**
 * @openapi
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pseudo
 *               - nom de tache
 *               - avancement de la tache
 *             properties:
 *               pseudo:
 *                 type: string
 *                 example: "Alice"
 *               nom de tache:
 *                 type: string
 *                 example: "MCP Server"
 *               avancement de la tache:
 *                 type: string
 *                 example: "En cours"
 *     responses:
 *       201:
 *         description: Task created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Missing required fields
 */
app.post("/api/tasks", (req, res) => {
  const { pseudo, "nom de tache": nomDeTache, "avancement de la tache": avancement } = req.body;

  if (!pseudo || !nomDeTache || !avancement) {
    return res.status(400).json({
      error: "Missing required fields: pseudo, nom de tache, avancement de la tache",
    });
  }

  const task = {
    id: nextId++,
    pseudo,
    "nom de tache": nomDeTache,
    "avancement de la tache": avancement,
    createdAt: new Date().toISOString(),
  };

  tasks.push(task);
  res.status(201).json(task);
});

/**
 * @openapi
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         pseudo:
 *           type: string
 *         nom de tache:
 *           type: string
 *         avancement de la tache:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */

app.listen(PORT, () => {
  console.log(`Task API running on http://localhost:${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});
