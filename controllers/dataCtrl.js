var request = require('request');
var q = require('q');
var _ = require('lodash');
var util = require('./utilCtrl.js');

var dataURL = "http://www.uni-ulm.de/mensaplan/mensaplan_json.php";


exports.init = function() {
  var deferred = q.defer();

  fetchData()
    .then(function(mensaplan) {

      return sanitizeJSON(mensaplan);

    }).then(function(mensaplanJSON) {

      return getMensaDay(mensaplanJSON);

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
      deferred.reject(err);
    } else {
      deferred.resolve(data.body);
    }
  });

  return deferred.promise;
};

var sanitizeJSON = function(mensaplan) {
  var deferred = q.defer();

  // Del first and both last letters ();
  mensaplan = JSON.stringify(mensaplan.substring(1, mensaplan.length-2));


  // Remove terrible '@attributes' XML practise
  var mensaplanSplit = mensaplan.split('@');

  mensaplanSplit[0] = mensaplanSplit[0].substring(0, mensaplanSplit[0].length-3);

  for(var i = 0; i < mensaplanSplit.length; i++) {
    if(mensaplanSplit[i].indexOf('attributes') !== -1 && i !== mensaplanSplit.length-1) {
      mensaplanSplit[i] = mensaplanSplit[i].substring(13, mensaplanSplit[i].length-3);
    } else if(i === mensaplanSplit.length-1) {
      mensaplanSplit[i] = mensaplanSplit[i].substring(13, mensaplanSplit[i].length);
    }

    var bracketFirst = mensaplanSplit[i].indexOf('}');

    if(bracketFirst !== -1) {
      mensaplanSplit[i] = mensaplanSplit[i].replace('}', '');
    }
  }

  // Back to String
  mensaplan = mensaplanSplit.join('');

  // get rid of escapes
  mensaplan = mensaplan.split('\\"').join('"');
  
  // get rid of "json"
  mensaplan = mensaplan.substring(1, mensaplan.length-1);

  deferred.resolve(JSON.parse(mensaplan));

  return deferred.promise;
};

var getMensaDay = function(mensaplan) {
  var deferred = q.defer();
  var days = [];

  for(var i = 0; i < mensaplan.week.length; i++) {
    days = days.concat(mensaplan.week[i].day);
  }

  deferred.resolve(_.where(days, {date: util.getTodayString()})[0]);

  return deferred.promise;
};

var adjustDayToModel = function(day) {
  var deferred = q.defer();

  for(var i = 0; i < day.meal.length; i++) {
    day.meal[i].id = i;
    day.meal[i].upvotes = 0;
    day.meal[i].downvotes = 0;
  }

  deferred.resolve(day);

  return deferred.promise;
};