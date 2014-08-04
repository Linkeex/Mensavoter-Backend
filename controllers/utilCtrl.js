var CronJob = require('cron').CronJob;
var launchCtrl = require('./launchCtrl.js');
var _ = require('lodash');
var ips = {};

exports.initCron = function() {
  var job = new CronJob('00 00 00 * * 1-5', function(){
      launchCtrl.init();
      ips = {};
      console.log('Cron Job done.');
    }, function () {
      console.log('CronJob: Day has been saved.');
    },
    true,
    "Europe/Berlin"
  );

  job.start();
};

exports.getTodayString = function() {
  // js gone totally retard... months from 0 - 11
  var month = new Date().getMonth()+1;
  var day = new Date().getDate();

  if(month < 10) {
    month = '0'+month;
  }

  if(day < 10) {
    day = '0'+day;
  }

  return new Date().getFullYear()+'-'+month+'-'+day;
};

exports.isValidDate = function(dateString) {
  var dateList = dateString.split('-');

  for(var i = 0; i < dateList.length; i++) {
    dateList[i] = parseInt(dateList[i], 10);
  }

  if(dateList[0] >= 2014 && dateList[0] <= 2100 && dateList[1] > 0 && dateList[1] < 13 && dateList[2] > 0 && dateList[2] < 32) {
    if(dateList[1] < 10 && dateString.split('-')[1] !== '0'+dateList[1] || dateList[2] < 10 && dateString.split('-')[2] !== '0'+dateList[2]) {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
};

exports.checkIP = function(req, res, next) {
  console.log(ips);
  console.log(_.contains(ips[req.connection.remoteAddress], req.params.meal));

  if(!ips[req.connection.remoteAddress]) {
    ips[req.connection.remoteAddress] = [req.params.meal];
    next();
  } else {
    if(_.contains(ips[req.connection.remoteAddress], req.params.meal)) {
      res.send(401, 'You have already voted for this today.');
    } else {
      ips[req.connection.remoteAddress].push(req.params.meal);
      next();
    }
  }
};

exports.allowCrossDomain = function(req, res, next) {
  if(req.headers.origin) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
  }
  
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Max-Age", "15");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Content-Type", "application/json; charset=utf-8");
  res.header("Access-Control-Allow-Headers", "accept, origin, withcredentials, x-requested-with, content-type");

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.send(200);
  } else {
    next();
  }
};

exports.checkDate = function(req, res, next) {
  if(req.params.date === 'today') {
    req.params.date = exports.getTodayString();
    next();
  } else if(exports.isValidDate(req.params.date)) {
    next();
  } else {
    res.send(400, 'Date was wrong. YYYY-MM-DD is the right format.');
  }
};