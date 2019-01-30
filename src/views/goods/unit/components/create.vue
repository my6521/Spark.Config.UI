<template>
  <div class="form-container">
    <el-form ref="adminForm" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="名称" prop="Name">
        <el-input v-model="form.Name" auto-complete="off"/>
      </el-form-item>
      <el-form-item label="排序" prop="Sort">
        <el-input v-model="form.Sort" auto-complete="off"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <div class="btn-group">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import mixinjs from './mixin.js'
export default {
  name: 'UnitCreate',
  mixins: [mixinjs],
  props: {
    visible: {
      default: true,
      type: Boolean
    }
  },
  data() {
    return {
      form: {
        Name: '',
        Sort: null
      }
    }
  },
  methods: {
    close() {
      this.$emit('update:visible', false)
    },
    submitForm() {
      this.$refs['adminForm'].validate((valid) => {
        if (valid) {
          this.$emit('create', this.form)
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
  .form-container{
    width:60%;
    margin: 0 auto;
  }
  .btn-group{
    display: flex;
    justify-content: flex-end;
  }
</style>
