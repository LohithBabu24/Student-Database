from bson import ObjectId


def serialize_student(doc):
    if not doc: return None
    return {
'_id': str(doc.get('_id')),
'name': doc.get('name'),
'email': doc.get('email'),
'age': doc.get('age'),
'course': doc.get('course'),
}