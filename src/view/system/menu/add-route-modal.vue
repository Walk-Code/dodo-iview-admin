<template>
  <Modal v-model="showModal" :title="title" @on-cancel="cancel" @on-ok="ok">
    <Form ref="formValidate" :model="formValidate.node" :label-width="80"><!-- :rules="ruleValidate" 移除表单验证-->
      <Form-item label="父级路由" prop="parentRoute">
        <!--<Input v-model="formValidate.node.parent_title" disabled placeholder="父级路由，不填默认是根路由"></Input>-->
        <treeselect
          :multiple="false"
          :options="options"
          placeholder="Select your favourite(s)..."
          v-model="value"
          @select="menuChange"
        />
        <p :value="value"/>
      </Form-item>
      <Form-item label="名称" prop="title">
        <Input v-model="formValidate.node.title" placeholder="请输入菜单标题"></Input>
      </Form-item>
      <Form-item label="icon" prop="title">
        <Input v-model="formValidate.node.icon" placeholder="请输入菜单图片"></Input>
      </Form-item>
      <Form-item label="路径" prop="url">
        <Input v-model="formValidate.node.url" placeholder="请输入菜单url"></Input>
      </Form-item>
      <Form-item label="别名" prop="alias">
        <Input v-model="formValidate.node.alias" placeholder="请输入路由别名，基于iview国际化，例如：system_menu"></Input>
      </Form-item>
      <Form-item label="加入菜单" prop="isMenu">
        <Radio-group v-model="formValidate.node.is_menu">
          <Radio :label="1">是</Radio>
          <Radio :label="2">否</Radio>
        </Radio-group>
      </Form-item>
      <Form-item label="加入权限控制" prop="isAuth">
        <Radio-group v-model="formValidate.node.is_auth">
          <Radio :label="1">是</Radio>
          <Radio :label="2">否</Radio>
        </Radio-group>
      </Form-item>
      <Form-item label="视图路径" prop="component">
        <Input
          v-model="formValidate.node.component"
          placeholder="请输入iview页面路径，例如：/system/log/system_log 或者 Main 作为祖目录"
        ></Input>
      </Form-item>
    </Form>
  </Modal>
</template>
<script>

import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import axios from '@/libs/api.request'
// import iconPicker from 'vue-fontawesome-elementui-icon-picker'
export default {
  name: 'addRouteModel',
  created () {
    this.getTreeSelectData()
  },
  components: { Treeselect },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '提示'
    },
    node: {
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
    getParentNode: {
      get () {
        return this.node
      },
      set (val) {
        this.$emit('changePanterRoute', val)
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
  data () {
    return {
      formValidate: {
        node: this.node
      },
      ruleValidate: {
        title: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '路径不能为空', trigger: 'blur' }
        ],
        alias: [
          { required: true, message: '别名不能为空', trigger: 'change' }
        ],
        is_menu: [
          { required: true, message: '请选择是否作为菜单显示', trigger: 'change' }
        ],
        is_auth: [
          { required: true, message: '请选择是否加入权限控制', trigger: 'change' }
        ],
        component: [
          { required: false, message: '请填写iview视图view,不填写默认为api接口', trigger: 'change' }
        ]
      },
      value: [],
      options: [],
      selelctNode: {}
    }
  },
  methods: {
    cancel () {
      this.showModal = false
    },
    ok () {
      // 验证表单信息
      this.formValidate.node.parent_code = this.selelctNode.code
      console.log(this.formValidate.node)
      axios.request({
        url: '/v1/system/menu/addOrUpdate',
        method: 'post',
        data: {
          routeJson: JSON.stringify(this.formValidate.node)
        }
      }).then(res => {
        this.$Message.success('提交成功!')
        this.refreshData = true
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    selectIcon (selectedIcon) {
      console.log('selected', selectedIcon)
    },
    getTreeSelectData () {
      axios.request({
        url: '/v1/system/menu/getTreeSelectData',
        method: 'get',
        data: {}
      }).then(res => {
        this.options = res.data.data
      }).catch(err => {
        this.$Notice.warning({
          title: '警告',
          desc: err.response.data.message
        })
      })
    },
    menuChange (node, instanceId) {
      this.selelctNode = node
    }
  }
}
</script>
