// pages/person/myTeam.js
const db = wx.cloud.database()
const _ = db.command
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bindNum: 1,
    openid: "",
    team: [],
    teamTotal: null,
    applyCollection: [{
        total: null,
        data: []
      },
      {
        total: null,
        data: []
      },
      {
        total: null,
        data: []
      }
    ],
    applyIndex:0
  },

  getTotalNum: function(openid, addedFlag, rejectedFlag, arg) {
    var that = this
    db.collection("team").where({
        applyArr: _.elemMatch({
          openid: _.eq(openid),
          added: addedFlag,
          rejected: rejectedFlag
        })
      }).count()
      .then(res => {
        console.log(res)
        that.setData({
          [arg]: res.total
        })
      })
      .catch(err=>{
        console.log(err)
      })
  },
  getData: function(openid, addedFlag, rejectedFlag, arg) {
    var that = this
    db.collection("team").where({
        applyArr: _.elemMatch({
          openid: _.eq(openid),
          added: addedFlag,
          rejected: rejectedFlag
        })
      }).orderBy("time", "desc")
      .get()
      .then(res => {
        console.log(res)
        that.setData({
          [arg]: res.data
        })
      })
      .catch(err=>{
        console.log(err)
      })
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
          openid: res.data
        })
        db.collection("team").where({
            _openid: res.data
          }).count()
          .then(resT => {
            that.setData({
              teamTotal: resT.total
            })
          })
          .catch(errT => {
            console.log(err)
          })
        db.collection("team").where({
          _openid: res.data
        }).orderBy("time", "desc").get().then(res2 => {
          var teamArr = res2.data
          for (var i = 0; i < teamArr.length; i++) {
            teamArr[i].close = true
          }
          that.setData({
            team: teamArr
          })
        }).catch(err => {
          console.log(err)
        })
        that.getTotalNum(res.data, false, false, "applyCollection[0].total")
        that.getData(res.data, false, false, "applyCollection[0].data")
        that.getTotalNum(res.data, true, false, "applyCollection[1].total")
        that.getData(res.data, true, false, "applyCollection[1].data")
        that.getTotalNum(res.data, false, true, "applyCollection[2].total")
        that.getData(res.data, false, true, "applyCollection[2].data")
      },
      fail: function(err) {
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
    var bindNum = this.data.bindNum
    if(bindNum==1){
      var teamTotal = this.data.teamTotal
      var team = this.data.team
      if(teamTotal==team.length){
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
        db.collection("team").where({
          _openid:this.data.openid
        }).orderBy("time","desc")
          .skip(team.length)
          .get()
          .then(res=>{
            for(let i=0;i<res.data.length;i++)
              res.data[i].close=true
            wx.hideLoading()
            let newArr = team.concat(res.data)
            that.setData({
              team:newArr
            })
          })
          .catch(err=>{
            wx.hideLoading()
            console.log(err)
          })
      }
    }
    if(bindNum==2){
      let total = this.data.applyCollection[0].total
      let shuju = this.data.applyCollection[0].data
      if(total==shuju.length){
        wx.showToast({
          title: '已加载全部数据',
        })
        setTimeout(function () {
          wx.hideToast()
        }, 500)
      }
      else{
        wx.showLoading({
          title: '数据加载中',
        })
        db.collection("team").where({
          applyArr: _.elemMatch({
            openid: _.eq(that.data.openid),
            added: false,
            rejected: false
          })
        }).orderBy("time", "desc")
          .skip(shuju.length)
          .get()
          .then(res => {
            wx.hideLoading()
            let newArr = shuju.concat(res.data)
            that.setData({
              ["applyCollection[0].data"]: newArr
            })
          })
          .catch(err => {
            wx.hideLoading()
            console.log(err)
          })
      }
    }
    if (bindNum == 3) {
      let total = this.data.applyCollection[1].total
      let shuju = this.data.applyCollection[1].data
      if (total == shuju.length) {
        wx.showToast({
          title: '已加载全部数据',
        })
        setTimeout(function () {
          wx.hideToast()
        }, 500)
      }
      else {
        wx.showLoading({
          title: '数据加载中',
        })
        db.collection("team").where({
          applyArr: _.elemMatch({
            openid: _.eq(that.data.openid),
            added: true,
            rejected: false
          })
        }).orderBy("time", "desc")
          .skip(shuju.length)
          .get()
          .then(res => {
            wx.hideLoading()
            let newArr = shuju.concat(res.data)
            that.setData({
              ["applyCollection[1].data"]: newArr
            })
          })
          .catch(err => {
            wx.hideLoading()
            console.log(err)
          })
      }
    }
    if (bindNum == 4) {
      let total = this.data.applyCollection[2].total
      let shuju = this.data.applyCollection[2].data
      if (total == shuju.length) {
        wx.showToast({
          title: '已加载全部数据',
        })
        setTimeout(function () {
          wx.hideToast()
        }, 500)
      }
      else {
        wx.showLoading({
          title: '数据加载中',
        })
        db.collection("team").where({
          applyArr: _.elemMatch({
            openid: _.eq(that.data.openid),
            added: false,
            rejected: true
          })
        }).orderBy("time", "desc")
          .skip(shuju.length)
          .get()
          .then(res => {
            wx.hideLoading()
            let newArr = shuju.concat(res.data)
            that.setData({
              ["applyCollection[2].data"]: newArr
            })
          })
          .catch(err => {
            wx.hideLoading()
            console.log(err)
          })
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  num1: function() {
    this.setData({
      bindNum: 1
    })
  },
  num2: function() {
    this.setData({
      bindNum: 2,
      applyIndex:0
    })
  },
  num3: function() {
    this.setData({
      bindNum: 3,
      applyIndex:1
    })
  },
  num4: function() {
    this.setData({
      bindNum: 4,
      applyIndex:2
    })
  },
  goCreateTeam: function(e) {
    wx.navigateTo({
      url: './myTeam/createTeam?item=' + JSON.stringify(e.currentTarget.dataset.item),
    })
  },
  openDetail: function(e) {
    console.log(e)
    var team = this.data.team
    var current = e.currentTarget.dataset.item
    for (var i = 0; i < team.length; i++) {
      if (team[i]._id == current._id) {
        team[i].close = false;
        this.setData({
          team: team
        })
        break
      }
    }
  },
  closeDetail: function(e) {
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
  callPeople: function(e) {
    var phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
  copyWechatId: function(e) {
    var wechat = e.currentTarget.dataset.wechat
    wx.setClipboardData({
      data: wechat,
      success(res) {
        wx.getClipboardData({})
      }
    })
  },
  breakItem: function(e) {
    var id = e.currentTarget.dataset.id
    var that = this
    wx.showModal({
      content: '是否删除这个项目',
      success(res) {
        if (res.confirm) {
          db.collection("team").doc(id).remove()
            .then(res2 => {
              that.onShow()
              wx.showToast({
                title: '删除成功',
              })
              setTimeout(function() {
                wx.hideToast()
              }, 500)
            })
            .catch(err => {
              wx.showLoading({
                title: '请重新删除',
              })
              setTimeout(function() {
                wx.hideLoading()
              }, 500)
            })
        }
      }
    })
  },
  agreeJoin: function(e) {
    var that = this
    wx.showLoading({
      title: '正在刷新',
    })
    var item = e.currentTarget.dataset.item
    var team = this.data.team
    var ample = false
    var cannotJoin = false
    var characterArrIndex = -1
    for (var i = 0; i < team.length; i++) {
      if (team[i]._id == item._id) {
        var count = 0
        for (var j = 0; j < team[i].characterArr.length; j++) {
          if (team[i].characterArr[j].character == item.character) {
            if (team[i].characterArr[j].needNum == 0) {
              ample = true
              wx.hideLoading()
              wx.showModal({
                showCancel: false,
                content: '您当前项目中已加入的人数等于项目所需人数，如果您还想加入队员，请删除一名现有队员或者修改项目所需人数',
              })
            } else {
              characterArrIndex = j
            }
          } else count++
        }
        if (count == team[i].characterArr.length) {
          wx.hideLoading()
          cannotJoin = true
          wx.showModal({
            showCancel: false,
            content: '该队员角色名称和您设置的队员角色名称都不相同，这可能是您在发起组队后重新修改队员角色的名称有关，所以该队员暂时只能保持这个状态，不能将他加入队伍',
          })
        }
        if (ample == false && cannotJoin == false) {
          team[i].characterArr[characterArrIndex].needNum--
            team[i].characterArr[characterArrIndex].addedNum++
            item.added = true
          item.argue = 2
          for (var t = 0; t < team[i].applyArr.length; t++) {
            if (team[i].applyArr[t].openid == item.openid) {
              team[i].applyArr[t] = item
              break
            }
          }
          that.setData({
            team: team
          })
          db.collection("team").doc(item._id).update({
            data: {
              characterArr: team[i].characterArr
            }
          }).catch(err => {
            console.log(err)
            wx.hideLoading()
          })
          db.collection("team").doc(item._id).update({
              data: {
                applyArr: _.pull({
                  openid: _.eq(item.openid)
                })
              }
            })
            .then(res => {
              return db.collection("team").doc(item._id).update({
                data: {
                  applyArr: _.push(item)
                }
              })
            })
            .then(res2 => {
              wx.hideLoading()
            })
            .catch(err => {
              wx.hideLoading()
              console.log(err)
            })
        }
      }
    }
  },
  rejectJoin: function(e) {
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
      team: team
    })
    db.collection("team").doc(item._id).update({
        data: {
          applyArr: _.pull({
            openid: _.eq(item.openid)
          })
        }
      })
      .then(res => {
        return db.collection("team").doc(item._id).update({
          data: {
            applyArr: _.push(item)
          }
        })
      })
      .then(res2 => {
        wx.hideLoading()
      })
      .catch(err => {
        wx.hideLoading()
        console.log(err)
      })
  },
  deleteJoined: function(e) {
    var cannotDelete = false
    var characterArrIndex = -1
    wx.showLoading({
      title: '正在刷新',
    })
    var item = e.currentTarget.dataset.item
    var team = this.data.team
    for (var i = 0; i < team.length; i++) {
      if (team[i]._id == item._id) {
        var count = 0
        for (var j = 0; j < team[i].characterArr.length; j++) {
          if (team[i].characterArr[j].character == item.character) {
            characterArrIndex = j
          } else count++
        }
        if (count == team[i].characterArr.length) {
          wx.hideLoading()
          cannotDelete: true
          wx.showModal({
            showCancel: false,
            content: '该队员角色名称和您设置的队员角色名称都不相同，这可能是您在发起组队后重新修改队员角色的名称有关，所以该队员暂时只能保持这个状态，不能将他移出您的项目组队',
          })
        }
        if (cannotDelete == false) {
          for (var t = 0; t < team[i].applyArr.length; t++) {
            if (team[i].applyArr[t].openid == item.openid) {
              team[i].applyArr.splice(t, 1)
              break
            }
          }
          team[i].characterArr[characterArrIndex].needNum++
            team[i].characterArr[characterArrIndex].addedNum--
            this.setData({
              team: team
            })
          db.collection("team").doc(item._id).update({
            data: {
              characterArr: team[i].characterArr
            }
          }).catch(err => {
            wx.hideLoading()
            console.log(err)
          })
          db.collection("team").doc(item._id).update({
              data: {
                applyArr: _.pull({
                  openid: _.eq(item.openid)
                })
              }
            }).then(res => {
              wx.hideLoading()
              wx.showToast({
                title: '删除成功',
              })
              setTimeout(function() {
                wx.hideToast()
              }, 500)
            })
            .catch(err => {
              console.log(err)
              wx.hideLoading()
            })
        }
      }
    }
  },
  goDetail: function(e) {
    wx.navigateTo({
      url: '../index/team/teamDetail?item=' + JSON.stringify(e.currentTarget.dataset.item),
    })
  }
})