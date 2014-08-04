var dbCtrl = require('../controllers/dbCtrl.js');
var util = require('../controllers/utilCtrl.js');


exports.upvote = function(req, res) {
  dbCtrl.vote('up', req.params.meal, req.params.date)
    .then(function(vote) {
      res.send(200, 'Your vote has been counted.');
    }, function(err) {
      res.send(400, err);
    });
};

exports.downvote = function(req, res) {
  dbCtrl.vote('down', req.params.meal, req.params.date)
    .then(function(vote) {
      res.send(200, 'Your vote has been counted.');
    }, function(err) {
      res.send(400, err);
    });
};