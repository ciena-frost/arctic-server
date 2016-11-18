module.exports = {
  create: function(dependency, theVersion){
    var theId = dependency + "@" + theVersion
    return({
      _id: theId,
      type: 'dependency',
      name: dependency,
      version: theVersion,
      ltsCompliant: undefined
    });

  },
  createJson: function(doc){
    return({
      id: doc._id,
      type: doc.type,
      attributes: {name: doc.name, version: doc.version, compliant: doc.ltsCompliant },
    })
  }

}
