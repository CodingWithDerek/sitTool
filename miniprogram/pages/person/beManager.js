// pages/person/beManager.js
const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIdentity:"",
    disabledCondition:false,
    applyTypeArr:["兼职管理","赞助管理","用户反馈处理","广告管理"],
    applyTypeIndex:0
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
    var that = this
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        db.collection("managerArr").where({
          _openid: res.data
        }).get()
          .then(res2 => {
            console.log(res2)
            that.setData({
              currentIdentity: res2.data[0]
            })
          })
          .catch(err => {
            console.log(err)
          })
      },
      fail: function (err) {
        console.log(err)
      }
    })
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
    this.onReady()
    setTimeout(function(){
      wx.stopPullDownRefresh()
    },500)
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
  changeIndex:function(e){
    this.setData({
      applyTypeIndex:e.detail.value
    })
  },
  submitApplication:function(e){
    var that = this
    this.setData({
      disabledCondition:true
    })
    var name = e.detail.value.name
    var school_id = e.detail.value.school_id
    var time = app.createTime()
    var applyTypeArr = this.data.applyTypeArr
    var applyTypeIndex = this.data.applyTypeIndex
    var applyType = applyTypeArr[applyTypeIndex]
    if(name==""||school_id==""){
      this.setData({
        disabledCondition: false
      })
      wx.showLoading({
        title: '请补充完整信息',
      })
      setTimeout(function(){
        wx.hideLoading()
      },500)
    }
    else{
      db.collection("managerArr").add({
        data: {
          name,
          school_id,
          agree: false,
          time,
          applyType
        }
      }).then(res => {
        wx.showToast({
          title: '已申请',
        })
        setTimeout(function () {
          wx.hideToast()
        }, 500)
        wx.navigateBack()
      }).catch(err => {
        console.log(err)
        that.setData({
          disabledCondition: false
        })
        wx.showModal({
          showCancel: false,
          content: '似乎出了什么问题，请稍后再试',
        })
      })
    }
  }
})