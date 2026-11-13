const express = require("express");
const routerOrdine = express.Router();
const OrdineController = require("../controllers/ordineController");

routerOrdine.get("/", (req, res) => {
  res.render("indexProduct");
});

// Route per creare un nuovo ordine
routerOrdine.post("/create", OrdineController.createOrder);

// Route per ottenere gli ordini di un utente
routerOrdine.get("/user/:userId", OrdineController.getUserOrders);

// Route per ottenere i prodotti di un ordine specifico
routerOrdine.get("/:orderId/products", OrdineController.getOrderProducts);

// Route per aggiornare lo stato di un ordine
routerOrdine.put("/:orderId/status", OrdineController.updateOrderStatus);

// Route per ottenere tutti gli ordini con i dettagli dell'acquirente
routerOrdine.get("/all", OrdineController.getAllOrders);

module.exports = routerOrdine;
