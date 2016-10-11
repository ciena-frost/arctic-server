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

  getRelationships: function(id,array){
    //#todo will outline the
    var theData = []
    for(var i in array){
      var depVersion = JSON.stringify(array[i]).toString().replace(/['"^~]+/g, '').replace('.x', '.0').split('|')[0];
      theData.push({"type": "dependency", "id": i + "@" + depVersion});

    }
    var relationships = {
      dependencies : {data:theData}
    }

    return relationships
  },

}
