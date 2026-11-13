const db = require("../db/new_database");

class Ingredient {
    static async getAllIngredientsFromDB() {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM Ingrediente", (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });
    }

    static async addIngredient(nome_ingrediente) {
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO Ingrediente (nome_ingrediente) VALUES (?)";
            db.run(sql, [nome_ingrediente], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        id: this.lastID,
                        nome_ingrediente: nome_ingrediente
                    });
                }
            });
        });
    }

    static async removeIngredient(ingredientId) {
        return new Promise((resolve, reject) => {
            // Prima rimuovi tutte le associazioni dalla tabella Ingredienti_Prodotto
            const sqlRemoveLinks = "DELETE FROM Ingredienti_Prodotto WHERE REF_ingrediente = ?";
            db.run(sqlRemoveLinks, [ingredientId], function(err) {
                if (err) {
                    reject(err);
                } else {
                    // Poi rimuovi l'ingrediente dalla tabella Ingrediente
                    const sqlRemoveIngredient = "DELETE FROM Ingrediente WHERE ID_ingrediente = ?";
                    db.run(sqlRemoveIngredient, [ingredientId], function(err) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve({
                                id: ingredientId,
                                changes: this.changes
                            });
                        }
                    });
                }
            });
        });
    }

    static async linkIngredientsToProduct(productId, ingredientId) {
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO Ingredienti_Prodotto (REF_prodotto, REF_ingrediente) VALUES (?, ?)";
            db.run(sql, [productId, ingredientId], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    }

    static async unlinkAllIngredientsFromProduct(productId) {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM Ingredienti_Prodotto WHERE REF_prodotto = ?";
            db.run(sql, [productId], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        productId: productId,
                        changes: this.changes
                    });
                }
            });
        });
    }

    // TODO: fare la query
    static async getIngredientsForProduct(productId) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT i.ID_ingrediente, i.nome_ingrediente FROM Ingrediente i JOIN Ingredienti_Prodotto ip ON i.ID_ingrediente = ip.REF_ingrediente WHERE ip.REF_prodotto = ?"
            db.all(sql, productId, (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        })
    }
}

module.exports = Ingredient;
