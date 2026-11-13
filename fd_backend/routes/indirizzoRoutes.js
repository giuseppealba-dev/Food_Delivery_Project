const express = require("express");
const routerIndirizzo = express.Router();
const IndirizzoController = require("../controllers/indirizzoController");


// Ottieni tutti gli indirizzi di un utente
routerIndirizzo.get("/user/:userID", IndirizzoController.getIndirizziByUser);

// Ottieni un indirizzo specifico da un ID
routerIndirizzo.get("/:id", IndirizzoController.getIndirizzoById);

// Crea un nuovo indirizzo
routerIndirizzo.post("/addIndirizzo", IndirizzoController.addIndirizzo);

// Elimina un indirizzo
routerIndirizzo.delete("/:id", IndirizzoController.deleteIndirizzo);

module.exports = routerIndirizzo;
