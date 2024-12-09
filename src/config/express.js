const express = require('express')
const compress = require('compression')
const cors = require('cors');
const helmet     = require('helmet');


const morgan = require('./morgan');
const {errorHandler} = require('../api/middlewares/errorHandler');
const routes = require('../api/routes');

const app = express();

app.use(morgan)

// parse body params and attache them to req.body
app.use(express.json({limit:'50mb'}))
app.use(express.urlencoded({extended:true}))


// gzip compression
app.use(compress());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

app.use(routes)

//Error Handler
app.use(errorHandler);

module.exports = app;