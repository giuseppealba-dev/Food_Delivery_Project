import { StatoOrdine } from './stato-ordine';

export interface Ordine {
    ID_ordine?: number;
    data: string;
    ora: string;
    prezzo_totale: number;
    REF_acquirente: number;
    REF_fattorino?: number;
    stato: StatoOrdine;
    REF_indirizzo: number;
    note_ordine?: string;
    // Campi aggiuntivi dal JOIN con indirizzo
    via?: string;
    numero_civico?: string;
    citta?: string;
    cap?: string;
    // Campi aggiuntivi dal JOIN con utente (acquirente)
    nome?: string;
    cognome?: string;
    numero_telefono?: string;
    email?: string;
    // Campi aggiuntivi dal JOIN con utente (fattorino)
    nome_fattorino?: string;
    cognome_fattorino?: string;
    telefono_fattorino?: string;
}
