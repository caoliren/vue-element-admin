import request from '@/utils/request';
<template>
  <div class="g-userManage">
    <div class="g-top">
      <el-input v-model="searchWord" class="u-inp" placeholder="请输入内容" />
      <el-button type="primary" @click="search">搜索</el-button>
      <el-button @click="reset">重置</el-button>
      <el-button class="u-insert" type="primary" @click="toInset">新增</el-button>
    </div>
    <el-table :data="list" border style="width: 100%">
      <el-table-column align="center" prop="id" label="序号" width="80px" />
      <el-table-column align="center" prop="factoryname" label="工厂名称" width="180" />
      <el-table-column align="center" prop="address" label="地址" width="380" />
      <el-table-column align="center" prop="remark" label="备注" width="420" />
      <el-table-column align="center" prop label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="update(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.role !== 'admin'" type="text" size="small" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import request from '@/utils/request'

export default {
  data() {
    return {
      list: [],
      originList: [],
      searchWord: ''
    }
  },
  created() {
    const _this = this
    request({
      url: '/factory/find',
      method: 'get'
    }).then(res => {
      console.log('工厂管理', res)
      if (res.code === 0) {
        _this.list = res.data
        _this.originList = res.data
      }
    })
  },
  methods: {
    search() {
      const _this = this
      request({
        url: '/factory/search',
        method: 'post',
        data: {
          word: _this.searchWord
        }
      }).then(res => {
        console.log('搜索结果', res)
        if (res.code === 0) {
          const data = res.data
          if (!data.length) {
            _this.$message('未找到相关内容')
          } else {
            _this.list = data
          }
        }
      })
    },
    reset() {
      this.list = this.originList
      this.searchWord = ''
    },
    update(row) {
      console.log(row)
      row = JSON.stringify(row)
      this.$router.push({
        path: '/systemManage/insertFactory',
        query: {
          update: row
        }
      })
    },
    del(row) {
      const _this = this
      request({
        url: '/factory/delete?id=' + row.id,
        method: 'get'
      }).then(res => {
        console.log('删除用户', res)
        if (res.code === 0) {
          _this.list = _this.list.filter(item => {
            return item.id !== row.id
          })
          _this.$message({
            message: '删除成功',
            type: 'success'
          })
        }
      })
    },
    toInset() {
      this.$router.push({
        path: '/systemManage/insertFactory'
      })
    }
  }
}
</script>
<style lang="scss">
.g-userManage {
  padding: 20px 0;
}
</style>
