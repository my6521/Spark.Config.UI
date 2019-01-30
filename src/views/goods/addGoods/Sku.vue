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
          placeholder="请输入关键词"
          @change="getSpecList">
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
      <el-form-item label="库存预警值" prop="WarningNum">
        <el-input v-model="form.WarningNum" type="number"/>
      </el-form-item>
      <el-form-item label="产地">
        <el-input v-model="form.Origin"/>
      </el-form-item>
      <el-form-item label="商品描述">
        <el-input v-model="form.Des" type="textarea"/>
      </el-form-item>
      <el-form-item v-if="skuList.length>0" label="sku创建">
        <create-sku-table :sku-list="skuList" @createSkuForm="createSkuForm"/>
        <div v-if="form.SKUList.length>0" class="sku-form">
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
            <el-table-column :render-header="renderHeader" label="操作" align="right">
              <template slot-scope="scope">
                <el-button v-if="!scope.row.isEdit" size="mini" @click="scope.row.isEdit = true">编辑</el-button>
                <el-button v-if="scope.row.isEdit" size="mini" @click="scope.row.isEdit = false">确定</el-button>
                <el-button size="mini" type="danger" @click="deleteSku(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
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
    <edit-ctrl v-if="openEdit" :show.sync="openEdit" @confirm="allEdit"/>
  </div>
</template>

<script>
import { getClassfity, addGoods, getStoreSpecList, getPackId } from '@/api/goods.js'
import { getStores } from '@/api/store.js'
import uploadFile from '@/components/Upload/uploadFile'
import ViewPhoto from '@/components/ViewPhoto/ViewPhoto'
import CreateSkuTable from './components/createSkuTable'
import editCtrl from './components/editCtrl'
export default {
  name: 'Sku',
  components: { uploadFile, ViewPhoto, CreateSkuTable, editCtrl },
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
      openEdit: false,
      skuList: [],
      form: {
        'StoreId': null,
        'CategoryId': null,
        'WarningNum': null,
        'IsNeedPack': null,
        'GoodsPackId': null,
        'Name': '',
        'Des': '',
        'Origin': '',
        'IsShelve': true,
        'SKUList': []
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
        WarningNum: [
          { required: true, message: '请输入库存预警值', trigger: 'blur' }
        ]
      },
      activeSku: null
    }
  },
  watch: {
    selectedCateGory: function(arr) {
      this.form.CategoryId = arr[arr.length - 1]
    }
  },
  mounted() {
    /* 获取商品分类 */
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
    getClassfity().then(res => {
      this.filterOptions = clearChild(res['Data'])
    })
    // 包装选项
    getPackId().then(res => {
      this.packageList = res['Data']
    })
  },
  methods: {
    /* 异步获取商铺名称 */
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
    submit() {
      addGoods(this.form).then(res => {
        this.$message('创建成功')
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
      this.$emit('update:visible', false)
    },
    getSpecList(value) {
      getStoreSpecList(value).then(res => {
        this.skuList = res['Data'].map(v => {
          this.$set(v, 'checkedGroup', [])
          return v
        })
      })
    },
    createSkuForm(tableData) {
      this.form.SKUList = tableData.map(v => {
        this.$set(v, 'isEdit', false)
        this.$set(v, 'viewPhoto', '')
        return v
      })
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
    setColumn() {
      console.log('一键设置')
      this.openEdit = true
    },
    allEdit(data) {
      this.form.SKUList.forEach(v => {
        v.CostPrice = data.CostPrice
        v.RetailPrice = data.RetailPrice
        v.Weight = data.Weight
        v.StockQuantity = data.StockQuantity
        v.viewPhoto = data.viewImg
        v.ImgUrl = data.ImgUrl
      })
    },
    renderHeader(createElement, { column }) {
      return createElement(
        'span',
        {
          'class': 'renderTableHead'
        },
        [
          createElement('span', {
            attrs: {
              style: 'margin-right: 10px'
            }
          }, [column.label]
          ),
          createElement('el-button', {
            attrs: {
              type: '',
              size: 'mini'
            },
            on: { click: this.setColumn }
          }, ['一键设置']
          )
        ]
      )
    }
  }
}
</script>

<style scoped lang="scss">
  .photo-view{
    display: inline-block;
    width: 400px;
    height: 400px;
    img{
      max-width: 100%;
    }
  }
  .sku-form{
    padding-top: 20px;
  }
</style>
