<template>
    <div class="g-userManage">
        <div class="manage-top">
            <!-- <el-input v-model="searchWord" class="u-inp" placeholder="请输入托工单号/工单号" />
            <el-date-picker v-model="searchDate" class="top__date" type="date" @change="dateChange" placeholder="按托工日期搜索">
            </el-date-picker>
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="reset">重置</el-button> -->
            <el-button class="stat-export" type="primary" @click="exportOrder">出单</el-button>
        </div>
        <el-table v-loading="loading" :data="list" border type="flex" class="manage-table" style="width: 100%" @selection-change="check">
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
            <el-table-column min-width="7%" align="center" prop="bad2" label="不良品2" show-overflow-tooltip />
            <el-table-column min-width="6%" align="center" prop="unassign" label="未分配" show-overflow-tooltip />
            <el-table-column min-width="13%" align="center" prop="desc" label="制程说明" show-overflow-tooltip />
            <el-table-column min-width="6%" align="center" prop="status" label="状态" show-overflow-tooltip>
                <template slot-scope="scope">
                    <i v-if="scope.row.status == -1" class="el-icon-s-opportunity" style="color: #2196f3"></i>
                    <i v-if="scope.row.status == 0" class="el-icon-s-opportunity" style="color: #ffc107"></i>
                    <i v-if="scope.row.status == 1" class="el-icon-s-opportunity" style="color: #f44336"></i>
                    <span>{{ scope.row.status }}</span>
                </template>
            </el-table-column>
            <el-table-column min-width="10%" align="center" prop="branch" label="部门" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.customname + "/" + scope.row.branchname }}</span>
                </template>
            </el-table-column>
            <el-table-column min-width="12%" align="center" prop label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="doAssign(scope.row)">分配</el-button>
                    <!-- <el-button type="text" size="small" @click="toUpdate(scope.row)">编辑</el-button>
                    <el-button type="text" size="small" @click="del(scope.row)">删除</el-button> -->
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
import { statList, search, deleteTuogong, insertAssignOrder } from "@/api/order"
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
            let status = this.$route.query.status
            this.loading = true
            statList({
                role: _this.roles[0],
                status,
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
            _this.loading = true
            search({
                word,
                isTime,
                role: _this.roles[0],
            }).then(res => {
                console.log("托工单查询", res)
                _this.loading = false
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
