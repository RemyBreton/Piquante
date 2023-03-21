/**************************** IMPORTATION DES PACKAGES + VARIABLE D'ENVIRONEMENT****************************/
/**********************************************************************************************************/

const mongoose = require("mongoose");

require("dotenv").config();

const password = process.env.DB_PASSWORD; // mesure de securité
const username = process.env.DB_USERNAME; // mesure de securité

const express = require("express"); // importation d'express

const app = express(); // permettra de crée une application express

const sauceRoutes = require("./routes/stuff");
const userRoutes = require("./routes/user");
const path = require("path");

/**************************** CONNECTION A LA BASE DE DONNEE ****************************/
/***************************************************************************************/

mongoose
  .connect(
    // connect à la bdd avec id et mdp
    `mongodb+srv://${username}:${password}@cluster0.1wnwy8s.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

/**************************** CORS ****************************/
/*************************************************************/

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // acces à l'api pour tout le monde
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  ); // autorisation de certain en-tete
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  ); // autorisation de certaine methode
  next();
});

app.use(express.json());

/**************************** ROUTE PRINCIPALE DE L'API ****************************/
/**********************************************************************************/

app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app; // exportation de la const
