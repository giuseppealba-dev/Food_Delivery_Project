export interface CartItem {
    id_prodotto: number,
    nome_prodotto: string,
    url_immagine: string,
    prezzo: number,
    is_offerta: boolean,
    percentuale_offerta: number,
    notes: string,
    quantity: number
}
