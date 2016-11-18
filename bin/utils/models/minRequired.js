module.exports = {
  create: function(data, dependency, ecosystem){
    return({
      _id: dependency,
      type: 'minRequired',
      version: data[dependency],
      ecosystem: ecosystem
    });

  },
  makeJson: function(doc){
    return({
      id: doc._id,
      type: doc.type,
      attributes: {},
    })
  }
}
