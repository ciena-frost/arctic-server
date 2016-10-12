module.exports = {
  create: function(dependency, theVersion, isdependencyId){
    theVersion = theVersion.replace(/['"^~]+/g, '').replace('.x', '.0').split('|')[0];
    var theId = dependency + "@" + theVersion
    return({
      _id: theId,
      type: 'dependency',
      attributes: {
        name: dependency,
        version: theVersion
      }
    });

  },

}
