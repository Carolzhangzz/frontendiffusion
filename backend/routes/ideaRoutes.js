const express = require("express");
const router = express.Router();
const ideaController = require("../controllers/ideaController");

router.post("/generate-ideas", ideaController.generateIdeas);

module.exports = router;