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
      setToken(token)
    },
    SET_ADMIN: (state, IsAdmin) => {
      state.IsAdmin = IsAdmin
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_USERNAME: (state, name) => {
      state.username = name
      // localStorage.setItem('username', name)
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
          localStorage.setItem('data', JSON.stringify(data))
          commit('SET_TOKEN', data.Token.access_token)
          // commit('SET_USERNAME', data.User.UserName)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    LogOut() {
      return new Promise((resolve) => {
        removeToken()
        resolve()
      })
    },
    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(response => {
          const data = response['Data']
          if (!data) {
            reject(`can not get user's promise`)
          }
          const UserInfo = data['User']
          const Permissions = data['Permissions'] || []
          commit('SET_ROLES', Permissions)
          commit('SET_USERNAME', UserInfo['UserName'])
          commit('SET_STATUS', UserInfo['Status'])
          commit('SET_REALNAME', UserInfo['RealName'])
          commit('SET_DEPNAME', UserInfo['DepName'])
          commit('SET_PHONE', UserInfo['Phone'])
          commit('SET_EMAIL', UserInfo['Email'])
          commit('SET_ADMIN', UserInfo['IsAdmin'])
          commit('SET_ROLEID', UserInfo['RoleId'])
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
