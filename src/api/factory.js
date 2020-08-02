import request from '@/utils/request'

export function create(data) {
  return request({
    url: '/factory/create',
    method: 'post',
    data
  })
}

export function findFactoryName() {
  return request({
    url: '/factory/findFactoryName',
    method: 'get'
  })
}
