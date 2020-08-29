<template>
    <div id="p-export">
        <div class="export-top">
            <el-button class="u-insert" type="primary" @click="doPrint">打印</el-button>
        </div>
        <div id="view-box">
            <h2 class="box-tit">{{ info.role }}</h2>
            <div class="box-line"></div>
            <div class="box-address">{{ info.address }}</div>
            <div class="box-infos">
                <span class="box-infos__left">{{ "日期：" + info.exporttime }}</span>
                <span class="box-infos__right">{{ "出货单号：" + info.exportid }}</span>
            </div>
            <!-- :border="needBorder" -->
            <table border="1" cellspacing="0" class="table-box">
                <tr>
                    <th>序号</th>
                    <th>托工单号</th>
                    <th>工单号</th>
                    <th>号头</th>
                    <th>委托数量</th>
                    <th>单位</th>
                    <th>部门</th>
                    <th>品牌代码</th>
                    <th>制程说明</th>
                    <th>良品</th>
                    <th>不良品</th>
                </tr>
                <tr v-for="(item, index) in list" :key="item.id">
                    <td align="center">
                        <span class="table-td__span">{{ index + 1 }}</span>
                    </td>
                    <td align="center">
                        <span class="table-td__span">{{ item.tuogongid }}</span>
                    </td>
                    <td align="center">
                        <span class="table-td__span">{{ item.gongid }}</span>
                    </td>
                    <td align="center">
                        <span class="table-td__span">{{ item.haotou }}</span>
                    </td>
                    <td align="center">
                        <span class="table-td__span">{{ item.weituonum }}</span>
                    </td>
                    <td align="center">
                        <span class="table-td__span">{{ item.customname }}</span>
                    </td>
                    <td align="center">
                        <span class="table-td__span">{{ item.branchname }}</span>
                    </td>
                    <td align="center">
                        <span class="table-td__span">{{ item.brandname }}</span>
                    </td>
                    <td align="center">
                        <span class="table-td__span">{{ item.desc }}</span>
                    </td>
                    <td align="center">
                        <span class="table-td__span">{{ item.good }}</span>
                    </td>
                    <td align="center">
                        <span class="table-td__span">{{ item.bad }}</span>
                    </td>
                </tr>
            </table>

            <!-- <el-table
                :data="list"
                type="flex"
                id="manage-table"
                class="manage-table"
                :cell-style="tableCellStyle"
                :header-cell-style="tableHeaderCellStyle"
            >
                <el-table-column type="index" label="" min-width="4%"></el-table-column>
                <el-table-column min-width="10%" align="center" prop="tuogongid" label="" show-overflow-tooltip />
                <el-table-column min-width="10%" align="center" prop="gongid" label="" show-overflow-tooltip />
                <el-table-column min-width="8%" align="center" prop="haotou" label="" show-overflow-tooltip />
                <el-table-column min-width="8%" align="center" prop="weituonum" label="" show-overflow-tooltip />
                <el-table-column min-width="8%" align="center" prop="customname" label="" show-overflow-tooltip />
                <el-table-column min-width="8%" align="center" prop="branchname" label="" show-overflow-tooltip />
                <el-table-column min-width="8%" align="center" prop="brandname" label="" show-overflow-tooltip />
                <el-table-column min-width="16%" align="center" prop="desc" label="制程说明" show-overflow-tooltip />
                <el-table-column min-width="6%" align="center" prop="good" label="良品" show-overflow-tooltip />
                <el-table-column min-width="6%" align="center" prop="bad" label="不良品" show-overflow-tooltip />
            </el-table> -->
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
            // needBorder: true,
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
                _this.list = [
                    {
                        address: "广东省中山市中山路1号",
                        assignid: "PH13459183990",
                        bad: 0,
                        branchid: 5,
                        branchname: "部门2",
                        brandid: 16,
                        brandname: "111321",
                        customid: 1,
                        customname: "客户1客户1客户1客户1",
                        deliverytime: "2020-08-25T00:00:00.000Z",
                        desc: "111客户1客户1客户1客户1客户1客户1客户1客户1",
                        gongid: 1523123,
                        gongstatus: 1,
                        good: 153,
                        haotou: 15,
                        id: 32,
                        lastedittime: "2020-08-24T06:34:07.000Z",
                        liaoid: 15232322323,
                        linkid: 15,
                        operator: "admin",
                        role: "一厂",
                        tuogongid: "1532412312423",
                        tuogongtime: "2020-08-23T00:00:00.000Z",
                        tuogongtype: 1,
                        type: 1,
                        unassign: 0,
                        weituonum: 1523,
                        writetime: "2020-08-24T06:34:07.000Z",
                    },
                ]
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

        doPrint() {
            printJS({
                printable: "view-box",
                type: "html",
                // header: "XXX公司",
                headerStyle: "text-align: center",
                css: "https://js.ibaotu.com/revision/plugins/print.css",
                // style: ".manage-table{width: 100%;text-align: center;border: 2px solid #000000;}",
                // targetStyle: ["border: 2px solid #000000"],
            })
        },
    },
}
</script>
<style lang="scss">
#view-box {
    width: 100%;
    margin-top: 20px;
    background: #fff;
    padding: 0 30px 30px;
    /* border: 1px solid #bbb; */
}
/*
#view-box table {
    border: 1px solid red;
} */

.export-top {
    height: 36px;
    margin: 20px 0;
}

.u-insert {
    float: right;
}

.box-tit {
    text-align: center;
}

/* .box-line {
    width: 40%;
    height: 2px;
    margin: 10px auto 15px;
    background: #000;
} */

.box-line {
    width: 350px;
    height: 0;
    margin: 10px auto 15px;
    /* background: #000; */
    border-bottom: 1px solid #000;
}

.box-address {
    text-align: center;
}

.box-infos {
    box-sizing: border-box;
    padding: 25px 40px 10px;
    height: 66px;
    line-height: 16px;
}

.box-infos__left {
    float: left;
    width: 300px;
    text-align: left;
}

.box-infos__right {
    float: right;
    width: 300px;
    text-align: right;
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

.table-box {
    width: 100%;
}

.table-td__span {
    display: inline-block;
    max-width: 120px;
    font-size: 14px;
    line-height: 20px;
    padding: 5px 0;
}

/* th,
tr,
td {
    padding: 0;
}

.table-td__span {
    display: inline-block;
    max-width: 70px;
    font-size: 14px;
    line-height: 20px;
    padding: 5px 0;
} */
</style>
