const Dev = require("../models/Dev");

module.exports = {
  async index(req, res) {
    const { devId, position } = req.params;

    //const loggedDev = await Dev.findById(devId);
    const users = await Dev.aggregate([
      { $unwind: "$comments" },
      { $match: { "comments.banned": false } },
      { $sort: { "comments.ranking": -1 } }
    ]);
    for (x of users) {
      if (x._id == devId) {
        if (x.comments._id == position) {
          res.json(x);
        }
      }
    }
  }
};
