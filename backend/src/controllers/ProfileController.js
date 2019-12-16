const axios = require("axios");
const Dev = require("../models/Dev");

module.exports = {
  async index(req, res) {
    const posts = await Post.find();

    return res.json(posts);
  },

  async store(req, res) {
    const { originalname: name, size, key, location: url = "" } = req.file;
    const { devId } = req.params;
    console.log(url);

    const posts = await Dev.findById(devId);
    posts.avatar = url;
    // const post = await Dev.create({
    //   name,
    //   size,
    //   key,
    //   url
    // });
    posts.save();
    return res.json(posts);
  }
};
