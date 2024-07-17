const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const prdRoutes = require("./routes/prdRoutes");
const codeRoutes = require("./routes/codeRoutes");
const ideaRoutes = require("./routes/ideaRoutes");
// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Increase the limit to handle large images


// Use the routes
app.use("/api", prdRoutes);
app.use("/api", codeRoutes);
app.use("/api", ideaRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
