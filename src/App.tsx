import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

type Profile = {
  id: string;
  email: string | null;
};

function App() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const {
          data: { user }
        } = await supabase.auth.getUser();

        if (!user) {
          setError("No authenticated user. Configure auth in Supabase.");
          setProfiles([]);
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("id, email")
          .eq("id", user.id);

        if (error) throw error;
        setProfiles(data ?? []);
      } catch (err: any) {
        setError(err.message ?? "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1>Supabase + Vercel + Vite</h1>
        <p className="subtitle">
          Vite + React app wired for Supabase, ready to deploy on Vercel.
        </p>
      </header>

      <main className="card">
        <section>
          <h2>Environment configuration</h2>
          <p>
            Make sure you have defined <code>VITE_SUPABASE_URL</code> and{" "}
            <code>VITE_SUPABASE_ANON_KEY</code> in your environment (for local
            dev use a <code>.env.local</code> file).
          </p>
        </section>

        <section>
          <h2>Example Supabase query</h2>
          {loading && <p>Loading from Supabase…</p>}
          {error && <p className="error">Error: {error}</p>}
          {!loading && !error && profiles.length === 0 && (
            <p>No profile rows returned for the current user.</p>
          )}
          {!loading && !error && profiles.length > 0 && (
            <ul className="list">
              {profiles.map((p) => (
                <li key={p.id}>
                  <span className="label">User ID:</span> {p.id}
                  <br />
                  <span className="label">Email:</span> {p.email ?? "N/A"}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2>Next steps</h2>
          <ol>
            <li>
              In Supabase, set up your authentication and any tables you need
              (for example, a <code>profiles</code> table).
            </li>
            <li>
              In Vercel, add the same <code>VITE_SUPABASE_URL</code> and{" "}
              <code>VITE_SUPABASE_ANON_KEY</code> as project environment
              variables.
            </li>
            <li>Deploy this Vite app to Vercel.</li>
          </ol>
        </section>
      </main>
    </div>
  );
}

export default App;

