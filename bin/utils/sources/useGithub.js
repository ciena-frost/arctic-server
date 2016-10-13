var express = require('express');
var bodyParser = require('body-parser').json({ type: 'application/vnd.api+json' });
var repoModel = require('../models/repository.js');
var depModel = require('../models/dependency.js');

module.exports = {
  getOptions: function(link) {
    if(link.indexOf("//")>-1){
      link = link.split("//")[1]
    }
    link = link.split('/');

    return options = {
      host: 'api.github.com',
      path: '/repos/' + link[1] + '/' + link[2] + '/contents/package.json',
      headers: {
       'User-Agent': 'NickLewanowicz',
       'Authorization': 'token 56822a9924a1b2d9109c05c8737b37929b4b7047'
     }
    };
  },

  //#todo Replace with newCreateRepo() function
  createRepo: function(rawPackage,link) {
    repoPackage = module.exports.parsePack(rawPackage);
    console.log(repoPackage.devDependencies);
    var id = repoModel.getId(repoPackage.name, repoPackage.version),
        attributes = repoModel.getAttributes(repoPackage.name,
                                             'GitHub',
                                             repoPackage.author,
                                             repoPackage.version,
                                             repoPackage.organization,
                                             repoPackage.keywords,
                                             repoPackage.description),
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
    for(var dependency in repoPackage.devDependencies){
        depArray.push(depModel.create(dependency, repoPackage.devDependencies[dependency], isdependencyId))
    }
    return depArray;

  },
  //Github returns a base64 string. Need to parse, grab content and convert from base64.
  parsePack: function(rawPackage) {
    return JSON.parse((Buffer(JSON.parse(rawPackage).content,'base64').toString('ascii')));
  }
}
