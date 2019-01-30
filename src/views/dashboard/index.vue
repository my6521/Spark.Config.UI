<template>
  <div class="dashboard-container">
    <h1>欢迎您！{{ realname }}</h1>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters(['realname', 'IsAdmin'])
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
