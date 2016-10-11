module.exports = {
  create: function(dependency, theVersion, isdependencyId){
    theVersion = theVersion.replace(/['"^~]+/g, '').replace('.x', '.0').split('|')[0];
    var theId = dependency + "@" + theVersion
    var link = "http://localhost:4500/api/dependencies/" + theId + "/isdependencies"
    return({
      _id: theId,
      type: 'dependency',
      attributes: {
        version: theVersion
      }
    });

  },

}
