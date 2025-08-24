const API_URL = "http://localhost:3000";

export async function fetchData(endpoint) {
    const res = await fetch(`${API_URL}/${endpoint}`);
    return res.json();
}

// Ejemplo: obtener candidatos
// const candidates = await fetchData("candidates");
