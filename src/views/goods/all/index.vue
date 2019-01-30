<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="queryParams" label-width="240">
        <el-form-item label="关键词">
          <el-input
            v-model="queryParams.Keyword"
            placeholder="商品号/商品名"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="queryParams.GoodsAuthStatus" placeholder="请选择" @change="handleFilter">
            <el-option :value="null" label="全部"/>
            <el-option :value="0" label="未提交审核"/>
            <el-option :value="1" label="提交审核"/>
            <el-option :value="2" label="审核通过"/>
            <el-option :value="3" label="审核拒绝"/>
          </el-select>
        </el-form-item>
        <el-form-item label="分类">
          <el-cascader
            :options="filterOptions"
            v-model="selectedOptions"
            :show-all-levels="false"
            :clearable="true"
            :props="{ value: 'Id', label: 'Name' }"
            @change="handleFilter"
          />
        </el-form-item>
        <el-form-item label="店铺名">
          <el-select
            v-model="queryParams.ShopName"
            :remote-method="remoteMethod"
            :loading="searchKeyloading"
            :clearable="true"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            @change="handleFilter"
          >
            <el-option
              v-for="item in storeList"
              :key="item.ID"
              :label="item.ShopName"
              :value="item.ShopName"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="medium"
            @click="handleFilter"
          >{{ $t('btns.search') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table v-loading="isloading" :data="tableData" border style="width: 100%">
      <span v-show="!isloading && tableData.length === 0" slot="empty">暂无数据</span>
      <el-table-column label="图片" width="80px">
        <template slot-scope="scope">
          <div style="width: 60px">
            <view-photo :src="scope.row.ImgUrl"/>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="商品号" prop="SpuCode"/>
      <el-table-column label="商品名" prop="SpuName"/>
      <el-table-column label="商品分类" prop="CategoryName"/>
      <el-table-column label="店铺名" prop="ShopName"/>
      <el-table-column label="类型">
        <template slot-scope="scope">
          <span v-if="scope.row.IsSpec===0">普通商品</span>
          <span v-if="scope.row.IsSpec===1">系列商品</span>
        </template>
      </el-table-column>
      <el-table-column label="上架状态" prop="SpuStatus">
        <template slot-scope="scope">
          <template v-if="scope.row.Source===1">
            <div v-if="scope.row.SpuStatus===0">未提交审核</div>
            <div v-else-if="scope.row.SpuStatus===1">提交审核</div>
            <div v-else-if="scope.row.SpuStatus===2">审核通过 (上架)</div>
            <div v-else-if="scope.row.SpuStatus===4">平台下架 ({{ scope.row.CancelReason }})</div>
            <div v-else>审核失败 ({{ scope.row.AuthRemark }})</div>
          </template>
          <template v-else>
            <div v-if="scope.row.SpuStatus===0">平台保存</div>
            <div v-if="scope.row.SpuStatus===2">平台上架</div>
            <div v-else-if="scope.row.SpuStatus===4">平台下架 ({{ scope.row.CancelReason }})</div>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="添加时间">
        <template slot-scope="scope">{{ scope.row.AddTime }}</template>
      </el-table-column>
      <el-table-column v-if="Update" label="操作" fixed="right" width="300">
        <template slot-scope="scope">
          <actions
            :origin="scope.row"
            @checkDetail="checkDetail"
            @openEdit="inEdit"
            @listChange="resetFilter"
          />
        </template>
      </el-table-column>
    </el-table>
    <div v-if="totalSize!==0" class="pagination-container">
      <el-pagination
        :current-page.sync="queryParams.PageIndex"
        :page-size="queryParams.PageSize"
        :total="totalSize"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
      />
    </div>
    <transition name="fade-in">
      <edit-goods
        v-if="openEdit"
        :visible.sync="openEdit"
        :origin="selectedRow"
        @listChange="resetFilter"
      />
    </transition>
    <transition name="fade-in">
      <detail v-if="openDetail" :origin="selectedRow" :visible.sync="openDetail"/>
    </transition>
  </div>
</template>

<script>
// import perMixin from '@/mixin/permissionsMixin.js'
import { getGoods, getClassfity } from '@/api/goods.js'
import { getStores } from '@/api/store.js'
import ViewPhoto from '@/components/ViewPhoto/ViewPhoto'
import Actions from './components/actions'
import editGoods from './editGoods'
import detail from './detail'
export default {
  name: 'CommodityAll',
  components: { ViewPhoto, Actions, editGoods, detail },
  // mixins: [perMixin],
  data() {
    return {
      isloading: false,
      openEdit: false,
      openDetail: false,
      selectedRow: null,
      totalSize: 1,
      queryParams: {
        IsDelete: 0,
        GoodsAuthStatus: null,
        CategoryId: '',
        Keyword: '',
        PageIndex: 1,
        PageSize: 10,
        ShopName: ''
      },
      filterOptions: [],
      selectedOptions: [],
      storeList: [],
      searchKeyloading: false,
      tableData: []
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
      const pageNow = this.queryParams.PageIndex
      this.queryParams = {
        IsDelete: 0,
        GoodsAuthStatus: null,
        CategoryId: '',
        Keyword: '',
        PageIndex: pageNow,
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
    /**
     * 翻页
     **/
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
    /**
     * 打开编辑
     */
    inEdit(row) {
      this.openEdit = true
      this.selectedRow = row
    },
    checkDetail(row) {
      this.openDetail = true
      this.selectedRow = row
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
