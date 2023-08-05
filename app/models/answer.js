
"use strict";
module.exports = (sequelize, DataTypes) => {
  const answer = sequelize.define(
    "answer",
    {
      answer : { 
        type: DataTypes.INTEGER
      },
    },
    {
      tableName: "answers",
    }
  );
  answer.associate = function (models) {
    answer.belongsTo(models.user, { foreginKey: "userId" });
    answer.belongsTo(models.question, { foreginKey: "questionId" });
  };
  return answer;
};
