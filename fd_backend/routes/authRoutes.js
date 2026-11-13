const express = require("express");
const routerLogin = express.Router();
const AuthController = require("../controllers/authController");
const {
  registerValidator,
  loginValidator,
  validate,
} = require("../validators/authValidator");

// Prova pagina principale

routerLogin.get("/", (req, res) => {
  // res.send("Ciao dal server Express!");
  res.render("indexAuth");
});

// Registrazione
routerLogin.post("/register", registerValidator, validate, AuthController.register);

// Login
routerLogin.post("/login", loginValidator, validate, AuthController.login);

// Cambio password
routerLogin.post("/change-password", AuthController.changePassword);

// Verifica autenticazione
// non serve a molto poichè noi non abbiamo un modo per verificare se l'utente è loggato o meno
routerLogin.post("/verify", AuthController.verify);

// Logout
routerLogin.post("/logout", AuthController.logout);

module.exports = routerLogin;
