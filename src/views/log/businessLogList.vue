<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="queryParams" label-width="240">
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

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="medium" @click="handleFilter">{{ $t('btns.search') }}</el-button>
          </el-form-item>
        </el-form-item>

      </el-form>

    </div>
    <div>
      <el-table v-loading="isloading" :data="tableData" border style="width: 100%">
        <el-table-column prop="ServiceName" label="项目" />
        <el-table-column prop="Path" label="请求路径" />
        <el-table-column prop="UserName" label="用户名" width="100" />
        <el-table-column prop="Message" label="内容" min-width="350" show-overflow-tooltip />
        <el-table-column prop="DateTime" label="添加时间" />
        <el-table-column label="操作" fixed="right" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="view(scope)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination :current-page.sync="queryParams.PageIndex" :page-size="queryParams.PageSize" :total="totalSize" :page-sizes="[10,20,50]" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>
    <el-dialog v-el-drag-dialog :visible.sync="openDetail" :close-on-click-modal="false" title="日志详细" width="80%">
      <log-detail v-if="openDetail" :visible.sync="openDetail" :selected-log="selectedLog" />
    </el-dialog>
  </div>
</template>

<script>
// import perMixin from '@/mixin/permissionsMixin.js'
import { getLogList } from '@/api/log.js'
import LogDetail from './components/logDetail.vue'

export default {
  name: 'SystemLogList',
  components: { LogDetail },
  data() {
    return {
      isloading: false,
      openDetail: false,
      selectedLog: null,
      totalSize: 0,
      queryParams: {
        Keywords: '',
        PageIndex: 1,
        PageSize: 10,
        Project: null,
        Level: null,
        UserName: null,
        RequestPath: null,
        StartDate: null,
        EndDate: null,
        LogType: 1,
        AppCode: ''
      },
      tableData: [],
      appList: JSON.parse(localStorage.getItem('data')).App
    }
  },
  mounted() {
    this.loadTable()
  },
  methods: {
    loadTable() {
      this.isloading = true
      getLogList(this.queryParams)
        .then(res => {
          this.isloading = false
          console.log(res)
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
      this.openDetail = true
      this.selectedLog = scope.row
    }
  }
}
</script>

<style scoped>
</style>
