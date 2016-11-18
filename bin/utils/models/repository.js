var config = require("../../config");

module.exports = {
  create: function(name, theLink, theVersion, theOrg, theDesc, theVersions, theKeys, wl){
    return({
        _id: name,
        type: 'repository',
        version: theVersion,
        link: theLink,
        organization: theOrg,
        description: theDesc,
        versions: theVersions,
        keywords: theKeys,
        whitelist: wl,
      });
  },

  createJson: function(doc){
    return({
      id: doc._id,
      type: doc.type,
      attributes: {version: doc.version, link: doc.link, organization: doc.organization, description: doc.description, keywords: doc.keywords},
      relationships: {versions: {data: doc.versions}}
    })
  },



}
