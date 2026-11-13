const db = require("../db/new_database");

class Category {
    static async getAllCategoriesFromDB() {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM Categoria", (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });
    }

    static async addCategoryToDB(nome_categoria) {
        return new Promise((resolve, reject) => {
            db.run(
                "INSERT INTO Categoria (nome_categoria) VALUES (?)",
                [nome_categoria],
                function (err) {
                    if (err) reject(err);
                    resolve({ id: this.lastID, nome_categoria });
                }
            );
        });
    }

    // Rimuove una categoria e tutti i prodotti associati
    static async removeCategoryFromDB(id) {
        return new Promise((resolve, reject) => {
            // Prima rimuovi tutti i riferimenti nella tabella Ingredienti_Prodotto per i prodotti di questa categoria
            db.run(
                `DELETE FROM Ingredienti_Prodotto 
                 WHERE REF_prodotto IN (
                     SELECT ID_prodotto FROM Prodotto WHERE REF_categoria = ?
                 )`,
                [id],
                function (err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    
                    // Poi rimuovi tutti i prodotti di questa categoria
                    db.run(
                        "DELETE FROM Prodotto WHERE REF_categoria = ?",
                        [id],
                        function (err) {
                            if (err) {
                                reject(err);
                                return;
                            }
                            
                            // Infine rimuovi la categoria
                            db.run(
                                "DELETE FROM Categoria WHERE ID_categoria = ?",
                                [id],
                                function (err) {
                                    if (err) {
                                        reject(err);
                                        return;
                                    }
                                    
                                    if (this.changes === 0) {
                                        reject(new Error("Categoria non trovata"));
                                        return;
                                    }
                                    
                                    resolve({ 
                                        id: id, 
                                        message: "Categoria e prodotti associati rimossi con successo" 
                                    });
                                }
                            );
                        }
                    );
                }
            );
        });
    }
}

module.exports = Category;
