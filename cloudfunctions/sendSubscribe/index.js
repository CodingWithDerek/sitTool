// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  return await cloud.openapi.subscribeMessage.send({
    touser: event.openid,
    page: 'pages/person/myInterview',
    data: {
      thing4: {
        value: event.info
      },
      time3: {
        value: event.sentApplyersTime
      }
    },
    templateId: 'IWuRiPxhYaRciLvy3S1h6WlHYYfSvWb0FQdj0qqncv0',
  })
}