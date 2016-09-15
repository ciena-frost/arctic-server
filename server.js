var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser').json({ type: 'application/vnd.api+json' });
var https = require('https');

var app = express();

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    next();
});

//Temporary array for db
packagedb = [];

//Callback for the https reqest
callback = function(response) {
  var str = '';
  response.on('data', function (chunk) {
    str += chunk;
  });
  response.on('end', function () {
    str = (Buffer.from(JSON.parse(str).content, 'base64').toString("ascii"))
  });
  return str;
}

//Route for GET requests with ID param
app.get('/api/projectlinks/:id', function(req, res) {
  res.send(packagedb[req.params.id - 1]);
});

//Route to GET all projectlink objects
app.get('/api/projectlinks',function(req,res) {
	res.send(JSON.stringify(packagedb));
});

//Route new projectlinks are sent to from the frontend
app.post('/api/projectlinks', bodyParser, function(req,res) {
  //Debug Statement
  console.log("Project link recieved - User: " + req.body.data.attributes.user + " Repo: " + req.body.data.attributes.repo)

  //Defines where to request for package.json
  var options = {
    host: 'api.github.com',
    path: '/repos/' + req.body.data.attributes.user + '/' + req.body.data.attributes.repo + '/contents/package.json',
    headers: {'User-Agent': 'manicks' }
  };
  //Sends and stores response
  var repoPackage = https.get(options, callback).end();

  //Push the response to array (will be db or json file to store permanently)
  packagedb.push({"id": packagedb.length, type: "projectlink", attributes: {user: req.body.data.attributes.user, repo: req.body.data.attributes.user, packageJson: repoPackage}})

  //Send response to frontend with object
  res.send(packagedb[(packagedb.length) - 1]);
});

app.listen('4500');
