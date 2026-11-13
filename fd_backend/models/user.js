//importo il db
const db = require('../db/new_database');

//importo il modulo bcryptjs per la gestione delle password
const bcrypt = require('bcryptjs');


//Interagisce direttamente con il database per le operazioni CRUD sugli utenti
class User {

  // definisco il metodo per creare un nuovo utente
  static async create({ nome, cognome, numero_telefono, email, password, conferma_password }) {

    // controllo se la password e la conferma password sono uguali
    if (password !== conferma_password) {
      throw new Error('Le password non corrispondono');
    }

    // genSalt genera un seed casuale per l'hashing della password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Per il REF_ruolo, assumiamo che sia un ruolo predefinito, ad esempio 'utente' con id 1
    const REF_ruolo = 1; // Modifica questo valore in base alla tua logica di gestione dei ruoli

    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO Utente (nome, cognome, numero_telefono, email, password, REF_ruolo) VALUES (?, ?, ?, ?, ?, ?)',
        [nome, cognome, numero_telefono, email, hashedPassword, REF_ruolo],
        function (err) {
          if (err) reject(err);
          resolve({ id: this.lastID, nome, cognome, numero_telefono, email, REF_ruolo });
        }
      );
    });
  }

  // definisco il metodo per trovare un utente in base all'email
  static async findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM Utente WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  }

  // definisco il metodo per trovare un utente in base al numero di telefono
  static async findByPhoneNumber(numero_telefono) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM Utente WHERE numero_telefono = ?', [numero_telefono], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  }

  // ricerca per id (completa con password per verifiche)
  static async findById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM Utente WHERE id_utente = ?', [id], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  }

  // confronta la password inserita con quella salvata nel db
  static async comparePassword(candidatePassword, hash) {
    return bcrypt.compare(candidatePassword, hash);
  }

  // aggiorna la password dell'utente
  static async updatePassword(userId, newPassword) {
    // Hash della nuova password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE Utente SET password = ? WHERE id_utente = ?',
        [hashedPassword, userId],
        function (err) {
          if (err) reject(err);
          if (this.changes === 0) {
            reject(new Error('Utente non trovato'));
          } else {
            resolve({ success: true, message: 'Password aggiornata con successo' });
          }
        }
      );
    });
  }
}

module.exports = User;