/*jslint node: true */
'use strict';

exports.removeComparison = function(req, res) {
  var models = req.app.get('models'),
    sequelize = models.sequelize,
    hash = req.params.hash,
    userId = parseInt(req.params.userId, 10),
    comparisonId;
    var chainer = new require('sequelize').Utils.QueryChainer();

// TODO: Refactor to take better advantage of associations?
  sequelize
    .sync()
    .then(function(){
      return models.Comparison.find({ where: {hash: hash, UserId: userId} });
    })
    
    // .then(function(comparison){
    //   comparisonId = comparison.id;
    //   models.Comparison.destroy({ id: comparisonId, UserId: userId });
    // })
    // .then(function(){
    //   models.Subject.destroy({ ComparisonId: comparisonId });
    // })
    // .then(function(){
    //   models.Criterion.destroy({ ComparisonId: comparisonId });
    // })
    // .then(function(){
    //   models.Score.destroy({ ComparisonId: comparisonId });
    // })
    // .then(function(){
    //   models.Vote.destroy({ ComparisonId: comparisonId });
    // })
    // .then(
    //   function(){
    //     res.send(204);
    //   },
    //   function(error){
    //     res.send(500, error);
    //   }
    // );

    .then(function(comparison){
      console.log(comparison.id);
      comparisonId = comparison.id;
      chainer
        .add(models.Comparison.destroy({ id: comparisonId, UserId: userId }))
        .add(models.Subject.destroy({ ComparisonId: comparisonId }))
        .add(models.Criterion.destroy({ ComparisonId: comparisonId }))
        .add(models.Score.destroy({ ComparisonId: comparisonId }))
        .add(models.Vote.destroy({ ComparisonId: comparisonId }))
        .run()
        .success(function(){
          res.send(204);
        })
        .error(function(err){
          res.send(500, 'Failed to delete comparison.');
        });
    });
};
