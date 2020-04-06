// pages/person/person.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: "",
    superId:"oBitP5SmaDl4ptj4_KI6Tojx9D0M",
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
    ]
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
    wx.cloud.callFunction({
        // 云函数名称
        name: 'getOpenid'
      })
      .then(res => {
        var that = this
        that.setData({
          openid: res.result.openid
        })
        app.globalData.openid = res.result.openid
      })
      .catch(console.error)
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
  toMyStar: function() {
    wx.navigateTo({
      url: 'myStar',
    })
  },
  toRecommend: function() {
    wx.navigateTo({
      url: 'recommend',
    })
  },
  toSentJob: function() {
    wx.navigateTo({
      url: 'sentJob',
    })
  },
  toBeSponsor: function() {
    wx.navigateTo({
      url: 'beSponsor',
    })
  },
  toFeedback: function() {
    wx.navigateTo({
      url: 'feedback',
    })
  },
  toBeManager:function(){
    wx.navigateTo({
      url: 'beManager',
    })
  },
  toSuperManage:function(){
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
    wx.navigateTo({
      url: 'manage',
    })
  }
})