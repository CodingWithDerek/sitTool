// pages/person/postAdvertisement.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    joinedAdvertisements:[
      {
        _id:1,
        name:"上海里岙实业有限公司",
        inTime:"2020-12-30 12:45",
        expireTime:"2021-01-01 05:46"
      },
      {
        _id:2,
        name:"上海里岙实业有限公司",
        inTime:"2020-12-30 12:45",
        expireTime:"2021-01-01 05:46"
      },
      {
        _id:3,
        name:"上海里岙实业有限公司",
        inTime:"2020-12-30 12:45",
        expireTime:"2021-01-01 05:46"
      },
      {
        _id:3,
        name:"上海里岙实业有限公司",
        inTime:"2020-12-30 12:45",
        expireTime:"2021-01-01 05:46"
      },
      {
        _id:4,
        name:"上海里岙实业有限公司",
        inTime:"2020-12-30 12:45",
        expireTime:"2021-01-01 05:46"
      },
      {
        _id:5,
        name:"上海里岙实业有限公司",
        inTime:"2020-12-30 12:45",
        expireTime:"2021-01-01 05:46"
      },
      {
        _id:6,
        name:"上海里岙实业有限公司",
        inTime:"2020-12-30 12:45",
        expireTime:"2021-01-01 05:46"
      },
      {
        _id:7,
        name:"上海里岙实业有限公司",
        inTime:"2020-12-30 12:45",
        expireTime:"2021-01-01 05:46"
      },
      {
        _id:8,
        name:"上海里岙实业有限公司",
        inTime:"2020-12-30 12:45",
        expireTime:"2021-01-01 05:46"
      },
      {
        _id:9,
        name:"上海里岙实业有限公司",
        inTime:"2020-12-30 12:45",
        expireTime:"2021-01-01 05:46"
      }
    ],
    show:false
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
  onClose:function(){
    this.setData({
      show:false
    })
  },
  showPopup:function(){
    this.setData({
      show:true
    })
  },
  copyWechat_id:function(){
    wx.setClipboardData({
      data: 'shijianjiuwei',
      success (res) {
        wx.getClipboardData()
      }
    })
  }
})