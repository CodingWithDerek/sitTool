// pages/person/myTeam/createTeam.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    projectType:[
      "手机App开发",
      "微信小程序开发",
      "微信小游戏开发",
      "网站开发",
      "机器人开发",
      "社会实践",
      "其他"
    ],
    index:0,
    type:"",
    characterArr:[
      {
        character:"",
        num:1
      }
    ],
    currentItem:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var item = JSON.parse(options.item)
    var type = item.type
    var projectType = this.data.projectType
    var index
    var characterArr = item.characterArr
    for(var i=0;i<projectType.length;i++)
      if(type==projectType[i]){
        index = i
        break
      }
    console.log(item)
    this.setData({
      currentItem: item,
      index:index,
      characterArr:characterArr
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      type:this.data.projectType[0]
    })
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
  changeValue:function(e){
    var xiaBiao = e.detail.value
    var projectType = this.data.projectType
    this.setData({
      index:xiaBiao,
      type:projectType[xiaBiao]
    })
  },
  renameCharacter:function(e){
    var newCharacterArr = this.data.characterArr
    var index = e.currentTarget.dataset.id
    newCharacterArr[index].character = e.detail.value
    this.setData({
      characterArr:newCharacterArr
    })
  },
  addCharacter:function(){
    var obj = {
      character:"",
      num:"1"
    }
    var newCharacterArr = this.data.characterArr
    newCharacterArr.push(obj)
    this.setData({
      characterArr:newCharacterArr
    })
  },
  deleteItem:function(e){
    var index=e.currentTarget.dataset.id
    var newCharacterArr = this.data.characterArr
    if(newCharacterArr.length==1){
      wx.showLoading({
        title: '请至少输入一个',
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 500)
    }
    else{
      newCharacterArr.splice(index, 1)
      this.setData({
        characterArr: newCharacterArr
      })
    }
  },
  updateNum:function(e){
    var index = e.currentTarget.dataset.id
    var newCharacterArr = this.data.characterArr
    newCharacterArr[index].num = e.detail
    this.setData({
      characterArr:newCharacterArr
    })
    //console.log(this.data.characterArr)
  },
  submit:function(e){
    console.log(e)
    var teamName = e.detail.value.teamName
    var detail = e.detail.value.detail
    var type = this.data.type
    var characterArr = this.data.characterArr
    var count=0
    var time = app.createTime()
    console.log(time)
    var starArr=[]
    var applyArr=[]
    for(var i=0;i<characterArr.length;i++){
      if(characterArr[i].character=="")
        count++;
    }
    if(teamName==""||count>0||detail==""){
      wx.showLoading({
        title: '请补充完整信息',
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 500)
    }
    else{
      var repeat = false
      for(var i=0;i<characterArr.length-1;i++)
        for(var j=i+1;j<characterArr.length;j++)
          if(characterArr[i].character==characterArr[j].character){
            repeat = true
            break
          }
      if(repeat){
        wx.showModal({
          showCancel:false,
          content: '请不要设置相同的队员角色',
        })
      }
      else{
        for (var i = 0; i < characterArr.length; i++) {
          characterArr[i].addedNum = 0
          characterArr[i].needNum = characterArr[i].num
        }
        var shuju = {
          teamName,
          type,
          characterArr,
          detail,
          time,
          starArr,
          applyArr
        }
        app.addData('team', shuju)
      }
    }
  }
})