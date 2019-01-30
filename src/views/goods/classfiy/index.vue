<template>
  <div class="app-container">
    <div class="head-container">
      <el-button v-if="Add" type="primary" icon="el-icon-plus" @click="addNode">新增</el-button>
    </div>
    <tree-table :data="tableData" :columns="columns" border>
      <el-table-column
        :formatter="isShowFmt"
        label="是否启用"
        prop="IsShow"
      />
      <el-table-column
        :formatter="isShowFmt"
        label="是否显示到首页分类"
        prop="ShowInNav"
      />
      <el-table-column
        label="排序"
        prop="Sort"
      />
      <el-table-column v-if="Update||Delete" label="操作" fixed="right" width="300">
        <template slot-scope="scope">
          <el-button
            v-if="!scope.row.ParentId && Add"
            size="mini"
            type="primary"
            @click="addChild(scope)"
          >新增子节点</el-button>
          <el-button v-if="Update" type="primary" size="mini" @click="editNode(scope)">修改</el-button>
          <el-button v-if="Delete" type="danger" size="mini" @click="deleteNode(scope)">删除</el-button>
        </template>
      </el-table-column>
    </tree-table>

    <el-dialog
      v-el-drag-dialog
      :visible.sync="openEdit"
      :close-on-click-modal="false"
      :title="action==='add'?'新增商品分类':'修改商品分类'"
    >
      <el-form v-if="openEdit" ref="classForm" :rules="rules" :model="form" label-width="100px">
        <el-form-item label="分类名称" prop="Name">
          <el-input v-model="form.Name" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="序号" prop="Sort">
          <el-input v-model="form.Sort" type="number" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="显示到首页">
          <el-switch v-model="form.ShowInNav" :active-value="1" :inactive-value="0"/>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch v-model="form.IsShow" :active-value="1" :inactive-value="0"/>
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
import { getClassfity, addClassfity, updateClassfity, deleteClassfity } from '@/api/goods'
// import perMixin from '@/mixin/permissionsMixin.js'
import treeTable from '@/components/TreeTable'
export default {
  name: 'MallClassfiy',
  components: { treeTable },
  // mixins: [perMixin],
  data() {
    return {
      openEdit: false,
      columns: [
        {
          text: '名称',
          value: 'Name'
        }
      ],
      tableData: [],
      form: {
        Name: '',
        Sort: 1,
        ShowInNav: 1,
        IsShow: 1
      },
      rules: {
        Name: [
          { required: true, message: '输入名称', trigger: 'blur' }
        ],
        Sort: [
          { required: true, message: '输入序号', trigger: 'blur' }
        ]
      },
      action: 'add'
    }
  },
  mounted() {
    this.getCommodityClass()
  },
  methods: {
    getCommodityClass() {
      getClassfity().then(res => {
        this.tableData = res['Data']
      })
    },
    isShowFmt(row, column, cellValue, index) {
      return cellValue ? '是' : '否'
    },
    addNode() {
      this.action = 'add'
      this.openEdit = true
      this.form = { Name: '', Sort: 1, ShowInNav: 1, IsShow: 1, ParentId: 0 }
    },
    cancel() {
      this.openEdit = false
    },
    addChild(scope) {
      this.action = 'add'
      this.openEdit = true
      const selected = scope.row
      this.form = { Name: '', ShowInNav: 1, IsShow: 1 }
      if (selected.children && selected.children.length > 0) {
        this.form.Sort = selected.children.length + 1
      }
      this.form.ParentId = selected.Id
    },
    editNode(scope) {
      this.action = 'edit'
      this.openEdit = true
      const selected = scope.row
      this.assign(selected)
      this.form.Id = selected.Id
    },
    assign(selected) {
      this.form.Sort = selected.Sort
      this.form.Name = selected.Name
      this.form.IsShow = selected.IsShow
      this.form.ShowInNav = selected.ShowInNav
      this.form.ParentId = selected.ParentId
    },
    deleteNode(scope) {
      this.$confirm('此操作将永久删除该类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteClassfity({
          id: scope.row.Id
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getCommodityClass()
        })
      }).catch(() => {})
    },
    submitForm() {
      this.$refs['classForm'].validate((valid) => {
        if (valid) {
          this.openEdit = false
          if (this.action === 'add') {
            addClassfity(this.form).then(() => {
              this.$message({
                type: 'success',
                message: '新增成功!'
              })
              this.getCommodityClass()
            })
          } else {
            updateClassfity(this.form).then(() => {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.getCommodityClass()
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
  .head-container{
    margin: 10px auto;
  }
</style>
