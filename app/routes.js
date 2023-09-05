const express = require("express");

const router = express.Router();
const UserController = require("./controller/UserController");
const TitleController = require("./controller/TitleController");
const QuestionController = require("./controller/QuestionController");
const AnswerController = require("./controller/AnswerController");



const authtoken = require("./policy/Policy");


router.post(
  "/api/user",
  UserController.signIn
);


    //top product
    router.post("/api/title", TitleController.create);
    router.get('/api/title/',authtoken, TitleController.index);
    router.get('/api/title/:id', TitleController.find, TitleController.show);
    router.patch("/api/title/:id",TitleController.update);
    router.delete('/api/title/:id', TitleController.find,TitleController.delete);

    //top product
    router.post("/api/question", QuestionController.create);
    router.get('/api/question/',authtoken, QuestionController.index);
    router.get('/api/question/:id', QuestionController.find, QuestionController.show);
    router.patch("/api/question/:id",QuestionController.update);
    router.delete('/api/question/:id', QuestionController.find,QuestionController.delete);

     //top product
     router.post("/api/answer",authtoken, AnswerController.create);
     router.get("/api/answer/check",authtoken, AnswerController.check);


module.exports = router;
