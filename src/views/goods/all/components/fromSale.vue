<template>
  <div class="in-line">
    <el-button size="mini" @click="openClear=true">下架</el-button>
    <el-dialog v-el-drag-dialog :visible.sync="openClear" :close-on-click-modal="false" title="下架商品" append-to-body>
      <el-form v-if="openClear" ref="clearForm" :rules="clearRules" :model="clearform" label-width="100px">
        <el-form-item label="下架原因" prop="CancelReason">
          <el-input v-model="clearform.CancelReason" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <div class="btn-group">
          <el-button @click="openClear=false">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/**
   * 下架商品
   */
import { unShelve } from '@/api/goods'
export default {
  name: 'FromSale',
  props: {
    origin: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      openClear: false,
      clearform: {
        CancelReason: ''
      },
      clearRules: {
        CancelReason: [
          { required: true, message: '输入下架原因', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs['clearForm'].validate(valid => {
        if (valid) {
          this.clearform.SpuId = this.origin.SpuId
          unShelve(this.clearform).then(() => {
            this.$message({
              type: 'success',
              message: '下架成功!'
            })
            this.openClear = false
            this.$emit('change')
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
  .in-line{
    display: inline-block;
  }
</style>
