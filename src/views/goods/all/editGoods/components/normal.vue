<template>
  <div class="app-container">
    <el-form ref="addForm" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="商品名称" prop="Name">
        <el-input v-model="form.Name"/>
      </el-form-item>
      <el-form-item label="商品分类" prop="CategoryId">
        <el-cascader
          :options="filterOptions"
          v-model="selectedCateGory"
          :show-all-levels="false"
          :clearable="true"
          :props="{ value: 'Id', label: 'Name' }"
          :change-on-select="true"
        />
      </el-form-item>
      <el-form-item label="是否需要包装" prop="IsNeedPack">
        <el-select v-model="form.IsNeedPack">
          <el-option :value="0" label="不需要包装"/>
          <el-option :value="1" label="需要包装"/>
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.IsNeedPack===1" label="包装类型" prop="GoodsPackId">
        <el-select v-model="form.GoodsPackId">
          <el-option v-for="(pack, index) in packageList" :value="pack.Id" :key="index" :label="pack.Name"/>
        </el-select>
      </el-form-item>
      <el-form-item label="零售价" >
        <el-input v-model="form.SKUList[0].RetailPrice" type="number">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <!--<el-form-item label="商品单位" prop="Unit">-->
      <!--<el-input v-model="form.Unit"/>-->
      <!--</el-form-item>-->
      <el-form-item label="商品重量">
        <el-input v-model="form.SKUList[0].Weight" type="number">
          <template slot="append">kg</template>
        </el-input>
      </el-form-item>
      <el-form-item label="初始库存">
        <el-input v-model="form.SKUList[0].StockQuantity"/>
      </el-form-item>
      <el-form-item label="库存预警值" prop="WarningNum">
        <el-input v-model="form.WarningNum"/>
      </el-form-item>
      <el-form-item label="成本价">
        <el-input v-model="form.SKUList[0].CostPrice" type="number">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="产地">
        <el-input v-model="form.Origin"/>
      </el-form-item>
      <el-form-item label="商品描述">
        <el-input v-model="form.Des" type="textarea"/>
      </el-form-item>
      <el-form-item label="产品图片">
        <div v-if="viewImg" class="photo-view">
          <img :src="viewImg" alt="">
        </div>
        <div class="image-name">{{ form.SKUList[0].ImgUrl }}</div>
        <el-button type="primary" icon="upload" @click="uploadShow=true">点击上传</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="cancel">取消</el-button>
        <el-dropdown trigger="click" @command="handleCommand">
          <el-button type="primary">
            保存<i class="el-icon-arrow-down el-icon--right"/>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="justSave">仅保存</el-dropdown-item>
            <el-dropdown-item command="onSubmit">保存并上架</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>
    </el-form>

    <el-dialog
      :visible.sync="uploadShow"
      :close-on-click-modal="false"
      width="420px"
      append-to-body>
      <upload-file
        v-if="uploadShow"
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
    </el-dialog>
  </div>
</template>

<script>
import { getClassfity, upDateGoods, getPackId } from '@/api/goods.js'
import uploadFile from '@/components/Upload/uploadFile'
import ViewPhoto from '@/components/ViewPhoto/ViewPhoto'
export default {
  name: 'Normal',
  components: { uploadFile, ViewPhoto },
  props: {
    info: {
      type: Object,
      required: true
    },
    storeId: {
      type: [Number, String],
      required: true
    },
    spuId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      filterOptions: [],
      selectedCateGory: [],
      packageList: [],
      viewImg: '',
      uploadShow: false,
      form: {
        'Id': this.spuId,
        'StoreId': this.storeId,
        'CategoryId': null,
        'WarningNum': null,
        'IsNeedPack': null,
        'GoodsPackId': null,
        'Name': '',
        'Unit': '',
        'Des': '',
        'IsShelve': false,
        'Origin': '',
        'SKUList': [
          {
            'Id': null,
            'RetailPrice': '',
            'Weight': '',
            'StockQuantity': null,
            'CostPrice': '',
            'GalleryId': null,
            'ImgUrl': ''
          }
        ]
      },
      rules: {
        Name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        CategoryId: [
          { required: true, message: '请选择分类', trigger: 'change' }
        ],
        IsNeedPack: [
          { required: true, message: '请选择是否需要包装', trigger: 'change' }
        ],
        GoodsPackId: [
          { required: true, message: '请选择包装类型', trigger: 'change' }
        ],
        WarningNum: [
          { required: true, message: '请输入库存预警值', trigger: 'blur' }
        ],
        Unit: [
          { required: true, message: '请输入商品单位', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    selectedCateGory: function(arr) {
      this.form.CategoryId = arr[arr.length - 1]
    }
  },
  mounted() {
    const clearChild = function(array) {
      for (const k in array) {
        if (array[k].children && array[k].children.length > 0) {
          clearChild(array[k].children)
        } else {
          delete array[k].children
        }
      }
      return array
    }
    const catchItem = function(arry, id) {
      let result = {}
      const createArr = function(arry) {
        if (arry && arry.length) {
          for (const item of arry) {
            if (item.Id === id) {
              console.log(id)
              result = item
            } else if (item.children && item.children.length) {
              createArr(item.children)
            }
          }
        }
      }
      createArr(arry)
      return [result.ParentId, id]
    }
    getClassfity().then(res => {
      this.filterOptions = clearChild(res['Data'])
      this.selectedCateGory = catchItem(this.filterOptions, this.form.CategoryId)
    })
    // 包装选项
    getPackId().then(res => {
      this.packageList = res['Data']
    })
    for (const key in this.form) {
      if (key === 'SKUList' || key === 'StoreId' || key === 'IsShelve') {
        continue
      } else {
        this.form[key] = this.info[key]
      }
    }
    for (const j in this.form.SKUList[0]) {
      this.form.SKUList[0][j] = this.info.SKUList[0][j]
    }
    this.viewImg = this.form.SKUList[0].ImgUrl
  },
  methods: {
    uploadSuccess(res) {
      this.viewImg = res.file.url
      this.form.SKUList[0].ImgUrl = res.response['Data'][0]
      this.uploadShow = false
    },
    handleCommand(type) {
      if (type === 'onSubmit') {
        this.form.IsShelve = true
      } else if (type === 'justSave') {
        this.form.IsShelve = false
      }
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          upDateGoods(this.form).then(() => {
            this.$message({
              type: 'success',
              message: '修改成功!',
              onClose: () => {
                this.$emit('hadChange')
                this.cancel()
              }
            })
          })
        } else {
          return false
        }
      })
    },
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped lang="scss">
  .photo-view{
    display: inline-block;
    max-width: 200px;
    max-height: 200px;
    img{
      max-width: 100%;
    }
  }
</style>
