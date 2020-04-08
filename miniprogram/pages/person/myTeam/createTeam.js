// pages/person/myTeam/createTeam.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    projectType:[
      "手机App开发",
      "微信小程序开发",
      "微信小游戏开发",
      "网站开发",
      "机器人开发",
      "社会实践",
      "其他"
    ],
    index:0,
    swipeCellNum:[
      {
        character:"机器人开发",
        num:1
      },
      {
        character:"UI设计",
        num:2
      },
      {
        character:"编写程序",
        num:4
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  changeValue:function(e){
    console.log(e)
    this.setData({
      index:e.detail.value
    })
  }
})