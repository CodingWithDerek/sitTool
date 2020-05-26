// pages/person/person.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: "",
    superId:"1",
    isManager:false,
    showPopup:false,
    goType:"",
    goTypeArr: ["兼职管理", "赞助管理", "用户反馈处理", "广告管理"],
    radio:"0",
    list: [{
        title: "我的面试",
        picture: "../res/myInterview.png",
        url: "myInterview"
      },
      {
        title: "我的组队",
        picture: "../res/myTeam.png",
        url: "myTeam"
      },
      {
        title: "我的show",
        picture: "../res/myShow.png",
        url: "myShow"
      }
    ],
    qiyong:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this
    db.collection("superManager").get()
      .then(res => {
        console.log("直接获取superManager",res)
        that.setData({
          superId:res.data[0].openid
        })
      }).catch(err => {
        console.log(err)
      })
    wx.getStorage({
      key: 'openid',
      success(res) {
        console.log(res.data)
        that.setData({
          openid:res.data
        })
        db.collection("managerArr").where({
          _openid:res.data,
          agree:true
        }).get()
        .then(res2=>{
          console.log("检验是否为管理员的成功调用",res2)
          if(res2.data.length>0){
            that.setData({
              isManager:true,
              goType:res2.data[0].applyType
            })
          }
        }).catch(err2=>{
          console.log("检验是否为管理员的失败调用",err2)
        })
      },
      fail(err){
        wx.cloud.callFunction({
          // 云函数名称
          name: 'getOpenid'
        })
          .then(res => {
            that.setData({
              openid: res.result.openid
            })
            db.collection("managerArr").where({
              _openid: res.result.openid,
              agree:true
            }).get()
              .then(res2 => {
                console.log("检验是否为管理员的成功调用", res2)
                if (res2.data.length > 0) {
                  that.setData({
                    isManager: true,
                    goType: res2.data[0].applyType
                  })
                }
              }).catch(err2 => {
                console.log("检验是否为管理员的失败调用", err2)
              })
            wx.setStorage({
              key: "openid",
              data: res.result.openid
            })
          })
          .catch(console.err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  goMyStar: function() {
    wx.navigateTo({
      url: 'myStar',
    })
  },
  goRecommend: function() {
    wx.navigateTo({
      url: 'recommend',
    })
  },
  goSentJob: function() {
    wx.navigateTo({
      url: 'sentJob',
    })
  },
  goPostAdvertisement:function(){
    wx.navigateTo({
      url: 'postAdvertisement',
    })
  },
  toBeSponsor: function() {
    wx.navigateTo({
      url: 'beSponsor',
    })
  },
  goFeedback: function() {
    wx.navigateTo({
      url: 'feedback',
    })
  },
  toBeManager:function(){
    wx.navigateTo({
      url: 'beManager',
    })
  },
  goSuperManage:function(){
    wx.navigateTo({
      url: 'superManage',
    })
  },
  copy:function(){
    var that = this
    wx.setClipboardData({
      data: that.data.openid,
      success(res) {
        wx.getClipboardData({
        })
      },
      fail(err){
        wx.showModal({
          content: '请重新复制',
          showCancel:false
        })
      }
    })
  },
  goManage:function(){
    var openid = this.data.openid
    var superId = this.data.superId
    var isManager = this.data.isManager
    if(isManager==true&&openid!=superId){
      wx.navigateTo({
        url: 'manage?type=' + this.data.goType,
      })
    }
    if(openid==superId){
      this.setData({
        showPopup: true
      })
    }
  },
  goManageMessage:function(){
    wx.navigateTo({
      url: 'manageMessage',
    })
  },
  closePopup:function(){
    this.setData({
      showPopup:false
    })
  },
  onChange:function(e){
    //console.log("onChange",e)
    this.setData({
      radio:e.detail
    })
  },
  onClick:function(e){
    //console.log("onClick",e)
    this.setData({
      radio:e.currentTarget.dataset.name
    })
  },
  superManager_goManage:function(){
    var goTypeArr = this.data.goTypeArr
    var radio = this.data.radio
    var goType = goTypeArr[radio]
    wx.navigateTo({
      url: 'manage?type=' + goType,
    })
  }
})