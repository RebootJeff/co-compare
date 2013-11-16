'use strict';

// TODO: make this DRYer
var config;
if(process.env.NODE_ENV === 'production'){
  config = require('../config_production');
} else {
  config = require('../config_dev');
}

// DATABASE
var Sequelize = require('sequelize');
var sequelize = new Sequelize(config.db.name, config.db.username,
  config.db.password, config.db.options);

// DATABASE TABLES (Models)
var Comparison = sequelize.define('Comparison', {
  name: Sequelize.STRING,
  hash: Sequelize.STRING
});
var Subject = sequelize.define('Subject', {
  name: Sequelize.STRING,
  description: Sequelize.STRING,
  index: Sequelize.INTEGER
});
var Criterion = sequelize.define('Criterion', {
    name: Sequelize.STRING,
    description: Sequelize.STRING,
    index: Sequelize.INTEGER
  },{
    freezeTableName: true,
    tableName: 'Criteria'
  });
var Score = sequelize.define('Score', {
  name: Sequelize.STRING,
  description: Sequelize.STRING,
  points: Sequelize.INTEGER
});
var Vote = sequelize.define('Vote', {
  value: Sequelize.INTEGER,
  name: Sequelize.STRING
});
var User = sequelize.define('User', {
  fbId: Sequelize.STRING,
  name: Sequelize.STRING
});

// ASSOCIATIONS
Comparison.belongsTo(User);
Subject.belongsTo(Comparison);
Criterion.hasMany(Vote)
         .belongsTo(Comparison);
Score.belongsTo(Criterion)
     .hasMany(Vote)
     .belongsTo(Comparison);
Vote.belongsTo(Score)
    .belongsTo(Comparison)
    .belongsTo(User);
User.hasMany(Comparison)
    .hasMany(Vote);

module.exports = {
  Sequelize: Sequelize,
  sequelize: sequelize,
  Comparison: Comparison,
  Subject: Subject,
  Criterion: Criterion,
  Score: Score,
  Vote: Vote,
  User: User
};
