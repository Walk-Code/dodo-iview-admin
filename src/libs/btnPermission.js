import Vue from 'vue'

// 权限指令
const has = Vue.directive('has', {
  bind: function (el, binding, vnode) {
    // 获取页面按钮权限
    let permissionList = vnode.context.$route.meta.permission
    // 权限校验
    if (permissionList && permissionList.length && !permissionList.includes(binding.value)) {
      el.parentNode.removeChild(el)
    }
  }
})

export default has
