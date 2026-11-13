const IndirizzoService = require("../services/indirizzoService");

class IndirizzoController {
    static async getIndirizziByUser(req, res) {
        try {
            const { userID } = req.params;
            // console.log('Getting indirizzi for user:', userID);
            if (!userID) {
                return res.status(400).json({
                    success: false,
                    message: 'ID utente richiesto'
                });
            }

            const indirizzi = await IndirizzoService.getIndirizziByUser(userID);
            res.status(200).json({
                success: true,
                data: indirizzi
            });
        } catch (error) {
            console.error('Errore in getIndirizziByUser:', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async addIndirizzo(req, res) {
        try {
            // console.log('Adding indirizzo with data:', req.body);
            const nuovoIndirizzo = await IndirizzoService.addIndirizzo(req.body);
            res.status(201).json({
                success: true,
                data: nuovoIndirizzo,
                message: 'Indirizzo creato con successo'
            });
        } catch (error) {
            console.error('Errore in addIndirizzo:', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async deleteIndirizzo(req, res) {
        try {
            const { id } = req.params;
            // console.log('Deleting indirizzo:', id);
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'ID indirizzo richiesto'
                });
            }

            await IndirizzoService.deleteIndirizzo(id);
            res.status(200).json({
                success: true,
                message: 'Indirizzo eliminato con successo'
            });
        } catch (error) {
            console.error('Errore in deleteIndirizzo:', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getIndirizzoById(req, res) {
        try {
            const { id } = req.params;
            // console.log('Getting indirizzo by id:', id);
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'ID indirizzo richiesto'
                });
            }

            const indirizzo = await IndirizzoService.getIndirizzoById(id);
            if (!indirizzo) {
                return res.status(404).json({
                    success: false,
                    message: 'Indirizzo non trovato'
                });
            }

            res.status(200).json({
                success: true,
                data: indirizzo
            });
        } catch (error) {
            console.error('Errore in getIndirizzoById:', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = IndirizzoController;
