import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Student } from "../types/student";

export default function StudentDetails() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterAge, setFilterAge] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/students/");
        if (!res.ok) throw new Error("Failed to fetch students");
        const data = await res.json();

        // ✅ Assign serial numbers permanently
        const numbered = data.map((student: Student, index: number) => ({
          ...student,
          serialNo: index + 1,
        }));

        setStudents(numbered);
        setFilteredStudents(numbered);
      } catch (error) {
        console.error(error);
        alert("❌ Error fetching student data. Check your backend.");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // ✅ Apply filter
  const applyFilter = () => {
    let result = students;
    if (filterAge) result = result.filter((s) => s.age.toString() === filterAge);
    if (filterCourse)
      result = result.filter((s) =>
        s.course.toLowerCase().includes(filterCourse.toLowerCase())
      );
    setFilteredStudents(result);
    setShowFilter(false);
  };

  // ✅ Reset filter
  const resetFilter = () => {
    setFilterAge("");
    setFilterCourse("");
    setFilteredStudents(students);
  };

  // ✅ Delete student
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:5000/students/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      const updated = students.filter((s: any) => s._id !== id);

      // 🔢 Reassign serial numbers after delete
      const renumbered = updated.map((s, i) => ({ ...s, serialNo: i + 1 }));

      setStudents(renumbered);
      setFilteredStudents(renumbered);
      alert("✅ Student deleted successfully");
    } catch (error) {
      console.error(error);
      alert("❌ Could not delete student");
    }
  };

  // ✅ Edit
  const handleEdit = (student: any) => {
    setEditingStudent(student);
  };

  // ✅ Update
  const handleUpdate = async () => {
    if (!editingStudent) return;
    try {
      const res = await fetch(
        `http://127.0.0.1:5000/students/${(editingStudent as any)._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingStudent),
        }
      );
      if (!res.ok) throw new Error("Failed to update");
      const updated = await res.json();

      const updatedList = students.map((s) =>
        s._id === editingStudent._id ? { ...updated, serialNo: s.serialNo } : s
      );

      setStudents(updatedList);
      setFilteredStudents(updatedList);
      alert("✅ Student updated successfully");
      setEditingStudent(null);
    } catch (error) {
      console.error(error);
      alert("❌ Failed to update");
    }
  };

  if (loading) return <p className="p-6 text-center">Loading students...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-blue-600 mb-4 sm:mb-0">
          Registered Students
        </h2>

        {/* Filter Button */}
        <div className="relative">
          <button
            onClick={() => setShowFilter((prev) => !prev)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            🔍 Filter
          </button>

          {showFilter && (
            <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg p-4 w-64 z-10">
              <h3 className="font-semibold mb-2 text-gray-700">Filter Options</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Filter by Age"
                  value={filterAge}
                  onChange={(e) => setFilterAge(e.target.value)}
                  className="w-full border rounded px-2 py-1"
                />
                <input
                  type="text"
                  placeholder="Filter by Course"
                  value={filterCourse}
                  onChange={(e) => setFilterCourse(e.target.value)}
                  className="w-full border rounded px-2 py-1"
                />
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={applyFilter}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Apply
                </button>
                <button
                  onClick={resetFilter}
                  className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-md rounded-lg p-4">
        {filteredStudents.length === 0 ? (
          <p className="text-center">No students found.</p>
        ) : (
          <table className="min-w-full border text-center">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2">S.No</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Age</th>
                <th className="border px-4 py-2">Course</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s: any) => (
                <tr key={s._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{s.serialNo}</td>
                  <td className="border px-4 py-2">{s.name}</td>
                  <td className="border px-4 py-2">{s.email}</td>
                  <td className="border px-4 py-2">{s.age}</td>
                  <td className="border px-4 py-2">{s.course}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleEdit(s)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      ✏️Edit
                    </button>
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      🗑️Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Form */}
      {editingStudent && (
        <div className="mt-6 p-4 border rounded bg-gray-50 max-w-md mx-auto">
          <h3 className="text-xl font-semibold mb-3 text-center">Edit Student</h3>
          <div className="space-y-2">
            <input
              value={editingStudent.name}
              onChange={(e) =>
                setEditingStudent({ ...editingStudent, name: e.target.value })
              }
              placeholder="Name"
              className="block w-full border rounded px-2 py-1"
            />
            <input
              value={editingStudent.email}
              onChange={(e) =>
                setEditingStudent({ ...editingStudent, email: e.target.value })
              }
              placeholder="Email"
              className="block w-full border rounded px-2 py-1"
            />
            <input
              type="number"
              value={editingStudent.age}
              onChange={(e) =>
                setEditingStudent({
                  ...editingStudent,
                  age: Number(e.target.value),
                })
              }
              placeholder="Age"
              className="block w-full border rounded px-2 py-1"
            />
            <input
              value={editingStudent.course}
              onChange={(e) =>
                setEditingStudent({
                  ...editingStudent,
                  course: e.target.value,
                })
              }
              placeholder="Course"
              className="block w-full border rounded px-2 py-1"
            />
          </div>
          <div className="flex justify-center gap-3 mt-4">
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              ✅ Update
            </button>
            <button
              onClick={() => setEditingStudent(null)}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-center mt-6">
        <button
          onClick={() => navigate("/home")}
          className="px-4 py-2 bg-gray-700 text-white rounded"
        >
          ⬅️ Back to Home
        </button>
      </div>
    </div>
  );
}
