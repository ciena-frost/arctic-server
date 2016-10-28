var express = require('express'),
    repoModel = require('../models/repository.js'),
    versionModel = require('../models/version.js'),
    depModel = require('../models/dependency.js'),
    config = require('../../config.json')

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
       'Authorization': config.gitAuthorization
      }
    };
  },

  getOptionsOrg: function(org){
    return options = {
      host: 'api.github.com',
      path: '/users/' + org + '/repos',
      headers: {
       'User-Agent': 'NickLewanowicz',
       'Authorization': config.gitAuthorization
      }
    };
  },

  createRepo: function(repoPackage,link, org) {
    var repository = repoModel.create(repoPackage.name,
                                      link,
                                      repoPackage.version,
                                      org.split('/')[2],
                                      repoPackage.description,
                                      [{type: 'version', id: repoPackage.name + '@' + repoPackage.version}],
                                      repoPackage.keywords)
    return repository;
  },

  createVersion: function(repoPackage){
    var dependencies = versionModel.getDependencies(repoPackage.dependencies, repoPackage.devDependencies)
        version = versionModel.create(repoPackage.name,
                                      repoPackage.version,
                                      dependencies[0],
                                      dependencies[1])
    return version
  },

  createDependencies: function(repoPackage){
    depArray = []
    for(var dependency in repoPackage.dependencies){
        depArray.push(depModel.create(dependency, repoPackage.dependencies[dependency]))
    }
    for(var dependency in repoPackage.devDependencies){
        depArray.push(depModel.create(dependency, repoPackage.devDependencies[dependency]))
    }
    return depArray;
  },

  getRepositoryUrl: function(data){
    return data.html_url
  },

  getRepositoryArray: function(data){
    return JSON.parse(data)
  },

  //Github returns a base64 string. Need to parse, grab content and convert from base64.
  parsePack: function(rawPackage) {
    rawPackage = JSON.parse(rawPackage)
    if(rawPackage.message === "Not Found"){
      return null
    }else if(rawPackage.message === "Moved Permanently"){
      return null
    }else{
      return JSON.parse((Buffer(rawPackage.content,'base64').toString('utf8')));
    }
  }
}
