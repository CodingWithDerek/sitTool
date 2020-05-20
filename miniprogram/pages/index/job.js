// pages/index/job.js
const db = wx.cloud.database()
const _ = db.command
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    type: [{
        name: "餐饮",
        flag: 1
      },
      {
        name: "家教",
        flag: 0
      },
      {
        name: "助教",
        flag: 0
      },
      {
        name: "传单",
        flag: 0
      },
      {
        name: "促销",
        flag: 0
      },
      {
        name: "校园代理",
        flag: 0
      },
      {
        name: "其他",
        flag: 0
      }
    ],
    jobData: [{
        total: null,
        data: []
      },
      {
        total: null,
        data: []
      },
      {
        total: null,
        data: []
      },
      {
        total: null,
        data: []
      },
      {
        total: null,
        data: []
      },
      {
        total: null,
        data: []
      },
      {
        total: null,
        data: []
      }
    ]
  },

  getAllNum: function(typeName, proper, time) {
    var that = this
    db.collection("jobArr").where({
        type: typeName,
        cancelInterview: false,
        interviewTime: _.gt(time),
        agree: true
      }).count()
      .then(res => {
        that.setData({
          [proper]: res.total
        })
      })
      .catch(err => {
        console.log(err)
      })
  },
  getData: function(typeName, skipNum, proper, time) {
    var that = this
    db.collection("jobArr").where({
        type: typeName,
        cancelInterview: false,
        interviewTime: _.gt(time),
        agree: true
      }).orderBy("interviewTime", "desc")
      .skip(skipNum)
      .get()
      .then(res => {
        that.setData({
          [proper]: res.data
        })
      })
      .catch(err => {
        console.log(err)
      })
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
    var type = this.data.type
    for (let i = 0; i < 7; i++) {
      this.getAllNum(type[i].name, "jobData[" + i + "].total", app.createTime())
      this.getData(type[i].name, 0, "jobData[" + i + "].data", app.createTime())
    }
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
    var currentIndex = this.data.currentIndex
    var jobArr = this.data.jobData[currentIndex].data
    var jobTotalNum = this.data.jobData[currentIndex].total
    var skipNum = jobArr.length
    var arg = "jobData[" + currentIndex + "].data"
    if (skipNum < jobTotalNum) {
      wx.showLoading({
        title: '数据加载中',
      })
      db.collection("team").where({
          type: jobArr[0].type,
          cancelInterview: false,
          interviewTime: _.gt(app.createTime()),
          agree: true
        }).orderBy("interviewTime", "desc")
        .skip(skipNum)
        .get()
        .then(res => {
          wx.hideLoading()
          var newJobArr = jobArr.concat(res.data)
          that.setData({
            [arg]: newJobArr
          })
        })
        .catch(err => {
          wx.hideLoading()
          console.log(err)
        })
    } else {
      wx.showToast({
        title: '已加载全部',
      })
      setTimeout(function() {
        wx.hideToast()
      }, 500)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  changeType: function(e) {
    var index = e.currentTarget.dataset.id
    var newType = this.data.type
    console.log(index)
    for (var i = 0; i < newType.length; i++) {
      newType[i].flag = 0
    }
    newType[index].flag = 1
    this.setData({
      type: newType,
      currentIndex: index
    })
  },
  goJobDetail:function(e){
    wx.navigateTo({
      url: './job/jobDetail?item=' + JSON.stringify(e.currentTarget.dataset.item),
    })
  }
})