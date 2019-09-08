<template>
  <Modal v-model="showModal" :title="title" @on-cancel="cancel" @on-ok="ok">
    <Form ref="formValidate" :model="roleObj" :label-width="80"> <!-- 移除表单验证:rules="ruleValidate"  -->
      <Form-item label="名称" prop="title">
        <Input v-model="roleObj.title" placeholder="请输入角色名称"></Input>
      </Form-item>
      <Form-item label="描述" prop="remark">
        <Input
          v-model="roleObj.remark"
          type="textarea"
          :autosize="{minRows: 2,maxRows: 5}"
          placeholder="请输入..."
        ></Input>
      </Form-item>
    </Form>
  </Modal>
</template>
<script>

import axios from '@/libs/api.request'
export default {
  name: 'addRoleModel',
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
      roleObj: this.role
      // ruleValidate: {
      //   username: [
      //     { required: true, message: '姓名不能为空', trigger: 'blur' }
      //   ],
      //   mail: [
      //     { required: true, message: '邮箱不能为空', trigger: 'blur' },
      //     { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
      //   ],
      //   phone: [
      //     { required: true, message: '手机号不能为空', trigger: 'change' }
      //   ],
      //   desc: [
      //     { required: true, message: '请输入个人介绍', trigger: 'blur' },
      //     { type: 'string', min: 20, message: '介绍不能少于20字', trigger: 'blur' }
      //   ]
      // }

    }
  },
  methods: {
    cancel () {
      this.showModal = false
    },
    ok () {
      axios.request({
        url: '/api/saveRole',
        method: 'post',
        data: {
          roleJson: JSON.stringify(this.roleObj)
        }
      }).then(res => {
        this.$Notice.success({
          title: '通知',
          desc: res.data.message
        })
        this.refreshData = true
      }).catch(err => {
        // console.log(err.response.data.message)
        this.$Notice.warning({
          title: '警告',
          desc: err.response.data.message
        })
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    }
  }
}
</script>
