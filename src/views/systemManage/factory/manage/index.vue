<template>
    <div class="g-userManage">
        <div class="g-top">
            <el-input v-model="searchWord" class="u-inp" placeholder="请输入内容" />
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="reset">重置</el-button>
            <el-button class="u-insert" type="primary" @click="toInset">新增</el-button>
        </div>
        <el-table :data="list" border type="flex" style="width: 100%">
            <el-table-column min-width="8%" align="center" prop="id" label="序号" />
            <el-table-column min-width="22%" align="center" prop="factoryname" label="工厂名称" />
            <el-table-column min-width="25%" align="center" prop="address" label="地址" />
            <el-table-column min-width="25%" align="center" prop="remark" label="备注" />
            <el-table-column min-width="20%" align="center" prop label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="update(scope.row)">编辑</el-button>
                    <el-button v-if="scope.row.role !== 'admin'" type="text" size="small" @click="del(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import request from "@/utils/request"

export default {
    data() {
        return {
            list: [],
            originList: [],
            searchWord: "",
        }
    },
    created() {
        const _this = this
        request({
            url: "/factory/find",
            method: "get",
        }).then(res => {
            console.log("工厂管理", res)
            if (res.code === 0) {
                _this.list = res.data
                _this.originList = res.data
            }
        })
    },
    methods: {
        search() {
            const _this = this
            if (!_this.searchWord.trim()) {
                _this.list = _this.originList
                return
            }
            request({
                url: "/factory/search",
                method: "post",
                data: {
                    word: _this.searchWord,
                },
            }).then(res => {
                console.log("搜索结果", res)
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
        },
        update(row) {
            console.log(row)
            row = JSON.stringify(row)
            this.$router.push({
                path: "/system/factory/edit",
                query: {
                    update: row,
                },
            })
        },
        del(row) {
            const _this = this
            _this
                .$confirm("此操作将删除该工厂, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                .then(() => {
                    request({
                        url: "/factory/delete?id=" + row.id,
                        method: "get",
                    }).then(res => {
                        if (res.code === 0) {
                            _this.list = _this.list.filter(item => {
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
        toInset() {
            this.$router.push({
                path: "/system/factory/insert",
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
.g-top .u-inp {
    width: 250px;
    margin-right: 20px;
}
</style>
