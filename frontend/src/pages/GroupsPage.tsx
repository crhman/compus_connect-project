import React, { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

interface GroupItem {
  _id: string;
  name: string;
  subject: string;
  classLevel?: string;
  createdBy?: string;
  materials?: { title: string; url?: string; createdAt: string }[];
  assignments?: { title: string; description?: string; dueDate?: string; createdAt: string }[];
}

interface FacultyItem {
  _id: string;
  name: string;
  semesters?: string[];
}

const GroupsPage: React.FC = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [faculties, setFaculties] = useState<FacultyItem[]>([]);
  const [groupName, setGroupName] = useState("");
  const [groupSubject, setGroupSubject] = useState("");
  const [groupClassLevel, setGroupClassLevel] = useState("Semester 1");
  const [materialInputs, setMaterialInputs] = useState<Record<string, { title: string; url: string }>>({});
  const [assignmentInputs, setAssignmentInputs] = useState<
    Record<string, { title: string; description: string; dueDate: string }>
  >({});

  const loadGroups = () => {
    api.get("/groups").then((res) => setGroups(res.data)).catch(() => undefined);
  };

  useEffect(() => {
    loadGroups();
    api.get("/faculties").then((res) => setFaculties(res.data || [])).catch(() => undefined);
  }, []);

  const handleJoin = async (groupId: string) => {
    await api.post("/groups/join", { groupId });
    loadGroups();
  };

  const handleCreateGroup = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!groupName || !groupSubject) return;
    await api.post("/groups", {
      name: groupName,
      subject: groupSubject,
      faculty: user?.faculty,
      classLevel: groupClassLevel
    });
    setGroupName("");
    setGroupSubject("");
    setGroupClassLevel("Semester 1");
    loadGroups();
  };

  const handleAddMaterial = async (groupId: string) => {
    const entry = materialInputs[groupId];
    if (!entry?.title) return;
    await api.post(`/groups/${groupId}/materials`, { title: entry.title, url: entry.url });
    setMaterialInputs((prev) => ({ ...prev, [groupId]: { title: "", url: "" } }));
    loadGroups();
  };

  const handleAddAssignment = async (groupId: string) => {
    const entry = assignmentInputs[groupId];
    if (!entry?.title) return;
    await api.post(`/groups/${groupId}/assignments`, {
      title: entry.title,
      description: entry.description,
      dueDate: entry.dueDate
    });
    setAssignmentInputs((prev) => ({ ...prev, [groupId]: { title: "", description: "", dueDate: "" } }));
    loadGroups();
  };

  const semesterOptions =
    faculties.find((faculty) => faculty._id === user?.faculty)?.semesters?.length
      ? faculties.find((faculty) => faculty._id === user?.faculty)?.semesters
      : Array.from({ length: 8 }, (_, i) => `Semester ${i + 1}`);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-slate-900">Study groups</h3>
        <p className="text-sm text-slate-500">Join groups inside your faculty.</p>
      </div>
      {user?.role === "teacher" && (
        <form onSubmit={handleCreateGroup} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-4">
            <input
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
              placeholder="Group name"
              value={groupName}
              onChange={(event) => setGroupName(event.target.value)}
              required
            />
            <input
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
              placeholder="Subject"
              value={groupSubject}
              onChange={(event) => setGroupSubject(event.target.value)}
              required
            />
            <select
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
              value={groupClassLevel}
              onChange={(event) => setGroupClassLevel(event.target.value)}
              required
            >
              {semesterOptions?.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white"
            >
              Create group
            </button>
          </div>
        </form>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {groups.map((group) => (
          <div key={group._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h4 className="text-lg font-semibold text-slate-900">{group.name}</h4>
            <p className="text-sm text-slate-500">{group.subject}</p>
            <p className="text-xs text-indigo-500">{group.classLevel}</p>
            <div className="mt-3 grid gap-3 text-xs text-slate-500">
              <div>
                <p className="font-semibold text-slate-700">Materials</p>
                {group.materials?.length ? (
                  <ul className="mt-2 space-y-1">
                    {group.materials.slice(0, 3).map((item, index) => (
                      <li key={`${group._id}-mat-${index}`} className="flex items-center justify-between">
                        <span>{item.title}</span>
                        {item.url && (
                          <a className="text-indigo-600" href={item.url} target="_blank" rel="noreferrer">
                            Open
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-xs text-slate-400">No materials yet.</p>
                )}
              </div>
              <div>
                <p className="font-semibold text-slate-700">Assignments</p>
                {group.assignments?.length ? (
                  <ul className="mt-2 space-y-1">
                    {group.assignments.slice(0, 3).map((item, index) => (
                      <li key={`${group._id}-as-${index}`} className="flex items-center justify-between">
                        <span>{item.title}</span>
                        {item.dueDate && (
                          <span className="text-[10px] text-slate-400">
                            Due {new Date(item.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-xs text-slate-400">No assignments yet.</p>
                )}
              </div>
            </div>
            {user?.role === "student" && (
              <button
                onClick={() => handleJoin(group._id)}
                className="mt-4 rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white"
              >
                Join group
              </button>
            )}
            {user?.role === "teacher" && group.createdBy === user.id && (
              <div className="mt-4 grid gap-3">
                <div className="grid gap-2 md:grid-cols-2">
                  <input
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700"
                    placeholder="Material title"
                    value={materialInputs[group._id]?.title || ""}
                    onChange={(event) =>
                      setMaterialInputs((prev) => ({
                        ...prev,
                        [group._id]: { ...prev[group._id], title: event.target.value }
                      }))
                    }
                  />
                  <input
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700"
                    placeholder="Material link (optional)"
                    value={materialInputs[group._id]?.url || ""}
                    onChange={(event) =>
                      setMaterialInputs((prev) => ({
                        ...prev,
                        [group._id]: { ...prev[group._id], url: event.target.value }
                      }))
                    }
                  />
                  <button
                    type="button"
                    onClick={() => handleAddMaterial(group._id)}
                    className="rounded-2xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white md:col-span-2"
                  >
                    Share material
                  </button>
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  <input
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700"
                    placeholder="Assignment title"
                    value={assignmentInputs[group._id]?.title || ""}
                    onChange={(event) =>
                      setAssignmentInputs((prev) => ({
                        ...prev,
                        [group._id]: { ...prev[group._id], title: event.target.value }
                      }))
                    }
                  />
                  <input
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700"
                    placeholder="Due date"
                    type="date"
                    value={assignmentInputs[group._id]?.dueDate || ""}
                    onChange={(event) =>
                      setAssignmentInputs((prev) => ({
                        ...prev,
                        [group._id]: { ...prev[group._id], dueDate: event.target.value }
                      }))
                    }
                  />
                  <input
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 md:col-span-2"
                    placeholder="Assignment description (optional)"
                    value={assignmentInputs[group._id]?.description || ""}
                    onChange={(event) =>
                      setAssignmentInputs((prev) => ({
                        ...prev,
                        [group._id]: { ...prev[group._id], description: event.target.value }
                      }))
                    }
                  />
                  <button
                    type="button"
                    onClick={() => handleAddAssignment(group._id)}
                    className="rounded-2xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white md:col-span-2"
                  >
                    Share assignment
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {groups.length === 0 && <p className="text-sm text-slate-500">No groups found.</p>}
      </div>
    </div>
  );
};

export default GroupsPage;
