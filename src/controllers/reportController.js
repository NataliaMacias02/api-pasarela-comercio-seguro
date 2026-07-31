const Order = require("../models/Order");

// Reporte financiero
const financialReport = async (req, res) => {
    try {

        const orders = await Order.find();

        const totalOrders = orders.length;

        let totalRevenue = 0;
        let totalProductsSold = 0;

        orders.forEach(order => {

            totalRevenue += order.total;

            order.items.forEach(item => {
                totalProductsSold += item.quantity;
            });

        });

        const averageOrderValue =
            totalOrders > 0
                ? totalRevenue / totalOrders
                : 0;

        res.status(200).json({
            totalOrders,
            totalProductsSold,
            totalRevenue,
            averageOrderValue
        });

    } catch (error) {

        console.error("Error al generar el reporte financiero:", error);

        res.status(500).json({
            message: "Error interno del servidor."
        });

    }
};

module.exports = {
    financialReport
};