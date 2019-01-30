<template>
  <div class="app-container">
    <div v-show="!showSku&&!showNormal" class="btn-group">
      <div class="btn-box" @click="changeType('normal')">添加普通商品</div>
      <div class="btn-box" @click="changeType('sku')">添加系列商品</div>
    </div>
    <transition name="fade-in">
      <add-normal v-if="showNormal" :visible.sync="showNormal"/>
    </transition>
    <transition name="fade-in">
      <add-sku v-if="showSku" :visible.sync="showSku"/>
    </transition>
  </div>
</template>

<script>
import addNormal from './normoal'
import addSku from './Sku'
export default {
  name: 'AddGoods',
  components: { addNormal, addSku },
  data() {
    return {
      showSku: false,
      showNormal: false
    }
  },
  methods: {
    changeType(type) {
      if (type === 'sku') {
        this.showSku = true
      } else if (type === 'normal') {
        this.showNormal = true
      }
    }
  }
}
</script>

<style scoped>
  .btn-group{
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .btn-box{
    cursor: pointer;
    padding: 0 24px;
    height: 90px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #42b983;
    color: #ffffff;
    border-radius: 10px;
    margin: 0 30px;
  }
</style>
