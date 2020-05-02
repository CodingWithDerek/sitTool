//app.js
App({
  onLaunch: function() {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'sittool-sccwy',
        traceUser: true,
      })
      this.globalData = {}
      // this.showDialog()
      wx.getStorage({
        key: 'openid',
        success(res) {
          console.log(res.data)
        },
        fail(err) {
          wx.cloud.callFunction({
            name: 'getOpenid'
          }).then(res => {
            wx.setStorage({
              key: "openid",
              data: res.result.openid
            })
          }).catch(console.err)
        }
      })
    }
  },
  showDialog: function() {
    wx.showModal({
      content: '请点击确定按钮当您被提及的时候给您发送通知消息',
      showCancel: false,
      success(res) {
        if (res.confirm) {
          wx.requestSubscribeMessage({
            tmplIds: ['-W2Q06WDJyuYjFjN4zaVGkvigMkVGwASbh9JttbMA-M',
              'NqBtoPiR4u1v0pcuW_7Ygtb0O5o9VJN6JnsJHMgwX6g'
            ],
            success(res) {
              console.log(res)
            },
            fail(err) {
              console.log(err)
            }
          })
        }
      }
    })
  },
  createTime: function() {
    var date = new Date()
    var year = date.getFullYear()
    var month = date.getMonth()
    month = month + 1
    var day = date.getDate()
    var h = date.getHours()
    var m = date.getMinutes()
    var s = date.getSeconds()
    var ms = date.getMilliseconds()
    if (month < 10) month = "0" + month
    if (h < 10) h = "0" + h
    if (m < 10) m = "0" + m
    if (s < 10) s = "0" + s
    var time = year + "-" + month + "-" + day + " " + h + ":" +
      m + ":" + s + ":" + ms
    return time
  },
  getRandom: function() {
    var date = new Date()
    var year = date.getFullYear()
    var month = date.getMonth()
    month = month + 1
    var day = date.getDate()
    var h = date.getHours()
    var m = date.getMinutes()
    var s = date.getSeconds()
    if (month < 10) month = "0" + month
    if (h < 10) h = "0" + h
    if (m < 10) m = "0" + m
    if (s < 10) s = "0" + s
    var math = (Math.random() * 1000000).toFixed(0)
    return year + month + day + h + m + s + math
  }
})