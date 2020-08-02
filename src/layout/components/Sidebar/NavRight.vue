import { mapGetters } from 'vuex';
<template>
  <div>
    <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
      <div class="avatar-wrapper">
        <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
        <div class="m-right">
          <div class="u-word">欢迎您</div>
          <span class="u-name">{{ name }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
      </div>
      <el-dropdown-menu slot="dropdown">
        <!-- <router-link to="/profile/index">
          <el-dropdown-item>Profile</el-dropdown-item>
        </router-link> -->
        <router-link to="/">
          <el-dropdown-item>主页</el-dropdown-item>
        </router-link>
        <el-dropdown-item divided @click.native="logout">
          <span style="display:block;">退出登录</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'NavRt',
  data() {
    return {}
  },
  computed: {
    ...mapGetters([
      'avatar',
      'name'
    ])
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss">
  .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .m-right {
          display: inline-block;
          margin-left: 10px;
          vertical-align: top;
          padding-top: 6px;

          .u-word {
            font-size: 12px;
            color: #fff;
          }
        }

        .u-name {
          font-size: 12px;
          color: #fff;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          font-size: 12px;
          vertical-align: top;
          margin-top: 3px;
        color: #fff;
        }
      }
    }
</style>
