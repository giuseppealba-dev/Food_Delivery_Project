export interface ProductModalData {
    nome_prodotto: string;
    prezzo: number;
    url_immagine: string;
    is_offerta: boolean;
    percentuale_offerta?: number;
    ingredients: string;
    categoria?: string;
}