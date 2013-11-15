/*jslint node: true */
'use strict';

exports.submit = function(req, res) {
  var models = req.app.get('models');
  var sequelize = models.sequelize;
  var hashFunc = require('crypto').createHash('md5');

// DELETE THIS CONSOLE.LOG() EVENTUALLY --------!
  console.log('INCOMING data',req.body);
  var name = req.body.comparisonName;
  var hash = 'err';

// TODO: Refactor to take better advantage of associations
  sequelize
    .sync()
    .then(function(){
      hash = hashFunc.update(Date.now() + name).digest('hex').slice(0,5);
      return models.Comparison.create({
        name: name,
        hash: hash
      });
    })
    .then(function(comparison){
      var subjects = req.body.subjects;
      for(var i = 0; i < subjects.length; i++){
        models.Subject.create({
          name: subjects[i].name,
          description: subjects[i].description,
          index: subjects[i].index,
          ComparisonId: comparison.id
        });
      }
      return comparison;
    })
    .then(function(comparison){
      var criteria = req.body.criteria;
      for(var i = 0; i < criteria.length; i++){
        models.Criterion.create({
          name: criteria[i].name,
          description: criteria[i].description,
          index: criteria[i].index,
          ComparisonId: comparison.id
        });
      }
      return comparison;
    })
    .then(function(comparison){
      var scores = req.body.scores;
      for(var key in scores){
        models.Score.create({
          description: scores[key].description,
          name: key,
          ComparisonId: comparison.id,
          points: 0
        });
      }
    })
    .then(
      function(){
        res.send(201, {hash: hash});
      },
      function(error){
        res.send(400, error);
      }
    );
};