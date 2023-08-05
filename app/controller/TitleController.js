const { title } = require("../models/index");
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {
  //create
  async create(req, res, next) {
    let result = await title
      .create({
        name: req.body.name,
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
    let result = await title.findOne({
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
    if (type_data == "pagination") {
      let page = parseInt(req.query.page);
      let limit = parseInt(req.query.limit);
      if (page.toString() == "NaN") {
        page = 1;
      }
      if (limit.toString() == "NaN") {
        limit = 10;
      }
      const countData = await title.count({
       
      });
      let result = await title
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
      const countData = await title.count({
      });
      let result = await title
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

  // Update
  async update(req, res, next) {
    let result = await title
      .findOne({
        where: {
          id: req.params.id,
        },
      })
      .then((result) => {
        (result.name = req.body.name),
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
