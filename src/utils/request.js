import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000 // request timeout
})

const downFile = (response) => {
  var blob = response.data
  var reader = new FileReader()
  reader.readAsDataURL(blob)
  reader.onload = function(e) {
    window.open(e.target.result)
  }
}
// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    if (store.getters.token) {
      // 让每个请求携带token
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// respone interceptor
service.interceptors.response.use(
  response => {
    if (response.headers && response.headers['content-type'] === 'application/octet-stream' || response.headers['content-type'] === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      downFile(response)
      return
    }
    const rs = response.data
    if (!rs.IsSuccess) {
      Message({
        message: rs.Message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(rs.Message)
    }
    return rs
  },
  error => {
    const errorData = error.response
    if (errorData.data) {
      Message({
        message: `${errorData.data.Message}`,
        type: 'error',
        duration: 5 * 1000
      })
    } else {
      if (errorData.status === 404) {
        Message({
          message: `请求地址不存在`,
          type: 'error',
          duration: 5 * 1000
        })
      } else if (errorData.status === 401) {
        Message({
          message: `无权限访问`,
          type: 'error',
          duration: 5 * 1000
        })
      } else {
        Message({
          message: `${errorData.status}(${errorData.statusText})`,
          type: 'error',
          duration: 5 * 1000
        })
      }
    }
    return Promise.reject(error)
  }
)

export default service
