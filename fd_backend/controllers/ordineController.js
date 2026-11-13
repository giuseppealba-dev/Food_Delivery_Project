const OrdineService = require("../services/ordineService");

class OrdineController {
  static async createOrder(req, res) {
    try {
      const { cartItems, userId, indirizzoId } = req.body;

      // Validazione dati
      if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Il carrello è vuoto o non valido"
        });
      }

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "ID utente mancante"
        });
      }

      if (!indirizzoId) {
        return res.status(400).json({
          success: false,
          message: "ID indirizzo mancante"
        });
      }

      const newOrder = await OrdineService.createOrder(cartItems, userId, indirizzoId);

      res.json({
        success: true,
        message: "Ordine creato con successo",
        data: newOrder
      });

    } catch (error) {
      console.error("Errore nella creazione dell'ordine:", error);
      res.status(500).json({
        success: false,
        message: "Errore interno del server",
        error: error.message
      });
    }
  }

  static async getUserOrders(req, res) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "ID utente mancante"
        });
      }

      const orders = await OrdineService.getUserOrders(userId);

      res.json({
        success: true,
        data: orders
      });

    } catch (error) {
      console.error("Errore nel recupero degli ordini:", error);
      res.status(500).json({
        success: false,
        message: "Errore interno del server",
        error: error.message
      });
    }
  }

  static async getOrderProducts(req, res) {
    try {
      const { orderId } = req.params;

      if (!orderId) {
        return res.status(400).json({
          success: false,
          message: "ID ordine mancante"
        });
      }

      const products = await OrdineService.getOrderProducts(orderId);

      res.json({
        success: true,
        data: products
      });

    } catch (error) {
      console.error("Errore nel recupero dei prodotti dell'ordine:", error);
      res.status(500).json({
        success: false,
        message: "Errore interno del server",
        error: error.message
      });
    }
  }

  static async updateOrderStatus(req, res) {
    try {
      const { orderId } = req.params;
      const { status, fattorinoId } = req.body;

      if (!orderId) {
        return res.status(400).json({
          success: false,
          message: "ID ordine mancante"
        });
      }

      if (!status) {
        return res.status(400).json({
          success: false,
          message: "Nuovo stato mancante"
        });
      }

      const result = await OrdineService.updateOrderStatus(orderId, status, fattorinoId);

      res.json({
        success: true,
        message: result.message,
        data: result
      });

    } catch (error) {
      console.error("Errore nell'aggiornamento dello stato dell'ordine:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Errore interno del server"
      });
    }
  }

  static async getAllOrders(req, res) {
    try {
      const orders = await OrdineService.getAllOrders();

      res.json({
        success: true,
        data: orders
      });
    } catch (error) {
      console.error("Errore nel recupero di tutti gli ordini:", error);
      res.status(500).json({
        success: false,
        message: "Errore interno del server",
        error: error.message
      });
    }
  }
}

module.exports = OrdineController;
