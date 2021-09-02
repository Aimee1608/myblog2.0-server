const Love = require('../model/love');
const { getLogId } = require('../utils/user');
const { decodeToken } = require('../utils/token');

class loveController {
  static async add(ctx) {
    let userId = '游客';
    const userInfo = decodeToken(ctx);
    if (userInfo) {
      userId = userInfo.userId;
    }
    const logId = getLogId(ctx);
    console.log('logId', logId);
    const logItem = await Love.findOne({ logId });
    if (logItem) {
      console.log('logItem---', logItem);
      ctx.data({ data: { status: -1 } });
    } else {
      await new Love({
        userId,
        logId
      }).save();
      ctx.data({ data: { status: 1 } });
    }
  }
}
module.exports = loveController;
