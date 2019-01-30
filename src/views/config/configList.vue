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
        <el-table-column prop="Id" label="Id" width="40" />
        <el-table-column prop="App" label="App" />
        <el-table-column prop="Name" label="Name" />
        <el-table-column prop="Key" label="Key" />
        <el-table-column prop="Value" label="Value" width="300" show-overflow-tooltip />
        <el-table-column label="Status">
          <template slot-scope="scope">
            <span v-if="scope.row.Status===0">禁用</span>
            <span v-if="scope.row.Status===1">启用</span>
          </template>
        </el-table-column>
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
      <el-form :rules="rules" :model="selectConfig" label-width="80px" >
        <el-form-item label="App" >
          <el-select v-model="selectConfig.App" placeholder="请选择">
            <el-option
              v-for="item in appList"
              :key="item.Code"
              :label="item.Name"
              :value="item.Code"/>
          </el-select>
        </el-form-item>

        <el-form-item label="Key" prop="Key" >
          <el-input v-model="selectConfig.Key" auto-complete="off"/>
        </el-form-item>

        <el-form-item label="Status">
          <el-switch v-model="selectConfig.Status" :active-value="1" :inactive-value="0" />
        </el-form-item>

        <div class="editor-container" >
          <json-editor ref="jsonEditor" v-model="value" />
        </div>
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
import { getConfigList } from '@/api/config.js'
import { saveConfigList } from '@/api/config.js'
import { getAppList } from '@/api/config.js'
import { deleteConfig } from '@/api/config.js'
import JsonEditor from '@/components/JsonEditor'

export default {
  name: 'ConfigList',
  components: { JsonEditor },
  data() {
    return {
      value: '',
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
      selectConfig: {
        App: '',
        Key: '',
        Value: '',
        Status: 0,
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
    this.loadAppList()
  },
  methods: {
    loadTable() {
      this.isloading = true
      getConfigList(this.queryParams)
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
    loadAppList() {
      getAppList()
        .then(res => {
          this.appList = res.Data
        })
        .catch(err => {
          console.log(err)
        })
    },
    resetList() {},
    view(scope) {
      this.editDialog = true
      this.dialogTitle = '编辑配置-' + scope.row.Key
      this.selectConfig = {
        App: scope.row.App,
        Status: scope.row.Status,
        Name: scope.row.Name,
        Key: scope.row.Key,
        Value: '',
        Id: scope.row.Id
      }
      this.value = ''
      this.value = JSON.parse(scope.row.Value)
    },
    remove(scope) {
      var data = { id: scope.row.Id }
      this.$confirm('此操作风险很大，你确定继续吗?', '提示', {
        confirmButtonText: '删库跑路',
        cancelButtonText: '再想想',
        type: 'warning'
      })
        .then(() => {
          deleteConfig(data)
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
      if (typeof this.value === 'object') {
        this.value = JSON.stringify(this.value)
      }
      this.selectConfig.Value = this.value
      saveConfigList(this.selectConfig)
        .then(res => {
          this.$message({
            type: 'success',
            message: res.Message
          })
          this.value = ''
          this.editDialog = false
          this.loadTable()
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '操作异常'
          })
          this.value = ''
          this.editDialog = false
          console.log(err)
        })
    },
    add() {
      this.editDialog = true
      this.dialogTitle = '新增配置'
      this.selectConfig = {
        App: '',
        Status: 0,
        Name: '',
        Key: '',
        Value: '',
        Id: 0
      }
      this.value = ''
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

