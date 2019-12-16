require("dotenv").config();

const express = require("express");
const DevController = require("./controllers/DevController");
const CommentController = require("./controllers/CommentController");
const LikeController = require("./controllers/LikeController");
const DislikeController = require("./controllers/DislikeController");
const DenunciateController = require("./controllers/DenunciateController");
const PostController = require("./controllers/PostController");
const ProfileController = require("./controllers/ProfileController");

const routes = require("express").Router();
const multer = require("multer");
const multerConfig = require("./config/multer");

const Post = require("./models/Post");

routes.get("/devs", DevController.index);
routes.post("/devs", DevController.store);

routes.get("/devs/:devId/:position", PostController.index);
routes.post("/devs/:devId/likes", LikeController.store);
routes.post("/devs/:devId/denunciate", DenunciateController.store);
routes.post("/devs/:devId/comments", CommentController.store);
routes.post("/devs/:devId/dislikes", DislikeController.store);

routes.get("/devs/:devId/posts", ProfileController.index);

routes.post(
  "/devs/:devId/posts",
  multer(multerConfig).single("file"),
  ProfileController.store
);

module.exports = routes;
