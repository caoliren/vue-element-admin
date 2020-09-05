import Vue from "vue"
import Router from "vue-router"

Vue.use(Router)

/* Layout */
import Layout from "@/layout"

export const constantRoutes = [
    {
        path: "/redirect",
        component: Layout,
        hidden: true,
        children: [
            {
                path: "/redirect/:path(.*)",
                component: () => import("@/views/redirect/index"),
            },
        ],
    },
    {
        path: "/login",
        component: () => import("@/views/login/index"),
        hidden: true,
    },
    {
        path: "/auth-redirect",
        component: () => import("@/views/login/auth-redirect"),
        hidden: true,
    },
    {
        path: "/404",
        component: () => import("@/views/error-page/404"),
        hidden: true,
    },
    {
        path: "/401",
        component: () => import("@/views/error-page/401"),
        hidden: true,
    },
    {
        path: "/",
        component: Layout,
        redirect: "/dashboard",
        children: [
            {
                path: "dashboard",
                component: () => import("@/views/dashboard/index"),
                name: "Dashboard",
                meta: { title: "首页", icon: "", affix: true },
            },
        ],
    },
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */

export const asyncRoutes = [
    {
        path: "/today",
        component: Layout,
        redirect: "/today/index",
        meta: { title: "今日工单", icon: "" },
        children: [
            {
                path: "/today/index",
                component: () => import("@/views/today/index"),
                name: "today",
                meta: { title: "今日工单", icon: "" },
            },
            // {
            //     path: "/today/edit",
            //     component: () => import("@/views/today/edit"),
            //     name: "todayEdit",
            //     meta: { title: "编辑工单", icon: "" },
            //     hidden: true,
            // },
        ],
    },
    {
        path: "/order",
        component: Layout,
        redirect: "/order/index",
        meta: { title: "工单管理", icon: "" },
        children: [
            {
                path: "/order/index",
                component: () => import("@/views/order/index"),
                name: "order",
                meta: { title: "工单管理", icon: "" },
            },
            {
                path: "/order/insert",
                component: () => import("@/views/order/insert"),
                name: "insertOrder",
                meta: { title: "新增工单", icon: "" },
                hidden: true,
            },
            {
                path: "/order/edit",
                component: () => import("@/views/order/edit"),
                name: "editOrder",
                meta: { title: "编辑工单", icon: "" },
                hidden: true,
            },
        ],
    },
    {
        path: "/assign",
        component: Layout,
        redirect: "/assign/index",
        meta: { title: "配单管理", icon: "" },
        children: [
            {
                path: "/assign/index",
                component: () => import("@/views/assign/index"),
                name: "assign",
                meta: { title: "工单配货", icon: "" },
            },
            {
                path: "/assign/assignlist",
                component: () => import("@/views/assign/assignlist"),
                name: "assignList",
                meta: { title: "待出货列表", icon: "" },
            },
            {
                path: "/assign/view",
                component: () => import("@/views/assign/view"),
                name: "viewAssign",
                meta: { title: "查看配单", icon: "" },
                hidden: true,
            },
            {
                path: "/assign/edit",
                component: () => import("@/views/assign/edit"),
                name: "editAssign",
                meta: { title: "编辑配货单", icon: "" },
                hidden: true,
            },
        ],
    },
    {
        path: "/export",
        component: Layout,
        redirect: "/export/index",
        meta: { title: "出货管理", icon: "" },
        children: [
            {
                path: "/export/index",
                component: () => import("@/views/export/index"),
                name: "export",
                meta: { title: "出货管理", icon: "" },
            },
            {
                path: "/export/history",
                component: () => import("@/views/export/history"),
                name: "exportHistory",
                meta: { title: "出货历史", icon: "" },
            },
            {
                path: "/export/view",
                component: () => import("@/views/export/view"),
                name: "viewExport",
                meta: { title: "查看出货单", icon: "" },
                hidden: true,
            },
        ],
    },
    {
        path: "/stat",
        component: Layout,
        redirect: "/stat/index",
        meta: { title: "数据盘点", icon: "" },
        children: [
            {
                path: "/stat/index",
                component: () => import("@/views/stat/index"),
                name: "stat",
                meta: { title: "自动盘点", icon: "" },
            },
            {
                path: "/stat/statlist",
                component: () => import("@/views/stat/statlist"),
                name: "statlist",
                meta: { title: "盘点调账", icon: "" },
                hidden: true,
            },
            {
                path: "/stat/history",
                component: () => import("@/views/stat/history"),
                name: "statHistory",
                meta: { title: "数据记录", icon: "" },
            },
            {
                path: "/stat/statTotalList",
                component: () => import("@/views/stat/statTotalList"),
                name: "statTotalList",
                meta: { title: "盘点调账", icon: "" },
                hidden: true,
            },
        ],
    },
    {
        path: "/custom",
        component: Layout,
        children: [
            {
                path: "/custom/index",
                component: () => import("@/views/custom/index"),
                name: "custom",
                meta: { title: "客户管理", icon: "" },
            },
        ],
    },
    {
        path: "/system",
        component: Layout,
        redirect: "/system/user/manage",
        meta: { title: "系统管理", icon: "", roles: ["admin"] },
        children: [
            {
                path: "user",
                component: () => import("@/views/systemManage/user/index"),
                name: "user",
                redirect: "/system/user/manage",
                meta: { title: "用户管理", icon: "" },
                children: [
                    {
                        path: "manage",
                        component: () => import("@/views/systemManage/user/manage"),
                        name: "userManage",
                        meta: { title: "用户管理", icon: "" },
                    },
                    {
                        path: "insert",
                        component: () => import("@/views/systemManage/user/insert"),
                        name: "userInsert",
                        meta: { title: "新增用户", icon: "" },
                        hidden: true,
                    },
                    {
                        path: "edit",
                        component: () => import("@/views/systemManage/user/edit"),
                        name: "userEdit",
                        meta: { title: "编辑用户", icon: "" },
                        hidden: true,
                    },
                ],
            },
            {
                path: "factory",
                component: () => import("@/views/systemManage/factory/index"),
                name: "factory",
                redirect: "/system/factory/manage",
                meta: { title: "工厂管理", icon: "" },
                children: [
                    {
                        path: "manage",
                        component: () => import("@/views/systemManage/factory/manage"),
                        name: "factoryManage",
                        meta: { title: "工厂管理", icon: "" },
                    },
                    {
                        path: "insert",
                        component: () => import("@/views/systemManage/factory/insert"),
                        name: "factoryInsert",
                        meta: { title: "新增工厂", icon: "" },
                        hidden: true,
                    },
                    {
                        path: "edit",
                        component: () => import("@/views/systemManage/factory/edit"),
                        name: "factoryEdit",
                        meta: { title: "编辑工厂", icon: "" },
                        hidden: true,
                    },
                ],
            },
        ],
    },
    // 404 page must be placed at the end !!!
    { path: "*", redirect: "/404", hidden: true },
]

const createRouter = () =>
    new Router({
        // mode: 'history', // require service support
        scrollBehavior: () => ({ y: 0 }),
        routes: constantRoutes,
    })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router
