<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="queryParams" label-width="240">
        <el-form-item label="关键词">
          <el-input v-model="queryParams.Keyword" placeholder="按关键字查找" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="店铺名">
          <el-select v-model="queryParams.ShopName" :remote-method="remoteMethod" :loading="searchKeyloading" :clearable="true" filterable remote reserve-keyword placeholder="请输入关键词" @change="handleFilter">
            <el-option v-for="item in storeList" :key="item.Id" :label="item.ShopName + `(${item.Mobile})`" :value="item.ShopName" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="medium" @click="handleFilter">{{ $t('btns.search') }}</el-button>
          <el-button v-if="Add" size="medium" icon="el-icon-plus" @click="openAdd=true">新增规格</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table v-loading="isloading" :data="tableData" border style="width: 100%">
      <span v-show="!isloading && tableData.length === 0" slot="empty">暂无数据</span>
      <el-table-column label="规格名称" prop="Name" width="200">
        <template slot-scope="scope">
          <template v-if="scope.row.isEdit">
            <el-input v-model="scope.row.Name" class="edit-input" size="mini"/>
          </template>
          <template v-else>
            <div>
              {{ scope.row.Name }}
              <i v-if="Update" class="el-icon-edit" @click="scope.row.isEdit=!scope.row.isEdit"/>
            </div>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="店铺名称" prop="ShopName" />
      <el-table-column label="添加时间" prop="AddTime">
        <template slot-scope="scope">
          {{ new Date(scope.row.AddTime) | dateFmt('yyyy-MM-dd HH:mm') }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="更新时间" prop="UpdateTime">
        <template slot-scope="scope">
          {{ new Date(scope.row.UpdateTime) | dateFmt('yyyy-MM-dd HH:mm') }}
        </template>
      </el-table-column> -->
      <el-table-column v-if="Update||Delete" label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="!scope.row.isEdit&&Add" type="primary" size="mini" @click="manager(scope.row.Id)">管理</el-button>
          <el-button v-if="scope.row.isEdit&&Update" type="primary" size="mini" @click="confirm(scope.row)">确定</el-button>
          <el-button v-if="scope.row.isEdit&&Update" type="warning" size="mini" @click="cancel(scope.row)">取消</el-button>
          <el-button v-if="!scope.row.isEdit&&Delete" type="danger" size="mini" @click="deleteSpec(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="totalSize!==0" class="pagination-container">
      <el-pagination :current-page.sync="queryParams.PageIndex" :page-size="queryParams.PageSize" :total="totalSize" background layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" />
    </div>
    <el-dialog v-el-drag-dialog :visible.sync="openAdd" :close-on-click-modal="false" title="新增规格">
      <el-form v-if="openAdd" ref="specForm" :rules="rule" :model="form" label-width="100px">
        <el-form-item label="店铺名" prop="StoreId">
          <el-select v-model="form.StoreId" :remote-method="remoteMethod" :loading="searchKeyloading" :clearable="true" style="width: 100%" filterable remote reserve-keyword placeholder="请输入关键词" @change="handleFilter">
            <el-option v-for="item in storeList" :key="item.Id" :label="item.ShopName" :value="item.Id" />
          </el-select>
        </el-form-item>
        <el-form-item label="规格名称" prop="Name">
          <el-input v-model="form.Name" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <div class="btn-group">
          <el-button @click="openAdd=false">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import perMixin from '@/mixin/permissionsMixin.js'
import { querySpec, specUpdate, deleteSpec, addSpec } from '@/api/goods.js'
import { getStores } from '@/api/store.js'
export default {
  name: 'Spec',
  // mixins: [perMixin],
  data() {
    return {
      isloading: false,
      openAdd: false,
      totalSize: 1,
      queryParams: {
        ShopName: '',
        Keyword: '',
        PageIndex: 1,
        PageSize: 10
      },
      storeList: [],
      searchKeyloading: false,
      tableData: [],
      form: {
        StoreId: '',
        Name: ''
      },
      rule: {
        StoreId: [
          { required: true, message: '请选择店铺', trigger: 'change' }
        ],
        Name: [
          { required: true, message: '输入规则名', trigger: 'blur' }
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
      querySpec(this.queryParams)
        .then(res => {
          this.tableData = res['Data']['List'].map(v => {
            this.$set(v, 'isEdit', false)
            this.$set(v, 'origin', v.Name)
            return v
          })
          this.totalSize = res['Data']['Total']
          this.isloading = false
        })
        .catch(() => {
          this.isloading = false
        })
    },
    /** 重置查询*/
    resetFilter() {
      this.queryParams.ShopName = ''
      this.queryParams.Keyword = ''
      this.loadTable()
    },
    /** 条件查询 **/
    handleFilter() {
      this.queryParams.PageIndex = 1
      this.loadTable()
    },
    handleCurrentChange(val) {
      this.queryParams.PageIndex = val
      this.loadTable()
    },
    /**
       * 输入搜索
       */
    remoteMethod(query) {
      if (query !== '') {
        this.searchKeyloading = true
        getStores({
          LicenseType: '',
          LicenseStatus: '',
          Keyword: query,
          PageIndex: 1,
          PageSize: 100
        }).then(res => {
          this.storeList = res['Data']['List']
          this.searchKeyloading = false
        })
      } else {
        this.queryParams.ShopName = ''
        this.storeList = []
      }
    },
    cancel(row) {
      row.Name = row.origin
      row.isEdit = false
    },
    confirm(row) {
      const form = {
        Name: row.Name,
        Id: row.Id
      }
      specUpdate(form).then(res => {
        this.$message({
          message: '更新成功',
          type: 'success'
        })
        row.isEdit = false
        row.origin = row.Name
      })
    },
    deleteSpec(row) {
      deleteSpec(row.Id).then(res => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.resetFilter()
      })
    },
    submitForm() {
      this.$refs['specForm'].validate((valid) => {
        if (valid) {
          this.openAdd = false
          addSpec(this.form).then(() => {
            this.$message({
              type: 'success',
              message: '新增成功!'
            })
            this.handleFilter()
          })
        } else {
          return false
        }
      })
    },
    manager(id) {
      this.$router.push({ path: '/specValue/' + id })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .filter-container {
    margin: 10px auto;
  }
  .userInfo {
    .item {
      min-height: 36px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }
  }
  .el-icon-edit{
    cursor: pointer;
    margin-left: 14px;
  }
</style>
