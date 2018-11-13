// 引用vue 和vue-router
import Vue from 'vue';
import VueRouter from 'vue-router';
/*
const Home = () => import('../components/Home/home.vue');
const operationData = () => import('../components/Home/operationData.vue');
const userManagement = () => import('../components/Home/userManagement.vue');
const operationSupport = () => import('../components/Home/operationSupport.vue');
const activities = () => import('../components/Home/activities.vue');
const systemSetup = () => import('../components/Home/systemSetup.vue');
const Login = () => import('../components/rootGlobal/login.vue');
const Hello = () => import('../components/Home/hello.vue');
const Err401 = () => import('../components/rootGlobal/401.vue');
const empty = () => import('../components/rootGlobal/empty.vue');
const syntheticData = () => import('../components/operationData/comprehensiveOverview/syntheticData.vue');
const registerOrActivate = () => import('../components/operationData/userAnalysis/registerOrActivate.vue');
const heldOutData = () => import('../components/operationData/userAnalysis/heldOutData.vue');
const avgUserTime = () => import('../components/operationData/userAnalysis/avgUserTime.vue');
const levelSpread = () => import('../components/operationData/userAnalysis/levelSpread.vue');
const dayTaskData = () => import('../components/operationData/userAnalysis/dayTaskData.vue');
const achieveTaskData = () => import('../components/operationData/userAnalysis/achieveTaskData.vue');
const financialDaily  = () => import( '../components/operationData/rechargeConsumption/financialDaily.vue');//财务日报
const dailyRealTimeRecharge  = () => import( '../components/operationData/rechargeConsumption/dailyRealTimeRecharge.vue');//每日实时充值数据
const payUserDataList  = () => import( '../components/operationData/rechargeConsumption/payUserDataList.vue');//付费用户数据
const vipMemberData  = () => import( '../components/operationData/rechargeConsumption/vipMemberData.vue');// vip会员数据
const rechargeCount  = () => import( '../components/operationData/rechargeConsumption/rechargeCount');//充值金额统计
const giftDataList  = () => import( '../components/operationData/rechargeConsumption/giftDataList.vue');//礼物数据统计
const chatCurrencyStatistics  = () => import( '../components/operationData/rechargeConsumption/chatCurrencyStatistics.vue');//聊币数据统计
const chatTicketStatistics  = () => import( '../components/operationData/rechargeConsumption/chatTicketStatistics.vue');//聊票数据统计
const roomSubsidyTotal  = () => import( '../components/operationData/rechargeConsumption/roomSubsidyTotal.vue');//房间补贴统计
const mallSalesStatistics  = () => import( '../components/operationData/rechargeConsumption/mallSalesStatistics.vue');//商城销售统计
const callDataSummary  = () => import( '../components/operationSupport/callLog/CallDataSummary.vue');//通话数据汇总
const timeMatching  = () => import( '../components/operationSupport/callLog/timeMatching.vue');//实时详情
const realTimeCall  = () => import( '../components/operationSupport/callLog/realTimeCall.vue');//实时通话次数
const randomCallSummary  = () => import( '../components/operationSupport/callLog/randomCallSummary');//随机通话汇总
const hotLineSummary  = () => import( '../components/operationSupport/callLog/hotlineCallSummary.vue');//网红通话汇总
const friendsCallSummary  = () => import( '../components/operationSupport/callLog/friendsCallSummary.vue');//好友通话汇总
const eavesdroppingSummary  = () => import( '../components/operationSupport/callLog/eavesdroppingSummary.vue');//偷听汇总
const GrabChatDataSummary  = () => import( '../components/operationSupport/callLog/GrabChatDataSummary.vue');//抢聊通话汇总
const newRecordingAddList  = () => import( '../components/operationSupport/callLog/newRecordingAddList.vue');//每日新增录音统计
const imMessageStatistics  = () => import( '../components/operationData/operationDataStatistics/imMessageStatistics.vue');//IM消息统计
const h5ShareStatistics  = () => import( '../components/operationData/operationDataStatistics/h5ShareStatistics.vue');//分享页数据统计
const newUserCastDatalist  = () => import( '../components/operationData/operationDataStatistics/newUserCastDatalist.vue');//新用户红包领取统计
const propTotalData  = () => import( '../components/operationData/operationDataStatistics/propTotalData.vue');//道具统计
const channelManagement  = () => import( '../components/operationData/channelData/channelManagement.vue');//渠道管理
const channelDataList  = () => import( '../components/operationData/channelData/channelDataList.vue');//分渠道数据
const roomTabDataInfo  = () => import( '../components/operationData/operationDataStatistics/roomTabDataInfo.vue');//房间功能标签使用统计
const idReview  = () => import( '../components/userManagement/userInformationManagement/idReview.vue');//用户认证审核(可操作)
const idReviewList  = () => import( '../components/userManagement/userInformationManagement/idReviewList.vue');//用户认证审核列表
const userComplaintsList  = () => import( '../components/userManagement/userInformationManagement/userComplaintsList.vue');//用户投诉处理
const openCloseList  = () => import( '../components/userManagement/userInformationManagement/openCloseList.vue');//账号封禁记录（可封禁）
const recordingComplaints  = () => import( '../components/userManagement/userInformationManagement/recordingComplaints.vue');//录音投诉管理
const girlsRanking  = () => import( '../components/userManagement/userInformationManagement/girlsRanking.vue');//女性魅力值
const propRecordList  = () => import( '../components/userManagement/userInformationManagement/propRecordList.vue');//道具流水
const rechargeList  = () => import( '../components/userManagement/userInformationManagement/rechargeList.vue');//充值排行榜
const incomeList  = () => import( '../components/userManagement/userInformationManagement/incomeList.vue');//收入排行榜
const newUserRedPackage  = () => import( '../components/userManagement/userInformationManagement/newUserRedPackage.vue');// 新用户红包领取查询
const giftGiveRecord  = () => import( '../components/userManagement/userInformationManagement/giftGiveRecord.vue');//礼物赠送查询
const userCurrencyDetailQuery  = () => import( '../components/userManagement/userInformationManagement/userCurrencyDetailQuery.vue');//用户货币明细查询
const banImEiIpRecord  = () => import( '../components/userManagement/userInformationManagement/banImEiIpRecord.vue');//设备及ip封禁管理
const userQueryList  = () => import( '../components/userManagement/userInformationManagement/userQueryList.vue');//用户信息查询
const answers  = () => import( '../components/userManagement/userInformationManagement/answers.vue');//注册答题明细
const taskDataList  = () => import( '../components/userManagement/userInformationManagement/taskDataList.vue');//任务进度查询 
const levelRecordList  = () => import( '../components/userManagement/userInformationManagement/levelRecordList.vue');//等级流水查询 
const familyManage  = () => import( '../components/userManagement/householdManagement/familyManage.vue');//家族查询
const liveBroadCast  = () => import( '../components/userManagement/householdManagement/liveBroadCastManage.vue');//房间数据和记录
const roomConsumptionFlow  = () => import( '../components/userManagement/householdManagement/roomConsumptionFlowManage.vue');//房间消费流水
const changeFamilyGrade  = () => import( '../components/userManagement/householdManagement/changeFamilyGrade.vue');//修改家族等级
const familyAccountManagement  = () => import( '../components/userManagement/householdManagement/familyAccountManagement.vue');//家族账号管理
const familyDissolve  = () => import( '../components/userManagement/householdManagement/familyDissolve.vue');// 家族解散
const blacklist  = () => import( '../components/userManagement/householdManagement/blacklist.vue');//黑名单
const familyHonourList  = () => import( '../components/userManagement/householdManagement/familyHonourList.vue');// 家族荣耀榜单
const roomDataInfo  = () => import( '../components/userManagement/householdManagement/roomDataInfo.vue');//房间详细数据
const roomSubsidy  = () => import( '../components/userManagement/householdManagement/roomSubsidy.vue');// 房间流水补贴
const roomCheck  = () => import( '../components/userManagement/householdManagement/roomCheck.vue');//房间考核日志
const changeRoomGrade  = () => import( '../components/userManagement/householdManagement/changeRoomGrade.vue');//修改房间等级
const roomOfficialTabList  = () => import( '../components/userManagement/householdManagement/roomOfficialTabList.vue');//官方标签列表
const kickRecord  = () => import( '../components/userManagement/householdManagement/kickRecord.vue');//房间封禁记录
const roomList  = () => import( '../components/userManagement/householdManagement/roomList.vue');//房间列表
const agentTotalView  = () => import( '../components/userManagement/agentPromotionManagement/agentTotalView.vue');//推广数据总览
const agentPopularize  = () => import( '../components/userManagement/agentPromotionManagement/agentPopularize.vue');//代理推广查询
const agentRanking  = () => import( '../components/userManagement/agentPromotionManagement/agentRanking.vue');//代理排行榜
const agentBindingQuery  = () => import( '../components/userManagement/agentPromotionManagement/agentBindingQuery.vue');//代理绑定查询
const agentList  = () => import( '../components/userManagement/agentPromotionManagement/agentList.vue');// 代理绑定查询记录
const anchorDailyBehaviorDataStatistics  = () => import( '../components/userManagement/anchorsManagement/anchorDailyBehaviorDataStatistics.vue');//主播每日行为数据统计
const anchorDailyDataCollection  = () => import( '../components/userManagement/anchorsManagement/anchorDailyDataCollection.vue');//主播每日数据汇总
const anchorPersonalDataCollection  = () => import( '../components/userManagement/anchorsManagement/anchorPersonalDataCollection.vue');//主播个人数据汇总
const barrageTopicManagement  = () => import( '../components/operationSupport/appContentManagement/barrageTopicManagement.vue');//弹幕话题管理
const newUsersMatchFriends  = () => import( '../components/operationSupport/appContentManagement/newUsersMatchFriends.vue');//新用户匹配好友
const randomLabel  = () => import( '../components/operationSupport/appContentManagement/randomLabel.vue');//随机标签
const randomNickname  = () => import( '../components/operationSupport/appContentManagement/randomNickname.vue');//随机昵称
const randomSignature  = () => import( '../components/operationSupport/appContentManagement/randomSignature.vue');//随机签名
const registeredUserGreeting  = () => import( '../components/operationSupport/appContentManagement/registeredUserGreeting.vue');//注册用户招呼语
const revenueSuspensionWindow  = () => import( '../components/operationSupport/appContentManagement/revenueSuspensionWindow.vue');//收益悬浮窗
const userTabsManage  = () => import( '../components/operationSupport/appContentManagement/userTabsManage.vue');//首页标签管理
const roomTabsManageTest  = () => import( '../components/operationSupport/appContentManagement/roomTabsManageTest.vue');//房间标签管理
const businessCityManagement  = () => import( '../components/operationSupport/operatingTools/businessCityManagement.vue');//商城管理
const activityNotificationManagement  = () => import( '../components/operationSupport/operatingTools/activityNotificationManagement.vue');//活动通知管理
const adRestrictionParameters  = () => import( '../components/operationSupport/operatingTools/adRestrictionParameters.vue');//广告限制次数
const bannerManagement  = () => import( '../components/operationSupport/operatingTools/bannerManagement.vue');//banner管理
const giftManagement  = () => import( '../components/operationSupport/operatingTools/giftManagement.vue');//礼物管理(正式服)
const marqueeManagement  = () => import( '../components/operationSupport/operatingTools/marqueeManagement.vue');//跑马灯管理
const startPageManagement  = () => import( '../components/operationSupport/operatingTools/startPageManagement.vue');//启动页管理
const sendMessageNotifications  = () => import( '../components/operationSupport/operatingTools/sendMessageNotifications.vue');//发送短信通知
const sendSystemNotification  = () => import( '../components/operationSupport/operatingTools/sendSystemNotification.vue');//发送系统通知
const accountManage  = () => import( '../components/operationSupport/operatingTools/accountManage.vue');// 账号修改，注册
const activityFloatWindow  = () => import( '../components/operationSupport/operatingTools/activityFloatWindow.vue');//活动浮窗
const articleManagement  = () => import( '../components/operationSupport/operatingTools/articleManagement.vue');//文章管理
const propList  = () => import( '../components/operationSupport/operatingTools/propList.vue');//礼物列表
// const roomTabDataInfo  = () => import( '../components/operationSupport/operatingTools/roomTabDataInfo.vue');//房间功能标签使用统计
const DailyAdditions  = () => import( '../components/operationSupport/recordingLog/DailyAdditions.vue');//每日新增录音明细
const recordShareManage  = () => import( '../components/operationSupport/recordingLog/recordShareManage.vue');//录音分享卡片
const systemRack  = () => import( '../components/operationSupport/recordingLog/systemRack.vue');//录音下榜列表
const tapeSharingData  = () => import( '../components/operationSupport/recordingLog/tapeSharingData.vue');//分享页推荐录音列表
const wonderfulRecord  = () => import( '../components/operationSupport/recordingLog/wonderfulRecord.vue');//录音精彩内容
const voiceTabManage  = () => import( '../components/operationSupport/recordingLog/voiceTabManage.vue');//录音标签日志
const openCallManage  = () => import( '../components/operationSupport/callLog/openCallManage.vue');//公开通话管理
const callDataDetail  = () => import( '../components/operationSupport/callLog/callDataDetail.vue');//通话记录明细
const GrabChatCallDetails  = () => import( '../components/operationSupport/callLog/GrabChatCallDetails.vue');//抢聊通话明细
const presentAuditReview  = () => import( '../components/operationSupport/financialManagement/presentAuditReview.vue');//提现审核管理（二级）
const presentAuditReviewFirst  = () => import( '../components/operationSupport/financialManagement/presentAuditReviewFirst.vue');//提现审核管理（一级）
const monetaryMembershipApplicationAndRecord  = () => import( '../components/operationSupport/financialManagement/monetaryMembershipApplicationAndRecord.vue');//货币、会员申请管理
const applicationMonyMg  = () => import( '../components/operationSupport/financialManagement/applicationMonyMg.vue');//货币申请及记录
const vipPackageList  = () => import( '../components/operationSupport/financialManagement/vipPackageList.vue');//VIP会员配置列表
const roomSubsidyCheck  = () => import( '../components/operationSupport/financialManagement/roomSubsidyCheck.vue');//房间补贴审核记录
const familyBackstageBackstage  = () => import( '../components/activities/familyBackstageBackstage.vue');//家族活动正式服后台
const roomTopManagement  = () => import( '../components/activities/roomTopManagement.vue');//家族置顶管理
const loveActivityManage  = () => import( '../components/activities/loveActivityManage.vue');//情人节数据统计
const interactionInfo  = () => import( '../components/activities/interactionInfo.vue');//黑色情人节互动信息
const rechargeTheCrowdManagement  = () => import( '../components/activities/rechargeTheCrowdManagement.vue');//充值众筹管理
const youthDay  = () => import( '../components/activities/youthDay.vue');// 五四活动
const wordCupManagement  = () => import( '../components/activities/wordCupManagement.vue');// 世界杯活动
const superTurntable  = () => import( '../components/activities/superTurntable.vue');// 超级转盘
const imageUpload  = () => import( '../components/systemSetup/imageUpload.vue');//图片上传
const globalParameter  = () => import( '../components/systemSetup/globalParameter.vue');//全局参数
const modifyThePassword  = () => import( '../components/systemSetup/modifyThePassword.vue');//密码修改
const accountManagement  = () => import( '../components/systemSetup/accountManagement.vue');//账号管理
const commonPages  = () => import( '../components/systemSetup/commonPages.vue');//常用页面配置
const user  = () => import( '../components/User/richText.vue');//文章编辑
*/ 
// 大板块的引用
import Home from '../components/Home/home.vue';//总的页面
import operationData from '../components/Home/operationData.vue';//运营数据
import userManagement from '../components/Home/userManagement.vue';//用户管理
import operationSupport from '../components/Home/operationSupport.vue';//运营支撑
import activities from '../components/Home/activities.vue';//活动专区
import systemSetup from '../components/Home/systemSetup.vue';//系统设置
import Login from '../components/rootGlobal/login.vue';//登陆页面
// 页面的基本架构
import Hello from '../components/Home/hello.vue';//欢迎界面
import Err401 from '../components/rootGlobal/401.vue';//错误界面
import empty from '../components/rootGlobal/empty.vue';//空组建进行页面进行刷新时使用
// 测试的引用查看数据

// 1、运营数据
// 运营数据start
// 1-1综合概述
// 1-2用户分析
import syntheticData from '../components/operationData/comprehensiveOverview/syntheticData.vue';//综合数据
import registerOrActivate from '../components/operationData/userAnalysis/registerOrActivate.vue';//激活与注册
import heldOutData from '../components/operationData/userAnalysis/heldOutData.vue';//留存数据
import activeUser from '../components/operationData/userAnalysis/activeUser.vue';//活跃用户
import realTimeOnLine from '../components/operationData/userAnalysis/realTimeOnLine.vue';//实时在线
// import onlineDistribute from '../components/operationData/userAnalysis/onlineDistribute.vue';//在线时长分布
import avgUserTime from '../components/operationData/userAnalysis/avgUserTime.vue';//人均使用时长
import levelSpread from '../components/operationData/userAnalysis/levelSpread.vue';//等级分布
import dayTaskData from '../components/operationData/userAnalysis/dayTaskData.vue';//每日任务统计
import achieveTaskData from '../components/operationData/userAnalysis/achieveTaskData.vue';//成就任务统计
// 1-3充值与消费

import financialDaily from '../components/operationData/rechargeConsumption/financialDaily.vue';//财务日报
import dailyRealTimeRecharge from '../components/operationData/rechargeConsumption/dailyRealTimeRecharge.vue';//每日实时充值数据
import payUserDataList from '../components/operationData/rechargeConsumption/payUserDataList.vue';//付费用户数据
import vipMemberData from '../components/operationData/rechargeConsumption/vipMemberData.vue';// vip会员数据
import rechargeCount from '../components/operationData/rechargeConsumption/rechargeCount';//充值金额统计
import giftDataList from '../components/operationData/rechargeConsumption/giftDataList.vue';//礼物数据统计
import chatCurrencyStatistics from '../components/operationData/rechargeConsumption/chatCurrencyStatistics.vue';//聊币数据统计
import chatTicketStatistics from '../components/operationData/rechargeConsumption/chatTicketStatistics.vue';//聊票数据统计
import roomSubsidyTotal from '../components/operationData/rechargeConsumption/roomSubsidyTotal.vue';//房间补贴统计
import mallSalesStatistics from '../components/operationData/rechargeConsumption/mallSalesStatistics.vue';//商城销售统计

// 1-4通话数据统计
import callDataSummary from '../components/operationSupport/callLog/CallDataSummary.vue';//通话数据汇总
import timeMatching from '../components/operationSupport/callLog/timeMatching.vue';//实时详情
import realTimeCall from '../components/operationSupport/callLog/realTimeCall.vue';//实时通话次数
import randomCallSummary from '../components/operationSupport/callLog/randomCallSummary';//随机通话汇总
import hotLineSummary from '../components/operationSupport/callLog/hotlineCallSummary.vue';//网红通话汇总
import friendsCallSummary from '../components/operationSupport/callLog/friendsCallSummary.vue';//好友通话汇总
import eavesdroppingSummary from '../components/operationSupport/callLog/eavesdroppingSummary.vue';//偷听汇总
import GrabChatDataSummary from '../components/operationSupport/callLog/GrabChatDataSummary.vue';//抢聊通话汇总
import newRecordingAddList from '../components/operationSupport/callLog/newRecordingAddList.vue';//每日新增录音统计
// 1-5运营数据统计
import imMessageStatistics from '../components/operationData/operationDataStatistics/imMessageStatistics.vue';//IM消息统计
import h5ShareStatistics from '../components/operationData/operationDataStatistics/h5ShareStatistics.vue';//分享页数据统计
import newUserCastDatalist from '../components/operationData/operationDataStatistics/newUserCastDatalist.vue';//新用户红包领取统计
import propTotalData from '../components/operationData/operationDataStatistics/propTotalData.vue';//道具统计
// 1-1渠道数据
import channelManagement from '../components/operationData/channelData/channelManagement.vue';//渠道管理
import channelDataList from '../components/operationData/channelData/channelDataList.vue';//分渠道数据
import roomTabDataInfo from '../components/operationData/operationDataStatistics/roomTabDataInfo.vue';//房间功能标签使用统计

// 运营数据end

// 2、用户管理
// 用户管理start
// 2-1用户信息管理
import idReview from '../components/userManagement/userInformationManagement/idReview.vue';//用户认证审核(可操作
import idReviewList from '../components/userManagement/userInformationManagement/idReviewList.vue';//用户认证审核列表
import userComplaintsList from '../components/userManagement/userInformationManagement/userComplaintsList.vue';//用户投诉处理
import openCloseList from '../components/userManagement/userInformationManagement/openCloseList.vue';//账号封禁记录（可封禁）
import recordingComplaints from '../components/userManagement/userInformationManagement/recordingComplaints.vue';//录音投诉管理
import girlsRanking from '../components/userManagement/userInformationManagement/girlsRanking.vue';//女性魅力值
import propRecordList from '../components/userManagement/userInformationManagement/propRecordList.vue';//道具流水
import rechargeList from '../components/userManagement/userInformationManagement/rechargeList.vue';//充值排行榜
import incomeList from '../components/userManagement/userInformationManagement/incomeList.vue';//收入排行榜
import newUserRedPackage from '../components/userManagement/userInformationManagement/newUserRedPackage.vue';// 新用户红包领取查询
import giftGiveRecord from '../components/userManagement/userInformationManagement/giftGiveRecord.vue';//礼物赠送查询
import userCurrencyDetailQuery from '../components/userManagement/userInformationManagement/userCurrencyDetailQuery.vue';//用户货币明细查询
import banImEiIpRecord from '../components/userManagement/userInformationManagement/banImEiIpRecord.vue';//设备及ip封禁管理
import userQueryList from '../components/userManagement/userInformationManagement/userQueryList.vue';//用户信息查询
import answers from '../components/userManagement/userInformationManagement/answers.vue';//注册答题明细
import taskDataList from '../components/userManagement/userInformationManagement/taskDataList.vue';//任务进度查询 
import levelRecordList from '../components/userManagement/userInformationManagement/levelRecordList.vue';//等级流水查询 

// 2-2家族管理
import familyManage from '../components/userManagement/householdManagement/familyManage.vue';//家族查询
import liveBroadCast from '../components/userManagement/householdManagement/liveBroadCastManage.vue';//房间数据和记录
import roomConsumptionFlow from '../components/userManagement/householdManagement/roomConsumptionFlowManage.vue';//房间消费流水
import changeFamilyGrade from '../components/userManagement/householdManagement/changeFamilyGrade.vue';//修改家族等级
import familyAccountManagement from '../components/userManagement/householdManagement/familyAccountManagement.vue';//家族账号管理
import familyDissolve from '../components/userManagement/householdManagement/familyDissolve.vue';// 家族解散
import blacklist from '../components/userManagement/householdManagement/blacklist.vue';//黑名单
import familyHonourList from '../components/userManagement/householdManagement/familyHonourList.vue';// 家族荣耀榜单
import roomDataInfo from '../components/userManagement/householdManagement/roomDataInfo.vue';//房间详细数据
import roomSubsidy from '../components/userManagement/householdManagement/roomSubsidy.vue';// 房间流水补贴
import roomCheck from '../components/userManagement/householdManagement/roomCheck.vue';//房间考核日志
import changeRoomGrade from '../components/userManagement/householdManagement/changeRoomGrade.vue';//修改房间等级
import roomOfficialTabList from '../components/userManagement/householdManagement/roomOfficialTabList.vue';//官方标签列表
import kickRecord from '../components/userManagement/householdManagement/kickRecord.vue';//房间封禁记录
import roomList from '../components/userManagement/householdManagement/roomList.vue';//房间列表

// 2-3代理推广管理
import agentTotalView from '../components/userManagement/agentPromotionManagement/agentTotalView.vue';//推广数据总览
import agentPopularize from '../components/userManagement/agentPromotionManagement/agentPopularize.vue';//代理推广查询
import agentRanking from '../components/userManagement/agentPromotionManagement/agentRanking.vue';//代理排行榜
import agentBindingQuery from '../components/userManagement/agentPromotionManagement/agentBindingQuery.vue';//代理绑定查询
import agentList from '../components/userManagement/agentPromotionManagement/agentList.vue';// 代理绑定查询记录
// 2-4主播管理
import anchorDailyBehaviorDataStatistics from '../components/userManagement/anchorsManagement/anchorDailyBehaviorDataStatistics.vue';//主播每日行为数据统计
import anchorDailyDataCollection from '../components/userManagement/anchorsManagement/anchorDailyDataCollection.vue';//主播每日数据汇总
import anchorPersonalDataCollection from '../components/userManagement/anchorsManagement/anchorPersonalDataCollection.vue';//主播个人数据汇总
// 用户管理end

// 3、运营支撑**
// 运营支撑start
// 3-1、app内容管理
import barrageTopicManagement from '../components/operationSupport/appContentManagement/barrageTopicManagement.vue';//弹幕话题管理
import newUsersMatchFriends from '../components/operationSupport/appContentManagement/newUsersMatchFriends.vue';//新用户匹配好友
import randomLabel from '../components/operationSupport/appContentManagement/randomLabel.vue';//随机标签
import randomNickname from '../components/operationSupport/appContentManagement/randomNickname.vue';//随机昵称
import randomSignature from '../components/operationSupport/appContentManagement/randomSignature.vue';//随机签名
import registeredUserGreeting from '../components/operationSupport/appContentManagement/registeredUserGreeting.vue';//注册用户招呼语
import revenueSuspensionWindow from '../components/operationSupport/appContentManagement/revenueSuspensionWindow.vue';//收益悬浮窗
import userTabsManage from '../components/operationSupport/appContentManagement/userTabsManage.vue';//首页标签管理
import roomTabsManageTest from '../components/operationSupport/appContentManagement/roomTabsManageTest.vue';//房间标签管理
// 3-2、运营工具
import businessCityManagement from '../components/operationSupport/operatingTools/businessCityManagement.vue';//商城管理
import activityNotificationManagement from '../components/operationSupport/operatingTools/activityNotificationManagement.vue';//活动通知管理
import adRestrictionParameters from '../components/operationSupport/operatingTools/adRestrictionParameters.vue';//广告限制次数
import bannerManagement from '../components/operationSupport/operatingTools/bannerManagement.vue';//banner管理
import giftManagement from '../components/operationSupport/operatingTools/giftManagement.vue';//礼物管理(正式服
import marqueeManagement from '../components/operationSupport/operatingTools/marqueeManagement.vue';//跑马灯管理
import startPageManagement from '../components/operationSupport/operatingTools/startPageManagement.vue';//启动页管理
import sendMessageNotifications from '../components/operationSupport/operatingTools/sendMessageNotifications.vue';//发送短信通知
import sendSystemNotification from '../components/operationSupport/operatingTools/sendSystemNotification.vue';//发送系统通知
import accountManage from '../components/operationSupport/operatingTools/accountManage.vue';// 账号修改，注册
import activityFloatWindow from '../components/operationSupport/operatingTools/activityFloatWindow.vue';//活动浮窗
import articleManagement from '../components/operationSupport/operatingTools/articleManagement.vue';//文章管理
import propList from '../components/operationSupport/operatingTools/propList.vue';//礼物列表
// import roomTabDataInfo from '../components/operationSupport/operatingTools/roomTabDataInfo.vue';//房间功能标签使用统计
// 3-3、录音日志
import DailyAdditions from '../components/operationSupport/recordingLog/DailyAdditions.vue';//每日新增录音明细
import recordShareManage from '../components/operationSupport/recordingLog/recordShareManage.vue';//录音分享卡片
import systemRack from '../components/operationSupport/recordingLog/systemRack.vue';//录音下榜列表
import tapeSharingData from '../components/operationSupport/recordingLog/tapeSharingData.vue';//分享页推荐录音列表
import wonderfulRecord from '../components/operationSupport/recordingLog/wonderfulRecord.vue';//录音精彩内容
import voiceTabManage from '../components/operationSupport/recordingLog/voiceTabManage.vue';//录音标签日志
// 3-4、通话日志
import openCallManage from '../components/operationSupport/callLog/openCallManage.vue';//公开通话管理
import callDataDetail from '../components/operationSupport/callLog/callDataDetail.vue';//通话记录明细
import GrabChatCallDetails from '../components/operationSupport/callLog/GrabChatCallDetails.vue';//抢聊通话明细
// 3-5、财务管理
import presentAuditReview from '../components/operationSupport/financialManagement/presentAuditReview.vue';//提现审核管理（二级）
import presentAuditReviewFirst from '../components/operationSupport/financialManagement/presentAuditReviewFirst.vue';//提现审核管理（一级）
import monetaryMembershipApplicationAndRecord from '../components/operationSupport/financialManagement/monetaryMembershipApplicationAndRecord.vue';//货币、会员申请管理
import applicationMonyMg from '../components/operationSupport/financialManagement/applicationMonyMg.vue';//货币申请及记录
import vipPackageList from '../components/operationSupport/financialManagement/vipPackageList.vue';//VIP会员配置列表
import roomSubsidyCheck from '../components/operationSupport/financialManagement/roomSubsidyCheck.vue';//房间补贴审核记录
// 运营支撑end

// 4、活动专区
// 活动专区start
import familyBackstageBackstage from '../components/activities/familyBackstageBackstage.vue';//家族活动正式服后台
import roomTopManagement from '../components/activities/roomTopManagement.vue';//家族置顶管理
import loveActivityManage from '../components/activities/loveActivityManage.vue';//情人节数据统计
import interactionInfo from '../components/activities/interactionInfo.vue';//黑色情人节互动信息
import rechargeTheCrowdManagement from '../components/activities/rechargeTheCrowdManagement.vue';//充值众筹管理
import youthDay from '../components/activities/youthDay.vue';// 五四活动
import wordCupManagement from '../components/activities/wordCupManagement.vue';// 世界杯活动
import superTurntable from '../components/activities/superTurntable.vue';// 超级转盘
import tanabataActivity from '../components/activities/tanabataActivity.vue';// 七夕活动
import smashGoldEggs from '../components/activities/smashGoldEggs.vue';// 砸金蛋活动
import robotManagement from '../components/activities/robotManagement.vue';// 机器人管理

// 活动专区end
// 5、系统设置
// 系统设置start
import imageUpload from '../components/systemSetup/imageUpload.vue';//图片上传
import globalParameter from '../components/systemSetup/globalParameter.vue';//全局参数
import modifyThePassword from '../components/systemSetup/modifyThePassword.vue';//密码修改
import accountManagement from '../components/systemSetup/accountManagement.vue';//账号管理
import commonPages from '../components/systemSetup/commonPages.vue';//常用页面配置
// 系统设置end

// 留存测试填充数据
import user from '../components/User/richText.vue';//文章编辑

// 把router 引用进入vue
Vue.use(VueRouter);
// 定义出现的权限判断
// T1、T2、P1、P2、O1、O2、M、C、G
// 所有权限通用路由表
// 如首页和登录页和一些不用权限的公共页面
export const constantRouterMap = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true, //hidden为自定义属性，如果hidden为true则不显示在sidebar侧边栏中
    },
    {
        path: '/home',
        component: Home,
        name: '',
        hidden: true,
        children: [
            { path: '/hello', component: Hello, name: '欢迎', hidden: true },
            { path: '/401', component: Err401, name: '401' },
        ],
    },
    {
        path: '/empty',
        component: empty,
        name: '',
        hidden: true,
    },
];
// 实例化vue的时候只挂载constantRouterMap
export default new VueRouter({
    // 默认不开启history的模式，进行相应的hash模式
    // mode: 'history',
    routes: constantRouterMap,
});
// 异步挂载的路由
// 动态需要根据权限加载的路由表
export const asyncRouterMap = [
    // 运营数据
    {
        path: '/operationData',
        component: Home,
        name: '运营数据',
        meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M', 'G'] },
        children: [
            {
                path: '/operationData',
                component: operationData,
                name: '综合概况',
                iconCls: 'el-icon-menu',
                hidden: false,
                meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M'] },
                children: [
                    { path: '/operationData/comprehensiveOverview/syntheticData', component: syntheticData, name: '综合数据', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M'] } },
                ],
            },
            {
                path: '/operationData',
                component: operationData,
                name: '用户分析',
                iconCls: 'el-icon-menu',
                hidden: false,
                meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M'] },
                children: [
                    { path: '/operationData/userAnalysis/registerOrActivate', component: registerOrActivate, name: '激活与注册', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M'] } },                    
                    { path: '/operationData/userAnalysis/heldOutData', component: heldOutData, name: '留存数据', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M'] } },                    
                    { path: '/operationData/userAnalysis/activeUser', component: activeUser, name: '活跃用户', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M'] } },                    
                    { path: '/operationData/userAnalysis/realTimeOnLine', component: realTimeOnLine, name: '实时在线', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M'] } },                    
                    { path: '/operationData/userAnalysis/user', component: user, name: '日活用户行为', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M'] } },                    
                    { path: '/operationData/userAnalysis/user', component: user, name: '每日在线人数', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M'] } },                    
                    { path: '/operationData/userAnalysis/avgUserTime', component: avgUserTime, name: '人均使用时长', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M'] } },                    
                    { path: '/operationData/userAnalysis/user', component: user, name: '使用频率', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M'] } },                    
                    // { path: '/operationData/userAnalysis/onlineDistribute', component: onlineDistribute, name: '在线时长分布', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M'] } },                    
                    { path: '/operationData/userAnalysis/levelSpread', component: levelSpread, name: '等级分布查询', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M'] } },                    
                    { path: '/operationData/userAnalysis/dayTaskData', component: dayTaskData, name: '每日任务统计', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M'] } },                    
                    { path: '/operationData/userAnalysis/achieveTaskData', component: achieveTaskData, name: '成就任务统计', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M'] } },                    
                    
                     
                ],
            },
            {
                path: '/operationData',
                component: operationData,
                name: '充值与消费',
                iconCls: 'el-icon-menu',
                hidden: false,
                meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M'] },
                children: [
                    { path: '/operationData/rechargeConsumption/financialDaily', component: financialDaily, name: '财务日报', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M'] } },                    
                    { path: '/operationData/rechargeConsumption/dailyRealTimeRecharge', component: dailyRealTimeRecharge, name: '分时充值详情', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M'] } },                    
                    { path: '/operationData/rechargeConsumption/payUserDataList', component: payUserDataList, name: '付费用户数据', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M'] } },                    
                    { path: '/operationData/rechargeConsumption/chatCurrencyStatistics', component: chatCurrencyStatistics, name: '聊币数据统计', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M'] } },                    
                    { path: '/operationData/rechargeConsumption/chatTicketStatistics', component: chatTicketStatistics, name: '聊票数据统计', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M'] } },                    
                    { path: '/operationData/rechargeConsumption/giftDataList', component: giftDataList, name: '礼物数据统计', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M'] } },                    
                    { path: '/operationData/rechargeConsumption/vipMemberData', component: vipMemberData, name: 'VIP会员充值数据', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M'] } },                    
                    { path: '/operationData/rechargeConsumption/rechargeCount', component: rechargeCount, name: '充值金额统计', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M'] } },                    
                    { path: '/operationData/rechargeConsumption/roomSubsidyTotal', component: roomSubsidyTotal, name: '房间补贴统计', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M'] } },                    
                    { path: '/operationData/rechargeConsumption/mallSalesStatistics', component: mallSalesStatistics, name: '商城销售统计', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M'] } },                    
                ],
            },
            {
                path: '/operationData',
                component: operationData,
                name: '通话数据统计',
                iconCls: 'el-icon-menu',
                hidden: false,
                meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M'] },
                children: [
                    { path: '/operationData/callLog/callDataSummary', component: callDataSummary, name: '通话数据汇总', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M'] } },                    
                    { path: '/operationData/callLog/timeMatching', component: timeMatching, name: '实时匹配详情', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M'] } },                    
                    { path: '/operationData/callLog/realTimeCall', component: realTimeCall, name: '实时通话次数', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M'] } },                    
                    { path: '/operationData/callLog/randomCallSummary', component: randomCallSummary, name: '随机通话汇总', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M'] } },                    
                    { path: '/operationData/callLog/hotLineSummary', component: hotLineSummary, name: '网红通话汇总', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M'] } },                    
                    { path: '/operationData/callLog/friendsCallSummary', component: friendsCallSummary, name: '好友通话汇总', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M'] } },                    
                    { path: '/operationData/callLog/eavesdroppingSummary', component: eavesdroppingSummary, name: '偷听汇总', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M'] } },                    
                    { path: '/operationData/callLog/GrabChatDataSummary', component: GrabChatDataSummary, name: '抢聊通话汇总', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M'] } },                    
                    { path: '/operationData/callLog/newRecordingAddList', component: newRecordingAddList, name: '录音数据统计', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M'] } },                    
                ],
            },
            {
                path: '/operationData',
                component: operationData,
                name: '运营数据统计',
                iconCls: 'el-icon-menu',
                hidden: false,
                meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M'] },
                children: [
                    { path: '/operationData/operationDataStatistics/newUserCastDatalist', component: newUserCastDatalist, name: '新用户红包领取统计', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M'] } },                    
                    { path: '/operationData/operationDataStatistics/h5ShareStatistics', component: h5ShareStatistics, name: '分享页数据统计', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M'] } },                    
                    { path: '/operationData/operationDataStatistics/im', component: imMessageStatistics, name: 'IM消息统计', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M'] } },                    
                    { path: '/operationSupport/operationDataStatistics/roomTabDataInfo', component: roomTabDataInfo, name: '房间功能标签使用统计', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },                  
                    { path: '/operationSupport/operationDataStatistics/propTotalData', component: propTotalData, name: '道具统计', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },                  
                ],
            },
            {
                path: '/operationData',
                component: operationData,
                name: '渠道数据',
                iconCls: 'el-icon-menu',
                hidden: false,
                meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M', 'G'] },
                children: [
                    { path: '/operationData/channelData/channelDataList', component: channelDataList, name: '分渠道数据', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M', 'G'] } },                    
                    { path: '/operationData/channelData/channelManagement', component: channelManagement, name: '渠道管理', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M'] } },  
                ],
            },
        ],
    },
    // 用户管理
    {
        path: '/userManagement',
        component: Home,
        name: '用户管理',
        meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M', 'C'] },
        children: [
            {
                path: '/userManagement',
                component: userManagement,
                name: '用户信息管理',
                iconCls: 'el-icon-menu',
                hidden: false,
                meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M', 'C'] },
                children: [
                    { path: '/userManagement/userInformationManagement/userQueryList', component: userQueryList, name: '用户信息查询', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M', 'C'] } },                                        
                    // { path: '/userManagement/userInformationManagement/user', component: user, name: '置顶网红管理', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'C'] } },                                        
                    { path: '/userManagement/userInformationManagement/idReview', component: idReview, name: '用户认证审核（可操作）', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'C'] } },                                        
                    { path: '/userManagement/userInformationManagement/idReviewList', component: idReviewList, name: '用户认证审核列表', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'C'] } },                                        
                    { path: '/userManagement/userInformationManagement/userComplaintsList', component: userComplaintsList, name: '用户投诉处理', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'C'] } },                                        
                    { path: '/userManagement/userInformationManagement/openCloseList', component: openCloseList, name: '账号封禁记录（可解禁）', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'C'] } },                                        
                    { path: '/userManagement/userInformationManagement/recordingComplaints', component: recordingComplaints, name: '录音投诉处理', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'C'] } },                                        
                    { path: '/userManagement/userInformationManagement/banImEiIpRecord', component: banImEiIpRecord, name: '设备及IP封禁管理', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'C'] } },                                        
                    { path: '/userManagement/userInformationManagement/userCurrencyDetailQuery', component: userCurrencyDetailQuery, name: '货币流水查询', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'C'] } },                                        
                    { path: '/userManagement/userInformationManagement/giftGiveRecord', component: giftGiveRecord, name: '礼物赠送查询', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'C'] } },                                        
                    { path: '/userManagement/userInformationManagement/propRecordList', component: propRecordList, name: '道具流水查询', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'C'] } },                                        
                    { path: '/userManagement/userInformationManagement/newUserRedPackage', component: newUserRedPackage, name: '新用户红包领取查询', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'C'] } },                                        
                    { path: '/userManagement/userInformationManagement/user', component: user, name: '用户登录查询', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'C'] } },                                        
                    { path: '/userManagement/userInformationManagement/rechargeList', component: rechargeList, name: '充值排行榜', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'C'] } },                                        
                    { path: '/userManagement/userInformationManagement/incomeList', component: incomeList, name: '收入排行榜', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'C'] } },                                        
                    { path: '/userManagement/userInformationManagement/girlsRanking', component: girlsRanking, name: '女性魅力值', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'C'] } },                                        
                    { path: '/userManagement/userInformationManagement/answers', component: answers, name: '注册答题明细', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'C'] } },                                        
                    { path: '/userManagement/userInformationManagement/taskDataList', component: taskDataList, name: '任务进度查询', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'C'] } },                                        
                    { path: '/userManagement/userInformationManagement/levelRecordList', component: levelRecordList, name: '等级流水查询', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'C'] } },                                        
                    
                ],
            },
            {
                path: '/userManagement',
                component: userManagement,
                name: '家族管理',
                iconCls: 'el-icon-menu',
                hidden: false,
                meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'C'] },
                children: [
                    { path: '/userManagement/householdManagement/familyManage', component: familyManage, name: '家族查询', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'C'] } },
                    { path: '/userManagement/householdManagement/familyHonourList', component: familyHonourList, name: '家族荣耀榜', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'C'] } },
                    { path: '/userManagement/householdManagement/blacklist', component: blacklist, name: '黑名单', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },
                    { path: '/userManagement/householdManagement/familyDissolve', component: familyDissolve, name: '解散家族', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },
                    { path: '/userManagement/householdManagement/changeFamilyGrade', component: changeFamilyGrade, name: '修改家族等级', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },
                    { path: '/userManagement/householdManagement/familyAccountManagement', component: familyAccountManagement, name: '家族账号管理', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },
                    { path: '/userManagement/householdManagement/roomList', component: roomList, name: '房间列表', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },
                    { path: '/userManagement/householdManagement/roomDataInfo', component: roomDataInfo, name: '房间详细数据', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'C'] } },
                    // { path: '/userManagement/householdManagement/liveBroadCast', component: liveBroadCast, name: '房间数据和记录', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'C'] } },
                    { path: '/userManagement/householdManagement/roomConsumptionFlow', component: roomConsumptionFlow, name: '房间消费流水', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'C'] } },
                    { path: '/userManagement/householdManagement/roomSubsidy', component: roomSubsidy, name: '房间流水补贴', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },
                    { path: '/userManagement/householdManagement/roomCheck', component: roomCheck, name: '房间考核日志', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },
                    // { path: '/userManagement/householdManagement/roomTopManagement', component: roomTopManagement, name: '房间置顶管理', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },
                    { path: '/userManagement/householdManagement/changeRoomGrade', component: changeRoomGrade, name: '修改房间等级', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },
                    { path: '/userManagement/householdManagement/roomOfficialTabList', component: roomOfficialTabList, name: '官方标签列表', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },
                    { path: '/userManagement/householdManagement/kickRecord', component: kickRecord, name: '房间封禁记录', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },
                    
                ],
            },
            {
                path: '/userManagement',
                component: userManagement,
                name: '代理推广管理',
                iconCls: 'el-icon-menu',
                hidden: false,
                meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M', 'C'] },
                children: [
                    { path: '/userManagement/agentPromotionManagement/agentTotalView', component: agentTotalView, name: '推广数据总览', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M', 'C'] } },
                    { path: '/userManagement/agentPromotionManagement/agentPopularize', component: agentPopularize, name: '代理推广查询', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M', 'C'] } },
                    { path: '/userManagement/agentPromotionManagement/agentRanking', component: agentRanking, name: '代理排行榜', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M', 'C'] } },
                    { path: '/userManagement/agentPromotionManagement/agentBindingQuery', component: agentBindingQuery, name: '代理绑定查询', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M'] } },
                    { path: '/userManagement/agentPromotionManagement/agentList', component: agentList, name: '代理绑定操作记录', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M'] } },                    
                ],
            },
            {
                path: '/userManagement',
                component: userManagement,
                name: '主播管理',
                iconCls: 'el-icon-menu',
                hidden: false,
                meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'C'] },
                children: [
                    { path: '/userManagement/anchorsManagement/anchorDailyBehaviorDataStatistics', component: anchorDailyBehaviorDataStatistics, name: '主播每日行为数据统计', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'C'] } },
                    { path: '/userManagement/anchorsManagement/anchorDailyDataCollection', component: anchorDailyDataCollection, name: '主播每日数据汇总', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'C'] } },
                    { path: '/userManagement/anchorsManagement/anchorPersonalDataCollection', component: anchorPersonalDataCollection, name: '主播个人数据汇总', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'C'] } },
                ],
            },
        ],
    },
    // 运营支撑
    {
        path: '/operationSupport',
        component: Home,
        name: '运营支撑',
        meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M', 'C'] },
        children: [
            {
                path: '/operationSupport',
                component: operationSupport,
                name: '财务管理',
                iconCls: 'el-icon-menu',
                hidden: false,
                meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] },
                children: [
                    { path: '/operationSupport/financialManagement/presentAuditReviewFirst', component: presentAuditReviewFirst, name: '提现审核管理(二次审核)', hidden: false, meta: { role: ['T1', 'P1', 'O1'] } },
                    { path: '/operationSupport/financialManagement/presentAuditReview', component: presentAuditReview, name: '提现审核管理(运营)', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },
                    { path: '/operationSupport/financialManagement/monetaryMembershipApplicationAndRecord', component: monetaryMembershipApplicationAndRecord, name: '货币、会员申请', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },
                    { path: '/operationSupport/financialManagement/applicationMonyMg', component: applicationMonyMg, name: '货币、会员申请审核', hidden: false, meta: { role: ['T1', 'P1'] } },
                    { path: '/operationSupport/financialManagement/vipPackageList', component: vipPackageList, name: '会员配置列表', hidden: false, meta: { role: ['T1', 'P1'] } },
                    { path: '/operationSupport/financialManagement/roomSubsidyCheck', component: roomSubsidyCheck, name: '房间补贴审核', hidden: false, meta: { role: ['T1', 'P1'] } },
                    
                ],
            },
            {
                path: '/operationSupport',
                component: operationSupport,
                name: '运营工具',
                iconCls: 'el-icon-menu',
                hidden: false,
                meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] },
                children: [
                    { path: '/operationSupport/operatingTools/giftManagement', component: giftManagement, name: '礼物管理', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },
                    { path: '/operationSupport/operatingTools/bannerManagement', component: bannerManagement, name: 'banner条管理', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },
                    { path: '/operationSupport/operatingTools/sendSystemNotification', component: sendSystemNotification, name: '发送系统通知', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },
                    { path: '/operationSupport/operatingTools/marqueeManagement', component: marqueeManagement, name: '跑马灯管理', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },
                    { path: '/operationSupport/operatingTools/activityNotificationManagement', component: activityNotificationManagement, name: '活动通知管理', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },
                    { path: '/operationSupport/operatingTools/startPageManagement', component: startPageManagement, name: '启动页管理', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },
                    { path: '/operationSupport/operatingTools/sendMessageNotifications', component: sendMessageNotifications, name: '发送手机短信', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },
                    { path: '/operationSupport/operatingTools/adRestrictionParameters', component: adRestrictionParameters, name: '广告限制次数', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },
                    { path: '/operationSupport/operatingTools/accountManage', component: accountManage, name: '账号修改，注册', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },                    
                    { path: '/operationSupport/operatingTools/activityFloatWindow', component: activityFloatWindow, name: '活动浮窗', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },                    
                    { path: '/operationSupport/operatingTools/articleManagement', component: articleManagement, name: '文章管理', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },
                    { path: '/operationSupport/operatingTools/propList', component: propList, name: '道具列表', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },
                    { path: '/operationSupport/operatingTools/businessCityManagement', component: businessCityManagement, name: '商城管理', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },
                    
                ],
            },
            {
                path: '/operationSupport',
                component: operationSupport,
                name: '通话日志',
                iconCls: 'el-icon-menu',
                hidden: false,
                meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'C'] },
                children: [
                    { path: '/operationSupport/callLog/callDataDetail', component: callDataDetail, name: '通话记录明细', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'C'] } },
                    { path: '/operationSupport/callLog/openCallManage', component: openCallManage, name: '公开通话管理', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'C'] } },
                    { path: '/operationSupport/callLog/GrabChatCallDetails', component: GrabChatCallDetails, name: '抢聊通话明细', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'C'] } },
                ],
            },
            {
                path: '/operationSupport',
                component: operationSupport,
                name: '录音日志',
                iconCls: 'el-icon-menu',
                hidden: false,
                meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'C'] },
                children: [
                    { path: '/operationSupport/recordingLog/DailyAdditions', component: DailyAdditions, name: '每日新增录音明细', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'C'] } },
                    { path: '/operationSupport/recordingLog/wonderfulRecord', component: wonderfulRecord, name: '精选录音列表', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'C'] } },
                    { path: '/operationSupport/recordingLog/tapeSharingData', component: tapeSharingData, name: '分享页推荐列表管理', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'C'] } },
                    { path: '/operationSupport/recordingLog/systemRack', component: systemRack, name: '录音下榜列表', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'C'] } },
                    { path: '/operationSupport/recordingLog/voiceTabManage', component: voiceTabManage, name: '录音标签管理', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'C'] } },
                    // { path: '/operationSupport/recordingLog/recordShareManage', component: recordShareManage, name: '录音分享卡片', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'C'] } },
                ],
            },
            {
                path: '/operationSupport',
                component: operationSupport,
                name: 'App内容管理',
                iconCls: 'el-icon-menu',
                hidden: false,
                meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] },
                children: [
                    { path: '/operationSupport/appContentManagement/userTabsManage', component: userTabsManage, name: '首页标签管理', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },
                    // { path: '/operationSupport/appContentManagement/revenueSuspensionWindow', component: revenueSuspensionWindow, name: '收益悬浮窗', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },
                    { path: '/operationSupport/appContentManagement/barrageTopicManagement', component: barrageTopicManagement, name: '弹幕话题管理', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },
                    { path: '/operationSupport/appContentManagement/registeredUserGreeting', component: registeredUserGreeting, name: '注册用户招呼语', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },
                    { path: '/operationSupport/appContentManagement/newUsersMatchFriends', component: newUsersMatchFriends, name: '新用户匹配好友', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },
                    { path: '/operationSupport/appContentManagement/randomLabel', component: randomLabel, name: '随机用户标签', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },
                    { path: '/operationSupport/appContentManagement/randomNickname', component: randomNickname, name: '随机用户昵称', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },
                    { path: '/operationSupport/appContentManagement/randomSignature', component: randomSignature, name: '随机用户签名', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },
                    { path: '/operationSupport/appContentManagement/roomTabsManageTest', component: roomTabsManageTest, name: '房间标签管理', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },
                    
                ],
            },
        ],
    },
    // 活动专区
    {
        path: '/activities',
        component: Home,
        name: '活动专区',
        meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] },
        children: [
            {
                path: '/activities',
                component: activities,
                name: '活动管理',
                hidden: false,
                meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] },
                children: [
                    { path: '/activities/familyBackstageBackstage', component: familyBackstageBackstage, name: '家族嗨场', iconCls: 'el-icon-menu', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },
                    { path: '/activities/roomTopManagement', component: roomTopManagement, name: '房间置顶', iconCls: 'el-icon-menu', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },
                    { path: '/activities/superTurntable', component: superTurntable, name: '超级转盘', iconCls: 'el-icon-menu', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },                    
                    { path: '/activities/tanabataActivity', component: tanabataActivity, name: '七夕活动', iconCls: 'el-icon-menu', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },                    
                    { path: '/activities/smashGoldEggs', component: smashGoldEggs, name: '开宝箱数据', iconCls: 'el-icon-menu', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },                    
                    { path: '/activities/robotManagement', component: robotManagement, name: '机器人管理', iconCls: 'el-icon-menu', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },                    
                    // { path: '/activities/loveActivityManage', component: loveActivityManage, name: '情人节活动数据统计', iconCls: 'el-icon-menu', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },
                    // { path: '/activities/interactionInfo', component: interactionInfo, name: '黑色情人节互动信息', iconCls: 'el-icon-menu', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },
                    // { path: '/activities/rechargeTheCrowdManagement', component: rechargeTheCrowdManagement, name: '充值众筹活动管理', iconCls: 'el-icon-menu', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },
                    // { path: '/activities/youthDay', component: youthDay, name: '五四活动', iconCls: 'el-icon-menu', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },                    
                    // { path: '/activities/wordCupManagement', component: wordCupManagement, name: '世界杯活动', iconCls: 'el-icon-menu', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2'] } },                    
                ],
            },
        ],
    },
    // 系统管理
    {
        path: '/systemSetup',
        component: Home,
        name: '系统设置',
        meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M', 'C', 'G'] },
        children: [
            {
                path: '/systemSetup',
                component: systemSetup,
                name: '系统管理',
                hidden: false,
                meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M', 'C', 'G'] },
                children: [
                    // { path: '/systemSetup/commonPages', component: commonPages, name: '常用页面', iconCls: 'el-icon-menu', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M', 'C', 'G'] } },
                    { path: '/systemSetup/accountManagement', component: accountManagement, name: '账号管理', iconCls: 'el-icon-menu', hidden: false, meta: { role: ['T1', 'P1'] } },
                    { path: '/systemSetup/globalParameter', component: globalParameter, name: '全局参数', iconCls: 'el-icon-menu', hidden: false, meta: { role: ['T1', 'P1', 'O1'] } },
                    { path: '/systemSetup/modifyThePassword', component: modifyThePassword, name: '修改密码', iconCls: 'el-icon-menu', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2', 'O1', 'O2', 'M', 'C', 'G'] } },
                    { path: '/systemSetup/imageUpload', component: imageUpload, name: '图片上传', iconCls: 'el-icon-menu', hidden: false, meta: { role: ['T1', 'T2', 'P1', 'P2'] } },
                ],
            },
        ],
    },
    { path: '*', redirect: '/401', hidden: true, },
];
