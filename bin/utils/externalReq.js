var sourceInterface = require('./sourceInterface.js'),
    RegClient = require('npm-registry-client'),
    client = new RegClient(),
    uri = "https://registry.npmjs.org/",
    params = {timeout: 1000};

module.exports = {
  //Function: Will take a Link to a repositories and return the packaged repository
  getRepositoryData: function(link, callback){
    var source = sourceInterface.getSource(link)
    if(!source){return null}
    var options = source.getFileOptions(link,'package.json')

    sourceInterface.getHttps(options, function(data){
      if(data){
        data = source.parsePack(data)
      }
      if(data){
        var repository = source.createRepo(data, link, options.path),
            version = source.createVersion(data),
            dependencies  = source.createDependencies(data)
        callback(repository,version,dependencies)
      }else{
        callback(null,null,null)
      }
    })
  },

  getRepositoryLink: function(name, callback){
    client.get(uri + name, params, function (error, data, raw, res) {
      if(!error){
        callback(data.repository.url.replace('.git','').replace('git+',''))
      }else{
        callback(null)
      }
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

  getLtsJson: function(link, callback){
    var source = sourceInterface.getSource(link)
    if(!source){return null}

    var lts = source.getFileOptions(link, 'lts.json')
    var eco = source.getFileOptions(link)

    sourceInterface.getHttps(lts, function(ltsList){
      sourceInterface.getHttps(eco, function(ecosystem){
        ltsList = source.parsePack(ltsList)
        ltsName = JSON.parse(ecosystem).name

        if(ltsList){
          callback(ltsName, ltsList)
        }else{
          callback(null)
        }
      })
    })
  }
}
