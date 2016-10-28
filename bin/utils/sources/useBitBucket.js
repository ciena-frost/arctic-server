var express = require('express'),
    repoModel = require('../models/repository.js'),
    versionModel = require('../models/version.js'),
    depModel = require('../models/dependency.js')
    config = require('../../config.json')

module.exports = {
  getOptions: function(link) {
    if(link.indexOf("//")>-1){
      link = link.split("//")[1]
    }
    link = link.split('/');

    return options = {
      host: 'bitbucket.ciena.com',
      path: '/rest/api/1.0/projects/' + link[2] + '/repos/' + link[4] + '/browse/package.json',
      headers: {'Authorization': config.bitbucketAuthorization}
    };
  },

  getOptionsOrg: function(org){
    return options = {
      host: 'bitbucket.ciena.com',
      path: '/rest/api/1.0/projects/' + org + '/repos?limit=1000',
      headers: {'Authorization': config.bitbucketAuthorization}
    }
  },

  createRepo: function(repoPackage,link, org) {
    var repository = repoModel.create(repoPackage.name,
                                      link,
                                      repoPackage.version,
                                      org.split('/')[5],
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
    return data.links.self[0].href
  },

  getRepositoryArray: function(data){
    return JSON.parse(data).values
  },

  //Github returns a base64 string. Need to parse, grab content and convert from base64.
  parsePack: function(rawPackage) {
    rawPackage = JSON.parse(rawPackage)
    if(rawPackage.message === "You are not permitted to access this resource"){
      return null
    }
    rawPackage = rawPackage.lines
    json = ''
    var i = 0
    while(rawPackage[i] !== undefined){
      json += rawPackage[i].text
      i++
    }
    return JSON.parse(json)
  }
}
