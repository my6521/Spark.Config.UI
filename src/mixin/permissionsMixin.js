// 利用计算属性获取到meta 里面的当页操作权限 然后混入到组件当中
export default {
  computed: {
    permissions: function() {
      return this.$route.meta.permissions
    },
    /**
     * @return {boolean}
     */
    Add: function() {
      return true
      // if (this.$store.getters.IsAdmin) {
      //   return true
      // } else {
      //   return this.permissions.some(function (val) {
      //     return val === 'Add'
      //   })
      // }
    },
    /**
     * @return {boolean}
     */
    View: function() {
      return true
      // if (this.$store.getters.IsAdmin) {
      //   return true
      // } else {
      //   if (this.permissions.indexOf('View') > -1) {
      //     return true
      //   } else {
      //     return false
      //   }
      // }
    },
    /**
     * @return {boolean}
     */
    Update: function() {
      return true
      // if (this.$store.getters.IsAdmin) {
      //   return true
      // } else {
      //   return this.permissions.some(function (val) {
      //     return val === 'Update'
      //   })
      // }
    },
    /**
     * @return {boolean}
     */
    Delete: function() {
      return true
      // if (this.$store.getters.IsAdmin) {
      //   return true
      // } else {
      //   return this.permissions.some(function (val) {
      //     return val === 'Delete'
      //   })
      // }
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (!vm.View) vm.$router.push({ path: '/401' })
    })
  }
}
