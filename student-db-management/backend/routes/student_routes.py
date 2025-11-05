from flask import Blueprint, request, jsonify
from models.student_model import serialize_student
from utils.db_connection import students_collection
from bson.objectid import ObjectId

bp = Blueprint('students', __name__)


@bp.route('/', methods=['GET'])
def get_students():
    docs = list(students_collection.find().sort('_id', -1))
    return jsonify([serialize_student(d) for d in docs])


@bp.route('/', methods=['POST'])
def create_student():
    data = request.get_json()
    required = ['name', 'email', 'age']

    if not all(k in data for k in required):
        return jsonify({'error': 'Missing fields'}), 400

    res = students_collection.insert_one({
        'name': data['name'],
        'email': data['email'],
        'age': int(data['age']),
        'course': data.get('course', '')
    })

    doc = students_collection.find_one({'_id': res.inserted_id})
    return jsonify(serialize_student(doc)), 201


@bp.route('/<id>', methods=['PUT'])
def update_student(id):
    data = request.get_json()

    try:
        _id = ObjectId(id)
    except Exception:
        return jsonify({'error': 'Invalid id'}), 400

    students_collection.update_one(
        {'_id': _id},
        {'$set': {
            'name': data.get('name'),
            'email': data.get('email'),
            'age': int(data.get('age')) if data.get('age') is not None else None,
            'course': data.get('course', '')
        }}
    )

    doc = students_collection.find_one({'_id': _id})
    return jsonify(serialize_student(doc))


@bp.route('/<id>', methods=['DELETE'])
def delete_student(id):
    try:
        _id = ObjectId(id)
    except Exception:
        return jsonify({'error': 'Invalid id'}), 400

    students_collection.delete_one({'_id': _id})
    return jsonify({'deleted': True})
