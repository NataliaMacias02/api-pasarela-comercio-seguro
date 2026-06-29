require("dotenv").config();

const express = require("express");
const connectDB = require("./src/config/database");

const app = express();

const PORT = process.env.PORT || 5100;

// Conectar a MongoDB
connectDB();

app.use(express.json());

app.listen(PORT, () => {
    console.log("Hello World");
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});