<template>
    <div id="p-export" class="g-userManage">
        <div class="manage-top">
            <el-button class="u-insert" type="primary" @click="doPrint">打印</el-button>
        </div>
        <div id="view-box">
            <h2 class="box-tit">{{ info.role }}</h2>
            <div class="box-line"></div>
            <div class="box-address">{{ info.address }}</div>
            <div class="box-infos">
                <span class="box-infos__left">{{ "日期：" + info.exporttime }}</span>
                <span class="box-infos__left">{{ "出货单号：" + info.exportid }}</span>
            </div>
            <el-table
                :data="list"
                :border="needBorder"
                type="flex"
                id="manage-table"
                class="manage-table"
                :cell-style="tableCellStyle"
                :header-cell-style="tableHeaderCellStyle"
                style="width: 100%; border:1px solid #EBEEF5; border-color: #868686"
            >
                <el-table-column type="index" label="序号" min-width="4%"></el-table-column>
                <el-table-column min-width="10%" align="center" prop="tuogongid" label="托工单号" show-overflow-tooltip />
                <el-table-column min-width="10%" align="center" prop="gongid" label="工单号" show-overflow-tooltip />
                <el-table-column min-width="8%" align="center" prop="haotou" label="号头" show-overflow-tooltip />
                <el-table-column min-width="8%" align="center" prop="weituonum" label="委托数量" show-overflow-tooltip />
                <el-table-column min-width="8%" align="center" prop="customname" label="单位" show-overflow-tooltip />
                <el-table-column min-width="8%" align="center" prop="branchname" label="部门" show-overflow-tooltip />
                <el-table-column min-width="8%" align="center" prop="brandname" label="品牌代码" show-overflow-tooltip />
                <el-table-column min-width="16%" align="center" prop="desc" label="制程说明" show-overflow-tooltip />
                <el-table-column min-width="6%" align="center" prop="good" label="良品" show-overflow-tooltip />
                <el-table-column min-width="6%" align="center" prop="bad" label="不良品" show-overflow-tooltip />
            </el-table>
            <div class="box-operator">{{ "发货代表：" + info.operator }}</div>
        </div>
    </div>
</template>
<script>
import { searchExport, findExportList, findExport } from "@/api/order"
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
            needBorder: true,
            info: {},
        }
    },
    created() {
        const _this = this
        let data = this.$route.query.data
        _this.info = data
        Loading.service()
        findExport({
            linkid: data.id,
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

        // let box = document.getElementById("manage-table")
        // let tables = document.getElementsByTagName("table")
        // var arr = [...tables]
        // console.log("tables", tables, arr)
        // for (let i = 0; i < arr.length; i++) {
        //     console.log("element", arr[i])
        //     arr[i].setAttribute("border", "1px")
        // }
    },
    methods: {
        tableCellStyle() {
            return "border-color: #868686;"
        },
        // 修改 table header cell的背景色
        tableHeaderCellStyle() {
            return "border-color: #868686; color: #606266;"
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
        doPrint() {
            printJS({
                printable: "view-box",
                type: "html",
                // header: "XXX公司",
                headerStyle: "text-align: center",
                // style: ".manage-table{width: 100%;text-align: center;border: 2px solid #000000;}",
                // targetStyle: ["border: 2px solid #000000"],
            })
        },
    },
}
</script>
<style lang="scss">
/* .app-main {
    background: #f7f7f7;
} */
#view-box {
    margin-top: 20px;
    background: #fff;
    padding: 0 30px 30px;
    border: 1px solid #bbb;
}
.g-userManage {
    padding: 20px 0;

    .u-tab1 {
        width: 70%;
    }
}

.manage-top {
    height: 36px;
    .u-inp {
        width: 250px;
        margin-right: 20px;
    }
    .u-insert {
        float: right;
    }
}

.box-tit {
    text-align: center;
}

.box-line {
    width: 40%;
    height: 1px;
    margin: 10px auto 15px;
    background: #000;
}

.box-address {
    text-align: center;
}

.box-infos {
    display: flex;
    justify-content: space-between;
    padding: 25px 40px 10px;
    height: 16px;
    line-height: 16px;

    .box-infos__left {
    }
    .box-infos__right {
    }
}

.box-operator {
    padding-left: 40px;
    margin-top: 30px;
    height: 16px;
    line-height: 16px;
}

.manage-table {
    margin-top: 40px;
}
</style>
