import axios from 'axios'
// import store from '@/store'
import { Notice } from 'iview'
import { getToken } from '@/libs/util'
import { setToken } from './util'
/* const addErrorLog = errorInfo => {
  const { statusText, status, request: { responseURL } } = errorInfo
  let info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL
  }
  if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
} */

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        //
      }
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      // 为每个请求的header增加token
      const token = getToken()
      if (token) {
        config.headers.Authorization = 'Bearer ' + token
        config.headers.accessToken = token
      }

      return config
    }, error => {
      console.log('请求失败：'.errorObj)
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      const { data, status } = res

      if (data.status === 401) {
        Notice.error({
          title: '错误',
          desc: '您可能太久没操作了。登录失效，请重新登录！'
        })
        // 移除token
        setToken('')
        window.location.href = '#/login'
        return
      } else if (data.status === 422) {
        Notice.error({
          title: '错误',
          desc: res.data.message
        })

        return Promise.reject(res)
      }

      return { data, status }
    }, error => {
      this.destroy(url)
      let errorInfo = error.response
      if (!errorInfo) {
        const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
        errorInfo = {
          statusText,
          status,
          request: { responseURL: config.url }
        }
      }
      console.log(errorInfo)
      // 异常统一进行处理
      if (errorInfo.status === 422 || errorInfo.status === 500) {
        Notice.error({
          title: '错误',
          desc: errorInfo.data.message
        })
      } else if (errorInfo.status === 504 || errorInfo.status === 404) {
        Notice.error({
          title: '错误',
          desc: '服务器发生错误。'
        })
      } else if (errorInfo.status === 403) {
        Notice.error({
          title: '错误',
          desc: '权限不足，请联系管理员。'
        })
      } else if (errorInfo.status === 401) {
        Notice.error({
          title: '错误',
          desc: '您可能太久没操作了。登录失效，请重新登录！'
        })
        // 移除token
        setToken('')
        window.location.href = '#/login'
      } else {
        Notice.error({
          title: '错误',
          desc: '未知错误！'
        })
      }

      // 不上报到后端
      // addErrorLog(errorInfo)
      return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
