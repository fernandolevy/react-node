const Dev = require("../models/Dev");

module.exports = {
  async store(req, res) {
    const { comment } = req.headers;
    const { devId } = req.params;

    const loggedDev = await Dev.findById(devId);

    loggedDev.comments.push({
      comment: comment,
      likes: 0,
      dislikes: 0,
      ranking: 0
    });

    await loggedDev.save();

    return res.json(loggedDev);
  }
};
