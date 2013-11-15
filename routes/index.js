/*jslint node: true */
'use strict';

exports.browse = function(req, res) {
  var moment = require('moment');
  var models = req.app.get('models');
  var sequelize = models.sequelize;
  var responseData = {
    comparisons: []
  };

  sequelize
    .sync()
    .then(function(){
      return models.Comparison.findAll({limit: 50});
    })
    .then(function(comparisons){
      for(var i = 0; i < comparisons.length; i++){
        var title = comparisons[i].name;
        if(title.length > 50){
          title = title.slice(0,50) + '...';
        }
        responseData.comparisons.push({
          title: title,
          link: '/#/view/' + comparisons[i].hash,
          id: comparisons[i].id,
          createdAt: comparisons[i].createdAt,
          prettyDate: moment(comparisons[i].createdAt).format('MMM DD YYYY')
        });
        // TODO: attach comparison's vote count to responseData
        // models.Vote.findAndCountAll({where: {ComparisonId: comparisons[i].id}})
        //   .success(function(voteCount){
        //     responseData.comparisons[i].voteCount = voteCount;
        //   });
      }
    })
    .then(function(){
      res.send(200, responseData);
    },
    function(err){
      res.send(404, err);
    });
};
