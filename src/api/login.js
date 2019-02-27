import request from '@/utils/request'
import jsMd5 from 'js-md5'
export function loginByUsername(username, password) {
  const data = {
    UserName: username,
    Password: jsMd5(password)
  }
  return request({
    url: '/monitor/Account/Login',
    method: 'post',
    data
  })
}
export function changePwd(form) {
  const data = {
    OldPwd: jsMd5(form.OldPwd),
    NewPwd: jsMd5(form.NewPwd)
  }
  return request({
    url: '/monitor/Account/ChangePwd',
    data,
    method: 'post'
  })
}
// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/monitor/Account/Details',
    method: 'get'
  })
}
