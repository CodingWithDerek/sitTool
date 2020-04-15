// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  var attributeName = event.attributeName
  if(attributeName=="starArr"){
    return await db.collection(event.collectionName).doc(event._id)
      .update({
        data: {
          starArr: _.push(event.openid)
        }
      })
  }
  if(attributeName=="applyArr"){
    return await db.collection(event.collectionName).doc(event._id)
      .update({
        data: {
          applyArr: _.push(event.applyEach)
        }
      })
  }
}