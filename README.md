# Food Delivery

Food Delivery è un'applicazione full-stack per la gestione di un servizio di
consegna a domicilio, dalla consultazione del catalogo alla creazione e
gestione degli ordini.

Il progetto è stato sviluppato come progetto universitario per la materia
**Programmazione Web e Mobile**.

## Contesto

Il sistema simula il funzionamento di una piattaforma di food delivery con
più tipologie di utenti. I clienti possono consultare i prodotti, comporre il
carrello e creare ordini; gli amministratori gestiscono il catalogo e gli
ordini; i fattorini visualizzano le consegne assegnate e ne aggiornano lo
stato.

## Funzionalità principali

- Registrazione, autenticazione e gestione del profilo utente.
- Consultazione del catalogo tramite categorie, prodotti e ingredienti.
- Gestione del carrello e creazione degli ordini.
- Gestione degli indirizzi di consegna e visualizzazione dello storico ordini.
- Area amministratore per prodotti, categorie, ingredienti e ordini.
- Area fattorino per la gestione delle consegne, degli stati degli ordini e
  della posizione sulla mappa.

## Flusso applicativo

1. Un utente si registra oppure accede all'applicazione.
2. L'utente consulta il catalogo e seleziona i prodotti.
3. I prodotti vengono aggiunti al carrello e associati a un indirizzo.
4. L'utente conferma l'ordine.
5. L'amministratore può gestire catalogo e ordini.
6. Il fattorino visualizza gli ordini assegnati e aggiorna il relativo stato.
7. L'utente consulta lo storico degli ordini dal proprio profilo.

## Tecnologie

- **Frontend:** Ionic, Angular 19, TypeScript e SCSS.
- **Backend:** Node.js ed Express.
- **Database:** SQLite.
- **Accesso ai dati:** API REST e driver `sqlite3`.
- **Mappa:** Leaflet.
- **Mobile:** Capacitor.

## Architettura

Il progetto separa l'interfaccia utente dal backend e dalla persistenza dei
dati:

```text
Ionic / Angular
        ↓ HTTP
Express REST API
        ↓
SQLite
```

Il frontend comunica con gli endpoint locali del backend tramite l'indirizzo
`http://localhost:3000/api`.

## Struttura del progetto

```text
food_delivery_project/
├── fd_backend/
│   ├── controllers/
│   ├── db/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── validators/
│   └── fd_server.js
├── fd_frontend/
│   ├── src/app/admin/
│   ├── src/app/auth/
│   ├── src/app/carrello/
│   ├── src/app/fattorino/
│   ├── src/app/home/
│   └── src/app/services/
└── README.md
```

## Requisiti

- Node.js LTS.
- npm.

## Avvio in ambiente locale

### Backend

Aprire un terminale nella cartella del backend:

```powershell
cd fd_backend
npm install
npm start
```

Il backend sarà disponibile su `http://localhost:3000`.

### Frontend

Aprire un secondo terminale nella cartella del frontend:

```powershell
cd fd_frontend
npm install
npm start
```

L'applicazione sarà disponibile su `http://localhost:4200`.
È necessario mantenere attivi entrambi i terminali.

## Database

Il backend utilizza SQLite per la persistenza locale dei dati. Il database
principale si trova in `fd_backend/db/database.sqlite`.

Il progetto include anche il file `fd_backend/db/utenti_db.csv`, utilizzato
come supporto per i dati locali del progetto.

Il database locale e il CSV degli utenti sono esclusi dal repository per
evitare di pubblicare dati di test o personali. All'avvio, il backend crea
automaticamente la struttura delle tabelle tramite `fd_backend/db/new_database.js`.

## Build del frontend

Per creare la build del frontend:

```powershell
cd fd_frontend
npm run build
```

I file generati vengono salvati nella cartella `fd_frontend/www`.


## Obiettivo didattico

Il progetto applica i concetti di sviluppo web e mobile a un sistema
full-stack con autenticazione, ruoli diversi, API REST, persistenza locale e
interfacce dedicate ai diversi attori del servizio.

## Autore

- [@giuseppealba-dev](https://github.com/giuseppealba-dev)

## Stato del progetto

Progetto universitario funzionante per scopi didattici e dimostrativi.
La build del frontend è completata correttamente e le principali API del
backend rispondono in ambiente locale.

Sono ancora presenti alcuni problemi di qualità del codice rilevati dal lint
frontend e lo script di test del backend non è stato configurato.
