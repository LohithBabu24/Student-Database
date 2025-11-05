from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

# Read MongoDB URI from environment
mongo_uri = os.getenv("MONGO_URI")

if not mongo_uri:
    raise ValueError("❌ MONGO_URI not found in .env file")

client = MongoClient(mongo_uri)
db = client["student_db"]
students_collection = db["students"]

print("✅ Connected to MongoDB successfully!")
