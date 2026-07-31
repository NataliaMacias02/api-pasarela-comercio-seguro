const Product = require("../models/Product");

// Crear producto
exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json(product);

    } catch (error) {
        console.error("Error al crear el producto:", error);

        res.status(400).json({
            message: "Los datos enviados no son válidos."
        });
    }
};

// Obtener todos los productos
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();

        res.status(200).json(products);

    } catch (error) {
        console.error("Error al obtener los productos:", error);

        res.status(500).json({
            message: "Error interno del servidor."
        });
    }
};

// Obtener un producto por ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Producto no encontrado."
            });
        }

        res.status(200).json(product);

    } catch (error) {
        console.error("Error al obtener el producto:", error);

        res.status(500).json({
            message: "Error interno del servidor."
        });
    }
};

// Actualizar producto
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                message: "Producto no encontrado."
            });
        }

        res.status(200).json(product);

    } catch (error) {
        console.error("Error al actualizar el producto:", error);

        res.status(400).json({
            message: "Los datos enviados no son válidos."
        });
    }
};

// Eliminar producto
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Producto no encontrado."
            });
        }

        res.status(200).json({
            message: "Producto eliminado correctamente."
        });

    } catch (error) {
        console.error("Error al eliminar el producto:", error);

        res.status(500).json({
            message: "Error interno del servidor."
        });
    }
};