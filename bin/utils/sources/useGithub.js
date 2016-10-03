var express = require('express');
var bodyParser = require('body-parser').json({ type: 'application/vnd.api+json' });
var repoModel = require('../models/repository.js');
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
    repoPackage = JSON.parse((Buffer(JSON.parse(rawPackage).content,'base64').toString('ascii')));

    var id = repoModel.getId(repoPackage.name, repoPackage.version),
        attributes = repoModel.getAttributes(repoPackage.name, 'GitHub', repoPackage.author, repoPackage.version, repoPackage.description),
        relationships = repoModel.getRelationships(repoPackage.dependencies),
        included = repoModel.getIncluded(),
        repository = repoModel.createRepo(id, 'repository', attributes, relationships, included);
    return(repository);
  },

  formatDependencyArray: function(array){
    var depArray = [];
    for(var i in array){
      var depVersion = JSON.stringify(array[i]).toString().replace(/['"^~]+/g, '');
      depArray.push(i + "@" + depVersion);
    }

    for(var i in array){
      var depVersion = JSON.stringify(array[i]).toString().replace(/['"^~]+/g, '');
      depArray.push(
        { type: "repository",
          _id : i + "@" + depVersion,
          attributes: {},
          links: { self: 'http://localhost:4500/api/repositories/' + i + "@" + depVersion }
        }
      );
    }
    return depArray
  }
}
