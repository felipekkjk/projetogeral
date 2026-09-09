// backend/routes/traffic.js
// ARQUIVO DE ROTAS DA API DE TRÂNSITO
// Gerencia todas as requisições relacionadas a trânsito

const express = require('express');
const axios = require('axios');
const router = express.Router();

// Configuração da API TomTom
const TOMTOM_API_KEY = process.env.TOMTOM_API_KEY || 'sua_chave_aqui';
const TOMTOM_BASE_URL = 'https://api.tomtom.com/traffic/services/4';

// ----------------------------------------------------------------
// ROTA 1: Dados de fluxo em tempo real
// GET /api/traffic/flow?lat=-23.5505&lon=-46.6333
// ----------------------------------------------------------------
router.get('/flow', async (req, res) => {
    try {
        const { lat, lon } = req.query;
        
        if (!lat || !lon) {
            return res.status(400).json({ 
                error: 'Parâmetros lat e lon são obrigatórios' 
            });
        }

        const response = await axios.get(
            `${TOMTOM_BASE_URL}/flowSegmentData/relative0/10/json`,
            {
                params: {
                    key: TOMTOM_API_KEY,
                    point: `${lat},${lon}`,
                    unit: 'KMPH'
                }
            }
        );

        // Processar dados
        const data = response.data.flowSegmentData;
        const processedData = {
            velocidade: data.currentSpeed,
            velocidadeLivre: data.freeFlowSpeed,
            congestionamento: Math.round((1 - data.currentSpeed / data.freeFlowSpeed) * 100),
            timestamp: new Date().toISOString(),
            coordenadas: {
                latitude: data.coordinates.latitude,
                longitude: data.coordinates.longitude
            }
        };

        res.json(processedData);

    } catch (error) {
        console.error('Erro ao buscar dados de fluxo:', error);
        res.status(500).json({ 
            error: 'Falha ao obter dados de trânsito',
            details: error.message 
        });
    }
});

// ----------------------------------------------------------------
// ROTA 2: Incidentes e acidentes
// GET /api/traffic/incidents?lat=-23.5505&lon=-46.6333&radius=5000
// ----------------------------------------------------------------
router.get('/incidents', async (req, res) => {
    try {
        const { lat, lon, radius = 5000 } = req.query;

        const response = await axios.get(
            `${TOMTOM_BASE_URL}/incidentData`,
            {
                params: {
                    key: TOMTOM_API_KEY,
                    bbox: `${parseFloat(lat) - 0.1},${parseFloat(lon) - 0.1},${parseFloat(lat) + 0.1},${parseFloat(lon) + 0.1}`,
                    fields: '{incidents{type,geometry,properties}}'
                }
            }
        );

        const incidents = response.data.incidents || [];
        const processedIncidents = incidents.map(incident => ({
            id: incident.id,
            tipo: incident.properties?.type || 'Desconhecido',
            descricao: incident.properties?.description || 'Sem descrição',
            gravidade: incident.properties?.severity || 'Baixa',
            coordenadas: incident.geometry?.coordinates || null,
            horario: incident.properties?.startTime || new Date().toISOString()
        }));

        res.json({
            total: processedIncidents.length,
            incidentes: processedIncidents
        });

    } catch (error) {
        console.error('Erro ao buscar incidentes:', error);
        res.status(500).json({ error: 'Falha ao obter incidentes' });
    }
});

// ----------------------------------------------------------------
// ROTA 3: Rotas alternativas
// POST /api/traffic/route
// Body: { origin: {lat, lon}, destination: {lat, lon} }
// ----------------------------------------------------------------
router.post('/route', async (req, res) => {
    try {
        const { origin, destination } = req.body;

        if (!origin || !destination) {
            return res.status(400).json({ 
                error: 'Origem e destino são obrigatórios' 
            });
        }

        // Mock de rotas alternativas (substituir por API real)
        const alternativeRoutes = [
            {
                nome: 'Rota Principal',
                distancia: '12.5 km',
                tempo: '25 min',
                economia: '0 min',
                trafego: 'Moderado'
            },
            {
                nome: 'Rota Alternativa 1',
                distancia: '15.2 km',
                tempo: '22 min',
                economia: '3 min',
                trafego: 'Leve'
            },
            {
                nome: 'Rota Alternativa 2',
                distancia: '18.7 km',
                tempo: '19 min',
                economia: '6 min',
                trafego: 'Leve'
            }
        ];

        res.json({
            origem: origin,
            destino: destination,
            rotas: alternativeRoutes
        });

    } catch (error) {
        console.error('Erro ao calcular rotas:', error);
        res.status(500).json({ error: 'Falha ao calcular rotas' });
    }
});

// ----------------------------------------------------------------
// ROTA 4: Previsão de trânsito
// GET /api/traffic/prediction?lat=-23.5505&lon=-46.6333&time=2026-09-03T18:00:00
// ----------------------------------------------------------------
router.get('/prediction', async (req, res) => {
    try {
        const { lat, lon, time } = req.query;

        // Mock de previsão (implementar ML real depois)
        const predictions = [
            { horario: '07:00', nivel: 20, descricao: 'Trânsito leve' },
            { horario: '08:00', nivel: 65, descricao: 'Trânsito intenso' },
            { horario: '09:00', nivel: 80, descricao: 'Congestionamento' },
            { horario: '10:00', nivel: 45, descricao: 'Trânsito moderado' },
            { horario: '17:00', nivel: 30, descricao: 'Trânsito leve' },
            { horario: '18:00', nivel: 75, descricao: 'Trânsito intenso' },
            { horario: '19:00', nivel: 50, descricao: 'Trânsito moderado' }
        ];

        res.json({
            localizacao: { lat, lon },
            previsoes: predictions,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Erro ao gerar previsão:', error);
        res.status(500).json({ error: 'Falha ao gerar previsão' });
    }
});

module.exports = router;

