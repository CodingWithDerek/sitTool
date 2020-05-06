// pages/person/sentJob.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sentJobArr:[
      {
        _id:1,
        agree:false,
        reject:false,
        company:"美蛙鱼头火锅",
        type:"餐饮",
        applyArr:[
          {
            openid:"123456",
            name:"张三",
            phone:"18800359312"
          },
          {
            openid: "123456",
            name: "张三",
            phone: "18800359312"
          },
          {
            openid: "123456",
            name: "张三",
            phone: "18800359312"
          }
        ],
        interviewTime:"2020-10-02 18:15",
        interviewPlace:"上海应用技术大学一教102",
        wage:"30元/小时",
        phone: "18800359345",
        workArea:"奉贤区",
        detail:"的话v的话v的环境就撒开把肯定是，都杀不到卡萨丁看见撒旦撒打算，大赛的viu的v洒出三大家萨半岛苏不算差别并不大",
        close:true
      },
      {
        _id:2,
        agree: true,
        reject: false,
        company: "美蛙鱼头火锅",
        type: "餐饮",
        applyArr: [
          {
            openid: "123456",
            name: "张三",
            phone: "18800359312"
          },
          {
            openid: "123456",
            name: "张三",
            phone: "18800359312"
          },
          {
            openid: "123456",
            name: "张三",
            phone: "18800359312"
          }
        ],
        interviewTime: "2020-10-02 18:15",
        interviewPlace: "上海应用技术大学一教102",
        wage: "30元/小时",
        phone:"18800359345",
        workArea: "奉贤区",
        detail: "的话v的话v的环境就撒开把肯定是，都杀不到卡萨丁看见撒旦撒打算，大赛的viu的v洒出三大家萨半岛苏不算差别并不大",
        close: true
      },
      {
        _id:3,
        agree: false,
        reject: true,
        company: "美蛙鱼头火锅",
        type: "餐饮",
        applyArr: [
          {
            openid: "123456",
            name: "张三",
            phone: "18800359312"
          },
          {
            openid: "123456",
            name: "张三",
            phone: "18800359312"
          },
          {
            openid: "123456",
            name: "张三",
            phone: "18800359312"
          }
        ],
        interviewTime: "2020-10-02 18:15",
        interviewPlace: "上海应用技术大学一教102",
        wage: "30元/小时",
        phone: "18800359345",
        workArea: "奉贤区",
        detail: "的话v的话v的环境就撒开把肯定是，都杀不到卡萨丁看见撒旦撒打算，大赛的viu的v洒出三大家萨半岛苏不算差别并不大",
        close: true
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
  goEditJob:function(){
    wx.navigateTo({
      url: './sentJob/editJob',
    })
  },
  callSomebody:function(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
    })
  },
  openDetail:function(e){
    var index = e.currentTarget.dataset.index
    var sentJobArr = this.data.sentJobArr
    sentJobArr[index].close = false
    this.setData({
      sentJobArr:sentJobArr
    })
  },
  closeDetail:function(e){
    var index = e.currentTarget.dataset.index
    var sentJobArr = this.data.sentJobArr
    sentJobArr[index].close = true
    this.setData({
      sentJobArr: sentJobArr
    })
  }
})