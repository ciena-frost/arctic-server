var repoModel = require('./models/repository.js'),
    versionModel = require('./models/version.js'),
    depModel = require('./models/dependency.js'),
    minRequiredModel = require('./models/minRequired.js'),
    internalRequest = require('./internalReq.js'),
    externalRequest = require('./externalReq.js');

module.exports = {
  //Function: Will take a Link to a repositories and return the packaged repository
  getNewRepository: function(link,callback){
    externalRequest.getRepositoryData(link, function(repository,version,dependencies){
      if(repository){
        internalRequest.saveRepository(repository, version, dependencies, function(){
        })
        repository ? repository = repoModel.createJson(repository) : repository
        callback(repository)
      }else{
        //console.log('Unable to add: ' + link);
        callback()
      }
    })
  },

  //Function: Will take a name of a dependency or repository and return the packaged repository
  getRepository: function(name, callback){
    internalRequest.findItem(name, 'repositories', function(data){
      if(data.length > 0){
        callback(repoModel.createJson(data[0]))
      }else{
        externalRequest.getRepositoryLink(name, function(link){
          if(link){
            module.exports.getNewRepository(link,function(repo){callback(repo)})
          }else{
            callback(null)
          }
        })
      }
    })
  },
  saveLtsList: function(link, callback){
    externalRequest.getLtsJson(link, function(ecosystem, ltsList){
      console.log(ecosystem, ltsList);
      for(dependency in ltsList){
        temp = minRequiredModel.create(ltsList, dependency, ecosystem)
        console.log(temp);
        internalRequest.saveItem(temp, 'minRequired', function(data){callback(true)})
      }
    })
  },

  getDashboard: function(callback){
    internalRequest.getLtsCompliant(function(data){
      callback(data)
    })
  },

  getVersion: function(versionName, callback){
    internalRequest.findItem(versionName, 'versions', function(data) {
      data = versionModel.createJson(data[0])
      callback(data);
    });
  },

  getDependency: function(depName, callback){
    internalRequest.findItem(depName, 'dependencies', function(data) {
      callback(depModel.createJson(data[0]));
    });
  },

  getIsDependency: function(id, callback){
    var regex = { $regex : '@' + id + '$'}
    internalRequest.findItem(regex, 'relationships', function(isdependencies){
      var dependencies = []
      for(var i = 0; i<isdependencies.length; i++){
        dependencies.push({type:'repository', id: isdependencies[i].repository, dependency:isdependencies[i].dependency })
      }
      callback({'id': id, 'type': 'isdependency', 'relationships': {'isdependencies': {'data': dependencies}}})
    })
  },

  getAllDependencies: function(type,callback){
    internalRequest.getAll('dependencies', function(data){
      for(var i = 0; i<data.length; i++){
          data[i] = depModel.createJson(data[i])
      }
      callback(data)
    })
  },

  getAllVersions: function(callback){
    internalRequest.getAll('versions', function(data){
      for(var i = 0; i<data.length; i++){
          data[i] = versionModel.createJson(data[i])
      }
      callback(data)
    })
  },

  getAllRepositories: function(callback){
    internalRequest.getAll('repositories', function(data){
      for(var i = 0; i<data.length; i++){
          data[i] = repoModel.createJson(data[i])
      }
      callback(data)
    })
  },

  getAllRepos: function(orgInfo){
    externalRequest.getRepositoryLinkArray(orgInfo.source, orgInfo.name, function(linkArray){
      for(var i = 0;i<linkArray.length;i++){
        module.exports.getNewRepository(linkArray[i], function(data){
        })
      }
    })
  },

}
