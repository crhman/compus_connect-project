import React, { useEffect, useState } from "react";
import api from "../api/client";

interface StudentItem {
  _id: string;
  name: string;
  email: string;
}

const TeacherStudentsPage: React.FC = () => {
  const [students, setStudents] = useState<StudentItem[]>([]);

  useEffect(() => {
    api.get("/teacher/students").then((res) => setStudents(res.data)).catch(() => undefined);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-slate-900">Your Students</h3>
        <p className="text-sm text-slate-500">Students enrolled in your faculty.</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-3">
          {students.map((student) => (
            <div key={student._id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">{student.name}</p>
                <p className="text-xs text-slate-500">{student.email}</p>
              </div>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs text-indigo-600">Active</span>
            </div>
          ))}
          {students.length === 0 && <p className="text-sm text-slate-500">No students yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default TeacherStudentsPage;
