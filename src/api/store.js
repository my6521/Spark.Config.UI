import request from '@/utils/request'
/**
 * 获取店铺列表
 * @param data
 */
export function getStores(data) {
  return request({
    url: '/Admin/Store/Search',
    data,
    method: 'post'
  })
}
/**
 * 获取店铺列表
 * @param data
 */
export function getStoresByName(name) {
  return request({
    url: '/Admin/Store/GetByName',
    params: {
      name
    },
    method: 'post'
  })
}
/**
 * 获取店铺认证列表
 * @param data
 */
export function getStoresLicense(data) {
  return request({
    url: '/Admin/StoreLicense/QueryByPage',
    data,
    method: 'post'
  })
}

export function getStoreDetail(params) {
  return request({
    url: '/Admin/Store/GetDetail',
    params,
    method: 'get'
  })
}
/**
 * 修改店铺状态
 * @param data
 */
export function updateStoreStatus(data) {
  return request({
    url: '/Admin/Store/UpdateStatus',
    data,
    method: 'post'
  })
}

/**
 * 获取店铺等级列表
 * @param data
 */
export function getStoreGrades(params) {
  return request({
    url: '/Admin/StoreGrade/GetAll',
    params,
    method: 'get'
  })
}
/**
 * 添加店铺等级列表
 * @param data
 */
export function addStoreGrade(data) {
  return request({
    url: '/Admin/StoreGrade/Add',
    data,
    method: 'post'
  })
}
/**
 * 更新店铺等级列表
 * @param data
 */
export function updateStoreGrade(data) {
  return request({
    url: '/Admin/StoreGrade/Update',
    data,
    method: 'post'
  })
}
/**
 * 删除店铺等级列表
 * @param data
 */
export function deleteStoreGrade(params) {
  return request({
    url: '/Admin/StoreGrade/Delete',
    params,
    method: 'get'
  })
}

/**
 * 获取认证信息
 * @param params
 */
export function getLicense(params) {
  return request({
    url: '/Admin/StoreLicense/GetByStoreId',
    params,
    method: 'get'
  })
}

/**
 * 认证审核
 * @param data
 */
export function setLicense(data) {
  return request({
    url: '/Admin/StoreLicense/UpdateStatus',
    data,
    method: 'post'
  })
}
