module.exports = {
  createRepo: function(theId, theType, theAttributes, theRelationships){
    return({
      _id: theId,
      type: theType,
      attributes: theAttributes,
      relationships: theRelationships
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

  getRelationships: function(array){
    //#todo will outline the
    var theData = []
    for(var i in array){
      var depVersion = JSON.stringify(array[i]).toString().replace(/['"^~]+/g, '');
      theData.push({ "type": "repository" , "_id": i + "@" + depVersion});
    }
    return {
      dependencies : {
        links : {
          self : "http://localhost:4500/api/repositories"
        },
        data: theData
      }
    }
  },

  getIncluded: function(array){
    //#todo will contain all dependencies of the initial repository


  }


}
