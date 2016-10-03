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

//This will return the project with the name :project
app.get('/api/projects/:project', function(req, res) {
  dbManager.findProject(req.params, function(data) {
    res.send(data);
  });
});

//This will return the repo with the name :repo
app.get('/api/repositories/:repo', function(req, res) {
  //#todo cleanup and put 'findRepository' inside the reqManager
  dbManager.findRepository(req.params.repo, function(data) {
    if (data.length < 1){
      reqManager.getRepoFromName(req.params.repo, function(repo){
        dbManager.saveItem(repo, 'repository', function(){})
        res.send(JSON.stringify({"data": repo}));
      })
    }else{
      res.send(JSON.stringify({"data": data}));
    }
  });
});

//This will return all projects
app.get('/api/projects', function(req, res) {
  dbManager.findAllProjects(function(data){
    res.send(data);
  });
});

//Route to GET all projectlink objects
app.get('/api/repositories/',function(req,res) {
  dbManager.findAllRepos(function(data){
    console.log(data);
    res.send({data});
  });
});

//Route new projectlinks are sent to from the frontend
app.post('/api/repositories', bodyParser, function(req,res) {
  reqManager.getRepoFromLink(req.body.data.attributes.link, function(repo){
    dbManager.saveItem(repo,'repositories',function(data){
      res.send(JSON.stringify({"data": repo}));
    });
  });
});

app.listen('4500');
