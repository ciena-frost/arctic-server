var repoModel = require('./models/repository.js'),
    versionModel = require('./models/version.js'),
    depModel = require('./models/dependency.js'),
    internalRequest = require('./internalReq.js'),
    externalRequest = require('./externalReq.js');

module.exports = {
  //Function: Will take a Link to a repositories and return the packaged repository
  getRepoFromLink: function(link,callback){
    externalRequest.getRepositoryData(link, function(repositoryData){
      internalRequest.saveRepository(repositoryData[0], repositoryData[1], repositoryData[2])
      callback(repoModel.repoJson(repositoryData[0]))
    })
  },

  //Function: Will take a name of a dependency or repository and return the packaged repository
  getRepository: function(name, callback){
    internalRequest.findItem(name, 'repositories', function(data){
      if(data.length === 0){
        name = name.split('@')[0]
        externalRequest.getRepositoryLink(name, function(link){
          module.exports.getRepoFromLink(link, function(repo){
            callback(repo)
          })
        })
      }else{
        callback(data[0])
      }
    })
  },

  getVersion: function(versionName, callback){
    internalRequest.findItem(versionName, 'versions', function(data) {
      callback(versionModel.versionJson(data[0]));
    });
  },

  getDependency: function(depName, callback){
    internalRequest.findItem(depName, 'dependencies', function(data) {
      callback(depModel.dependencyJson(data[0]));
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
          data[i] = depModel.dependencyJson(data[i])
      }
      callback(data)
    })
  },

  getAllRepositories: function(callback){
    internalRequest.getAll('repositories', function(data){
      for(var i = 0; i<data.length; i++){
          data[i] = repoModel.repoJson(data[i])
      }
      callback(data)
    })
  },

  getAllRepos: function(orgInfo){
    externalRequest.getRepositoryLinkArray(orgInfo.source, orgInfo.name, function(linkArray){
      for(var i = 0;i<linkArray.length;i++){
        module.exports.getRepoFromLink(linkArray[i], function(data){})
      }
    })
  },

}
