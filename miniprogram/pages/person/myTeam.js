// pages/person/myTeam.js
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bindNum:1,
    openid:"",
    team:[],
    applyCollection:[]
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
        db.collection("team").where({
          _openid: res.data
        }).get().then(res2 => {
          var teamArr = res2.data
          for(var i=0;i<teamArr.length;i++){
            teamArr[i].close=true
          }
          that.setData({
            team:teamArr
          })
        })
        db.collection("team").where({
          applyArr: _.elemMatch({
            openid: _.eq(res.data)
          })
        }).get().then(res3 => {
          that.setData({
            applyCollection: res3.data
          })
        })
      },
      fail:function(err){
        wx.cloud.callFunction({
          name: 'getOpenid'
        })
          .then(res => {
            that.setData({
              openid: res.result.openid
            })
            wx.setStorage({
              key: "openid",
              data: res.result.openid
            })
            db.collection("team").where({
              _openid: res.data
            }).get().then(res2 => {
              var teamArr = res2.data
              for (var i = 0; i < teamArr.length; i++) {
                teamArr[i].close = false
              }
              that.setData({
                team: teamArr
              })
            })
            db.collection("team").where({
              applyArr: _.elemMatch({
                openid: _.eq(res.data)
              })
            }).get().then(res3 => {
              that.setData({
                applyCollection: res3.data
              })
            })
          })
          .catch(console.err)
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  num1:function(){
    this.setData({
      bindNum:1
    })
  },
  num2: function () {
    this.setData({
      bindNum: 2
    })
  },
  num3: function () {
    this.setData({
      bindNum: 3
    })
  },
  goCreateTeam:function(e){
    wx.navigateTo({
      url: './myTeam/createTeam?item=' + JSON.stringify(e.currentTarget.dataset.item),
    })
  },
  openDetail:function(e){
    console.log(e)
    var team = this.data.team
    var current = e.currentTarget.dataset.item
    for(var i=0;i<team.length;i++){
      if(team[i]._id==current._id){
        team[i].close=false;
        this.setData({
          team:team
        })
        break
      }
    }
  },
  closeDetail: function (e) {
    console.log(e)
    var team = this.data.team
    var current = e.currentTarget.dataset.item
    for (var i = 0; i < team.length; i++) {
      if (team[i]._id == current._id) {
        team[i].close = true;
        this.setData({
          team: team
        })
        break
      }
    }
  },
  callPeople:function(e){
    var phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
  copyWechatId:function(e){
    var wechat = e.currentTarget.dataset.wechat
    wx.setClipboardData({
      data: wechat,
      success(res) {
        wx.getClipboardData({
        })
      }
    })
  }
})