var sourceInterface = require('./sourceInterface.js'),
    RegClient = require('npm-registry-client'),
    client = new RegClient(),
    uri = "https://registry.npmjs.org/",
    params = {timeout: 1000};

module.exports = {
  //Function: Will take a Link to a repositories and return the packaged repository
  getRepositoryData: function(link, callback){
    var source = sourceInterface.getSource(link),
        options = source.getOptions(link)

    sourceInterface.getHttps(options, function(data){
      var data = source.parsePack(data)
      if(!data){return(null)}
      var repository = source.createRepo(data, link, options.path),
          version = source.createVersion(data),
          dependencies  = source.createDependencies(data)

      callback([repository,version,dependencies])
    })
  },

  getRepositoryLink: function(name, callback){
    client.get(uri + name, params, function (error, data, raw, res) {
      callback(data.repository.url.replace('.git',''));
    })
  },

  getRepositoryLinkArray: function(source, name, callback){
    var source = sourceInterface.getSoureOrg(source),
        options = source.getOptionsOrg(name)

    sourceInterface.getHttps(options, function(data){
      data = source.getRepositoryArray(data)
      for(var i = 0;i<data.length;i++){
        data[i] = source.getRepositoryUrl(data[i])
      }
      callback(data)
    })
  },
}
