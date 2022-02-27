require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const app = express();

//router
const user_routes = require('./Routes/user.js')

const port = process.env.PORT || 3000;

//get payload
app.use(express.json())

// connect to DataBase
// console.log(process.env.MONGO_URI)
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to DB'))
    .catch(err => console.log('Got error while connecting to DB :'+ err.message ))

app.use('/', user_routes);

// Starting the server
app.listen(port, () => {
    console.log('App running on port ', port);
})

