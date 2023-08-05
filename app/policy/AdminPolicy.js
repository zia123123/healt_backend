const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth");
const { admin } = require("../models/index");

module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(403).json({ message: "you dont have access!" });
  } else {
    let token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, authConfig.secret, (err, decoded) => {
      if (err) {
        res.status(401).json({ message: "Token Times Up" });
      } else {
       if(decoded.admin == undefined){
            res.status(403).json({ message: "you dont have access!" });
       }else{
        admin
          .findByPk(decoded.admin.id)
          .then((admin) => {
            req.admin = admin;
            next();
          })
          .catch((err) => {
            res.status(401).json({ message: "you dont have access!" });
        });
    }
      }
    });
  }
};
