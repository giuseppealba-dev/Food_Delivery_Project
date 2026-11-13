const db = require("../db/new_database");

class Product {
  static async getAllProductsFromDB() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM Prodotto ORDER BY REF_categoria", (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  }

  static async addProductToDB(nome_prodotto, prezzo, url_immagine, REF_categoria, percentuale_sconto) {

    const is_offerta = percentuale_sconto > 0 ? 1 : 0;
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO Prodotto (nome_prodotto, prezzo, url_immagine, REF_categoria, is_offerta, percentuale_offerta) VALUES (?, ?, ?, ?, ?, ?)",
        [nome_prodotto, prezzo, url_immagine, REF_categoria, is_offerta, percentuale_sconto],
        function (err) {
          if (err) reject(err);
          resolve({id: this.lastID, nome_prodotto: nome_prodotto, prezzo: prezzo, url_immagine: url_immagine, REF_categoria: REF_categoria, is_offerta: is_offerta, percentuale_sconto: percentuale_sconto });
        }
      );
    });
  }

  static async updateProductInDB(id, nome_prodotto, prezzo, url_immagine, REF_categoria, percentuale_sconto) {
    const is_offerta = percentuale_sconto > 0 ? 1 : 0;
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE Prodotto SET nome_prodotto = ?, prezzo = ?, url_immagine = ?, REF_categoria = ?, is_offerta = ?, percentuale_offerta = ? WHERE ID_prodotto = ?",
        [nome_prodotto, prezzo, url_immagine, REF_categoria, is_offerta, percentuale_sconto, id],
        function (err) {
          if (err) reject(err);
          resolve({
            id: id,
            nome_prodotto: nome_prodotto,
            prezzo: prezzo,
            url_immagine: url_immagine,
            REF_categoria: REF_categoria,
            is_offerta: is_offerta,
            percentuale_sconto: percentuale_sconto,
            changes: this.changes
          });
        }
      );
    });
  }

  static async getProductByID(id) {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM Prodotto WHERE ID_prodotto = ?",
        [id],
        (err, row) => {
          if (err) reject(err);
          resolve(row);
        }
      );
    });
  }

  static async removeProduct(productId) {
    return new Promise((resolve, reject) => {
      // Prima rimuovi tutte le associazioni dalla tabella Ingredienti_Prodotto
      const sqlRemoveLinks = "DELETE FROM Ingredienti_Prodotto WHERE REF_prodotto = ?";
      db.run(sqlRemoveLinks, [productId], function(err) {
        if (err) {
          reject(err);
        } else {
          // Poi rimuovi il prodotto dalla tabella Prodotto
          const sqlRemoveProduct = "DELETE FROM Prodotto WHERE ID_prodotto = ?";
          db.run(sqlRemoveProduct, [productId], function(err) {
            if (err) {
              reject(err);
            } else {
              resolve({
                id: productId,
                changes: this.changes
              });
            }
          });
        }
      });
    });
  }
}

module.exports = Product;
