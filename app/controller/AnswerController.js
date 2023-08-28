const { answer } = require("../models/index");
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {
  //create
  async create(req, res, next) {

    let check_answer = await answer.findOne({
        where: {
            questionId: req.body.questionId,
            userId : req.user.id
        },
    });
    if(check_answer){
        check_answer.destroy();
    }
    let result = await answer
      .create({
        questionId: req.body.questionId,
        answer : req.body.answer,
        userId : req.user.id
      })
      .then((result) => {
        return apiResponse.successResponseWithData(
          res,
          "SUCCESS CREATE",
          result
        );
      })
      .catch(function (err) {
        console.log(err);
        next({ name: `DATA_NOT_FOUND` });
      });
  },

  //find
  async find(req, res, next) {
    let result = await answer.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!result) {
      return apiResponse.notFoundResponse(res, "Not Fond");
    } else {
      req.result = result;
      next();
    }
  },

   //find
   async check(req, res, next) {
   // count all
    let count = await answer.count({
        where: {
            userId: req.user.id,
        },
    });
    if (!count) {
      return apiResponse.notFoundResponse(res, "Not Fond");
    } else {
      if(count >= 40){
        return apiResponse.successResponse(res, "beres semua");
      }else{
        return apiResponse.notFoundResponse(res, "belum beres semua");
      }
    }
  },

  //findAll
  async index(req, res, next) {
    let type_data = req.query.type;
    if (type_data == null) {
      type_data = "collection";
    }
    if (type_data == "pagination") {
      let page = parseInt(req.query.page);
      let limit = parseInt(req.query.limit);
      if (page.toString() == "NaN") {
        page = 1;
      }
      if (limit.toString() == "NaN") {
        limit = 10;
      }
      const countData = await answer.count({
       
      });
      let result = await answer
        .findAll({
          offset: (page - 1) * limit,
          limit: limit,
          order: [["id", "ASC"]],
        })
        .then((result) => {
          var totalData = parseInt(countData) / limit;
          var totalPage = Math.ceil(totalData);
          returnData = {
            metadata: {
              page: page,
              count: result.length,
              totalPage: parseInt(totalPage),
              totalData: countData,
            },
            result,
          };
          return apiResponse.successResponseWithData(
            res,
            "SUCCESS",
            returnData
          );
        })
        .catch(function (err) {
          next({ name: `DATA_NOT_FOUND` });
        });
    } else if (type_data == "collection") {
      const countData = await answer.count({
      });
      let result = await answer
        .findAll({
          order: [["id", "ASC"]],
        })
        .then((result) => {
          var totalData = parseInt(countData);
          var totalPage = Math.ceil(totalData);
          returnData = {
            metadata: {
              page: 1,
              count: result.length,
              totalPage: parseInt(totalPage),
              totalData: countData,
            },
            result,
          };
          return apiResponse.successResponseWithData(
            res,
            "SUCCESS",
            returnData
          );
        })
        .catch(function (err) {
          next({ name: `DATA_NOT_FOUND` });
        });
    } else {
      next({ name: `DATA_NOT_FOUND` });
    }
  },

 

  // Show
  async show(req, res, next) {
    return apiResponse.successResponseWithData(res, "SUCCESS", req.result);
  },

  // Delete
  async delete(req, res, next) {
    req.result
      .destroy()
      .then((result) => {
        return apiResponse.successResponse(res, "SUCCESS DELETE");
      })
      .catch(function (err) {
        next({ name: `DATA_NOT_FOUND` });
      });
  },
};
