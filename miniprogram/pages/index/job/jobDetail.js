// pages/index/job/jobDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentItem: "",
    canStar:true,
    canJoin:true,
    star_disabledCondition: false,
    unstar_disabledCondition: false,
    submit_disabledCondition: false,
    showPopup:false,
    openid:"",
    applyName:"",
    applyPhone:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      currentItem: JSON.parse(options.item)
    })
    //console.log(JSON.parse(options.item))
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var currentItem = this.data.currentItem
    var that = this
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.setData({
          openid: res.data
        })
        for (let i = 0; i < currentItem.starArr.length; i++) {
          if (res.data == currentItem.starArr[i]) {
            that.setData({
              canStar: false
            })
            break
          }
        }
        for (let i = 0; i < currentItem.applyArr.length; i++) {
          if (res.data == currentItem.applyArr[i].openid) {
            that.setData({
              canJoin: false
            })
            break
          }
        }
      },
      fail: function (err) {
        console.log(err)
        wx.cloud.callFunction({
          name:"getOpenid",
        }).then(res=>{
          console.log(res)
          that.setData({
            openid: res.result.openid
          })
          for (let i = 0; i < currentItem.starArr.length; i++) {
            if (res.result.openid == currentItem.starArr[i]) {
              that.setData({
                canStar: false
              })
              break
            }
          }
          for (let i = 0; i < currentItem.applyArr.length; i++) {
            if (res.result.openid == currentItem.applyArr[i].openid) {
              that.setData({
                canJoin: false
              })
              break
            }
          }
          wx.setStorage({
            key: 'openid',
            data: res.result.openid,
          })
        }).catch(err2=>{
          console.log(err2)
        })
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
  openPopup:function(){
    this.setData({
      showPopup:true
    })
  },
  onClose:function(){
    this.setData({
      showPopup:false
    })
  },
  star:function(){
    this.setData({
      star_disabledCondition: true
    })
    var that = this
    var _id = this.data.currentItem._id
    var openid = this.data.openid
    wx.showLoading({
      title: '数据刷新中',
    })
    wx.cloud.callFunction({
      name:"updateItem",
      data:{
        collectionName:"jobArr",
        _id,
        attributeName:"starArr",
        openid
      }
    }).then(res=>{
      wx.hideLoading()
      setTimeout(function(){
        wx.showToast({
          title: '已收藏',
        })
      },200)
      setTimeout(function(){
        wx.hideToast()
      },700)
      that.setData({
        star_disabledCondition:false,
        canStar:false
      })
    }).catch(err=>{
      console.log(err)
      that.setData({
        star_disabledCondition:false
      })
      wx.hideLoading()
      wx.showModal({
        showCancel:false,
        content: '似乎出现了什么问题，请稍后再试',
      })
    })
  },
  unstar:function(){
    this.setData({
      unstar_disabledCondition:true
    })
    var that = this
    var _id = this.data.currentItem._id
    var openid = this.data.openid
    wx.showLoading({
      title: '数据刷新中',
    })
    wx.cloud.callFunction({
      name:"unstar",
      data:{
        openid,
        _id,
        collectionName:"jobArr"
      }
    }).then(res=>{
      wx.hideLoading()
      setTimeout(function () {
        wx.showToast({
          title: '已取消收藏',
        })
      }, 200)
      setTimeout(function () {
        wx.hideToast()
      }, 700)
      that.setData({
        unstar_disabledCondition: false,
        canStar:true
      })
    }).catch(err=>{
      console.log(err)
      that.setData({
        unstar_disabledCondition: false
      })
      wx.hideLoading()
      wx.showModal({
        showCancel: false,
        content: '似乎出现了什么问题，请稍后再试',
      })
    })
  },
  call:function(){
    var phone = this.data.currentItem.phone
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
  getName:function(e){
    this.setData({
      applyName:e.detail.value
    })
  },
  getPhone:function(e){
    this.setData({
      applyPhone:e.detail.value
    })
    //console.log("phone的类型",typeof(e.detail.value))
  },
  submit:function(){
    this.setData({
      submit_disabledCondition:true
    })
    var that = this
    var currentItem = this.data.currentItem
    var name = this.data.applyName
    var phone = this.data.applyPhone
    //console.log("name和phone",name,phone)
    var applyEach={
      openid : this.data.openid,
      name,
      phone
    }
    if(name!=""&&phone.length==11){
      wx.showLoading({
        title: "正在提交",
      })
      wx.cloud.callFunction({
        name: "updateItem",
        data: {
          _id: currentItem._id,
          collectionName: "jobArr",
          attributeName: "applyArr",
          applyEach
        }
      }).then(res => {
        wx.hideLoading()
        setTimeout(function () {
          wx.showToast({
            title: '已成功提交',
          })
        }, 200)
        setTimeout(function () {
          wx.hideToast()
        }, 700)
        currentItem.applyArr.push(applyEach)
        that.setData({
          currentItem: currentItem,
          showPopup: false,
          canJoin: false
        })
      }).catch(err => {
        console.log(err)
        wx.hideLoading()
        that.setData({
          submit_disabledCondition: false
        })
        wx.showModal({
          showCancel: false,
          content: '似乎出现了什么问题，请稍后再试',
        })
      })
    }
    else{
      wx.showLoading({
        title: '请补充完整信息',
      })
      setTimeout(function(){
        wx.hideLoading()
      },500)
      this.setData({
        submit_disabledCondition: false
      })
    }
  },
  showAppliedInfo:function(){
    wx.showLoading({
      title: '您已经申请过了',
    })
    setTimeout(function(){
      wx.hideLoading()
    },500)
  }
})