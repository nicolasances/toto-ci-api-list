var express = require('express');
var Promise = require('promise');
var bodyParser = require("body-parser");

var getAPIList = require('./dlg/GetAPIList');

var apiName = 'ci-api-list';

var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
  next();
});
app.use(bodyParser.json());
app.use(express.static('/app'));

/**
 * Smoke test api
 */
app.get('/', function(req, res) {res.send({api: apiName, status: 'running'});});

app.get('/apis', function(req, res) {

  getAPIList.do().then(function(result) {res.status(200).send(result);}, function(result) {res.status(500).send(result)});

});

app.listen(8080, function() {
  console.log('Toto CI API List Microservice up and running');
});
