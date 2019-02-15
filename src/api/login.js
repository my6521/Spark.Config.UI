import request from '@/utils/request'
export function loginByUsername(username, password) {
  const data = {
    UserName: username,
    Password: password
  }
  return request({
    url: '/monitor/Account/Login',
    method: 'post',
    data
  })
}
