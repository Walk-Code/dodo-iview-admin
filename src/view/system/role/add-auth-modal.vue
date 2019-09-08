<template>
  <Modal v-model="showModal" :title="title" @on-cancel="cancel" @on-ok="ok">
    <Form ref="formValidate" :model="roleObj" :label-width="80"> <!-- 移除表单验证:rules="ruleValidate"  -->
      <Tree :data="treeData" show-checkbox @on-check-change="selectNodes()" ref="menuTree"></Tree>
    </Form>
  </Modal>
</template>
<script>

import axios from '@/libs/api.request'
export default {
  name: 'addAuthModel',
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '提示'
    },
    role: {
      type: Object,
      default: null
    },
    isRefresh: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    showModal: {
      get () {
        return this.isShow
      },
      set (val) {
        this.$emit('changeStatus', val)
      }
    },
    modalTitle: {
      get: () => this.title,
      set (val) {
        this.$emit('changeTitle', val)
      }
    },
    getRole: {
      get: () => this.role,
      set (val) {
        this.$emit('getRole', val)
      }
    },
    refreshData: {
      get () {
        return this.isRefresh
      },
      set (val) {
        this.$emit('refreshData', val)
      }
    }
  },
  created () {
  },
  data () {
    return {
      roleObj: this.role,
      treeData: [],
      selectTreeData: [],
      submitData: {
      }
    }
  },
  methods: {
    cancel () {
      this.showModal = false
    },
    ok () {
      this.submitData.treeData = this.selectTreeData
      this.submitData.roleId = this.role.id
      axios.request({
        url: '/api/addMenusToRole',
        method: 'post',
        data: {
          menusJson: JSON.stringify(this.submitData)
        }
      }).then(res => {
        this.$Notice.success({
          title: '通知',
          desc: res.data.message
        })
        this.refreshData = true
      }).catch(err => {
        this.$Notice.warning({
          title: '警告',
          desc: err.response.data.message
        })
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    getTreeMenu (id) {
      axios.request({
        url: '/api/getMenusByRoleId?roleId=' + id,
        method: 'get'
      }).then(res => {
        this.treeData = res.data.data
      }).catch(err => {
        console.log(err)
      })
    },
    selectNodes (node) {
      this.selectTreeData = this.treeData
    }
  }
}
</script>
