// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  return await cloud.openapi.subscribeMessage.send({
    touser: event.openid,
    page: 'pages/person/sentJob',
    data: {
      thing1: {
        value: "兼职审核结果"
      },
      phrase2: {
        value: event.content
      }
    },
    templateId: 'NqBtoPiR4u1v0pcuW_7Ygtb0O5o9VJN6JnsJHMgwX6g',
  })
}