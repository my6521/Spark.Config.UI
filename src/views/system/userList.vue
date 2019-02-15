<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="queryParams" label-width="240">
        <el-button type="primary" icon="el-icon-plus" size="medium" @click="add">新增</el-button>
        <el-form-item style="float:right">
          <el-form-item label="关键词">
            <el-input v-model="queryParams.Keyword" placeholder="按关键字查找" class="filter-item" @keyup.enter.native="handleFilter" />
          </el-form-item>
          <el-button type="primary" icon="el-icon-search" size="medium" @click="handleFilter">{{ $t('btns.search') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table v-loading="isloading" :data="tableData" border style="width: 100%">
        <!-- <el-table-column prop="Id" label="Id" width="40" /> -->
        <el-table-column prop="Mobile" label="手机号" />
        <el-table-column prop="UserName" label="用户名" />
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.IsDelete===0">正常</span>
            <span v-if="scope.row.IsDelete===1">禁用</span>
          </template>
        </el-table-column>
        <el-table-column prop="AddTime" label="添加时间" />
        <el-table-column label="操作" fixed="right" align="center" width="150" >
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="view(scope)">详情</el-button>
            <el-button type="danger" size="mini" @click="remove(scope)">禁用</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination :current-page.sync="queryParams.PageIndex" :page-size="queryParams.PageSize" :total="totalSize" :page-sizes="[10,20,50]" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>

    <el-dialog v-el-drag-dialog :visible.sync="editDialog" :close-on-click-modal="false" :title="dialogTitle" width="80%" >
      <el-form :rules="rules" :model="selectData" label-width="80px" >

        <el-form-item label="手机号" prop="Mobile" >
          <el-input v-model="selectData.Mobile" auto-complete="off"/>
        </el-form-item>

        <el-form-item label="用户名" prop="UserName">
          <el-input v-model="selectData.UserName" auto-complete="off" />
        </el-form-item>

        <el-form-item label="密码" prop="Password">
          <el-input v-model="selectData.Password" auto-complete="off" />
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
import { getUserList } from '@/api/system.js'
import { saveUser } from '@/api/system.js'
import { deleteUserById } from '@/api/system.js'

export default {
  name: 'UserList',
  data() {
    return {
      isloading: false,
      editDialog: false,
      totalSize: 0,
      tableData: [],
      dialogTitle: '',
      queryParams: {
        Keyword: '',
        PageIndex: 1,
        PageSize: 10
      },
      selectData: {
        Id: 0,
        Mobile: '',
        UserName: '',
        Password: ''
      },
      rules: {
        Mobile: [
          { required: true, message: '该项不能为空', trigger: 'blur' }
        ],
        UserName: [
          { required: true, message: '该项不能为空', trigger: 'blur' }
        ],
        Password: [
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
      getUserList(this.queryParams)
        .then(res => {
          this.isloading = false
          this.tableData = res['Data']['List']
          this.totalSize = res['Data']['Total']
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
    view(scope) {
      this.editDialog = true
      this.dialogTitle = '编辑用户 - ' + scope.row.UserName
      this.selectData = {
        id: scope.row.Id,
        Mobile: scope.row.Mobile,
        UserName: scope.row.UserName,
        Password: scope.row.Password
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
          deleteUserById(data)
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
      console.info(this.selectData)
      saveUser(this.selectData)
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
      this.dialogTitle = '新增用户'
      this.selectData = {
        Id: 0,
        Mobile: '',
        UserName: '',
        Password: ''
      }
    }
  }
}
</script>

