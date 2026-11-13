const Category = require('../models/category');

class CategoryService {
    static async getAllCategories() {
        try {
            const category_list = await Category.getAllCategoriesFromDB();
            return {
                success: true,
                data: category_list
            };
        } catch (error) {
            console.error("Errore nel recupero delle categorie:", error);
            return {
                success: false,
                message: "Errore nel recupero delle categorie"
            };
        }
    }

    static async addCategory(categoryData) {
        try {
            const nome_categoria = categoryData.nome_categoria;
            
            // Validazione input
            if (!nome_categoria || nome_categoria.trim().length === 0) {
                return {
                    success: false,
                    message: "Il nome della categoria è obbligatorio"
                };
            }

            if (nome_categoria.trim().length < 2) {
                return {
                    success: false,
                    message: "Il nome della categoria deve essere di almeno 2 caratteri"
                };
            }

            if (nome_categoria.trim().length > 50) {
                return {
                    success: false,
                    message: "Il nome della categoria non può superare i 50 caratteri"
                };
            }

            const response = await Category.addCategoryToDB(nome_categoria.trim());
            return {
                success: true,
                message: "Categoria aggiunta con successo",
                categoria_aggiunta: response
            };
        } catch (error) {
            console.error("Errore nell'aggiunta della categoria:", error);
            return {
                success: false,
                message: "Errore nell'aggiunta della categoria"
            };
        }
    }

    static async removeCategory(id) {
        try {
            // Validazione input
            if (!id || isNaN(id)) {
                return {
                    success: false,
                    message: "ID categoria non valido"
                };
            }

            const categoria_rimossa = await Category.removeCategoryFromDB(parseInt(id));
            return {
                success: true,
                message: categoria_rimossa.message,
                categoria_rimossa
            };
        } catch (error) {
            console.error("Errore nella rimozione della categoria:", error);
            if (error.message === "Categoria non trovata") {
                return {
                    success: false,
                    message: "Categoria non trovata"
                };
            }
            return {
                success: false,
                message: "Errore nella rimozione della categoria"
            };
        }
    }
}

module.exports = CategoryService;
