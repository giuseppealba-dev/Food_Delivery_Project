const express = require("express");
const routerIngredient = express.Router();
const IngredientController = require("../controllers/ingredientController");

routerIngredient.get("/", (req, res) => {
  res.render("indexProduct");
});

routerIngredient.get("/list", IngredientController.list);

routerIngredient.post("/add", IngredientController.add);

routerIngredient.delete("/remove", IngredientController.remove);

routerIngredient.post("/linkIngredientsToProduct", IngredientController.linkIngredientsToProduct);

routerIngredient.post("/getIngredientsForProduct", IngredientController.getIngredientsForProduct);


module.exports = routerIngredient;
