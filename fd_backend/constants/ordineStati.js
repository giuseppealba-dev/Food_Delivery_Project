// Stati possibili per un ordine
const STATI_ORDINE = {
    ORDINATO: 'ordinato',
    ACCETTATO: 'accettato',
    RIFIUTATO: 'rifiutato',
    IN_PREPARAZIONE: 'in preparazione',
    IN_CONSEGNA: 'in consegna',
    CONSEGNATO: 'consegnato'
};

// Array degli stati validi per validazione
const STATI_VALIDI = Object.values(STATI_ORDINE);

module.exports = {
    STATI_ORDINE,
    STATI_VALIDI
};
