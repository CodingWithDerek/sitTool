// pages/person/sentJob.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalNum: null,
    sentJobArr:[],
    openid:""
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
    wx.getStorage({
      key: 'openid',
      success: function(res) {
        that.setData({
          openid:res.data
        })
        db.collection("jobArr").where({
            _openid: res.data
          }).count()
          .then(res2 => {
            that.setData({
              totalNum: res2.total
            })
          }).catch(err => {
            console.log(err)
          })
        db.collection("jobArr").where({
          _openid:res.data
        }).orderBy("sentTime","desc").get()
        .then(res3=>{
          for(let i=0;i<res3.data.length;i++)
            res3.data[i].close=true
          that.setData({
            sentJobArr:res3.data
          })
        })
        .catch(err=>{
          console.log(err)
        })
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
  goEditJob: function(e) {
    wx.navigateTo({
      url: './sentJob/editJob?item=' + JSON.stringify(e.currentTarget.dataset.item) ,
    })
  },
  callSomebody: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
    })
  },
  openDetail: function(e) {
    var index = e.currentTarget.dataset.index
    var sentJobArr = this.data.sentJobArr
    sentJobArr[index].close = false
    this.setData({
      sentJobArr: sentJobArr
    })
  },
  closeDetail: function(e) {
    var index = e.currentTarget.dataset.index
    var sentJobArr = this.data.sentJobArr
    sentJobArr[index].close = true
    this.setData({
      sentJobArr: sentJobArr
    })
  }
})