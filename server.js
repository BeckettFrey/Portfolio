const express = require("express");
const app = express();
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

app.listen(3000);

app.get("/", (res) => {
  const root = path.join(__dirname, "public", "index.html");
  res.sendFile(root);
});
