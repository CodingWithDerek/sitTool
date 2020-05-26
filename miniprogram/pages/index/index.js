//index.js
const db = wx.cloud.database()
const $ = db.command.aggregate
const app = getApp()

Page({
  data: {
    logo:[
      {
        way:"../res/job2.png",
        text:"兼职",
        url:"job"
      },
      {
        way:"../res/cooperate.png",
        text:"项目组队",
        url:"team"
      },
      {
        way:"../res/show.png",
        text:"个人show",
        url:"show"
      },
      {
        way:"../res/know.png",
        text:"了解我",
        url:"know"
      },
      {
        way:"../res/service.png",
        text:"客服",
        url:"service"
      }
    ],
    goodMenArr:[],
    indicator_dots: true,
    duration:500,
    interval:7000,
    autoplay:true,
    circular:true,
    advertisementsArr:[]
  },
  onShow:function(){
    var that = this
    db.collection('personShow').aggregate()
      .project({
        totalLikeNum: $.size('$likeArr'),
        _openid:1,
        contact:1,
        detail:1,
        imgArr:1,
        likeArr:1,
        starArr:1,
        type:1
      })
      .sort({
        totalLikeNum:-1
      })
      .limit(6)
      .end()
      .then(res => {
        console.log("聚合操作", res)
        that.setData({
          goodMenArr:res.list
        })
      })
      .catch(err=>{
        console.log("聚合失败",err)
      })
      db.collection("advertisementsArr").get()
      .then(res=>{
        that.setData({
          advertisementsArr:res.data
        })
      })
  },
  goShowDetail:function(e){
    wx.navigateTo({
      url: './show/showDetail?item=' + JSON.stringify(e.currentTarget.dataset.item),
    })
  },
  goAdvertisementDetail:function(e){
    console.log(e)
    wx.navigateTo({
      url: 'advertisement?item=' + JSON.stringify(e.currentTarget.dataset.item),
    })
  }
})