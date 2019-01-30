<template>
  <div class="errPage-container">
    <el-button class="back-btn" @click="back">返回</el-button>
    <h2>权限不足</h2>
    <p>抱歉你的账号权限不足，无法访问该页面，请联系管理员</p>
  </div>
</template>

<script>

export default {
  name: 'Page401',
  methods: {
    back() {
      this.$router.push({ path: '/dashboard' })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .errPage-container {
    width: 800px;
    padding-top: 200px;
    margin: 0 auto;
  }
  .back-btn{
    background: #0a76a4;
    color: #FFFFFF;
  }
</style>
