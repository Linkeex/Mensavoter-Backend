var dbCtrl = require('../controllers/dbCtrl.js');
var util = require('../controllers/utilCtrl.js');

exports.getDay = function(req, res) {
  dbCtrl.getDay(req.params.date)
    .then(function(day) {
      res.send(200, day);
    }, function(err) {
      res.send(400, err);
    });
};