module.exports = {
  create: function(theName, theVersion, theDependencies, theDevDependencies){
    return({
      _id: theName + '@' + theVersion,
      type: 'version',
      name: theName,
      version: theVersion,
      dependencies: theDependencies,
      devdependencies: theDevDependencies,
      ltsCompliant: [],
      ltsNonCompliant: {},
      compliantPercent: {},
      repository: {type:'repository', id: theName}
    })
  },
  createJson: function(doc){
    return({
      id: doc._id,
      type: doc.type,
      attributes: {name: doc.name, version: doc.version, compliantpercent: doc.compliantPercent},
      relationships: {dependencies:{data: doc.dependencies},
                      devdependencies:{data: doc.devdependencies},
                      repository:{data: doc.repository},
                      ltsCompliant:{data: doc.ltsCompliant},
                      ltsNonCompliant:{data: doc.ltsNonCompliant}}
    })
  },

  getDependencies: function(depArray, devArray){
    //#todo will outline the
    var ltsCompliant = []
    var depArr = []
    for(var i in depArray){
      depArr.push({"type": "dependency", "id": i + "@" + depArray[i]});
    }
    var devArr = []
    for(var i in devArray){
      devArr.push({"type": "dependency", "id": i + "@" + devArray[i]});
    }

    return [depArr,devArr]
  },
}
