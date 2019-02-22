<template>
  <div class="app-container">
    <el-form ref="adminForm" :model="selectedLog" label-width="110px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="Project" prop="ProjectName">
            {{ selectedLog.ProjectName }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Path" prop="Path">
            {{ selectedLog.Path }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="Level" prop="Level">
            {{ selectedLog.Level }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Category" prop="Category" style="" >
            {{ selectedLog.Category }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="DateTime" prop="DateTime">
            {{ selectedLog.DateTime }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="TraceIdentifier" prop="TraceIdentifier">
            {{ selectedLog.TraceIdentifier }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="Host" prop="Host">
            {{ selectedLog.Host }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Method" prop="Method">
            {{ selectedLog.Method }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="Scheme" prop="Scheme">
            {{ selectedLog.Scheme }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Protocol" prop="Protocol">
            {{ selectedLog.Protocol }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="ContentType" prop="ContentType">
            {{ selectedLog.ContentType }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="UserName" prop="UserName">
            {{ selectedLog.UserName }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="Body" prop="Body">
            {{ selectedLog.Body }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="Message" prop="Message">
            {{ selectedLog.Message }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="StackTrace" prop="StackTrace">
            {{ selectedLog.StackTrace }}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'LogView',
  props: {
    selectedLog: {
      default: null,
      type: Object
    }
  },
  data() {
    return {}
  }
}
</script>

<style scoped>
.el-form-item {
  margin-bottom: 0px;
  word-wrap: break-word;
  white-space: normal;
}
</style>
