// pages/index/show/showDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentItem:{},
    indicator_dots:true,
    autoplay:true,
    circular:true,
    interval:8000,
    canStar:true,
    canLike:true,
    openid:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      currentItem:JSON.parse(options.item)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    var starArr = that.data.currentItem.starArr
    var likeArr = that.data.currentItem.likeArr
    wx.getStorage({
      key: 'openid',
      success: function(res) {
        that.setData({
          openid:res.data
        })
        for(var i=0;i<starArr.length;i++)
          if(starArr[i]==res.data){
            that.setData({
              canStar:false
            })
            break
          }
        for(var j=0;j<likeArr.length;j++)
          if(likeArr[j]==res.data){
            that.setData({
              canLike:false
            })
            break
          }
      },
      fail:function(err){
        wx.cloud.callFunction({
          name: 'getOpenid'
        }).then(res => {
          that.setData({
            openid:res.result.openid
          })
          for (var i = 0; i < starArr.length; i++)
            if (starArr[i] == res.result.openid) {
              that.setData({
                canStar: false
              })
              break
            }
          for (var j = 0; j < likeArr.length; j++)
            if (likeArr[j] == res.result.openid) {
              that.setData({
                canLike: false
              })
              break
            }
          wx.setStorage({
            key: "openid",
            data: res.result.openid
          })
        }).catch(console.err)
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
  previewImg:function(e){
    var imgArr = this.data.currentItem.imgArr
    wx.previewImage({
      current:e.currentTarget.dataset.item,
      urls: imgArr
    })
  },
  star:function(){
    var that = this
    wx.showLoading({
      title: '刷新中',
    })
    wx.cloud.callFunction({
      name:"updateItem",
      data:{
        attributeName:"starArr",
        openid: that.data.openid,
        _id:that.data.currentItem._id,
        collectionName:"personShow"
      }
    }).then(res=>{
      that.setData({
        canStar:false
      })
      wx.hideLoading()
      wx.showToast({
        title: '收藏成功',
      })
      setTimeout(function(){
        wx.hideToast()
      },500)
    }).catch(err=>{
      console.log(err)
      wx.hideLoading()
      wx.showModal({
        showCancel:false,
        content: '似乎出现什么什么问题，请稍后再试',
      })
    })
  },
  cancelStar:function(){
    var that =this
    wx.showLoading({
      title: '刷新中',
    })
    wx.cloud.callFunction({
      name:"unstar",
      data:{
        openid:that.data.openid,
        _id: that.data.currentItem._id,
        collectionName: "personShow"
      }
    }).then(res=>{
      that.setData({
        canStar:true
      })
      wx.hideLoading()
      wx.showToast({
        title: '已取消收藏'
      })
      setTimeout(function () {
        wx.hideToast()
      }, 500)
      }).catch(err => {
        console.log(err)
        wx.hideLoading()
        wx.showModal({
          showCancel: false,
          content: '似乎出现了什么问题，请稍后再试',
        })
      })
  },
  like:function(){
    var that = this
    wx.showLoading({
      title: '刷新中',
    })
    wx.cloud.callFunction({
      name: "updateItem",
      data: {
        attributeName: "likeArr",
        openid: that.data.openid,
        _id: that.data.currentItem._id,
        collectionName: "personShow"
      }
    }).then(res => {
      that.setData({
        canLike: false
      })
      wx.hideLoading()
      wx.showToast({
        title: '已点赞',
      })
      setTimeout(function () {
        wx.hideToast()
      }, 500)
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
      wx.showModal({
        showCancel: false,
        content: '似乎出现了什么问题，请稍后再试',
      })
    })
  },
  cancelLike:function(){
    var that = this
    wx.showLoading({
      title: '刷新中',
    })
    wx.cloud.callFunction({
      name: "cancelLike",
      data: {
        openid: that.data.openid,
        _id: that.data.currentItem._id,
        collectionName: "personShow"
      }
    }).then(res => {
      that.setData({
        canLike: true
      })
      wx.hideLoading()
      wx.showToast({
        title: '已取消点赞'
      })
      setTimeout(function () {
        wx.hideToast()
      }, 500)
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
      wx.showModal({
        showCancel: false,
        content: '似乎出现了什么问题，请稍后再试',
      })
    })
  },
  copyContact:function(e){
    wx.setClipboardData({
      data: e.currentTarget.dataset.contact,
      success(res) {
        wx.getClipboardData({
        })
      }
    })
  }
})