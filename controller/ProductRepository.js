// ProductRepository.js
export default class ProductRepository {
    async fetchProducts() {
        try {
            const response = await fetch('/productos');
            const data = await response.text();
            const lines = data.trim().split('\n');
            // Se asume que la primera línea es el encabezado
            return lines.slice(1).map(line => {
                const [id, nombre, stock, precio, descuento, descripcion, estado] = line.split('|');
                return { id, nombre, stock, precio, descuento, descripcion, estado };
            });
        } catch (error) {
            console.error('Error al cargar los productos:', error);
            throw error;
        }
    }

    async saveProducts(products) {
        const fileContent =
            'ID|Nombre|Stock|Precio|Descuento|Descripción\n' +
            products.map(p => `${p.id}|${p.nombre}|${p.stock}|${p.precio}|${p.descuento}|${p.descripcion}`).join('\n');
        try {
            const response = await fetch('/guardar-productos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileContent })
            });
            const data = await response.text();
            console.log(data);
            return true;
        } catch (error) {
            console.error('Error al guardar los productos:', error);
            return false;
        }
    }
}
