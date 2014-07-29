var CronJob = require('cron').CronJob;
var _ = require('lodash');
var ips = {};

exports.initCron = function() {
  var job = new CronJob('00 30 11 * * 1-5', function(){
    console.log('runs');
  }, function () {
    console.log('runs');
  },
  true
  );

  job.start();
};

exports.getTodayString = function() {
  // js gone totally retard... months from 0 - 11
  var month = new Date().getMonth()+1;

  if(month < 10) {
    month = "0"+month;
  }

  return new Date().getFullYear()+'-'+month+'-'+new Date().getDate();
};

exports.isValidDate = function(dateString) {
  var dateList = dateString.split('-');

  for(var i = 0; i < dateList.length; i++) {
    dateList[i] = parseInt(dateList[i], 10);
  }

  if(dateList[0] >= 2014 && dateList[0] <= 2100 && dateList[1] > 0 && dateList[1] < 13 && dateList[2] > 0 && dateList[2] < 32) {
    return true;
  } else {
    return false;
  }
};

exports.checkIP = function(req, res, next) {
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