const fs = require('fs').promises;

class ProductManager {
  constructor(path) {
    this.path = path; // Asigna el path (ruta del archivo) al atributo this.path
    this.products = []; // Inicializa el atributo this.products como un array vacío
    this.loadProducts(); // Llama a la función loadProducts para cargar los productos desde el archivo
  }

  async loadProducts() {
    try {
      const data = await fs.readFile(this.path, 'utf8'); 
      this.products = JSON.parse(data); 
    } catch (error) {
      this.products = []; 
    }
  }

  async saveProducts() {
    const data = JSON.stringify(this.products, null, 2); 
    await fs.writeFile(this.path, data, 'utf8'); 
  }

  generateUniqueId() {
    return Math.random().toString(36).substr(2, 9); 
  }

  getProducts() {
    return this.products || []; 
  }

  async addProduct(productData) {
    await this.loadProducts(); 
    const id = this.generateUniqueId(); 
    const newProduct = { id, ...productData }; 
    this.products.push(newProduct); 
    await this.saveProducts(); 
    return newProduct; 
  }

  getProductById(productId) {
    const product = (this.products || []).find(p => p.id === productId); 
    if (!product) {
      throw new Error("Product not found"); 
    }
    return product; 
  }

  async updateProduct(productId, updatedFields) {
    await this.loadProducts(); 
    const productIndex = (this.products || []).findIndex(p => p.id === productId); 
    if (productIndex === -1) {
      throw new Error("Product not found"); 
    }
    this.products[productIndex] = { ...this.products[productIndex], ...updatedFields };
    await this.saveProducts(); 
    return this.products[productIndex]; 
  }

  async deleteProduct(productId) {
    await this.loadProducts(); 
    const productIndex = (this.products || []).findIndex(p => p.id === productId); 
    if (productIndex === -1) {
      throw new Error("Product not found"); // Lanza un error si el producto no se encuentra
    }
    const deletedProduct = this.products.splice(productIndex, 1); 
    await this.saveProducts(); 
    return deletedProduct[0]; 
  }
}


const manager = new ProductManager('products.json');

(async () => {
  console.log(await manager.getProducts()); 

  const newProduct = {
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25,
  };

  const addedProduct = await manager.addProduct(newProduct); 

  console.log(await manager.getProducts()); 

  const retrievedProduct = manager.getProductById(addedProduct.id); 

  console.log(retrievedProduct); 

  const updatedProduct = await manager.updateProduct(addedProduct.id, { price: 250 }); 

  console.log(updatedProduct); 

  // const deletedProduct = await manager.deleteProduct(addedProduct.id); 

  // console.log(deletedProduct); 
})();

exports.PManager = ProductManager;