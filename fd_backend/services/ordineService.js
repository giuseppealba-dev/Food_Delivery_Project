const Ordine = require('../models/ordine');
const { STATI_ORDINE } = require('../constants/ordineStati');

class OrdineService {
  static async createOrder(cartItems, userId, indirizzoId) {
    try {
      // Validazione degli item del carrello
      if (!Array.isArray(cartItems) || cartItems.length === 0) {
        throw new Error('Il carrello è vuoto o non valido');
      }

      cartItems.forEach((item, index) => {
        if (!item.id_prodotto || !item.nome_prodotto || !item.prezzo || !item.quantity) {
          throw new Error(`Item del carrello non valido all'indice ${index}`);
        }
        item.notes = item.notes || '';
      });

      // Calcola il prezzo totale dal carrello
      let prezzoTotale = 0;
      cartItems.forEach(item => {
        prezzoTotale += item.prezzo * item.quantity;
      });

      // Crea la stringa delle note ordine nel formato richiesto
      const noteOrdine = cartItems
        .filter(item => item.notes && item.notes.trim() !== '')
        .map(item => `${item.nome_prodotto}: ${item.notes}`)
        .join('; ');

      // Prepara i dati dell'ordine
      const orderData = {
        data: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        ora: new Date().toISOString(), // ISO datetime
        prezzo_totale: prezzoTotale,
        REF_acquirente: userId,
        stato: STATI_ORDINE.ORDINATO,
        REF_indirizzo: indirizzoId,
        note_ordine: noteOrdine.length > 0 ? noteOrdine : null
      };

      const result = await Ordine.createOrderWithProducts(orderData, cartItems);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getUserOrders(userId) {
    try {
      const orders = await Ordine.getOrdersByUser(userId);
      return orders;
    } catch (error) {
      throw error;
    }
  }

  static async getOrderProducts(orderId) {
    try {
      const products = await Ordine.getOrderProducts(orderId);
      return products;
    } catch (error) {
      throw error;
    }
  }

  static async updateOrderStatus(orderId, newStatus, fattorinoId = null) {
    try {
      const { STATI_VALIDI } = require('../constants/ordineStati');
      
      // Validazione dello stato
      if (!STATI_VALIDI.includes(newStatus)) {
        throw new Error(`Stato non valido: ${newStatus}. Stati validi: ${STATI_VALIDI.join(', ')}`);
      }

      const result = await Ordine.updateOrderStatus(orderId, newStatus, fattorinoId);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getAllOrders() {
    try {
      const orders = await Ordine.getAllOrders();
      return orders;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = OrdineService;
