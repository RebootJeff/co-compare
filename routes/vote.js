/*jslint node: true */
'use strict';

exports.submit = function(req, res) {
  var models = req.app.get('models'),
    sequelize = models.sequelize,
    statusCode = 204;

// DELETE THIS CONSOLE.LOG() EVENTUALLY --------!
  console.log('INCOMING data',req.body);

// TODO: Current code doesn't check for user authentication
  sequelize
    .sync()
    .then(function(){
      models.Vote.find({where: {
        ComparisonId: req.body.comparisonId,
        UserId: req.body.userId,
        name: req.body.name
      }}).success(function(vote){
        if(vote){
          // User has already voted on the given score
          if(vote.value === req.body.value){
            // User is trying to undo their vote
            vote.destroy();
          } else {
            // User wants to switch their vote
            vote.updateAttributes({value: req.body.value});

          }
        } else {
          // User hasn't voted on the given score
          models.Vote.create({
            name: req.body.name,
            ComparisonId: req.body.comparisonId,
            value: req.body.value,
            UserId: req.body.userId
          });
          statusCode = 201;
        }
      });
    })
    .then(
      function(){
        console.log('successfully stored vote\n');
        res.send(statusCode);
      },
      function(error){
        console.log('failed to store vote',error,'\n');
        res.send(400, error);
      }
    );
};
