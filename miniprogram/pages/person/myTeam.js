// pages/person/myTeam.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bindNum:1,
    openid:"oBitP5SmaDl4ptj4_KI6Tojx9D0M",
    team:[
      {
        ownerID:"oBitP5SmaDl4ptj4_KI6Tojx9D0M",
        name:"志星",
        type:"微信小程序",
        people:[
          {
            character:"UI设计",
            all:"4",
            joined:"2"
          },
          {
            character: "软件开发",
            all: "5",
            joined: "2"
          },
          {
            character: "单元测试",
            all: "4",
            joined: "1"
          }
        ],
        joinID:[
          "123",
          "dcsfscf"
        ],
        close:true,
        detail:"我们需要你肯吃苦",
        randomNum:1
      },
      {
        ownerID: "",
        name: "志星",
        type: "微信小程序",
        people: [
          {
            character: "UI设计",
            all: "4",
            joined: "2"
          },
          {
            character: "单元测试",
            all: "4",
            joined: "1"
          }
        ],
        joinID: [
          "123",
          "dcsfscf"
        ],
        close:true,
        detail:"dsfbdnf 悲剧的开始分别的时刻",
        randomNum:4
      }
    ]
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
  goCreateTeam:function(){
    wx.navigateTo({
      url: './myTeam/createTeam',
    })
  },
  openDetail:function(e){
    console.log(e)
    var team = this.data.team
    var current = e.currentTarget.dataset.item
    for(var i=0;i<team.length;i++){
      if(team[i].randomNum==current.randomNum){
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
      if (team[i].randomNum == current.randomNum) {
        team[i].close = true;
        this.setData({
          team: team
        })
        break
      }
    }
  }
})