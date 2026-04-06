import React, { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

interface GroupItem {
  _id: string;
  name: string;
  subject: string;
  classLevel?: string;
  createdBy?: string;
  members?: string[];
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

  const handleLeave = async (groupId: string) => {
    await api.post(`/groups/${groupId}/leave`);
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-2xl font-semibold text-slate-900">Study groups</h3>
          <p className="text-sm text-slate-500">Join groups inside your faculty.</p>
        </div>
        <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs text-slate-600 shadow-sm">
          {user?.classLevel ? `Your class: ${user.classLevel}` : "Faculty groups"}
        </div>
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
      <div className="grid gap-5 md:grid-cols-2">
        {groups.map((group) => (
          <div
            key={group._id}
            className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-400" />
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-lg font-semibold text-slate-900">{group.name}</h4>
                <p className="text-sm text-slate-500">{group.subject}</p>
              </div>
              {group.classLevel && (
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-indigo-600">
                  {group.classLevel}
                </span>
              )}
            </div>

            {user?.role === "student" && !group.members?.includes(user.id) ? (
              <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center">
                <p className="text-xs text-slate-500">
                  Join this group to view materials and assignments.
                </p>
                <button
                  onClick={() => handleJoin(group._id)}
                  className="mt-3 w-full rounded-2xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm"
                >
                  Join group
                </button>
              </div>
            ) : (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-xs font-semibold text-slate-700">Materials</p>
                  {group.materials?.length ? (
                    <div className="mt-2 grid gap-1.5">
                      {group.materials.slice(0, 3).map((item, index) => (
                        <div
                          key={`${group._id}-mat-${index}`}
                          className="flex items-center justify-between rounded-xl bg-white px-2 py-1 text-xs text-slate-600"
                        >
                          <span className="truncate">{item.title}</span>
                          {item.url && (
                            <a className="text-indigo-600" href={item.url} target="_blank" rel="noreferrer">
                              Open
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-xs text-slate-400">No materials yet.</p>
                  )}
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-xs font-semibold text-slate-700">Assignments</p>
                  {group.assignments?.length ? (
                    <div className="mt-2 grid gap-1.5">
                      {group.assignments.slice(0, 3).map((item, index) => (
                        <div
                          key={`${group._id}-as-${index}`}
                          className="flex items-center justify-between rounded-xl bg-white px-2 py-1 text-xs text-slate-600"
                        >
                          <span className="truncate">{item.title}</span>
                          {item.dueDate && (
                            <span className="text-[10px] text-slate-400">
                              Due {new Date(item.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-xs text-slate-400">No assignments yet.</p>
                  )}
                </div>
              </div>
            )}
            {user?.role === "student" && group.members?.includes(user.id) && (
              <button
                onClick={() => handleLeave(group._id)}
                className="mt-4 w-full rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-600"
              >
                Leave group
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
