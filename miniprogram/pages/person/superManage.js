// pages/person/superManage.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bindNum: 1,
    agreedArr: [],
    applyTotalNum: 0,
    applyArr: [],
    deleteNum: ""
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
    db.collection("managerArr").where({
        agree: true
      }).orderBy("time", "desc").get()
      .then(res => {
        that.setData({
          agreedArr: res.data
        })
      })
      .catch(err => {
        console.log(err)
      })
    db.collection("managerArr").where({
        agree: false
      }).count()
      .then(res => {
        that.setData({
          applyTotalNum: res.total
        })
      })
      .catch(err => {
        console.log(err)
      })
    db.collection("managerArr").where({
        agree: false
      }).orderBy("time", "desc").get()
      .then(res => {
        that.setData({
          applyArr: res.data
        })
      })
      .catch(err => {
        console.log(err)
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
    var that = this
    var applyTotalNum = this.data.applyTotalNum
    var applyArr = this.data.applyArr
    var bindNum = this.data.bindNum
    if(bindNum==2){
      if (applyTotalNum == applyArr.length) {
        wx.showToast({
          title: '已加载全部数据',
        })
        setTimeout(function () {
          wx.hideToast()
        }, 500)
      }
      else {
        wx.showLoading({
          title: '数据加载中',
        })
        db.collection("managerArr").orderBy("time", "desc").skip(applyArr.length).get()
          .then(res => {
            wx.hideLoading()
            let newApplyArr = applyArr.concat(res.data)
            that.setData({
              applyArr: newApplyArr
            })
          }).catch(err => {
            wx.hideLoading()
            console.log(err)
          })
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  num1: function() {
    this.setData({
      bindNum: 1
    })
  },
  num2: function() {
    this.setData({
      bindNum: 2
    })
  },
  num3: function() {
    this.setData({
      bindNum: 3
    })
  },
  getNum: function(e) {
    console.log(e)
    this.setData({
      deleteNum: e.detail.value
    })
  },
  deleteApplyer: function() {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定要删除该申请者吗',
      success(res_modal) {
        if (res_modal.confirm) {
          wx.showLoading({
            title: '正在删除',
          })
          let deleteNum = that.data.deleteNum
          wx.cloud.callFunction({
            name: "deleteApplyer",
            data: {
              deleteNum,
              condition: false
            }
          }).then(res => {
            console.log(res)
            wx.hideLoading()
            that.onShow()
            if (res.result.stats.removed == 0) {
              setTimeout(function () {
                wx.showToast({
                  icon: "loading",
                  title: '查无此人',
                })
              },200)
              setTimeout(function () {
                wx.hideToast()
              }, 700)
            } else {
              setTimeout(function () {
                wx.showToast({
                  title: '删除成功',
                })
              },200)
              setTimeout(function () {
                wx.hideToast()
              }, 700)
            }
          }).catch(err => {
            console.log(err)
            wx.hideLoading()
            wx.showModal({
              showCancel: false,
              content: '似乎出现了点什么问题，请稍后再试',
            })
          })
        }
      }
    })
  },
  agree: function(e) {
    var that = this
    wx.showLoading({
      title: '数据刷新中',
    })
    wx.cloud.callFunction({
      name: "updateManager",
      data: {
        id: e.currentTarget.dataset.id,
        condition: true
      }
    }).then(res => {
      console.log(res)
      that.onShow()
      wx.hideLoading()
      setTimeout(function() {
        wx.showToast({
          title: '已同意',
        })
      },200)
      setTimeout(function() {
        wx.hideToast()
      }, 700)
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
      wx.showModal({
        showCancel: false,
        content: '似乎出现了点什么问题，请稍后再试',
      })
    })
  },
  deleteAdded: function(e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定要删除该管理员吗',
      success(res_modal) {
        if (res_modal.confirm) {
          wx.showLoading({
            title: '正在删除',
          })
          wx.cloud.callFunction({
            name: "deleteApplyer",
            data: {
              deleteNum: e.currentTarget.dataset.id,
              condition: true
            }
          }).then(res => {
            console.log(res)
            wx.hideLoading()
            that.onShow()
            setTimeout(function () {
              wx.showToast({
                title: '删除成功',
              })
            },200)
            setTimeout(function () {
              wx.hideToast()
            }, 700)
          }).catch(err => {
            console.log(err)
            wx.hideLoading()
            wx.showModal({
              showCancel: false,
              content: '似乎出现了点什么问题，请稍后再试',
            })
          })
        }
      }
    })
  }
})