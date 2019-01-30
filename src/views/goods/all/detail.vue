<template>
  <div class="detail-view">
    <div class="content">
      <el-button size="mini" @click="cancel">返回</el-button>
      <h1>商品详情</h1>
      <div v-if="detail">
        <div class="item">
          <div class="title">商品ID</div>
          <div class="item-content">{{ detail.Id }}</div>
        </div>
        <div class="item">
          <div class="title">商品编号</div>
          <div class="item-content">{{ detail.Code }}</div>
        </div>
        <div class="item">
          <div class="title">商品名称</div>
          <div class="item-content">{{ detail.Name }}</div>
        </div>
        <div class="item">
          <div class="title">是否需要包装</div>
          <div class="item-content">
            {{ detail.IsNeedPack===1 ? '需要' : '不需要' }}
          </div>
        </div>
        <div v-if="detail.IsNeedPack===1 " class="item">
          <div class="title">包装类型</div>
          <div class="item-content">
            {{ packName }}
          </div>
        </div>
        <div class="item">
          <div class="title">产地</div>
          <div class="item-content">{{ detail.Origin }}</div>
        </div>
        <div class="item">
          <div class="title">商品类别</div>
          <div class="item-content">{{ detail.CategoryName }}</div>
        </div>
        <div class="item">
          <div class="title">商品描述</div>
          <div class="item-content">{{ detail.Des }}</div>
        </div>
        <div class="item">
          <div class="title">店铺名称</div>
          <div class="item-content">{{ origin.ShopName }}</div>
        </div>
        <div class="item">
          <div class="title">店铺ID</div>
          <div class="item-content">{{ origin.StoreId }}</div>
        </div>
        <div class="item">
          <div class="title">商品来源</div>
          <div class="item-content">
            <span v-if="origin.Source===1">卖家上传</span>
            <span v-if="origin.Source===2">平台上传</span>
          </div>
        </div>
        <template v-if="detail.IsSpec===1">
          <div class="item">
            <div class="title">商品规格</div>
            <div class="item-content">
              <el-table :data="detail.SKUList" border width="100%">
                <el-table-column label="规格名" prop="SpecDes"/>
                <el-table-column label="规格图片" width="120px">
                  <template slot-scope="scope">
                    <view-photo :src="scope.row.ImgUrl" />
                  </template>
                </el-table-column>
                <el-table-column label="零售价">
                  <template slot-scope="scope">
                    ￥{{ scope.row.RetailPrice | currency }}
                  </template>
                </el-table-column>
                <el-table-column label="成本价">
                  <template slot-scope="scope">
                    <div v-if="scope.row.CostPrice">
                      ￥ {{ scope.row.CostPrice | currency }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="预警数量">
                  <template slot-scope="scope">
                    {{ detail.WarningNum }}
                  </template>
                </el-table-column>
                <el-table-column label="商品重量" prop="Weight"/>
                <el-table-column prop="StockQuantity" label="库存数量"/>
              </el-table>
            </div>
          </div>
        </template>
        <template v-if="detail.IsSpec===0">
          <div class="item">
            <div class="title">
              商品图片
            </div>
            <div class="item-content">
              <img :src="detail.SKUList[0].ImgUrl" alt="">
            </div>
          </div>
          <div class="item">
            <div class="title">
              商品数量
            </div>
            <div class="item-content">
              {{ detail.SKUList[0].Weight }}
            </div>
          </div>
          <div class="item">
            <div class="title">
              零售价
            </div>
            <div class="item-content">
              {{ detail.SKUList[0].RetailPrice }}
            </div>
          </div>
          <div class="item">
            <div class="title">
              成本价
            </div>
            <div class="item-content">
              {{ detail.SKUList[0].CostPrice }}
            </div>
          </div>
          <div class="item">
            <div class="title">
              库存数量
            </div>
            <div class="item-content">
              {{ detail.SKUList[0].StockQuantity }}
            </div>
          </div>
          <div class="item">
            <div class="title">
              预警数量
            </div>
            <div class="item-content">
              {{ detail.WarningNum }}
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { getGoodsDetail, getPackId } from '@/api/goods'
import ViewPhoto from '@/components/ViewPhoto/ViewPhoto'
export default {
  name: 'Detail',
  components: { ViewPhoto },
  props: {
    origin: {
      type: Object,
      required: true
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      detail: null,
      packName: ''
    }
  },
  mounted() {
    getGoodsDetail({
      spuId: this.origin.SpuId,
      storeId: this.origin.StoreId
    }).then(res => {
      this.detail = res['Data']
      getPackId().then(res => {
        const list = res['Data']
        for (const k of list) {
          if (k.Id === this.detail.GoodsPackId) {
            this.packName = k.Name
            break
          }
        }
      })
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    cancel() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped lang="scss">
  .detail-view{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #ffffff;
    z-index: 100;
    display: flex;
  }
  .content{
    flex: 1;
    padding: 20px;
    overflow: auto;
  }
  .item-list{
    padding: 0 14px;
  }
  .item{
    display: flex;
    padding-left: 14px;
    margin-bottom: 14px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eeeeee;
    &:last-child{
      border-bottom: none;
    }
    .title{
      width: 120px;
    }
    .item-content{
      flex: 1;
      img{
        max-width: 300px;
      }
    }
  }
</style>
