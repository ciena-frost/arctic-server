var express = require('express');
var bodyParser = require('body-parser').json({ type: 'application/vnd.api+json' });
var Promise = require('promise');
var https = require('https');
var sourceInterface = require('./sourceInterface.js');
var dbManager = require('./dbManager.js')
var RegClient = require('npm-registry-client');
var client = new RegClient();
var uri = "https://registry.npmjs.org/";
var params = {timeout: 1000};
var fs = require('fs');


module.exports = {
  //Function: Will take a Link to a repositories and return the packaged repository
  getRepoFromLink: function(link,callback){
    var source = sourceInterface.getSource(link),
        options = source.getOptions(link)

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
  }
}
