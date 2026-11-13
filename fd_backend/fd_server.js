const express = require("express");
const cors = require("cors");
const app = express();

// Configurazione CORS - deve essere prima degli altri middleware
app.use(
  cors({
    origin: ["http://localhost:8100", "http://localhost:4200"], // Ionic e Angular dev server
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true // Se hai bisogno di inviare cookie/credenziali
  })
);

// Middleware che permette di ritornare json
app.use(express.json());

// Middleware di logging
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.path}`, req.body);
//   next();
// });

// Routes di autenticazione definite nel file routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Routes di accesso al database per il fetch dei dati
const productRoutes = require("./routes/productRoutes");
app.use("/api/data/product", productRoutes);

const categoryRoutes = require("./routes/categoryRoutes");
app.use("/api/data/category", categoryRoutes);

const ingredientRoutes = require("./routes/ingredientRoutes");
app.use("/api/data/ingredient", ingredientRoutes);

const indirizzoRoutes = require("./routes/indirizzoRoutes");
app.use("/api/data/indirizzo", indirizzoRoutes);

const ordineRoutes = require("./routes/ordineRoutes");
app.use("/api/data/ordine", ordineRoutes);

// Serve per poter renderizzare pagine html all'interno del server
// Usato solamente per testare delle pagine statiche nel backend
app.set("view engine", "ejs");

// Intercetta errori del server
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ success: false, message: "Errore interno del server" });
});

// Avvio server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server in ascolto in http://localhost:${PORT}`);
});
