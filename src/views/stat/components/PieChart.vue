<template>
    <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import { mapGetters } from "vuex"
import { stat } from "@/api/order"
import echarts from "echarts"
require("echarts/theme/macarons") // echarts theme
import resize from "../mixins/resize"
import { Loading } from "element-ui"

export default {
    mixins: [resize],
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
            default: "800px",
        },
    },
    data() {
        return {
            chart: null,
            list: [],
        }
    },
    mounted() {
        const _this = this
        this.$on("init", () => {
            _this.fetchData()
        })
        // this.$nextTick(() => {
        //   this.initChart()
        // })
    },
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
        fetchData() {
            const _this = this
            console.log(111)
            Loading.service()
            stat({
                role: _this.roles[0],
                operator: _this.name,
            }).then(res => {
                let loadingInstance = Loading.service()
                _this.$nextTick(() => {
                    // 以服务的方式调用的 Loading 需要异步关闭
                    loadingInstance.close()
                })
                console.log("数据盘点", res)
                if (res.code === 0) {
                    _this.list = res.data
                    _this.$nextTick(() => {
                        _this.initChart()
                    })
                }
            })
        },
        initChart() {
            console.log(2222)
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
    },
}
</script>
