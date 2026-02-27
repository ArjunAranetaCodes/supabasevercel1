import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

type Note = {
  id: string;
  title?: string | null;
};

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from("notes")
          .select("id, title");

        if (error) throw error;
        setNotes(data ?? []);
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
      <main className="card">
        <section>
          {loading && <p>Loading from Supabase…</p>}
          {error && <p className="error">Error: {error}</p>}
          {!loading && !error && notes.length === 0 && (
            <p>No notes found.</p>
          )}
          {!loading && !error && notes.length > 0 && (
            <ul className="list">
              {notes.map((note) => {
                return (
                  <li key={note.id}>
                    <div>
                      <span className="label">Title</span>
                      <div>{note.title ?? "(untitled)"}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;

