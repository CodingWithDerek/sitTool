// pages/person/myShow.js
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
    this.setData({
      tempArr:e.detail.file
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
    
  }
})