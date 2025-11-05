import React from "react";
import type { Student } from "../types/student";

interface Props {
  students: Student[];
  onEdit: (s: Student) => void;
  onDelete: (id: string) => void;
}

export default function StudentTable({ students, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-auto bg-white rounded shadow">
      <table className="min-w-full divide-y">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Age</th>
            <th className="px-4 py-2 text-left">Course</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {students.map((s, i) => (
            <tr key={i}>
              <td className="px-4 py-2">{s.name}</td>
              <td className="px-4 py-2">{s.email}</td>
              <td className="px-4 py-2">{s.age}</td>
              <td className="px-4 py-2">{s.course}</td>
              <td className="px-4 py-2 text-center">
                <button
                  onClick={() => onEdit(s)}
                  className="px-2 py-1 mr-2 border rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(String(i))}
                  className="px-2 py-1 border rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
