export class DbCategory {
    private ID_categoria: number;
    private nome_categoria: string;

    constructor(ID_categoria: number, nome_categoria: string) {
        this.ID_categoria = ID_categoria;
        this.nome_categoria = nome_categoria;
    }

    getId(): number {
        return this.ID_categoria;
    }

    getName(): string {
        return this.nome_categoria;
    }
}
