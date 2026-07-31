require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const https = require("https");
const fs = require("fs");

const connectDB = require("./src/config/database");

const productRoutes = require("./src/routes/productRoutes");
const userRoutes = require("./src/routes/userRoutes");
const cartRoutes = require("./src/routes/cartRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const reportRoutes = require("./src/routes/reportRoutes");

const validateToken = require("./src/middleware/validateToken");

const app = express();

const PORT = process.env.PORT || 5100;

// Validar variables de entorno
if (!process.env.APP_SECRET || !process.env.MONGO_URI) {
    console.error("Error: Faltan variables de entorno requeridas.");
    process.exit(1);
}

// Conectar a MongoDB
connectDB();

// Desactivar cabecera X-Powered-By
app.disable("x-powered-by");

// Configuración de Helmet
app.use(
    helmet({
        frameguard: {
            action: "deny"
        }
    })
);

// Configuración de CORS
const allowedOrigins = [
    "http://localhost:3000"
];

app.use(
    cors({
        origin: allowedOrigins,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "app-token"
        ]
    })
);

// Middleware
app.use(express.json());

// Ruta principal
app.get("/", (req, res) => {
    res.status(200).json({
        message: "API Pasarela Comercio Segura",
        status: "OK",
        version: "1.0.0",
        endpoints: {
            products: "/api/products",
            users: "/api/users",
            carts: "/api/carts",
            orders: "/api/orders",
            reports: "/api/reports/financial"
        }
    });
});

// Middleware de autenticación
app.use(validateToken);

// Rutas de la API
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reports", reportRoutes);

// Configuración HTTPS
const options = {
    key: fs.readFileSync("./certs/key.pem"),
    cert: fs.readFileSync("./certs/cert.pem")
};

// Iniciar servidor HTTPS
https.createServer(options, app).listen(PORT, () => {
    console.log("Hello World");
    console.log(`Servidor HTTPS ejecutándose en https://localhost:${PORT}`);
});