const express = require("express");
const path = require('path');
const livroRoutes = require("./routes/livroRoutes");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use("/livros", livroRoutes);

module.exports = app;
