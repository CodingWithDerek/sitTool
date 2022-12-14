// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection(event.collectionName).doc(event._id).update({
    data: {
      starArr: _.pull(event.openid)
    }
  })
}