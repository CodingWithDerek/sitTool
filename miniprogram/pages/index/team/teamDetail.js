// pages/index/team/teamDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentItem: null,
    canStar: true,
    canJoin: true,
    openid: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(JSON.parse(options.item))
    this.setData({
      currentItem: JSON.parse(options.item)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this
    var item_starArr = that.data.currentItem.starArr
    wx.getStorage({
      key: 'openid',
      success(res) {
        console.log(res.data)
        that.setData({
          openid: res.data
        })
        for (var i = 0; i < item_starArr.length; i++) {
          if(res.data==item_starArr[i]){
            that.setData({
              canStar:false
            })
            break
          }
        }
      },
      fail(err) {
        wx.cloud.callFunction({
          name: 'getOpenid'
        })
          .then(res => {
            that.setData({
              openid: res.result.openid
            })
            for (var i = 0; i < item_starArr.length; i++) {
              if (res.data == item_starArr[i]) {
                that.setData({
                  canStar: false
                })
                break
              }
            }
            wx.setStorage({
              key: "openid",
              data: res.result.openid
            })
          })
          .catch(console.error)
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
  star: function() {
    var _id = this.data.currentItem._id
    var starArr = this.data.currentItem.starArr
    starArr.push(this.data.openid)
    if(_id!=""){
      wx.cloud.callFunction({
        // 云函数名称
        name: 'updateItem',
        data: {
          _id,
          collectionName: "team",
          starArr
        }
      })
        .then(res => {
          this.setData({
            canStar: false
          })
          wx.showToast({
            title: '收藏成功'
          })
          setTimeout(function () {
            wx.hideToast()
          }, 500)
        })
        .catch(err => {
          wx.showToast({
            title: '请重试',
            icon: 'loading'
          })
          setTimeout(function () {
            wx.hideToast()
          }, 500)
        })
    }else{
      wx.showLoading({
        title: '请重新点击'
      })
      setTimeout(function(){
        wx.hideLoading()
      },500)
    }
  },
  unstar:function(){
    var _id = this.data.currentItem._id
    var openid = this.data.openid
    var starArr = this.data.currentItem.starArr
    for(var i=0;i<starArr.length;i++){
      if(openid==starArr[i]){
        starArr.splice(i,1)
        break
      }
    }
    wx.cloud.callFunction({
      // 云函数名称
      name: 'updateItem',
      data: {
        _id,
        collectionName: "team",
        starArr
      }
    })
      .then(res => {
        this.setData({
          canStar: true
        })
        wx.showToast({
          title: '已取消收藏'
        })
        setTimeout(function () {
          wx.hideToast()
        }, 500)
      })
      .catch(err => {
        wx.showToast({
          title: '请重试',
          icon: 'loading'
        })
        setTimeout(function () {
          wx.hideToast()
        }, 500)
      })
  }
})