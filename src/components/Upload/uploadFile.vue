<template>
  <el-upload
    :multiple="false"
    :action="uploadUrl"
    :headers="upheaders"
    :on-success="uploadSuccess"
    :accept="accept"
    :show-file-list="false"
    drag
  >
    <slot/>
  </el-upload>
</template>

<script>
export default {
  name: 'UploadFile',
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 1
    },
    accept: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      uploadUrl: process.env.BASE_API + '/Resource/File/Upload',
      upheaders: {
        Authorization: 'Bearer ' + this.$store.getters.token
      }
    }
  },
  methods: {
    /** 图片上传 **/
    uploadSuccess(response, file, fileList) {
      this.$emit('success', { response, file, fileList })
    }
  }
}
</script>

<style scoped>

</style>
