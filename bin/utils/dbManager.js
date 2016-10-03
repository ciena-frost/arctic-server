var express = require('express');
var Promise = require('promise');
var MongoClient = require('mongodb').MongoClient;
var config = require("../config");
var database = require(config.database);

module.exports = {
  //Function: Returns array of all projects
  findAllProject: function(){
  },

  //Function: Returns project with "id"
  findProject: function(id){
  },

  //Function: Returns array of all repositories
  findAllRepos: function(callback){
    database.connectDb(function(db){
      database.findAll(db, 'repositories', function(data){
        database.closeDb(db);
        callback(data);
      })
    })
  },

  //Function: returns first repository thats id matches "input"
  findRepository: function(input, callback){
    database.connectDb(function(db){
      database.find(db, 'repositories', input, function(data){
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
}
