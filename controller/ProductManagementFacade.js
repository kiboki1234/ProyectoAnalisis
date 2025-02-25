// ProductManagementFacade.js
import ProductRepository from './ProductRepository.js';

export default class ProductManagementFacade {
    constructor() {
        // Inyectamos la dependencia del repositorio (OCP y DIP)
        this.productRepository = new ProductRepository();
        this.productos = [];
    }

    async loadProducts() {
        this.productos = await this.productRepository.fetchProducts();
        return this.productos;
    }

    async saveProducts() {
        return await this.productRepository.saveProducts(this.productos);
    }

    getProducts() {
        return this.productos;
    }

    findProductById(id) {
        return this.productos.find(p => p.id === id);
    }

    async addProduct(productData) {
        this.productos.push(productData);
        return await this.saveProducts();
    }

    async updateProduct(productData) {
        const index = this.productos.findIndex(p => p.id === productData.id);
        if (index !== -1) {
            this.productos[index] = productData;
            return await this.saveProducts();
        }
        return false;
    }

    async deleteProduct(id) {
        const index = this.productos.findIndex(p => p.id === id);
        if (index !== -1) {
            this.productos.splice(index, 1);
            return await this.saveProducts();
        }
        return false;
    }
}
