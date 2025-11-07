from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from utils.db_connection import users_collection

bp = Blueprint("users", __name__, url_prefix="/api/users")



# ✅ Register
@bp.route("/register", methods=["POST"])
def register_user():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "All fields required"}), 400

    if users_collection.find_one({"$or": [{"username": username}, {"email": email}]}):
        return jsonify({"error": "User already exists"}), 400

    hashed_pw = generate_password_hash(password)
    users_collection.insert_one({
        "username": username,
        "email": email,
        "password": hashed_pw
    })

    return jsonify({"message": "Registration successful!"}), 201


# ✅ Login
@bp.route("/login", methods=["POST"])
def login_user():
    data = request.get_json()
    identifier = data.get("identifier")
    password = data.get("password")

    user = users_collection.find_one({
        "$or": [{"username": identifier}, {"email": identifier}]
    })

    if not user or not check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify({
        "message": "Login successful!",
        "username": user["username"],
        "email": user["email"]
    }), 200
