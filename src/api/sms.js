import request from '@/utils/request'

export function getRecordList(params) {
  return request({
    url: '/monitor/sms/RecordList',
    params,
    method: 'get'
  })
}

export function getTempList(params) {
  return request({
    url: '/monitor/sms/TempList',
    params,
    method: 'get'
  })
}

export function saveTemp(data) {
  return request({
    url: '/monitor/sms/SaveTemp',
    data,
    method: 'post'
  })
}

