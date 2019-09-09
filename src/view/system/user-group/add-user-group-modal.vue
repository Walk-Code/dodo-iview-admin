<template>
  <Modal v-model="showModal" :title="title" @on-cancel="cancel" @on-ok="ok">
    <Form ref="formValidate" :model="userObj" :label-width="80">
      <Form-item label="名称" prop="name">
        <Input v-model="userObj.name" placeholder="请输入姓名"></Input>
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
  name: 'addUserGroupModel',
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
  },
  data () {
    return {
      userObj: this.user
    }
  },
  methods: {
    cancel () {
      this.showModal = false
    },
    ok () {
      axios.request({
        url: 'api/saveUserGroup',
        method: 'post',
        data: {
          userGroupJson: JSON.stringify(this.userObj)
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
    }
  }
}
</script>
