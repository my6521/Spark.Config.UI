import request from '@/utils/request'

export function getServiceList(params) {
  return request({
    url: '/monitor/Service/List',
    params,
    method: 'get'
  })
}

export function saveService(data) {
  return request({
    url: '/monitor/Service/Save',
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
