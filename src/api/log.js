import request from '@/utils/request'

/**
 * 获取日志列表
 * @param data
 */
export function getLogList(params) {
  return request({
    url: '/LogCenter/Log/GetList',
    params,
    method: 'get'
  })
}
