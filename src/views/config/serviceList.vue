<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="queryParams" label-width="240">
        <el-button type="primary" icon="el-icon-plus" size="medium" @click="add">新增</el-button>
        <el-form-item style="float:right">
          <el-form-item label="应用" >
            <el-select v-model="queryParams.AppCode" placeholder="请选择">
              <el-option label="全部" value=""/>
              <el-option
                v-for="item in appList"
                :key="item.Code"
                :label="item.Name"
                :value="item.Code"/>
            </el-select>
          </el-form-item>
          <el-form-item label="关键词">
            <el-input v-model="queryParams.Keywords" placeholder="按关键字查找" class="filter-item" @keyup.enter.native="handleFilter" />
          </el-form-item>
          <el-button type="primary" icon="el-icon-search" size="medium" @click="handleFilter">{{ $t('btns.search') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table v-loading="isloading" :data="tableData" border style="width: 100%">
        <el-table-column prop="Id" label="Id" width="40" />
        <el-table-column prop="AppName" label="项目" />
        <el-table-column prop="AppCode" label="项目编码" />
        <el-table-column prop="Name" label="服务名称" />
        <el-table-column prop="Ip" label="Ip" />
        <el-table-column prop="Port" label="端口" width="60" />
        <el-table-column label="状态" width="65">
          <template slot-scope="scope">
            <span v-if="scope.row.Status===0">禁用</span>
            <span v-if="scope.row.Status===1">启用</span>
          </template>
        </el-table-column>
        <el-table-column prop="Remark" label="备注" />
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
      <el-form :rules="rules" :model="selectService" label-width="80px" >
        <el-form-item label="App" >
          <el-select v-model="selectService.AppCode" placeholder="请选择">
            <el-option
              v-for="item in appList"
              :key="item.Code"
              :label="item.Name"
              :value="item.Code"/>
          </el-select>
        </el-form-item>

        <el-form-item label="Name" prop="服务名称">
          <el-input v-model="selectService.Name" auto-complete="off"/>
        </el-form-item>

        <el-form-item label="Ip" prop="Ip">
          <el-input v-model="selectService.Ip" auto-complete="off"/>
        </el-form-item>

        <el-form-item label="Port" prop="端口">
          <el-input v-model="selectService.Port" auto-complete="off"/>
        </el-form-item>

        <el-form-item label="Remark" prop="备注">
          <el-input v-model="selectService.Remark" auto-complete="off"/>
        </el-form-item>

        <el-form-item label="状态">
          <el-switch v-model="selectService.Status" :active-value="1" :inactive-value="0" />
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
import { getServiceList } from '@/api/service.js'
import { saveService } from '@/api/service.js'
import { deleteService } from '@/api/service.js'

export default {
  name: 'ServiceList',
  data() {
    return {
      isloading: false,
      editDialog: false,
      totalSize: 0,
      tableData: [],
      appList: JSON.parse(localStorage.getItem('data')).App,
      dialogTitle: '',
      queryParams: {
        Keywords: '',
        PageIndex: 1,
        PageSize: 10,
        AppCode: ''
      },
      selectService: {
        AppCode: '',
        AppName: '',
        Status: 0,
        Name: '',
        Ip: '',
        Port: '',
        Remark: '',
        Id: 0
      },
      rules: {
        App: [
          { required: true, message: '该项不能为空', trigger: 'blur' }
        ],
        Name: [
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
      getServiceList(this.queryParams)
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
      this.dialogTitle = '编辑服务-' + scope.row.Name
      this.selectService = {
        AppCode: scope.row.AppCode,
        AppName: scope.row.AppName,
        Status: scope.row.Status,
        Name: scope.row.Name,
        Ip: scope.row.Ip,
        Port: scope.row.Port,
        Remark: scope.row.Remark,
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
          deleteService(data)
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
      saveService(this.selectService)
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
      this.dialogTitle = '新增服务'
      this.selectService = {
        AppCode: '',
        AppName: '',
        Status: 0,
        Name: '',
        Ip: '',
        Port: '',
        Remark: '',
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

