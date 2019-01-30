<template>
  <div>
    <el-dialog
      :visible.sync="show"
      :close-on-click-modal="false"
      :show-close="false"
      title="一键设置"
      append-to-body
      @closed="cancel"
    >
      <el-form ref="Form" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="零售价" prop="RetailPrice">
          <el-input v-model="form.RetailPrice" placeholder="请输入零售价"/>
        </el-form-item>
        <el-form-item label="成本价" prop="CostPrice">
          <el-input v-model="form.CostPrice" placeholder="请输入成本价"/>
        </el-form-item>
        <el-form-item label="重量" prop="Weight">
          <el-input v-model="form.Weight" placeholder="请输入重量"/>
        </el-form-item>
        <el-form-item label="库存" prop="StockQuantity">
          <el-input v-model="form.StockQuantity" placeholder="请输入库存数"/>
        </el-form-item>
        <el-form-item label="附件上传" prop="ImgUrl">
          <div v-if="form.viewImg" class="view-box">
            <div class="delete" @click="deleteImg">
              <svg-icon icon-class="edit" />
            </div>
            <img :src="form.viewImg" alt="">
            <p>{{ form.ImgUrl }}</p>
          </div>
          <upload-file
            v-if="!form.viewImg"
            :multiple="false"
            :limit="1"
            drag
            accept=".png,.jpg,.jpeg"
            @success="uploadSuccess"
          >
            <i class="el-icon-upload"/>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
          </upload-file>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <div class="btn-group">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import uploadFile from '@/components/Upload/uploadFile'
export default {
  name: 'EditCtrl',
  components: { uploadFile },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        ImgUrl: '',
        viewImg: '',
        RetailPrice: '',
        CostPrice: '',
        Weight: '',
        StockQuantity: ''
      },
      rules: {
        RetailPrice: [
          { required: true, message: '请输入零售价', trigger: 'blur' }
        ],
        Weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        StockQuantity: [
          { required: true, message: '请输入初始库存', trigger: 'blur' }
        ],
        ImgUrl: [
          { required: true, message: '请输上传商品图片', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs['Form'].validate((valid) => {
        if (valid) {
          this.$emit('confirm', this.form)
          this.cancel()
        } else {
          return false
        }
      })
    },
    cancel() {
      this.$emit('update:show', false)
    },
    uploadSuccess(res) {
      this.form.viewImg = res.file.url
      this.form.ImgUrl = res.response['Data'][0]
    },
    deleteImg() {
      this.form.viewImg = null
    }
  }
}
</script>

<style scoped lang="scss">
  .view-box{
    width: 360px;
    height: 180px;
    position: relative;
    display: flex;
    flex-direction: column;
    img{
      max-width: 100%;
      max-height: 100%;
    }
    p{
      flex: 1;
    }
    .delete{
      position: absolute;
      cursor: pointer;
      font-size: 18px;
      top:0;
      right: 0;
    }
  }
</style>
