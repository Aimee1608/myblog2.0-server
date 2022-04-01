import {Context} from 'koa';
import Love from '../model/love'
import { decodeToken } from '../utils/token'
import { getLogId } from '../utils/user'
import {DecodeUserType} from './../types/base'

class loveController {
  static async add(ctx:Context) {
    let userId: string|number = '游客';
    const userInfo:DecodeUserType|null = decodeToken(ctx);
    if (userInfo && userInfo.userId) {
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
export default loveController;
