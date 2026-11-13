const db = require("../db/new_database");

class Ordine {
  static async createOrderWithProducts(orderData, cartItems) {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        // Da ChatGPT:
        // Inizializza una transazione per garantire l'integrità dei dati
        // Serve per assicurarsi che tutte le operazioni di inserimento siano atomiche
        // Se una delle operazioni fallisce, tutte le modifiche vengono annullate
        db.run("BEGIN TRANSACTION");

        // Prima crea l'ordine
        const createOrderQuery = `
                    INSERT INTO Ordine (data, ora, prezzo_totale, REF_acquirente, stato, REF_indirizzo, note_ordine)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `;

        db.run(createOrderQuery, [
          orderData.data,
          orderData.ora,
          orderData.prezzo_totale,
          orderData.REF_acquirente,
          orderData.stato,
          orderData.REF_indirizzo,
          orderData.note_ordine
        ], function (err) {
          if (err) {
            db.run("ROLLBACK");
            reject(err);
            return;
          }

          const orderId = this.lastID;

          // Poi inserisci i prodotti dell'ordine
          const insertProductQuery = `
                        INSERT INTO Prodotti_Ordine (REF_ordine, REF_prodotto, note, quantita, prezzo_unitario)
                        VALUES (?, ?, ?, ?, ?)
                    `;

          let inserimentiInAttesa = cartItems.length;
          let hasError = false;

          if (inserimentiInAttesa === 0) {
            db.run("COMMIT");
            resolve({
              id: orderId,
              ...orderData
            });
            return;
          }

          cartItems.forEach(item => {
            db.run(insertProductQuery, [
              orderId,
              item.id_prodotto,
              item.notes || '', // Assicura che le note siano sempre una stringa
              item.quantity,
              item.prezzo
            ], function (err) {
              if (err && !hasError) {
                hasError = true;
                db.run("ROLLBACK");
                reject(err);
                return;
              }

              inserimentiInAttesa--;
              if (inserimentiInAttesa === 0 && !hasError) {
                db.run("COMMIT");
                resolve({
                  id: orderId,
                  ...orderData
                });
              }
            });
          });
        });
      });
    });
  }

  static async getOrdersByUser(userId) {
    return new Promise((resolve, reject) => {
      const query = `
                SELECT o.*, i.via, i.numero_civico, i.citta, i.cap
                FROM Ordine o
                JOIN Indirizzo i ON o.REF_indirizzo = i.ID_indirizzo
                WHERE o.REF_acquirente = ?
                ORDER BY o.data DESC, o.ora DESC
            `;

      db.all(query, [userId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static async getOrderProducts(orderId) {
    return new Promise((resolve, reject) => {
      const query = `
                SELECT po.REF_ordine, po.REF_prodotto, po.note, po.quantita, po.prezzo_unitario, 
                       p.nome_prodotto, p.url_immagine
                FROM Prodotti_Ordine po
                JOIN Prodotto p ON po.REF_prodotto = p.ID_prodotto
                WHERE po.REF_ordine = ?
                ORDER BY p.nome_prodotto, po.note
            `;

      db.all(query, [orderId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static async updateOrderStatus(orderId, newStatus, fattorinoId = null) {
    return new Promise((resolve, reject) => {
      let query, params;
      
      if (fattorinoId && newStatus === 'in consegna') {
        // Aggiorna stato e assegna il fattorino quando prende in carico l'ordine
        query = `
          UPDATE Ordine 
          SET stato = ?, REF_fattorino = ?
          WHERE ID_ordine = ?
        `;
        params = [newStatus, fattorinoId, orderId];
      } else {
        // Aggiorna solo lo stato
        query = `
          UPDATE Ordine 
          SET stato = ? 
          WHERE ID_ordine = ?
        `;
        params = [newStatus, orderId];
      }

      db.run(query, params, function (err) {
        if (err) {
          reject(err);
        } else {
          if (this.changes === 0) {
            reject(new Error('Ordine non trovato'));
          } else {
            resolve({
              success: true,
              message: 'Stato ordine aggiornato con successo',
              orderId: orderId,
              newStatus: newStatus,
              fattorinoId: fattorinoId
            });
          }
        }
      });
    });
  }

  static async getAllOrders() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT o.*, 
               u.nome, u.cognome, u.numero_telefono, u.email,
               i.via, i.numero_civico, i.citta, i.cap,
               f.nome as nome_fattorino, f.cognome as cognome_fattorino, f.numero_telefono as telefono_fattorino
        FROM Ordine o
        JOIN Utente u ON o.REF_acquirente = u.ID_utente
        LEFT JOIN Indirizzo i ON o.REF_indirizzo = i.ID_indirizzo
        LEFT JOIN Utente f ON o.REF_fattorino = f.ID_utente
        ORDER BY o.data DESC, o.ora DESC
      `;

      db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

module.exports = Ordine;
