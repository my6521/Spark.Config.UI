<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="queryParams" label-width="240">
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
          <!-- <el-button type="primary" size="medium" @click="resetList">重置</el-button> -->
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table v-loading="isloading" :data="tableData" border style="width: 100%">
        <el-table-column prop="Id" label="Id" />
        <el-table-column prop="AppName" label="项目" />
        <el-table-column prop="ProviderName" label="服务商" />
        <el-table-column prop="Mobile" label="发送手机" />
        <el-table-column prop="TempId" label="模板编码" />
        <el-table-column label="状态" >
          <template slot-scope="scope">
            <span v-if="scope.row.Status===0">未发送</span>
            <span v-if="scope.row.Status===1">已发送</span>
          </template>
        </el-table-column>
        <el-table-column prop="Content" label="发送内容" width="200" show-overflow-tooltip />
        <el-table-column prop="AddTime" label="添加时间" />
        <el-table-column label="操作" fixed="right" align="center" >
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="view(scope)">查看</el-button>
            <!-- <el-button type="danger" size="mini" @click="remove(scope)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination :current-page.sync="queryParams.PageIndex" :page-size="queryParams.PageSize" :total="totalSize" :page-sizes="[10,20,50]" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>

    <el-dialog v-el-drag-dialog :visible.sync="editDialog" :close-on-click-modal="false" :title="dialogTitle" width="80%" >
      <el-form :model="selectRecord" label-width="80px" >

        <el-form-item label="项目" >
          <el-input v-model="selectRecord.AppName" disabled="disabled" />
        </el-form-item>

        <el-form-item label="服务商" >
          <el-input v-model="selectRecord.ProviderName" disabled="disabled" />
        </el-form-item>

        <el-form-item label="模板编码" >
          <el-input v-model="selectRecord.TempId" disabled="disabled" />
        </el-form-item>

        <el-form-item label="发送手机" >
          <el-input v-model="selectRecord.Mobile" disabled="disabled" />
        </el-form-item>

        <el-form-item label="发送内容" >
          <el-input v-model="selectRecord.Content" type="textarea" disabled="disabled" />
        </el-form-item>

        <el-form-item label="状态">
          <template v-if="selectRecord.Status===1">
            <el-input :value="'已发送'" disabled="disabled" />
          </template>
          <template v-else>
            <el-input :value="'未发送'" disabled="disabled" />
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <div class="btn-group">
          <el-button type="primary" @click="save" >确 定</el-button>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getRecordList } from '@/api/sms.js'

export default {
  name: 'RecordList',
  data() {
    return {
      isloading: false,
      editDialog: false,
      totalSize: 0,
      appList: JSON.parse(localStorage.getItem('data')).App,
      tableData: [],
      dialogTitle: '',
      queryParams: {
        Keywords: '',
        PageIndex: 1,
        PageSize: 100,
        AppCode: ''
      },
      selectRecord: {
      }
    }
  },
  mounted() {
    this.loadTable()
  },
  methods: {
    loadTable() {
      this.isloading = true
      getRecordList(this.queryParams)
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
      this.dialogTitle = '短信发送详情'
      this.selectRecord = {
        Mobile: scope.row.Mobile,
        TempId: scope.row.TempId,
        AppName: scope.row.AppName,
        Status: scope.row.Status,
        Content: scope.row.Content,
        ProviderName: scope.row.ProviderName,
        Id: scope.row.Id
      }
    },
    save() {
      this.editDialog = false
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

