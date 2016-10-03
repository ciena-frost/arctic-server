var express = require('express');
var bodyParser = require('body-parser').json({ type: 'application/vnd.api+json' });
var Promise = require('promise');
var https = require('https');
var RegClient = require('npm-registry-client');
var useGithub = require('./sources/useGithub.js');
var client = new RegClient();
var uri = "https://registry.npmjs.org/";
var params = {timeout: 1000};
var fs = require('fs');

module.exports = {

  getSource: function(link){
    linkData = module.exports.parseLink(link)
    if(linkData[0].indexOf('github')> -1){
      return useGithub
    }else if(link[0].indexOf('bitbucket')> -1){
      return useBitBucket
    }
  },

  parseLink: function(link){
    if(link.indexOf("//")>-1){
      link = link.split("//")[1]
    }
    return link.split('/');
  },

  //Function: take in 'options' that navigate to an api and return a raw string
  getHttps: function(options, callback){
    var str;
    https.get(options, function(response) {
      str = '';
      response.on('data', function (chunk) {
        str += chunk;
      });
      response.on('end', function () {
        callback(str);
      });
    });
  },
}
