<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="queryParams" label-width="240">
        <el-button type="primary" icon="el-icon-plus" size="medium" @click="add">新增</el-button>

        <el-form-item style="float:right">
          <el-form-item label="应用" >
            <el-select v-model="queryParams.AppCode" placeholder="请选择">
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
        <el-table-column prop="Key" label="Key" />
        <el-table-column prop="Content" label="配置" min-width="200" show-overflow-tooltip />
        <el-table-column prop="Remark" label="备注" />
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.Status===0">禁用</span>
            <span v-if="scope.row.Status===1">启用</span>
          </template>
        </el-table-column>
        <el-table-column prop="AddTime" label="添加时间" />
        <el-table-column prop="UpdateTime" label="更新时间" />
        <el-table-column label="查看" fixed="right" align="center">
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
      <el-form :rules="rules" :model="selectConfig" label-width="80px" >
        <el-form-item label="项目" >
          <el-select v-model="selectConfig.AppCode" placeholder="请选择">
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

        <el-form-item label="备注">
          <el-input v-model="selectConfig.Remark" auto-complete="off"/>
        </el-form-item>

        <el-form-item label="状态">
          <el-switch v-model="selectConfig.Status" :active-value="1" :inactive-value="0" />
        </el-form-item>

        <el-form-item label="配置">
          <div class="editor-container" >
            <json-editor ref="jsonEditor" v-model="value" />
          </div>
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
import { getConfigList } from '@/api/config.js'
import { saveConfig } from '@/api/config.js'
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
      appList: JSON.parse(localStorage.getItem('data')).App,
      dialogTitle: '',
      queryParams: {
        Keywords: '',
        PageIndex: 1,
        PageSize: 10,
        AppCode: ''
      },
      selectConfig: {
        Key: '',
        Remark: '',
        Content: '',
        Status: 0,
        AppName: '',
        AppCode: '',
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
    view(scope) {
      this.editDialog = true
      this.dialogTitle = '编辑配置-' + scope.row.Key
      this.selectConfig = {
        AppId: scope.row.AppId,
        Remark: scope.row.Remark,
        Status: scope.row.Status,
        AppName: scope.row.AppName,
        Key: scope.row.Key,
        Content: '',
        Id: scope.row.Id,
        AppCode: scope.row.AppCode
      }
      this.value = ''
      this.value = JSON.parse(scope.row.Content)
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
        })
    },
    save() {
      if (typeof this.value === 'object') {
        this.value = JSON.stringify(this.value)
      }
      this.selectConfig.Content = this.value
      saveConfig(this.selectConfig)
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
      this.dialogTitle = '新增配置'
      this.selectConfig = {
        Key: '',
        Remark: '',
        Content: '',
        Status: 0,
        AppName: '',
        AppCode: '',
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

