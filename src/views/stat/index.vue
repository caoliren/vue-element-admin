<template>
    <div class="chart-box">
        <!-- <div v-if="stated" class="stat-btn" @click="toStatTotalList">盘点调账</div> -->
        <el-button v-if="stated" type="primary" class="stat-btn" @click="toStatTotalList">盘点调账</el-button>
        <div v-else class="stat-wrap" @click="startStat">
            <img class="stat-start" src="@/assets/icon/icon_pandian.png" />
            <p class="stat-tip">立即盘点</p>
        </div>
        <div class="chart-wrap">
            <!-- <div class="chart" :style="{ height: height, width: width }">

            </div> -->
            <pie-chart ref="pie" />
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex"
import { stat } from "@/api/order"
import echarts from "echarts"
require("echarts/theme/macarons") // echarts theme
import resize from "./mixins/resize"
import { Loading } from "element-ui"
import PieChart from "./components/PieChart"

export default {
    mixins: [resize],
    components: { PieChart },
    props: {
        className: {
            type: String,
            default: "chart",
        },
        width: {
            type: String,
            default: "100%",
        },
        height: {
            type: String,
            default: "700px",
        },
    },
    data() {
        return {
            chart: null,
            // list: [],
            stated: false,
        }
    },
    created() {},
    mounted() {},
    beforeDestroy() {
        if (!this.chart) {
            return
        }
        this.chart.dispose()
        this.chart = null
    },
    computed: {
        ...mapGetters(["name", "roles"]),
    },
    methods: {
        startStat() {
            const _this = this

            this.$refs.pie.$emit("init")
            this.stated = true

            // Loading.service()
            // stat({
            //     role: _this.roles[0],
            //     operator: _this.name,
            // }).then(res => {
            //     let loadingInstance = Loading.service()
            //     _this.$nextTick(() => {
            //         // 以服务的方式调用的 Loading 需要异步关闭
            //         loadingInstance.close()
            //     })
            //     console.log("数据盘点", res)
            //     if (res.code === 0) {
            //         _this.list = res.data
            //         _this.stated = true
            //         _this.$nextTick(() => {
            //             _this.initChart()
            //         })
            //     }
            // })
        },
        initChart() {
            const _this = this
            let list = _this.list
            this.chart = echarts.init(this.$el, "macarons")

            this.chart.on("click", function eConsole(param) {
                console.log("饼图点击", param.data)
                _this.$router.push({
                    path: "/stat/statlist",
                    query: {
                        status: param.data.status,
                    },
                })
            })

            this.chart.setOption({
                tooltip: {
                    trigger: "item",
                    formatter: "{a} <br/>{b} : {c} ({d}%)",
                },
                legend: {
                    left: "center",
                    bottom: "10",
                    data: ["正常未分配", "交期未分配", "逾期未分配"],
                },
                series: [
                    {
                        name: "数据盘点",
                        type: "pie",
                        roseType: "radius",
                        radius: [20, 200],
                        // radius: "50%",
                        center: ["50%", "38%"],
                        color: ["#2196f3", "#ffc107", "#f44336"],
                        data: [
                            { value: list[0].count, name: "正常未分配", status: -1 },
                            { value: list[1].count, name: "交期未分配", status: 0 },
                            { value: list[2].count, name: "逾期未分配", status: 1 },
                        ],
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    formatter: "{b} : {c} ({d}%)",
                                },
                                labelLine: { show: true },
                            },
                        },
                        animationEasing: "cubicInOut",
                        animationDuration: 2000,
                    },
                ],
            })
        },
        toStatTotalList() {
            this.$router.push("/stat/statTotalList")
        },
    },
}
</script>
<style lang="scss">
.chart-box {
    position: relative;
    height: 1000px;
    margin-top: 100px;
}
.chart-wrap {
    position: relative;
    height: 800px;
}
.stat-wrap {
    margin: 100px auto 0;
    text-align: center;
}
.stat-start {
    width: 200px;
    height: 200px;
}
.stat-tip {
    font-size: 14px;
}
.stat-btn {
    position: absolute;
    right: 40px;
    top: 20px;
    z-index: 2;
    /* width: 100px;
    height: 30px;
    color: #fff;
    background: chartreuse; */
}
</style>
