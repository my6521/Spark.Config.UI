import request from '@/utils/request'

/**
 * 获取用户列表
 * @param data
 */
export function getUserList(params) {
  return request({
    url: '/monitor/User/List',
    params,
    method: 'get'
  })
}

/**
 * 保存用户信息
 * @param data
 */
export function saveUser(data) {
  return request({
    url: '/monitor/User/Save',
    data,
    method: 'post'
  })
}

/**
 * 根据ID删除用户
 * @param data
 */
export function deleteUserById(data) {
  return request({
    url: '/monitor/User/Delete',
    data,
    method: 'post'
  })
}
