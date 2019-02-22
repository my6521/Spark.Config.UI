import request from '@/utils/request'

/**
 * 获取配置列表
 * @param data
 */
export function getConfigList(params) {
  return request({
    url: '/monitor/Config/List',
    params,
    method: 'get'
  })
}

export function saveConfig(data) {
  return request({
    url: '/monitor/config/Save',
    data,
    method: 'post'
  })
}

export function deleteConfig(data) {
  return request({
    url: '/monitor/config/DeleteConfig',
    data,
    method: 'post'
  })
}
