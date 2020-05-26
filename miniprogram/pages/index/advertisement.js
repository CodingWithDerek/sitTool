// pages/index/advertisement.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentItem:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var item = JSON.parse(options.item)
    this.setData({
      currentItem:item
    })
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
    var currentItem = this.data.currentItem
    if(currentItem!=""){
      wx.cloud.callFunction({
        name:"addVisitedNum",
        data:{
          id:currentItem._id
        }
      }).then(res=>{
        console.log("访问量增加成功的res",res)
      }).catch(err=>{
        console.log(err)
      })
    }
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
  call:function(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
    })
  }
})