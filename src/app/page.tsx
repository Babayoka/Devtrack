
import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Dashboard from "./dashboard";

async function AuthenticatedHomePage() {
  await connection();

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/login");
  }

  return <Dashboard />;
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#09090b] p-8 text-white">
          Loading DevTrack...
        </main>
      }
    >
      <AuthenticatedHomePage />
    </Suspense>
  );
}
