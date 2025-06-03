const mongoose = require("mongoose");
require("dotenv").config();

const mongoUri = process.env.MONGODB;

const initializeDatabase = async () => {
  await mongoose
    .connect(mongoUri)
    .then(() => console.log("Connected to the database."))
    .catch((error) =>
      console.log("An error occured while connecting to the database.", error)
    );
};

module.exports = { initializeDatabase };
