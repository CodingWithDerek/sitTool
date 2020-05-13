// pages/person/manageMessage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag1:false,
    flag2:false,
    flag3:false,
    flag4:false,
    flag5:false,
    flag6:false,
    flag7:false
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
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    this.setData({
      flag1:false,
      flag2:false,
      flag3:false,
      flag4:false,
      flag5:false,
      flag6:false,
      flag7:false
    })
    wx.getSetting({
      withSubscriptions: true,
      success(res) {
        //console.log(res)
        if (res.subscriptionsSetting.mainSwitch == true && res.subscriptionsSetting.NqBtoPiR4u1v0pcuW_7Ygtb0O5o9VJN6JnsJHMgwX6g == undefined) {
          that.setData({
            flag1: true
          })
        }
        if (res.subscriptionsSetting.mainSwitch == true && res.subscriptionsSetting["IWuRiPxhYaRciLvy3S1h6WX50PZLZ3hl4-VHjHAKsdw"] == undefined) {
          that.setData({
            flag2: true
          })
        }
        if (res.subscriptionsSetting.mainSwitch == true && res.subscriptionsSetting.NqBtoPiR4u1v0pcuW_7Ygtb0O5o9VJN6JnsJHMgwX6g == "accept") {
          that.setData({
            flag3: true
          })
        }
        if (res.subscriptionsSetting.mainSwitch == true && res.subscriptionsSetting["IWuRiPxhYaRciLvy3S1h6WX50PZLZ3hl4-VHjHAKsdw"] == "accept") {
          that.setData({
            flag4: true
          })
        }
        if (res.subscriptionsSetting.mainSwitch == true && res.subscriptionsSetting.NqBtoPiR4u1v0pcuW_7Ygtb0O5o9VJN6JnsJHMgwX6g == "reject") {
          that.setData({
            flag5: true
          })
        }
        if (res.subscriptionsSetting.mainSwitch == true && res.subscriptionsSetting["IWuRiPxhYaRciLvy3S1h6WX50PZLZ3hl4-VHjHAKsdw"] == "reject") {
          that.setData({
            flag6: true
          })
        }
        if (res.subscriptionsSetting.mainSwitch == false) {
          that.setData({
            flag7: true
          })
        }
        //console.log(that.data)
      }
    })
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
  subscribeInfo_sentJob:function(){
    var that = this
    wx.requestSubscribeMessage({
      tmplIds: ["NqBtoPiR4u1v0pcuW_7Ygtb0O5o9VJN6JnsJHMgwX6g"],
      success:function(res){
        that.onShow()
      },
      fail:function(err){
        console.log(err)
      }
    })
  },
  subscribeInfo_student:function(){
    var that =this
    wx.requestSubscribeMessage({
      tmplIds: ["IWuRiPxhYaRciLvy3S1h6WX50PZLZ3hl4-VHjHAKsdw"],
      success: function (res) {
        that.onShow()
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  goSetting:function(){
    wx.openSetting({
      success:function(res){
      },
      fail:function(err){
        console.log(err)
      }
    })
  }
})