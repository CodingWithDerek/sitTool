// pages/person/myTeam.js
const db = wx.cloud.database()
const _ = db.command
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bindNum:1,
    openid:"",
    team:[],
    applyCollection:[]
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
    wx.getStorage({
      key: 'openid',
      success: function(res) {
        that.setData({
          openid:res.data
        })
        db.collection("team").where({
          _openid: res.data
        }).get().then(res2 => {
          var teamArr = res2.data
          for(var i=0;i<teamArr.length;i++){
            teamArr[i].close=true
          }
          that.setData({
            team:teamArr
          })
        })
        db.collection("team").where({
          applyArr: _.elemMatch({
            openid: _.eq(res.data)
          })
        }).get().then(res3 => {
          var outData = res3.data
          for(var i=0;i<outData.length;i++)
            for(var j=0;j<outData[i].applyArr.length;j++)
              if (outData[i].applyArr[j].openid==that.data.openid){
                outData[i].added = outData[i].applyArr[j].added
                outData[i].rejected = outData[i].applyArr[j].rejected
                break
              }
          that.setData({
            applyCollection: outData
          })
        })
      },
      fail:function(err){
        wx.cloud.callFunction({
          name: 'getOpenid'
        })
          .then(res => {
            that.setData({
              openid: res.result.openid
            })
            wx.setStorage({
              key: "openid",
              data: res.result.openid
            })
            db.collection("team").where({
              _openid: res.data
            }).get().then(res2 => {
              var teamArr = res2.data
              for (var i = 0; i < teamArr.length; i++) {
                teamArr[i].close = false
              }
              that.setData({
                team: teamArr
              })
            })
            db.collection("team").where({
              applyArr: _.elemMatch({
                openid: _.eq(res.data)
              })
            }).get().then(res3 => {
              that.setData({
                applyCollection: res3.data
              })
            })
          })
          .catch(console.err)
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
  num4: function () {
    this.setData({
      bindNum: 4
    })
  },
  goCreateTeam:function(e){
    wx.navigateTo({
      url: './myTeam/createTeam?item=' + JSON.stringify(e.currentTarget.dataset.item),
    })
  },
  openDetail:function(e){
    console.log(e)
    var team = this.data.team
    var current = e.currentTarget.dataset.item
    for(var i=0;i<team.length;i++){
      if(team[i]._id==current._id){
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
      if (team[i]._id == current._id) {
        team[i].close = true;
        this.setData({
          team: team
        })
        break
      }
    }
  },
  callPeople:function(e){
    var phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
  copyWechatId:function(e){
    var wechat = e.currentTarget.dataset.wechat
    wx.setClipboardData({
      data: wechat,
      success(res) {
        wx.getClipboardData({
        })
      }
    })
  },
  breakItem:function(e){
    var id = e.currentTarget.dataset.id
    var that = this
    wx.showModal({
      content: '是否删除这个项目',
      success(res) {
        if (res.confirm) {
          db.collection("team").doc(id).remove()
          .then(res2=>{
            that.onShow()
            wx.showToast({
              title: '删除成功',
            })
            setTimeout(function () {
              wx.hideToast()
            }, 500)
          })
          .catch(err=>{
            wx.showLoading({
              title: '请重新删除',
            })
            setTimeout(function () {
              wx.hideLoading()
            }, 500)
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  agreeJoin:function(e){
    wx.showLoading({
      title: '正在刷新',
    })
    console.log(e)
    var item = e.currentTarget.dataset.item
    var team = this.data.team
    item.added = true
    item.argue = 2
    for(var k=0;k<team.length;k++){
      if(team[k]._id==item._id){
        for (var t = 0; t < team[k].applyArr.length; t++)
          if (team[k].applyArr[t].openid == item.openid) {
            team[k].applyArr[t] = item
            break
          }
      }
    }
    console.log(team)
    for(var i=0;i<team.length;i++){
      if(team[i]._id==item._id){
        var count=0
        for(var j=0;j<team[i].characterArr.length;j++){
          if (team[i].characterArr[j].character == item.character) {
            if (team[i].characterArr[j].needNum == 0) {
              wx.hideLoading()
              wx.showModal({
                content: '您当前项目中已加入的人数等于项目所需人数，如果您还想加入队员，请删除一名现有队员或者修改项目所需人数',
              })
            }
            else {
              team[i].characterArr[j].needNum--
              team[i].characterArr[j].addedNum++
              db.collection("team").doc(item._id).update({
                data: {
                  characterArr: team[i].characterArr
                }
              })
              this.setData({
                team: team
              })
            }
          }
          else count++
        }
        if(count==team[i].characterArr.length){
          wx.showModal({
            title: '提示',
            content: '该队员角色和您设置的队员角色都不相同，这可能是您在发起组队后重新修改队员角色的名称有关，所以该队员暂时只能保持这个状态，不能将他加入队伍',
          })
        }
      }
    }
    db.collection("team").doc(item._id).update({
      data:{
        applyArr:_.pull({
          openid:_.eq(item.openid)
        })
      }
    })
    .then(res=>{
      db.collection("team").doc(item._id).update({
        data:{
          applyArr:_.push(item)
        }
      }).then(res2=>{
        wx.hideLoading()
      })
    })
    .catch(err=>{
      wx.hideLoading()
      console.log(err)
    })
  },
  rejectJoin:function(e){
    wx.showLoading({
      title: '正在刷新',
    })
    var item = e.currentTarget.dataset.item
    var team = this.data.team
    item.rejected = true
    item.argue = 3
    for (var k = 0; k < team.length; k++) {
      if (team[k]._id == item._id) {
        for (var t = 0; t < team[k].applyArr.length; t++)
          if (team[k].applyArr[t].openid == item.openid) {
            team[k].applyArr[t] = item
            break
          }
      }
    }
    this.setData({
      team:team
    })
    db.collection("team").doc(item._id).update({
      data: {
        applyArr: _.pull({
          openid: _.eq(item.openid)
        })
      }
    })
      .then(res => {
        db.collection("team").doc(item._id).update({
          data: {
            applyArr: _.push(item)
          }
        }).then(res2 => {
          wx.hideLoading()
        })
      })
      .catch(err => {
        wx.hideLoading()
        console.log(err)
      })
  },
  deleteJoined:function(e){
    wx.showLoading({
      title: '正在刷新',
    })
    var item = e.currentTarget.dataset.item
    var team = this.data.team
    for (var k = 0; k < team.length; k++) {
      if (team[k]._id == item._id) {
        for (var t = 0; t < team[k].applyArr.length; t++)
          if (team[k].applyArr[t].openid == item.openid) {
            team[k].applyArr.splice(t,1)
            break
          }
      }
    }
    for(var i=0;i<team.length;i++){
      if(team[i]._id==item._id){
        for (var j = 0; j < team[i].characterArr.length; j++)
          if (team[i].characterArr[j].character == item.character) {
            team[i].characterArr[j].needNum++
            team[i].characterArr[j].addedNum--
            db.collection("team").doc(item._id).update({
              data: {
                characterArr: team[i].characterArr
              }
            })
          }
      }
    }
    this.setData({
      team: team
    })
    db.collection("team").doc(item._id).update({
      data: {
        applyArr: _.pull({
          openid: _.eq(item.openid)
        })
      }
    }).then(res=>{
      wx.hideLoading()
      wx.showToast({
        title: '删除成功',
      })
      setTimeout(function(){
        wx.hideToast()
      },500)
    })
    .catch(err=>{
      console.log(err)
    })
  },
  goDetail:function(e){
    wx.navigateTo({
      url: '../index/team/teamDetail?item=' + JSON.stringify(e.currentTarget.dataset.item),
    })
  }
})