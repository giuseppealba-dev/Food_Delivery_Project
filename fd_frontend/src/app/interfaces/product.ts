export interface Product {
    ID_prodotto: number;
    nome_prodotto: string;
    prezzo: number;
    url_immagine: string;
    REF_categoria: number;
    is_offerta: boolean;
    percentuale_offerta: number;
}