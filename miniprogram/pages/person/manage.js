// pages/person/manage.js
const db = wx.cloud.database()
const _ = db.command
const $ = db.command.aggregate
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goTypeArr: ["兼职管理", "赞助管理", "用户反馈处理", "广告管理"],
    manageType:"",
    unProcessedDataTotalNum:0,
    unProcessedDataTotalNum_feedback:0,
    processedDataTotalNum:0,
    processedDataTotalNum_feedback:0,
    bindNum:1,
    processedData:[],
    processedData_feedback:[],
    unProcessedData:[],
    unProcessedData_feedback:[],
    managerInfo:{
      name:"",
      school_id:""
    },
    queriedJob:[],
    query_companyName:"",
    queriedFeedbacks:[],
    queried_phone:"",
    mutiplePickerArr_inTime: [],
    mutiplePickerArr_expireTime: [],
    inTime: "2019-01-03 03:04",
    expireTime: "2019-01-03 03:04",
    mutiplePickerIndex_inTime: [0, 0, 2, 3, 4],
    mutiplePickerIndex_expireTime: [0, 0, 2, 3, 4],
    currentYear_inTime: "2019",
    currentYear_expireTime: "2019",
    tempArr:[],
    advertisement_disabledCondition:false,
    advertisementsArr : []
  },

  getTotalNum_feedback:function(processCondition,arg){
    var that = this
    db.collection("feedbacks").where({
      processed:processCondition
    }).count()
    .then(res=>{
      that.setData({
        [arg]: res.total
      })
    }).catch(err=>{
      console.log(err)
    })
  },
  getData_feedback:function(isFirst,skipNum,processCondition,oldArr,arg,order){
    var that = this
    if(isFirst==false){
      wx.showLoading({
        title: '数据加载中',
      })
    }
    db.collection("feedbacks").where({
      processed:processCondition
    }).orderBy("time",order).skip(skipNum).get()
    .then(res=>{
      if(isFirst==false){
        wx.hideLoading()
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
    var manageType = this.data.manageType
    if(manageType=="兼职管理"){
      wx.getStorage({
        key: 'openid',
        success: function(res) {
          db.collection("managerArr").where({
            _openid:res.data,
            agree:true
          }).get()
          .then(res2=>{
            if(res2.data.length>0){
              that.setData({
                ["managerInfo.name"]:res2.data[0].name,
                ["managerInfo.school_id"]:res2.data[0].school_id
              })
            }
            return db.collection("superManager").where({
              openid:res.data
            }).get()
          }).then(res3=>{
            if(res3.data.length>0){
              that.setData({
                ["managerInfo.name"]:res3.data[0].name,
                ["managerInfo.school_id"]:res3.data[0].school_id
              })
            }
          }).catch(err_all=>{
            console.log(err_all)
          })
        },
        fail:function(err){
          console.log(err)
        }
      })
    }
    if(manageType=="广告管理"){
      var date = new Date()
      var years = []
      var months = []
      var days = []
      var hours = []
      var minutes = []
      var year = date.getFullYear()
      for (var i = 2019; i <= year + 5; i++) {
        years.push(i)
      }
      for (var i = 1; i <= 12; i++) {
        if (i < 10) i = "0" + i
        months.push("" + i)
      }
      for (var i = 1; i <= 31; i++) {
        if (i < 10) i = "0" + i
        days.push("" + i)
      }
      for (var i = 0; i < 24; i++) {
        if (i < 10) i = "0" + i
        hours.push("" + i)
      }
      for (var i = 0; i < 60; i++) {
        if (i < 10) i = "0" + i
        minutes.push("" + i)
      }
      var arr = [years, months, days, hours, minutes]
      this.setData({
        mutiplePickerArr_inTime: arr,
        mutiplePickerArr_expireTime:arr
      })
      db.collection("advertisementsArr").orderBy("expireTime","asc").get()
      .then(res=>{
        that.setData({
          advertisementsArr:res.data
        })
        if(res.data.length==8){
          that.setData({
            advertisement_disabledCondition:true
          })
        }
      }).catch(err=>{
        console.log(err)
      })
    }
    if(manageType=="用户反馈处理"){
      var orderArr = ["asc","desc"]
      var conditionArr = [false,true]
      var totalNumArr = ["unProcessedDataTotalNum_feedback","processedDataTotalNum_feedback"]
      var dataArr = ["unProcessedData_feedback","processedData_feedback"]
      for(var i=0;i<2;i++){
        this.getTotalNum_feedback(conditionArr[i],totalNumArr[i])
        this.getData_feedback(true,0,conditionArr[i],[],dataArr[i],orderArr[i])
      }
    }
  },

  getUnProcessedData:function(skipNum,isFirst){
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

  getUnProcessedDataTotalNum:function(){
    var that = this
    db.collection("jobArr").where({
      agree: false,
      reject: false
    }).count()
      .then(res => {
        that.setData({
          unProcessedDataTotalNum: res.total
        })
      }).catch(err => {
        console.log(err)
      })
  },

  getProcessedDataTotalNum:function(){
    var that =this
    db.collection("jobArr").where(_.or([
      {
        agree: true
      },
      {
        reject: true
      }
    ])).count()
      .then(res => {
        that.setData({
          processedDataTotalNum: res.total
        })
      }).catch(err => {
        console.log(err)
      })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var manageType = this.data.manageType
    if(manageType=="兼职管理"){
      this.getUnProcessedDataTotalNum()
      this.getProcessedDataTotalNum()
      this.getUnProcessedData(0,true)
    }
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
    var manageType = this.data.manageType
    var bindNum = this.data.bindNum
    if(manageType=="兼职管理"){
      if(bindNum==1){
        let skipNum = this.data.unProcessedData.length
        let unProcessedDataTotalNum = this.data.unProcessedDataTotalNum
        if(skipNum==unProcessedDataTotalNum){
          wx.showToast({
            title: '已加载全部数据',
          })
          setTimeout(function(){
            wx.hideToast()
          },500)
        }
        else{
          this.getUnProcessedData(skipNum, false)
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
    }
    if(manageType=="用户反馈处理"){
      if(bindNum==1){
        let unProcessedDataTotalNum_feedback = this.data.unProcessedDataTotalNum_feedback
        let unProcessedData_feedback = this.data.unProcessedData_feedback
        if(unProcessedDataTotalNum_feedback==unProcessedData_feedback.length){
          wx.showToast({
            title: '已加载全部数据',
          })
          setTimeout(function () {
            wx.hideToast()
          }, 500)
        }
        else{
          this.getData_feedback(false,unProcessedData_feedback.length,false,unProcessedData_feedback,"unProcessedData_feedback","asc")
        }
      }
      if(bindNum==2){
        let processedDataTotalNum_feedback = this.data.processedDataTotalNum_feedback
        let processedData_feedback = this.data.processedData_feedback
        if(processedDataTotalNum_feedback==processedData_feedback.length){
          wx.showToast({
            title: '已加载全部数据',
          })
          setTimeout(function () {
            wx.hideToast()
          }, 500)
        }
        else{
          this.getData_feedback(false,processedData_feedback.length,true,processedData_feedback,"processedData_feedback","desc")
        }
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
    var manageType = this.data.manageType
    this.setData({
      bindNum:2
    })
    if(manageType=="兼职管理"){
      this.getProcessedData(0,true)
    }
  },
  num3:function(){
    this.setData({
      bindNum:3
    })
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
        that.getUnProcessedDataTotalNum()
        that.getProcessedDataTotalNum()
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
        let queriedJob = that.data.queriedJob
        for(let i=0;i<unProcessedData.length;i++){
          if(id==unProcessedData[i]._id){
            unProcessedData.splice(i,1)
            break
          }
        }
        for(let i=0;i<queriedJob.length;i++){
          if(id==queriedJob[i]._id){
            queriedJob.splice(i,1)
            break
          }
        }
        that.setData({
          unProcessedData:unProcessedData,
          queriedJob:queriedJob
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
        that.getUnProcessedDataTotalNum()
        that.getProcessedDataTotalNum()
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
        let queriedJob = that.data.queriedJob
        for (let i = 0; i < unProcessedData.length; i++) {
          if (id == unProcessedData[i]._id) {
            unProcessedData.splice(i, 1)
            break
          }
        }
        for (let i = 0; i < queriedJob.length; i++) {
          if (id == queriedJob[i]._id) {
            queriedJob.splice(i, 1)
            break
          }
        }
        that.setData({
          unProcessedData: unProcessedData,
          queriedJob:queriedJob
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
  },
  getCompanyName:function(e){
    //console.log(e)
    this.setData({
      query_companyName:e.detail.value
    })
  },
  queryJob:function(){
    var that = this
    this.setData({
      queriedJob:[]
    })
    var query_companyName = this.data.query_companyName
    console.log("查看获取到的公司名称",query_companyName)
    db.collection("jobArr").aggregate()
      .project({
        _openid:1,
        agree:1,
        companyName:1,
        detail:1,
        fileID:1,
        haveCertificate:1,
        interviewPlace:1,
        interviewTime:1,
        managerInfo:1,
        phone:1,
        reject:1,
        sentTime:1,
        type:1,
        wage:1,
        workArea:1,
        select_Index: $.indexOfCP(['$companyName', query_companyName])
      }).match({
        select_Index:_.gte(0)
      }).sort({
        sentTime:-1
      }).end()
      .then(res=>{
        if(res.list.length>0){
          that.setData({
            queriedJob:res.list
          })
        }else{
          wx.showLoading({
            title: '没有找到该数据',
          })
          setTimeout(function(){
            wx.hideLoading()
          },500)
        }
        console.log("聚合操作（查询兼职）",res)
      }).catch(err=>{
        console.log(err)
        wx.showModal({
          showCancel: false,
          content: '似乎出现了什么问题，请稍后再试',
        })
      })
  },
  updateMutipleIndex_inTime:function(e){
    var mutiplePickerArr = this.data.mutiplePickerArr_inTime
    var indexArr = e.detail.value
    var year = mutiplePickerArr[0][indexArr[0]]
    var month = mutiplePickerArr[1][indexArr[1]]
    var day = mutiplePickerArr[2][indexArr[2]]
    var hour = mutiplePickerArr[3][indexArr[3]]
    var minute = mutiplePickerArr[4][indexArr[4]]
    var time = `${year}-${month}-${day} ${hour}:${minute}`
    this.setData({
      inTime: time,
      mutiplePickerIndex_inTime: indexArr
    })
  },
  updateMutipleIndex_expireTime:function(e){
    var mutiplePickerArr = this.data.mutiplePickerArr_expireTime
    var indexArr = e.detail.value
    var year = mutiplePickerArr[0][indexArr[0]]
    var month = mutiplePickerArr[1][indexArr[1]]
    var day = mutiplePickerArr[2][indexArr[2]]
    var hour = mutiplePickerArr[3][indexArr[3]]
    var minute = mutiplePickerArr[4][indexArr[4]]
    var time = `${year}-${month}-${day} ${hour}:${minute}`
    this.setData({
      expireTime: time,
      mutiplePickerIndex_expireTime: indexArr
    })
  },
  updateColumnValue_inTime:function(e){
    if (e.detail.column == 0) {
      this.setData({
        currentYear_inTime: this.data.mutiplePickerArr_inTime[0][e.detail.value]
      })
    }
    if (e.detail.column == 1) {
      let month = this.data.mutiplePickerArr_inTime[1][e.detail.value]
      let arr = []
      if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
        for (let i = 1; i <= 31; i++) {
          if (i < 10) i = "0" + i
          arr.push("" + i)
        }
        this.setData({
          ["mutiplePickerArr_inTime[2]"]: arr
        })
      }
      if (month == 4 || month == 6 || month == 9 || month == 11) {
        for (let i = 1; i <= 30; i++) {
          if (i < 10) i = "0" + i
          arr.push("" + i)
        }
        this.setData({
          ["mutiplePickerArr_inTime[2]"]: arr
        })
      }
      if (month == 2) {
        let currentYear = this.data.currentYear_inTime
        if ((currentYear % 4 == 0 && currentYear % 100 != 0) || currentYear % 400 == 0) {
          for (let i = 1; i <= 29; i++) {
            if (i < 10) i = "0" + i
            arr.push("" + i)
          }
          this.setData({
            ["mutiplePickerArr_inTime[2]"]: arr
          })
        } else {
          for (let i = 1; i <= 28; i++) {
            if (i < 10) i = "0" + i
            arr.push("" + i)
          }
          this.setData({
            ["mutiplePickerArr_inTime[2]"]: arr
          })
        }
      }
    }    
  },
  updateColumnValue_expireTime:function(e){
    if (e.detail.column == 0) {
      this.setData({
        currentYear_expireTime: this.data.mutiplePickerArr_expireTime[0][e.detail.value]
      })
    }
    if (e.detail.column == 1) {
      let month = this.data.mutiplePickerArr_expireTime[1][e.detail.value]
      let arr = []
      if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
        for (let i = 1; i <= 31; i++) {
          if (i < 10) i = "0" + i
          arr.push("" + i)
        }
        this.setData({
          ["mutiplePickerArr_expireTime[2]"]: arr
        })
      }
      if (month == 4 || month == 6 || month == 9 || month == 11) {
        for (let i = 1; i <= 30; i++) {
          if (i < 10) i = "0" + i
          arr.push("" + i)
        }
        this.setData({
          ["mutiplePickerArr_expireTime[2]"]: arr
        })
      }
      if (month == 2) {
        let currentYear = this.data.currentYear_expireTime
        if ((currentYear % 4 == 0 && currentYear % 100 != 0) || currentYear % 400 == 0) {
          for (let i = 1; i <= 29; i++) {
            if (i < 10) i = "0" + i
            arr.push("" + i)
          }
          this.setData({
            ["mutiplePickerArr_expireTime[2]"]: arr
          })
        } else {
          for (let i = 1; i <= 28; i++) {
            if (i < 10) i = "0" + i
            arr.push("" + i)
          }
          this.setData({
            ["mutiplePickerArr_expireTime[2]"]: arr
          })
        }
      }
    }    
  },
  afterRead: function(e) {
    console.log(e)
    this.setData({
      ["tempArr[0]"]: e.detail.file
    })
  },
  deleteImg: function(e) {
    this.setData({
      tempArr: []
    })
  },
  advertisement_submit:function(e){
    this.setData({
      advertisement_disabledCondition: true
    })
    var name = e.detail.value.name
    var phone = e.detail.value.phone
    var detail = e.detail.value.detail
    var tempArr = this.data.tempArr
    var inTime = this.data.inTime
    var expireTime = this.data.expireTime
    var that = this
    if(name==""||phone==""||tempArr.length==0||detail==""){
      wx.showLoading({
        title: '请补充完整信息',
      })
      setTimeout(function(){
        wx.hideLoading()
      },500)
      this.setData({
        advertisement_disabledCondition:false
      })
    }
    else{
      wx.showLoading({
        title: '数据上传中',
      })
      wx.cloud.uploadFile({
        cloudPath: app.getRandom() + /\.[^\.]+$/.exec(tempArr[0].path),
        filePath: tempArr[0].path
      }).then(res=>{
        return db.collection("advertisementsArr").add({
          data:{
            name,
            phone,
            detail,
            inTime,
            expireTime,
            swiperImg:res.fileID,
            visitedNum:0
          }
        })
      }).then(res=>{
        wx.hideLoading()
        setTimeout(function(){
          wx.showToast({
            title: '上传成功',
          })
        },200)
        setTimeout(function(){
          wx.hideToast()
        },700)
        wx.navigateBack()
      }).catch(err=>{
        wx.hideLoading()
        console.log(err)
        that.setData({
          advertisement_disabledCondition: false
        })
      })
    }
  },
  deleteAdvertisement:function(e){
    var that = this
    var item = e.currentTarget.dataset.item
    var fileIDs = []
    fileIDs.push(item.swiperImg)
    wx.showModal({
      title: '提示',
      content: '您确定要删除该广告吗',
      success (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '数据删除中',
          })
          Promise.all([
            wx.cloud.callFunction({
              name:"delete_advertisementImg",
              data:{
                fileIDs
              }
            }),
            wx.cloud.callFunction({
              name:"delete_advertisementRecord",
              data:{
                id: item._id
              }
            })
          ]).then(res2=>{
            console.log(res2)
            wx.hideLoading()
            setTimeout(function(){
              wx.showToast({
                title: '删除成功',
              })
            },200)
            setTimeout(function(){
              wx.hideToast()
            },700)
            that.onReady()
          }).catch(err2=>{
            console.log(err2)
            wx.hideLoading()
            wx.showModal({
              showCancel:false,
              content: "似乎出现了什么问题，请稍后再试"
            })
          })
        }
      }
    })
  },
  copyPhone:function(e){
    wx.setClipboardData({
      data: e.currentTarget.datset.phone,
      success (res) {
        wx.getClipboardData()
      }
    })
  },
  setProcessed:function(e){
    var that = this
    var item = e.currentTarget.dataset.item
    wx.showLoading({
      title: '数据更新中',
    })
    wx.cloud.callFunction({
      name:"processFeedback",
      data:{
        id:item._id
      }
    }).then(res=>{
      console.log("调用云函数后的res",res)
      wx.hideLoading()
      that.onReady()
      if(res.result.stats.updated==0){
        wx.showModal({
          showCancel:false,
          content:"该记录在刚才已被其他管理员修改，您无法再次修改"
        })
      }
      else{
        that.setData({
          queriedFeedbacks:[]
        })
        setTimeout(function(){
          wx.showToast({
            title: '数据更新成功',
          })
        },200)
        setTimeout(function(){
          wx.hideToast()
        },700)
      }
    }).catch(err=>{
      console.log(err)
      wx.hideLoading()
      wx.showModal({
        showCancel:false,
        content: '似乎出现了什么问题，请稍后再试',
      })
    })
  },
  getPhone:function(e){
    this.setData({
      queried_phone:e.detail.value
    })
  },
  queryFeedbacks:function(){
    var that = this
    var phone = this.data.queried_phone
    db.collection("feedbacks").where({
      phone:phone
    }).get()
    .then(res=>{
      console.log(res)
      if(res.data.length == 0){
        wx.showLoading({
          title: '没有找到该记录',
        })
        setTimeout(function(){
          wx.hideLoading()
        },500)
      }
      else{
        that.setData({
          queriedFeedbacks:res.data
        })
      }
    }).catch(err=>{
      console.log(err)
    })
  }
})