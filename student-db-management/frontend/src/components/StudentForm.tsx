import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Student } from "../types/student";

const API_URL = "http://127.0.0.1:5000/api/students/"; // ✅ Centralized backend URL

export default function StudentForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [course, setCourse] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !age) {
      alert("⚠️ Please fill all required fields");
      return;
    }

    const newStudent: Student = {
      name,
      email,
      age: Number(age),
      course,
    };

    try {
      setLoading(true);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStudent),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Server error:", errText);
        throw new Error("Failed to add student");
      }

      await response.json();
      alert("✅ Student added successfully!");
      navigate("/details");
    } catch (error) {
      console.error("❌ Error adding student:", error);
      alert("❌ Failed to add student. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <form
        onSubmit={handleSubmit}
        className="space-y-3 p-4 bg-white rounded shadow w-96"
      >
        <h2 className="text-xl font-semibold mb-2 text-center">
          Register Student
        </h2>

        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded border px-2 py-1"
            placeholder="Enter name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded border px-2 py-1"
            placeholder="Enter email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) =>
              setAge(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="mt-1 block w-full rounded border px-2 py-1"
            placeholder="Enter age"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Course</label>
          <input
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="mt-1 block w-full rounded border px-2 py-1"
            placeholder="Enter course name"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded text-white w-full ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Adding..." : "Add Student"}
        </button>
      </form>
    </div>
  );
}
