import axios from "axios"
import { MessageBox, Message } from "element-ui"
import store from "@/store"
import { getToken } from "@/utils/auth"

const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 5000,
})

service.interceptors.request.use(
    config => {
        if (store.getters.token) {
            config.headers["Authorization"] = `Bearer ${getToken()}`
        }
        // console.log('consig', config)
        return config
    },
    error => {
        console.log(error)
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    response => {
        const res = response.data
        const err = res.msg || "请求失败"
        // if the custom code is not 20000, it is judged as an error.
        if (res.code !== 0) {
            if (res.code === -2) {
                console.log("respone", res)
                Message({
                    message: "登录状态失效，请重新登录",
                    type: "error",
                    duration: 5 * 1000,
                })
                //token失效 重新登录
                this.$router.push({
                    path: "/views/login/index",
                })
            } else {
                Message({
                    message: err,
                    type: "error",
                    duration: 5 * 1000,
                })
            }
            // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
            if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
                // to re-login
                MessageBox.confirm("You have been logged out, you can cancel to stay on this page, or log in again", "Confirm logout", {
                    confirmButtonText: "Re-Login",
                    cancelButtonText: "Cancel",
                    type: "warning",
                }).then(() => {
                    store.dispatch("user/resetToken").then(() => {
                        location.reload()
                    })
                })
            }
            return Promise.reject(err)
        } else {
            return res
        }
    },
    error => {
        console.log("err" + error) // for debug
        const { msg } = error.response
        Message({
            message: msg || "请求失败",
            type: "error",
            duration: 5 * 1000,
        })
        return Promise.reject(error)
    }
)

export default service
