// pages/index/team.js
const db = wx.cloud.database()
var _ = _ = db.command
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex:0,
    type: [{
        name: "手机App开发",
        flag: 1
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
        name: "网站开发",
        flag: 0
      },
      {
        name: "机器人开发",
        flag: 0
      },
      {
        name: "社会实践",
        flag: 0
      },
      {
        name: "其他",
        flag: 0
      }
    ],
    teamData:[
      {
        total:null,
        data:[]
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
  getAllNum:function(teamType,proper){
    var that = this
    db.collection("team").where({
      type:teamType,
      characterArr: _.elemMatch({
        needNum: _.gt(0)
      })
    }).count()
    .then(res=>{
      //console.log(res)
      that.setData({
        [proper]:res.total
      })
    })
  },
  getData:function(teamType,skipNum,proper){
    var that = this
    db.collection("team").where({
      type: teamType,
      characterArr: _.elemMatch({
        needNum: _.gt(0)
      })
    }).orderBy("time","desc")
      .skip(skipNum)
      .get()
      .then(res=>{
       // console.log(res)
        that.setData({
          [proper]:res.data
        })
      })
      .catch(err=>{
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
    for(var i=0;i<type.length;i++){
      this.getAllNum(type[i].name,"teamData["+i+"].total")
      this.getData(type[i].name,0,"teamData["+i+"].data")
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
    var team = this.data.teamData[currentIndex].data
    var allNUm = this.data.teamData[currentIndex].total
    var skipNum = team.length
    var arg = "teamData["+currentIndex+"].data"
    if (skipNum < allNUm) {
      wx.showLoading({
        title: '数据加载中',
      })
      db.collection("team").where({
        type: team[0].type,
        characterArr: _.elemMatch({
          needNum: _.gt(0)
        })
      }).orderBy("time", "desc")
        .skip(skipNum)
        .get()
        .then(res => {
          wx.hideLoading()
          var newTeam = team.concat(res.data)
          this.setData({
            [arg]: newTeam
          })
        })
        .catch(err => {
          wx.hideLoading()
          console.log(err)
        })
    }
    else{
      wx.showToast({
        title: '已加载全部',
        duration:500
      })
      setTimeout(function(){
        wx.hideToast()
      },500)
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
      type:newType,
      currentIndex:index
    })
  },
  goTeamDetail:function(e){
    wx.navigateTo({
      url: './team/teamDetail?item=' + JSON.stringify(e.currentTarget.dataset.item)
    })
  }
})