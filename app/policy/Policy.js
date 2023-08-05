const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth");
const { user } = require("../models/index");

module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(401).json({ message: "you dont have access!" });
  } else {
    let token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, authConfig.secret, (err, decoded) => {
      if (err) {
        res.status(401).json({ message: "Token Times Up" });
      } else {
        user
          .findByPk(decoded.user.id)
          .then((user) => {
            req.user = user;
            next();
          })
          .catch((err) => {
            res.status(401).json({ message: "you dont have access!" });
          });
      }
    });
  }
};
