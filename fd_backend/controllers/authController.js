const AuthService = require("../services/authService");

class AuthController {
  static async register(req, res) {
    try {
      const user = await AuthService.registerUser(req.body);
      res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await AuthService.loginUser(email, password);
      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async verify(req, res) {
    console.log(req.user);
    try {
      const user = await AuthService.verifyUser(req.user.id);
      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async changePassword(req, res) {
    try {
      const { userId, oldPassword, newPassword } = req.body;
      // ! DEBUG 
      // console.log("Change Password Request:", req.body);
      
      // Validazione dei dati
      if (!userId || !oldPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Tutti i campi sono obbligatori"
        });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({
          success: false,
          message: "La nuova password deve essere di almeno 8 caratteri"
        });
      }

      const result = await AuthService.changeUserPassword(userId, oldPassword, newPassword);
      
      res.json({
        success: true,
        message: "Password aggiornata con successo"
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static logout(req, res) {
    // In un sistema reale qui invalidiamo il token
    res.json({
      success: true,
      message: "Logout effettuato",
    });
  }
}

module.exports = AuthController;
