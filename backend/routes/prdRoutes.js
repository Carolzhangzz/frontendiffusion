const express = require("express");
const router = express.Router();
const prdController = require("../controllers/prdController");

router.post("/generate-prd", prdController.generatePRD);

module.exports = router;
