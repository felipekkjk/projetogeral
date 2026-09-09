// frontend/js/api.js

const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Faz uma requisição à API com tratamento de erros.
 */
async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {})
            }
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Erro na API (${endpoint}):`, error);
        return null;
    }
}

/**
 * Busca dados do fluxo de trânsito.
 */
async function fetchTrafficFlow(lat, lon) {
    return apiRequest(
        `/traffic/flow?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`
    );
}

/**
 * Busca incidentes de trânsito.
 */
async function fetchIncidents(lat, lon) {
    return apiRequest(
        `/traffic/incidents?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`
    );
}

/**
 * Atualiza todos os dados do dashboard.
 */
async function fetchTrafficData(lat, lon) {
    const [flow, incidents] = await Promise.all([
        fetchTrafficFlow(lat, lon),
        fetchIncidents(lat, lon)
    ]);

    return {
        flow,
        incidents
    };
}
