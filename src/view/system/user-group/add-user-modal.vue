<template>
  <Modal v-model="showModal" :title="title" @on-cancel="cancel" @on-ok="ok">
    <Form ref="formValidate" :label-width="80">
      <!-- :model="userGroupDetail"  -->
      <Col span="24" style="margin-bottom: 25px;" :gutter="16">
        <Col span="18" style="margin-right: 10px;">
          <Select v-model="selectUserId" filterable :label-in-value="true">
            <Option
              v-for="item in userList"
              :value="item.id"
              :key="item.id"
            >{{ item.username }}</Option>
          </Select>
        </Col>
        <Col span="4">
          <Button size="small" type="primary" style="margin-top: 4px;" @click="addUser()">添加</Button>
        </Col>
      </Col>
      <div span="24">
        <ul style="list-style: none;padding-left: 0;margin-top: 25px;">
          <li
            style=" border: 1px solid black;display: inline-block; padding: 5px 10px;margin-right: 5px;margin-bottom: 5px;text-transform: capitalize;"
            v-for="item in userGroup.details"
          >
            <span>{{item.username}}</span>
            <Icon
              type="md-close"
              style="font-size: 14px;cursor: pointer;"
              @click="deleteUser(item.id)"
            />
          </li>
        </ul>
      </div>
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
    userGroupId: {
      type: Number,
      default: 0
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
    getUserGroupId: {
      get: () => this.userGroupId,
      set (val) {
        this.$emit('getUserGroupId', val)
      }
    }
  },
  created () {
  },
  data () {
    return {
      groupId: this.userGroupId,
      showUserGroupModal: this.isShow,
      userGroup: {},
      userList: [],
      selectUserId: '',
      userDetail: {}
    }
  },
  methods: {
    cancel () {
      this.showUserGroupModal = false
    },
    ok () {
      this.showUserGroupModal = false
    },
    getUserGroupDetail (userGroupId) {
      axios.request({
        url: 'api/getUserGroupDetail',
        method: 'post',
        data: {
          userGroupId: userGroupId
        }
      }).then(res => {
        console.log(res.data.data)
        this.userGroup = res.data.data
      }).catch(err => {
        this.$Notice.warning({
          title: '警告',
          desc: err.response.data.message
        })
      })
    },
    getAllUser () {
      axios.request({
        url: 'api/getAllUser',
        method: 'get',
        data: {
        }
      }).then(res => {
        this.userList = res.data.data
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
    deleteUser (userGroupId) {
      axios.request({
        url: 'api/delUserToGroup',
        method: 'post',
        data: {
          userGroupDetailId: userGroupId
        }
      }).then(res => {
        this.$Notice.success({
          title: '通知',
          desc: res.data.message
        })
        this.getUserGroupDetail(this.userGroup.id)
      }).catch(err => {
        this.$Notice.warning({
          title: '警告',
          desc: err.response.data.message
        })
      })
    },
    addUser () {
      console.log('获取选用户值：' + this.selectUserId)
      console.log('用户组id：' + this.userGroup.id)
      this.userDetail.user_group_id = this.userGroup.id
      this.userDetail.user_id = this.selectUserId
      axios.request({
        url: 'api/addUserToGroup',
        method: 'post',
        data: {
          userGroupDetailJson: JSON.stringify(this.userDetail)
        }
      }).then(res => {
        this.$Notice.success({
          title: '通知',
          desc: res.data.message
        })
        this.getUserGroupDetail(this.userGroup.id)
      }).catch(err => {
        this.$Notice.warning({
          title: '警告',
          desc: err.response.data.message
        })
      })
    }
  }
}
</script>

<style type="text/css" >
ul-item {
  list-style: none;
  padding-left: 0;
  margin-top: 25px;
}

li-item {
  border: 1px solid black;
  display: inline-block;
  padding: 5px 10px;
  margin-right: 5px;
  margin-bottom: 5px;
  text-transform: capitalize;
}

.fa-times-circle {
  cursor: pointer;
}
</style>
</style>
