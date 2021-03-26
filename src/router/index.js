import Vue from 'vue'
import VueRouter from 'vue-router'

// el-submenu的路由模式双击会报错,使用push、replace不能重复到岗到当前路由
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
// const originalReplace = VueRouter.prototype.replace
// VueRouter.prototype.originalReplace = function replace(location, onResolve, onReject) {
//   if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
//   return originalReplace.call(this, location).catch(err => err)
// }

const Home = () => import(/* webpackChunkName: "hcrlfr" */ '../views/Home.vue')
const Container = () => import(/* webpackChunkName: "hcrlfr" */ '../views/Container.vue')
const Login = () => import(/* webpackChunkName: "hcrlfr" */ '../views/Login.vue')

/**雇员认证 */
const TalentAudit = () => import(/* webpackChunkName: "hcrlfr" */ '../views/talent/TalentAudit.vue')
const TalentQualified = () => import('../components/talentAudit/TalentQualified.vue')
const TalentTheory = () => import('../components/talentAudit/TalentTheory.vue')
const TalentImprove = () => import('../components/talentAudit/TalentImprove.vue')
const TalentFailed = () => import('../components/talentAudit/TalentFailed.vue')

const TalentTest = () => import(/* webpackChunkName: "hcrlfr" */ '../views/talent/TalentTest.vue')

/**雇员总表 */
const TalentSummary = () => import(/* webpackChunkName: "hcrlfr" */ '../views/talent/TalentSummary.vue')
const TalentWait = () => import('../components/talentSummary/TalentWait.vue')
const TalentOnduty = () => import('../components/talentSummary/TalentOnduty.vue')
const TalentSuspend = () => import('../components/talentSummary/TalentSuspend.vue')
const TalentBlacklist = () => import('../components/talentSummary/TalentBlacklist.vue')
const TalentCollection = () => import('../components/talentSummary/TalentCollection.vue')


const TalentEvaluation = () => import(/* webpackChunkName: "hcrlfr" */ '../components/talentTest/TalentEvaluation.vue')
const TalentTrain = () => import(/* webpackChunkName: "hcrlfr" */ '../components/talentTest/TalentTrain.vue')
const TalentFeedback = () => import(/* webpackChunkName: "hcrlfr" */ '../components/talentTest/TalentFeedback.vue')
const TalentStore = () => import(/* webpackChunkName: "hcrlfr" */ '../components/talentTest/TalentStore.vue')
const TalentExamine = () => import(/* webpackChunkName: "hcrlfr" */ '../components/talentExamine/TalentExamine.vue')

/**订单处理 */
const OrderProcess = () => import(/* webpackChunkName: "hcrlfr" */ '../views/employer/OrderProcess.vue')
const OrderProcessing = () => import('../components/orderProcess/OrderProcessing.vue')
const OrderRecycle = () => import('../components/orderProcess/OrderRecycle.vue')
const OrderHistory = () => import('../components/orderProcess/OrderHistory.vue')


const OrderService = () => import(/* webpackChunkName: "hcrlfr" */ '../views/employer/OrderService.vue')
const OrderRenewal = () => import(/* webpackChunkName: "hcrlfr" */ '../views/employer/OrderRenewal.vue')
const AuthenFee = () => import(/* webpackChunkName: "hcrlfr" */ '../views/finance/AuthenFee.vue')

/**订单审核 */
const OrderReview = () => import(/* webpackChunkName: "hcrlfr" */ '../views/finance/OrderReview.vue')
const EntryAudit = () => import('../components/orderReview/EntryAudit.vue')
const ExpenditureAudit = () => import('../components/orderReview/ExpenditureAudit.vue')




const WageSettlement = () => import(/* webpackChunkName: "hcrlfr" */ '../views/finance/WageSettlement.vue')
const News = () => import(/* webpackChunkName: "hcrlfr" */ '../views/news/News.vue')
const User = () => import('../views/user/User.vue')
const Role = () => import('../views/user/Role.vue')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: Login},
  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect: '/container',
    children: [
      { path: '/container', name: 'container', component: Container, meta: { needLogin: true }},
      { 
        path: '/talentAudit', 
        name: 'talentAudit', 
        component: TalentAudit,
        redirect:"/talentAudit/talentQualified",
        children:[
          {
            path: '/talentAudit/talentQualified', 
            name: 'talentQualified',
            component: TalentQualified, 
            meta: { needLogin: true }
          },
          {
            path: '/talentAudit/talentTheory', 
            name: 'TalentTheory',
            component: TalentTheory,
            meta: { needLogin: true }
          },
          {
            path: '/talentAudit/talentImprove', 
            name: 'TalentImprove',
            component: TalentImprove,
            meta: { needLogin: true }
          },
          {
            path: '/talentAudit/talentFailed', 
            name: 'TalentFailed',
            component: TalentFailed,
            meta: { needLogin: true }
          }
        ]
      },
      { path: '/talentTest', name: 'talentTest', component: TalentTest, meta: { needLogin: true }},
      { 
        path: '/talentSummary', 
        name: 'talentSummary', 
        component: TalentSummary, 
        redirect:"/talentSummary/talentWait",
        children:[
          {
            path: '/talentSummary/talentWait', 
            name: 'talentWait', 
            component: TalentWait,
            meta: { needLogin: true }
          },
          {
            path: '/talentSummary/talentOnduty', 
            name: 'talentOnduty', 
            component: TalentOnduty,
            meta: { needLogin: true }
          },
          {
            path: '/talentSummary/talentSuspend', 
            name: 'talentSuspend', 
            component: TalentSuspend,
            meta: { needLogin: true }
          },
          {
            path: '/talentSummary/talentBlacklist', 
            name: 'talentBlacklist', 
            component: TalentBlacklist,
            meta: { needLogin: true }
          },
          {
            path: '/talentSummary/talentCollection', 
            name: 'talentCollection', 
            component: TalentCollection,
            meta: { needLogin: true }
          }
        ]
      },
      { path: '/talentEvaluation', name: 'talentEvaluation', component: TalentEvaluation, meta: { needLogin: true }},
      { path: '/talentTrain', name: 'talentTrain', component: TalentTrain, meta: { needLogin: true }},
      { path: '/talentFeedback', name: 'talentFeedback', component: TalentFeedback, meta: { needLogin: true }},
      { path: '/talentStore', name: 'talentStore', component: TalentStore, meta: { needLogin: true }},
      { path: '/talentExamine', name: 'talentExamine', component: TalentExamine, meta: { needLogin: true }},
      { 
        path: '/orderProcess', 
        name: 'orderProcess', 
        component: OrderProcess,
        redirect:"/orderProcess/orderProcessing", 
        children:[
          {
            path: '/orderProcess/orderProcessing', 
            name: 'orderProcessing', 
            component: OrderProcessing,
            meta: { needLogin: true }
          },
          {
            path: '/orderProcess/orderRecycle', 
            name: 'orderRecycle',
            component: OrderRecycle,
            meta: { needLogin: true }
          },
          {
            path: '/orderProcess/orderHistory', 
            name: 'orderHistory',
            component: OrderHistory,
            meta: { needLogin: true }
          }
        ]
      },
      { path: '/orderService', name: 'orderService', component: OrderService, meta: { needLogin: true }},
      { path: '/orderRenewal', name: 'orderRenewal', component: OrderRenewal, meta: { needLogin: true }},
      { path: '/authenFee', name: 'authenFee', component: AuthenFee, meta: { needLogin: true }},
      { 
        path: '/orderReview', 
        name: 'orderReview', 
        component: OrderReview, 
        redirect:'/orderReview/entryAudit', 
        children:[
          {
            path: '/orderReview/entryAudit', 
            name: 'entryAudit', 
            component: EntryAudit, 
          },
          {
            path: '/orderReview/expenditureAudit', 
            name: 'expenditureAudit', 
            component: ExpenditureAudit, 
          }
        ]
      },
      { path: '/wageSettlement', name: 'wageSettlement', component: WageSettlement, meta: { needLogin: true }},
      { path: '/news', name: 'news', component: News, meta: { needLogin: true }},
      { path:'/user',name:'user',component: User,meta: { needLogin: true }},
      { path:'/role',name:'role',component: Role,meta: { needLogin: true }},
    ]
  }
]

const router = new VueRouter({
  routes
})


router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('token')
  if (to.meta.needLogin) { // 判断该路由是否需要登录权限
    if (token) { // 判断是否已经登录
      next()
    }
    else {
      next({path: '/login'}) //跳转到登录页
    }
  } else { 
  	next()
  }
})

export default router
