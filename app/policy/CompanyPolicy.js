const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth");
const { company } = require("../models/index");

module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(403).json({ message: "you dont have access!" });
  } else {
    let token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, authConfig.secret, (err, decoded) => {
      if (err) {
        res.status(401).json({ message: "Token Times Up" });
      } else {
       if(decoded.company == undefined){
            res.status(403).json({ message: "you dont have access!" });
       }else{
       company
          .findByPk(decoded.company.id)
          .then((company) => {
            req.company = company;
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
