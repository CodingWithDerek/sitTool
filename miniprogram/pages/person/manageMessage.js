// pages/person/manageMessage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    subscribeFlag: false
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
    wx.getStorage({
      key: 'subscribeFlag',
      success: function(res) {
        that.setData({
          subscribeFlag: res.data
        })
      },
      fail(err) {
        console.log(err)
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
  subscribeInfo: function() {
    var that = this
    wx.requestSubscribeMessage({
      tmplIds: ['H9oeXwgzNaiub038QJ1rSb1L7V_I6H5HOhVU6VMxaRc',
        'NqBtoPiR4u1v0pcuW_7Ygtb0O5o9VJN6JnsJHMgwX6g'
      ],
      success(res) {
        if (res.H9oeXwgzNaiub038QJ1rSb1L7V_I6H5HOhVU6VMxaRc=="accept"){
          wx.setStorage({
            key: 'subscribeFlag',
            data: true,
          })
          that.setData({
            subscribeFlag: true
          })
        }
      },
      fail(err) {
        console.log(err)
      }
    })
  }
})