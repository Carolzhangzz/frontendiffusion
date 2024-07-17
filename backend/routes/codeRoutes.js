const express = require("express");
const router = express.Router();
const codeController = require("../controllers/codeController");

router.post("/generate-code", codeController.generateCode);

module.exports = router;
