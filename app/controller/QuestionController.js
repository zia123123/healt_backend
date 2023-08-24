const { question,title,answer } = require("../models/index");
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {
  //create
  async create(req, res, next) {
    let result = await question
      .create({
        question: req.body.question,
        titleId : req.body.titleId
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
    let result = await question.findOne({
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

  //findAll
  async index(req, res, next) {
    
    let type_data = req.query.type;
    if (type_data == null) {
      type_data = "collection";
    }
    let query = {}
    if(req.query.titleId){
        query.titleId = req.query.titleId
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
      const countData = await question.count({
       
      });
      let result = await question
        .findAll({

          where: query,
          include: [
            {
                model: title,
                as: "title",
                attributes: {
                    exclude: ["createdAt", "updatedAt"],
                },
            },
            {
                model: answer,
                attributes: {
                    exclude: ["createdAt", "updatedAt","id","questionId","userId"],
                },
                where: {
                    userId: req.user.id,
                },
                required: false,
              },
              
        ],
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
            console.log(err);
          next({ name: `DATA_NOT_FOUND` });
        });
    } else if (type_data == "collection") {
      const countData = await question.count({
      });
      let result = await question
        .findAll({
            where: query,
            include: [
                {
                    model: title,
                    as: "title",
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                },
            ],
          order: [["id", "ASC"]],
        })
        .then((result) => {
        let check_answer = result.map((item) => {
            let check = answer.findone({
                where: {
                    questionId: item.id,
                    userId: req.user.id,
                },
            });
            if(check){
                item.dataValues.answer = check.answer;
            }else{
                item.dataValues.answer = null;
            }
        });
    
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

  // Update
  async update(req, res, next) {
    let result = await question
      .findOne({
        where: {
          id: req.params.id,
        },
      })
      .then((result) => {
        (result.question = req.body.question),
        (result.titleId = req.body.titleId),
          result.save().then((results) => {
            return apiResponse.successResponseWithData(res, "SUCCESS", results);
          });
      })
      .catch(function (err) {
        consolel.log(err);
        next({ name: `DATA_NOT_FOUND` });
      });
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
