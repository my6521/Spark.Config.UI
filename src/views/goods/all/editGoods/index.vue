<template>
  <div class="edit-view">
    <normal
      v-if="form.IsSpec===0"
      :info="form"
      :store-id="origin.StoreId"
      :spu-id="origin.SpuId"
      @cancel="hidenView"
      @hadChange="change"
    />
    <sku
      v-if="form.IsSpec===1"
      :info="form"
      :store-id="origin.StoreId"
      :spu-id="origin.SpuId"
      @cancel="hidenView"
      @hadChange="change"
    />
  </div>
</template>

<script>
import { getGoodsDetail } from '@/api/goods'
import normal from './components/normal'
import sku from './components/sku'
export default {
  name: 'EditGoods',
  components: { normal, sku },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    origin: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      form: {}
    }
  },
  mounted() {
    getGoodsDetail({
      spuId: this.origin.SpuId,
      storeId: this.origin.StoreId
    }).then(res => {
      this.form = res['Data']
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    hidenView() {
      this.$emit('update:visible', false)
    },
    change() {
      this.$emit('listChange')
    }
  }
}
</script>

<style scoped>
  .edit-view{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #ffffff;
    z-index: 100;
    overflow-y: scroll;
  }
</style>
