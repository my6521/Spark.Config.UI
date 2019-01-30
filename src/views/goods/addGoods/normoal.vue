<template>
  <div>
    <el-form ref="addForm" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="选择店铺" prop="StoreId">
        <el-select
          v-model="form.StoreId"
          :remote-method="remoteMethod"
          :loading="loading"
          :multiple="false"
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词">
          <el-option
            v-for="item in storeList"
            :key="item.Id"
            :label="item.ShopName"
            :value="item.Id"/>
        </el-select>
      </el-form-item>
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
      <el-form-item label="商品重量" prop="Weight">
        <el-input v-model="form.Weight" type="number">
          <template slot="append">kg</template>
        </el-input>
      </el-form-item>
      <el-form-item label="初始库存" prop="StockQuantity">
        <el-input v-model="form.StockQuantity"/>
      </el-form-item>
      <el-form-item label="库存预警值" prop="WarningNum">
        <el-input v-model="form.WarningNum"/>
      </el-form-item>
      <el-form-item label="零售价" prop="RetailPrice">
        <el-input v-model="form.RetailPrice" type="number">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="成本价">
        <el-input v-model="form.CostPrice" type="number">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="产地" prop="Origin">
        <el-input v-model="form.Origin"/>
      </el-form-item>
      <el-form-item label="商品描述">
        <el-input v-model="form.Des" type="textarea"/>
      </el-form-item>
      <el-form-item label="产品图片" prop="ImgUrl">
        <div v-if="viewImg" class="photo-view">
          <img :src="viewImg" alt="">
          <span class="image-name">{{ form.ImgUrl }}</span>
        </div>
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
import { getClassfity, addGoods, getPackId } from '@/api/goods.js'
import { getStores } from '@/api/store.js'
import uploadFile from '@/components/Upload/uploadFile'
import ViewPhoto from '@/components/ViewPhoto/ViewPhoto'
export default {
  name: 'Normoal',
  components: { uploadFile, ViewPhoto },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      storeList: [],
      filterOptions: [],
      selectedCateGory: [],
      packageList: [],
      loading: false,
      uploadShow: false,
      viewImg: '',
      form: {
        'StoreId': null,
        'CategoryId': null,
        'Name': '',
        'WarningNum': null,
        'IsNeedPack': null,
        'GoodsPackId': null,
        'Des': '',
        'RetailPrice': '',
        'Unit': '',
        'Weight': '',
        'StockQuantity': null,
        'CostPrice': '',
        'Origin': '',
        'ImgUrl': ''
      },
      rules: {
        StoreId: [
          { required: true, message: '请选择店铺', trigger: 'change' }
        ],
        Name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        IsNeedPack: [
          { required: true, message: '请选择是否需要包装', trigger: 'change' }
        ],
        GoodsPackId: [
          { required: true, message: '请选择包装类型', trigger: 'change' }
        ],
        CategoryId: [
          { required: true, message: '请选择分类', trigger: 'change' }
        ],
        RetailPrice: [
          { required: true, message: '请输入零售价', trigger: 'blur' }
        ],
        Weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        Origin: [
          { required: true, message: '请输入产地信息', trigger: 'blur' }
        ],
        StockQuantity: [
          { required: true, message: '请输入初始库存', trigger: 'blur' }
        ],
        WarningNum: [
          { required: true, message: '请输入库存预警值', trigger: 'blur' }
        ],
        ImgUrl: [
          { required: true, message: '请输上传商品图片', trigger: 'change' }
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
    // 分类选项
    getClassfity().then(res => {
      this.filterOptions = clearChild(res['Data'])
    })
    // 包装选项
    getPackId().then(res => {
      this.packageList = res['Data']
    })
  },
  methods: {
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        getStores({
          LicenseType: '',
          LicenseStatus: 2,
          Keyword: query,
          PageIndex: 1,
          PageSize: 100
        }).then(res => {
          this.storeList = res['Data']['List']
          this.loading = false
        })
      } else {
        this.storeList = []
      }
    },
    crateSku(obj) {
      const result = {
        StoreId: obj.StoreId,
        CategoryId: obj.CategoryId,
        Des: obj.Des,
        IsShelve: obj.IsShelve,
        Name: obj.Name,
        Origin: obj.Origin,
        IsNeedPack: obj.IsNeedPack,
        GoodsPackId: obj.GoodsPackId,
        SKUList: [
          {
            RetailPrice: obj.RetailPrice,
            CostPrice: obj.CostPrice,
            StockQuantity: obj.StockQuantity,
            Weight: obj.Weight,
            ImgUrl: obj.ImgUrl
          }
        ]
      }
      return result
    },
    uploadSuccess(res) {
      this.viewImg = res.file.url
      this.form.ImgUrl = res.response['Data'][0]
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
          const param = this.crateSku(this.form)
          addGoods(param).then(() => {
            this.$message({
              type: 'success',
              message: '新增成功!',
              onClose: () => { this.cancel() }
            })
          })
        } else {
          return false
        }
      })
    },
    cancel() {
      this.$emit('update:visible', false)
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
