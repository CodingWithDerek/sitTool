// pages/person/myShow.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedNum:1,
    tempArr:[],
    pickerIndex:0,
    typeArr:[
      "摄影","网页开发","手机软件开发","硬件设计","微信小程序开发","微信小游戏开发","微信公众号开发","视频剪辑","CAD作图","其他"
    ],
    labelArr:[

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
      selectedNum:1
    })
  },
  num2:function(){
    this.setData({
      selectedNum:2
    })
  },
  afterRead:function(e){
    console.log(e)
    var tempArr = this.data.tempArr
    var newTempArr = tempArr.concat(e.detail.file)
    this.setData({
      tempArr:newTempArr
    })
  },
  deleteImg:function(e){
    console.log(e)
    var newTempArr = this.data.tempArr
    var index = e.detail.index
    newTempArr.splice(index,1)
    this.setData({
      tempArr:newTempArr
    })
  },
  bindPickerChange:function(e){
    this.setData({
      pickerIndex:e.detail.value
    })
  },
  submit:function(e){
    var contact = e.detail.value.contact
    var detail = e.detail.value.detail
    var tempArr = this.data.tempArr
    var pickerIndex = this.data.pickerIndex
    var pickerType = this.data.typeArr
    var type = pickerType[pickerIndex]
    var time = app.createTime()
    var starArr=[]
    var promiseArr = []
    if(contact==""||detail==""||tempArr.length<=0){
      wx.showLoading({
        title: '请输入完整信息',
      })
      setTimeout(function(){
        wx.hideLoading()
      },500)
    }
    else{
      wx.showLoading({
        title: '上传中',
      })
      var checkContent = type + contact + detail
      wx.cloud.callFunction({
        name:"checkContent",
        data:{
          content:checkContent
        }
      }).then(res=>{
        for (var i = 0; i < tempArr.length; i++) {
          var name = app.getRandom()
          var suf = /\.[^\.]+$/.exec(tempArr[i].path)
          promiseArr.push(
            wx.cloud.uploadFile({
              cloudPath: name + suf,
              filePath: tempArr[i].path
            })
          )
        }
        return Promise.all(promiseArr)
      }).then(res=>{
        wx.hideLoading()
        console.log(res)
        var imgArr = []
        for (var i = 0; i < res.length; i++)
          imgArr.push(res[i].fileID)
        var shuju = {
          type,
          contact,
          imgArr,
          detail,
          time,
          starArr
        }
        app.addData("personShow", shuju)
      }).catch(err => {
        wx.hideLoading()
        wx.showModal({
          showCancel:true,
          content: '请检查您的当前网络是否可用或者检查您的文本是否包含敏感信息',
        })
      })
    }
    }
    
})