import { loginByUsername, logout, getUserInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    IsAdmin: false,
    username: '', // 用户名
    realname: '', // 职位(角色)
    roleId: '',
    depname: '', // 部门
    status: '',
    phone: '', // 电话号码
    email: '', // 邮箱
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_ADMIN: (state, IsAdmin) => {
      state.IsAdmin = IsAdmin
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_USERNAME: (state, name) => {
      state.username = name
    },
    SET_REALNAME: (state, realname) => {
      state.realname = realname
    },
    SET_ROLEID: (state, roleId) => {
      state.roleId = roleId
    },
    SET_DEPNAME: (state, depname) => {
      state.depname = depname
    },
    SET_PHONE: (state, phone) => {
      state.phone = phone
    },
    SET_EMAIL: (state, email) => {
      state.email = email
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 用户名登录 更改token
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password).then(response => {
          const data = response['Data']
          commit('SET_TOKEN', data['Access_Token'])
          setToken(data['Access_Token'])
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
    // LogOut(){
    //   retrun new Promise((resolve, reject)=>{

    //   })
    // }
  }
}

export default user
