import request from '@/utils/request';
<template>
  <div class="g-insertFactory">
    <div class="m-sec">
      <span class="u-tit"><span v-if="!isUpdate">*</span>用户名：</span>
      <el-input v-model="factoryname" class="u-inp" placeholder="请输入工厂名" />
    </div>
    <div class="m-sec">
      <span class="u-tit"><span v-if="!isUpdate">*</span>用户名：</span>
      <el-input v-model="address" class="u-inp" placeholder="请输入工厂地址" />
    </div>
    <div class="m-sec">
      <span class="u-tit"><span v-if="!isUpdate">*</span>备注：</span>
      <el-input v-model="remark" type="textarea" class="u-textarea" :rows="3" placeholder="请输入内容" />
    </div>
    <el-button class="u-submit" type="primary" @click="submit">提交</el-button>
  </div>
</template>
<script>
import { create } from '@/api/factory'
import request from '@/utils/request'

export default {
  data() {
    return {
      factoryname: '',
      address: '',
      remark: '',
      isUpdate: false,
      updateData: {}
    }
  },
  created(options) {
    console.log('options', this.$route.query)
    const query = this.$route.query
    if (query.update) {
      const data = JSON.parse(query.update)
      this.isUpdate = true
      this.updateData = data
      this.factoryname = data.factoryname
      this.address = data.address
      this.remark = data.remark
    }
  },
  methods: {
    submit() {
      const _this = this
      if (_this.isUpdate) {
        // 修改
        const update = _this.updateData
        const data = {}
        for (const key in update) {
          // eslint-disable-next-line no-prototype-builtins
          if (key !== 'id') {
            if (update[key] !== _this[key]) {
              data[key] = _this[key]
            }
          }
        }
        request({
          url: '/factory/update',
          method: 'post',
          data: {
            info: data,
            id: update.id
          }
        }).then(res => {
          console.log('修改成功', res)
          // if (res.code === 0) {
          //   _this.list = res.data
          // }
          if (res.code === 0) {
            _this.$message({
              message: '修改信息成功',
              type: 'success'
            })
          }
        })
      } else {
        create({
          factoryname: _this.factoryname.trim(),
          address: _this.address.trim(),
          remark: _this.remark.trim()
        })
          .then(response => {
            // const { data } = response
            console.log('response', response)
            if (response.code === 0) {
              _this.$message({
                message: '添加工厂成功',
                type: 'success'
              })
            }
          })
          .catch(error => {
            console.log(error)
          })
      }
    }
  }
}
</script>
<style lang="scss">
.g-insertFactory {
  margin-top: 40px;
}
.m-sec {
  margin-bottom: 20px;
}
.u-tit {
  display: inline-block;
  vertical-align: top;
  width: 70px;
}
.u-inp {
  width: 240px;
}
.u-textarea {
  width: 400px;
}
.u-submit {
  margin-top: 20px;
}
</style>

