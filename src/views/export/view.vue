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
            if (res.code === 0) {
                _this.list = res.data
                _this.originList = res.data
            }
        })
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
                headerStyle: "text-align: center",
                css: "https://js.ibaotu.com/revision/plugins/print.css",
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
    padding: 25px 0 10px;
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

.table-box th {
    padding: 10px 0;
}
.table-box td {
    padding: 10px 0;
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
