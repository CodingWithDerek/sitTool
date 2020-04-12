// pages/index/team.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    team:[],
    noData:[],
    noDataFlag:"",
    type:[
      {
        name: "手机App开发",
        flag:1
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
    selectedType: "手机App开发"
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
    app.getData("team",0,res=>{
      var resData = res.data
      var arr=[]
      arr.push(resData[0].type)
      for(var i=1;i<resData.length;i++){
        var flag=0
        for (var j = 0; j < arr.length; j++) {
          if (arr[j]==resData[i].type){
            flag=1
            break
          }
        }
        if(flag==0) arr.push(resData[i].type)
      }
      var type = JSON.parse(JSON.stringify(that.data.type))
      for(var k=0;k<arr.length;k++)
        for(var t=0;t<type.length;t++){
          if(arr[k]==type[t].name){
            type.splice(t, 1)
            break
          }
        }
      console.log("筛选后的type",type)
      this.setData({
        team:resData,
        noData:type
      })
    },
    err=>{
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  changeType:function(e){
    var index = e.currentTarget.dataset.id
    var newType = this.data.type
    var noData = this.data.noData
    var _noDataFlag
    for(var j=0;j<noData.length;j++){
      if(noData[j].name==newType[index].name){
        _noDataFlag=noData[j].name
        break
      }
    }
    for(var i=0;i<newType.length;i++){
      newType[i].flag=0
    }
    newType[index].flag=1
    this.setData({
      type:newType,
      selectedType:newType[index].name,
      noDataFlag:_noDataFlag
    })
  }
})