from flask import Flask
from flask_cors import CORS
from utils.db_connection import client
from routes.student_routes import bp as students_bp
from routes.users import bp as users_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(students_bp, url_prefix="/api/students")
app.register_blueprint(users_bp, url_prefix="/api/users")

if __name__ == "__main__":
    app.run(debug=True)
