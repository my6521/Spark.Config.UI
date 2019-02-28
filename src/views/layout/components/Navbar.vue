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
            <el-dropdown-item>
              <span style="display:block;" @click="changePassWord">修改密码</span>
            </el-dropdown-item>
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
    <el-dialog
      v-el-drag-dialog
      :visible.sync="openAdd"
      :close-on-click-modal="false"
      width="500px"
      center
      title="修改用户密码">
      <el-form v-if="openAdd" ref="form" :rules="rule" :model="form" label-width="120px">
        <el-form-item label="请输入旧密码" prop="OldPwd" >
          <el-input v-model="form.OldPwd" type="password"/>
        </el-form-item>
        <el-form-item label="请输入新密码" prop="NewPwd">
          <el-input v-model="form.NewPwd" type="password"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <div class="btn-group">
          <el-button @click="openAdd=false">取 消</el-button>
          <el-button type="primary" @click.native ="submitForm">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import LangSelect from '@/components/LangSelect'
import { changePwd } from '@/api/login'
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
      openAdd: false,
      form: {
        OldPwd: '',
        NewPwd: ''
      },
      rule: {
        OldPwd: [
          { required: true, message: '输入旧密码', trigger: 'blur' }
        ],
        NewPwd: [
          { required: true, message: '输入新密码', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar', 'username'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        // this.$router.push({ path: '/login' })
        window.location.reload()
      })
    },
    changePassWord() {
      this.openAdd = true
    },
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.openAdd = false
          changePwd(this.form).then(() => {
            this.$message({
              type: 'success',
              message: '修改密码成功!'
            })
            this.logout()
          })
        } else {
          return false
        }
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
