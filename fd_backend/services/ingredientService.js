const Ingredient = require('../models/ingredient');

class IngredientService {
    static async listIngredients() {
        try {
            // Fetch dei dati dal database tramite classe Product
            const ingredient_list = await Ingredient.getAllIngredientsFromDB();
            return ingredient_list;
        } catch (error) {
            throw error;
        }
    }

    static async addIngredient(nome_ingrediente) {
        try {
            const result = await Ingredient.addIngredient(nome_ingrediente);
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async removeIngredient(ingredientId) {
        try {
            const result = await Ingredient.removeIngredient(ingredientId);
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async linkIngredientsToProduct(productId, ingredientIds) {
        try {
            // Prima rimuovi tutti gli ingredienti esistenti per questo prodotto
            await Ingredient.unlinkAllIngredientsFromProduct(productId);
            
            // Poi aggiungi i nuovi ingredienti
            for (const ingredient_id of ingredientIds) {
                await Ingredient.linkIngredientsToProduct(productId, ingredient_id);
            }
        } catch (error) {
            throw error;
        }
    }

    static async getIngredientsForProduct(productId) {
        try {
            const ingredient_list = await Ingredient.getIngredientsForProduct(productId);
            return ingredient_list
        } catch (err) {
            throw error;
        }
    }
}

module.exports = IngredientService;
