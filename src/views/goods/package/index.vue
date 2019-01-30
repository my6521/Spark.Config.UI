<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-if="Add" type="primary" icon="el-icon-plus" size="mini" @click="addAdv">{{ $t('btns.add') }}</el-button>
    </div>
    <el-table v-loading="isloading" :data="tableData" border style="width: 100%">
      <span v-show="!isloading && tableData.length === 0" slot="empty">暂无数据</span>
      <el-table-column label="包装类型" prop="Name" />
      <el-table-column label="价格(元)" prop="Fee" />
      <el-table-column label="适合范围">
        <template slot-scope="scope">
          {{ scope.row.MinWeight }}kg ~ {{ scope.row.MaxWeight }}kg
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="160">
        <template slot-scope="scope">
          <el-button v-if="Update" type="primary" size="mini" @click="editAdv(scope)">修改</el-button>
          <el-button v-if="Delete" type="danger" size="mini" @click="deleteById(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-el-drag-dialog :visible.sync="openEdit" :close-on-click-modal="false" :title="action==='add'?'新增包装方式':'修改包装方式'">
      <el-form v-if="openEdit" ref="paymentForm" :rules="rules" :model="form" label-width="120px">
        <el-form-item label="名称" prop="Name">
          <el-input v-model="form.Name" auto-complete="off" />
        </el-form-item>
        <el-form-item label="推荐最小装重" prop="MinWeight">
          <el-input v-model="form.MinWeight" auto-complete="off" />
        </el-form-item>
        <el-form-item label="最大装重" prop="MaxWeight">
          <el-input v-model="form.MaxWeight" auto-complete="off" />
        </el-form-item>
        <el-form-item label="价格（租金）" prop="Fee">
          <el-input v-model="form.Fee" type="number" auto-complete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <div class="btn-group">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import perMixin from '@/mixin/permissionsMixin.js'
import {
  getPackId,
  goodspackAdd,
  goodspackUpdate,
  goodspackDelete
} from '@/api/goods.js'
export default {
  name: 'Package',
  // mixins: [perMixin],
  data() {
    return {
      isloading: false,
      openEdit: false,
      tableData: [],
      form: {
        Name: '',
        MinWeight: '',
        MaxWeight: '',
        Fee: ''
      },
      rules: {
        Name: [{ required: true, message: '输入名称', trigger: 'blur' }],
        MinWeight: [{ required: true, message: '输入推荐最小承重', trigger: 'blur' }],
        MaxWeight: [{ required: true, message: '输入最大承重', trigger: 'blur' }],
        Fee: [{ required: true, message: '输入价格', trigger: 'blur' }]
      },
      action: 'add'
    }
  },
  mounted() {
    this.loadTable()
  },
  methods: {
    loadTable() {
      this.isloading = true
      getPackId()
        .then(res => {
          this.tableData = res['Data']
          this.isloading = false
        })
        .catch(() => {
          this.isloading = false
        })
    },
    cancel() {
      this.openEdit = false
    },
    submitForm() {
      this.$refs['paymentForm'].validate(valid => {
        if (valid) {
          this.openEdit = false
          if (this.action === 'add') {
            goodspackAdd(this.form).then(() => {
              this.$message({
                type: 'success',
                message: '新增成功!'
              })
              this.handleFilter()
            })
          } else {
            goodspackUpdate(this.form).then(() => {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.handleFilter()
            })
          }
        } else {
          return false
        }
      })
    },
    formatterHandle(row, column, cellValue, index) {
      return cellValue ? '启用' : '禁用'
    },
    handleFilter() {
      this.loadTable()
    },
    addAdv() {
      this.action = 'add'
      this.openEdit = true
      this.form = {
        Name: '',
        MinWeight: '',
        MaxWeight: '',
        Fee: ''
      }
    },
    editAdv(scope) {
      const selectedRow = scope.row
      this.action = 'edit'
      this.openEdit = true
      this.form = {
        Id: selectedRow.Id,
        Name: selectedRow.Name,
        MinWeight: selectedRow.MinWeight,
        MaxWeight: selectedRow.MaxWeight,
        Fee: selectedRow.Fee
      }
    },
    deleteById(scope) {
      this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          goodspackDelete(scope.row.Id).then(() => {
            this.handleFilter()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped>
  .filter-container {
    margin: 10px auto;
  }
</style>
