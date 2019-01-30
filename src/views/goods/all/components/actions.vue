<template>
  <div class="in-line">
    <el-button size="mini" @click="checkDetail">详情</el-button>
    <from-sale v-if="origin.SpuStatus===2" :origin="origin" @change="handleUpdate"/>
    <examine v-if="origin.Source===1&&origin.SpuStatus===1" :origin="origin" @change="handleUpdate"/>
    <add-sale v-if="origin.Source===2&&origin.SpuStatus!==2" :origin="origin" @change="handleUpdate"/>
    <el-button v-if="origin.Source===2&&origin.SpuStatus!==2" size="mini" @click="editGoods">编辑</el-button>
    <el-button v-if="origin.Source===2&&origin.SpuStatus!==2" type="danger" size="mini" @click="deleteGoods">删除</el-button>
  </div>
</template>

<script>
import examine from './examine'
import fromSale from './fromSale'
import addSale from './addSale'
import { deleteGoods } from '@/api/goods'
export default {
  name: 'Actions',
  components: { examine, fromSale, addSale },
  props: {
    origin: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      goodsInfo: {},
      openEdit: false
    }
  },
  methods: {
    handleUpdate() {
      this.$emit('listChange')
    },
    editGoods() {
      this.$emit('openEdit', { ...this.origin })
    },
    checkDetail() {
      this.$emit('checkDetail', { ...this.origin })
    },
    deleteGoods() {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteGoods({
          id: this.origin.SpuId
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.$emit('listChange')
        })
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
  .in-line{
    display: inline-block;
    white-space: nowrap;
  }
</style>
