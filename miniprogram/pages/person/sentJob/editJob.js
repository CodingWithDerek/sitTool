// pages/person/sentJob/editJob.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentItem:"",
    type:[
      "餐饮","家教","助教","传单","促销","校园代理","其他"
    ],
    typeIndex:0,
    workAreaArr:[
      "黄浦区","徐汇区","长宁区","静安区","普陀区","虹口区","杨浦区","闵行区","宝山区","嘉定区",
      "浦东新区","金山区","松江区","青浦区","奉贤区","崇明区"
    ],
    workAreaIndex:0,
    tellIntervieweeArr:["是","否"],
    tellIntervieweeIndex:1,
    haveCertificateArr:["是","否"],
    haveCertificateIndex:0,
    tempAddress:[],
    mutiplePickerArr:[],
    mutiplePickerIndex:[0,0,2,3,4],
    currentYear:"2019",
    interviewTime:"2019-01-03 03:04",
    disabledCondition:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.item!="undefined"){
      var item = JSON.parse(options.item)
      console.log(item)
      this.setData({
        currentItem:item,
        mutiplePickerIndex:item.mutiplePickerIndex,
        interviewTime:item.interviewTime
      })
      var type = this.data.type
      var workAreaArr = this.data.workAreaArr
      for(let i=0;i<type.length;i++){
        if(type[i]==item.type){
          this.setData({
            typeIndex:i
          })
          break
        }
      }
      for(let i=0;i<workAreaArr.length;i++){
        if(item.workArea==workAreaArr[i]){
          this.setData({
            workAreaIndex:i
          })
          break
        }
      }
      if (item.reject == true) {
        this.setData({
          disabledCondition: true
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var date = new Date()
    var years = []
    var months = []
    var days = []
    var hours = []
    var minutes = []
    var year = date.getFullYear()
    for(var i=2019;i<=year+5;i++){
      years.push(i)
    }
    for(var i=1;i<=12;i++){
      if(i<10) i = "0"+i
      months.push(""+i)
    }
    for(var i=1;i<=31;i++){
      if(i<10) i = "0"+i
      days.push(""+i)
    }
    for(var i=0;i<24;i++){
      if(i<10) i = "0" + i
      hours.push(""+i)
    }
    for(var i=0;i<60;i++){
      if(i<10) i = "0" + i
      minutes.push(""+i)
    }
    var arr = [years,months,days,hours,minutes]
    this.setData({
      mutiplePickerArr:arr
    })
   // console.log(arr)
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
  updateMutipleIndex:function(e){
    //console.log("点击确定键",e)
    var mutiplePickerArr = this.data.mutiplePickerArr
    var indexArr = e.detail.value
    var year = mutiplePickerArr[0][indexArr[0]]
    var month = mutiplePickerArr[1][indexArr[1]]
    var day = mutiplePickerArr[2][indexArr[2]]
    var hour = mutiplePickerArr[3][indexArr[3]]
    var minute = mutiplePickerArr[4][indexArr[4]]
    var time = `${year}-${month}-${day} ${hour}:${minute}`
    this.setData({
      interviewTime:time,
      mutiplePickerIndex:indexArr
    })
  },
  updateColumnValue:function(e){
    //console.log("改变列值",e)
    if(e.detail.column==0){
      this.setData({
        currentYear:this.data.mutiplePickerArr[0][e.detail.value]
      })
    }
    if(e.detail.column==1){
      let month = this.data.mutiplePickerArr[1][e.detail.value]
      let arr = []
      if(month==1||month==3||month==5||month==7||month==8||month==10||month==12){
        for(let i=1;i<=31;i++){
          if(i<10) i="0" + i
          arr.push(""+i)
        }
        this.setData({
          ["mutiplePickerArr[2]"]:arr
        })
      }
      if(month==4||month==6||month==9||month==11){
        for (let i = 1; i <= 30; i++) {
          if (i < 10) i = "0" + i
          arr.push("" + i)
        }
        this.setData({
          ["mutiplePickerArr[2]"]: arr
        })
      }
      if(month==2){
        let currentYear = this.data.currentYear
        if((currentYear%4==0&&currentYear%100!=0)||currentYear%400==0){
          for (let i = 1; i <= 29; i++) {
            if (i < 10) i = "0" + i
            arr.push("" + i)
          }
          this.setData({
            ["mutiplePickerArr[2]"]: arr
          })
        }
        else{
          for (let i = 1; i <= 28; i++) {
            if (i < 10) i = "0" + i
            arr.push("" + i)
          }
          this.setData({
            ["mutiplePickerArr[2]"]: arr
          })
        }
      }
    }
  },
  changeTypeIndex:function(e){
    this.setData({
      typeIndex:e.detail.value
    })
  },
  changeAreaIndex:function(e){
    this.setData({
      workAreaIndex:e.detail.value
    })
  },
  changeInterviewIndex:function(e){
    this.setData({
      tellIntervieweeIndex:e.detail.value
    })
  },
  changeCertificateIndex:function(e){
    this.setData({
      haveCertificateIndex:e.detail.value
    })
  },
  afterRead:function(e){
    console.log(e)
    this.setData({
      ["tempAddress[0]"]:e.detail.file
    })
  },
  deleteImg:function(){
    this.setData({
      tempAddress:[]
    })
  },
  submit:function(e){
    var that =this
    this.setData({
      disabledCondition:true
    })
    console.log(e)
    var currentItem = this.data.currentItem
    var tempAddress = this.data.tempAddress[0]
    var companyName = e.detail.value.companyName
    var phone = e.detail.value.phone
    var interviewPlace = e.detail.value.interviewPlace
    var wage = e.detail.value.wage
    var detail = e.detail.value.detail
    var interviewTime = this.data.interviewTime
    var typeArr = this.data.type
    var workAreaArr = this.data.workAreaArr
    var haveCertificateArr = this.data.haveCertificateArr
    var typeIndex = this.data.typeIndex
    var workAreaIndex = this.data.workAreaIndex
    var haveCertificateIndex = this.data.haveCertificateIndex
    var tellIntervieweeIndex = this.data.tellIntervieweeIndex
    var type = typeArr[typeIndex]
    var workArea = workAreaArr[workAreaIndex]
    var haveCertificate = haveCertificateArr[haveCertificateIndex]
    var sentTime = app.createTime()
    var mutiplePickerIndex = this.data.mutiplePickerIndex
    var managerInfo = {
      name:"",
      school_id:""
    }
    if(currentItem==""){
      if(haveCertificate=="是"){
        if(companyName==""||phone==""||interviewPlace==""||wage==""||detail==""||tempAddress==""){
          this.setData({
            disabledCondition:false
          })
          wx.showLoading({
            title: '请补充完整信息',
          })
          setTimeout(function () {
            wx.hideLoading()
          }, 500)
        }
        else{
          let suf = /\.[^\.]+$/.exec(tempAddress.path)
          wx.cloud.uploadFile({
            cloudPath: app.getRandom() + suf,
            filePath: tempAddress.path
          }).then(res => {
            return db.collection("jobArr").add({
              data: {
                companyName,
                type,
                workArea,
                phone,
                interviewPlace,
                interviewTime,
                wage,
                haveCertificate,
                fileID: res.fileID,
                detail,
                applyArr: [],
                starArr:[],
                agree: false,
                reject: false,
                cancel:false,
                sentTime,
                mutiplePickerIndex,
                managerInfo,
                cancelInterview:false
              }
            })
          }).then(res => {
            wx.showToast({
              title: '上传成功',
            })
            setTimeout(function () {
              wx.hideToast()
            }, 500)
            wx.navigateBack()
          }).catch(err => {
            that.setData({
              disabledCondition:false
            })
            console.log(err)
            wx.showModal({
              showCancel: false,
              content: '似乎出现了点问题，请稍后再试',
            })
          })
        }
      }
      else{
        if (companyName == "" || phone == "" || interviewPlace == "" || wage == "" || detail == ""){
          that.setData({
            disabledCondition: false
          })
          wx.showLoading({
            title: '请补充完整信息',
          })
          setTimeout(function () {
            wx.hideLoading()
          }, 500)
        }
        else{
          db.collection("jobArr").add({
            data: {
              companyName,
              type,
              workArea,
              phone,
              interviewPlace,
              interviewTime,
              wage,
              haveCertificate,
              fileID: "",
              detail,
              applyArr: [],
              starArr:[],
              agree: false,
              reject: false,
              cancel:false,
              sentTime,
              mutiplePickerIndex,
              managerInfo,
              cancelInterview:false
            }
          }).then(res => {
            wx.showToast({
              title: '上传成功',
            })
            setTimeout(function () {
              wx.hideToast()
            }, 500)
            wx.navigateBack()
          }).catch(err => {
            that.setData({
              disabledCondition:false
            })
            console.log(err)
            wx.showModal({
              showCancel: false,
              content: '似乎出现了点问题，请稍后再试',
            })
          })
        }
      }
    }
    else{
      if(currentItem.agree==false&&currentItem.reject==false){
        if (companyName == "" || phone == "" || interviewPlace == "" || wage == "" || detail == ""){
          that.setData({
            disabledCondition: false
          })
          wx.showLoading({
            title: '请补充完整信息',
          })
          setTimeout(function () {
            wx.hideLoading()
          }, 500)
        }
        else{
          db.collection("jobArr").doc(currentItem._id).update({
            data:{
              companyName,
              type,
              workArea,
              phone,
              interviewPlace,
              interviewTime,
              wage,
              detail,
              mutiplePickerIndex
            }
          }).then(res=>{
            wx.showToast({
              title: '数据更新成功',
            })
            setTimeout(function(){
              wx.hideToast()
            },500)
            wx.navigateBack()
          }).catch(err=>{
            that.setData({
              disabledCondition: false
            })
            console.log(err)
            wx.showModal({
              showCancel: false,
              content: '似乎出现了点问题，请稍后再试',
            })
          })
        }
      }
      if(currentItem.agree==true){
        if(phone==""||interviewPlace==""){
          that.setData({
            disabledCondition: false
          })
          wx.showLoading({
            title: '请补充完整信息',
          })
          setTimeout(function () {
            wx.hideLoading()
          }, 500)
        }
        else{
          if(currentItem.applyArr.length>0){
            if(tellIntervieweeIndex==0){
              wx.showLoading({
                title: '上传中',
              })
              db.collection("jobArr").doc(currentItem._id).update({
                data:{
                  phone,
                  interviewPlace,
                  interviewTime,
                  mutiplePickerIndex
                }
              }).then(res => {
                wx.hideLoading()
                setTimeout(function () {
                  wx.showToast({
                    title: '数据更新成功',
                  })
                }, 200)
                setTimeout(function () {
                  wx.hideToast()
                }, 700)
                wx.navigateBack()
              }).catch(err => {
                that.setData({
                  disabledCondition: false
                })
                wx.hideLoading()
                console.log(err)

              })
              let promiseArr = []
              for(let i=0;i<currentItem.applyArr.length;i++){
                promiseArr.push(
                  wx.cloud.callFunction({
                    name:"sendSubscribe",
                    data:{
                      openid:currentItem.applyArr[i].openid,
                      sentApplyersTime:app.createTime()
                    }
                  })
                )
              }
              Promise.all(promiseArr).then(res=>{
                console.log(res)
              }).catch(err=>{
                console.log(err)
              })
            }
            else{
              db.collection("jobArr").doc(currentItem._id).update({
                data: {
                  phone,
                  interviewPlace,
                  interviewTime,
                  mutiplePickerIndex
                }
              }).then(res => {
                wx.showToast({
                  title: '数据更新成功',
                })
                setTimeout(function () {
                  wx.hideToast()
                }, 500)
                wx.navigateBack()
              }).catch(err => {
                that.setData({
                  disabledCondition: false
                })
                console.log(err)
                wx.showModal({
                  showCancel: false,
                  content: '似乎出现了点问题，请稍后再试',
                })
              })
            }
          }
          else{
            db.collection("jobArr").doc(currentItem._id).update({
              data:{
                phone,
                interviewPlace,
                interviewTime,
                mutiplePickerIndex
              }
            }).then(res=>{
              wx.showToast({
                title: '数据更新成功',
              })
              setTimeout(function () {
                wx.hideToast()
              }, 500)
              wx.navigateBack()
            }).catch(err=>{
              that.setData({
                disabledCondition: false
              })
              console.log(err)
              wx.showModal({
                showCancel: false,
                content: '似乎出现了点问题，请稍后再试',
              })
            })
          }
        }
      }
    }
  }
})