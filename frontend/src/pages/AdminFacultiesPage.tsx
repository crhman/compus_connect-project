import React, { useEffect, useState } from "react";
import api from "../api/client";

interface FacultyItem {
  _id: string;
  name: string;
  description: string;
  semesters?: string[];
}

const AdminFacultiesPage: React.FC = () => {
  const [faculties, setFaculties] = useState<FacultyItem[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [semesters, setSemesters] = useState("");
  const [editing, setEditing] = useState<FacultyItem | null>(null);

  const loadFaculties = () => {
    api.get("/faculties").then((res) => setFaculties(res.data)).catch(() => undefined);
  };

  useEffect(() => {
    loadFaculties();
  }, []);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    const semesterList = semesters
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    await api.post("/faculties", { name, description, semesters: semesterList });
    setName("");
    setDescription("");
    setSemesters("");
    loadFaculties();
  };

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editing) return;
    const semesterList = (editing.semesters || [])
      .join(",")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    await api.put(`/faculties/${editing._id}`, {
      name: editing.name,
      description: editing.description,
      semesters: semesterList
    });
    setEditing(null);
    loadFaculties();
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/faculties/${id}`);
    loadFaculties();
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-slate-900">Faculties</h3>
      <form onSubmit={handleCreate} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-3 md:grid-cols-2">
          <input
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
            placeholder="Faculty name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
          <input
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
            placeholder="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>
        <input
          className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
          placeholder="Semesters (comma separated, e.g. Semester 1, Semester 2)"
          value={semesters}
          onChange={(event) => setSemesters(event.target.value)}
        />
        <button
          type="submit"
          className="mt-4 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white"
        >
          Add faculty
        </button>
      </form>
      {editing && (
        <form onSubmit={handleUpdate} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <input
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
              value={editing.name}
              onChange={(event) => setEditing({ ...editing, name: event.target.value })}
              required
            />
            <input
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
              value={editing.description}
              onChange={(event) => setEditing({ ...editing, description: event.target.value })}
            />
          </div>
          <input
            className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
            value={(editing.semesters || []).join(", ")}
            onChange={(event) =>
              setEditing({
                ...editing,
                semesters: event.target.value
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean)
              })
            }
          />
          <div className="mt-4 flex gap-3">
            <button
              type="submit"
              className="rounded-2xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white"
            >
              Save changes
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded-2xl border border-slate-200 px-4 py-2 text-xs text-slate-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      <div className="grid gap-3">
        {faculties.map((faculty) => (
          <div key={faculty._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">{faculty.name}</p>
                <p className="text-xs text-slate-500">{faculty.description}</p>
                {faculty.semesters?.length ? (
                  <p className="mt-2 text-xs text-indigo-500">{faculty.semesters.join(", ")}</p>
                ) : null}
              </div>
              <div className="flex gap-2">
                <button
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600"
                  onClick={() => setEditing(faculty)}
                >
                  Edit
                </button>
                <button
                  className="rounded-full border border-rose-200 px-3 py-1 text-xs text-rose-600"
                  onClick={() => handleDelete(faculty._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {faculties.length === 0 && <p className="text-sm text-slate-500">No faculties yet.</p>}
      </div>
    </div>
  );
};

export default AdminFacultiesPage;
