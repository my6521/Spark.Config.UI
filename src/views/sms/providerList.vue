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
          <!-- <el-button type="primary" size="medium" @click="resetList">重置</el-button> -->
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table v-loading="isloading" :data="tableData" border style="width: 100%">
        <el-table-column prop="Id" label="Id" />
        <el-table-column prop="Name" label="名称" />
        <el-table-column prop="Code" label="编码" />
        <el-table-column label="状态" >
          <template slot-scope="scope">
            <span v-if="scope.row.Status===0">禁用</span>
            <span v-if="scope.row.Status===1">启用</span>
          </template>
        </el-table-column>
        <el-table-column prop="AddTime" label="添加时间" />
        <el-table-column prop="UpdateTime" label="更新时间" />
        <el-table-column label="操作" fixed="right" align="center" >
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="view(scope)">编辑</el-button>
            <!-- <el-button type="danger" size="mini" @click="remove(scope)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination :current-page.sync="queryParams.PageIndex" :page-size="queryParams.PageSize" :total="totalSize" :page-sizes="[10,20,50]" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>

    <el-dialog v-el-drag-dialog :visible.sync="editDialog" :close-on-click-modal="false" :title="dialogTitle" width="80%" >
      <el-form :model="selectProvider" label-width="80px" >

        <el-form-item label="名称" prop="Name">
          <el-input v-model="selectProvider.Name" auto-complete="off" placeholder="请输入服务商名称" />
        </el-form-item>

        <el-form-item label="编码" prop="Code">
          <el-input v-model="selectProvider.Code" auto-complete="off" placeholder="请输入服务商编码" />
        </el-form-item>

        <el-form-item label="状态">
          <el-switch v-model="selectProvider.Status" :active-value="1" :inactive-value="0" />
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
import { getProviderList } from '@/api/sms.js'
import { saveProvider } from '@/api/sms.js'
export default {
  name: 'ProviderList',
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
      selectProvider: {
        Status: 0,
        Name: '',
        Id: 0,
        Code: ''
      }
    }
  },
  mounted() {
    this.loadTable()
  },
  methods: {
    loadTable() {
      this.isloading = true
      getProviderList(this.queryParams)
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
      this.editDialog = true
      this.dialogTitle = '编辑短信服务商-' + scope.row.Name
      this.selectProvider = {
        Name: scope.row.Name,
        Code: scope.row.Code,
        Status: scope.row.Status,
        Id: scope.row.Id
      }
    },
    save() {
      saveProvider(this.selectProvider)
        .then(res => {
          this.$message({
            type: 'success',
            message: res.Message
          })
          this.value = ''
          this.editDialog = false
          this.loadTable()
        })
    },
    add() {
      this.editDialog = true
      this.dialogTitle = '新增短信服务商'
      this.selectProvider = {
        Name: '',
        Code: '',
        Status: 0,
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

