import request from '@/utils/request'

export function getAppList(params) {
  return request({
    url: '/monitor/App/List',
    params,
    method: 'get'
  })
}

export function deleteApp(data) {
  return request({
    url: '/monitor/App/Delete',
    data,
    method: 'post'
  })
}

export function saveApp(data) {
  return request({
    url: '/monitor/App/Save',
    data,
    method: 'post'
  })
}

export function getRoleList(params) {
  return request({
    url: '/monitor/App/RoleList',
    params,
    method: 'get'
  })
}

export function getUserAppList(params) {
  return request({
    url: '/monitor/App/UserAppList',
    params,
    method: 'get'
  })
}

export function saveRole(data) {
  return request({
    url: '/monitor/App/Role',
    data,
    method: 'post'
  })
}
