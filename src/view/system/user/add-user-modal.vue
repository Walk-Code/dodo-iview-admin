<template>
  <Modal v-model="showModal" :title="title" @on-cancel="cancel" @on-ok="ok">
    <Form ref="formValidate" :model="userObj" :label-width="80"> <!-- 移除表单验证:rules="ruleValidate"  -->
      <Form-item label="姓名" prop="username">
        <Input v-model="userObj.username" placeholder="请输入姓名"></Input>
      </Form-item>
      <Form-item label="邮箱" prop="email">
        <Input v-model="userObj.email" placeholder="请输入邮箱"></Input>
      </Form-item>
      <Form-item label="手机" prop="phone">
        <Input v-model="userObj.phone" placeholder="请输入手机号"></Input>
      </Form-item>
      <Form-item label="描述" prop="desc">
        <Input
          v-model="userObj.remark"
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
  name: 'addUserModel',
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '提示'
    },
    user: {
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
    getUser: {
      get: () => this.user,
      set (val) {
        this.$emit('getUser', val)
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
    console.log(this.userObj)
  },
  data () {
    return {
      userObj: this.user
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
      // 验证表单信息
      // this.$refs['formValidate'].validate((valid) => {
      //   if (valid) {
      //  } else {
      //   this.$Message.error('表单验证失败!')
      // }
      // })

      axios.request({
        url: '/api/saveUser',
        method: 'post',
        data: {
          userJson: JSON.stringify(this.userObj)
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
