const express = require ('express');
const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require ('mongoose');

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

app.get('/', (request, response) => {
    response.send('Dev Connect has started...');
});