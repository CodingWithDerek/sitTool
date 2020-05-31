// pages/person/sentJob.js
const db = wx.cloud.database()
const app = getApp()
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
    var that = this
    var totalNum = this.data.totalNum
    var sentJobArr = this.data.sentJobArr
    var openid = this.data.openid
    if(totalNum==sentJobArr.length){
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
      db.collection("jobArr").where({
        _openid:openid
      }).orderBy("sentTime","desc").skip(sentJobArr.length).get()
      .then(res=>{
        wx.hideLoading()
        for(var i=0;i<res.data.length;i++)
          res.data[i].close = true
        let newArr = sentJobArr.concat(res.data)
        that.setData({
          sentJobArr:newArr
        })
      })
    }
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
            if(currentItem.fileID!=""){
              let deleteFileIDArr = []
              deleteFileIDArr.push(currentItem.fileID)
              Promise.all([
                db.collection("jobArr").doc(currentItem._id).remove(),
                wx.cloud.deleteFile({
                  fileList: deleteFileIDArr
                })
              ]).then(res=>{
                for (let i = 0; i < sentJobArr.length; i++) {
                  if (currentItem._id == sentJobArr[i]._id) {
                    sentJobArr.splice(i, 1)
                    break
                  }
                }
                that.setData({
                  totalNum: that.data.totalNum - 1,
                  sentJobArr: sentJobArr
                })
                wx.showToast({
                  title: '删除成功',
                })
                setTimeout(function(){
                  wx.hideToast()
                },500)
              })
            }
            else{
              db.collection("jobArr").doc(currentItem._id).remove()
              .then(res=>{
                for (let i = 0; i < sentJobArr.length; i++) {
                  if (currentItem._id == sentJobArr[i]._id) {
                    sentJobArr.splice(i, 1)
                    break
                  }
                }
                that.setData({
                  totalNum: that.data.totalNum - 1,
                  sentJobArr: sentJobArr
                })
                wx.showToast({
                  title: '删除成功',
                })
                setTimeout(function(){
                  wx.hideToast()
                },500)
              })
            }
          }
        }
      }
    })
  },
  cancelInterview:function(e){
    var that = this
    var currentItem = e.currentTarget.dataset.item
    var sentJobArr = this.data.sentJobArr
    wx.showModal({
      title: '提示',
      content: '您确定要取消此次面试吗？一旦取消将不可恢复',
      success:function(res){
        if(res.confirm){
          db.collection("jobArr").doc(currentItem._id).update({
            data:{
              cancelInterview:true
            }
          }).then(res2=>{
            for(var i=0;i<sentJobArr.length;i++){
              if(sentJobArr[i]._id==currentItem._id){
                sentJobArr[i].cancelInterview=true
                break
              }
            }
            that.setData({
              sentJobArr:sentJobArr
            })
            wx.showToast({
              title: '已取消面试',
            })
            setTimeout(function(){
              wx.hideToast()
            },500)
            let promiseArr=[]
            for(var i=0;i<currentItem.applyArr.length;i++){
              promiseArr.push(
                wx.cloud.callFunction({
                  name: "sendSubscribe",
                  data: {
                    openid: currentItem.applyArr[i].openid,
                    sentApplyersTime: app.createSentSubscribeMsgTime(),
                    info: "您参加的面试已被取消，请注意查看"
                  }
                })
              )
            }
            Promise.all(promiseArr).then(res_all=>{
              console.log("发送所有订阅消息成功的回调",res_all)
            }).catch(err_all=>{
              console.log("发送所有订阅消息失败的回调",err_all)
            })
          })
        }
      }
    })
  }
})