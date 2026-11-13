const Product = require('../models/product');

class DataService {
  static async listProducts() {
    try {
      // Fetch dei dati dal database tramite classe Product
      const products_list = await Product.getAllProductsFromDB();

      return products_list;
    } catch (error) {
      throw error;
    }
  }

  static async addProduct(productData) {
    try {
      const nome_prodotto = productData.nome_prodotto;
      const prezzo_prodotto = productData.prezzo;
      const url_immagine = productData.url_immagine;
      const REF_categoria = productData.REF_categoria;
      const percentuale_sconto = productData.percentuale_sconto || 0; // Imposta a 0 se non specificato
      
      const response = await Product.addProductToDB(nome_prodotto, prezzo_prodotto, url_immagine, REF_categoria, percentuale_sconto);
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async updateProduct(id, productData) {
    try {
      const nome_prodotto = productData.nome_prodotto;
      const prezzo_prodotto = productData.prezzo;
      const url_immagine = productData.url_immagine;
      const REF_categoria = productData.REF_categoria;
      const percentuale_sconto = productData.percentuale_sconto || 0;
      
      const response = await Product.updateProductInDB(id, nome_prodotto, prezzo_prodotto, url_immagine, REF_categoria, percentuale_sconto);
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async getProductByID(id) {
    try {
      const product = await Product.getProductByID(id);
      return product;
    } catch (error) {
      throw error;
    }
  }

  static async removeProduct(productId) {
    try {
      const result = await Product.removeProduct(productId);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = DataService;
