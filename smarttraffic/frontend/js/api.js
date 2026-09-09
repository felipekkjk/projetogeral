// frontend/js/api.js
const API_BASE_URL = 'http://localhost:3000/api';

async function fetchTrafficFlow(lat, lon) {
    try {
        const response = await fetch(`${API_BASE_URL}/traffic/flow?lat=${lat}&lon=${lon}`);
        return await response.json();
    } catch (error) {
        console.error("Erro ao buscar dados do fluxo:", error);
        return null;
    }
}

async function fetchIncidents(lat, lon) {
    try {
        const response = await fetch(`${API_BASE_URL}/traffic/incidents?lat=${lat}&lon=${lon}`);
        return await response.json();
    } catch (error) {
        console.error("Erro ao buscar incidentes:", error);
        return null;
    }
}
