var dbCtrl = require('../controllers/dbCtrl.js');
var util = require('../controllers/utilCtrl.js');

exports.getDay = function(req, res) {
  var date;

  if(req.params.date === 'today') {
    date = util.getTodayString();
  } else if(util.isValidDate(req.params.date)) {
    date = req.params.date;
  } else {
    res.send(400, 'Date was wrong.');
  }

  dbCtrl.getDay(date)
    .then(function(day) {
      res.send(200, day);
    }, function(err) {
      res.send(400, err);
    });
};