// pages/index/show.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showArr:[],
    typeArr:[
      {
        name:"摄影",
        flag:1
      },
      {
        name:"网页开发",
        flag:0
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
    selectType:"摄影",
    total:0
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
    db.collection("personShow").count()
    .then(res=>{
      that.setData({
        total:res.total
      })
    })
    .catch(err=>{
      console.log(err)
    })
    this.getData(0)
    .then(res=>{
      that.setData({
        showArr:res.data
      })
    })
    .catch(err=>{
      console.log(err)
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
    var total = this.data.total
    var currData = this.data.showArr
    if(total==currData.length){
      wx.showToast({
        title: '已加载全部数据',
      })
      setTimeout(function(){
        wx.hideToast()
      },500)
    }
    else{
      wx.showLoading({
        title: '数据加载中',
      })
      this.getData(currData.length)
      .then(res=>{
        wx.hideLoading()
        currData.push(res.data)
        this.setData({
          showArr:currData
        })
      })
      .catch(err=>{
        wx.hideLoading()
        console.log(err)
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getData:function(skipNum){
    return db.collection("personShow").orderBy("time","desc").skip(skipNum).get()
  },
  changeType:function(e){
    var index = e.currentTarget.dataset.id
    var typeArr = this.data.typeArr
    for(var i=0;i<typeArr.length;i++)
      typeArr[i].flag=0
    typeArr[index].flag=1
    this.setData({
      typeArr:typeArr,
      selectType:typeArr[index].name
    })
  }
})