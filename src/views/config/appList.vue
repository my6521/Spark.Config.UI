<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="queryParams" label-width="240">
        <el-button type="primary" icon="el-icon-plus" size="medium" @click="add">新增</el-button>
        <el-form-item style="float:right">
          <el-form-item label="关键词">
            <el-input v-model="queryParams.Keywords" placeholder="按关键字查找" class="filter-item" @keyup.enter.native="handleFilter" />
          </el-form-item>
          <el-button type="primary" icon="el-icon-search" size="medium" @click="handleFilter">{{ $t('btns.search') }}</el-button>
          <el-button type="primary" size="medium" @click="resetList">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table v-loading="isloading" :data="tableData" border style="width: 100%">
        <el-table-column prop="Id" label="Id" />
        <el-table-column prop="Code" label="Code" />
        <el-table-column prop="Name" label="Name" />
        <el-table-column prop="Remark" label="Remark" />
        <el-table-column prop="AddTime" label="AddTime" />
        <el-table-column label="Operate" fixed="right" align="center" width="150" >
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="view(scope)">详情</el-button>
            <el-button type="danger" size="mini" @click="remove(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination :current-page.sync="queryParams.PageIndex" :page-size="queryParams.PageSize" :total="totalSize" :page-sizes="[10,20,50]" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>

    <el-dialog v-el-drag-dialog :visible.sync="editDialog" :close-on-click-modal="false" :title="dialogTitle" width="80%" >
      <el-form :model="selectApp" label-width="80px" >

        <el-form-item label="Name" prop="Name">
          <el-input v-model="selectApp.Name" auto-complete="off" placeholder="please enter project name" />
        </el-form-item>

        <el-form-item label="Code" prop="Code">
          <el-input v-model="selectApp.Code" auto-complete="off" placeholder="please enter project code" />
        </el-form-item>

        <el-form-item label="Remark" prop="Remark">
          <el-input v-model="selectApp.Remark" auto-complete="off" placeholder="please enter remark"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <div class="btn-group">
          <el-button @click="editDialog = false">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getAppList } from '@/api/config.js'
import { deleteApp } from '@/api/config.js'
import { saveApp } from '@/api/config.js'

export default {
  name: 'AppList',
  data() {
    return {
      isloading: false,
      editDialog: false,
      totalSize: 0,
      tableData: [],
      dialogTitle: '',
      queryParams: {
        Keywords: '',
        PageIndex: 1,
        PageSize: 100
      },
      selectApp: {
        Remark: '',
        Name: '',
        Code: '',
        Id: 0
      },
      rules: {
        App: [
          { required: true, message: '该项不能为空', trigger: 'blur' }
        ],
        Name: [
          { required: true, message: '该项不能为空', trigger: 'blur' }
        ],
        Key: [
          { required: true, message: '该项不能为空', trigger: 'blur' }
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
      getAppList(this.queryParams)
        .then(res => {
          this.isloading = false
          this.tableData = res['Data']
          this.totalSize = this.tableData.length
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleFilter() {
      this.queryParams.PageIndex = 1
      this.loadTable()
    },
    handleCurrentChange(val) {
      this.queryParams.PageIndex = val
      this.loadTable()
    },
    handleSizeChange(val) {
      this.queryParams.PageSize = val
      this.queryParams.PageIndex = 1
      this.loadTable()
    },
    resetList() {},
    view(scope) {
      this.editDialog = true
      this.dialogTitle = '编辑项目-' + scope.row.Name
      this.selectApp = {
        Remark: scope.row.Remark,
        Code: scope.row.Code,
        Name: scope.row.Name,
        Id: scope.row.Id
      }
    },
    remove(scope) {
      var data = { id: scope.row.Id }
      this.$confirm('此操作风险很大，你确定继续吗?', '提示', {
        confirmButtonText: '删库跑路',
        cancelButtonText: '再想想',
        type: 'warning'
      })
        .then(() => {
          deleteApp(data)
            .then(res => {
              this.$message({
                type: 'success',
                message: res.Message
              })
              this.editDialog = false
              this.loadTable()
            })
            .catch(err => {
              console.log(err)
            })
        })
    },
    save() {
      saveApp(this.selectApp)
        .then(res => {
          this.$message({
            type: 'success',
            message: res.Message
          })
          this.editDialog = false
          this.loadTable()
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '操作异常'
          })
          this.editDialog = false
          console.log(err)
        })
    },
    add() {
      this.editDialog = true
      this.dialogTitle = '新增项目'
      this.selectApp = {
        Remark: '',
        Name: '',
        Code: '',
        Id: 0
      }
    }
  }
}
</script>

<style scoped>
.editor-container{
  position: relative;
  height: 100%;
}
.el-form-item{
  margin-bottom: 10px
}
</style>

