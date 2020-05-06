// pages/person/sentJob/editJob.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentItem:"123",
    type:[
      "餐饮","家教","助教","传单","促销","校园代理","其他"
    ],
    typeIndex:0,
    workAreaArr:[
      "黄浦区","徐汇区","长宁区","静安区","普陀区","虹口区","杨浦区","闵行区","宝山区","嘉定区",
      "浦东新区","金山区","松江区","青浦区","奉贤区","崇明区"
    ],
    workAreaIndex:0,
    tellIntervieweeArr:["是","否"],
    tellIntervieweeIndex:1,
    haveCertificateArr:["是","否"],
    haveCertificateIndex:0,
    tempAddress:[],
    mutiplePickerArr:[],
    mutiplePickerIndex:[0,0,2,3,4],
    currentYear:"2019"
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
    var date = new Date()
    var years = []
    var months = []
    var days = []
    var hours = []
    var minutes = []
    var year = date.getFullYear()
    for(var i=2019;i<=year+5;i++){
      years.push(i)
    }
    for(var i=1;i<=12;i++){
      if(i<10) i = "0"+i
      months.push(""+i)
    }
    for(var i=1;i<=31;i++){
      if(i<10) i = "0"+i
      days.push(""+i)
    }
    for(var i=0;i<24;i++){
      if(i<10) i = "0" + i
      hours.push(""+i)
    }
    for(var i=0;i<60;i++){
      if(i<10) i = "0" + i
      minutes.push(""+i)
    }
    var arr = [years,months,days,hours,minutes]
    this.setData({
      mutiplePickerArr:arr
    })
   // console.log(arr)
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
  updateMutipleIndex:function(e){
    //console.log("点击确定键",e)
    this.setData({
      mutiplePickerIndex:e.detail.value
    })
  },
  updateColumnValue:function(e){
    //console.log("改变列值",e)
    if(e.detail.column==0){
      this.setData({
        currentYear:this.data.mutiplePickerArr[0][e.detail.value]
      })
    }
    if(e.detail.column==1){
      let month = this.data.mutiplePickerArr[1][e.detail.value]
      let arr = []
      if(month==1||month==3||month==5||month==7||month==8||month==10||month==12){
        for(let i=1;i<=31;i++){
          if(i<10) i="0" + i
          arr.push(""+i)
        }
        this.setData({
          ["mutiplePickerArr[2]"]:arr
        })
      }
      if(month==4||month==6||month==9||month==11){
        for (let i = 1; i <= 30; i++) {
          if (i < 10) i = "0" + i
          arr.push("" + i)
        }
        this.setData({
          ["mutiplePickerArr[2]"]: arr
        })
      }
      if(month==2){
        let currentYear = this.data.currentYear
        if((currentYear%4==0&&currentYear%100!=0)||currentYear%400==0){
          for (let i = 1; i <= 29; i++) {
            if (i < 10) i = "0" + i
            arr.push("" + i)
          }
          this.setData({
            ["mutiplePickerArr[2]"]: arr
          })
        }
        else{
          for (let i = 1; i <= 28; i++) {
            if (i < 10) i = "0" + i
            arr.push("" + i)
          }
          this.setData({
            ["mutiplePickerArr[2]"]: arr
          })
        }
      }
    }
  },
  changeTypeIndex:function(e){
    this.setData({
      typeIndex:e.detail.value
    })
  },
  changeAreaIndex:function(e){
    this.setData({
      workAreaIndex:e.detail.value
    })
  },
  changeInterviewIndex:function(e){
    this.setData({
      tellIntervieweeIndex:e.detail.value
    })
  },
  changeCertificateIndex:function(e){
    this.setData({
      haveCertificateIndex:e.detail.value
    })
  },
  afterRead:function(e){
    console.log(e)
    this.setData({
      ["tempAddress[0]"]:e.detail.file
    })
  },
  deleteImg:function(){
    this.setData({
      tempAddress:[]
    })
  },
  submit:function(e){
    console.log(e)
  }
})