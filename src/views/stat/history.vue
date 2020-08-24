<template>
    <div class="g-userManage">
        <div class="manage-top">
            <!-- <el-input v-model="searchWord" class="u-inp" placeholder="请输入托工单号/工单号" />
            <el-date-picker v-model="searchDate" class="top__date" type="date" @change="dateChange" placeholder="按托工日期搜索">
            </el-date-picker>
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="reset">重置</el-button> -->
            <el-button class="stat-export" type="primary" @click="exportOrder">导出</el-button>
        </div>
        <el-table :data="list" border type="flex" class="manage-table" style="width: 100%" @selection-change="check">
            <el-table-column type="selection" min-width="4%" align="center"> </el-table-column>
            <el-table-column type="index" min-width="15%" align="center" label="序号"></el-table-column>
            <el-table-column min-width="10%" align="center" prop="stattime" label="盘点日期" show-overflow-tooltip />
            <el-table-column min-width="10%" align="center" prop="overdue" label="逾期(单)" show-overflow-tooltip />
            <el-table-column min-width="10%" align="center" prop="delivery" label="交期(单)" show-overflow-tooltip />
            <el-table-column min-width="10%" align="center" prop="normal" label="正常(单)" show-overflow-tooltip />
            <el-table-column min-width="10%" align="center" prop="exportnum" label="完成出货(单)" show-overflow-tooltip />
            <el-table-column min-width="15%" align="center" prop="operator" label="操作员" show-overflow-tooltip />
        </el-table>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
import { findStatHistory, search } from "@/api/order"
import { update } from "@/api/order"
import { parseTime } from "@/utils"
import { Loading } from "element-ui"

export default {
    data() {
        return {
            list: [],
            originList: [],
            currentId: null,
            searchWord: "",
            searchDate: "",
            dialogFormVisible: false,
            checkedList: [],
            assignData: {
                weituonum: 0,
                good: 0,
                bad: 0,
                unassign: 0,
            },
            rules: {
                good: [{ required: true, message: "请输入良品数量", trigger: "change" }],
                bad: [{ required: true, message: "请输入不良品数量", trigger: "change" }],
            },
        }
    },
    created() {
        const _this = this
        let status = this.$route.query.status
        Loading.service()
        findStatHistory({
            role: _this.roles[0],
        }).then(res => {
            let loadingInstance = Loading.service()
            _this.$nextTick(() => {
                // 以服务的方式调用的 Loading 需要异步关闭
                loadingInstance.close()
            })
            console.log("盘点记录", res)
            if (res.code === 0) {
                _this.list = res.data
                _this.originList = res.data
            }
        })
    },
    computed: {
        ...mapGetters(["name", "roles"]),
    },
    methods: {
        calcUnassign() {
            this.assignData.unassign = this.assignData.weituonum - this.assignData.good - this.assignData.bad
        },
        check(list) {
            console.log("勾选", list)
            this.checkedList = list
        },
        dateChange(date) {
            this.searchDate = parseTime(date).split(" ")[0]
        },
        search() {
            const _this = this
            let isTime = false
            let word = ""
            let date = _this.searchDate
            if (date) {
                _this.searchWord = ""
                word = date
                isTime = true
            } else {
                word = _this.searchWord
                if (!word.trim()) {
                    _this.list = _this.originList
                    return
                }
            }
            Loading.service()
            search({
                word,
                isTime,
                role: _this.roles[0],
            }).then(res => {
                console.log("托工单查询", res)
                let loadingInstance = Loading.service()
                _this.$nextTick(() => {
                    // 以服务的方式调用的 Loading 需要异步关闭
                    loadingInstance.close()
                })
                if (res.code === 0) {
                    const data = res.data
                    if (!data.length) {
                        _this.$message("未找到相关内容")
                        _this.list = []
                    } else {
                        _this.list = data
                    }
                }
            })
        },
        reset() {
            this.list = this.originList
            this.searchWord = ""
            this.searchDate = ""
        },
        doAssign(row) {
            this.currentId = row.id
            this.assignData = {
                weituonum: row.weituonum,
                good: row.good,
                bad: row.bad,
                unassign: row.unassign,
            }
            this.dialogFormVisible = true
            this.$nextTick(() => {
                this.$refs["dataForm1"].clearValidate()
            })
        },
        assignConfirm() {
            const _this = this
            let id = _this.currentId
            let assignData = _this.assignData
            let gongstatus = -1
            Loading.service()
            _this.$refs["dataForm1"].validate(valid => {
                if (valid) {
                    let info = {
                        good: assignData.good,
                        bad: assignData.bad,
                        unassign: assignData.unassign,
                    }
                    if (assignData.unassign === 0) {
                        info.gongstatus = 0
                        gongstatus = 0
                    }
                    let data = {
                        id,
                        info,
                    }
                    update(data).then(res => {
                        let loadingInstance = Loading.service()
                        _this.$nextTick(() => {
                            // 以服务的方式调用的 Loading 需要异步关闭
                            loadingInstance.close()
                        })
                    })
                    _this.list = _this.list.map(item => {
                        if (item.id == id) {
                            item.good = assignData.good
                            item.bad = assignData.bad
                            item.unassign = assignData.unassign
                            item.gongstatus = gongstatus
                        }

                        return item
                    })
                    _this.originList = _this.originList.map(item => {
                        if (item.id == id) {
                            item.good = assignData.good
                            item.bad = assignData.bad
                            item.unassign = assignData.unassign
                            item.gongstatus = gongstatus
                        }
                        return item
                    })
                    _this.dialogFormVisible = false
                }
            })
        },
        toUpdate(row) {
            console.log(row.id)
            // row = JSON.stringify(row)
            this.$router.push({
                path: "/assign/edit",
                query: {
                    id: row.id,
                },
            })
        },
        del(row) {
            const _this = this
            _this
                .$confirm("此操作将删除该托工单, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                .then(() => {
                    deleteTuogong({
                        id: row.id,
                    }).then(res => {
                        if (res.code === 0) {
                            _this.list = _this.list.filter(item => {
                                return item.id !== row.id
                            })
                            _this.originList = _this.originList.filter(it => {
                                return it.id !== item.id
                            })
                            _this.$message({
                                message: "删除成功",
                                type: "success",
                            })
                        }
                    })
                })
                .catch(() => {
                    console.log("已取消删除")
                })
        },
        exportOrder() {
            const _this = this
            let checkedList = _this.checkedList
            let hasUncomplete = false
            checkedList.map(item => {
                if (item.unassign !== 0) {
                    hasUncomplete = true
                    _this.$message("未完成的订单不能出单")
                    return
                }
            })
            if (hasUncomplete) return
            let promises = []
            checkedList.map(item => {
                let newItm = Object.assign({}, item)
                let itId = item.id
                delete newItm.id
                delete newItm.status

                let pro = new Promise((resolve, reject) => {
                    insertAssignOrder(newItm).then(
                        res => {
                            deleteTuogong({
                                id: itId,
                            }).then(res => {
                                if (res.code === 0) {
                                    _this.list = _this.list.filter(it => {
                                        return it.id !== itId
                                    })
                                    _this.originList = _this.originList.filter(it => {
                                        return it.id !== itId
                                    })
                                }
                            })
                            resolve()
                        },
                        res => {
                            reject()
                        }
                    )
                })
                promises.push(pro)
            })
            Promise.all(promises)
                .then(res => {
                    _this.$message({
                        message: "出单成功",
                        type: "success",
                    })
                })
                .catch(e => {
                    console.log("error", e)
                })
        },
    },
}
</script>
<style lang="scss">
.g-userManage {
    padding: 20px 0;

    .u-tab1 {
        width: 70%;
    }
}

.stat-export {
    float: right;
    margin-bottom: 20px;
}

.manage-top {
    .u-inp {
        width: 250px;
        margin-right: 20px;
    }
}

.top__date {
    margin-right: 20px;
}

.manage-table {
    margin-top: 40px;
}

.el-icon-s-opportunity {
    position: relative;
    top: 3px;
    margin-right: 4px;
    font-size: 20px;
}
</style>
