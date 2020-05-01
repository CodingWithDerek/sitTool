//index.js
const db = wx.cloud.database()
const $ = db.command.aggregate
const app = getApp()

Page({
  data: {
    tupian:[
      "cloud://hezhilong-lv42e.6865-hezhilong-lv42e-1259281086/swiperImage/52b34e39d8482efd94ae2b54d55aea23.jpg",
      "cloud://hezhilong-lv42e.6865-hezhilong-lv42e-1259281086/swiperImage/d5a5c5d37c2e442e3a936ecbb6a18494.jpg"

    ],
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
    pseudoData:[
      {
        image:"../res/service.png",
        summary:"用照片记录生活中的美，你也可以这样的",
        label:["摄影","生活","美丽"],
        people:"2016"
      },
      {
        image: "../res/service.png",
        summary: "用照片记录生活中的美丽瞬间",
        label: ["网页开发", "生活", "美丽"],
        people: "3698"
      },
      {
        image: "../res/service.png",
        summary: "用照片记录生活中的美",
        label: ["视频剪辑", "生活", "美丽"],
        people: "2097"
      },
      {
        image: "../res/service.png",
        summary: "用照片记录生活中的美",
        label: ["摄影", "生活", "美丽"],
        people: "2016"
      },
      {
        image: "../res/service.png",
        summary: "用照片记录生活中的点点滴滴",
        label: ["摄影", "生活", "美丽"],
        people: "20"
      }
    ],
    goodMenArr:[]
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
  },
  goShowDetail:function(e){
    wx.navigateTo({
      url: './show/showDetail?item=' + JSON.stringify(e.currentTarget.dataset.item),
    })
  }
})