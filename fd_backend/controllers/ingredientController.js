const IngredientService = require("../services/ingredientService");

class IngredientController {
    static async list(req, res) {
        try {
            const ingredients = await IngredientService.listIngredients();
            // Risposta di OK con il codice 200
            res.status(200).json({
                success: true,
                data: ingredients,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    static async add(req, res) {
        try {
            const { nome_ingrediente } = req.body;
            
            if (!nome_ingrediente) {
                return res.status(400).json({
                    success: false,
                    message: "Nome ingrediente è richiesto",
                });
            }

            const result = await IngredientService.addIngredient(nome_ingrediente);
            
            res.status(201).json({
                success: true,
                message: "Ingrediente aggiunto con successo",
                ingrediente_aggiunto: result,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    static async remove(req, res) {
        try {
            const { id } = req.body;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "ID ingrediente è richiesto",
                });
            }

            const result = await IngredientService.removeIngredient(id);
            
            if (result.changes === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Ingrediente non trovato",
                });
            }
            
            res.status(200).json({
                success: true,
                message: "Ingrediente rimosso con successo",
                ingrediente_rimosso: result,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    static async linkIngredientsToProduct(req, res) {
        const productId = req.body.ID_prodotto;
        const ingredientIds = req.body.REFs_ingredienti;

        if(Array.isArray(ingredientIds)) {
            console.log("Ingredient IDs are an array:", ingredientIds);
        } else {
            console.log("Ingredient IDs are not an array:", ingredientIds);
        }

        if (!productId || !ingredientIds || !Array.isArray(ingredientIds)) {
            return res.status(400).json({
                success: false,
                message: "Invalid input data",
            });
        }

        try {
            await IngredientService.linkIngredientsToProduct(productId, ingredientIds);

            res.status(200).json({
                success: true,
                message: "Ingredienti linkati al prodotto con successo",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    static async getIngredientsForProduct(req, res) {
        try {
            const ingredients = await IngredientService.getIngredientsForProduct(req.body.ID_prodotto);
            // Risposta di OK con il codice 200
            res.status(200).json({
                success: true,
                data: ingredients,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
}

module.exports = IngredientController;
