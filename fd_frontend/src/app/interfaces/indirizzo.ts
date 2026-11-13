export interface Indirizzo {
    ID_indirizzo?: number;
    REF_Utente: number;
    via: string;
    numero_civico: string;
    citta: string;
    cap: string;
    note_consegna?: string;
}