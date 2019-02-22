<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="queryParams" label-width="240">
        <el-form-item style="float:right">
          <el-form-item label="关键词">
            <el-input v-model="queryParams.Keywords" placeholder="按关键字查找" class="filter-item" @keyup.enter.native="handleFilter" />
          </el-form-item>
          <el-button type="primary" icon="el-icon-search" size="medium" @click="handleFilter">{{ $t('btns.search') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table v-loading="isloading" :data="tableData" border style="width: 100%">
        <el-table-column prop="UserId" label="用户Id" />
        <el-table-column prop="Mobile" label="手机" />
        <el-table-column prop="UserName" label="用户名" />
        <el-table-column prop="AppNames" label="项目" />
        <el-table-column label="操作" fixed="right" align="center" width="150" >
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="view(scope)">编辑</el-button>
            <!-- <el-button type="danger" size="mini" @click="remove(scope)">禁用</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination :current-page.sync="queryParams.PageIndex" :page-size="queryParams.PageSize" :total="totalSize" :page-sizes="[10,20,50]" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>

    <el-dialog v-el-drag-dialog :visible.sync="editDialog" :close-on-click-modal="false" :title="dialogTitle" width="80%" >
      <el-form :model="selectData" label-width="80px" >

        <el-form-item label="用户名" prop="UserName">
          <el-input v-model="selectData.UserName" disabled="disabled" auto-complete="off" />
        </el-form-item>

        <el-form-item label="手机号" prop="Mobile" >
        <el-input v-model="selectData.Mobile" disabled="disabled" auto-complete="&quot;off&quot;/&quot;/"/></el-form-item>

        <el-form-item label="项目" >
          <el-select v-model="selectData.AppIds" multiple placeholder="请选择">
            <el-option
              v-for="item in appList"
              :key="item.Id"
              :label="item.Name"
              :value="item.Id"/>
          </el-select>
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
import { getRoleList } from '@/api/app.js'
import { getAppList } from '@/api/app.js'
import { getUserAppList } from '@/api/app.js'
import { saveRole } from '@/api/app.js'
export default {
  name: 'RoleList',
  data() {
    return {
      isloading: false,
      editDialog: false,
      totalSize: 0,
      tableData: [],
      appList: [],
      dialogTitle: '',
      queryParams: {
        Keywords: '',
        PageIndex: 1,
        PageSize: 10
      },
      selectData: {
        UserId: 0,
        Mobile: '',
        UserName: '',
        AppIds: []
      }
    }
  },
  mounted() {
    this.loadTable()
    getAppList({ pageSize: 9999, pageIndex: 1 }).then(res => {
      if (res.Data != null) {
        this.appList = res.Data.List
      }
    })
  },
  methods: {
    loadTable() {
      this.isloading = true
      getRoleList(this.queryParams)
        .then(res => {
          this.isloading = false
          this.tableData = res['Data']['List']
          this.totalSize = res['Data']['Total']
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
      this.isloading = true
      this.editDialog = true
      this.dialogTitle = '编辑项目权限'
      this.selectData = {
        UserId: scope.row.UserId,
        Mobile: scope.row.Mobile,
        UserName: scope.row.UserName,
        AppIds: []
      }
      getUserAppList({ userId: scope.row.UserId })
        .then(res => {
          this.isloading = false
          if (res.Data != null) {
            for (var i = 0; i < res.Data.length; i++) {
              this.selectData.AppIds.push(res.Data[i].Id)
            }
          }
        })
    },
    save() {
      saveRole(this.selectData)
        .then(res => {
          this.$message({
            type: 'success',
            message: res.Message
          })
          this.editDialog = false
          this.loadTable()
        })
    }
  }
}
</script>
<style lang="scss">
 .el-select{
   display: block;
 }
</style>
