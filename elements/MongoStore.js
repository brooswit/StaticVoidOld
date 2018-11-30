const MongoClient = require('mongodb').MongoClient;
const BaseStore = require('./BaseStore')

module.exports = class MongoStore extends BaseStore {
  constructor (parent, options) {
    super(parent, options)
    
    const {host, port, username, password, database} = options
    

    var host = '127.0.0.1';
    var port = '27017';
     
    var authenticate ='';
    //cloud
    if (cloud) {
     host = 'YOURHOST.mlab.com';
     port = 'YOURPORT';
     authenticate = username & password ? `${username}:${password}`'YOURUSER:YOURPASSWORD@'
    }
     
    var mongodbDatabase = 'world';
     
    // connect string for mongodb server running locally, connecting to a database called test
    var url = 'mongodb://'+authenticate+host+':'+port + '/' + mongodbDatabase;
  }
  async save (collection, key, value) {
    this.data[collection] = this.data[collection] || {}
    this.data[collection][key] = value
  }

  async load (collection, key, optionalDefault) {
    let value = optionalDefault || null
    if (this.data[collection]) {
    }
    this.data[collection] = this.data[collection] || {}
    this.data[collection][key] = value
  }

  async has (collection, key) {
    if (!this.data[collection]) return false
    if (!this.data[collection][key]) return false
    return true
  }
}

var assert = require('assert');
 
var cloud = true;
 
var host = '127.0.0.1';
var port = '27017';
 
var authenticate ='';
//cloud
if (cloud) {
 mongodbHost = 'YOURHOST.mlab.com';
 port = 'YOURPORT';
 authenticate = 'YOURUSER:YOURPASSWORD@'
}
 
var mongodbDatabase = 'world';
 
// connect string for mongodb server running locally, connecting to a database called test
var url = 'mongodb://'+authenticate+mongodbHost+':'+port + '/' + mongodbDatabase;
 
 
// find and CRUD: http://mongodb.github.io/node-mongodb-native/2.0/tutorials/crud_operations/
// aggregation: http://mongodb.github.io/node-mongodb-native/2.0/tutorials/aggregation/
 
MongoClient.connect(url, function(err, db) {
   assert.equal(null, err);
   console.log("Connected correctly to server.");
//var cursor = collection.find({});
    // find top 20 countries by  size
    db.collection('countries').find({},{"sort": [["area",-1]]}).limit(20).toArray(function(err, results){
    console.log("Country One " +JSON.stringify(results[0])); 
    console.log("Name of Country Four " +results[3].name+ " and size: " +results[3].area);
 
      db.close();
      console.log("Connection to database is closed.");
    });
 
}) //connect()