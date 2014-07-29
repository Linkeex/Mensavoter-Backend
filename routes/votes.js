var dbCtrl = require('../controllers/dbCtrl.js');
var util = require('../controllers/utilCtrl.js');


exports.upvote = function(req, res) {
  var date;

  if(req.params.date === 'today') {
    date = util.getTodayString();
  } else if(util.isValidDate(req.params.date)) {
    date = req.params.date;
  } else {
    res.send(400, 'Date was wrong.');
  }

  dbCtrl.vote('up', req.params.meal, date)
    .then(function(vote) {
      res.send(200, 'Your vote has been counted.');
    }, function(err) {
      res.send(400, err);
    });
};

exports.downvote = function(req, res) {

  var date;

  if(req.params.date === 'today') {
    date = util.getTodayString();
  } else if(util.isValidDate(req.params.date)) {
    date = req.params.date;
  } else {
    res.send(400, 'Date was wrong.');
  }

  dbCtrl.vote('down', req.params.meal, date)
    .then(function(vote) {
      res.send(200, 'Your vote has been counted.');
    }, function(err) {
      res.send(400, err);
    });
};