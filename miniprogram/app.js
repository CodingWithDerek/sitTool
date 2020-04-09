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
      this.globalData = {
        openid: ""
      }
    }
  },
  addData:function(collectionName,shuju){
    const db = wx.cloud.database()
    db.collection(collectionName).add({
      // data 字段表示需新增的 JSON 数据
      data: shuju,
      success: function (res) {
        wx.showToast({
          title: '上传成功',
          duration:2000
        })
        setTimeout(function(){
          wx.hideToast()
        },500)
        wx.navigateBack({
        })
      },
      fail:function(){
        wx.showLoading({
          title: '上传失败',
        })
        setTimeout(function(){
          wx.hideLoading()
        },500)
      }
    })
  }
})