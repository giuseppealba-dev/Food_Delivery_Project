const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./db/database.sqlite", (err) => {
    if (err) {
        console.log("Errore connessione al database: ", err.message);
    } else {
        console.log("Connesso al database SQLite.");

        // Comandi per la creazione di tabelle e relazioni
        // ? Per il numero di telefono vedere se togliere unique o meno
        db.run(`
            create table if not exists Ruolo (
            ID_ruolo integer primary key autoincrement,
            nome_ruolo text not null
            )
            `)
        
        db.run(`
            create table if not exists Utente (
            ID_utente integer primary key autoincrement,
            nome text not null,
            cognome text not null,
            email text unique not null,
            numero_telefono text unique not null,
            password text not null,
            REF_ruolo integer not null,
            FOREIGN KEY (REF_ruolo) references Ruolo(ID_ruolo)
            )
            `)

        db.run(`
            create table if not exists Indirizzo (
            ID_indirizzo integer primary key autoincrement,
            REF_Utente integer not null,
            via text not null,
            numero_civico text not null,
            citta text not null,
            cap text not null,
            note_consegna text,
            FOREIGN KEY (REF_Utente) references Utente(ID_utente)
            )
            `)

        db.run(`
            create table if not exists Categoria (
            ID_categoria integer primary key autoincrement,
            nome_categoria text unique not null
            )
            `)

        db.run(`
            create table if not exists Prodotto (
            ID_prodotto integer primary key autoincrement,
            nome_prodotto text not null,
            prezzo decimal(6,2) not null,
            url_immagine text,
            REF_categoria integer not null,
            is_offerta boolean not null,
            percentuale_offerta integer,
            FOREIGN KEY (REF_categoria) references Categoria(ID_categoria)
            )
            `)

        db.run(`
            create table if not exists Ingrediente (
            ID_ingrediente integer primary key autoincrement,
            nome_ingrediente text not null
            )
            `)

        db.run(`
            create table if not exists Ingredienti_Prodotto (
            REF_prodotto integer not null,
            REF_ingrediente integer not null,
            PRIMARY KEY (REF_prodotto, REF_ingrediente),
            FOREIGN KEY (REF_prodotto) references Prodotto(ID_prodotto),
            FOREIGN KEY (REF_ingrediente) references Ingrediente(ID_ingrediente)
            )
            `)

        db.run(`
            create table if not exists Ordine (
            ID_ordine integer primary key autoincrement,
            data date not null,
            ora datetime not null,
            prezzo_totale decimal(6,2) not null,
            REF_acquirente integer not null,
            REF_fattorino integer,
            stato text not null,
            REF_indirizzo integer not null,
            note_ordine text,
            FOREIGN KEY (REF_acquirente) references Utente(ID_utente),
            FOREIGN KEY (REF_fattorino) references Utente(ID_utente),
            FOREIGN KEY (REF_indirizzo) references Indirizzo(ID_indirizzo)            
            )
            `)

        // ! il prezzo unitario è ottenuto dal prezzo del prodotto meno l'eventuale offerta
        db.run(`
            create table if not exists Prodotti_Ordine (
            REF_ordine integer not null,
            REF_prodotto integer not null,
            note TEXT NOT NULL DEFAULT '',
            quantita integer not null,
            prezzo_unitario decimal(6,2) not null,
            PRIMARY KEY (REF_ordine, REF_prodotto, note),
            FOREIGN KEY (REF_ordine) references Ordine(ID_ordine),
            FOREIGN KEY (REF_prodotto) references Prodotto(ID_prodotto)
            )
            `)
        
    }
})

module.exports = db;