<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="20">
        <el-col :xs="10" :sm="10" :md="10" :lg="5" :xl="5">
          <el-input v-model="queryParams.Keyword" placeholder="按关键字查找" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-col>
        <el-col :xs="10" :sm="10" :md="10" :lg="5" :xl="5">
          <el-button type="primary" icon="el-icon-search" size="medium" @click="handleFilter">{{ $t('btns.search') }}</el-button>
          <el-button type="primary" icon="el-icon-plus" size="medium" @click="add">{{ $t('btns.add') }}</el-button>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-table v-loading="isloading" :data="tableData" border style="width: 100%">
        <span v-show="!isloading && tableData.length === 0" slot="empty">暂无数据</span>
        <el-table-column prop="Name" label="名称" />
        <el-table-column prop="Sort" label="排序" />
        <el-table-column label="操作" fixed="right" width="200">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="edit(scope)">{{ $t('btns.edit') }}</el-button>
            <el-button type="danger" size="mini" @click="deleteById(scope)">{{ $t('btns.delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination :current-page.sync="queryParams.PageIndex" :page-size="queryParams.PageSize" :total="totalSize" :page-sizes="[10,20,50]" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>
    <!-- open edit -->
    <el-dialog v-el-drag-dialog :visible.sync="openEdit" :close-on-click-modal="false" title="编辑单位">
      <unit-edit v-if="openEdit" :visible.sync="openEdit" :selected-unit="selectedUnit" @edit="editHandler" />
    </el-dialog>
    <!-- open create -->
    <el-dialog v-el-drag-dialog :visible.sync="openCreate" :close-on-click-modal="false" title="新增单位">
      <unit-create v-if="openCreate" :visible.sync="openCreate" @create="createHandler" />
    </el-dialog>
  </div>
</template>

<script>
// import perMixin from '@/mixin/.js'
import {
  addUnit,
  updateUnit,
  deleteUnitById,
  getUnitById,
  getAllUnit,
  getUnitListByPage
} from '@/api/goods.js'

import UnitCreate from './components/create.vue'
import UnitEdit from './components/edit.vue'

export default {
  name: 'UnitIndex',
  components: { UnitCreate, UnitEdit },
  // mixins: [perMixin],
  data() {
    return {
      isloading: false,
      openEdit: false,
      openCreate: false,
      totalSize: 0,
      queryParams: {
        Keyword: '',
        PageIndex: 1,
        PageSize: 10
      },
      tableData: []
    }
  },
  mounted() {
    this.loadTable()
  },
  methods: {
    loadTable() {
      this.isloading = true
      getUnitListByPage(this.queryParams).then(res => {
        this.isloading = false
        this.tableData = res['Data']['List']
        this.totalSize = res['Data']['Total']
      })
    },
    add() {
      this.openCreate = true
    },
    edit(scope) {
      this.selectedUnit = scope.row
      this.openEdit = true
    },
    createHandler(form) {
      this.openCreate = false
      addUnit(form)
        .then(res => {
          this.handleFilter()
          this.$message({
            message: '新增成功',
            type: 'success',
            duration: 5 * 1000
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    editHandler(form) {
      this.openEdit = false
      updateUnit(form)
        .then(res => {
          this.handleFilter()
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 5 * 1000
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    deleteById(scope) {
      this.$confirm('此操作将永久删除该单位, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var request = { Id: scope.row.Id }
        deleteUnitById(request)
          .then(res => {
            this.handleFilter()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
          .catch(err => {
            console.log(err)
          })
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
    }
  }
}
</script>

<style scoped>
</style>
