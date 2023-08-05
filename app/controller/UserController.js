const { user } = require("../models/index");
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authConfig = require("../../config/auth");
require("dotenv").config();

module.exports = {
  //find



  async signIn(req, res, next) {
    let { phone } = req.body;

    if (!phone) {
      return apiResponse.validationErrorWithData(
        res,
        "phone or password is empty"
      );
    }
    let users = await user.findOne({
        where: {
            phone_number: phone,
        },
    });
    if(users){
        let token = jwt.sign({ user: users }, authConfig.secret, {
            expiresIn: authConfig.expires,
          });
          res.json({
            status: 200,
            message: "SUCCESS",
            data: users,
            token: token,
          });
       
    }else{
       let users = await user.create({
        phone_number: phone,
        });
        let token = jwt.sign({ user: users }, authConfig.secret, {
            expiresIn: authConfig.expires,
          });
        res.json({
            status: 200,
            message: "SUCCESS",
            data: users,
            token: token,
          });
    }
    
 
  },



  // Show
  async show(req, res, next) {
    return apiResponse.successResponseWithData(res, "SUCCESS", req.result);
  },



  // Delete
  async delete(req, res, next) {
    req.result.destroy().then((result) => {
      res.json({ message: "delete success" });
    });
  },
};
