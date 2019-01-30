<template>
  <div class="in-line">
    <el-button size="mini" @click="openDialog=true">审核</el-button>
    <el-dialog v-el-drag-dialog :visible.sync="openDialog" :close-on-click-modal="false" title="商品审核" append-to-body>
      <el-form v-if="openDialog" ref="goodsForm" :rules="rules" :model="form" label-width="100px">
        <el-form-item label="审核状态" prop="Status">
          <el-select v-model="form.Status" placeholder="请选择">
            <el-option :value="0" label="通过" />
            <el-option :value="1" label="拒绝" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.Status === 1" label="拒绝原因" prop="AuthRemark">
          <el-input v-model="form.Remark" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <div class="btn-group">
          <el-button @click="openDialog = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/**
 * 审核商品
 */
import { goodsAuth } from '@/api/goods'
export default {
  name: 'Examine',
  props: {
    origin: {
      type: Object,
      required: true
    }
  },
  data() {
    const validateReson = (rule, value, callback) => {
      if (!value && value !== 0) {
        callback(new Error('请输入拒绝理由'))
      } else {
        callback()
      }
    }
    return {
      openDialog: false,
      form: {
        SpuId: this.origin.SpuId,
        Status: '',
        Remark: ''
      },
      rules: {
        Status: [{ required: true, message: '请选择', trigger: 'change' }],
        Remark: [
          {
            validator: validateReson,
            required: true,
            message: '请输入拒绝理由',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs['goodsForm'].validate(valid => {
        if (valid) {
          goodsAuth(this.form).then(() => {
            this.$message({
              type: 'success',
              message: '修改成功!',
              onClose: () => {
                this.openDialog = false
                this.$emit('change')
              }
            })
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
