import axios from 'axios'
import { Spin } from 'iview'

const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000 // 请求超时时间
})

const loading = {
  show () {
    Spin.show({
      render: (h) => {
        return h('div', [
          h('Icon', {
            'class': 'spin-icon-load',
            props: {
              type: 'ios-loading',
              size: 30
            }
          }),
          h('div', 'Loading')
        ])
      }
    })
  },
  hide () {
    Spin.hide()
  }
}

// request拦截器，实现loading加载
service.interceptors.request.use(config => {
  loading.show()
  return config
}, error => {
  loading.hide()
  return Promise.reject(error)
})

// response拦截器，实现loading关闭
service.interceptors.response.use(data => {
  loading.hide()
  return data
}, error => {
  loading.hide()
  return Promise.reject(error)
})

export default service
