const express = require("express");
const routerCategory = express.Router();
const CategoryController = require("../controllers/categoryController");

routerCategory.get("/", (req, res) => {
  res.send("Welcome to the Category API");
});

// Ottiene la lista di tutte le categorie
routerCategory.get("/list", CategoryController.list);

// Aggiunge una nuova categoria
routerCategory.post("/add", CategoryController.add);

// Rimuove una categoria (con rimozione a cascata dei prodotti associati)
routerCategory.post("/remove", CategoryController.remove);

module.exports = routerCategory;
