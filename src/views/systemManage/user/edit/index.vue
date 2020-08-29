<template>
    <div class="g-insertUser">
        <div class="m-sec">
            <span class="u-tit"><span class="tit_red" v-if="!isUpdate">*</span>用户名：</span>
            <el-input v-model="username" class="u-inp" placeholder="请输入用户名" />
        </div>
        <div class="m-sec">
            <span class="u-tit"><span class="tit_red" v-if="!isUpdate">*</span>密码：</span>
            <el-input v-model="password" class="u-inp f-pass" :placeholder="passPlaceholder" show-password />
        </div>
        <div class="m-sec">
            <span class="u-tit"><span class="tit_red" v-if="!isUpdate">*</span>权限：</span>
            <el-select v-model="role" placeholder="请选择">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </div>
        <div class="m-sec">
            <span class="u-tit">备注：</span>
            <el-input v-model="remark" class="u-textarea" type="textarea" :rows="3" placeholder="请输入内容" />
        </div>
        <el-button class="u-submit" type="primary" @click="submit">提交</el-button>
    </div>
</template>
<script>
import { create } from "@/api/user"
import { findFactoryName } from "@/api/factory"
import request from "@/utils/request"

export default {
    data() {
        return {
            username: "",
            password: "",
            passPlaceholder: "请输入密码",
            remark: "",
            options: [
                {
                    value: "选项1",
                    label: "黄金糕",
                },
                {
                    value: "选项2",
                    label: "双皮奶",
                },
                {
                    value: "选项3",
                    label: "蚵仔煎",
                },
                {
                    value: "选项4",
                    label: "龙须面",
                },
                {
                    value: "选项5",
                    label: "北京烤鸭",
                },
            ],
            role: "",
            isUpdate: false,
            updateData: {},
        }
    },
    created() {
        console.log("options", this.$route.query)
        const _this = this
        const query = this.$route.query
        if (query.update) {
            const data = JSON.parse(query.update)
            this.isUpdate = true
            this.updateData = data
            this.username = data.username
            this.role = data.role
            this.remark = data.remark
            this.password = ""
            this.passPlaceholder = "如需修改密码请在这里输入新密码"
        }
        findFactoryName()
            .then(res => {
                if (res.code === 0) {
                    let { data } = res
                    if (data.length) {
                        data = data.map(item => {
                            item = {
                                value: item,
                                label: item,
                            }
                            return item
                        })
                        _this.options = data
                    }
                }
                console.log("工厂列表", res)
            })
            .catch(error => {
                console.log(error)
            })
    },
    methods: {
        submit() {
            const _this = this
            if (_this.isUpdate) {
                // 修改
                const update = _this.updateData
                const data = {}
                for (const key in update) {
                    // eslint-disable-next-line no-prototype-builtins
                    if (key !== "id") {
                        if (update[key] !== _this[key]) {
                            data[key] = _this[key]
                        }
                    }
                }
                if (_this.password.trim()) {
                    data.password = _this.password.trim()
                }
                request({
                    url: "/user/update",
                    method: "post",
                    data: {
                        info: data,
                        id: update.id,
                    },
                }).then(res => {
                    if (res.code === 0) {
                        _this.$message({
                            message: "修改信息成功",
                            type: "success",
                        })
                        _this.$router.push({
                            path: "/system/user/manage",
                        })
                    }
                })
            } else {
                create({
                    username: _this.username.trim(),
                    password: _this.password,
                    role: _this.role,
                    remark: _this.remark,
                })
                    .then(res => {
                        // const { data } = response
                        console.log("response", res)
                        if (res.code === 0) {
                            _this.$message({
                                message: "添加用户成功",
                                type: "success",
                            })
                            _this.$router.push({
                                path: "/system/user/manage",
                            })
                        } else {
                            _this.$message.err({
                                message: res.msg,
                            })
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }
        },
    },
}
</script>
<style lang="scss">
.g-insertUser {
    margin-top: 40px;
}
.m-sec {
    margin-bottom: 20px;
}
.u-tit {
    display: inline-block;
    vertical-align: top;
    width: 100px;
    padding-right: 10px;
    padding-top: 2px;
    text-align: right;
    font-size: 16px;

    .tit_red {
        color: red;
    }
}
.u-inp {
    width: 240px;

    &.f-pass {
        font-size: 12px;
    }
}
.u-textarea {
    width: 400px;
}
.u-submit {
    margin-top: 20px;
}
</style>
