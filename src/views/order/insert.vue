<template>
    <div class="p-insert">
        <el-form ref="form" :model="form" v-loading="loading" :rules="rules2">
            <div class="insert-top">
                <div class="insert-tit-wrap">
                    <h6 class="insert-tit">基本信息</h6>
                </div>
                <div class="insert-top__row">
                    <el-form-item class="insert-top__wrap" label="操作员：" prop="operator">
                        <span>{{ name }}</span>
                    </el-form-item>
                    <el-form-item class="insert-top__wrap" label="所属：" prop="role">
                        <span v-if="roles[0] !== 'admin'">{{ roles[0] }}</span>
                        <el-select v-else v-model="form.role" placeholder="请选择">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                    </el-form-item>
                </div>
                <div class="insert-top__row">
                    <el-form-item class="insert-top__wrap" label="托工单号：" prop="tuogongid">
                        <el-input v-model="form.tuogongid" placeholder="请输入托工单号"></el-input>
                    </el-form-item>
                    <el-form-item class="insert-top__wrap" label="托工日期：" prop="tuogongtime">
                        <el-date-picker v-model="form.tuogongtime" type="datetime" placeholder="选择托工日期时间" @change="changeDate">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item class="insert-top__wrap" label="交货日期：" prop="deliverytime">
                        <span>{{ form.deliverytime }}</span>
                    </el-form-item>
                </div>
                <div class="insert-top__row">
                    <el-form-item class="insert-top__wrap" label="托工类别：" prop="tuogongtype">
                        <el-select v-model="form.tuogongtype" placeholder="请选择托工类型" @change="changeTuogongType">
                            <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                    </el-form-item>
                </div>
            </div>
            <div class="insert-bot">
                <div class="insert-tit-wrap">
                    <h6 class="insert-tit">工单信息</h6>
                    <el-button class="insert-tit__add" type="primary" @click="handleCreate1">新增</el-button>
                </div>
                <el-table :data="gongOrderList" border type="flex" style="width: 100%">
                    <el-table-column min-width="8%" align="center" prop="gongid" label="工单号" show-overflow-tooltip />
                    <el-table-column min-width="8%" align="center" prop="liaoid" label="料号" show-overflow-tooltip />
                    <el-table-column min-width="8%" align="center" prop="haotou" label="号头" show-overflow-tooltip />
                    <el-table-column min-width="8%" align="center" prop="weituonum" label="委托数量" show-overflow-tooltip />
                    <el-table-column min-width="8%" align="center" prop="type" label="类别">
                        <template slot-scope="scope">
                            <span>{{ scope.row.type === 1 ? "良品" : "不良品" }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="15%" align="center" prop="customname" label="客户名称" show-overflow-tooltip />
                    <el-table-column min-width="10%" align="center" prop="branchname" label="部门" show-overflow-tooltip />
                    <el-table-column min-width="15%" align="center" prop="brandname" label="品牌代码" show-overflow-tooltip />
                    <el-table-column min-width="20%" align="center" prop="desc" label="制程说明" show-overflow-tooltip />
                    <!-- <el-table-column min-width="20%" align="center" prop label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="update(scope.row)">编辑</el-button>
                        <el-button v-if="scope.row.role !== 'admin'" type="text" size="small" @click="del(scope.row)">删除</el-button>
                    </template>
                </el-table-column> -->
                </el-table>
            </div>

            <div class="insert-opea">
                <el-button @click="back">
                    取消
                </el-button>
                <el-button type="primary" @click="createTuogong">
                    确定
                </el-button>
            </div>
        </el-form>

        <el-dialog :title="dialogTit" :visible.sync="dialogFormVisible">
            <el-form
                ref="dataForm1"
                :rules="rules"
                :model="newGongOrder"
                label-position="left"
                label-width="100px"
                style="width: 400px; margin-left:50px;"
            >
                <el-form-item label="工单号" prop="gongid">
                    <el-input v-model="newGongOrder.gongid" />
                </el-form-item>
                <el-form-item label="料号" prop="liaoid">
                    <el-input v-model="newGongOrder.liaoid" />
                </el-form-item>
                <el-form-item label="号头" prop="haotou">
                    <el-input v-model="newGongOrder.haotou" />
                </el-form-item>
                <el-form-item label="委托数" prop="weituonum">
                    <el-input v-model="newGongOrder.weituonum" />
                </el-form-item>
                <el-form-item label="类别" prop="type">
                    <el-select v-model="newGongOrder.type" placeholder="请选择类别" @change="changeType">
                        <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="客户名称" prop="customid">
                    <el-select v-model="newGongOrder.customid" placeholder="请选择客户名称" @change="changeCustom">
                        <el-option v-for="item in customs" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="部门" prop="branchid">
                    <el-select v-model="newGongOrder.branchid" placeholder="请选择部门" @change="changeBranch" @>
                        <el-option v-for="item in branchs" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="品牌代码" prop="brandid">
                    <el-select v-model="newGongOrder.brandid" placeholder="请选择品牌代码" @change="changeBrand">
                        <el-option v-for="item in brands" :key="item.id" :label="item.code" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="制程说明" prop="desc">
                    <span>{{ newGongOrder.desc }}</span>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">
                    取消
                </el-button>
                <el-button type="primary" @click="createGongOrder">
                    确定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
import { findFactoryName } from "@/api/factory"
import { find, findBranch, findBrand, findBrandDesc } from "@/api/custom"
import { insert } from "@/api/order"
import request from "@/utils/request"
import { parseTime } from "@/utils"

export default {
    data() {
        return {
            list: [],
            originList: [],
            dialogTit: "添加工单",
            gongOrderList: [],
            dialogFormVisible: false,
            options: [
                {
                    value: "选项1",
                    label: "黄金糕",
                },
                {
                    value: "选项2",
                    label: "双皮奶",
                },
                {
                    value: "选项3",
                    label: "蚵仔煎",
                },
                {
                    value: "选项4",
                    label: "龙须面",
                },
                {
                    value: "选项5",
                    label: "北京烤鸭",
                },
            ],
            options2: [
                {
                    value: 1,
                    label: "正常托工单",
                },
                {
                    value: 0,
                    label: "退货单",
                },
            ],
            typeOptions: [
                {
                    value: 1,
                    label: "良品",
                },
                {
                    value: 0,
                    label: "不良品",
                },
            ],
            customs: [
                {
                    id: 1,
                    name: "客户1",
                },
                {
                    id: 2,
                    name: "客户2",
                },
            ],
            branchs: [
                {
                    id: 1,
                    name: "部门1",
                },
                {
                    id: 2,
                    name: "部门2",
                },
            ],
            brands: [
                {
                    id: 1,
                    code: "1232312",
                },
                {
                    id: 2,
                    code: "213123",
                },
            ],
            form: {
                role: "",
                tuogongid: "",
                operator: "",
                tuogongtime: "",
                deliverytime: "XXX",
                tuogongtype: 1,
            },
            newGongOrder: {
                gongid: null,
                liaoid: null,
                haotou: null,
                weituonum: null,
                type: "",
                customid: null,
                customname: "",
                branchid: null,
                branchname: "",
                brandid: null,
                brandname: "",
                desc: "",
            },
            rules: {
                gongid: [{ required: true, message: "请填写工单号", trigger: "change" }],
                liaoid: [{ required: true, message: "请填写料号", trigger: "change" }],
                haotou: [{ required: true, message: "请填写号头", trigger: "change" }],
                weituonum: [{ required: true, message: "请填写委托数量", trigger: "change" }],
                type: [{ required: true, message: "请选择类别", trigger: "change" }],
                customid: [{ required: true, message: "请选择客户名称", trigger: "change" }],
                branchid: [{ required: true, message: "请填写部门", trigger: "change" }],
                brandid: [{ required: true, message: "请填写品牌代码", trigger: "change" }],
            },
            rules2: {
                role: [{ required: true, message: "请选择所属工厂", trigger: "change" }],
                tuogongid: [{ required: true, message: "请选择所属工厂", trigger: "change" }],
                tuogongtime: [{ required: true, message: "请选择托工日期", trigger: "change" }],
                tuogongtype: [{ required: true, message: "请选择托工类型", trigger: "change" }],
            },
            loading: false,
        }
    },
    created() {
        const _this = this
        findFactoryName()
            .then(res => {
                if (res.code === 0) {
                    let { data } = res
                    if (data.length) {
                        data = data.map(item => {
                            item = {
                                value: item,
                                label: item,
                            }
                            return item
                        })
                        _this.options = data
                    }
                }
            })
            .catch(error => {
                console.log(error)
            })

        // 请求客户列表
        find().then(res => {
            if (res.code === 0) {
                let data = res.data
                _this.customs = data
            }
        })

        _this.form.operator = _this.name
        if (_this.roles[0] !== "admin") {
            _this.form.role = _this.roles[0]
        }
    },
    computed: {
        ...mapGetters(["name", "roles"]),
    },
    methods: {
        changeDate(date) {
            Date.prototype.Format = function(fmt) {
                var o = {
                    "M+": this.getMonth() + 1, // 月份
                    "d+": this.getDate(), // 日
                    "h+": this.getHours(), // 小时
                    "m+": this.getMinutes(), // 分
                    "s+": this.getSeconds(), // 秒
                    "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
                    S: this.getMilliseconds(), // 毫秒
                }
                if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, this.getFullYear() + "")
                for (var k in o)
                    if (new RegExp("(" + k + ")").test(fmt))
                        fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length))
                return fmt
            } //"2018-11-15 17:40:00"

            this.form.tuogongtime = new Date(date).Format("yy-MM-dd hh:mm:ss")
            this.form.deliverytime = new Date(date.setHours(date.getHours() + 48)).Format("yy-MM-dd hh:mm:ss")
        },
        changeType(type) {
            this.newGongOrder.type = type
        },
        changeTuogongType(type) {
            this.form.tuogongtype = type
        },
        changeCustom(id) {
            const _this = this
            findBranch({
                pid: id,
            }).then(res => {
                if (res.code === 0) {
                    if (!res.data || !res.data.length) {
                        _this.newGongOrder.branchid = null
                        _this.newGongOrder.brandid = null
                        _this.branchs = []
                        _this.brands = []
                    } else {
                        _this.customs.map(item => {
                            if (item.id === id) {
                                _this.newGongOrder.customname = item.name
                            }
                        })

                        _this.branchs = res.data
                    }
                }
            })
        },
        changeBranch(id) {
            const _this = this
            findBrand({
                pid: id,
            }).then(res => {
                if (res.code === 0) {
                    if (!res.data || !res.data.length) {
                        _this.newGongOrder.brandid = null
                        _this.brands = []
                    } else {
                        _this.branchs.map(item => {
                            if (item.id === id) {
                                _this.newGongOrder.branchname = item.name
                            }
                        })
                        _this.brands = res.data
                    }
                }
            })
        },
        changeBrand(id) {
            const _this = this
            _this.brands.map(item => {
                if (item.id === id) {
                    _this.brands.map(item => {
                        if (item.id === id) {
                            _this.newGongOrder.brandname = item.code
                        }
                    })
                    _this.newGongOrder.desc = item.desc
                }
            })
        },
        handleCreate1() {
            this.newGongOrder = {
                gongid: null,
                liaoid: null,
                haotou: null,
                weituonum: null,
                type: "",
                customid: null,
                customname: "",
                branchid: null,
                branchname: "",
                brandid: null,
                brandname: "",
                desc: "",
            }
            this.dialogFormVisible = true
            this.$nextTick(() => {
                this.$refs["dataForm1"].clearValidate()
            })
        },
        createGongOrder() {
            const _this = this
            let newG = _this.newGongOrder
            _this.$refs["dataForm1"].validate(valid => {
                if (valid) {
                    _this.gongOrderList.push(newG)
                    _this.dialogFormVisible = false
                }
            })
        },
        createTuogong() {
            const _this = this
            let form = _this.form
            let gongOrderList = _this.gongOrderList
            _this.$refs["form"].validate(valid => {
                if (valid) {
                    if (!gongOrderList.length) {
                        _this.$message.error("请先新增工单")
                    }
                    _this.loading = true
                    let promises = []
                    gongOrderList.map(item => {
                        let data = Object.assign({}, item, form)

                        data.gongstatus = -1
                        data.good = 0
                        data.bad = 0
                        data.unassign = data.weituonum
                        let pro = new Promise((resolve, reject) => {
                            insert(data).then(
                                res => {
                                    resolve()
                                },
                                res => {
                                    reject()
                                }
                            )
                        })
                        promises.push(pro)
                    })
                    Promise.all(promises)
                        .then(res => {
                            console.log("全部请求发送完成")
                            _this.$router.push({
                                path: "/order/index",
                            })
                        })
                        .catch(e => {
                            console.log("error", e)
                        })
                }
            })
        },
        back() {
            const _this = this
            if (!_this.gongOrderList.length) {
                _this.$router.push({
                    path: "/order/index",
                })
            } else {
                _this
                    .$confirm("是否返回列表？", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    })
                    .then(() => {
                        _this.$router.push({
                            path: "/order/index",
                        })
                    })
                    .catch(() => {
                        console.log("已取消删除")
                    })
            }
        },
    },
}
</script>
<style lang="scss">
.insert-tit-wrap {
    display: flex;
    justify-content: space-between;
    margin: 30px 0 20px;
}
.insert-tit {
    font-size: 20px;
    margin: 0;
}
.insert-tit__add {
    position: relative;
    top: -6px;
}
.insert-top__row {
    display: flex;
    height: 36px;
    line-height: 36px;
    margin-bottom: 30px;
    font-size: 14px;
}
.insert-top__wrap {
    display: flex;
    height: 36px;
    margin-right: 30px;
}
.insert-top--long {
    width: 115px;
}
.insert-opea {
    display: flex;
    justify-content: space-between;
    width: 200px;
    margin: 100px auto 50px;
    text-align: center;
}
</style>
