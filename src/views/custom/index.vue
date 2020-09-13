<template>
    <div class="g-userManage">
        <div class="g-top">
            <el-input v-model="searchWord" class="u-inp" placeholder="请输入客户名称" />
            <el-button type="primary" @click="searchFnc(true)">搜索</el-button>
            <el-button @click="reset">重置</el-button>
        </div>
        <el-row :gutter="5" type="flex">
            <el-col :span="10" :lg="10">
                <el-card class="box-card" body-style="padding: 5px">
                    <div slot="header" class="clearfix">
                        <span>客户列表</span>
                        <el-button style="float: right; padding: 3px 0" type="text" @click="handleCreate1">添加</el-button>
                    </div>
                    <el-table
                        v-loading="loading1"
                        ref="multipleTable"
                        :data="list"
                        tooltip-effect="dark"
                        border
                        highlight-current-row
                        @row-click="clickColumn1"
                        style="width: 100%;font-size: 14px;"
                    >
                        <el-table-column prop="name" label="客户名称" min-width="26%" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <div>{{ scope.row.name }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="address" label="地址" min-width="30%" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <div>{{ scope.row.address }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="remark" label="备注" min-width="25%" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <div>{{ scope.row.remark }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="操作" min-width="19%">
                            <template slot-scope="scope">
                                <el-button type="text" @click.stop="handleEdit1(scope.row)">修改</el-button>
                                <el-button type="text" @click.stop="deleteCustom1(scope.row.id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                        v-show="total1 > 0"
                        class="pagination-box"
                        background
                        @current-change="handleCurrentChange1"
                        :current-page.sync="currentPage1"
                        :page-size="10"
                        layout="total, prev, pager, next, jumper"
                        :total="total1"
                    >
                    </el-pagination>
                </el-card>
            </el-col>
            <el-col :span="5" :lg="5">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>部门列表</span>
                        <el-button style="float: right; padding: 3px 0" type="text" @click="handleCreate2">添加</el-button>
                    </div>
                    <el-table
                        v-loading="loading2"
                        ref="multipleTable2"
                        :data="branch"
                        border
                        :row-style="rowStyle2"
                        :cell-style="{ padding: '0' }"
                        tooltip-effect="dark"
                        highlight-current-row
                        @row-click="clickColumn2"
                        style="width: 100%;font-size: 14px;"
                    >
                        <el-table-column prop="name" label="部门名称" min-width="74%" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <div>{{ scope.row.name }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" min-width="26%">
                            <template slot-scope="scope">
                                <el-button type="text" class="table2__edit" @click.stop="handleEdit2(scope.row)">修改</el-button>
                                <el-button class="table2__del" type="text" @click.stop="deleteCustom2(scope.row.id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                        v-show="total2 > 0"
                        class="pagination-box"
                        background
                        @current-change="handleCurrentChange2"
                        :current-page.sync="currentPage2"
                        :page-size="10"
                        layout="total, prev, pager, next"
                        :total="total2"
                    >
                    </el-pagination>
                </el-card>
            </el-col>
            <el-col :span="9" :lg="9">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>品牌代码</span>
                        <el-button style="float: right; padding: 3px 0" type="text" @click="handleCreate3">添加</el-button>
                    </div>
                    <el-table
                        v-loading="loading3"
                        ref="multipleTable3"
                        :data="brand"
                        border
                        tooltip-effect="dark"
                        highlight-current-row
                        style="width: 100%;"
                    >
                        <el-table-column prop="code" label="品牌代码" min-width="25%" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <div>{{ scope.row.code }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="desc" label="制程说明" min-width="50%" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <div>{{ scope.row.desc }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" min-width="25%">
                            <template slot-scope="scope">
                                <el-button type="text" @click.stop="handleEdit3(scope.row)">修改</el-button>
                                <el-button type="text" @click.stop="deleteCustom3(scope.row.id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                        v-show="total3 > 0"
                        class="pagination-box"
                        background
                        @current-change="handleCurrentChange3"
                        :current-page.sync="currentPage3"
                        :page-size="10"
                        layout="total, prev, pager, next, jumper"
                        :total="total3"
                    >
                    </el-pagination>
                </el-card>
            </el-col>
        </el-row>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form
                ref="dataForm1"
                :rules="rules"
                :model="newCustom"
                label-position="left"
                label-width="100px"
                style="width: 400px; margin-left:50px;"
            >
                <el-form-item label="名称" prop="name">
                    <el-input v-model="newCustom.name" />
                </el-form-item>
                <el-form-item label="地址" prop="address">
                    <el-input v-model="newCustom.address" />
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="newCustom.remark" />
                    <!-- <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" placeholder="Please input" /> -->
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">
                    取消
                </el-button>
                <el-button type="primary" @click="dialogStatus === 'create' ? createCustom1() : updateCustom1()">
                    确定
                </el-button>
            </div>
        </el-dialog>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible2">
            <el-form
                ref="dataForm2"
                :rules="rules2"
                :model="newBranch"
                label-position="left"
                label-width="100px"
                style="width: 400px; margin-left:50px;"
            >
                <el-form-item label="部门名称" prop="name">
                    <el-input v-model="newBranch.name" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible2 = false">
                    取消
                </el-button>
                <el-button type="primary" @click="dialogStatus === 'create' ? createCustom2() : updateCustom2()">
                    确定
                </el-button>
            </div>
        </el-dialog>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible3">
            <el-form
                ref="dataForm3"
                :rules="rules3"
                :model="newBrand"
                label-position="left"
                label-width="100px"
                style="width: 400px; margin-left:50px;"
            >
                <el-form-item label="品牌代码" prop="code">
                    <el-input v-model="newBrand.code" />
                </el-form-item>
                <el-form-item label="制程说明" prop="desc">
                    <el-input v-model="newBrand.desc" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible3 = false">
                    取消
                </el-button>
                <el-button type="primary" @click="dialogStatus === 'create' ? createCustom3() : updateCustom3()">
                    确定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
import {
    search,
    find,
    insert,
    update,
    del,
    insertBranch,
    updateBranch,
    findBranch,
    deleteBranch,
    insertBrand,
    updateBrand,
    findBrand,
    deleteBrand,
} from "@/api/custom"

export default {
    data() {
        return {
            rowStyle2: {
                height: "30px",
            },
            list: [],
            originList: [],
            originTotal: 0,
            modeSearch: false,
            total1: 0,
            total2: 0,
            total3: 0,
            loading1: false,
            loading2: false,
            loading3: false,
            currentPage1: 1,
            currentPage2: 1,
            currentPage3: 1,
            branch: [],
            brand: [],
            dialogFormVisible: false,
            dialogFormVisible2: false,
            dialogFormVisible3: false,
            dialogStatus: "",
            newCustom: {
                remark: "",
                name: "",
                address: "",
            },
            newBranch: {
                name: "",
            },
            newBrand: {
                code: "",
                desc: "",
            },
            textMap: {
                update: "修改",
                create: "添加",
            },
            currentCustomId: 0,
            currentBranchId: 0,
            searchWord: "",
            rules: {
                name: [{ required: true, message: "请填写客户名称", trigger: "change" }],
                address: [{ required: true, message: "请填写客户地址", trigger: "change" }],
            },
            rules2: {
                name: [{ required: true, message: "请填写部门名称", trigger: "change" }],
            },
            rules3: {
                code: [{ required: true, message: "请填写品牌代码", trigger: "change" }],
                desc: [{ required: true, message: "请填写制程说明", trigger: "change" }],
            },
        }
    },
    created() {
        this.getList(true)
    },
    computed: {
        ...mapGetters(["roles"]),
    },
    methods: {
        handleCurrentChange1(val) {
            console.log(`当前页: ${val}`)
            if (this.modeSearch) {
                this.searchFnc(true)()
            } else {
                this.getList()
            }
        },
        handleCurrentChange2(val) {
            console.log(`当前页: ${val}`)
            if (this.modeSearch) {
                this.searchFnc()()
            } else {
                this.clickColumn1()
            }
        },
        handleCurrentChange3(val) {
            console.log(`当前页: ${val}`)
            if (this.modeSearch) {
                this.searchFnc()
            } else {
                this.clickColumn2({
                    id: this.currentBranchId,
                })
            }
        },
        getList(isInit) {
            const _this = this
            this.loading1 = true
            find({
                role: _this.roles[0],
                page: _this.currentPage1,
            }).then(res => {
                this.loading1 = false
                if (res.code === 0) {
                    let data = res.data
                    _this.list = data.data
                    if (isInit) _this.originList = data.data
                    _this.total1 = data.total
                    _this.originTotal = data.total
                    _this.$refs.multipleTable.setCurrentRow(_this.list[0])
                    _this.clickColumn1(_this.list[0])
                }
            })
        },
        handleCreate1() {
            this.newCustom = {
                remark: "",
                name: "",
                address: "",
            }
            this.dialogStatus = "create"
            this.dialogFormVisible = true
            this.$nextTick(() => {
                this.$refs["dataForm1"].clearValidate()
            })
        },
        handleCreate2() {
            this.newBranch = {
                name: "",
            }
            this.dialogStatus = "create"
            this.dialogFormVisible2 = true
            this.$nextTick(() => {
                this.$refs["dataForm2"].clearValidate()
            })
        },
        handleCreate3() {
            this.newBrand = {
                code: "",
                desc: "",
            }
            this.dialogStatus = "create"
            this.dialogFormVisible3 = true
            this.$nextTick(() => {
                this.$refs["dataForm3"].clearValidate()
            })
        },
        handleEdit1(row) {
            this.newCustom = row
            this.dialogStatus = "update"
            this.dialogFormVisible = true
            this.$nextTick(() => {
                this.$refs["dataForm1"].clearValidate()
            })
        },
        handleEdit2(row) {
            this.newBranch = row
            this.dialogStatus = "update"
            this.dialogFormVisible2 = true
            this.$nextTick(() => {
                this.$refs["dataForm2"].clearValidate()
            })
        },
        handleEdit3(row) {
            this.newBrand = row
            this.dialogStatus = "update"
            this.dialogFormVisible3 = true
            this.$nextTick(() => {
                this.$refs["dataForm3"].clearValidate()
            })
        },
        deleteCustom1(id) {
            const _this = this

            _this
                .$confirm("此操作将删除该客户, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                .then(() => {
                    del({
                        id,
                    }).then(res => {
                        console.log("删除客户", res)
                        if (res.code === 0) {
                            _this.list = _this.list.filter(item => {
                                return item.id !== id
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
        deleteCustom2(id) {
            const _this = this

            _this
                .$confirm("此操作将删除该部门, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                .then(() => {
                    deleteBranch({
                        id,
                    }).then(res => {
                        console.log("删除客户", res)
                        if (res.code === 0) {
                            _this.branch = _this.branch.filter(item => {
                                return item.id !== id
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
        deleteCustom3(id) {
            const _this = this

            _this
                .$confirm("此操作将删除该品牌代码, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                .then(() => {
                    deleteBrand({
                        id,
                    }).then(res => {
                        console.log("删除品牌代码", res)
                        if (res.code === 0) {
                            _this.brand = _this.brand.filter(item => {
                                return item.id !== id
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
        clickColumn1(row) {
            const _this = this
            let id = row ? row.id : this.currentCustomId
            if (row) {
                this.currentCustomId = row.id
            }
            this.loading2 = true
            findBranch({
                pid: id,
                page: _this.currentPage2,
            }).then(res => {
                this.loading2 = false
                if (res.code === 0) {
                    let data = res.data
                    if (!data.data || !data.data.length) {
                        _this.branch = []
                        _this.brand = []
                    }
                    _this.branch = data.data
                    _this.total2 = data.total
                    _this.$refs.multipleTable2.setCurrentRow(_this.branch[0])
                    _this.clickColumn2(_this.branch[0])
                }
            })
        },
        clickColumn2(row) {
            const _this = this
            console.log("row", row)
            if (!row || !row.id) {
                this.brand = []
                return
            }
            this.currentBranchId = row.id
            this.loading3 = true
            findBrand({
                pid: row.id,
                page: _this.currentPage3,
            }).then(res => {
                this.loading3 = false
                if (res.code === 0) {
                    let data = res.data
                    if (!data.data || !data.data.length) {
                        _this.brand = []
                    }
                    _this.brand = data.data
                    _this.total3 = data.total
                }
            })
        },
        searchFnc(fromSearchBtn) {
            const _this = this
            let word = _this.searchWord.trim()
            if (!word) {
                _this.reset()
                return
            }
            if (!this.modeSearch) {
                this.modeSearch = true
            }
            if (fromSearchBtn) {
                this.currentPage1 = 1
            }
            search({
                word,
                role: _this.roles[0],
                page: _this.currentPage1,
            }).then(
                res => {
                    console.log("搜索结果", res)
                    if (res.code === 0) {
                        let data = res.data
                        if (!data || !data.data.length) {
                            _this.$message("未找到相关内容")
                            _this.list = []
                            _this.branch = []
                            _this.brand = []
                            _this.total1 = 0
                            _this.total2 = 0
                            _this.total3 = 0
                        } else {
                            _this.list = data.data
                            _this.total1 = data.total
                            _this.$refs.multipleTable.setCurrentRow(_this.list[0])
                            _this.clickColumn1(_this.list[0])
                        }
                    }
                },
                res => {
                    _this.list = []
                    _this.branch = []
                    _this.brand = []
                }
            )
        },
        reset() {
            this.list = this.originList
            this.total1 = this.originTotal
            this.total2 = 0
            this.total3 = 0
            this.modeSearch = false
            this.currentPage1 = 1
            this.currentPage2 = 1
            this.currentPage3 = 1
            this.searchWord = ""
            this.$refs.multipleTable.setCurrentRow(this.list[0])
            this.clickColumn1(this.list[0])
        },
        createCustom1() {
            const _this = this
            let newC = _this.newCustom
            newC.role = _this.roles[0]
            _this.$refs["dataForm1"].validate(valid => {
                if (valid) {
                    insert(newC).then(res => {
                        console.log("增加客户", res)
                        if (res.code === 0) {
                            newC.id = res.data.insertId
                            _this.list.unshift(newC)
                            _this.$refs.multipleTable.setCurrentRow(_this.list[0])
                            _this.clickColumn1(_this.list[0])
                            _this.dialogFormVisible = false
                            _this.$message({
                                message: "添加成功",
                                type: "success",
                            })
                        }
                    })
                }
            })
        },
        updateCustom1() {
            const _this = this
            const custom = this.newCustom
            let data = {
                info: {
                    name: custom.name,
                    address: custom.address,
                    remark: custom.remark,
                },
                id: custom.id,
            }
            update(data).then(res => {
                console.log("修改客户", res)
                if (res.code === 0) {
                    _this.dialogFormVisible = false
                    _this.$message({
                        message: "修改成功",
                        type: "success",
                    })
                }
            })
        },
        createCustom2() {
            const _this = this
            let newB = {
                name: _this.newBranch.name,
                pid: _this.currentCustomId,
            }
            _this.$refs["dataForm2"].validate(valid => {
                if (valid) {
                    insertBranch(newB).then(res => {
                        console.log("增加部门", res)
                        if (res.code === 0) {
                            newB.id = res.data.insertId
                            _this.branch.unshift(newB)
                            _this.$refs.multipleTable2.setCurrentRow(_this.branch[0])
                            _this.clickColumn2(_this.branch[0])
                            _this.dialogFormVisible2 = false
                            _this.$message({
                                message: "添加成功",
                                type: "success",
                            })
                        }
                    })
                }
            })
        },
        updateCustom2() {
            const _this = this
            const branch = this.newBranch
            let data = {
                info: {
                    name: branch.name,
                },
                id: branch.id,
            }
            updateBranch(data).then(res => {
                console.log("修改部门", res)
                if (res.code === 0) {
                    _this.dialogFormVisible2 = false
                    _this.$message({
                        message: "修改成功",
                        type: "success",
                    })
                }
            })
        },
        createCustom3() {
            const _this = this
            const newBrand = _this.newBrand
            let newB2 = {
                code: newBrand.code,
                desc: newBrand.desc,
                pid: _this.currentBranchId,
                ppid: _this.currentCustomId,
            }
            console.log("newB2", newB2)
            _this.$refs["dataForm3"].validate(valid => {
                if (valid) {
                    insertBrand(newB2).then(res => {
                        console.log("增加品牌代码", res)
                        if (res.code === 0) {
                            _this.brand.push(newB2)
                            _this.dialogFormVisible3 = false
                            _this.$message({
                                message: "添加成功",
                                type: "success",
                            })
                        }
                    })
                }
            })
        },
        updateCustom3() {
            const _this = this
            const brand = this.newBrand
            let data = {
                info: {
                    code: brand.code,
                    desc: brand.desc,
                },
                id: brand.id,
            }
            updateBrand(data).then(res => {
                console.log("修改品牌代码", res)
                if (res.code === 0) {
                    _this.dialogFormVisible3 = false
                    _this.$message({
                        message: "修改成功",
                        type: "success",
                    })
                }
            })
        },
    },
}
</script>
<style lang="scss">
.g-userManage {
    padding: 20px 0;
}
.g-top {
    margin-bottom: 30px;
    .u-inp {
        width: 250px;
        margin-right: 20px;
    }
    .u-insert {
        float: right;
    }
}
.text {
    font-size: 14px;
}

.item {
    margin-bottom: 18px;
}

.el-tooltip > div {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.table2__del.el-button {
    margin-left: 0;
    padding-top: 5px;
}

.table2__edit.el-button {
    padding-bottom: 5px;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}
.clearfix:after {
    clear: both;
}
</style>
