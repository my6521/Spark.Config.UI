<template>
  <div class="thum-pic">
    <template v-if="src">
      <img :src="src" :alt="alt" @click="isShow=true">
      <el-dialog
        v-el-drag-dialog
        :visible.sync="isShow"
        append-to-body
      >
        <div class="content">
          <img :src="src" :alt="alt">
        </div>
      </el-dialog>
    </template>
    <template v-else>
      <div class="none-img">
        <svg-icon class="icon" icon-class="image"/>
        暂无图片
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'ViewPhoto',
  // eslint-disable-next-line
  props: ['src', 'alt'],
  data() {
    return {
      isShow: false
    }
  }
}
</script>

<style scoped>
  .thum-pic{
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 100%;
    max-height: 100%;
  }
  .thum-pic img{
    max-width: 100%;
    max-height: 100%;
  }
  .none-img{
    /*width: 60px;*/
    /*height: 60px;*/
    margin: 0 auto;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }
  .content{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .content img{
    max-width: 100%;
    max-height: 100%
  }
</style>
