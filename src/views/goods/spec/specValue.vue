<template>
  <div class="app-container">
    <el-button v-if="Update" size="medium" icon="el-icon-plus" class="add-btn" @click="AddSpecValue">新增分类</el-button>
    <el-table v-loading="isloading" :data="tableData" border style="width: 100%">
      <span v-show="!isloading && tableData.length === 0" slot="empty">暂无数据</span>
      <el-table-column label="类别名称" prop="SpecValue">
        <template slot-scope="scope">
          <template v-if="scope.row.isEdit">
            <el-input v-model="scope.row.SpecValue" class="edit-input" size="mini"/>
          </template>
          <template v-else>
            <div>
              {{ scope.row.SpecValue }}
            </div>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="类别ID" prop="Id" />
      <el-table-column label="录入时间" prop="AddTime">
        <template slot-scope="scope">
          {{ new Date(scope.row.AddTime) | dateFmt('yyyy年MM月dd HH时mm分') }}
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="UpdateTime">
        <template slot-scope="scope">
          {{ new Date(scope.row.UpdateTime) | dateFmt('yyyy年MM月dd HH时mm分') }}
        </template>
      </el-table-column>
      <el-table-column v-if="Update&&Delete" label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="!scope.row.isEdit" type="primary" size="mini" @click="scope.row.isEdit=!scope.row.isEdit">编辑</el-button>
          <el-button v-if="scope.row.isEdit" type="primary" size="mini" @click="confirm(scope.row)">确定</el-button>
          <el-button v-if="scope.row.isEdit" type="warning" size="mini" @click="cancel(scope.row)">取消</el-button>
          <el-button v-if="!scope.row.isEdit" type="danger" size="mini" @click="deleteValue(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-el-drag-dialog :visible.sync="openAdd" :close-on-click-modal="false" title="新增分类">
      <el-form v-if="openAdd" ref="specValueForm" :rules="rule" :model="form" label-width="100px">
        <el-form-item label="规格名称" prop="SpecValue">
          <el-input v-model="form.SpecValue" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <div class="btn-group">
          <el-button @click="openAdd=false">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import perMixin from '@/mixin/permissionsMixin.js'
import { getSpecValue, specUpdateValue, addSpecValue, deleteSpecValue } from '@/api/goods'
export default {
  name: 'SpecValue',
  // mixins: [perMixin],
  data() {
    return {
      isloading: false,
      openAdd: false,
      tableData: [],
      form: {
        SpecValue: ''
      },
      rule: {
        SpecValue: [
          { required: true, message: '输入分类名', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.loadTable()
  },
  methods: {
    loadTable() {
      this.isloading = true
      getSpecValue(this.$route.params.id).then(res => {
        this.isloading = false
        this.tableData = res['Data'].map(v => {
          this.$set(v, 'isEdit', false)
          this.$set(v, 'origin', v.SpecValue)
          return v
        })
      })
    },
    cancel(row) {
      row.SpecValue = row.origin
      row.isEdit = false
    },
    confirm(row) {
      if (row.SpecValue === row.origin) {
        row.isEdit = false
        return
      }
      const form = {
        SpecValue: row.SpecValue,
        Sort: row.Sort,
        Id: row.Id
      }
      specUpdateValue(form).then(() => {
        this.$message({
          message: '更新成功',
          type: 'success'
        })
        row.isEdit = false
        row.origin = row.SpecValue
      })
    },
    AddSpecValue() {
      this.form = {
        SpecId: this.$route.params.id,
        Sort: this.tableData.length,
        SpecValue: ''
      }
      this.openAdd = true
    },
    submitForm() {
      this.$refs['specValueForm'].validate((valid) => {
        if (valid) {
          this.openAdd = false
          addSpecValue(this.form).then(() => {
            this.$message({
              type: 'success',
              message: '新增成功!'
            })
            this.loadTable()
          })
        } else {
          return false
        }
      })
    },
    deleteValue(row) {
      deleteSpecValue(row.Id).then(res => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.loadTable()
      })
    }
  }
}
</script>

<style>
  .add-btn{
    margin-bottom: 20px;
  }
</style>
