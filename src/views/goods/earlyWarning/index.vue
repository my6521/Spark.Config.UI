<template>
  <div class="detail-view">
    <div class="filter-container">
      <el-form :inline="true" :model="queryParams" label-width="240">
        <el-form-item label="关键词">
          <el-input v-model="queryParams.Keyword" placeholder="商品号/商品名" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('btns.search') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table v-loading="isloading" :data="tableData" border style="width: 100%" >
      <span v-show="!isloading && tableData.length === 0" slot="empty">暂无数据</span>
      <el-table-column
        label="图片"
        width="150px"
      >
        <template slot-scope="scope">
          <div style="width: 100px">
            <view-photo :src="scope.row.ImgUrl" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="商品号" prop="SkuCode"/>
      <el-table-column label="商品名" prop="SkuName"/>
      <el-table-column label="规格" prop="SpecDes"/>
      <el-table-column label="当前库存" prop="StockQuantity">
        <template slot-scope="scope">
          <div v-if="scope.row.StockQuantity>=scope.row.WarningNum" class="tx-green">
            {{ scope.row.StockQuantity }}
          </div>
          <div v-else class="tx-danger">
            {{ scope.row.StockQuantity }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="预警数量" prop="WarningNum"/>
      <el-table-column v-if="Update" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="addTo(scope.row)">入库</el-button>
          <el-button type="danger" size="mini" @click="removeTo(scope.row)">出库</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="totalSize!==0" class="pagination-container">
      <el-pagination :current-page.sync="queryParams.PageIndex" :page-size="queryParams.PageSize" :total="totalSize" background layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
// import perMixin from '@/mixin/permissionsMixin.js'
import { getGoodsSku, inStock, outStock } from '@/api/goods.js'
import ViewPhoto from '@/components/ViewPhoto/ViewPhoto'
export default {
  name: 'EarlyWarning',
  components: { ViewPhoto },
  // mixins: [perMixin],
  data() {
    return {
      key: 1,
      isloading: false,
      totalSize: 1,
      queryParams: {
        IsWarning: 1,
        Keyword: '',
        PageIndex: 1,
        PageSize: 10
      },
      tableData: [],
      result: []
    }
  },
  mounted() {
    this.loadTable()
  },
  methods: {
    loadTable() {
      this.isloading = true
      getGoodsSku(this.queryParams).then(res => {
        this.tableData = res['Data']['List']
        this.totalSize = res['Data']['Total']
        this.isloading = false
      }).catch(() => {
        this.isloading = false
      })
    },
    /** 条件查询 **/
    handleFilter() {
      this.queryParams.PageIndex = 1
      this.loadTable()
    },
    /**
       * 翻页
       **/
    handleCurrentChange(val) {
      this.queryParams.PageIndex = val
      this.loadTable()
    },
    addTo(row) {
      this.$prompt('请输入入库数量', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'number',
        inputPattern: /^([1-9]\d*|[0]{1,1})$/,
        inputErrorMessage: '数量输入不正确'
      }).then(({ value }) => {
        inStock({
          SkuId: row.SkuId,
          Stock: value
        }).then(() => {
          this.$message({
            message: '入库成功',
            type: 'success'
          })
          this.loadTable()
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    removeTo(row) {
      this.$prompt('请输入出库数量', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'number',
        inputPattern: /^([1-9]\d*|[0]{1,1})$/,
        inputErrorMessage: '数量输入不正确'
      }).then(({ value }) => {
        outStock({
          SkuId: row.SkuId,
          Stock: value
        }).then(() => {
          this.$message({
            message: '出库成功',
            type: 'success'
          })
          this.loadTable()
        })
      }).catch(() => {
        console.log('取消')
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .detail-view{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #ffffff;
    z-index: 100;
    padding: 20px;
    overflow: auto;
  }
  .tool-block{
    padding: 20px;
  }
  .cancel{
    margin-bottom: 20px;
  }
  .tx-green{
    color: #36bf32;
  }
  .tx-danger{
    color: #f56c6c;
  }
</style>
