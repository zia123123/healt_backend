
"use strict";
module.exports = (sequelize, DataTypes) => {
  const question = sequelize.define(
    "question",
    {
      question : { 
        type: DataTypes.STRING
      },
    },
    {
      tableName: "questions",
    }
  );
  question.associate = function (models) {
    question.belongsTo(models.title, { foreginKey: "titleId" });
    question.hasOne(models.answer, { foreginKey: "question" });  
  };
  return question;
};
