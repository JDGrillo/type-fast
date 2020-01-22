'use strict';
module.exports = (sequelize, DataTypes) => {
  const result = sequelize.define('result', {
    user_id: DataTypes.INTEGER,
    correct_words: DataTypes.INTEGER,
    incorrect_words: DataTypes.INTEGER,
    play_time: DataTypes.INTEGER
  }, {});
  result.associate = function(models) {
    // associations can be defined here
  };
  return result;
};