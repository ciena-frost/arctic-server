var express = require('express'),
    Promise = require('promise'),
    MongoClient = require('mongodb').MongoClient,
    url = 'mongodb://localhost:27017/ArcticDemo'

module.exports = {
  connectDb: function(callback){
    MongoClient.connect(url, function(err, db) {
      callback(db)
    })
  },

  closeDb: function(dbs){
    dbs.close();
  },

  find: function(db, col, input, callback){
    db.collection(col).find({'_id' : input}).toArray().then(function(data){
      callback(data);
    })
  },

  findArr: function(db, col, input, callback){
    db.collection(col).find({'_id' : { $in: input}}).toArray().then(function(data){
      callback(data);
    })
  },

  findAll: function(db, col, callback){
    db.collection(col).find().toArray().then(function(data){
      callback(data)
    })
  },

  findIsDependency: function(db, col, input, callback){
    db.collection(col).find().toArray().then(function(data){
      callback(data);
    })
  },

  saveItem: function(db, col, item, callback){
    item = db.collection(col).insertOne(item);
    callback(item)
  },

  saveArray: function(db, col, arr, callback){
    item = db.collection(col).insertMany(arr);
    callback(arr)
  },

}
