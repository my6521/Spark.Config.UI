<template>
  <div class="dashboard-container">
    <h1>欢迎您！{{ username }}</h1>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    return {
      currentRole: 'adminDashboard',
      username: localStorage.getItem('username')
    }
  },
  computed: {
    ...mapGetters(['IsAdmin'])
  },
  mounted() {

  }
}
</script>

<style>
  .dashboard-container{
    padding: 20px;
  }
</style>
