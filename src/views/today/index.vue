<template>
    <div class="g-userManage">
        <div class="manage-top">
            <!-- <el-input v-model="searchWord" class="u-inp" placeholder="请输入托工单号/工单号" />
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="reset">重置</el-button> -->
            <span class="today-tip">今天需交货的工单，请尽快处理！</span>
            <el-button class="u-insert" type="primary" @click="exportOrder">导出</el-button>
        </div>
        <el-table :data="list" border type="flex" class="manage-table" style="width: 100%" @selection-change="check">
            <el-table-column type="selection" min-width="4%" align="center"> </el-table-column>
            <el-table-column min-width="10%" align="center" prop="tuogongid" label="托工单号" show-overflow-tooltip />
            <el-table-column min-width="10%" align="center" prop="gongid" label="工单号" show-overflow-tooltip />
            <el-table-column min-width="6%" align="center" prop="liaoid" label="料号" show-overflow-tooltip />
            <el-table-column min-width="6%" align="center" prop="haotou" label="号头" show-overflow-tooltip />
            <el-table-column min-width="8%" align="center" prop="gongstatus" label="工单状态" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.gongstatus === 0 ? "已完成" : scope.row.gongstatus === 1 ? "待出货" : "未完成" }}</span>
                </template>
            </el-table-column>
            <el-table-column min-width="8%" align="center" prop="weituonum" label="委托数量" show-overflow-tooltip />
            <el-table-column min-width="6%" align="center" prop="good" label="良品" show-overflow-tooltip />
            <el-table-column min-width="6%" align="center" prop="bad" label="不良品" show-overflow-tooltip />
            <el-table-column min-width="6%" align="center" prop="unassign" label="未分配" show-overflow-tooltip />
            <el-table-column min-width="14%" align="center" prop="desc" label="制程说明" show-overflow-tooltip />
            <el-table-column min-width="10%" align="center" prop="branch" label="部门" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.customname + "/" + scope.row.branchname }}</span>
                </template>
            </el-table-column>
            <el-table-column min-width="12%" align="center" prop label="操作">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.gongstatus === -1" type="text" size="small" @click="doAssign(scope.row)">分配 </el-button>
                    <el-button v-if="scope.row.gongstatus === 0" type="text" size="small" @click="exportOrder(scope.row)">出单</el-button>
                    <el-button v-if="scope.row.gongstatus === 1" type="text" size="small" @click="doExport(scope.row)">出货</el-button>
                    <el-button v-if="scope.row.gongstatus === 1" type="text" size="small" @click="view(scope.row)">查看</el-button>
                    <el-button v-else type="text" size="small" @click="toUpdate(scope.row)">编辑</el-button>
                    <!-- <el-button type="text" size="small" @click="del(scope.row)">删除</el-button> -->
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :title="dialogTit" :visible.sync="dialogFormVisible">
            <el-form
                ref="dataForm1"
                :rules="rules"
                :model="assignData"
                label-position="left"
                label-width="100px"
                style="width: 400px; margin-left:50px;"
            >
                <el-form-item label="委托总数" prop="weituonum">
                    <span>{{ assignData.weituonum }}</span>
                </el-form-item>
                <el-form-item label="良品" prop="good">
                    <el-input v-model="assignData.good" @input="calcUnassign" />
                </el-form-item>
                <el-form-item label="不良品" prop="bad">
                    <el-input v-model="assignData.bad" @input="calcUnassign" />
                </el-form-item>
                <el-form-item label="未分配" prop="unassign">
                    <span>{{ assignData.unassign }}</span>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">
                    取消
                </el-button>
                <el-button type="primary" @click="assignConfirm">
                    确定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
import { findTodayList, find, search, deleteTuogong, insertAssignOrder, deleteAssign, insertExportOrder } from "@/api/order"
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
            dialogTit: "配单",
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
        this.init()
    },
    computed: {
        ...mapGetters(["name", "roles"]),
    },
    methods: {
        init() {
            const _this = this
            Loading.service()
            findTodayList({
                role: _this.roles[0],
            }).then(res => {
                let loadingInstance = Loading.service()
                _this.$nextTick(() => {
                    // 以服务的方式调用的 Loading 需要异步关闭
                    loadingInstance.close()
                })
                console.log("今日工单", res)
                if (res.code === 0) {
                    _this.list = res.data
                    _this.originList = res.data
                }
            })
        },
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
        exportOrder(row) {
            const _this = this

            let itId = row.id
            let newItm = Object.assign({}, row)
            delete newItm.id
            insertAssignOrder(newItm).then(
                r => {
                    deleteTuogong({
                        id: itId,
                    }).then(res => {
                        if (res.code === 0) {
                            // _this.list = _this.list.map(it => {
                            //     if (it.id === itId) {
                            //         it.gongstatus = 1
                            //         it.id = r.insertId
                            //     }
                            //     return it
                            // })
                            // _this.originList = _this.originList.map(it => {
                            //     if (it.id === itId) {
                            //         it.gongstatus = 1
                            //     }
                            //     return it
                            // })
                            _this.init()
                            _this.$message({
                                message: "出单成功",
                                type: "success",
                            })
                        }
                    })
                },
                res => {}
            )
        },
        doExport(row) {
            const _this = this
            let checkedList = [row]
            let itId = row.id
            let newItm = Object.assign({}, row)
            delete newItm.id
            insertExportOrder({
                list: checkedList,
                operator: _this.name,
            }).then(
                res => {
                    deleteAssign({
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
                    _this.$message({
                        message: "出单成功",
                        type: "success",
                    })
                },
                res => {}
            )
        },
        view(row) {
            console.log(row.id)
            // row = JSON.stringify(row)
            this.$router.push({
                path: "/assign/view",
                query: {
                    id: row.id,
                },
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
.today-tip {
    margin-left: 20px;
    font-size: 14px;
    color: red;
}
.manage-top {
    .u-inp {
        width: 250px;
        margin-right: 20px;
    }
    .u-insert {
        float: right;
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
