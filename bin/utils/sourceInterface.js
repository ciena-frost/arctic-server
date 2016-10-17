var express = require('express'),
    https = require('https'),
    RegClient = require('npm-registry-client'),
    client = new RegClient(),
    useGithub = require('./sources/useGithub.js')

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
