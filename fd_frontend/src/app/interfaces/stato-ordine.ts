export enum StatoOrdine {
    ORDINATO = 'ordinato',
    ACCETTATO = 'accettato',
    RIFIUTATO = 'rifiutato',
    IN_PREPARAZIONE = 'in preparazione',
    IN_CONSEGNA = 'in consegna',
    CONSEGNATO = 'consegnato'
}

export const STATI_ORDINE_VALIDI = Object.values(StatoOrdine);

export const STATI_ORDINE_LABELS = {
    [StatoOrdine.ORDINATO]: 'Ordinato',
    [StatoOrdine.ACCETTATO]: 'Accettato',
    [StatoOrdine.RIFIUTATO]: 'Rifiutato',
    [StatoOrdine.IN_PREPARAZIONE]: 'In Preparazione',
    [StatoOrdine.IN_CONSEGNA]: 'In Consegna',
    [StatoOrdine.CONSEGNATO]: 'Consegnato'
};
