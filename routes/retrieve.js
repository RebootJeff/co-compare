/*jslint node: true */
'use strict';

exports.retrieve = function(req, res) {
  var models = req.app.get('models'),
    sequelize = models.sequelize,
    Sequelize = models.Sequelize,
    responseData = {},
    hash = req.params.hash,
    userId = req.params.userId,
    comparisonId;

// TODO: Consider using `include` and/or `Sequelize.Utils.QueryChainer` and/or
// getters from object associations (e.g., `score.getVotes()`).

  sequelize
    .sync()
    .then(function(){
      return models.Comparison.find({ where: {hash: hash} });
    })
    .then(function(comparison){
      console.log('step1: comparison.UserId',comparison.UserId);
      responseData.isAdmin = (comparison.UserId.toString() === userId);
      responseData.title = comparison.name;
      responseData.comparisonId = comparison.id;
      comparisonId = comparison.id;
      return models.Subject.findAll({ where: {ComparisonId: comparisonId} });
    })
    .then(function(subjects){
      console.log('step2: subjects.length',subjects.length);
      responseData.subjects = Sequelize.Utils._.map(subjects, function(subject){
        return {
          name: subject.name,
          description: subject.description,
          id: subject.id,
          index: subject.index
        };
      });
      return models.Criterion.findAll({ where: {ComparisonId: comparisonId} });
    })
    .then(function(criteria){
      console.log('step3: criteria.length',criteria.length);
      responseData.criteria = Sequelize.Utils._.map(criteria, function(criterion){
        return {
          name: criterion.name,
          description: criterion.description,
          id: criterion.id,
          index: criterion.index
        };
      });
      return models.Score.findAll({ where: {ComparisonId: comparisonId} });
    })
    .then(function(scores){
      console.log('step4: scores.length',scores.length);
      responseData.scores = Sequelize.Utils._.map(scores, function(score){
        return {
          name: score.name,
          description: score.description,
          subjectId: score.SubjectId,
          criterionId: score.CriteriumId
        };
      });
      return models.Vote.findAll({ where: {ComparisonId: comparisonId} });
    })
    .then(function(votes){
      console.log('step5: votes.length',votes.length);
      responseData.votes = Sequelize.Utils._.map(votes, function(vote){
        return {
          value: vote.value,
          name: vote.name,
          userId: vote.UserId
        };
      });
      res.send(200, responseData);
    },
    function(err){
      console.log('NOTHING FOUND FROM DB - Error:',err);
      res.send(404, err);
    });

};
