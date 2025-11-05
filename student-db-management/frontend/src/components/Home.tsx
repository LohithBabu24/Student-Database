import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="absolute top-4 right-4">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          🎓 Students Data Management System
        </h1>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/add"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            ➕ Add Student
          </Link>

          <Link
            to="/details"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            📋 View Students
          </Link>
        </div>
      </div>
    </div>
  );
}
