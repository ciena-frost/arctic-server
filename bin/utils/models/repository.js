var config = require("../../config");

module.exports = {
  create: function(theId, theType, theAttributes, theRelationships){
    return({
        _id: theId,
        type: theType,
        attributes: theAttributes,
        relationships: theRelationships,
      });
  },

  getId: function(name, version){
    return name + "@" + version;
  },

  getAttributes: function(theName, theSource, theUser, theVersion, theDescription){
    return {
      name: theName,
      source: theSource,
      user: theUser,
      version: theVersion,
      description: theDescription
    }
  },

  getRelationships: function(id,depArray, devArray){
    //#todo will outline the
    var depArr = []
    for(var i in depArray){
      var depVersion = JSON.stringify(depArray[i]).toString().replace(/['"^~]+/g, '').replace('.x', '.0').split('|')[0];
      depArr.push({"type": "dependency", "id": i + "@" + depVersion});
    }
    var devArr = []
    for(var i in devArray){
      var devVersion = JSON.stringify(devArray[i]).toString().replace(/['"^~]+/g, '').replace('.x', '.0').split('|')[0];
      devArr.push({"type": "dependency", "id": i + "@" + devVersion});
    }
    console.log(devArr);
    var relationships = {
      dependencies : {data:depArr},
      devdependencies : {data: devArr}
    }

    return relationships
  },

}
