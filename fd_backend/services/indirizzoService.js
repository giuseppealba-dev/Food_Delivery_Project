const Indirizzo = require('../models/indirizzo');

class IndirizzoService {
    static async getIndirizziByUser(userID) {
        try {
            const indirizzi = await Indirizzo.getIndirizzoByUserID(userID);
            return indirizzi;
        } catch (error) {
            throw new Error(`Errore nel recupero degli indirizzi: ${error.message}`);
        }
    }

    static async addIndirizzo(indirizzoData) {
        try {
            // Validazione dei dati
            const { REF_Utente, via, numero_civico, citta, cap } = indirizzoData;
            
            if (!REF_Utente || !via || !numero_civico || !citta || !cap) {
                throw new Error('Tutti i campi obbligatori devono essere forniti');
            }

            const nuovoIndirizzo = await Indirizzo.addIndirizzo(indirizzoData);
            return nuovoIndirizzo;
        } catch (error) {
            throw new Error(`Errore nella creazione dell'indirizzo: ${error.message}`);
        }
    }

    static async deleteIndirizzo(ID_indirizzo) {
        try {
            // Verifica che l'indirizzo esista
            const indirizzoEsistente = await Indirizzo.getIndirizzoById(ID_indirizzo);
            if (!indirizzoEsistente) {
                throw new Error('Indirizzo non trovato');
            }

            const result = await Indirizzo.deleteIndirizzo(ID_indirizzo);
            return result;
        } catch (error) {
            throw new Error(`Errore nell'eliminazione dell'indirizzo: ${error.message}`);
        }
    }

    static async getIndirizzoById(ID_indirizzo) {
        try {
            const indirizzo = await Indirizzo.getIndirizzoById(ID_indirizzo);
            return indirizzo;
        } catch (error) {
            throw new Error(`Errore nel recupero dell'indirizzo: ${error.message}`);
        }
    }
}

module.exports = IndirizzoService;
