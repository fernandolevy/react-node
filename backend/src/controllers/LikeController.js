const Dev = require("../models/Dev");

module.exports = {
  async store(req, res) {
    const { commentid } = req.headers;
    const { devId } = req.params;
    var cont = 0;

    const loggedDev = await Dev.findById(devId);

    for (x of loggedDev.comments) {
      if (String(x._id) == String(commentid)) {
        loggedDev.comments[cont].likes += 1;
        loggedDev.comments[cont].ranking =
          loggedDev.comments[cont].likes - loggedDev.comments[cont].dislikes;
        break;
      }
      cont++;
    }

    await loggedDev.save();

    return res.json(loggedDev);
  }
};
