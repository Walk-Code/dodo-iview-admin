<template>
  <Card>
    <div slot="title" class="pull-right">
      <Button type="primary" @click="createUser()" v-has='system_add_user'>添加用户</Button>
    </div>
    <div>
      <Input
        class="search-input"
        v-model="serachResult"
        search
        enter-button
        placeholder="请输入账号/姓名/手机号"
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
    <addUserModel
      :isShow="modalShow"
      :title="modalTitle"
      :user="userObj"
      :isRefresh="refresh"
      @changeStatus="changeStatus"
      @changeTitle="changeTitle"
      @getUser="getUser"
      @refreshData="refreshData"
    ></addUserModel>
  </Card>
</template>
<script>

import axios from '@/libs/api.request'
import addUserModel from './add-user-modal'
export default {
  name: 'system_user',
  created () {
    this.getList()
  },
  data () {
    return {
      refresh: false,
      system_add_user: 'system_add_user',
      userObj: {
      },
      modalShow: false,
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
          title: '用户名',
          key: 'username'
        },
        {
          title: '手机号',
          key: 'phone'
        },
        {
          title: '电子邮箱',
          key: 'email'
        },
        {
          title: '备注',
          key: 'remark'
        },
        {
          title: '登录次数',
          key: 'login_num'
        },
        {
          title: '最后登录时间',
          key: 'update_time'
        },
        {
          title: '状态',
          key: 'status',
          render: (h, params) => {
            let text = ''
            let type = ''
            if (params.row.status === 1) {
              text = '启用'
              type = 'success'
            } else if (params.row.status === 2) {
              text = '禁用'
              type = 'error'
            }

            return h('div', [
              h('Tag', {
                props: {
                  color: type
                },
                class: {
                  'text-align': true
                },
                on: {
                  // click: () => {
                  //   this.edit(params.row)
                  // }
                }
              }, text)
            ])
          }
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
                },
                directives: [
                  {
                    name: 'has',
                    value: 'system_edit_user',
                    expression: 'has',
                    arg: 'foo'
                  }
                ]
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
                    this.updateUserStatus(params.row, status)
                  }
                },
                directives: [
                  {
                    name: 'has',
                    value: 'system_update_user_status',
                    expression: 'has',
                    arg: 'foo'
                  }
                ]
              }, text),
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
                },
                directives: [
                  {
                    name: 'has',
                    value: 'system_del_user',
                    expression: 'has',
                    arg: 'foo'
                  }
                ]
              }, '删除')
            ])
          }
        }
      ]

    }
  },
  components: { addUserModel },
  methods: {
    createUser () {
      console.log('调用创建用户modal')
      this.modalShow = true
      this.modalTitle = '创建用户'
      // 清空对象
      Object.keys(this.userObj).forEach(key => this.userObj[key] = '')
    },
    changeStatus (val) {
      this.modalShow = val
    },
    changeTitle (val) {
      this.modalTitle = val
    },
    search () {
      this.getList()
    },
    getList () {
      axios.request({
        url: '/api/getUsers?page=' + this.page + '&pageSize=' + this.pageSize + '&searchText=' + this.serachResult,
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
      console.log(val)
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
