<template>
    <div id="p-export" class="g-userManage">
        <div class="manage-top">
            <el-input v-model="searchWord" class="u-inp" placeholder="请输入出货单号/单位/出货代表" />
            <el-date-picker v-model="searchDate" class="top__date" type="date" @change="dateChange" placeholder="按出货日期搜索">
            </el-date-picker>
            <el-button type="primary" @click="searchFnc(true)">搜索</el-button>
            <el-button @click="reset">重置</el-button>
            <!-- <el-button class="u-insert" type="primary" @click="doPrint">打印</el-button> -->
            <el-button :loading="downloadLoading" class="manage-export" type="primary" icon="el-icon-download" @click="handleDownload">
                导出
            </el-button>
        </div>
        <el-table
            v-loading="loading"
            :data="list"
            border
            type="flex"
            id="manage-table"
            class="manage-table"
            style="width: 100%"
            @selection-change="check"
        >
            <!-- <el-table-column type="selection" min-width="4%" align="center"> </el-table-column> -->
            <el-table-column type="index" min-width="4%" align="center" label="序号"> </el-table-column>
            <el-table-column min-width="10%" align="center" prop="exportid" label="出货单号" show-overflow-tooltip />
            <el-table-column min-width="10%" align="center" prop="exporttime" label="出货日期" show-overflow-tooltip />
            <el-table-column min-width="10%" align="center" prop="role" label="出货单位" show-overflow-tooltip />
            <el-table-column min-width="8%" align="center" prop="address" label="出货地址" show-overflow-tooltip />
            <el-table-column min-width="8%" align="center" prop="operator" label="发货代表" show-overflow-tooltip />
            <el-table-column min-width="12%" align="center" prop label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="view(scope.row)">查看</el-button>
                    <el-button type="text" size="small" @click="view(scope.row)">打印</el-button>
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
import { searchExport, findExportList } from "@/api/order"
import { parseTime } from "@/utils"
import print from "print-js"

export default {
    data() {
        return {
            list: [],
            originList: [],
            originTotal: 0,
            modeSearch: false,
            searchWord: "",
            searchDate: "",
            checkedList: [],
            total: 0,
            loading: false,
            currentPage: 1,
            downloadLoading: false,
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
            findExportList({
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
            searchExport({
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
        view(row) {
            console.log("data", row)
            // row = JSON.stringify(row)
            this.$router.push({
                path: "/export/view",
                query: {
                    data: row,
                },
            })
        },
        doPrint() {
            printJS({
                printable: "view-box",
                type: "html",
                header: "XXX公司",
                // headerStyle: "text-align: center",
                // style: ".manage-table{width: 100%;text-align: center;border: 2px solid #000000;}",
                // targetStyle: ["border: 2px solid #000000"],
            })
        },
        handleDownload() {
            this.downloadLoading = true
            import("@/vendor/Export2Excel").then(excel => {
                const tHeader = [
                    "序号",
                    "出货单号",
                    "出货代表",
                    "出货单位",
                    "出货地址",
                    "出货日期",
                    // "托工单号",
                    // "工单号",
                    // "料号",
                    // "号头",
                    // "工单状态",
                    // "委托数量",
                    // "良品",
                    // "不良品",
                    // "未分配",
                    // "单位",
                    // "部门",
                    // "品牌代码",
                    // "制程说明",
                    // "类别",
                    // "状态",
                    // "托工日期",
                    // "交货日期",
                ]
                const filterVal = [
                    "index",
                    "exportid",
                    "operator",
                    "role",
                    "address",
                    "exporttime",
                    // "tuogongid",
                    // "gongid",
                    // "liaoid",
                    // "haotou",
                    // "gongstatus",
                    // "weituonum",
                    // "good",
                    // "bad",
                    // "unassign",
                    // "customname",
                    // "branchname",
                    // "brandname",
                    // "desc",
                    // "type",
                    // "status",
                    // "tuogongtime",
                    // "deliverytime",
                ]
                const data = this.formatJson(filterVal)
                excel.export_json_to_excel({
                    header: tHeader,
                    data,
                    filename: "出货列表",
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
