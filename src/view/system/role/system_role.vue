<template>
  <Card>
    <div slot="title" class="pull-right">
      <Button type="primary" @click="createRole()">添加角色</Button>
    </div>
    <div>
      <Input
        class="search-input"
        v-model="serachResult"
        search
        enter-button
        placeholder="请输入角色名称"
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
    <addRoleModel
      :isShow="modalShow"
      :title="modalTitle"
      :role="roleObj"
      :isRefresh="refresh"
      @changeStatus="changeStatus"
      @changeTitle="changeTitle"
      @getRole="getRole"
      @refreshData="refreshData"
    ></addRoleModel>
    <addAuthModel
      :isShow="showAuthModal"
      :title="showAuthModalTitle"
      :role="roleObj"
      :isRefresh="refresh"
      @changeStatus="changeStatus"
      @changeTitle="changeTitle"
      @getRole="getRole"
      @refreshData="refreshData"
      ref="addAuthModel"
    ></addAuthModel>
  </Card>
</template>
<script>

import axios from '@/libs/api.request'
import addRoleModel from './add-role-modal'
import addAuthModel from './add-auth-modal'
export default {
  name: 'system_role',
  created () {
    this.getList()
  },
  data () {
    return {
      refresh: false,
      roleObj: {
      },
      modalShow: false,
      showAuthModal: false,
      showAuthModalTitle: '',
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
          key: 'title'
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
                    this.updateRoleStatus(params.row, status)
                  }
                }
              }, text),
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
                    this.auth(params.row, status)
                  }
                }
              }, '授权'),
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
  components: { addRoleModel: addRoleModel, addAuthModel: addAuthModel },
  methods: {
    createRole () {
      this.modalShow = true
      this.modalTitle = '添加角色'
      // 清空对象
      Object.keys(this.roleObj).forEach(key => this.roleObj[key] = '')
    },
    changeStatus (val) {
      this.modalShow = val
      this.showAuthModal = val
    },
    changeTitle (val) {
      this.modalTitle = val
      this.showAuthModalTitle = val
    },
    search () {
      this.getList()
    },
    getList () {
      axios.request({
        url: '/api/getRoles?page=' + this.page + '&pageSize=' + this.pageSize + '&searchText=' + this.serachResult,
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
    getRole (val) {
      this.roleObj = Object.assign(this.roleObj, val)
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
      this.getRole(val)
    },
    updateRoleStatus (val, status) {
      val.status = status
      axios.request({
        url: '/api/updateRoleStatus',
        method: 'post',
        data: {
          roleJson: JSON.stringify(val)
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
        url: '/api/delRole',
        method: 'post',
        data: {
          roleId: id
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
    auth (val) {
      this.showAuthModal = true
      this.showAuthModalTitle = '往' + val.title + '角色，添加权限'
      this.$refs.addAuthModel.getTreeMenu(val.id)
      this.roleObj = val
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
