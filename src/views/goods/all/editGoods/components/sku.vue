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
      <!--<el-form-item label="商品单位" prop="Unit">-->
      <!--<el-input v-model="form.Unit"/>-->
      <!--</el-form-item>-->
      <el-form-item label="产地">
        <el-input v-model="form.Origin"/>
      </el-form-item>
      <el-form-item label="商品描述">
        <el-input v-model="form.Des" type="textarea"/>
      </el-form-item>
      <el-form-item label="库存预警值">
        <el-input v-model="form.WarningNum"/>
      </el-form-item>
      <el-form-item label="规格">
        <el-table :data="form.SKUList" border style="width: 100%">
          <el-table-column label="规格名">
            <template slot-scope="scope">
              {{ scope.row.SpecDes }}
            </template>
          </el-table-column>
          <el-table-column label="规格图片" width="120px">
            <template slot-scope="scope">
              <view-photo :src="scope.row.viewPhoto" />
              <el-button @click="upImg(scope.row)">上传图片</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="RetailPrice"
            label="零售价"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.isEdit">
                <el-input v-model="scope.row.RetailPrice" placeholder="输入零售价"/>
              </div>
              <div v-else>
                {{ scope.row.RetailPrice }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="成本价">
            <template slot-scope="scope">
              <div v-if="scope.row.isEdit">
                <el-input v-model="scope.row.CostPrice" placeholder="输入成本价"/>
              </div>
              <div v-else>
                {{ scope.row.CostPrice }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="商品重量">
            <template slot-scope="scope">
              <div v-if="scope.row.isEdit">
                <el-input v-model="scope.row.Weight" placeholder="输入商品重量">
                  <template slot="append">kg</template>
                </el-input>
              </div>
              <div v-else>
                {{ scope.row.Weight }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="StockQuantity" label="库存数量">
            <template slot-scope="scope">
              <div v-if="scope.row.isEdit">
                <el-input v-model="scope.row.StockQuantity" placeholder="输入库存数量"/>
              </div>
              <div v-else>
                {{ scope.row.StockQuantity }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template slot-scope="scope">
              <el-button v-if="!scope.row.isEdit" @click="scope.row.isEdit = true">编辑</el-button>
              <el-button v-if="scope.row.isEdit" @click="scope.row.isEdit = false">确定</el-button>
              <el-button @click="deleteSku(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
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
  name: 'Sku',
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
      uploadShow: false,
      activeSku: null,
      form: {},
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
        Unit: [
          { required: true, message: '请输入商品单位', trigger: 'blur' }
        ]
      }
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
    this.createForm()
  },
  methods: {
    /* 构造form */
    createForm() {
      const form = {
        'Id': this.spuId,
        'StoreId': this.storeId,
        'CategoryId': this.info.CategoryId,
        'Name': this.info.Name,
        'Unit': this.info.Unit,
        'Des': this.info.Des,
        'Note': this.info.Note,
        'Origin': this.info.Origin,
        'WarningNum': this.info.WarningNum,
        'IsNeedPack': this.info.IsNeedPack,
        'GoodsPackId': this.info.GoodsPackId,
        'SKUList': []
      }
      for (const sku of this.info.SKUList) {
        const item = {
          'Id': sku.Id,
          'SpecDes': sku.SpecDes,
          'StockQuantity': sku.StockQuantity,
          'Code': sku.Code,
          'RetailPrice': sku.RetailPrice,
          'CostPrice': sku.CostPrice,
          'Weight': sku.Weight,
          'GalleryId': sku.GalleryId,
          'ImgUrl': sku.ImgUrl,
          'SpecValueList': sku.SpecValueList,
          'isEdit': false,
          'viewPhoto': sku.ImgUrl
        }
        form.SKUList.push(item)
      }
      this.form = form
    },
    upImg(row) {
      this.uploadShow = true
      this.activeSku = row
    },
    uploadSuccess(res) {
      this.activeSku.viewPhoto = res.file.url
      this.activeSku.ImgUrl = res.response['Data'][0]
      this.uploadShow = false
    },
    deleteSku(row) {
      const index = this.form.SKUList.indexOf(row)
      this.form.SKUList.splice(index, 1)
    },
    submit() {
      upDateGoods(this.form).then(res => {
        this.$message({
          message: '更新成功',
          type: 'success'
        })
        this.$emit('hadChange')
        this.cancel()
      }).catch(err => {
        console.log(err)
      })
    },
    handleCommand(type) {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          if (type === 'onSubmit') {
            this.form.IsShelve = true
          } else if (type === 'justSave') {
            this.form.IsShelve = false
          }
          this.submit()
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

<style scoped>

</style>
