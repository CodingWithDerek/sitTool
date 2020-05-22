// pages/person/myInterview.js
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalNum:0,
    interviewArr:[],
    openid:""
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    wx.getStorage({
      key: 'openid',
      success: function(res) {
        that.setData({
          openid:res.data
        })
        db.collection("jobArr").where({
          applyArr:{
            openid:_.eq(res.data)
          }
        }).count()
        .then(res2=>{
          that.setData({
            totalNum:res2.total
          })
        }).catch(err2=>{
          console.log(err2)
        })
        db.collection("jobArr").where({
          applyArr: {
            openid: _.eq(res.data)
          }
        }).orderBy("interviewTime","desc").get()
        .then(res3=>{
          that.setData({
            interviewArr:res3.data
          })
        }).catch(err3=>{
          console.log(err3)
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
    var that = this
    var totalNum = this.data.totalNum
    var interviewArr = this.data.interviewArr
    var openid = this.data.openid
    if(totalNum==interviewArr.length){
      wx.showToast({
        title: '已加载全部数据',
      })
      setTimeout(function(){
        wx.hideToast()
      },500)
    }
    else{
      db.collection("jobArr").where({
        applyArr: {
          openid: _.eq(openid)
        }
      }).orderBy("interviewTime","desc").skip(interviewArr.length).get()
        .then(res => {
          let newArr = interviewArr.concat(res.data)
          that.setData({
            interviewArr: newArr
          })
        }).catch(err => {
          console.log(err)
        })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  goJobDetail:function(e){
    wx.navigateTo({
      url: '../index/job/jobDetail?item=' + JSON.stringify(e.currentTarget.dataset.item),
    })
  }
})