var request = require('request');
var q = require('q');
var _ = require('lodash');
var util = require('./utilCtrl.js');

var dataURL = "http://www.uni-ulm.de/mensaplan/data/mensaplan.json";


exports.init = function() {
  var deferred = q.defer();

  fetchData()
    .then(function(mensaplanJSON) {
      return getMensaDay(JSON.parse(mensaplanJSON));

    }).then(function(day) {

      return adjustDayToModel(day);

    }).then(function(adjustedDay) {

      deferred.resolve(adjustedDay);

    }).fail(function(err) {
      deferred.reject(err);
      console.error('There went something wrong fetching and processing the mensaplan JSON', err);
    });

  return deferred.promise;
};

var fetchData = function() {
  var deferred = q.defer();

  request(dataURL, function(err, data) {
    if(err) {
      console.error('Something went wrong fetching the mensaplan', err);
      deferred.reject(err);
    } else {
      deferred.resolve(data.body);
    }
  });

  return deferred.promise;
};

var getMensaDay = function(mensaplan) {
  var deferred = q.defer();
  var days = [];

  for(var i = 0; i < mensaplan.weeks.length; i++) {
    days = days.concat(mensaplan.weeks[i].days);
  }

  var day = _.where(days, {date: util.getTodayString()})[0];

  try {
    if(day.Bistro) {
      delete day.Bistro;
    }
    if(day.West) {
      delete day.West;
    }
    if(day.Prittwitzstr) {
      delete day.Prittwitzstr;
    }
  } catch(err) {
    console.error('Error trying to delete other restaurants.', err);
    deferred.reject('There was an error getting the mensa day', err);
  }
  
  deferred.resolve(day);

  return deferred.promise;
};

var adjustDayToModel = function(day) {
  var deferred = q.defer();

  for(var i = 0; i < day.Mensa.meals.length; i++) {
    day.Mensa.meals[i].id = i;
    day.Mensa.meals[i].upvotes = 0;
    day.Mensa.meals[i].downvotes = 0;
  }

  deferred.resolve(day);

  return deferred.promise;
};