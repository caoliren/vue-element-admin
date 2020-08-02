import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: '', affix: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/today',
    component: Layout,
    redirect: 'book/today',
    children: [
      {
        path: '/book/today',
        component: () => import('@/views/book/create'),
        name: 'book',
        meta: { title: '今日工单', icon: '' }
      }
    ]
  },
  {
    path: '/systemManage',
    component: Layout,
    redirect: 'systemManage/systemManage',
    meta: { title: '系统管理', icon: '', roles: ['admin'] },
    children: [
      {
        path: '/systemManage/userManage',
        component: () => import('@/views/systemManage/userManage'),
        name: 'systemManage',
        meta: { title: '用户管理', icon: '', roles: ['admin'] }
      },
      {
        path: '/systemManage/factoryManage',
        component: () => import('@/views/systemManage/factoryManage'),
        name: 'systemManage',
        meta: { title: '工厂管理', icon: '', roles: ['admin'] }
      },
      {
        path: '/systemManage/insertUser',
        component: () => import('@/views/systemManage/insertUser'),
        name: 'systemManage',
        meta: { title: '新增用户', icon: '', roles: ['admin'] }
      },
      {
        path: '/systemManage/insertFactory',
        component: () => import('@/views/systemManage/insertFactory'),
        name: 'systemManage',
        meta: { title: '新增工厂', icon: '', roles: ['admin'] }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
