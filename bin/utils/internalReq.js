var dbManager = require('./dbManager.js'),
    config = require('../config.json');

module.exports = {
  //Function: Will take a Link to a repositories and return the packaged repository
  saveRepository: function(repository, version, dependencies){
    dbManager.saveItem(repository, 'repositories', function(){
      dbManager.saveItem(version, 'versions', function(){
        dbManager.saveArray(dependencies, 'dependencies', function(){
          for(var i = 0; i< dependencies.length; i++){
            var newRelationship = {'_id': repository._id + '@' + dependencies[i].name,
                                   'repository': repository._id,
                                   'dependency': dependencies[i]._id}
            dbManager.saveItem(newRelationship, 'relationships', function(){})
          }
        })
      })
    })
  },

  findItem: function(name,type,callback){
    dbManager.findItem(name, type, function(data){
      callback(data)
    })
  },

  getRelationships: function(name, callback){
    dbManager.findItem({ $regex : '@' + name + '$'}, 'relationships', function(isdependencies) {
      callback(isdependencies)
    });
  },

  getAll: function(collection, callback){
    dbManager.findAll(collection, function(data){
      callback(data)
    })
  },
}
