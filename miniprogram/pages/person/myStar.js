// pages/person/myStar.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jobTotalNum:0,
    teamTotalNum:0,
    showTotalNum:0,
    jobArr:[],
    teamArr:[],
    showArr:[],
    bindNum:1,
    openid:""
  },

  getTotalNum:function(collectionName,openid,arg){
    var that = this
    db.collection(collectionName).where({
      starArr: openid
    }).count()
    .then(res=>{
      that.setData({
        [arg]: res.total
      })
    }).catch(err=>{
      console.log(err)
    })
  },

  getData:function(isFirst,collectionName,openid,orderFactor,skipNum,oldArr,arg){
    var that = this
    if(isFirst==false){
      wx.showToast({
        title: '数据加载中',
      })
    }
    db.collection(collectionName).where({
      starArr:openid
    }).orderBy(orderFactor,"desc").skip(skipNum).get()
    .then(res=>{
      if(isFirst==false){
        wx.hideToast()
      }
      let newArr = oldArr.concat(res.data)
      that.setData({
        [arg]: newArr
      })
    })
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
    var collectionNameArr = ["jobArr","team","personShow"]
    var argArr1 = ["jobTotalNum","teamTotalNum","showTotalNum"]
    var argArr2 = ["jobArr","teamArr","showArr"]
    var orderFactorArr = ["interviewTime","time","time"]
    wx.getStorage({
      key: 'openid',
      success:function(res){
        that.setData({
          openid:res.data
        })
        for(let i=0;i<3;i++){
          that.getTotalNum(collectionNameArr[i],res.data,argArr1[i])
          that.getData(true,collectionNameArr[i],res.data,orderFactorArr[i],0,[],argArr2[i])
        }
      },
      fail:function(err){
        console.log(err)
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
    var bindNum = this.data.bindNum
    var openid = this.data.openid
    if(bindNum==1){
      let jobTotalNum = this.data.jobTotalNum
      let jobArr = this.data.jobArr
      if(jobTotalNum==jobArr.length){
        wx.showToast({
          title: '已加载全部数据',
        })
        setTimeout(function(){
          wx.hideToast()
        },500)
      }
      else{
        this.getData(false,"jobArr",openid,"interviewTime",jobArr.length,jobArr,"jobArr")
      }
    }
    if(bindNum==2){
      let teamTotalNum = this.data.teamTotalNum
      let teamArr = this.data.teamArr
      if(teamTotalNum==teamArr.length){
        wx.showToast({
          title: '已加载全部数据',
        })
        setTimeout(function(){
          wx.hideToast()
        },500)
      }
      else{
        this.getData(false,"team",openid,"time",teamArr.length,teamArr,"teamArr")
      }
    }
    if(bindNum==3){
      let showTotalNum = this.data.showTotalNum
      let showArr = this.data.showArr
      if(showTotalNum==showArr.length){
        wx.showToast({
          title: '已加载全部数据',
        })
        setTimeout(function(){
          wx.hideToast()
        },500)
      }
      else{
        this.getData(false,"personShow",openid,"time",showArr.length,showArr,"showArr")
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
  },
  num3:function(){
    this.setData({
      bindNum:3
    })
  },
  goJobDetail:function(e){
    wx.navigateTo({
      url: '../index/job/jobDetail?item=' + JSON.stringify(e.currentTarget.dataset.item),
    })
  },
  goTeamDetail:function(e){
    wx.navigateTo({
      url: '../index/team/teamDetail?item=' + JSON.stringify(e.currentTarget.dataset.item),
    })
  },
  goShowDetail:function(e){
    wx.navigateTo({
      url: '../index/show/showDetail?item=' + JSON.stringify(e.currentTarget.dataset.item),
    })
  },
  cancelStar_job:function(e){
    var item = e.currentTarget.dataset.item
    var openid = this.data.openid
    var that = this
    wx.showModal({
      title: '提示',
      content: '您确定要取消收藏该项目吗？',
      success (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '数据刷新中',
          })
          wx.cloud.callFunction({
            name:"unstar",
            data:{
              collectionName:"jobArr",
              _id:item._id,
              openid
            }
          }).then(res2=>{
            wx.hideLoading()
            setTimeout(function(){
              wx.showToast({
                title: '已取消收藏',
              })
            },200)
            setTimeout(function(){
              wx.hideToast()
            },700)
            that.onShow()
          }).catch(err2=>{
            console.log(err2)
          })
        }
      }
    })
  },
  cancelStar_team:function(e){
    var item = e.currentTarget.dataset.item
    var openid = this.data.openid
    var that = this
    wx.showModal({
      title: '提示',
      content: '您确定要取消收藏该项目吗？',
      success (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '数据刷新中',
          })
          wx.cloud.callFunction({
            name:"unstar",
            data:{
              collectionName:"team",
              _id:item._id,
              openid
            }
          }).then(res2=>{
            wx.hideLoading()
            setTimeout(function(){
              wx.showToast({
                title: '已取消收藏',
              })
            },200)
            setTimeout(function(){
              wx.hideToast()
            },700)
            that.onShow()
          }).catch(err2=>{
            console.log(err2)
          })
        }
      }
    })
  },
  cancelStar_show:function(e){
    var item = e.currentTarget.dataset.item
    var openid = this.data.openid
    var that = this
    wx.showModal({
      title: '提示',
      content: '您确定要取消收藏该项目吗？',
      success (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '数据刷新中',
          })
          wx.cloud.callFunction({
            name:"unstar",
            data:{
              collectionName:"personShow",
              _id:item._id,
              openid
            }
          }).then(res2=>{
            wx.hideLoading()
            setTimeout(function(){
              wx.showToast({
                title: '已取消收藏',
              })
            },200)
            setTimeout(function(){
              wx.hideToast()
            },700)
            that.onShow()
          }).catch(err2=>{
            console.log(err2)
          })
        }
      }
    })
  },
})