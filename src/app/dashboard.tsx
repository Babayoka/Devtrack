
"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export default function Dashboard() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  const supabase = createClient();

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    const { data: userData, error: userError } =
      await supabase.auth.getUser();

    if (userError || !userData.user) {
      setErrorMessage("Please log in again to load your tasks.");
      setLoading(false);
      return;
    }

    setUserId(userData.user.id);

    const { data, error } = await supabase
      .from("tasks")
      .select("id, title, completed")
      .order("created_at", { ascending: true });

    if (error) {
      setErrorMessage(error.message);
    } else {
      setTasks(data ?? []);
    }

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  async function addTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const title = newTask.trim();
    if (!title || !userId || saving) return;

    setSaving(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        title,
        completed: false,
        user_id: userId,
      })
      .select("id, title, completed")
      .single();

    if (error) {
      setErrorMessage(error.message);
    } else {
      setTasks((current) => [...current, data]);
      setNewTask("");
    }

    setSaving(false);
  }

  async function toggleTask(task: Task) {
    setErrorMessage("");

    const updatedCompleted = !task.completed;

    const { error } = await supabase
      .from("tasks")
      .update({ completed: updatedCompleted })
      .eq("id", task.id);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setTasks((current) =>
      current.map((item) =>
        item.id === task.id
          ? { ...item, completed: updatedCompleted }
          : item
      )
    );
  }

  async function deleteTask(id: string) {
    setErrorMessage("");

    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setTasks((current) => current.filter((task) => task.id !== id));
  }

  const completedCount = tasks.filter((task) => task.completed).length;
  
  async function handleSignOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    setErrorMessage(error.message);
    return;
  }

  router.replace("/login");
  router.refresh();
}

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-12 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="hidden rounded-xl border border-zinc-800 px-4 py-3 sm:block">
              <p className="text-xs text-zinc-500">STATUS</p>
              <p className="mt-1 text-sm font-medium text-emerald-400">
                ● Building
              </p>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-xl border border-zinc-700 px-4 py-3 text-sm font-medium text-zinc-200 transition hover:border-red-400 hover:text-red-400"
            >
              Log out
            </button>
          </div>

        </header>

        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
            <p className="text-sm text-zinc-400">Total tasks</p>
            <p className="mt-3 text-4xl font-semibold">{tasks.length}</p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
            <p className="text-sm text-zinc-400">Completed</p>
            <p className="mt-3 text-4xl font-semibold text-emerald-400">
              {completedCount}
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
            <p className="text-sm text-zinc-400">Completion rate</p>
            <p className="mt-3 text-4xl font-semibold">
              {tasks.length
                ? Math.round((completedCount / tasks.length) * 100)
                : 0}
              <span className="text-2xl text-zinc-500">%</span>
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Mission control</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Your next steps, all in one place.
              </p>
            </div>
            <span className="rounded-lg bg-emerald-400/10 px-3 py-2 text-sm text-emerald-400">
              {tasks.length - completedCount} remaining
            </span>
          </div>

          <form className="mb-6 flex gap-3" onSubmit={addTask}>
            <input
              value={newTask}
              onChange={(event) => setNewTask(event.target.value)}
              placeholder="What are you building next?"
              className="min-w-0 flex-1 rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none placeholder:text-zinc-600 focus:border-emerald-400"
            />
            <button
              type="submit"
              disabled={saving || !userId}
              className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Add task +"}
            </button>
          </form>

          {errorMessage && (
            <p role="alert" className="mb-4 text-sm text-red-400">
              {errorMessage}
            </p>
          )}

          {loading ? (
            <p className="py-8 text-center text-sm text-zinc-400">
              Loading your tasks...
            </p>
          ) : tasks.length === 0 ? (
            <p className="py-8 text-center text-sm text-zinc-400">
              No tasks yet. Add your first one above.
            </p>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 transition hover:border-zinc-700"
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => void toggleTask(task)}
                    aria-label={`Mark ${task.title} ${
                      task.completed ? "incomplete" : "complete"
                    }`}
                    className="h-4 w-4 accent-emerald-400"
                  />
                  <span
                    className={`flex-1 text-sm ${
                      task.completed
                        ? "text-zinc-500 line-through"
                        : "text-zinc-200"
                    }`}
                  >
                    {task.title}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {task.completed ? "DONE" : "IN PROGRESS"}
                  </span>
                  <button
                    type="button"
                    onClick={() => void deleteTask(task.id)}
                    aria-label={`Delete ${task.title}`}
                    className="text-xs text-zinc-500 hover:text-red-400"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <footer className="mt-8 text-center text-xs text-zinc-600">
          DEVTRACK / VERSION 0.2.0 / BUILT FROM SCRATCH
        </footer>
      </div>
    </main>
  );
}
