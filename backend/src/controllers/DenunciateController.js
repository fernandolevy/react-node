const Dev = require("../models/Dev");

module.exports = {
  async store(req, res) {
    const { commentid } = req.headers;
    const { devId } = req.params;
    var cont = 0;
    const loggedDev = await Dev.findById(devId);

    for (x of loggedDev.comments) {
      if (String(x._id) == String(commentid)) {
        loggedDev.comments[cont].banned = true;
        break;
      }
      cont++;
    }
    await loggedDev.save();

    const users = await Dev.aggregate([
      { $unwind: "$comments" },
      { $match: { "comments.banned": false } },
      { $sort: { "comments.ranking": -1 } }
    ]);
    return res.json(users);
  }
};
