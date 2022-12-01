const express = require('express');
const app = express();
const db = require("./models");
const router = require('./routes/productRouter.js');
const logger=require("./config/logger");
const SDC = require('statsd-client');

const sdc = new SDC({host:"localhost", port:8125});
var start= new Date();
require('dotenv').config();



// Syncing the DB using Sequelize
db.sequelize.sync()
.then((
    console.log("DB sync done!")
));

// Health Check endpoint - returns 200 HTTP status code
app.get('/healthz', (req,res) => {
    logger.info("check healthz");
    sdc.increment("endpoint.checkheatlhz");
    sdc.timing("healthz.checking_time",start);
    res.status(200).send();
})

app.get('/healthz', (req,res) => {
    logger.info("check healthz");
    res.status(200).send("updated ami");
})

//Middlewear
app.use(express.json());
app.use(express.urlencoded({extended: true}))

// Router
app.use('/v1', router);

const PORT = 8080;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`))

module.exports = app;