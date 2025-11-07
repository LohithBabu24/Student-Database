from flask import Blueprint, request, jsonify
from utils.db_connection import students_collection
from bson import ObjectId

bp = Blueprint("students", __name__)

# ✅ Get all students
@bp.route("/", methods=["GET"])
def get_students():
    students = list(students_collection.find().sort("_id", 1))  # ascending order
    for student in students:
        student["_id"] = str(student["_id"])
    return jsonify(students), 200

# ✅ Add new student
@bp.route("/", methods=["POST"])
def add_student():
    data = request.get_json()
    if not data or "name" not in data:
        return jsonify({"error": "Invalid student data"}), 400

    result = students_collection.insert_one(data)
    data["_id"] = str(result.inserted_id)
    return jsonify({"message": "Student added successfully", "student": data}), 201
