<template>
  <el-button size="mini" @click="addSaleIt">上架</el-button>
</template>

<script>
import { shelve } from '@/api/goods'
export default {
  name: 'AddSale',
  props: {
    origin: {
      type: Object,
      required: true
    }
  },
  methods: {
    addSaleIt() {
      this.$alert('确认上架该商品？', '提示', {
        confirmButtonText: '确定',
        callback: action => {
          if (action === 'confirm') {
            this.confirmIt()
          }
        }
      })
    },
    confirmIt() {
      shelve(this.origin.SpuId).then(res => {
        this.$emit('change')
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
  .in-line{
    display: inline-block;
  }
</style>
