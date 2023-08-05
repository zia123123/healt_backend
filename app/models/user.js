
"use strict";
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    "user",
    {
      phone_number: {
        type: DataTypes.STRING,
        unique: true
      },
    },
    {
      tableName: "users",
    }
  );
  user.associate = function (models) {
    user.hasMany(models.answer, { foreginKey: "user" });
  };
  return user;
};
