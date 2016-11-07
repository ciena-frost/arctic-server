var express = require('express'),
    config = require("../config"),
    database = require(config.database)

module.exports = {
  //Function: Returns array of all projects
  findAllProject: function(){
  },

  //Function: Returns project with "id"
  findProject: function(id){
  },

  //Function: Returns array of all repositories
  findAll: function(type,callback){
    database.connectDb(function(db){
      database.findAll(db, type, function(data){
        database.closeDb(db);
        callback(data);
      })
    })
  },

  findArray: function(arr, type, callback){
    database.connectDb(function(db){
      database.findArr(db, type, arr, function(data){
        database.closeDb(db);
        callback(data)
      })
    })
  },

  //Function: returns first repository thats id matches "input"
  findItem: function(input, type, callback){
    database.connectDb(function(db){
      database.find(db, type, input, function(data){
        database.closeDb(db);
        callback(data);
      })
    })
  },

  findIsDependency: function(input, type, callback){
    database.connectDb(function(db){
      database.findIsDependency(db, type, input, function(data){
        database.closeDb(db);
        callback(data);
      })
    })
  },

  //Function: Takes repository input and saves it to repository db
  saveItem: function(item, type,callback){
    database.connectDb(function(db){
      database.saveItem(db, type, item, function(data){
        database.closeDb(db);
        callback(data);
      });
    });
  },

  saveArray: function(arr, type,callback){
    database.connectDb(function(db){
      database.saveArray(db, type, arr, function(data){
        database.closeDb(db);
        callback(data);
      });
    });
  },
}
