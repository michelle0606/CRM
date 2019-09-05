'use strict';
module.exports = (sequelize, DataTypes) => {
  const MailTemplate = sequelize.define('MailTemplate', {
    title: DataTypes.STRING,
    message: DataTypes.STRING,
    image: DataTypes.STRING
  }, {});
  MailTemplate.associate = function(models) {
    // associations can be defined here
  };
  return MailTemplate;
};