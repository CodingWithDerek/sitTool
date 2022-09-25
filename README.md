## 概览

这是一款使用了微信小程序云开发技术的微信小程序，已开源，大家可以作为学习使用，如果掌握的话再做毕设或者其他项目的时候应该会容易一点，只要大家按照部署文档的介绍一步一步来，应该能正常运行起来，因为我是重新申请了一个新账号自己实验了一遍才出的部署文档，可能大家在部署的时候会遇到各种问题，大家先尝试在百度上搜索解决方案，可以在微信开发者社区上搜索解决方案，实在解决不出来了，大家也可以在B站上给我私信，我空闲看到的话会回复大家（B站账号：Derek_sharing）

## 部署介绍文档

https://github.com/CodingWithDerek/sitTool

## 视频介绍详细版



## 视频介绍精简版



## 数据库集合介绍（你需要创建这些集合并设置相关的数据权限）

| 集合名称（The name of collection） | 描述（Description）          | 数据权限（Access）           |
| ---------------------------------- | ---------------------------- | ---------------------------- |
| advertisementsArr                  | 首页轮播图的广告信息         | 所有用户可读，仅创建者可读写 |
| feedbacks                          | 用户反馈信息                 | 仅创建者可读写               |
| jobArr                             | 已上传的兼职信息             | 所有用户可读，仅创建者可读写 |
| managerArr                         | 存储管理员信息               | 所有用户可读，仅创建者可读写 |
| personShow                         | 存储个人Show信息             | 所有用户可读，仅创建者可读写 |
| projectJoinedPeople                | 在项目组队模块，申请者的信息 | 所有用户可读，仅创建者可读写 |
| superManager                       | 存储超级管理员的信息         | 所有用户可读，仅创建者可读写 |
| team                               | 项目组队的信息               | 所有用户可读，仅创建者可读写 |

## 云函数介绍（你需要上传云函数）

| 云函数名称（The name of cloud functions） | 描述(Description)                                            |
| ----------------------------------------- | ------------------------------------------------------------ |
| addVisitedNum                             | 当用户从首页的轮播图点击进入广告详情页的时候调用此云函数，上报访问量 |
| agreeSentJob                              | 兼职板块管理员同意发布用户上传的兼职信息（审核要发布的兼职） |
| cancelLike                                | 在个人Show的详情页，当用户点击“已点赞”按钮时触发此云函数     |
| checkContent                              | 文本内容安全校验，检查用户上传的文本是否合法（过滤政治敏感，黄赌毒内容），在用户上传“项目组队信息”和上传“个人show信息”时会调用 |
| CheckImage                                | 图片内容安全校验，检查用户上传的文本是否合法（过滤政治敏感，黄赌毒内容），由于它有图片大小限制，所以在项目中并没有使用 |
| delete_advertisementImg                   | 广告模块的管理员删除在删除已过期的广告时，会调用此云函数来删除在云存储上存储的图片，来释放云存储空间 |
| delete_advertisementRecord                | 广告模块的管理员删除在删除已过期的广告时，会调用此云函数来删除在数据库存储的记录 |
| deleteApplyer                             | 超级管理员删除“申请成为管理员信息”，比如有人想申请成为管理员，但是自己的信息填错了，那么就需要超级管理员删除后他才能再次申请 |
| getOpenid                                 | 获取用户Openid                                               |
| processFeedback                           | 用户反馈处理模块的管理员处理用户反馈的时候会调用此云函数     |
| rejectSentJob                             | 兼职板块管理员拒绝发布用户上传的兼职信息（审核要发布的兼职） |
| sendSubscribe                             | 主要是为了在微信中通知用户的，目前有2个地方用到：1. 当兼职发布者点击”取消面试“后，会调用此云函数来通知申请者；2. 当兼职信息的面试时间和面试地点变更后会调用此云函数来通知申请者 |
| sendSubscribe_result                      | 主要是为了在微信中通知用户的，当兼职管理员审核完兼职信息后会调用此云函数来通知发布者 |
| unstar                                    | 1. 当用户在个人show的详情页点击”已收藏“按钮时会调用此云函数；2. 当用户在”我的收藏页“取消自己收藏的”兼职信息“，”项目组队信息“，”个人show信息“会调用此云函数 |
| updateItem                                | 1. 在兼职详情页，当用户点击”收藏“按钮或者当用户在此页面申请兼职时会调用此云函数来上传相应的信息到数据库中；2. 在个人show的详情页，当用户点击”收藏“或者”点赞“时会上传相应的信息到数据库中；3. 在项目组队详情页，当用户点击”收藏“按钮或者当用户在此页面申请加入时会调用此云函数来上传相应的信息到数据库中 |
| updateManager                             | 当超级管理员同意申请者成为管理员时会调用此云函数来授权管理员权限 |

## 小程序有待优化的地方

1. 没有将一些公用的UI编写为一个组件；
2. 代码抽象做的不好，有很多冗余的代码：

## 结语

祝大家好运，持续不断的学习，热爱生活，热爱编程，加油！
