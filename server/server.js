const express = require('express')
const app = express()
const session = require('express-session')
var bodyParser = require('body-parser')
const user = require('./controllers/userController')

app.use(bodyParser.json())
user(app)



app.listen(process.env.port || 5000, function(){
  console.log('Now listening to requests');
});
