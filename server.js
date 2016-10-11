var express = require('express');
var Promise = require('promise');
var dbManager = require('./bin/utils/dbManager.js')
var reqManager = require('./bin/utils/reqManager.js')
var bodyParser = require('body-parser').json({ type: 'application/vnd.api+json' });
var https = require('https');
var RegClient = require('npm-registry-client');
var client = new RegClient();
var uri = "https://registry.npmjs.org/";
var params = {timeout: 1000};
var fs = require('fs');

var app = express();
var packagedb = []

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    next();
});
//Serves the relational document for the repository
app.get('/api/repositories/:repo/dependencies', function(req, res) {
  reqManager.getRepoFromName(req.params.repo, function(repo){
    var idArr = []
    console.log(repo[0].relationships);
    for(var i in repo[0].relationships.dependencies.data){
      idArr.push(repo[0].relationships.dependencies.data[i]._id)
    }
    console.log({idArr});
    dbManager.findArray(idArr, 'dependencies', function(data){
      console.log({data});
      res.send({data});

    })
  })
});


app.get('/api/dependencies/:dep/isdependencies', function(req, res) {
  dbManager.findIsDependency(req.params.dep, 'repositories', function(data){
    console.log(data);

  })
});

//This will return the repo with the name :repo
app.get('/api/repositories/:repo', function(req, res) {
  //#todo cleanup and put 'findRepository' inside the reqManager
  reqManager.getRepoFromName(req.params.repo, function(data){
    res.send({data});
  })
});

//Route to GET all projectlink objects
app.get('/api/repositories/',function(req,res) {
  dbManager.findAll('repositories',function(data){
    res.send({data});
  });
});

//This will return the dependency with the name :dep
app.get('/api/dependencies/:dep', function(req, res) {
  console.log(req.params.dep);
  dbManager.findItem(req.params.dep, 'dependencies', function(data) {
    res.send({data:data[0]});
  });
});

//
app.get('/api/dependencies/', function(req, res) {
  dbManager.findAll('dependencies', function(data) {
    console.log("Requested Dependencies");
    res.send();
  });
});

//Route new projectlinks are sent to from the frontend
app.post('/api/repositories', bodyParser, function(req,res) {
  reqManager.getRepoFromLink(req.body.data.attributes.link, function(data){
    res.send({data});
  });
});

app.listen('4500');
