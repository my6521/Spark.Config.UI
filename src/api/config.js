import request from '@/utils/request'

/**
 * 获取配置列表
 * @param data
 */
export function getConfigList(params) {
  return request({
    url: '/config/MsConfig/GetConfigList',
    params,
    method: 'get'
  })
}

export function saveConfigList(data) {
  return request({
    url: '/config/MsConfig/SaveConfig',
    data,
    method: 'post'
  })
}

export function deleteConfig(data) {
  return request({
    url: '/config/MsConfig/DeleteConfig',
    data,
    method: 'post'
  })
}

export function getServiceList(params) {
  return request({
    url: '/config/MsService/GetServiceList',
    params,
    method: 'get'
  })
}

export function saveService(data) {
  return request({
    url: '/config/MsService/SaveService',
    data,
    method: 'post'
  })
}

export function deleteService(data) {
  return request({
    url: '/config/MsService/DeleteService',
    data,
    method: 'post'
  })
}

export function getAppList(params) {
  return request({
    url: '/config/MsApp/GetAppList',
    params,
    method: 'get'
  })
}

export function deleteApp(data) {
  return request({
    url: '/config/MsApp/DeleteApp',
    data,
    method: 'post'
  })
}

export function saveApp(data) {
  return request({
    url: '/config/MsApp/SaveApp',
    data,
    method: 'post'
  })
}
