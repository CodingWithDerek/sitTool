// pages/index/job/jobDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentItem: "",
    stared: false,
    applied: false,
    star_disabledCondition: false,
    unstar_disabledCondition: false,
    submit_disalbedCondition: false,
    showPopup:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      currentItem: JSON.parse(options.item)
    })
    console.log(JSON.parse(options.item))
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
    var currentItem = this.data.currentItem
    var that = this
    wx.getStorage({
      key: 'openid',
      success: function(res) {
        for (let i = 0; i < currentItem.starArr.length; i++) {
          if(res.data==currentItem.starArr[i]){
            that.setData({
              stared:true
            })
            break
          }
        }
        for(let i=0;i<currentItem.applyArr.length;i++){
          if(res.data==currentItem.applyArr[i].openid){
            that.setData({
              applied:true
            })
            break
          }
        }
      },
      fail:function(err){
        console.log(err)
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
  openPopup:function(){
    this.setData({
      showPopup:true
    })
  },
  onClose:function(){
    this.setData({
      showPopup:false
    })
  }
})