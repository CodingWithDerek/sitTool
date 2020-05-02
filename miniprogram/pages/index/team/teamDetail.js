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
    openid: "",
    show:false,
    index:0,
    disabledCondition:false
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
    var item_applyArr = that.data.currentItem.applyArr
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
        for(var j=0;j<item_applyArr.length;j++){
          if(res.data==item_applyArr[j].openid){
            that.setData({
              canJoin: false
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
              if (res.result.openid == item_starArr[i]) {
                that.setData({
                  canStar: false
                })
                break
              }
            }
            for (var j = 0; j < item_applyArr.length; j++) {
              if (res.result.openid == item_applyArr[j].openid) {
                that.setData({
                  canJoin: false
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
    var openid = this.data.openid
    if(openid!=""){
      wx.showLoading({
        title: '刷新中',
      })
      wx.cloud.callFunction({
        name: 'updateItem',
        data: {
          _id,
          collectionName: "team",
          openid,
          attributeName:"starArr"
        }
      })
        .then(res => {
          console.log("updateItem",res)
          this.setData({
            canStar: false
          })
          wx.hideLoading()
          wx.showToast({
            title: '收藏成功'
          })
          setTimeout(function () {
            wx.hideToast()
          }, 500)
        })
        .catch(err => {
          wx.hideLoading()
          console.log("updateItem",err)
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
    wx.showLoading({
      title: '刷新中',
    })
    var _id = this.data.currentItem._id
    var openid = this.data.openid
    wx.cloud.callFunction({
      // 云函数名称
      name: 'unstar',
      data: {
        _id,
        collectionName: "team",
        openid
      }
    })
      .then(res => {
        console.log("unstar",res)
        this.setData({
          canStar: true
        })
        wx.hideLoading()
        wx.showToast({
          title: '已取消收藏'
        })
        setTimeout(function () {
          wx.hideToast()
        }, 500)
      })
      .catch(err => {
        wx.hideLoading()
        console.log("unstar",err)
        wx.showToast({
          title: '请重试',
          icon: 'loading'
        })
        setTimeout(function () {
          wx.hideToast()
        }, 500)
      })
  },
  join:function(){
    this.setData({
      show:true
    })
  },
  closeDialog:function(){
    this.setData({
      show:false
    })
  },
  changeValue:function(e){
    console.log(e)
    this.setData({
      index:e.detail.value
    })
  },
  submitApplication:function(e){
    this.setData({
      disabledCondition: true
    })
    console.log(e)
    var name = e.detail.value.name
    var mobbilePhone = e.detail.value.mobbilePhone
    var wechatId = e.detail.value.wechatId
    var character = this.data.currentItem.characterArr[this.data.index].character
    var _id = this.data.currentItem._id
    var openid = this.data.openid
    var applyEach = {
      openid,
      name,
      mobbilePhone,
      wechatId,
      character,
      argue:1,
      added:false,
      rejected:false,
      _id
    }
    if(name&&mobbilePhone.length==11&&wechatId&&character){
      if(openid!=""){
        wx.showLoading({
          title: '正在提交',
        })
        wx.cloud.callFunction({
          // 云函数名称
          name: 'updateItem',
          data: {
            _id,
            collectionName: "team",
            applyEach,
            attributeName: "applyArr"
          }
        })
          .then(res => {
            wx.hideLoading()
            this.setData({
              canJoin: false,
              show:false
            })
            wx.showToast({
              title: '申请已提交'
            })
            setTimeout(function () {
              wx.hideToast()
            }, 500)
          })
          .catch(err => {
            wx.hideLoading()
            wx.showToast({
              title: '请重试',
              icon: 'loading'
            })
            this.setData({
              disabledCondition:false
            })
            setTimeout(function () {
              wx.hideToast()
            }, 500)
          })
      }
      else{
        this.setData({
          disabledCondition: false
        })
        wx.showLoading({
          title: '请稍后再试',
        })
        setTimeout(function(){
          wx.hideLoading()
        },500)
      }
    }
    else{
      this.setData({
        disabledCondition: false
      })
      wx.showLoading({
        title: '请填写完整信息',
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 500)
    }
  },
  showAdded:function(){
    wx.showLoading({
      title: '您已经申请过了',
    })
    setTimeout(function(){
      wx.hideLoading()
    },500)
  }
})