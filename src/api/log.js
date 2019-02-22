import request from '@/utils/request'

/**
 * 获取日志列表
 * @param data
 */
export function getLogList(params) {
  return request({
    url: '/monitor/Log/List',
    params,
    method: 'get'
  })
}
