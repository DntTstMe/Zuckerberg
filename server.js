require('dotenv').config();
const express = require("express");
const { connectDatabase } = require('./config/connection');
// const db = require("./config/connection");
const routes = require("./routes/api");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

app.get('/test', (req, res) => res.send('Test successful!'));

// Connect to MongoDB
connectDatabase();

const PORT = process.env.PORT || 3001;

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });