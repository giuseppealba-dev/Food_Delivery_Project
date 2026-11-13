const CategoryService = require("../services/categoryService");

class CategoryController {
    static async list(req, res) {
        try {
            const result = await CategoryService.getAllCategories();
            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(400).json(result);
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Errore interno del server",
            });
        }
    }

    static async add(req, res) {
        try {
            const result = await CategoryService.addCategory(req.body);
            if (result.success) {
                res.status(201).json(result);
            } else {
                res.status(400).json(result);
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Errore interno del server",
            });
        }
    }

    static async remove(req, res) {
        try {
            const { id } = req.body;
            const result = await CategoryService.removeCategory(id);
            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(400).json(result);
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Errore interno del server",
            });
        }
    }
}

module.exports = CategoryController;
