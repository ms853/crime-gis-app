//starting point of the application.
const http = require('http');
const express = require('express');

const bodyParser = require('body-parser');
const morgan = require('morgan');

//application setup 
const app = express();
const firebaseAdmin = require('firebase-admin');
const serviceAccount = require('./service-account.json')
const router = require('./router');
//express middleware for incoming requests to be passed into.  
app.use(morgan('combined')); //logging incoming requests.
app.use(bodyParser.json({ type: '*/*'})) //parse incoming request is parsed as json. 

router(app);

//Database configuration 
//initializing firebase admin authentication object.
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: "https://my-crime-gis-app.firebaseio.com"
});

//server setup 
const portNumber = process.env.PORT || 3000; //port config
const server = http.createServer(app);
server.listen(portNumber);
     
//test lisening 
console.log("Server is listening on port: ", portNumber);  
 