<template>
    <div class="g-userManage">
        <div class="manage-top">
            <el-input v-model="searchWord" class="u-inp" placeholder="请输入托工单号/工单号" />
            <el-button type="primary" @click="searchFnc(true)">搜索</el-button>
            <el-button @click="reset">重置</el-button>
            <span class="today-tip">今天需交货的工单，请尽快处理！</span>
            <el-button :loading="downloadLoading" class="manage-export" type="primary" icon="el-icon-download" @click="handleDownload"
                >导出</el-button
            >
        </div>
        <el-table v-loading="loading" :data="list" border type="flex" class="manage-table" style="width: 100%" @selection-change="check">
            <el-table-column type="selection" min-width="4%" align="center"> </el-table-column>
            <el-table-column min-width="6%" align="center" prop="brandname" label="品牌代码" show-overflow-tooltip />
            <el-table-column min-width="10%" align="center" prop="gongid" label="工单号" show-overflow-tooltip />
            <el-table-column min-width="8%" align="center" prop="haotou" label="号头" show-overflow-tooltip />
            <el-table-column min-width="8%" align="center" prop="weituonum" label="委托数量" show-overflow-tooltip />
            <el-table-column min-width="8%" align="center" prop="gongstatus" label="工单状态" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.gongstatus === 0 ? "已完成" : scope.row.gongstatus === 1 ? "待出货" : "未完成" }}</span>
                </template>
            </el-table-column>
            <el-table-column min-width="8%" align="center" prop="type" label="类别" sortable>
                <template slot-scope="scope">
                    <span>{{ scope.row.type === 1 ? "良品" : "不良品" }}</span>
                </template>
            </el-table-column>
            <el-table-column min-width="4%" align="center" prop="good" label="良品" show-overflow-tooltip />
            <el-table-column min-width="5%" align="center" prop="bad" label="不良品" show-overflow-tooltip />
            <el-table-column min-width="5%" align="center" prop="bad2" label="不良品2" show-overflow-tooltip />
            <el-table-column min-width="5%" align="center" prop="unassign" label="未分配" show-overflow-tooltip />
            <el-table-column min-width="10%" align="center" prop="desc" label="制程说明" show-overflow-tooltip />
            <el-table-column min-width="10%" align="center" prop="branch" label="单位" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.customname + "/" + scope.row.branchname }}</span>
                </template>
            </el-table-column>
            <el-table-column min-width="5%" align="center" prop="remark" label="备注" show-overflow-tooltip />
            <el-table-column min-width="10%" align="center" prop label="操作">
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
        <el-pagination
            v-show="total > 0"
            class="pagination-box"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="10"
            layout="total, prev, pager, next, jumper"
            :total="total"
        >
        </el-pagination>
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
                <el-form-item label="不良品2" prop="bad">
                    <el-input v-model="assignData.bad2" @input="calcUnassign" />
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
import {
    todayExportAll,
    findTodayList,
    find,
    searchToday,
    deleteTuogong,
    insertAssignOrder,
    deleteAssign,
    insertExportOrder,
} from "@/api/order"
import { update } from "@/api/order"
import { parseTime } from "@/utils"
// import { Loading } from "element-ui"

export default {
    data() {
        return {
            list: [],
            originList: [],
            originTotal: 0,
            modeSearch: false,
            currentId: null,
            searchWord: "",
            searchDate: "",
            dialogTit: "配单",
            dialogFormVisible: false,
            checkedList: [],
            total: 0,
            loading: false,
            currentPage: 1,
            downloadLoading: false,
            assignData: {
                weituonum: 0,
                good: 0,
                bad: 0,
                bad2: 0,
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
        // this.init()
        this.getList(true)
    },
    computed: {
        ...mapGetters(["name", "roles"]),
    },
    methods: {
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`)
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`)
            if (this.modeSearch) {
                this.searchFnc()
            } else {
                this.getList()
            }
        },
        getList(isInit) {
            const _this = this
            this.loading = true
            findTodayList({
                role: _this.roles[0],
                page: _this.currentPage,
            }).then(res => {
                _this.loading = false
                if (res.code === 0) {
                    let data = res.data
                    _this.list = data.data
                    if (isInit) _this.originList = data.data
                    _this.total = data.total
                    _this.originTotal = data.total
                }
            })
        },
        calcUnassign() {
            this.assignData.unassign = this.assignData.weituonum - this.assignData.good - this.assignData.bad - this.assignData.bad2
        },
        check(list) {
            console.log("勾选", list)
            this.checkedList = list
        },
        dateChange(date) {
            if (!date) return
            this.searchDate = parseTime(date).split(" ")[0]
        },
        searchFnc(fromSearchBtn) {
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
                    // _this.list = _this.originList
                    _this.reset()
                    return
                }
            }
            if (!this.modeSearch) {
                this.modeSearch = true
            }
            if (fromSearchBtn) {
                this.currentPage = 1
            }
            this.loading = true
            searchToday({
                word,
                isTime,
                role: _this.roles[0],
                page: _this.currentPage,
            }).then(res => {
                _this.loading = false
                if (res.code === 0) {
                    const data = res.data
                    if (!data.data.length) {
                        _this.$message("未找到相关内容")
                        _this.list = []
                        _this.total = 0
                    } else {
                        _this.list = data.data
                        _this.total = data.total
                    }
                }
            })
        },
        reset() {
            this.list = this.originList
            this.total = this.originTotal
            this.searchWord = ""
            this.searchDate = ""
            this.modeSearch = false
            this.currentPage = 1
        },
        doAssign(row) {
            this.currentId = row.id
            this.assignData = {
                weituonum: row.weituonum,
                good: row.good,
                bad: row.bad,
                bad2: row.bad2,
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
            if (assignData.unassign < 0) {
                _this.$message("未分配数量不能为负数！")
                return
            }
            _this.$refs["dataForm1"].validate(valid => {
                if (valid) {
                    let info = {
                        good: assignData.good,
                        bad: assignData.bad,
                        bad2: assignData.bad2,
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
                    _this.loading = true
                    update(data).then(res => {
                        _this.loading = false
                    })
                    _this.list = _this.list.map(item => {
                        if (item.id == id) {
                            item.good = assignData.good
                            item.bad = assignData.bad
                            item.bad2 = assignData.bad2
                            item.unassign = assignData.unassign
                            item.gongstatus = gongstatus
                        }

                        return item
                    })
                    _this.originList = _this.originList.map(item => {
                        if (item.id == id) {
                            item.good = assignData.good
                            item.bad = assignData.bad
                            item.bad2 = assignData.bad2
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
                            _this.getList(true)
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
        handleDownload() {
            const _this = this
            this.downloadLoading = true
            let excelList = this.checkedList.length > 0 ? this.checkedList : []
            if (!excelList.length) {
                todayExportAll().then(res => {
                    if (res.code === 0) {
                        excelList = res.data.data
                        import("@/vendor/Export2Excel").then(excel => {
                            const tHeader = [
                                "序号",
                                "品牌代码",
                                "托工单号",
                                "工单号",
                                "号头",
                                "工单状态",
                                "委托数量",
                                "良品",
                                "不良品",
                                "未分配",
                                "单位",
                                "部门",
                                "类别",
                                "制程说明",
                                "托工日期",
                                "交货日期",
                            ]
                            const filterVal = [
                                "index",
                                "brandname",
                                "tuogongid",
                                "gongid",
                                "haotou",
                                "gongstatus",
                                "weituonum",
                                "good",
                                "bad",
                                "unassign",
                                "customname",
                                "branchname",
                                "type",
                                "desc",
                                "tuogongtime",
                                "deliverytime",
                            ]
                            const data = _this.formatJson(excelList, filterVal)
                            excel.export_json_to_excel({
                                header: tHeader,
                                data,
                                filename: "今日工单",
                            })
                            this.downloadLoading = false
                        })
                    } else {
                        this.downloadLoading = false
                    }
                })
            } else {
                import("@/vendor/Export2Excel").then(excel => {
                    const tHeader = [
                        "序号",
                        "品牌代码",
                        "托工单号",
                        "工单号",
                        "号头",
                        "工单状态",
                        "委托数量",
                        "良品",
                        "不良品",
                        "未分配",
                        "单位",
                        "部门",
                        "类别",
                        "制程说明",
                        "托工日期",
                        "交货日期",
                    ]
                    const filterVal = [
                        "index",
                        "brandname",
                        "tuogongid",
                        "gongid",
                        "haotou",
                        "gongstatus",
                        "weituonum",
                        "good",
                        "bad",
                        "unassign",
                        "customname",
                        "branchname",
                        "type",
                        "desc",
                        "tuogongtime",
                        "deliverytime",
                    ]
                    const data = _this.formatJson(excelList, filterVal)
                    excel.export_json_to_excel({
                        header: tHeader,
                        data,
                        filename: "今日工单",
                    })
                    this.downloadLoading = false
                })
            }
        },
        formatJson(excelList, filterVal) {
            return excelList.map((v, idx) =>
                filterVal.map((j, i) => {
                    v.index = idx + 1
                    v.gongstatus === 0
                        ? (v.gongstatus = "已完成")
                        : v.gongstatus === 1
                        ? (v.gongstatus = "待出货")
                        : (v.gongstatus = "未完成")
                    v.type === 1 ? (v.type = "良品") : (v.type = "不良品")
                    return v[j]
                })
            )
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

.manage-export {
    float: right;
}
</style>
