<template>
    <div id="p-export" class="g-userManage">
        <div class="manage-top">
            <el-input v-model="searchWord" class="u-inp" placeholder="请输入出货单号/单位/出货代表" />
            <el-date-picker v-model="searchDate" class="top__date" type="date" @change="dateChange" placeholder="按出货日期搜索">
            </el-date-picker>
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="reset">重置</el-button>
            <el-button class="u-insert" type="primary" @click="doPrint">打印</el-button>
        </div>
        <el-table :data="list" border type="flex" id="manage-table" class="manage-table" style="width: 100%" @selection-change="check">
            <el-table-column type="selection" min-width="4%" align="center"> </el-table-column>
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
    </div>
</template>
<script>
import { mapGetters } from "vuex"
import { searchExport, findExportList } from "@/api/order"
import { parseTime } from "@/utils"
import { Loading } from "element-ui"
import print from "print-js"
export default {
    data() {
        return {
            list: [],
            originList: [],
            searchWord: "",
            searchDate: "",
            checkedList: [],
        }
    },
    created() {
        const _this = this
        Loading.service()
        findExportList({
            role: _this.roles[0],
        }).then(res => {
            let loadingInstance = Loading.service()
            _this.$nextTick(() => {
                // 以服务的方式调用的 Loading 需要异步关闭
                loadingInstance.close()
            })
            console.log("工厂管理", res)
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
            searchExport({
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
</style>
