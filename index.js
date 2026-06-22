const express = require("express");
const helmet = require("helmet");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(helmet());

const PORT = 5100;

app.listen(PORT, () => {
  console.log("Hello World");
  console.log(`Server running on port ${PORT}`);
});
