<template>
  <Row  :gutter="16">
    <i-col span="10">
      <Card>
        <p slot="title">路由树列表</p>
        <Tree :data="data2" show-checkbox></Tree>
      </Card>
    </i-col>
    <i-col span="14">
      <Card>
        <div slot="title" class="pull-right">
          <Button type="primary" @click="createUser()">添加路由</Button>
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
          <Page class="pull-right" :total="100" show-elevator />
        </div>
      </Card>
    </i-col>
  </Row>
</template>
<script>
export default {
  name: 'system_menu',
  created () {
    this.tableData = []
    let items = []
    this.$router.options.routes.forEach(element => {
      items.push({
        'name': element.name,
        'path': element.path,
        'system_name': this.$t(element.name)
      })
    })
    this.tableData = items
  },
  data () {
    return {
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
      data2: [
        {
          title: 'parent 1',
          expand: true,
          children: [
            {
              title: 'parent 1-1',
              expand: true,
              children: [
                {
                  title: 'leaf 1-1-1'
                },
                {
                  title: 'leaf 1-1-2'
                }
              ]
            },
            {
              title: 'parent 1-2',
              expand: true,
              children: [
                {
                  title: 'leaf 1-2-1'
                },
                {
                  title: 'leaf 1-2-1'
                }
              ]
            }
          ]
        }
      ]
    }
  },
  methods: {
    handleSelectAll (status) {
      this.$refs.selection.selectAll(status)
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
