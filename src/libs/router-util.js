import { getToken, hasChild, localSave, localRead } from '@/libs/util'
import Main from '@/components/main'
import config from '@/config'
import { forEach } from '@/libs/tools'
import http from '@/api/http'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

// 初始化路由
export const initRouter = (vm) => {
  if (!getToken()) {
    return
  }
  let list = []
  // 获取后端菜单列表
  // axios.get(baseUrl + '/api/getMenus', {
  //   headers: { 'Authorization': 'Bearer ' + getToken() }
  // }).then(res => {
  //   console.log('获取响应结果：', res)
  //   var menuData = res.data.data
  //   // 赋值
  //   console.log('menuData:', menuData)
  //   localSave('route', JSON.stringify(menuData))
  //   // 格式化菜单
  //   list = formatMenu(menuData)
  //   // 刷新界面菜单
  //   vm.$store.commit('updateMenuList', list)getLeftMenus
  // })
  http.get(baseUrl + '/v1/system/menu/leftMenu', {
    headers: {
      /* 'Authorization': 'Bearer ' + getToken(),
      'accessToken': getToken() */
      'accessToken': getToken()
    }
  }).then(res => {
    var menuData = res.data.data
    // 赋值
    localSave('route', JSON.stringify(menuData))
    // 格式化菜单
    list = formatMenu(menuData)
    // 刷新界面菜单
    vm.$store.commit('updateMenuList', list)
  }).catch(err => {
    console.log(err)
    if (err.response.status === 401) {
      Notice.error({
        title: '错误',
        desc: '您可能太久没操作了。登录失效，请重新登录！'
      })
      // 移除token
      setToken('')
      window.location.href = '#/login'
    }
  })

  return list
}

// 加载菜单，在创建路由时使用
export const loadMenu = () => {
  let list = []
  let data = localRead('route')
  if (!data) {
    return list
  }
  list = formatMenu(JSON.parse(data))

  return list
}

// 格式化菜单
export const formatMenu = (list) => {
  let res = []
  forEach(list, item => {
    let obj = {
      path: item.path,
      name: item.name
    }
    obj.meta = item.meta
    // 惰性递归 ****
    if (item.parent_code === '0') {
      obj.component = Main
    } else {
      // 惰性递归 ****
      let data = item.component
      // 这里需要改成自己定义的 .vue 文件路径
      obj.component = () => import('@/view' + data)
    }
    if (hasChild(item)) {
      obj.children = formatMenu(item.children)
    }
    res.push(obj)
  })
  return res
}
