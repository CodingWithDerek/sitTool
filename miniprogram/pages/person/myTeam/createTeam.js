// pages/person/myTeam/createTeam.js
const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    projectType: [
      "手机App开发",
      "微信小程序开发",
      "微信小游戏开发",
      "网站开发",
      "机器人开发",
      "社会实践",
      "其他"
    ],
    index: 0,
    type: "",
    characterArr: [{
      character: "",
      num: 1
    }],
    currentItem: "",
    disabledCondition: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    if (options.item != "undefined") {
      var item = JSON.parse(options.item)
      var type = item.type
      var projectType = this.data.projectType
      var index
      var characterArr = item.characterArr
      for (var i = 0; i < projectType.length; i++)
        if (type == projectType[i]) {
          index = i
          break
        }
      console.log(item)
      this.setData({
        currentItem: item,
        index: index,
        characterArr: characterArr,
        type: type
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var current = this.data.currentItem
    if (current == "") {
      this.setData({
        type: this.data.projectType[0]
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
  changeValue: function(e) {
    var xiaBiao = e.detail.value
    var projectType = this.data.projectType
    this.setData({
      index: xiaBiao,
      type: projectType[xiaBiao]
    })
  },
  renameCharacter: function(e) {
    var newCharacterArr = this.data.characterArr
    var index = e.currentTarget.dataset.id
    newCharacterArr[index].character = e.detail.value
    this.setData({
      characterArr: newCharacterArr
    })
  },
  addCharacter: function() {
    var obj = {
      character: "",
      num: "1"
    }
    var newCharacterArr = this.data.characterArr
    newCharacterArr.push(obj)
    this.setData({
      characterArr: newCharacterArr
    })
  },
  deleteItem: function(e) {
    var index = e.currentTarget.dataset.id
    var newCharacterArr = this.data.characterArr
    if (newCharacterArr.length == 1) {
      wx.showLoading({
        title: '请至少输入一个',
      })
      setTimeout(function() {
        wx.hideLoading()
      }, 500)
    } else {
      newCharacterArr.splice(index, 1)
      this.setData({
        characterArr: newCharacterArr
      })
    }
  },
  updateNum: function(e) {
    var index = e.currentTarget.dataset.id
    var newCharacterArr = this.data.characterArr
    newCharacterArr[index].num = e.detail
    newCharacterArr[index].needNum=e.detail-newCharacterArr[index].addedNum
    this.setData({
      characterArr: newCharacterArr
    })
    //console.log(this.data.characterArr)
  },
  submit: function(e) {
    var that = this
    this.setData({
      disabledCondition: true
    })
    console.log(e)
    var teamName = e.detail.value.teamName
    var detail = e.detail.value.detail
    var type = this.data.type
    var characterArr = this.data.characterArr
    var count = 0
    var time = app.createTime()
    console.log(time)
    var starArr = []
    var applyArr = []
    for (var i = 0; i < characterArr.length; i++) {
      if (characterArr[i].character == "")
        count++;
    }
    if (teamName == "" || count > 0 || detail == "") {
      this.setData({
        disabledCondition: false
      })
      wx.showLoading({
        title: '请补充完整信息',
      })
      setTimeout(function() {
        wx.hideLoading()
      }, 500)
    } else {
      var repeat = false
      for (var i = 0; i < characterArr.length - 1; i++)
        for (var j = i + 1; j < characterArr.length; j++)
          if (characterArr[i].character == characterArr[j].character) {
            repeat = true
            break
          }
      if (repeat) {
        this.setData({
          disabledCondition: false
        })
        wx.showModal({
          showCancel: false,
          content: '请不要设置相同的队员角色',
        })
      } else {
        var flag = false
        for (var i = 0; i < characterArr.length; i++) {
          if (!characterArr[i].addedNum) {
            characterArr[i].addedNum = 0
            characterArr[i].needNum = characterArr[i].num
          }
          if (characterArr[i].addedNum > characterArr[i].num) {
            flag = true
            break
          }
        }
        if (this.data.currentItem != "") {
          if (flag == true) {
            that.setData({
              disabledCondition: false
            })
            wx.showModal({
              showCancel: false,
              content: '您设置角色的所需人数小于已加入您队伍的人数，请重新设置',
            })
          } else {
            wx.showLoading({
              title: '上传中',
            })
            var content = teamName + type + JSON.stringify(characterArr) + detail
            var _id = this.data.currentItem._id
            wx.cloud.callFunction({
                name: "checkContent",
                data: {
                  content
                }
              })
              .then(res => {
                return db.collection("team").doc(_id).update({
                  data: {
                    teamName,
                    type,
                    characterArr,
                    detail
                  }
                })
              })
              .then(res => {
               // console.log("数据更新第二个res", res)
                wx.hideLoading()
                setTimeout(function(){
                  wx.showToast({
                    title: '数据更新成功',
                  })
                },200)
                setTimeout(function () {
                  wx.hideToast()
                }, 1000)
                wx.navigateBack()
              })
              .catch(err => {
                that.setData({
                  disabledCondition: false
                })
                wx.hideLoading()
                console.log("数据更新调用失败的内容", err)
                wx.showModal({
                  showCancel: false,
                  content: '请检查您的当前网络是否可用或者检查您的文本是否包含敏感信息',
                })
              })
          }
        } else {
          wx.showLoading({
            title: '上传中',
          })
          var shuju = {
            teamName,
            type,
            characterArr,
            detail,
            time,
            starArr,
            applyArr
          }
          var firstContent = JSON.stringify(shuju)
          wx.cloud.callFunction({
            name: "checkContent",
            data: {
              content: firstContent
            }
          })
          .then(res => {
            return db.collection("team").add({
              data:shuju
            })
          })
          .then(res=>{
            wx.hideLoading()
            setTimeout(function(){
              wx.showToast({
                title: '上传成功',
              })
            },200)
            setTimeout(function () {
              wx.hideToast()
            }, 1000)
            wx.navigateBack()
          })
          .catch(err => {
            that.setData({
              disabledCondition: false
            })
            console.log("调用失败的内容", err)
            wx.hideLoading()
            wx.showModal({
              showCancel: false,
              content: '请检查您的当前网络是否可用或者检查您的文本是否包含敏感信息',
            })
          })
        }
      }
    }
  }
})