<template>
  <div class="navbar">
    <div class="left">
      <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>
      <breadcrumb class="breadcrumb-container"/>
    </div>
    <div class="right">
      <div class="well-come">
        {{ $t('navbar.welcome') +':' }}
        <el-dropdown trigger="click">
          <div class="tr-item">
            <span>{{ username }}</span>
            <i class="el-icon-caret-bottom"/>
          </div>
          <el-dropdown-menu slot="dropdown">
            <router-link to="/">
              <el-dropdown-item>
                {{ $t('navbar.dashboard') }}
              </el-dropdown-item>
            </router-link>
            <el-dropdown-item divided>
              <span style="display:block;" @click="logout">{{ $t('navbar.logOut') }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="right-menu">
        <el-tooltip :content="$t('navbar.screenfull')" effect="dark" placement="bottom">
          <screenfull class="screenfull"/>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import LangSelect from '@/components/LangSelect'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    LangSelect
  },
  data() {
    return {
      username: localStorage.getItem('username')
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        this.$router.push({ path: '/login' })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;
    display: flex;
    justify-content: space-between;
    div.left,div.right{
      display: flex;
      align-items: center;
    }
    .hamburger-container {
      line-height: 58px;
      height: 50px;
      padding: 0 10px;
    }
    .well-come{
      padding-right: 12px;
      font-size: 14px;
      color: #333333;
      span{
        color: #3a835d;
      }
    }
    .right-menu {
      height: 100%;
      padding-right: 12px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      &:focus {
        outline: none;
      }
      .screenfull {
        height: 20px;
      }
    }
  }
  .tr-item{
    cursor: pointer;
  }
</style>
