/*jslint node: true */
'use strict';

exports.removeComparison = function(req, res) {
  var models = req.app.get('models'),
    sequelize = models.sequelize,
    hash = req.params.hash,
    userId = parseInt(req.params.userId, 10),
    comparisonId;

// TODO: Refactor to take better advantage of associations?
  sequelize
    .sync()
    .then(function(){
      return models.Comparison.find({ where: {hash: hash, UserId: userId} });
    })
    .then(function(comparison){
      comparisonId = comparison.id;
      models.Comparison.destroy({ id: comparisonId, UserId: userId });
    })
    .then(function(){
      models.Subject.destroy({ ComparisonId: comparisonId });
    })
    .then(function(){
      models.Criterion.destroy({ ComparisonId: comparisonId });
    })
    .then(function(){
      models.Score.destroy({ ComparisonId: comparisonId });
    })
    .then(function(){
      models.Vote.destroy({ ComparisonId: comparisonId });
    })
    .then(
      function(){
        res.send(204);
      },
      function(error){
        res.send(500, error);
      }
    );    
};
