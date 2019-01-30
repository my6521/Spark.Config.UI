<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="queryParams" label-width="240">
        <el-form-item label="关键词">
          <el-input v-model="queryParams.Keyword" placeholder="按关键字查找" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="queryParams.GoodsAuthStatus" placeholder="请选择" @change="handleFilter">
            <el-option :value="100" label="全部" />
            <el-option :value="0" label="未提交审核" />
            <el-option :value="1" label="提交审核" />
            <el-option :value="2" label="审核通过" />
            <el-option :value="3" label="审核拒绝" />
          </el-select>
        </el-form-item>
        <el-form-item label="分类">
          <el-cascader :options="filterOptions" v-model="selectedOptions" :show-all-levels="false" :clearable="true" :props="{ value: 'ID', label: 'Name' }" @change="handleFilter" />
        </el-form-item>
        <el-form-item label="店铺名">
          <el-select v-model="queryParams.StoreId" :remote-method="remoteMethod" :loading="searchKeyloading" :clearable="true" filterable remote reserve-keyword placeholder="请输入关键词" @change="handleFilter">
            <el-option v-for="item in storeList" :key="item.ID" :label="item.ShopName" :value="item.ID" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="medium" @click="handleFilter">{{ $t('btns.search') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table v-loading="isloading" :data="tableData" border style="width: 100%">
      <el-table-column label="图片">
        <template slot-scope="scope">
          <view-photo :src="scope.row.ThumPic" />
        </template>
      </el-table-column>
      <el-table-column label="商品名称" prop="Name" />
      <el-table-column label="商品类型" prop="CategoryName" />
      <el-table-column label="零售价格" prop="RetailPrice">
        <template slot-scope="scope">
          ￥{{ scope.row.RetailPrice | currency }}
        </template>
      </el-table-column>
      <el-table-column label="市场价格" prop="MarketPrice">
        <template slot-scope="scope">
          ￥{{ scope.row.MarketPrice | currency }}
        </template>
      </el-table-column>
      <el-table-column label="库存数量" prop="StockQuantity" />
      <el-table-column label="单位" prop="Unit" />
      <el-table-column label="录入时间" prop="AddTime" />
      <el-table-column label="审核状态" prop="AuthStatus">
        <template slot-scope="scope">
          <div v-if="scope.row.AuthStatus===0">
            未提交审核
          </div>
          <div v-else-if="scope.row.AuthStatus===1">
            提交审核
          </div>
          <div v-else-if="scope.row.AuthStatus===2">
            审核通过 (上架)
          </div>
          <div v-else-if="scope.row.AuthStatus===4">
            平台强制下架 ({{ scope.row.UnShelveReason }})
          </div>
          <div v-else>
            审核拒绝 ({{ scope.row.Remark }})
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="Update&&showTool" label="操作" width="120" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="scope.row.AuthStatus===1" type="primary" @click="del(scope.row)">审核</el-button>
          <el-button v-if="scope.row.AuthStatus===2" type="primary" @click="clearGoods(scope.row)">强制下架</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-if="totalSize!==0" class="pagination-container">
      <el-pagination :current-page.sync="queryParams.PageIndex" :page-size="queryParams.PageSize" :total="totalSize" background layout="prev, pager, next, jumper" @current-change="handleCurrentChange" />
    </div>

    <!--审核-->
    <el-dialog v-el-drag-dialog :visible.sync="openDialog" :close-on-click-modal="false" title="商品审核">
      <el-form v-if="openDialog" ref="goodsForm" :rules="rules" :model="form" label-width="100px">
        <el-form-item label="审核状态" prop="AuthStatus">
          <el-select v-model="form.AuthStatus" placeholder="请选择">
            <el-option :value="2" label="通过" />
            <el-option :value="3" label="拒绝" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.AuthStatus === 3" label="拒绝原因" prop="AuthRemark">
          <el-input v-model="form.AuthRemark" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <div class="btn-group">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </div>
    </el-dialog>
    <!--下架-->
    <el-dialog v-el-drag-dialog :visible.sync="openClear" :close-on-click-modal="false" title="下架商品">
      <el-form v-if="openClear" ref="clearForm" :rules="clearRules" :model="clearform" label-width="100px">
        <el-form-item label="下架原因" prop="UnShelveReason">
          <el-input v-model="clearform.UnShelveReason" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <div class="btn-group">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submitForm2">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import perMixin from '@/mixin/permissionsMixin.js'
import { getGoods, goodsAuth, unShelve, getClassfity } from '@/api/goods.js'
import { getStoresByName } from '@/api/store.js'
import ViewPhoto from '@/components/ViewPhoto/ViewPhoto'
export default {
  name: 'CommodityAll',
  components: { ViewPhoto },
  // mixins: [perMixin],
  data() {
    const validateReson = (rule, value, callback) => {
      if (!value && value !== 0) {
        callback(new Error('请输入拒绝理由'))
      } else {
        callback()
      }
    }
    return {
      isloading: false,
      openDialog: false,
      openClear: false,
      selectRow: {},
      totalSize: 1,
      queryParams: {
        IsDelete: 1,
        GoodsAuthStatus: 100,
        CategoryId: -1,
        Keyword: '',
        PageIndex: 1,
        PageSize: 10,
        StoreId: ''
      },
      filterOptions: [],
      selectedOptions: [],
      storeList: [],
      searchKeyloading: false,
      tableData: [],
      form: {
        AuthStatus: '',
        AuthRemark: ''
      },
      rules: {
        AuthStatus: [{ required: true, message: '请选择', trigger: 'change' }],
        AuthRemark: [
          {
            validator: validateReson,
            required: true,
            message: '请输入拒绝理由',
            trigger: 'blur'
          }
        ]
      },
      clearform: {
        UnShelveReason: ''
      },
      clearRules: {
        UnShelveReason: [
          { required: true, message: '输入下架原因', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    showTool: function() {
      return this.tableData.some(val => {
        return val.AuthStatus === 1 || val.AuthStatus === 2
      })
    }
  },
  mounted() {
    this.loadTable()
    const clearChild = function(array) {
      for (const k in array) {
        if (array[k].children && array[k].children.length > 0) {
          clearChild(array[k].children)
        } else {
          delete array[k].children
        }
      }
      return array
    }
    getClassfity().then(res => {
      this.filterOptions = clearChild(res['Data'])
    })
  },
  methods: {
    loadTable() {
      this.isloading = true
      getGoods(this.queryParams)
        .then(res => {
          this.tableData = res['Data']['List']
          this.totalSize = res['Data']['Total']
          this.isloading = false
        })
        .catch(() => {
          this.isloading = false
        })
    },
    /** 重置查询*/
    resetFilter() {
      this.queryParams = {
        IsDelete: 0,
        GoodsAuthStatus: 100,
        CategoryId: -1,
        Keyword: '',
        PageIndex: 1,
        PageSize: 10,
        StoreId: ''
      }
      this.loadTable()
    },
    /** 条件查询 **/
    handleFilter() {
      this.queryParams.PageIndex = 1
      this.queryParams.CategoryId = this.selectedOptions[
        this.selectedOptions.length - 1
      ]
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
    del(row) {
      this.selectRow = row
      this.form.GoodsId = this.selectRow.Id
      this.form.AuthRemark = this.selectRow.AuthRemark
      this.openDialog = true
    },
    clearGoods(row) {
      // 下架商品
      this.selectRow = row
      this.clearform.GoodsId = this.selectRow.Id
      this.openClear = true
    },
    submitForm() {
      this.$refs['goodsForm'].validate(valid => {
        if (valid) {
          goodsAuth(this.form).then(() => {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.cancel()
            this.resetFilter()
          })
        } else {
          return false
        }
      })
    },
    submitForm2() {
      this.$refs['clearForm'].validate(valid => {
        if (valid) {
          console.log(this.clearform)
          unShelve(this.clearform).then(() => {
            this.$message({
              type: 'success',
              message: '下架成功!'
            })
            this.cancel()
            this.resetFilter()
          })
        } else {
          return false
        }
      })
    },
    cancel() {
      this.selectRow = {}
      this.openDialog = false
      this.openClear = false
    },
    /**
     * 输入搜索
     */
    remoteMethod(query) {
      if (query !== '') {
        this.searchKeyloading = true
        getStoresByName(query).then(res => {
          this.storeList = res['Data']
          this.searchKeyloading = false
        })
      } else {
        this.queryParams.StoreId = ''
      }
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
</style>
