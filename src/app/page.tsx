
"use client";

import { useState } from "react";

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Set up development environment", completed: true },
    { id: 2, title: "Build DevTrack dashboard", completed: false },
    { id: 3, title: "Connect database", completed: false },
  ]);

  const [newTask, setNewTask] = useState("");

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  function addTask() {
    const title = newTask.trim();
    if (!title) return;

    setTasks((current) => [
      ...current,
      { id: Date.now(), title, completed: false },
    ]);
    setNewTask("");
  }

  function toggleTask(id: number) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-12 flex items-center justify-between">
          <div>
            <p className="mb-3 text-sm font-medium tracking-[0.3em] text-emerald-400">
              YOUR ENGINEERING WORKSPACE
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              DevTrack<span className="text-emerald-400">.</span>
            </h1>
            <p className="mt-3 text-zinc-400">
              Small steps. Real progress. Better engineering.
            </p>
          </div>
          <div className="hidden rounded-xl border border-zinc-800 px-4 py-3 sm:block">
            <p className="text-xs text-zinc-500">STATUS</p>
            <p className="mt-1 text-sm font-medium text-emerald-400">
              ● Building
            </p>
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

          <form
            className="mb-6 flex gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              addTask();
            }}
          >
            <input
              value={newTask}
              onChange={(event) => setNewTask(event.target.value)}
              placeholder="What are you building next?"
              className="min-w-0 flex-1 rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none placeholder:text-zinc-600 focus:border-emerald-400"
            />
            <button
              type="submit"
              className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400"
            >
              Add task +
            </button>
          </form>

          <div className="space-y-3">
            {tasks.map((task) => (
              <label
                key={task.id}
                className="flex cursor-pointer items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 transition hover:border-zinc-700"
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
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
              </label>
            ))}
          </div>
        </section>

        <footer className="mt-8 text-center text-xs text-zinc-600">
          DEVTRACK / VERSION 0.1.0 / BUILT FROM SCRATCH
        </footer>
      </div>
    </main>
  );
}
