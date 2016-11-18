var express = require('express'),
    config = require("../config"),
    database = require(config.database);
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
        callback(data);
      })
    })
  },

  findLtsCompliant: function(callback){
    database.connectDb(function(db){
      database.findLtsCompliant(db, function(data){
        callback(data)
      })
    })
  },

  findArray: function(arr, type, callback){
    database.connectDb(function(db){
      database.findArr(db, type, arr, function(data){
        callback(data)
      })
    })
  },

  //Function: returns first repository thats id matches "input"
  findItem: function(input, type, callback){
    database.connectDb(function(db){
      database.find(db, type, '_id', input, function(data){
        callback(data);
      })
    })
  },

  findByProperty: function(type, property, query, callback){
    database.connectDb(function(db){
      database.find(db, type, property, input, function(data){
        callback(data);
      })
    })
  },

  findIsDependency: function(input, type, callback){
    database.connectDb(function(db){
      database.findIsDependency(db, type, input, function(data){
        callback(data);
      })
    })
  },

  //Function: Takes repository input and saves it to repository db
  saveItem: function(item, type, callback){
    database.connectDb(function(db){
      database.saveItem(db, type, item, function(data){
        callback(data);
      });
    });
  },

  saveArray: function(arr, type,callback){
    database.connectDb(function(db){
      database.saveArray(db, type, arr, function(data){
        callback(data);
      });
    });
  },
}
