var express = require('express');
var bodyParser = require('body-parser').json({ type: 'application/vnd.api+json' });
var repoModel = require('../models/repository.js');
var depModel = require('../models/dependency.js');
var Promise = require('promise');
var https = require('https');
var RegClient = require('npm-registry-client');
var client = new RegClient();
var uri = "https://registry.npmjs.org/";
var params = {timeout: 1000};
var fs = require('fs');

module.exports = {
  getOptions: function(link) {
    if(link.indexOf("//")>-1){
      link = link.split("//")[1]
    }
    link = link.split('/');

    return options = {
      host: 'api.github.com',
      path: '/repos/' + link[1] + '/' + link[2] + '/contents/package.json',
      headers: {'User-Agent': 'nicklewanowicz', 'nicklewanowicz':'603c097f950bb3c6a89734b07aa3918b4158151a'}
    };
  },

  //#todo Replace with newCreateRepo() function
  createRepo: function(rawPackage,link) {
    repoPackage = module.exports.parsePack(rawPackage);

    var id = repoModel.getId(repoPackage.name, repoPackage.version),
        attributes = repoModel.getAttributes(repoPackage.name, 'GitHub', repoPackage.author, repoPackage.version, repoPackage.description),
        relationships = repoModel.getRelationships(id,repoPackage.dependencies, repoPackage.devDependencies),
        repository = repoModel.create(id, 'repository', attributes, relationships);
    return(repository);
  },

  createDepArray: function(rawPackage, theId, isdependencyId){
    repoPackage = module.exports.parsePack(rawPackage);

    depArray = []
    for(var dependency in repoPackage.dependencies){
        depArray.push(depModel.create(dependency, repoPackage.dependencies[dependency], isdependencyId))
    }
    return depArray;

  },

  parsePack: function(rawPackage) {
    return JSON.parse((Buffer(JSON.parse(rawPackage).content,'base64').toString('ascii')));
  }
}
