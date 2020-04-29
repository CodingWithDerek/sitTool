// pages/index/show.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    typeArr: [{
        name: "摄影",
        flag: 1
      },
      {
        name: "网页开发",
        flag: 0
      },
      {
        name: "手机软件开发",
        flag: 0
      },
      {
        name: "硬件设计",
        flag: 0
      },
      {
        name: "微信小程序开发",
        flag: 0
      },
      {
        name: "微信小游戏开发",
        flag: 0
      },
      {
        name: "微信公众号开发",
        flag: 0
      },
      {
        name: "视频剪辑",
        flag: 0
      },
      {
        name: "CAD作图",
        flag: 0
      },
      {
        name: "其他",
        flag: 0
      },
    ],
    personShowData: [{
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
    ]
  },
  getAllNum: function(typeName, proper) {
    var that = this
    db.collection("personShow").where({
        type: typeName
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
  getData: function(typeName, skipNum, proper) {
    var that = this
    db.collection("personShow").where({
        type: typeName
      }).orderBy("time", "desc")
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
    var typeArr = this.data.typeArr
    for (var i = 0; i < typeArr.length; i++) {
      this.getAllNum(typeArr[i].name, "personShowData[" + i + "].total")
      this.getData(typeArr[i].name, 0, "personShowData[" + i + "].data")
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
    var currentIndex = this.data.currentIndex
    var show = this.data.personShowData[currentIndex].data
    var allNum = this.data.personShowData[currentIndex].total
    var skipNum = show.length
    var arg = "personShowData["+currentIndex+"].data"
    if (allNum == skipNum) {
      wx.showToast({
        title: '已加载全部数据',
      })
      setTimeout(function() {
        wx.hideToast()
      }, 500)
    } else {
      wx.showLoading({
        title: '数据加载中',
      })
      db.collection("personShow").where({
          type: show[0].type
        }).orderBy("time", "desc")
        .skip(skipNum)
        .get()
        .then(res => {
          wx.hideLoading()
          var newShow = show.concat(res.data)
          this.setData({
            [arg]: newShow
          })
        })
        .catch(err => {
          wx.hideLoading()
          console.log(err)
        })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  changeType: function(e) {
    var index = e.currentTarget.dataset.id
    var typeArr = this.data.typeArr
    for (var i = 0; i < typeArr.length; i++)
      typeArr[i].flag = 0
    typeArr[index].flag = 1
    this.setData({
      typeArr: typeArr,
      currentIndex: index
    })
  },
  goShowDetail:function(e){
    wx.navigateTo({
      url: './show/showDetail?item=' + JSON.stringify(e.currentTarget.dataset.item),
    })
  }
})