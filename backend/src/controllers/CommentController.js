const Dev = require("../models/Dev");

module.exports = {
  async store(req, res) {
    const { comment } = req.headers;
    const { devId } = req.params;

    const loggedDev = await Dev.findById(devId);
    var position = 0;
    position = Object.keys(loggedDev.comments).length;

    if (position == 0) {
      position = 0;
    }

    loggedDev.comments.push({
      comment: comment,
      position: position,
      likes: 0,
      dislikes: 0,
      ranking: 0,
      banned: false
    });

    await loggedDev.save();

    const users = await Dev.aggregate([
      { $unwind: "$comments" },
      { $match: { "comments.banned": false } },
      { $sort: { "comments.ranking": -1 } }
    ]);
    return res.json(users);
  }
};
