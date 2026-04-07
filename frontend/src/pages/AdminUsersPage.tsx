import React, { useEffect, useState } from "react";
import api from "../api/client";

interface UserItem {
  _id: string;
  name: string;
  email: string;
  role: string;
  faculty: string;
  classLevel?: string;
  phone?: string;
}

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [faculties, setFaculties] = useState<{ _id: string; name: string; semesters?: string[] }[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("student");
  const [faculty, setFaculty] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [password, setPassword] = useState("");
  const [editing, setEditing] = useState<UserItem | null>(null);

  useEffect(() => {
    api.get("/users").then((res) => setUsers(res.data)).catch(() => undefined);
    api.get("/faculties").then((res) => setFaculties(res.data || [])).catch(() => undefined);
  }, []);

  const loadUsers = () => {
    api.get("/users").then((res) => setUsers(res.data)).catch(() => undefined);
  };

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    await api.post("/users", {
      name,
      email,
      phone,
      password,
      role,
      faculty,
      classLevel: role === "student" ? classLevel : undefined
    });
    setName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setRole("student");
    setFaculty("");
    setClassLevel("");
    loadUsers();
  };

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editing) return;
    await api.put(`/users/${editing._id}`, {
      name: editing.name,
      email: editing.email,
      phone: editing.phone,
      role: editing.role,
      faculty: editing.faculty,
      classLevel: editing.role === "student" ? editing.classLevel : undefined
    });
    setEditing(null);
    loadUsers();
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/users/${id}`);
    loadUsers();
  };

  const semesterOptions =
    faculties.find((item) => item._id === faculty)?.semesters?.length
      ? faculties.find((item) => item._id === faculty)?.semesters
      : Array.from({ length: 8 }, (_, i) => `Semester ${i + 1}`);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-slate-900">User management</h3>
      <form onSubmit={handleCreate} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-3 md:grid-cols-4">
          <input
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
            placeholder="Full name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
          <input
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <input
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
            placeholder="Phone / WhatsApp"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            required={role !== "admin"}
          />
          <input
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
            placeholder="Temp password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <select
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
            value={role}
            onChange={(event) => setRole(event.target.value)}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
          <select
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
            value={faculty}
            onChange={(event) => {
              setFaculty(event.target.value);
              setClassLevel("");
            }}
            required
          >
            <option value="">Select faculty</option>
            {faculties.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
          {role === "student" && (
            <select
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
              value={classLevel}
              onChange={(event) => setClassLevel(event.target.value)}
              required
            >
              <option value="">Select semester</option>
              {semesterOptions?.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          )}
        </div>
        <button
          type="submit"
          className="mt-4 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white"
        >
          Add user
        </button>
      </form>

      {editing && (
        <form onSubmit={handleUpdate} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-3 md:grid-cols-4">
            <input
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
              value={editing.name}
              onChange={(event) => setEditing({ ...editing, name: event.target.value })}
              required
            />
            <input
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
              value={editing.email}
              onChange={(event) => setEditing({ ...editing, email: event.target.value })}
              required
            />
            <input
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
              value={editing.phone || ""}
              placeholder="Phone / WhatsApp"
              onChange={(event) => setEditing({ ...editing, phone: event.target.value })}
            />
            <select
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
              value={editing.role}
              onChange={(event) => setEditing({ ...editing, role: event.target.value })}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
            <select
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
              value={editing.faculty}
              onChange={(event) => setEditing({ ...editing, faculty: event.target.value })}
              required
            >
              <option value="">Select faculty</option>
              {faculties.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
            {editing.role === "student" && (
              <select
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                value={editing.classLevel || ""}
                onChange={(event) => setEditing({ ...editing, classLevel: event.target.value })}
                required
              >
                <option value="">Select semester</option>
                {(faculties.find((item) => item._id === editing.faculty)?.semesters?.length
                  ? faculties.find((item) => item._id === editing.faculty)?.semesters
                  : Array.from({ length: 8 }, (_, i) => `Semester ${i + 1}`)
                )?.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="mt-4 flex gap-3">
            <button
              type="submit"
              className="rounded-2xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white"
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

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-3">
          {users.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between rounded-2xl border border-slate-200 p-4"
            >
              <div>
                <p className="text-sm text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
                {user.phone && <p className="text-xs text-slate-400">{user.phone}</p>}
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-600">
                  {user.role}
                </span>
                <button
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600"
                  onClick={() => setEditing(user)}
                >
                  Edit
                </button>
                <button
                  className="rounded-full border border-rose-200 px-3 py-1 text-xs text-rose-600"
                  onClick={() => handleDelete(user._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {users.length === 0 && <p className="text-sm text-slate-500">No users yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
