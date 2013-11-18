/*jslint node: true */
'use strict';

exports.removeComparison = function(req, res) {
  var models = req.app.get('models'),
    sequelize = models.sequelize,
    comparisonId = req.body.comparisonId,
    hash = req.params.hash,
    userId = req.params.userId;

// TODO: Refactor to take better advantage of associations
  // sequelize
  //   .sync()
  //   .success(function(){
  //     return [
  //       models.Comparison.destroy({ id: comparionId, UserId: userId }),


      
  //   })

};
