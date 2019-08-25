<template>
  <Card>
    <div slot="title" class="pull-right">
      <Button type="primary" @click="createUser()">添加用户</Button>
    </div>
    <div>
        <Input class = 'search-input'  v-model = 'serachResult' search enter-button  placeholder="请输入账号/姓名/手机号" @click.native="search" />
    </div>
    <Table :columns="columns" :data="tableData" border ref="selection"></Table>
    <addUserModel
      :isShow="modalShow"
      :title="modalTitle"
      @changeStatus="changeStatus"
      @changeTitle="changeTitle"
    ></addUserModel>
  </Card>
</template>
<script>
import addUserModel from './add-modal'

export default {
  name: 'system_user',
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
      modalShow: false,
      modalTitle: '',
      serachResult: '',
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
          title: '登录次数',
          key: 'loginNum'
        },
        {
          title: '最后登录时间',
          key: 'updateTime'
        },
        {
          title: '状态',
          key: 'status'
        },
        {
          title: '操作',
          key: 'status'
        }
      ],
      formValidate: {
        name: '',
        mail: '',
        city: '',
        gender: '',
        interest: [],
        date: '',
        time: '',
        desc: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        mail: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ],
        city: [
          { required: true, message: '请选择城市', trigger: 'change' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        interest: [
          { required: true, type: 'array', min: 1, message: '至少选择一个爱好', trigger: 'change' },
          { type: 'array', max: 2, message: '最多选择两个爱好', trigger: 'change' }
        ],
        date: [
          { required: true, type: 'date', message: '请选择日期', trigger: 'change' }
        ],
        time: [
          { required: true, type: 'date', message: '请选择时间', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请输入个人介绍', trigger: 'blur' },
          { type: 'string', min: 20, message: '介绍不能少于20字', trigger: 'blur' }
        ]
      },
      da: {

      }
    }
  },
  components: { addUserModel },
  methods: {
    createUser () {
      this.modalShow = true
      this.modalTitle = '创建用户'
    },
    changeStatus (val) {
      this.modalShow = val
    },
    changeTitle (val) {
      this.modalTitle = val
    },
    search () {
      console.log(this.serachResult)
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
</style>
