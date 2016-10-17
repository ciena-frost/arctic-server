var express = require('express'),
    bodyParser = require('body-parser').json({ type: 'application/vnd.api+json' }),
    Promise = require('promise'),
    https = require('https'),
    sourceInterface = require('./sourceInterface.js'),
    dbManager = require('./dbManager.js'),
    config = require('../config.json')
    RegClient = require('npm-registry-client'),
    client = new RegClient(),
    uri = "https://registry.npmjs.org/",
    params = {timeout: 1000},


module.exports = {
  //Function: Will take a Link to a repositories and return the packaged repository
  getRepoFromLink: function(link,callback){
    var source = sourceInterface.getSource(link),
        options = source.getOptions(link)

      console.log(options);
    sourceInterface.getHttps(options, function(data){
      var repo = source.createRepo(data, link);
      var dependencies  = source.createDepArray(data, data.id, repo.id);
      dbManager.saveItem(repo, 'repositories', function(){
        dbManager.saveArray(dependencies, 'dependencies', function(){
          callback(repo);
        })
      })
    })
  },

  //Function: Will take a name of a dependency or repository and return the packaged repository
  getRepoFromName: function(name, callback){
    dbManager.findItem(name, 'repositories', function(data) {
      var notFound = data.length < 1
      if(notFound){
        client.get(uri + name.split('@')[0], params, function (error, data, raw, res) {
          module.exports.getRepoFromLink(data.repository.url.replace('.git', ''),function(repo){
              callback(repo);
          })
        })
      }else{
        callback(data)
      }
    })
  },

  isPriority: function(data){
    //Compare properties of data to config.priorityConditions and return true or false.

    //if part of config.priorityConditions.organization
    if(module.exports.matchOne(data[0].attributes.organizations, config.priorityConditions.organizations)){
      return true
    }else if (module.exports.matchOne(data[0].attributes.keywords, config.priorityConditions.keywords)) {

    }else if (module.exports.matchOne(data[0].attributes.name, config.priorityConditions.repositories)) {

    }
    //if has certain config.priorityConditions.keywords
    //if repo name is in config.priorityConditions.repositories



  },
  //Takes 2 arrays and outputs true if there is a common element
  matchOne: function(arr1, arr2) {
    return arr2.some(function (v) {
        return arr1.indexOf(v) >= 0;
    })
  }
}
