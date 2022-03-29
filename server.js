const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require ('express');
const app = express();
const connectDB = require('./config/db');
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

//Testing Database Connection
connectDB();

app.get('/', (request, response) => {
    response.send('Dev Connect has started...');
});