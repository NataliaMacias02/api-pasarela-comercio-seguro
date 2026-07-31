const express = require("express");
const router = express.Router();

const reportController = require("../controllers/reportController");

// Reporte financiero
router.get("/financial", reportController.financialReport);

module.exports = router;