// backend/server.js
// ARQUIVO PRINCIPAL DO SERVIDOR
// Responsável por iniciar o servidor Express e configurar middlewares

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const trafficRoutes = require('./routes/traffic');

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Permite requisições de diferentes origens (libera o frontend)
app.use(express.json()); // Permite receber dados em JSON
app.use(express.urlencoded({ extended: true })); // Parse URL encoded

// Rotas
app.use('/api/traffic', trafficRoutes);

// Rota de saúde (health check)
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        message: 'SmartTraffic API está funcionando!'
    });
});

// Tratamento de erros global
app.use((err, req, res, next) => {
    console.error('Erro:', err.stack);
    res.status(500).json({ 
        error: 'Ops! Algo deu errado no servidor',
        details: err.message 
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📍 http://localhost:${PORT}/api/health`);
});
