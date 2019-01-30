<template>
  <div class="sku-box">
    <div v-for="(group, gindex) in skuList" v-if="group.ValueList.length>0" :key="gindex">
      <div>{{ group.Name }}</div>
      <el-checkbox-group v-model="group.checkedGroup">
        <el-checkbox v-for="(spec, index) in group.ValueList" :key="index" :label="spec" border>
          {{ spec.SpecValue }}
        </el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="btn-box">
      <el-button type="primary" @click="createSkuTable">创建skux</el-button>
    </div>
  </div>
</template>

<script>
// 规格组合通用方法
const zuhe = (al) => {
  if (al.length === 0) { return null }
  var size = 1
  for (var i = 0; i < al.length; i++) {
    size = size * al[i].length
  }
  var str = []
  for (var j = 0; j < size; j++) {
    str[j] = []
    for (var m = 0; m < al.length; m++) {
      var k = (j * zuhe_jisuan(al, m) / size) % al[m].length
      k = parseInt(k)
      str[j].push(al[m][k])
    }
  }
  return str
}

const zuhe_jisuan = (al, m) => {
  var result = 1
  for (var i = 0; i < al.length; i++) {
    if (i <= m) {
      result = result * al[i].length
    } else {
      break
    }
  }
  return result
}

export default {
  name: 'CreateSkuTable',
  props: {
    skuList: {
      required: true,
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectedSkus: []
    }
  },
  methods: {
    createSkuTable() {
      const tableData = []
      const result = []
      for (const item of this.skuList) {
        item.checkedGroup && item.checkedGroup.length && result.push(item.checkedGroup)
      }
      if (!result.length) return
      const skuList = zuhe(result)
      for (let i = 0; i < skuList.length; i++) {
        const item = {
          SpecDes: '',
          StockQuantity: null,
          RetailPrice: null,
          CostPrice: null,
          Weight: null,
          SpecValueList: [],
          ImgUrl: ''
        }
        for (var j in skuList[i]) {
          if (item.SpecDes.length > 0) {
            item.SpecDes += '/'
          }
          item.SpecDes += skuList[i][j].SpecValue
          item.SpecValueList.push(skuList[i][j].Id)
        }
        tableData.push(item)
      }
      this.$emit('createSkuForm', tableData)
    }
  }
}
</script>

<style scoped lang="scss">
  .sku-form{
    width: 80%;
    margin: 0 auto;
  }
  .el-form-item{
    margin-bottom: 20px;
  }
  .photo-view{
    display: inline-block;
    width: 200px;
    height: 200px;
    img{
      max-width: 100%;
    }
  }
  .btn-box{
    padding-top: 14px;
  }
</style>
