// pages/person/feedback.js
const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabledCondition: false
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
  submit_feedback:function(e){
    var that = this
    var phone = e.detail.value.phone
    var detail = e.detail.value.detail
    if(phone.length!=11||detail==""){
      wx.showLoading({
        title: '请补充完整信息',
      })
      setTimeout(function(){
        wx.hideLoading()
      },500)
    }
    else{
      this.setData({
        disabledCondition:true
      })
      wx.showLoading({
        title: '反馈提交中',
      })
      db.collection("feedbacks").add({
        data:{
          phone,
          detail,
          time: app.createTime(),
          processed:false,
          canUpdate:true //防止并发操作
        }
      }).then(res=>{
        wx.hideLoading()
        setTimeout(function(){
          wx.showToast({
            title: '提交成功',
          })
        },200)
        setTimeout(function(){
          wx.hideToast()
        },700)
        wx.navigateBack()
      }).catch(err=>{
        wx.hideLoading()
        console.log(err)
        that.setData({
          disabledCondition:false
        })
        wx.showModal({
          showCancel: false,
          content: "似乎出现了什么问题，请稍后再试"
        })
      })
    }
  }
})