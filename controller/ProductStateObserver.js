// ProductStateObserver.js
export class ProductStateObserver {
    constructor(productStock) {
        this.observers = [];
        this.selectedProduct = null;
        this.productStock = productStock; 
        this.ws = new WebSocket(`ws://${window.location.host}`);
        this.userId = Math.random().toString(36).substring(7);

        this.setupWebSocket();
    }

    setupWebSocket() {
        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            switch (data.type) {
                case 'initialState':
                    // Actualizar estado inicial
                    data.selectedProducts.forEach(([productId, userId]) => {
                        if (userId !== this.userId) {
                            const product = this.productStock.find(p => p.id === productId);
                            if (product) {
                                this.notify(product, 'select');
                            }
                        }
                    });
                    break;

                case 'selectProduct':
                    if (data.userId !== this.userId) {
                        const product = this.productStock.find(p => p.id === data.productId);
                        if (product) {
                            this.notify(product, 'select');
                        }
                    }
                    break;

                case 'deselectProduct':
                    if (data.userId !== this.userId) {
                        const product = this.productStock.find(p => p.id === data.productId);
                        if (product) {
                            this.notify(product, 'deselect');
                        }
                    }
                    break;
            }
        };
    }

    subscribe(observer) {
        this.observers.push(observer);
    }

    unsubscribe(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notify(product, action) {
        this.observers.forEach(observer => observer.update(product, action));
    }

    selectProduct(product) {
        // Validar si ya está seleccionado por otro usuario
        if (this.selectedProduct && this.selectedProduct.id === product.id) {
            showModal("Producto en modificación", `El producto ${product.nombre} está siendo modificado por otro usuario.`);
            return false;
        }

        const isProductSelectedByOther = this.productStock.some(p =>
            p.id === product.id && p.selectedBy && p.selectedBy !== this.userId
        );
        if (isProductSelectedByOther) {
            showModal("Producto en modificación", `El producto ${product.nombre} está siendo modificado por otro usuario.`);
            return false;
        }

        // Deseleccionar el producto anterior
        if (this.selectedProduct) {
            this.notify(this.selectedProduct, 'deselect');
            this.ws.send(JSON.stringify({
                type: 'deselectProduct',
                productId: this.selectedProduct.id,
                userId: this.userId
            }));
        }

        // Seleccionar el producto actual
        this.selectedProduct = product;
        this.notify(product, 'select');

        this.ws.send(JSON.stringify({
            type: 'selectProduct',
            productId: product.id,
            userId: this.userId
        }));

        // Deshabilitar el producto por 1 minuto
        setTimeout(() => {
            this.notify(product, 'deselect');
            this.ws.send(JSON.stringify({
                type: 'deselectProduct',
                productId: product.id,
                userId: this.userId
            }));
            this.selectedProduct = null;
        }, 60000);

        return true;
    }
}
// ====== Funciones para el modal ======
function showModal(title, message) {
    const modal = document.getElementById("myModal");
    document.getElementById("modal-title").innerText = title;
    document.getElementById("modal-message").innerText = message;
    modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById("myModal");
    modal.style.display = "none";
}
const span = document.getElementsByClassName("close")[0];

span.onclick = function () {
    closeModal();
}

