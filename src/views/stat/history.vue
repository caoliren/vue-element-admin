<template>
    <div class="g-userManage">
        <div class="manage-top">
            <el-button :loading="downloadLoading" class="manage-export" type="primary" icon="el-icon-download" @click="handleDownload">
                导出
            </el-button>
        </div>
        <el-table v-loading="loading" :data="list" border type="flex" class="manage-table" style="width: 100%" @selection-change="check">
            <el-table-column type="selection" min-width="4%" align="center"> </el-table-column>
            <el-table-column type="index" min-width="15%" align="center" label="序号"></el-table-column>
            <el-table-column min-width="10%" align="center" prop="stattime" label="盘点日期" show-overflow-tooltip />
            <el-table-column min-width="10%" align="center" prop="overdue" label="逾期(单)" show-overflow-tooltip />
            <el-table-column min-width="10%" align="center" prop="delivery" label="交期(单)" show-overflow-tooltip />
            <el-table-column min-width="10%" align="center" prop="normal" label="正常(单)" show-overflow-tooltip />
            <el-table-column min-width="10%" align="center" prop="exportnum" label="完成出货(单)" show-overflow-tooltip />
            <el-table-column min-width="15%" align="center" prop="operator" label="操作员" show-overflow-tooltip />
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
import { findStatHistory, search } from "@/api/order"
import { update } from "@/api/order"
import { parseTime } from "@/utils"
import { Loading } from "element-ui"

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
            dialogFormVisible: false,
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
            findStatHistory({
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
        handleDownload() {
            this.downloadLoading = true
            import("@/vendor/Export2Excel").then(excel => {
                const tHeader = ["序号", "盘点日期", "逾期(单)", "交期(单)", "正常(单)", "完成出货(单)", "操作员"]
                const filterVal = ["index", "stattime", "overdue", "delivery", "normal", "exportnum", "operator"]
                const data = this.formatJson(filterVal)
                excel.export_json_to_excel({
                    header: tHeader,
                    data,
                    filename: "盘点历史",
                })
                this.downloadLoading = false
            })
        },
        formatJson(filterVal) {
            let excelList = this.checkedList.length > 0 ? this.checkedList : this.list
            return excelList.map((v, idx) =>
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
