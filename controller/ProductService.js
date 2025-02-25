// ProductService.js
export default class ProductService {
    async fetchProducts() {
        try {
            const response = await fetch('productos'); // Endpoint para obtener datos
            const data = await response.text();
            return this.parseProducts(data);
        } catch (error) {
            console.error('Error al cargar productos:', error);
            return [];
        }
    }

    parseProducts(data) {
        // Convierte el texto en un array de objetos producto
        const lines = data.trim().split('\n');
        // Suponiendo que la primera línea sea encabezado
        return lines.slice(1).map(line => {
            const [id, nombre, stock, precio, descuento, descripcion] = line.split('|');
            return {
                id,
                nombre,
                stock: parseInt(stock),
                precio: parseFloat(precio),
                descuento: parseFloat(descuento),
                descripcion
            };
        });
    }
}
