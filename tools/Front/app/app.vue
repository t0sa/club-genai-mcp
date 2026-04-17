<template>
  <div class="container">
    <h1>Sfeir GenAI - Tasks</h1>

    <div v-if="error" class="error">
      Impossible de charger les taches : {{ error }}
    </div>

    <div v-if="tasks.length === 0 && !error" class="empty">
      Aucune tache pour le moment.
    </div>

    <table v-if="tasks.length > 0">
      <thead>
        <tr>
          <th style="width: 15%">Pseudo</th>
          <th style="width: 45%">Task</th>
          <th style="width: 20%">Avancement</th>
          <th style="width: 20%">Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="task in tasks" :key="task.id">
          <td>{{ task.pseudo }}</td>
          <td>{{ task["nom de tache"] }}</td>
          <td>{{ task["avancement de la tache"] }}</td>
          <td :title="fullDate(task.createdAt)">{{ formatDate(task.createdAt) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
interface Task {
  id: number;
  pseudo: string;
  "nom de tache": string;
  "avancement de la tache": string;
  createdAt: string;
}

const config = useRuntimeConfig();
const apiBase = config.public.apiBase as string;

const tasks = ref<Task[]>([]);
const error = ref<string | null>(null);

async function fetchTasks() {
  try {
    const data = await $fetch<Task[]>(`${apiBase}/api/tasks`);
    tasks.value = data.slice().reverse();
    error.value = null;
  } catch (e: any) {
    error.value = e.message ?? "Erreur inconnue";
  }
}

let interval: ReturnType<typeof setInterval>;

onMounted(() => {
  fetchTasks();
  interval = setInterval(fetchTasks, 2000);
});

onUnmounted(() => {
  clearInterval(interval);
});

function fullDate(iso: string): string {
  return new Date(iso).toLocaleString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffH = Math.floor(diffMin / 60);

  if (diffSec < 60) return "A l'instant";
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  if (diffH < 24) return `Il y a ${diffH}h`;
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: #f5f5f5;
  color: #333;
}

.container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem;
}

h1 {
  margin-bottom: 1.5rem;
  color: #1a1a2e;
}

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

th, td {
  padding: 0.75rem 1rem;
  text-align: left;
}

th {
  background: #1a1a2e;
  color: white;
  font-weight: 600;
}

tbody tr:nth-child(even) {
  background: #f9f9f9;
}

tbody tr:hover {
  background: #eef;
}

.error {
  background: #fee;
  color: #c00;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.empty {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  color: #888;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
