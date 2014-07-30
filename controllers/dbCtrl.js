var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;
var q = require('q');
var conf = require('../config.json');

var connect = function() {
  var deferred = q.defer();

   MongoClient.connect(conf.mongodb.url, function(err, db) {
    if(err) {
      deferred.reject(err);
    } else {
      var collection = db.collection('days');

      deferred.resolve(collection);
    }
  });

  return deferred.promise;
};

exports.saveDay = function(day) {
  var deferred = q.defer();

  connect()
    .then(function(collection) {

      collection.findOne({date: day.date}, function(err, res) {
        if(err) {
          deferred.reject(err);
        } else {
          if(res === null) {
            collection.insert(day, function(err, docs) {
              if(err) {
                deferred.reject(err);
              } else {
                deferred.resolve(docs);
              }
            });
          } else {
            deferred.reject(new Error('Day already in db.'));
          }
        }
      });

  }).fail(function(err) {
    deferred.reject(err);
  });

  return deferred.promise;
};

exports.getDay = function(dateString) {
  var deferred = q.defer();


  connect()
    .then(function(collection) {

      collection.findOne({date: dateString}, function(err, res) {
        if(err) {
          deferred.reject(err);
        } else {
          deferred.resolve(res);
        }
      });
    });

  return deferred.promise;
};

exports.vote = function(vote, mealID, date) {
  var deferred = q.defer();

  connect()
    .then(function(collection) {

      collection.findOne({date: date}, function(err, res) {
        if(err) {
          deferred.reject(err);
        } else {

          if(res !== null) {

            if(res.Mensa.meals[mealID]) {

              if(vote === 'up') {
                res.Mensa.meals[mealID].upvotes += 1;
              } else {
                res.Mensa.meals[mealID].downvotes += 1;
              }

              collection.update({date: date}, res, function(err, docs) {
                if(err) {
                  deferred.reject(err);
                } else {
                  deferred.resolve(docs);
                }
              });

            } else {
              deferred.reject(new Error('Your vote wasnt counted.'));
            }
          }

        }
      });

    }, function(err) {
      deferred.reject(err);
    });

  return deferred.promise;
};