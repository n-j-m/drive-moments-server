var Firebase = require("firebase");
var Promise = require("es6-promise").Promise;

var toArray = require("./utils").toArray;

var momentsRef = new Firebase("https://jameson-moments.firebaseio.com/");

var db = {
  get: function(/*...path*/) {
    var path = toArray(arguments);
    return new Promise(function executor(resolve, reject) {
      momentsRef.child(path.join("/"))
        .once(
          "value",
          function(snap) {
            resolve(snap.val());
          },
          reject
        );
    });
  },

  set: function(/*value, ...path*/) {
    var path = toArray(arguments);
    var val = path.shift();
    return new Promise(function executor(resolve, reject) {
      momentsRef.child(path.join("/")).set(val, function(err) {
        if (err) {
          reject(err);
        }
        else {
          resolve(val);
        }
      });
    });
  },

  remove: function(/*...path*/) {
    var path = toArray(arguments);
    return new Promise(function executor(resolve, reject) {
      momentsRef.child(path.join("/")).remove(function(err) {
        if (err) {
          reject(err);
        }
        else {
          resolve();
        }
      });
    });
  }
};

module.exports = db;
