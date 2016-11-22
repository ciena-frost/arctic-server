var dbManager = require('./dbManager.js'),
    config = require('../config.json'),
    semver = require('semver');

module.exports = {
  //Function: Will take a Link to a repositories and return the packaged repository
  saveRepository: function(repository, version, dependencies){
    let newRelationships = []
        for(let i = 0; i<dependencies.length; i++){
          dbManager.findItem(dependencies[i].name, 'minRequired', function(minRequired){
            if(minRequired.length === 1){
              ltsMin = minRequired[0].version
              ltsCompliant = semver.satisfies(dependencies[i].version, ltsMin)
              dependencies[i].ltsCompliant = [ltsCompliant,ltsMin]
              console.log(dependencies[i].ltsCompliant);
              if(ltsCompliant){
                //++ to compiant count for minRequired[0].ecosystem
                version.compliantPercent[minRequired[0].ecosystem] ? (version.compliantPercent[minRequired[0].ecosystem])[0]++ : version.compliantPercent[minRequired[0].ecosystem] = [1,0]
                version.ltsCompliant.push({"type": "dependency", "id": dependencies[i]._id})
              }else{
                version.compliantPercent[minRequired[0].ecosystem] ? (version.compliantPercent[minRequired[0].ecosystem])[1]++ : version.compliantPercent[minRequired[0].ecosystem] = [0,1]
                version.ltsNonCompliant.push({"type": "dependency", "id": dependencies[i]._id})
              }
            }
            var newRelationship = {'_id': repository._id + '@' + dependencies[i].name,
                                   'repository': repository._id,
                                   'version': version.version,
                                   'dependency': dependencies[i]._id,
                                   'ltsMin': ltsMin || null,
                                   'ltsCompliant': ltsCompliant || null
                                 };
            newRelationships.push(newRelationship)
            if(i === dependencies.length -1){
              console.log(version.name, version.compliantPercent);

              dbManager.saveItem(repository, 'repositories', function(){})
              dbManager.saveItem(version, 'versions', function(){})
              dbManager.saveArray(dependencies, 'dependencies', function(){})
              dbManager.saveArray(newRelationships, 'relationships', function(){})
            }
          })
        }
  },

  getLtsCompliant: function(callback){
    dbManager.findLtsCompliant(function(data){
      callback(data)
    })
  },

  saveItem: function(item, type, callback){
    dbManager.saveItem(item,type, function(data){
      callback(data)
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
