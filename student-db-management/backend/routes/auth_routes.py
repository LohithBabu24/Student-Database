from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from utils.db_connection import users_collection

auth_bp = Blueprint("auth_bp", __name__)

# ✅ REGISTER ROUTE
@auth_bp.route("/register", methods=["POST"])
def register_user():
    try:
        data = request.get_json()
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        if not username or not email or not password:
            return jsonify({"error": "All fields are required"}), 400

        # Check if user already exists
        existing_user = users_collection.find_one({
            "$or": [{"email": email}, {"username": username}]
        })
        if existing_user:
            return jsonify({"error": "User already exists"}), 400

        hashed_password = generate_password_hash(password)

        users_collection.insert_one({
            "username": username,
            "email": email,
            "password": hashed_password
        })

        return jsonify({"message": "✅ Registration successful!"}), 201

    except Exception as e:
        print("❌ Error registering user:", e)
        return jsonify({"error": str(e)}), 500


# ✅ LOGIN ROUTE
@auth_bp.route("/login", methods=["POST"])
def login_user():
    try:
        data = request.get_json()
        identifier = data.get("identifier")  # username or email
        password = data.get("password")

        if not identifier or not password:
            return jsonify({"error": "Username/email and password required"}), 400

        user = users_collection.find_one({
            "$or": [{"email": identifier}, {"username": identifier}]
        })

        if not user or not check_password_hash(user["password"], password):
            return jsonify({"error": "Invalid username/email or password"}), 401

        return jsonify({
            "message": "✅ Login successful!",
            "username": user["username"],
            "email": user["email"]
        }), 200

    except Exception as e:
        print("❌ Error logging in user:", e)
        return jsonify({"error": str(e)}), 500
