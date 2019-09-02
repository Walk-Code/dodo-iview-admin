<template>
  <Card>
    <div slot="title" class="pull-right">
      <Button type="primary" @click="createUserGroup()">添加用户组</Button>
    </div>
    <div>
      <Input
        class="search-input"
        v-model="serachResult"
        search
        enter-button
        placeholder="请输入用户组名称"
        @click.native="search"
      />
    </div>
    <Table :columns="columns" :data="tableData" border ref="selection"></Table>
    <div style="margin-top: 10px;">
      <Page
        class="pull-right"
        :total="pageTotal"
        :current="page"
        :page-size="pageSize"
        @on-change="handlePage"
        @on-page-size-change="handlePageSize"
        show-elevator
      />
    </div>
    <addUserGroupModal
      :isShow="modalShow"
      :title="modalTitle"
      :user="userObj"
      :isRefresh="refresh"
      @changeStatus="changeStatus"
      @changeTitle="changeTitle"
      @getUser="getUser"
      @refreshData="refreshData"
    ></addUserGroupModal>
    <addUserModal
      :isShow="showUserModal"
      :title="showUserModalTitle"
      :userGroupId="userGroupId"
      @changeStatus="changeStatus"
      @changeTitle="changeTitle"
      @getUserGroupId="getUserGroupId"
      ref="addUserModal"
    ></addUserModal >
    <addRoleModal
      :isShow="showRoleModal"
      :title="showRoleModalTitle"
      :userGroupId="userGroupId"
      @changeStatus="changeStatus"
      @changeTitle="changeTitle"
      ref="addRoleModal"
    ></addRoleModal >
  </Card>
</template>
<script>

import axios from '@/libs/api.request'
import addUserGroupModal from './add-user-group-modal'
import addUserModal from './add-user-modal'
import addRoleModal from './add-role-modal'
export default {
  name: 'system_user_group',
  created () {
    this.getList()
  },
  data () {
    return {
      refresh: false,
      userObj: {
      },
      modalShow: false,
      showUserModal: false,
      showUserModalTitle: '',
      showRoleModal: false,
      showRoleModalTitle: '',
      userGroupId: 0,
      tableData: [],
      modalTitle: '',
      serachResult: '',
      pageTotal: 0,
      page: 1,
      pageSize: 10,
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '备注',
          key: 'remark'
        },
        {
          title: '添加时间',
          key: 'create_time'
        },
        {
          title: '操作',
          key: 'action',
          render: (h, params) => {
            let text = ''
            let type = ''
            let status = params.row.status
            if (params.row.status === 1) {
              text = '禁用'
              type = 'error'
              status = 2
            } else if (params.row.status === 2) {
              text = '启用'
              type = 'success'
              status = 1
            }

            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.edit(params.row)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: type,
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.addUser(params.row)
                  }
                }
              }, '添加组成员'),
              h('Button', {
                props: {
                  type: 'warning',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.addRole(params.row, status)
                  }
                }
              }, '添加角色'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.del(params.row.id)
                  }
                }
              }, '删除')
            ])
          }
        }
      ]

    }
  },
  components: { 'addUserGroupModal': addUserGroupModal, 'addUserModal': addUserModal, 'addRoleModal': addRoleModal },
  methods: {
    createUserGroup  () {
      this.modalShow = true
      this.modalTitle = '创建用户组'
      // 清空对象
      Object.keys(this.userObj).forEach(key => this.userObj[key] = '')
    },
    changeStatus (val) {
      console.log(val)
      this.modalShow = val
      this.showUserModal = val
      this.showRoleModal = val
    },
    changeTitle (val) {
      this.modalTitle = val
      this.showUserModalTitle = val
      this.showRoleModalTitle = val
    },
    search () {
      this.getList()
    },
    getList () {
      axios.request({
        url: '/api/getUserGroups?page=' + this.page + '&pageSize=' + this.pageSize + '&searchText=' + this.serachResult,
        method: 'get'
      }).then(res => {
        this.tableData = res.data.data.list
        this.pageTotal = res.data.data.pageInfo.total
        this.page = res.data.data.pageInfo.currentPage
      }).catch(err => {
        console.log(err)
      })
    },
    handlePage (value) {
      this.page = value
      this.getList()
    },
    handlePageSize (value) {
      this.pageSize = value
      this.getList()
    },
    getUser (val) {
      this.userObj = Object.assign(this.userObj, val)
      // this.userObj = val
    },
    refreshData (val) {
      // 刷新数据
      if (val) {
        this.getList()
      }
    },
    edit (val) {
      this.modalShow = true
      this.modalTitle = '编辑用户'
      this.getUser(val)
    },
    updateUserStatus (val, status) {
      val.status = status
      axios.request({
        url: '/api/updateUserStatus',
        method: 'post',
        data: {
          userJson: JSON.stringify(val)
        }
      }).then(res => {
        this.$Notice.success({
          title: '通知',
          desc: res.data.message
        })
        this.getList()
      }).catch(err => {
        this.$Notice.warning({
          title: '警告',
          desc: err.response.data.message
        })
        console.log(err)
      })
    },
    del (id) {
      axios.request({
        url: '/api/delUser',
        method: 'post',
        data: {
          id: id
        }
      }).then(res => {
        this.$Notice.success({
          title: '通知',
          desc: res.data.message
        })
        this.getList()
      }).catch(err => {
        console.log(err)
        this.$Notice.warning({
          title: '警告',
          desc: err.response.data.message
        })
        console.log(err)
      })
    },
    addUser (userGroup) {
      this.showUserModal = true
      this.showUserModalTitle = '往' + userGroup.name + '组-添加用户'
      this.$refs.addUserModal.getUserGroupDetail(userGroup.id)
      this.$refs.addUserModal.getAllUser()
    },
    getUserGroupId (val) {
      this.getUserGroupId = val
    },
    addRole (userGroup) {
      this.showRoleModal = true
      this.showRoleModalTitle = '往' + userGroup.name + '组-添加角色'
      this.$refs.addRoleModal.getRoleGroupRoles(userGroup.id)
      this.$refs.addRoleModal.getAllRole()
    }
  }
}
</script>
<style scoped>
.pull-right {
  display: flex;
  justify-content: flex-end;
}
.search-input {
  width: 30%;
  margin-bottom: 10px;
}
.text-align  {
  text-align: center;
}
</style>
