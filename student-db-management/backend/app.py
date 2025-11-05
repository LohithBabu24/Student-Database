from flask import Flask, jsonify
from flask_cors import CORS
from routes.student_routes import bp as student_bp
import os

# ---------------------------------------------------------
# Initialize Flask app
# ---------------------------------------------------------
app = Flask(__name__)
CORS(app)  # Allow frontend (React) requests

# ---------------------------------------------------------
# Register Blueprints (Routes)
# ---------------------------------------------------------
from routes.student_routes import bp as student_bp
app.register_blueprint(student_bp, url_prefix="/students")

# ---------------------------------------------------------
# Health Check Route
# ---------------------------------------------------------
@app.route("/")
def home():
    return jsonify({"status": "ok", "message": "Student DB API running!"})

# ---------------------------------------------------------
# Run the Flask app
# ---------------------------------------------------------
if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
