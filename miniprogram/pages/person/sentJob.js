// pages/person/sentJob.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalNum: null,
    sentJobArr:[],
    openid:""
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
    var that = this
    wx.getStorage({
      key: 'openid',
      success: function(res) {
        that.setData({
          openid:res.data
        })
        db.collection("jobArr").where({
            _openid: res.data
          }).count()
          .then(res2 => {
            console.log(res2)
            that.setData({
              totalNum: res2.total
            })
          }).catch(err => {
            console.log(err)
          })
        db.collection("jobArr").where({
          _openid:res.data
        }).orderBy("sentTime","desc").get()
        .then(res3=>{
          console.log("res3",res3)
          for(let i=0;i<res3.data.length;i++)
            res3.data[i].close=true
          that.setData({
            sentJobArr:res3.data
          })
        })
        .catch(err=>{
          console.log(err)
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  goEditJob: function(e) {
    wx.navigateTo({
      url: './sentJob/editJob?item=' + JSON.stringify(e.currentTarget.dataset.item) ,
    })
  },
  callSomebody: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
    })
  },
  openDetail: function(e) {
    var index = e.currentTarget.dataset.index
    var sentJobArr = this.data.sentJobArr
    sentJobArr[index].close = false
    this.setData({
      sentJobArr: sentJobArr
    })
  },
  closeDetail: function(e) {
    var index = e.currentTarget.dataset.index
    var sentJobArr = this.data.sentJobArr
    sentJobArr[index].close = true
    this.setData({
      sentJobArr: sentJobArr
    })
  },
  previewImage:function(e){
    wx.previewImage({
      urls: [e.currentTarget.dataset.fileid],
    })
  },
  deleteItem:function(e){
    var that = this
    console.log(e)
    var currentItem = e.currentTarget.dataset.item
    var openid = this.data.openid
    var sentJobArr = this.data.sentJobArr
    wx.showModal({
      title: '提示',
      content: '您确定要删除此兼职吗？',
      success(resM){
        if(resM.confirm){
          if (currentItem.applyArr.length > 0) {
            wx.showModal({
              showCancel: false,
              content: '您发布的兼职中已有申请人员，所以该兼职不可删除',
            })
          }
          else {
            db.collection("jobArr").doc(currentItem._id).remove()
              .then(res => {
                return db.collection("jobArr").where({
                  _openid: openid
                }).count()
              })
              .then(res2 => {
                for (let i = 0; i < sentJobArr.length; i++) {
                  if (currentItem._id == sentJobArr[i]._id) {
                    sentJobArr.splice(i, 1)
                    break
                  }
                }
                that.setData({
                  totalNum: res2.total,
                  sentJobArr: sentJobArr
                })
                wx.showToast({
                  title: '删除成功',
                })
                setTimeout(function(){
                  wx.hideToast()
                })
              },500)
          }
        }
      }
    })
  }
})