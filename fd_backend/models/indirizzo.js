const db = require("../db/new_database");

class Indirizzo {
  static async getIndirizzoByUserID(userID) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM Indirizzo WHERE REF_Utente = ?`;
      db.all(query, [userID], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static async addIndirizzo(indirizzoData) {
    return new Promise((resolve, reject) => {
      const { REF_Utente, via, numero_civico, citta, cap, note_consegna } = indirizzoData;
      const query = `
                INSERT INTO Indirizzo (REF_Utente, via, numero_civico, citta, cap, note_consegna)
                VALUES (?, ?, ?, ?, ?, ?)
            `;

      db.run(query, [REF_Utente, via, numero_civico, citta, cap, note_consegna], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            ID_indirizzo: this.lastID,
            ...indirizzoData
          });
        }
      });
    });
  }

  static async deleteIndirizzo(ID_indirizzo) {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM Indirizzo WHERE ID_indirizzo = ?`;

      db.run(query, [ID_indirizzo], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ deletedRows: this.changes });
        }
      });
    });
  }

  static async getIndirizzoById(ID_indirizzo) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM Indirizzo WHERE ID_indirizzo = ?`;
      db.get(query, [ID_indirizzo], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }
}

module.exports = Indirizzo;
