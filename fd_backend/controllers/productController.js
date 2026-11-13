const ProductService = require("../services/productService");

class ProductController {
  static async list(req, res) {
    try {
      const products = await ProductService.listProducts();
      // Risposta di OK con il codice 200
      res.status(200).json({
        success: true,
        data: products,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async add(req, res) {
    try {
      // La request POST sarà del tipo: "nome_prodotto", "prezzo_prodotto", "img_url", ("lista ingredienti")
      // TODO: valutare se mettere delle flag del tipo: piccante, vegano, allergeni.
      const add_response = await ProductService.addProduct(req.body);
      // risposta di OK CREAZIONI con il codice 201
      res.status(201).json({
        success: true,
        prodotto_aggiunto: add_response,
      })
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      })
    }
  }

  static async getProductByID(req, res) {
    try {
      const product = await ProductService.getProductByID(req.body.id)
      res.status(200).json({
        success: true,
        data: product,
      })
      
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      })
    }
  }

  static async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const updateResponse = await ProductService.updateProduct(id, req.body);
      
      if (updateResponse.changes === 0) {
        return res.status(404).json({
          success: false,
          message: "Prodotto non trovato",
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Prodotto aggiornato con successo",
        prodotto_aggiornato: updateResponse,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async removeProduct(req, res) {
    try {
      const { id } = req.body;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: "ID prodotto è richiesto",
        });
      }

      const result = await ProductService.removeProduct(id);
      
      if (result.changes === 0) {
        return res.status(404).json({
          success: false,
          message: "Prodotto non trovato",
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Prodotto rimosso con successo",
        prodotto_rimosso: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

}

module.exports = ProductController;
