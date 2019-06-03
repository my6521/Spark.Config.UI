import { loginByUsername, logout, getUserInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    userName: null,
    userId: null // 用户名
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
      setToken(token)
    },
    SET_USERNAME: (state, username) => {
      state.userName = username
    },
    SET_USERID: (state, userid) => {
      state.userId = userid
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
          commit('SET_TOKEN', data.Token.AccessToken)
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
          commit('SET_USERNAME', UserInfo.UserName)
          commit('userId', UserInfo.Id)
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
