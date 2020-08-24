<template>
    <div class="g-userManage">
        <div class="manage-top">
            <el-input v-model="searchWord" class="u-inp" placeholder="请输入配货单号/托工单号/工单号" />
            <el-date-picker v-model="searchDate" class="top__date" type="date" @change="dateChange" placeholder="按托工日期搜索">
            </el-date-picker>
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="reset">重置</el-button>
            <el-button class="u-insert" type="primary" @click="doExport">出货</el-button>
        </div>
        <el-table :data="list" border type="flex" class="manage-table" style="width: 100%" @selection-change="check">
            <el-table-column type="selection" min-width="4%" align="center"> </el-table-column>
            <el-table-column min-width="10%" align="center" prop="assignid" label="配货单号" show-overflow-tooltip />
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
            <el-table-column min-width="24%" align="center" prop="desc" label="制程说明" show-overflow-tooltip />
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
            <el-table-column min-width="12%" align="center" prop label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="view(scope.row)">查看</el-button>
                    <el-button type="text" size="small" @click="del(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
import { searchAssign, findAssignList, deleteAssign, insertExportOrder } from "@/api/order"
import { parseTime } from "@/utils"
import { Loading } from "element-ui"

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
        findAssignList({
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
        // searchWordFocus() {
        //     this.searchDate = ""
        // },
        // searchDateFocus() {
        //     this.searchWord = ""
        // },
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
            searchAssign({
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
            console.log(row.id)
            // row = JSON.stringify(row)
            this.$router.push({
                path: "/assign/view",
                query: {
                    id: row.id,
                },
            })
        },
        del(row) {
            const _this = this
            _this
                .$confirm("此操作将删除该配货单, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                .then(() => {
                    deleteAssign({
                        id: row.id,
                    }).then(res => {
                        if (res.code === 0) {
                            _this.list = _this.list.filter(item => {
                                return item.id !== row.id
                            })
                            _this.originList = _this.originList.filter(item => {
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
        doExport() {
            const _this = this
            let checkedList = _this.checkedList
            let role = checkedList[0].role
            let canExport = true
            checkedList.map(item => {
                // let newItm = Object.assign({}, item)
                let itId = item.id
                delete item.id
                delete item.status

                if (item.role !== role) canExport = false

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
                return item
            })
            if (!canExport) {
                _this.$message("同一出货单只能是同一工厂的托工单！")
                return
            }
            insertExportOrder({
                list: checkedList,
                operator: _this.name,
            }).then(
                res => {
                    _this.$message({
                        message: "出单成功",
                        type: "success",
                    })
                },
                res => {}
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
</style>
