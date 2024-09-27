<template>
  <div class="g-cont">
    <div class="top-count">
      <div class="count-card" v-for="item in topList" :key="item.type">
        <div class="card-left">{{item.type}}</div>
        <div class="card-right">
          <span>总面积：<span class="num-style">{{item.area}}m²</span></span>
        </div>
      </div>
    </div>
    <div class="m-contain">
      <div class="m-search">
        <el-form :model="filters" :inline="true" ref="filters">
          <el-form-item label="所属部门">
            <el-input
              v-model="filters.department"
              placeholder="所属部门"
            ></el-input>
          </el-form-item>
          <el-form-item label="区域">
            <el-input
              v-model="filters.region"
              placeholder="区域"
            ></el-input>
          </el-form-item>
          <el-form-item label="面积" prop="" class="mj">
            <el-input
              type="number"
              v-model="filters.area"
              placeholder="最小"
            ></el-input
            >至<el-input
              type="number"
              v-model="filters.bigArea"
              placeholder="最大"
            ></el-input>
          </el-form-item>
          <div class="search-btnbox">
            <span class="btn search-btn" @click="getlist(1)">查询</span>
            <span class="btn reset-btn" @click="resetForm('filters')"
              >重置</span
            >
          </div>
        </el-form>
      </div>
      <div class="m-table">
        <el-table
          :data="datalist"
          highlight-current-row
          v-loading="listLoading"
          style="width: 100%"
          border
          :row-class-name="tableRowClassName"
          :header-cell-style="{ 'text-align': 'center' }"
          :cell-style="{ 'text-align': 'center' }"
        >
          <el-table-column label="编号" prop="woodlandId" width="200"></el-table-column>
          <el-table-column label="类型" prop="type"></el-table-column>
          <el-table-column label="面积" prop="area"></el-table-column>
          <el-table-column label="区属" prop="districtAffiliation"> </el-table-column>
          <el-table-column label="街道镇" prop="streetTown"> </el-table-column>
          <el-table-column label="所属部门" prop="department">
          </el-table-column>
          <el-table-column label="区域" prop="region" width="200"> </el-table-column>
          <el-table-column label="备注" width="300">
            <template slot-scope="scope">
              <span class="two-line">{{scope.row.remarks}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="m-pagination">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pagesize"
          layout="prev, pager, next"
          :current-page.sync="currentPage1"
          prev-text="上一页"
          next-text="下一页"
          :total="total"
        >
        </el-pagination>
        <i class="total">共有{{ total }}条数据</i>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getForestList,
  getForestTJ
} from '../../api/api.js'
export default {
  data() {
    return {
      topList: [],
      filters: {
        department: "",
        region: "",
        area: "",
        bigArea: "",
        pageSize: 10,
        pageNum: 1,
      },
      datalist: [],
      listLoading: false,
      total: 0,
      currentPage: 1,
      currentPage1: 1,
      pagesize: 10,
      
    };
  },
  mounted() {
    this.getlist();
    getForestTJ().then(res => {
      if (res.code == 200) {
        res.data.forEach(item => {
          item.area = Number(item.area).toFixed(2)
        })
        this.topList = res.data
      }
    })
  },
  methods: {
    // 单行变色
    tableRowClassName: function (rowIndex) {
      if (rowIndex.rowIndex % 2 != 0) {
        return "evenRow";
      }
      return "oddRow";
    },
    // 列表
    getlist: function () {
      getForestList(this.filters).then((res) => {
        res.rows.forEach(res => {
          res.area = Number(res.area).toFixed(2) + 'm²'
        })
        this.datalist = res.rows;
        this.total = res.total;
      });
    },
    // 重置
    resetForm: function (filters) {
      this.$refs.filters.resetFields();
      this.filters = {
        department: "",
        region: "",
        area: "",
        bigArea: "",
        pageSize: 10,
        pageNum: 1,
      };
      this.getlist();
    },
    // 分页
    handleSizeChange: function (size) {
      this.pagesize = size;
      this.filters.pageSize = size;
      this.getlist();
    },
    // 分页
    handleCurrentChange: function (val) {
      this.filters.pageNum = val;
      this.getlist();
    },
  },
};
</script>

<style scoped>
.g-cont {
  display: flex;
  flex-direction: column;
}
.top-count {
  width: 100%;
  height: 95px;
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
}
.count-card {
  flex-shrink: 0;
  display: inline-block;
  width: 225px;
  height: 80px;
  background: url('../../assets/img/road-bg1.png');
  background-size: 100% 100%;
  display: flex;
  padding: 15px 0;
  box-sizing: border-box;
}
.count-card>.card-left {
  width: 80px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-weight: bold;
  border-right: 2px dotted#CCCCCC;
}
.count-card>.card-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 12px;
  gap: 4px;
  padding-left: 12px;
}
.num-style {
  font-family: Microsoft YaHei UI, Microsoft YaHei UI;
  font-weight: bold;
  font-size: 16px;
  color: #1396C7;
}
</style>