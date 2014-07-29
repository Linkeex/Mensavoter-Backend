var q = require('q');
var dataCtrl = require('./dataCtrl.js');
var dbCtrl = require('./dbCtrl.js');

exports.init = function() {
  var deferred = q.defer();

  dataCtrl.init()
    .then(function(day) {
      return dbCtrl.saveDay(day);
    }).then(function(res) {
      console.log(res);
    }).fail(function(err) {
      console.error(err);
      deferred.reject(err);
    });

  return deferred.promise;
};