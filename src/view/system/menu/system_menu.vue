<template>
  <Row :gutter="16">
    <i-col span="10">
      <Card>
        <p slot="title">路由树列表</p>
        <Tree :data="treeData" @on-select-change="selectedNodes"></Tree>
      </Card>
    </i-col>
    <i-col span="14">
      <Card>
        <Button slot="title" type="primary" @click="addRoute()" v-has='system_add_route'>添加路由</Button>
        <div>
          <Input
            class="search-input"
            v-model="serachResult"
            search
            enter-button
            placeholder="请输入路由路径/路由名称"
            @click.native="search"
          />
        </div>
        <Table :columns="columns" :data="tableData" border ref="selection"></Table>
      </Card>
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
    </i-col>
    <addRouteModal
      :isShow="modalShow"
      :title="modalTitle"
      :node="routeObj"
      :isRefresh="refresh"
      @changeStatus="changeStatus"
      @changeTitle="changeTitle"
      @changePanterRoute="changePanterRoute"
      @refreshData="refreshData"
    ></addRouteModal>
  </Row>
</template>
<script>

import axios from '@/libs/api.request'
import addRouteModal from './add-route-modal'
export default {
  name: 'system_menu',
  created () {
    this.getList()
    this.getTreeData()
  },
  data () {
    return {
      modalShow: false,
      modalTitle: '',
      system_add_route: 'system_add_route',
      serachResult: '',
      refresh: false, // 是否需要刷新数据
      parent_title: '',
      parent_code: 0,
      routeObj: {
      },
      tableData: [],
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
          title: '路径',
          key: 'url'
        },
        {
          title: '系统显示名称',
          key: 'alias'
        },
        {
          title: 'vue view路径',
          key: 'component'
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
                    value: 'system_edit_menu',
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
                    this.updateMenuStatus(params.row, status)
                  }
                },
                directives: [
                  {
                    name: 'has',
                    value: 'system_update_route_status',
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
                    value: 'system_del_menu',
                    expression: 'has',
                    arg: 'foo'
                  }
                ]
              }, '删除')
            ])
          }
        }
      ],
      treeData: []
    }
  },
  components: { addRouteModal },
  methods: {
    addRoute () {
      this.modalShow = true
      this.modalTitle = '添加路由'
      this.routeObj.id = 0
      this.routeObj.code = 0
      this.routeObj.title = ''
      this.routeObj.url = ''
      this.routeObj.alias = ''
      this.routeObj.is_menu = ''
      this.routeObj.is_auth = ''
      this.routeObj.component = ''
    },
    changeStatus (val) {
      this.modalShow = val
    },
    changeTitle (val) {
      this.modalTitle = val
    },
    changePanterRoute (val) {
      this.routeObj = Object.assign(this.routeObj, val)
    },
    handleSelectAll (status) {
      this.$refs.selection.selectAll(status)
    },
    handlePage (value) {
      this.page = value
      this.getList()
    },
    handlePageSize (value) {
      this.pageSize = value
      this.getList()
    },
    getList () {
      axios.request({
        url: '/v1/system/menu/getList?page=' + this.page + '&pageSize=' + this.pageSize + '&searchText=' + this.serachResult,
        method: 'get'
      }).then(res => {
        this.tableData = res.data.data.data
        this.pageTotal = res.data.data.total
        this.page = res.data.data.current_page
      }).catch(err => {
        console.log(err)
      })
    },
    selectedNodes (node) {
      if (node[0].title !== undefined) {
        node[0].parent_title = node[0].title
        node[0].parent_code = node[0].code
        this.changePanterRoute(node[0])
      }
    },
    getTreeData () {
      axios.request({
        url: '/v1/system/menu/tree',
        method: 'get'
      }).then(res => {
        this.treeData = res.data.data
      }).catch(err => {
        console.log(err)
      })
    },
    refreshData (val) {
      // 刷新数据
      if (val) {
        this.getTreeData()
        this.getList()
      }
    },
    edit (val) {
      this.modalShow = true
      this.modalTitle = '编辑路由'
      this.changePanterRoute(val)
    },
    updateMenuStatus (val, status) {
      val.status = status
      axios.request({
        url: '/api/updateMenuStatus',
        method: 'post',
        data: {
          routeJson: JSON.stringify(val)
        }
      }).then(res => {
        this.$Notice.success({
          title: '通知',
          desc: res.data.message
        })
        this.getList()
        this.getTreeData()
      }).catch(err => {
        console.log(err)
      })
    },
    del (id) {
      axios.request({
        url: '/api/delMenu',
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
        this.getTreeData()
      }).catch(err => {
        this.$Notice.warning({
          title: '警告',
          desc: err.response.data.message
        })
        console.log(err)
      })
    },
    search () {
      this.getList()
    }
  }
}
</script>
<style>
.search-input {
  width: 30%;
  margin-bottom: 10px;
}
</style>
