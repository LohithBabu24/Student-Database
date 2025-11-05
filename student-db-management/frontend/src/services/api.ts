const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:5000'


export async function fetchStudents() {
const res = await fetch(`${API_BASE}/students`)
return res.json()
}


export async function createStudent(data: any) {
const res = await fetch(`${API_BASE}/students`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(data),
})
return res.json()
}


export async function updateStudent(id: string, data: any) {
const res = await fetch(`${API_BASE}/students/${id}`, {
method: 'PUT',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(data),
})
return res.json()
}


export async function deleteStudent(id: string) {
const res = await fetch(`${API_BASE}/students/${id}`, { method: 'DELETE' })
return res.json()
}