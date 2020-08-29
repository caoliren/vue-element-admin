<template>
    <div class="g-userManage">
        <div class="manage-top">
            <el-input v-model="searchWord" class="u-inp" placeholder="请输入托工单号/工单号" />
            <el-date-picker v-model="searchDate" class="top__date" type="date" @change="dateChange" placeholder="按托工日期搜索">
            </el-date-picker>
            <el-button type="primary" @click="searchFnc">搜索</el-button>
            <el-button @click="reset">重置</el-button>
            <el-button class="u-insert" type="primary" @click="toInset">新增</el-button>
            <el-button :loading="downloadLoading" class="manage-export" type="primary" icon="el-icon-download" @click="handleDownload">
                导出
            </el-button>
        </div>
        <el-table v-loading="loading" :data="list" border type="flex" class="manage-table" style="width: 100%">
            <el-table-column type="index" min-width="4%" align="center" label="序号"> </el-table-column>
            <el-table-column min-width="10%" align="center" prop="tuogongid" label="托工单号" show-overflow-tooltip />
            <el-table-column min-width="10%" align="center" prop="gongid" label="工单号" show-overflow-tooltip />
            <el-table-column min-width="8%" align="center" prop="liaoid" label="料号" show-overflow-tooltip />
            <el-table-column min-width="8%" align="center" prop="haotou" label="号头" show-overflow-tooltip />
            <el-table-column min-width="8%" align="center" prop="gongstatus" label="工单状态" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.gongstatus === 0 ? "已完成" : scope.row.gongstatus === 1 ? "待出货" : "未完成" }}</span>
                </template>
            </el-table-column>
            <el-table-column min-width="8%" align="center" prop="weituonum" label="委托数量" show-overflow-tooltip />
            <el-table-column min-width="8%" align="center" prop="type" label="类别">
                <template slot-scope="scope">
                    <span>{{ scope.row.type === 1 ? "良品" : "不良品" }}</span>
                </template>
            </el-table-column>
            <el-table-column min-width="14%" align="center" prop="desc" label="制程说明" show-overflow-tooltip />
            <el-table-column min-width="8%" align="center" prop="status" label="状态" show-overflow-tooltip>
                <template slot-scope="scope">
                    <i v-if="scope.row.status == -1" class="el-icon-s-opportunity" style="color: #2196f3"></i>
                    <i v-if="scope.row.status == 0" class="el-icon-s-opportunity" style="color: #ffc107"></i>
                    <i v-if="scope.row.status == 1" class="el-icon-s-opportunity" style="color: #f44336"></i>
                    <span>{{ scope.row.status }}</span>
                </template>
            </el-table-column>
            <el-table-column min-width="14%" align="center" prop="branch" label="部门" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.customname + "/" + scope.row.branchname }}</span>
                </template>
            </el-table-column>
            <el-table-column min-width="10%" align="center" prop label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="update(scope.row)">编辑</el-button>
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
    </div>
</template>
<script>
import { mapGetters } from "vuex"
import { find, search, deleteTuogong } from "@/api/order"
import { parseTime } from "@/utils"
// import { Loading } from "element-ui"
// import Pagination from "@/components/Pagination"

export default {
    // components: { Pagination },
    data() {
        return {
            list: [],
            originList: [],
            originTotal: 0,
            modeSearch: false,
            searchWord: "",
            searchDate: "",
            downloadLoading: false,
            total: 0,
            loading: false,
            // listQuery: {
            //     page: 1,
            //     limit: 10,
            // },
            currentPage: 1,
        }
    },
    created() {
        this.getList(true)
        console.log("1", new Date("2020-08-28 00:00:00"))
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
                }
            })
        },
        dateChange(date) {
            if (!date) return
            this.searchDate = parseTime(date).split(" ")[0]
        },
        searchFnc() {
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
                this.currentPage = 1
            }
            this.loading = true
            search({
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
        update(row) {
            console.log(row.id)
            // row = JSON.stringify(row)
            this.$router.push({
                path: "/order/edit",
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
        toInset() {
            this.$router.push({
                path: "/order/insert",
            })
        },
        handleDownload() {
            this.downloadLoading = true
            import("@/vendor/Export2Excel").then(excel => {
                const tHeader = [
                    "序号",
                    "托工单号",
                    "工单号",
                    "料号",
                    "号头",
                    "工单状态",
                    "委托数量",
                    "良品",
                    "不良品",
                    "未分配",
                    "单位",
                    "部门",
                    "品牌代码",
                    "制程说明",
                    "类别",
                    "状态",
                    "托工日期",
                    "交货日期",
                ]
                const filterVal = [
                    "index",
                    "tuogongid",
                    "gongid",
                    "liaoid",
                    "haotou",
                    "gongstatus",
                    "weituonum",
                    "good",
                    "bad",
                    "unassign",
                    "customname",
                    "branchname",
                    "brandname",
                    "desc",
                    "type",
                    "status",
                    "tuogongtime",
                    "deliverytime",
                ]
                const data = this.formatJson(filterVal)
                excel.export_json_to_excel({
                    header: tHeader,
                    data,
                    filename: "工单列表",
                })
                this.downloadLoading = false
            })
        },
        formatJson(filterVal) {
            return this.list.map((v, idx) =>
                filterVal.map((j, i) => {
                    v.index = idx + 1

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
    .u-insert,
    .manage-export {
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
