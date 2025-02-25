const API_URL = "https://proyectoanalisis.onrender.com";
const WS_URL = "wss://tu-servidor-websocket.com"; // Reemplázalo si usas WebSockets en otro lugar

const socket = new WebSocket(WS_URL);

// Conectar a WebSockets
socket.onopen = () => {
    console.log("Conectado al servidor WebSocket");
};

// Recibir mensajes en tiempo real
socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("Mensaje recibido:", data);

    if (data.type === "updateProducts") {
        console.log("Productos actualizados:", data.fileContent);
        cargarProductos();
    }
};

// Manejar cierre de conexión
socket.onclose = () => {
    console.log("Conexión WebSocket cerrada");
};

// Obtener productos desde el backend
async function cargarProductos() {
    try {
        const response = await fetch(`${API_URL}/productos`);
        const productos = await response.json();
        console.log("Productos cargados:", productos);
        mostrarProductos(productos);
    } catch (error) {
        console.error("Error al obtener productos:", error);
    }
}

// Mostrar productos en la interfaz
function mostrarProductos(productos) {
    const lista = document.getElementById("lista-productos");
    lista.innerHTML = "";

    productos.forEach(producto => {
        const item = document.createElement("li");
        item.textContent = `${producto.nombre} - ${producto.precio} USD`;
        lista.appendChild(item);
    });
}

// Guardar productos
async function guardarProductos() {
    const fileContent = "Ejemplo de datos de productos"; // Simulación de contenido

    try {
        const response = await fetch(`${API_URL}/guardar-productos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ fileContent })
        });

        const result = await response.text();
        console.log("Guardado con éxito:", result);
    } catch (error) {
        console.error("Error al guardar productos:", error);
    }
}

// Cargar productos al iniciar
document.addEventListener("DOMContentLoaded", cargarProductos);
