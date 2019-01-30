<template>
  <div v-if="selectedUnit" class="form-container">
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
  name: 'UnitEdit',
  mixins: [mixinjs],
  props: {
    selectedUnit: {
      default: null,
      type: Object
    },
    visible: {
      default: true,
      type: Boolean
    }
  },
  data() {
    const { Id, Name, Sort } = this.selectedUnit
    return {
      form: {
        Id: Id,
        Name,
        Sort
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
          this.$emit('edit', this.form)
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
