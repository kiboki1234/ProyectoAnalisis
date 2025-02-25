const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;
const BACKEND_URL = "https://proyectoanalisis.onrender.com";

// Habilitar CORS para permitir peticiones desde el frontend en Vercel
app.use(cors({
    origin: ['https://proyecto-analisis-ih96.vercel.app'],
    methods: ['GET', 'POST']
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'view')));
app.use('/controller', express.static(path.join(__dirname, 'controller')));

// Singleton para almacenar los productos seleccionados
class SelectedProducts {
    constructor() {
        if (!SelectedProducts.instance) {
            this.products = new Map();
            SelectedProducts.instance = this;
        }
        return SelectedProducts.instance;
    }

    set(productId, userId) {
        this.products.set(productId, userId);
    }

    delete(productId) {
        this.products.delete(productId);
    }

    entries() {
        return this.products.entries();
    }
}

const selectedProducts = new SelectedProducts();

// WebSockets para actualización en tiempo real
wss.on('connection', (ws) => {
    console.log("Cliente conectado a WebSockets");

    // Enviar estado inicial de productos seleccionados
    ws.send(JSON.stringify({
        type: 'initialState',
        selectedProducts: Array.from(selectedProducts.entries())
    }));

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);

            switch (data.type) {
                case 'selectProduct':
                    selectedProducts.set(data.productId, data.userId);
                    break;
                case 'deselectProduct':
                    selectedProducts.delete(data.productId);
                    break;
            }

            // Notificar a todos los clientes excepto al remitente
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(data));
                }
            });
        } catch (error) {
            console.error('Error procesando mensaje:', error);
        }
    });

    ws.on('close', () => {
        console.log("Cliente desconectado de WebSockets");
    });
});

// Rutas API
app.get('/productos', async (req, res) => {
    try {
        const response = await axios.get(`${BACKEND_URL}/productos`);
        res.json(response.data);
    } catch (error) {
        console.error("Error al obtener productos del backend:", error);
        res.status(500).send('Error al obtener productos del backend');
    }
});

app.post('/guardar-productos', async (req, res) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/guardar-productos`, req.body);

        // Notificar a los clientes WebSocket del cambio
        const message = JSON.stringify({
            type: 'updateProducts',
            fileContent: req.body.fileContent
        });
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });

        res.send(response.data);
    } catch (error) {
        console.error("Error al guardar productos en el backend:", error);
        res.status(500).send('Error al guardar productos en el backend');
    }
});

// Iniciar servidor
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});
