var express = require('express'),
    reqManager = require('./bin/utils/reqManager.js'),
    config = require('./bin/config.json')
    bodyParser = require('body-parser').json({ type: 'application/vnd.api+json' })
    app = express();

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    next();
});

//Route new projectlinks are sent to from the frontend
app.get('/api/dashboard', bodyParser, function(req,res) {
  reqManager.getDashboard(function(data){
    res.send({data});
  });
});

//Route new projectlinks are sent to from the frontend
app.post('/api/repositories', bodyParser, function(req,res) {
  reqManager.getNewRepository(req.body.data.attributes.link, function(data){
    res.send({data});
  });
});

//This will return the repo with the name :repo
app.get('/api/repositories/:repo', function(req, res) {
  reqManager.getRepository(req.params.repo, function(data){
    res.send({data});
  })
});

//Route to GET all projectlink objects
app.get('/api/repositories/',function(req,res) {
  reqManager.getAllRepositories(function(data){
    res.send({data});
  });
});

app.get('/api/versions', function(req, res) {
  reqManager.getAllVersions(function(data) {
    res.send({data});
  });
});

app.get('/api/versions/:version', function(req, res) {
  reqManager.getVersion(req.params.version, function(data) {
    res.send({data});
  });
});

//This will return the dependency with the name :dep
app.get('/api/dependencies/:dep', function(req, res) {
  reqManager.getDependency(req.params.dep, function(data) {
    res.send({data});
  });
});

//
app.get('/api/dependencies/', function(req, res) {
  reqManager.getAllDependencies(function(data) {
    res.send({data});
  });
});

app.get('/api/isdependencies/:item', function(req, res) {
  reqManager.getIsDependency(req.params.item, function(data) {
    res.send({data});
  });
});

app.get('/api/isdependencies', function(req, res) {
  reqManager.getAllRelationships(function(data) {
    res.send({data});
  });
});

app.get('/api/repositorycount', function(req, res) {
  reqManager.getAllRepositories(function(data){
    res.send({data: data.length});
  });
});


app.listen('4500', function(){
  for(var i = 0;i<config.ltsCompliant.length;i++){
    reqManager.saveLtsList(config.ltsCompliant[i].link, function(data){})
  }
  reqManager.getAllRepositories(function(data){
    if(data.length === 0){
      for(var i = 0;i<config.priorityConditions.organizations.length;i++){
        reqManager.getAllRepos(config.priorityConditions.organizations[i])
      }
    }
  });
});
