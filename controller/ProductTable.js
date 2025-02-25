// ProductTable.js
export default class ProductTable {
    constructor(productStateObserver) {
        this.productStateObserver = productStateObserver;
    }

    renderTable(productos) {
        const tbody = document.querySelector("#product-table tbody");
        tbody.innerHTML = '';

        productos.forEach(producto => {
            const estado = this.getStockStatus(producto.stock);

            const row = document.createElement('tr');
            row.setAttribute('data-product-id', producto.id);
            row.innerHTML = `
          <td>${producto.id}</td>
          <td>${producto.nombre}</td>
          <td>${producto.stock}</td>
          <td>${estado}</td>
          <td>
            <button class="btn_modificar btn btn-primary" data-product='${JSON.stringify(producto)}'>
                <i class="fas fa-edit"></i> 
            </button>
          </td>
        `;
            tbody.appendChild(row);
        });

        // Suscribir un "observador" para cambiar el color de fila
        this.attachObserver();

        // Agregar evento a los botones de modificar
        this.attachEventListeners();
    }

    getStockStatus(stock) {
        if (stock > 300) return 'Adecuado';
        if (stock >= 100) return 'Bajo';
        return 'Crítico';
    }

    attachObserver() {
        // Observador que cambia color de la fila en 'select' / 'deselect'
        const tableObserver = {
            update: (product, action) => {
                const row = document.querySelector(`tr[data-product-id="${product.id}"]`);
                if (row) {
                    if (action === 'select') {
                        row.style.backgroundColor = 'yellow';
                    } else if (action === 'deselect') {
                        row.style.backgroundColor = '';
                    }
                }
            }
        };
        this.productStateObserver.subscribe(tableObserver);
    }

    attachEventListeners() {
        document.querySelectorAll('.btn_modificar').forEach(button => {
            button.addEventListener('click', () => {
                const producto = JSON.parse(button.getAttribute('data-product'));

                // Intentar seleccionar el producto
                const canSelect = this.productStateObserver.selectProduct(producto);
                if (!canSelect) {
                    return;
                }

                // Guardar en localStorage y abrir gestión
                localStorage.setItem('productoSeleccionado', JSON.stringify(producto));
                window.open('gestionProducto.html', '_blank');
            });
        });
    }
}
