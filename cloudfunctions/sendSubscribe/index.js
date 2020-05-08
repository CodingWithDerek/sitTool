// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  return await cloud.openapi.subscribeMessage.send({
    touser: event.openid,
    page: 'pages/person/myInterview',
    data: {
      thing3: {
        value: "您申请的面试信息已发生更改，请注意查看"
      },
      phrase2: {
        value: event.companyName
      }
    },
    templateId: 'H9oeXwgzNaiub038QJ1rSb1L7V_I6H5HOhVU6VMxaRc',
  })
}