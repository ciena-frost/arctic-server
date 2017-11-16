var express = require('express'),
    Promise = require('promise'),
    MongoClient = require('mongodb').MongoClient,
    url = 'mongodb://localhost:27017/ArcticDemo',
    database = null;

module.exports = {
  connectDb: function(callback){
    if(database){
      callback(database)
    }else{
      console.log('[MongoDB] Established Connection');
      MongoClient.connect(url, function(err, db) {
        if(err){
          throw err
        }else{
          database = db
          callback(database)
        }
      })
    }
  },

  closeDb: function(dbs){
    dbs.close();
  },

  find: function(db, col, property, query, callback){
    db.collection(col).find({[property] : query}).toArray().then(function(data){
      callback(data);
    })
  },

  findId: function(db, col, input, callback){
    db.collection(col).find({'_id' : input}).toArray().then(function(data){
      callback(data);
    })
  },

  findLtsCompliant: function(db, callback){
    db.collection('relationships').find({'ltsCompliant' : true}).toArray().then(function(data){
      db.collection('relationships').find({'ltsCompliant' : false}).toArray().then(function(data2){
        callback(data.concat(data2));
      })
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
    db.collection(col).insertOne(item)
    callback(item)
  },

  saveArray: function(db, col, arr, callback){
    for(var i = 0; i < arr.length; i++){
      item = db.collection(col).insertOne(arr[i]);
    }
    callback(arr)
  },

}
