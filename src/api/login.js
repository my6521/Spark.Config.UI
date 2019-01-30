import request from '@/utils/request'
export function loginByUsername(username, password) {
  const data = {
    name: username,
    pwd: password
  }
  return request({
    url: '/Config/Account/Login',
    method: 'post',
    data
  })
}
