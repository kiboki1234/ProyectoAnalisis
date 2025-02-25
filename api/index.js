const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware para procesar JSON
app.use(express.json());

// Servir archivos estáticos desde la carpeta 'view'
app.use(express.static(path.join(__dirname, '../view')));

// Servir archivos estáticos del controlador si es necesario
app.use('/controller', express.static(path.join(__dirname, '../controller')));

// Ruta principal para servir el frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../view', 'index.html'));
});

// Ruta para obtener productos desde productos.txt
app.get('/api/productos', (req, res) => {
    fs.readFile(path.join(__dirname, '../model', 'productos.txt'), 'utf8', (err, data) => {
        if (err) {
            console.error("Error al leer productos.txt:", err);
            return res.status(500).json({ error: 'Error al leer el archivo de productos' });
        }
        res.setHeader('Content-Type', 'text/plain');
        res.send(data);
    });
});

// Ruta para guardar productos en productos.txt
app.post('/api/guardar-productos', (req, res) => {
    const fileContent = req.body.fileContent;

    fs.writeFile(path.join(__dirname, '../model', 'productos.txt'), fileContent, 'utf8', (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error al guardar el archivo de productos' });
        }
        res.json({ message: 'Archivo de productos guardado exitosamente' });
    });
});

// Exportar la aplicación para que Vercel la use como Serverless Function
module.exports = app;
