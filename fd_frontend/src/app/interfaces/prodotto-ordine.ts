export interface ProdottoOrdine {
    REF_ordine: number;
    REF_prodotto: number;
    note: string;
    quantita: number;
    prezzo_unitario: number;
    // Campi aggiuntivi dal JOIN con prodotto
    nome_prodotto?: string;
    url_immagine?: string;
}