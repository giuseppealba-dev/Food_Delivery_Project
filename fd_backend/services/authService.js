//import modello
const User = require('../models/user');

class AuthService {
  static async registerUser(userData) {
    try {
      // Controlla se l'username è già in uso  
      const existingUser = await User.findByEmail(userData.email);
      if (existingUser) {
        throw new Error('Email già in uso');
      }

      const existingPhone = await User.findByPhoneNumber(userData.numero_telefono);
      if (existingPhone) {
        throw new Error('Numero di telefono già in uso');
      }

      return await User.create(userData);
    } catch (error) {
      throw error;
    }
  }

  static async loginUser(email, password) {
    try {
      // Trova l'utente in base all'username
      const user = await User.findByEmail(email);
      if (!user) {
        throw new Error('Credenziali non valide');
      }
      // check se la password è corretta
      const isMatch = await User.comparePassword(password, user.password);
      if (!isMatch) {
        throw new Error('Credenziali non valide');
      }

      // Escludi la password dalla risposta
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  }

  // non serve a molto poichè noi non abbiamo un modo per verificare se l'utente è loggato o meno
  static async verifyUser(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Utente non trovato');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  static async changeUserPassword(userId, oldPassword, newPassword) {
    try {
      // Trova l'utente
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Utente non trovato');
      }

      // Verifica che la vecchia password sia corretta
      const isOldPasswordValid = await User.comparePassword(oldPassword, user.password);
      if (!isOldPasswordValid) {
        throw new Error('Password attuale non corretta');
      }

      // Aggiorna la password
      const result = await User.updatePassword(userId, newPassword);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AuthService;