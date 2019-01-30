<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="20">
        <el-col :xs="10" :sm="10" :md="10" :lg="5" :xl="5">
          <el-input v-model="queryParams.Keyword" placeholder="按关键字查找" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-col>
        <el-col :xs="20" :sm="10" :md="10" :lg="5" :xl="5">
          <el-button type="primary" icon="el-icon-search" size="medium" @click="handleFilter">{{ $t('btns.search') }}</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table v-loading="isloading" :data="tableData" border style="width: 100%">
      <el-table-column label="商品" prop="GoodsName" />
      <el-table-column label="店铺" prop="StoreName" />
      <el-table-column label="评价" prop="Scores" />
      <el-table-column label="内容" prop="Content" />
      <el-table-column label="评价时间" prop="Addtime" />
      <el-table-column label="状态" prop="UseTime" />
      <el-table-column label="会员" prop="MemberName" />
      <!-- 操作功能暂时隐藏-->
    </el-table>

    <div v-if="totalSize!==0" class="pagination-container">
      <el-pagination :current-page.sync="queryParams.PageIndex" :page-size="queryParams.PageSize" :total="totalSize" background layout="prev, pager, next, jumper" @current-change="handleCurrentChange" />
    </div>

    <el-dialog v-el-drag-dialog :visible.sync="openDialog" :close-on-click-modal="false" title="评论审核">
      <el-form v-if="openDialog" ref="goodsForm" :rules="rules" :model="form" label-width="100px">
        <el-form-item label="审核状态" prop="VerifyStatus">
          <el-select v-model="form.VerifyStatus" placeholder="请选择">
            <el-option :value="1" label="通过" />
            <el-option :value="2" label="拒绝" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.VerifyStatus == 2" label="拒绝原因" prop="VerifyRemark">
          <el-input v-model="form.VerifyRemark" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <div class="btn-group">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import perMixin from '@/mixin/permissionsMixin.js'
import { getEvaluate } from '@/api/goods.js'
export default {
  name: 'Comment',
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
      selectRow: {},
      totalSize: 1,
      queryParams: {
        Keyword: '',
        PageIndex: 1,
        PageSize: 10
      },
      tableData: [],
      form: {
        VerifyStatus: '',
        VerifyRemark: ''
      },
      rules: {
        VerifyStatus: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        VerifyRemark: [
          {
            validator: validateReson,
            required: true,
            message: '请输入拒绝理由',
            trigger: 'blur'
          }
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
      getEvaluate(this.queryParams)
        .then(res => {
          this.tableData = res['Data']['List']
          this.totalSize = res['Data']['Total']
          this.isloading = false
        })
        .catch(() => {
          this.isloading = false
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
    del(row) {
      this.selectRow = row
      this.form.GoodsId = this.selectRow.ID
      this.form.VerifyStatus = this.selectRow.VerifyStatus
      this.form.VerifyRemark = this.selectRow.VerifyRemark
      this.openDialog = true
    },
    submitForm() {
      this.$refs['goodsForm'].validate(valid => {
        if (valid) {
          // goodsVerify(this.form).then(() => {
          //   this.$message({
          //     type: 'success',
          //     message: '修改成功!'
          //   })
          //   this.cancel()
          //   this.handleFilter()
          // })
          this.cancel()
          this.handleFilter()
        } else {
          return false
        }
      })
    },
    cancel() {
      this.selectRow = {}
      this.openDialog = false
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
