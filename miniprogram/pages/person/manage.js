// pages/person/manage.js
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goTypeArr: ["兼职管理", "赞助管理", "用户反馈处理", "广告管理"],
    manageType:"",
    isJob:true,
    isSponsor:false,
    isfeedback:false,
    isAdvertisement:false,
    unprocessedDataTotalNum:0,
    processedDataTotalNum:0,
    bindNum:1,
    processedData:[],
    unProcessedData:[],
    managerInfo:{
      name:"",
      school_id:""
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.type)
    this.setData({
      manageType:options.type
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    wx.getStorage({
      key: 'openid',
      success: function(res) {
        db.collection("managerArr").where({
          _openid:res.data
        }).get()
        .then(res2=>{
          that.setData({
            ["managerInfo.name"]:res2.data[0].name,
            ["managerInfo.school_id"]:res2.data[0].school_id
          })
        }).catch(err2=>{
          console.log(err2)
        })
      },
      fail:function(err){
        console.log(err)
      }
    })
  },

  getUnprocessedData:function(skipNum,isFirst){
    var that = this
    if(isFirst==false){
      wx.showLoading({
        title: '数据加载中',
      })
    }
    db.collection("jobArr").where({
      agree:false,
      reject:false
    }).orderBy("sentTime", "asc").skip(skipNum).get()
      .then(res => {
        if (isFirst == true) {
          that.setData({
            unProcessedData: res.data
          })
        }
        else {
          wx.hideLoading()
          let unProcessedData = that.data.unProcessedData
          let newData = unProcessedData.concat(res.data)
          that.setData({
            unProcessedData: newData
          })
        }
      }).catch(err => {
        if(isFirst==false){
          wx.hideLoading()
        }
        console.log(err)
      })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    db.collection("jobArr").where({
      agree:false,
      reject:false
    }).count()
    .then(res=>{
      that.setData({
        unprocessedDataTotalNum:res.total
      })
    }).catch(err=>{
      console.log(err)
    })
    db.collection("jobArr").where(_.or([
      {
        agree: true
      },
      {
        reject: true
      }
    ])).count()
    .then(res=>{
      that.setData({
        processedDataTotalNum:res.total
      })
    }).catch(err=>{
      console.log(err)
    })
    that.getUnprocessedData(0,true)
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
    var bindNum = this.data.bindNum
    if(bindNum==1){
      let skipNum = this.data.unProcessedData.length
      let unprocessedDataTotalNum = this.data.unprocessedDataTotalNum
      if(skipNum==unprocessedDataTotalNum){
        wx.showToast({
          title: '已加载全部数据',
        })
        setTimeout(function(){
          wx.hideToast()
        },500)
      }
      else{
        this.getUnprocessedData(skipNum, false)
      }
    }
    if(bindNum==2){
      let skipNum = this.data.processedData.length
      let processedDataTotalNum = this.data.processedDataTotalNum
      if(skipNum==processedDataTotalNum){
        wx.showToast({
          title: '已加载全部数据',
        })
        setTimeout(function () {
          wx.hideToast()
        }, 500)
      }
      else{
        this.getProcessedData(skipNum, false)
      }
    }
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
  num2:function(){
    this.setData({
      bindNum:2
    })
    this.getProcessedData(0,true)
  },
  getProcessedData:function(skipNum,isFirst){
    var that = this
    if(isFirst==false){
      wx.showLoading({
        title: '数据加载中',
      })
    }
    db.collection("jobArr").where(_.or([
      {
        agree: true
      },
      {
        reject: true
      }
    ])).orderBy("sentTime","desc").skip(skipNum).get()
    .then(res=>{
      if(isFirst==true){
        that.setData({
          processedData:res.data
        })
      }
      else{
        wx.hideLoading()
        let processedData = that.data.processedData
        let newData = processedData.concat(res.data)
        that.setData({
          processedData:newData
        })
      }
    }).catch(err=>{
      if(isFirst==false){
        wx.hideLoading()
      }
      console.log(err)
    })
  },
  previewCertificate:function(e){
    wx.previewImage({
      urls: [e.currentTarget.dataset.fileid],
    })
  },
  agree:function(e){
    var that =this
    var managerInfo = this.data.managerInfo
    var id = e.currentTarget.dataset.id
    if(managerInfo.name!=""){
      wx.showLoading({
        title: '数据更新中',
      })
      wx.cloud.callFunction({
        name:"agreeSentJob",
        data:{
          id,
          managerInfo
        }
      }).then(res=>{
        wx.hideLoading()
        setTimeout(function(){
          wx.showToast({
            title: '已同意',
          })
        },200)
        setTimeout(function(){
          wx.hideToast()
        },700)
        let unProcessedData = that.data.unProcessedData
        for(let i=0;i<unProcessedData.length;i++){
          if(id==unProcessedData[i]._id){
            unProcessedData.splice(i,1)
            break
          }
        }
        that.setData({
          unProcessedData:unProcessedData
        })
      }).catch(err=>{
        wx.hideLoading()
        wx.showModal({
          showCancel:false,
          content: '似乎出现了什么问题，请稍后再试',
        })
      })
    }
    else{
      wx.showModal({
        showCancel: false,
        content: '似乎出现了什么问题,请返回上一级页面重新进入该页面',
      })
    }
  },
  reject:function(e){
    var that = this
    var managerInfo = this.data.managerInfo
    var id = e.currentTarget.dataset.id
    if (managerInfo.name != "") {
      wx.showLoading({
        title: '数据更新中',
      })
      wx.cloud.callFunction({
        name: "rejectSentJob",
        data: {
          id,
          managerInfo
        }
      }).then(res => {
        wx.hideLoading()
        setTimeout(function () {
          wx.showToast({
            title: '已拒绝',
          })
        }, 200)
        setTimeout(function () {
          wx.hideToast()
        }, 700)
        let unProcessedData = that.data.unProcessedData
        for (let i = 0; i < unProcessedData.length; i++) {
          if (id == unProcessedData[i]._id) {
            unProcessedData.splice(i, 1)
            break
          }
        }
        that.setData({
          unProcessedData: unProcessedData
        })
      }).catch(err => {
        wx.hideLoading()
        wx.showModal({
          showCancel: false,
          content: '似乎出现了什么问题，请稍后再试',
        })
      })
    }
    else {
      wx.showModal({
        showCancel: false,
        content: '似乎出现了什么问题,请返回上一级页面重新进入该页面',
      })
    }
  },
  call:function(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
    })
  }
})