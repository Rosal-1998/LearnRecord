<template>
  <div>
    <el-dialog
      :visible="jmdialog"
      class="g-dialog"
      title="添加居民"
      @close="handlecancel"
    >
      <div class="jmbox">
        <div class="m-search">
          <el-form :model="jmfilters" :inline="true" ref="jmfilters">
            <el-form-item label="姓名" prop="">
              <el-input
                v-model="jmfilters.name"
                placeholder="姓名"
              ></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="">
              <el-input v-model="jmfilters.phone	" placeholder="手机号码"></el-input>
            </el-form-item>
            <el-form-item label="身份证号" prop="">
              <el-input v-model="jmfilters.idCard	" placeholder="手机号码"></el-input>
            </el-form-item>
            <div class="search-btnbox">
              <span class="btn search-btn" @click="getList">查询</span>
              <span class="btn reset-btn" @click="resetjm('jmfilters')"
                >重置</span
              >
            </div>
          </el-form>
        </div>
        <div class="m-table">
          <el-table
            :data="datalist"
            ref="multipleTable"
            highlight-current-row
            v-loading="listLoading"
            style="width: 100%"
            border
            :row-class-name="tableRowClassName"
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }"
            @select="select"
            @select-all="selectAll"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="ID" prop="residentId" width="80">
            </el-table-column>
            <el-table-column label="姓名" prop="name"> </el-table-column>
            <el-table-column label="身份证号" prop="idCard" width="200"></el-table-column>
            <el-table-column label="手机号" prop="phone"> </el-table-column>
            <el-table-column label="性别" prop="">
              <template slot-scope="scope">
                <span class="f-blue" v-if="scope.row.sex == '0'">男</span>
                <span class="f-gray" v-else-if="scope.row.sex == '1'">女</span>
                <span v-else>/</span>
              </template>
            </el-table-column>
            <el-table-column label="政治面貌" prop="politicsFace">
            </el-table-column>
            <el-table-column label="所属村" prop="villageName"></el-table-column>
          </el-table>
          <div class="m-pagination">
            <el-pagination
              background
              @current-change="handleCurrentChange"
              :page-size="jmfilters.pageSize"
              layout="prev, pager, next"
              :current-page.sync="jmfilters.pageNum"
              prev-text="上一页"
              next-text="下一页"
              :total="total"
            >
            </el-pagination>
            <i class="total">共有{{ total }}条数据</i>
          </div>
        </div>
      </div>
      <div class="dialog-foot">
        <span class="btn-cancel" @click="handlecancel">取消</span>
        <span class="btn-save" @click="handlejmsubmit">确定</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  ResidentList
} from '@/api/api'
export default {
  props: {
    jmdialog: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      jmfilters: {
        name: '',
        phone: '',
        idCard: '',
        pageSize: 10,
        pageNum: 1
      },
      datalist: [],
      total: 0,
      listLoading: false,
      jmInfo: {}
    }
  },
  emits: ['handleCloseAdd','handleAddResident'],
  mounted() {
    this.getList()
  },
  methods: {
    // 单行变色
    tableRowClassName(rowIndex) {
      if (rowIndex.rowIndex % 2 != 0) {
        return "evenRow";
      }
      return "oddRow";
    },
    // 获取列表
    getList() {
      ResidentList(this.jmfilters).then(res => {
        this.datalist = res.data.data;
        this.total = res.data.total;
      });
    },
    handlecancel() {
      this.$emit('handleCloseAdd')
    },
    // 提交
    handlejmsubmit() {
      const length = Object.keys(this.jmInfo).length
      if (length <= 0) {
        this.$message({ 
          message: '请选择人员',
          type: 'error'
        })
        return
      }
      this.$emit('handleAddResident', this.jmInfo)
    },
    // 重置人员
    resetjm() {
      this.$refs.jmfilters.resetFields();
      this.jmfilters = {
        name: '',
        phone: '',
        idCard: '',
        pageSize: 10,
        pageNum: 1
      };
      this.getList()
    },
    // 选择人员
    select(selection) {
      if (selection.length > 1) {
        let del_row = selection.shift();
        this.$refs.multipleTable.toggleRowSelection(del_row, false);
      }
      if (selection.length > 0) {
        // console.log(selection[0]);
        this.jmInfo = {
          residentId: selection[0].residentId,
          name: selection[0].name,
          idCard: selection[0].idCard,
          phone: selection[0].phone,
        }
      } else {
        this.jmInfo = {}
      }
    },
    // 选择人员全选
    selectAll(selection) {
      if (selection.length > 1) {
        selection.length = 1;
      }
      if (selection.length > 0) {
        this.jmInfo = {
          residentId: selection[0].residentId,
          name: selection[0].name,
          idCard: selection[0].idCard
        }
      } else {
        this.jmInfo = {}
      }
    },
    // 居民选择分页
    handleCurrentChange (val) {
      this.jmfilters.pageNum = val;
      this.getList()
    },
  }
};
</script>

<style scoped>
</style>