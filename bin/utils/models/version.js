module.exports = {
  create: function(theName, theVersion, theDependencies, theDevDependencies){
    return({
      _id: theName + '@' + theVersion,
      type: 'version',
      name: theName,
      version: theVersion,
      dependencies: theDependencies,
      devdependencies: theDevDependencies,
      repository: {type:'repository', id: theName}
    })
  },
  versionJson: function(doc){
    return({
      id: doc._id,
      type: doc.type,
      attributes: {name: doc.name, version: doc.version},
      relationships: {dependencies:{data: doc.dependencies}, devdependencies:{data: doc.devdependencies}, repository:{data: doc.repository}}
    })
  },

  getDependencies: function(depArray, devArray){
    //#todo will outline the
    var depArr = []
    for(var i in depArray){
      var depVersion = depArray[i]
      depArr.push({"type": "dependency", "id": i + "@" + depVersion});
    }
    var devArr = []
    for(var i in devArray){
      var devVersion = devArray[i]
      devArr.push({"type": "dependency", "id": i + "@" + devVersion});
    }

    return [depArr,devArr]
  },
}
