<template>
    <div class="g-userManage">
        <div class="manage-top">
            <el-input v-model="searchWord" class="u-inp" placeholder="请输入号头" />
            <el-date-picker v-model="searchDate" class="top__date" type="date" @change="dateChange" placeholder="按托工日期搜索">
            </el-date-picker>
            <el-button type="primary" @click="searchFnc(true)">搜索</el-button>
            <el-button @click="reset">重置</el-button>
            <el-button class="u-insert" type="primary" @click="exportOrder">出单</el-button>
            <span class="top-weituoCount">总委托数：{{ weituoCount }}</span>
            <el-button :loading="downloadLoading" class="manage-export" type="primary" icon="el-icon-download" @click="handleDownload">
                导出
            </el-button>
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
            <el-table-column min-width="8%" align="center" prop="status" label="状态" sortable show-overflow-tooltip>
                <template slot-scope="scope">
                    <i v-if="scope.row.status == -1" class="el-icon-s-opportunity" style="color: #2196f3"></i>
                    <i v-if="scope.row.status == 0" class="el-icon-s-opportunity" style="color: #ffc107"></i>
                    <i v-if="scope.row.status == 1" class="el-icon-s-opportunity" style="color: #f44336"></i>
                    <span>{{ scope.row.status }}</span>
                </template>
            </el-table-column>
            <el-table-column min-width="10%" align="center" prop="branch" label="单位" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.customname + "/" + scope.row.branchname }}</span>
                </template>
            </el-table-column>
            <el-table-column min-width="5%" align="center" prop="remark" label="备注" show-overflow-tooltip />
            <el-table-column min-width="10%" align="center" prop label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="doAssign(scope.row)">分配</el-button>
                    <el-button type="text" size="small" @click="toUpdate(scope.row)">编辑</el-button>
                    <el-button type="text" size="small" @click="del(scope.row)">删除</el-button>
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
                <el-form-item label="不良品2" prop="bad2">
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
import { find, search, searchHaotou, deleteTuogong, insertAssignOrder, orderExportAll } from "@/api/order"
import { update } from "@/api/order"
import { parseTime } from "@/utils"
// import { Loading } from "element-ui"

export default {
    data() {
        // var validateGood = (rule, value, callback) => {
        //     if (value === "") {
        //         callback(new Error("请输入良品数量"))
        //     } else if (parseInt(value) + parseInt(this.assignData.bad) > this.assignData.weituonum) {
        //         callback(new Error("请输入正确的良品数量"))
        //     } else {
        //         callback()
        //     }
        // }
        // var validateBad = (rule, value, callback) => {
        //     if (value === "") {
        //         callback(new Error("请输入不良品数量"))
        //     } else if (parseInt(value) + parseInt(this.assignData.good) > this.assignData.weituonum) {
        //         callback(new Error("请输入正确的不良品数量"))
        //     } else {
        //         callback()
        //     }
        // }
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
            assignData: {
                weituonum: 0,
                good: 0,
                bad: 0,
                bad2: 0,
                unassign: 0,
            },
            downloadLoading: false,
            rules: {
                // good: [
                //     {
                //         required: true,
                //         validator: validateGood,
                //         trigger: "change",
                //     },
                // ],
                // bad: [
                //     {
                //         required: true,
                //         validator: validateBad,
                //         trigger: "change",
                //     },
                // ],
                good: [{ required: true, message: "请输入良品数量", trigger: "change" }],
                bad: [{ required: true, message: "请输入不良品数量", trigger: "change" }],
                bad2: [{ required: true, message: "请输入不良品2数量", trigger: "change" }],
            },
            weituoCount: 0,
        }
    },
    created() {
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
            find({
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
                    _this.weituoCount = data.weituoNum
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
            searchHaotou({
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
                console.log("valid", valid)
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
        exportOrder() {
            const _this = this
            let checkedList = _this.checkedList
            let hasUncomplete = false
            if (checkedList.length == 0) {
                _this.$message("请先选择订单")
                return
            }
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
        handleDownload() {
            const _this = this
            this.downloadLoading = true
            let excelList = this.checkedList.length > 0 ? this.checkedList : []
            if (!excelList.length) {
                orderExportAll().then(res => {
                    if (res.code === 0) {
                        excelList = res.data
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
                                "制程说明",
                                "类别",
                                "状态",
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
                                "desc",
                                "type",
                                "status",
                                "tuogongtime",
                                "deliverytime",
                            ]
                            const data = _this.formatJson(excelList, filterVal)
                            excel.export_json_to_excel({
                                header: tHeader,
                                data,
                                filename: "工单列表",
                            })
                            this.downloadLoading = false
                        })
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
                        "制程说明",
                        "类别",
                        "状态",
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
                        "desc",
                        "type",
                        "status",
                        "tuogongtime",
                        "deliverytime",
                    ]
                    const data = _this.formatJson(excelList, filterVal)
                    excel.export_json_to_excel({
                        header: tHeader,
                        data,
                        filename: "工单列表",
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
                    v.status === 0 ? (v.status = "交期") : v.status === 1 ? (v.status = "逾期") : (v.status = "正常")
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

.manage-top {
    .u-inp {
        width: 250px;
        margin-right: 20px;
    }
    .u-insert {
        float: right;
    }
}

.top-weituoCount {
    margin-left: 20px;
    color: #606266;
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
