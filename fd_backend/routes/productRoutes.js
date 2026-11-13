const express = require("express");
const routerProduct = express.Router();
const ProductController = require("../controllers/productController");

routerProduct.get("/", (req, res) => {
  res.render("indexProduct");
});

// routerProduct.get("/list", (req, res) => {
//   // TODO: Scrivere la funzione sul controller per i dati che permette di accedere al database e richiedere tutti i prodotti
//   res.send("prova: ti trovi in product list");
// });

routerProduct.get("/listProducts", ProductController.list);

// TODO: aggiungere un validator che controllo se i dati che inseriamo siano corretti o meno
// TODO: Scrivere la funzione sul controller per i dati in modo da poter aggiungere al database il prodotto
routerProduct.post("/add", ProductController.add);

routerProduct.get("/getID", ProductController.getProductByID)

routerProduct.put("/update/:id", ProductController.updateProduct);

routerProduct.delete("/remove", ProductController.removeProduct);

routerProduct.delete("/delete", (res, req) => {
  // TODO: scrivere la funzione sul controller per i dati in modo da poter eliminare i prodotti
});

module.exports = routerProduct;
