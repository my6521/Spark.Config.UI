<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <el-scrollbar
          tag="div"
          style="height:100%"
          wrap-class="ovx"
        >
          <router-view :key="key"/>
        </el-scrollbar>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.fullPath
    }
  }
}
</script>
<style>
  .ovx {
    overflow-x: hidden;
  }
</style>
<style scoped>
  .app-main {
    /*84 = navbar + tags-view = 50 +34 */
    height: calc(100vh - 84px);
    position: relative;
    overflow: hidden;
  }
</style>

