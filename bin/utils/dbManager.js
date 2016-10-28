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
  findAll: function(col,callback){
    database.connectDb(function(db){
      database.findAll(db, col, function(data){
        database.closeDb(db);
        callback(data);
      })
    })
  },

  findArray: function(arr, col, callback){
    database.connectDb(function(db){
      database.findArr(db, col, arr, function(data){
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

  findIsDependency: function(input, col, callback){
    database.connectDb(function(db){
      database.findIsDependency(db, col, input, function(data){
        database.closeDb(db);
        callback(data);
      })
    })
  },

  //Function: Takes repository input and saves it to repository db
  saveItem: function(item, col,callback){
    database.connectDb(function(db){
      database.saveItem(db, col, item, function(data){
        database.closeDb(db);
        callback(data);
      });
    });
  },

  saveArray: function(arr, col,callback){
    database.connectDb(function(db){
      database.saveArray(db, col, arr, function(data){
        database.closeDb(db);
        callback(data);
      });
    });
  },
}
