const { body, validationResult } = require("express-validator");

// controllo che i campi siano valorizzati per la registrazione
const registerValidator = [
  body("nome").notEmpty().withMessage("Nome è obbligatorio"),
  body("cognome").notEmpty().withMessage("Nome è obbligatorio"),
  body("numero_telefono").notEmpty().withMessage("Numero di telefono è obbligatorio"),
  body("numero_telefono")
    .isMobilePhone("it-IT")
    .withMessage("Numero di telefono (italiano) non valido"),
  body("email").isEmail().withMessage("Email non valida"),
  body("password")
    .isLength({ min: 8, max: 24 })
    .withMessage("Password deve essere di almeno 8 caratteri e massimo 24 caratteri")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,24}$/)
    .withMessage(
      "Password deve contenere almeno una lettera maiuscola, una minuscola, un numero e un carattere speciale (@$!%*?&)"
    ),
  body("conferma_password")
    .notEmpty()
    .withMessage("Conferma password è obbligatoria")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Le password non corrispondono");
      }
      return true;
    }),
];

// controllo che i campi siano valorizzati per il login
const loginValidator = [
  body("email").notEmpty().withMessage("Email è obbligatoria"),
  body("password").notEmpty().withMessage("Password è obbligatoria"),
];

// Raccoglie tutti gli errori di validazione usando validationResult(req)
// questo aggiunge uno strato intermedio che controlla se ci sono errori da altri validatori
// e se ci sono errori, restituisce un errore 400 con gli errori di validazione
// questo middleware viene eseguito dopo i validatori definiti sopra e può essere associato a quasiasi nuovo validatore
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  registerValidator,
  loginValidator,
  validate,
};
