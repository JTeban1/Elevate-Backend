const API_URL = "http://localhost:9000";

// GET (leer datos)
export async function fetchData(endpoint) {
    const res = await fetch(`${API_URL}/${endpoint}`);
    if (!res.ok) throw new Error(`Error al obtener datos: ${res.status}`);
    return res.json();
}

// POST (crear)
export async function createData(endpoint, data) {
    const res = await fetch(`${API_URL}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Error al crear registro: ${res.status}`);
    return res.json();
}

// PUT (actualizar)
export async function updateData(endpoint, id, data) {
    const res = await fetch(`${API_URL}/${endpoint}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Error al actualizar registro: ${res.status}`);
    return res.json();
}

// DELETE (eliminar)
export async function deleteData(endpoint, id) {
    const res = await fetch(`${API_URL}/${endpoint}/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error(`Error al eliminar registro: ${res.status}`);
    return true;
}
