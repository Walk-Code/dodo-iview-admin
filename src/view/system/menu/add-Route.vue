<template>
  <Modal v-model="showModal" :title="title" @on-cancel="cancel" @on-ok="ok">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <Form-item label="名称" prop="title">
        <Input v-model="formValidate.tilte" placeholder="请输入路由名称，例如：system_log"></Input>
      </Form-item>
      <Form-item label="路径" prop="path">
        <Input v-model="formValidate.path" placeholder="请输入路由路径，例如：/system-log"></Input>
      </Form-item>
      <Form-item label="别名" prop="alias">
        <Input v-model="formValidate.alias" placeholder="请输入路由别名，基于iview国际化，例如：system_menu"></Input>
      </Form-item>
      <Form-item label="是否菜单" prop="isMenu">
        <Radio-group v-model="formValidate.isMenu">
          <Radio label="male">是</Radio>
          <Radio label="female">否</Radio>
        </Radio-group>
      </Form-item>
      <Form-item label="视图路径" prop="iveiw_view_path">
        <Input v-model="formValidate.iveiw_view_path" placeholder="请输入iview页面路径，例如：/system/log/system_log"></Input>
      </Form-item>
    </Form>
  </Modal>
</template>

<script>
export default {
  name: 'addRouteModel',
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '提示'
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
    }
  },
  created () {

  },
  data () {
    return {
      formValidate: {
        title: '',
        path: '',
        alias: '',
        isMenu: ''
      },
      ruleValidate: {
        title: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '路径不能为空', trigger: 'blur' }
        ],
        alias: [
          { required: true, message: '别名不能为控', trigger: 'change' }
        ],
        isMenu: [
          { required: true, message: '请选择是否作为菜单显示', trigger: 'change' }
        ],
        iveiw_view_path: [
          { required: false, message: '请选择是否作为菜单显示', trigger: 'change' }
        ]
      }

    }
  },
  methods: {
    cancel () {
      this.showModal = false
    },
    ok () {
      // 验证表单信息
      this.$refs['formValidate'].validate((valid) => {
        if (valid) {
          this.$Message.success('提交成功!')

          this.$store.$http.get('https://www.v2ex.com/api/topics/hot.json')
            .then(res => {
              console.log(res.data)
            })
        } else {
          this.$Message.error('表单验证失败!')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    }
  }
}
</script>
