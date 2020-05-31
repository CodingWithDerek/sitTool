// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection("jobArr").where({
    _id: event.id,
    canUpdate:true //防止并发操作
  }).update({
    data:{
      agree:true,
      managerInfo:event.managerInfo,
      canUpdate:false
    }
  })
}