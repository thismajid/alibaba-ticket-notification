const express = require("express");
const axios = require("axios");

const app = express();

setInterval(() => {}, 20000);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is started on localhost:${port} ...`);
});
