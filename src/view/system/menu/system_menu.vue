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
        <div slot="title" class="pull-right">
          <Button type="primary" @click="addRoute()">添加路由</Button>
        </div>
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
      </Card>
    </i-col>
    <addRouteModal
      :isShow="modalShow"
      :title="modalTitle"
      @changeStatus="changeStatus"
      @changeTitle="changeTitle"
    ></addRouteModal>
  </Row>
</template>
<script>

import axios from '@/libs/api.request'
import addRouteModal from './add-Route'
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
      serachResult: '',
      tableData: [],
      pageTotal: 0,
      page: 1,
      pageSize: 1,
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
          title: '路径',
          key: 'path'
        },
        {
          title: '系统显示名称',
          key: 'system_name'
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
    },
    changeStatus (val) {
      this.modalShow = val
    },
    changeTitle (val) {
      this.modalTitle = val
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
        url: '/api/getMenus2?page=' + this.page + '&pageSize=' + this.pageSize,
        method: 'get'
      }).then(res => {
        this.tableData = res.data.data.list
        this.pageTotal = res.data.data.pageInfo.total
        this.page = res.data.data.pageInfo.currentPage
      }).catch(err => {
        console.log(err)
      })
    },
    selectedNodes (node) {
      console.log(node)
    },
    getTreeData () {
      axios.request({
        url: '/api/getTreeMenu',
        method: 'get'
      }).then(res => {
        this.treeData = res.data.data
      }).catch(err => {
        console.log(err)
      })
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
