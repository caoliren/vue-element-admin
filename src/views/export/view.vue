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
                    <!-- <th>部门</th> -->
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
                    <td align="center" class="table-td__customname">
                        <span class="table-td__span">{{ item.customname }}</span>
                    </td>
                    <!-- <td align="center">
                        <span class="table-td__span">{{ item.branchname }}</span>
                    </td> -->
                    <td align="center">
                        <span class="table-td__span">{{ item.brandname }}</span>
                    </td>
                    <td align="center">
                        <span class="table-td__span table-td__elli">{{ item.desc }}</span>
                    </td>
                    <td align="center">
                        <span class="table-td__span">{{ item.good }}</span>
                    </td>
                    <td align="center">
                        <span class="table-td__span">{{ item.bad }}</span>
                    </td>
                </tr>
            </table>

            <div class="box-bottom">
                <div class="box-bottom__left">
                    <div class="box-operator">{{ "制单人员：" + info.operator }}</div>
                    <div class="box-operator">{{ "发货代表：" }}</div>
                    <div class="box-operator">{{ "收货代表：" }}</div>
                </div>
                <div class="box-bottom__right">
                    <span class="box-bottom__total">总计：</span>
                    <span class="box-bottom__span box-bottom__good">{{ total.good }}</span>
                    <span class="box-bottom__span box-bottom__bad">{{ total.bad }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { searchExport, findExportList, findExport } from "@/api/order"
import { parseTime } from "@/utils"
import { Loading } from "element-ui"
import print from "print-js"
import "./view.scss"

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
            total: {
                good: 0,
                bad: 0,
            },
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
                _this.list = [...res.data, ...res.data, ...res.data, ...res.data, ...res.data]
                _this.originList = res.data
                let good = 0,
                    bad = 0
                for (let i = 0; i < res.data.length; i++) {
                    good += res.data[i].good
                    bad += res.data[i].bad
                }
                _this.total = {
                    good,
                    bad,
                }
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
