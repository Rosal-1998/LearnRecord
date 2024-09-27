<template>
  <div class="app-container">
    <div class="m-search">
      <el-form
        :inline="true"
        :model="Filter"
        ref="Filter"
        id="Filter"
        class="search-form"
      >
        <el-form-item label="" prop="date">
          <el-select
            @change="changeDate"
            v-model="selectDate"
            placeholder="用餐日期"
          >
            <el-option
              v-for="item in menuDate"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <div class="search-btnbox">
          <span class="btn search-btn" @click="updateMenuInfo(selectDate)"
            >查询</span
          >
          <span class="btn reset-btn" @click="resetFilter()">重置</span>
        </div>
      </el-form>
    </div>
    <div class="btn-box">
      <span class="btn reset-btn" @click="openTodayMenuDialog()">当日菜单</span>
      <span class="btn search-btn" @click="openAppraiseDialog()">用餐评价</span>
      <span class="menu-report">早餐：{{ menuReport.breakfastCount }}份</span>
      <span class="menu-report">午餐：{{ menuReport.lunchCount }}份</span>
      <span class="menu-report">晚餐：{{ menuReport.dinnerCount }}份</span>
    </div>

    <div class="m-table">
      <el-table
        :data="menuList"
        highlight-current-row
        v-loading="listLoading"
        style="width: 100%"
        border
        :row-class-name="tableRowClassName"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column
          prop="studentNo"
          label="学号"
          width="70"
        ></el-table-column>

        <el-table-column prop="studentName" label="姓名"> </el-table-column>
        <el-table-column prop="" label="早餐">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.hasBreakfast == true ? 'success' : 'info'"
              >{{ scope.row.hasBreakfast == true ? '已订' : '未订' }}</el-tag
            >
          </template>
        </el-table-column>

        <el-table-column prop="" label="午餐">
          <template slot-scope="scope">
            <el-tag :type="scope.row.hasLunch == true ? 'success' : 'info'">{{
              scope.row.hasLunch == true ? '已订' : '未订'
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="" label="晚餐">
          <template slot-scope="scope">
            <el-tag :type="scope.row.hasDinner == true ? 'success' : 'info'">{{
              scope.row.hasDinner == true ? '已订' : '未订'
            }}</el-tag>
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
        prev-text="上一页"
        next-text="下一页"
        :total="menuTotal"
      >
      </el-pagination>
      <i class="total">共有{{ menuTotal }}条数据</i>
    </div>

    <!-- 用餐评价 -->
    <el-dialog
      :visible.sync="appraiseDialog"
      v-if="appraiseDialog"
      class="g-dialog min-dia642"
      title="用餐评价"
      :append-to-body="true"
    >
      <div style="padding: 20px" class=" student-manege menu-eval">
        <el-row>
          <el-col class="menu-eval-col" :span="24">
            <h1>{{ menuEvalList.average }}分</h1>
            <span class="menu-eval-total"> 共{{ menuEvalList.total }}条 </span>
          </el-col>
        </el-row>
        <div
          class="menu-eval-list"
          v-for="item in menuEvalList.menuEvaluationVos"
        >
          <el-row>
            <el-col class="grid-content menu-eval-col" :span="12">
              <el-rate
                v-model="item.level"
                disabled
                show-score
                text-color="#ff9900"
                score-template=""
              >
              </el-rate>
            </el-col>
            <el-col  class="grid-content menu-eval-col menu-eval-time" :span="12"
              >{{ item.createTime }}
            </el-col>
          </el-row>
          <el-row>
            <el-col class="grid-content menu-eval-col" :span="24">
              {{ item.evaluate }}
            </el-col>
          </el-row>
        </div>
      </div>
    </el-dialog>
    <!-- 当日菜单 -->
    <el-dialog
      :visible.sync="todayMenuDialog"
      v-if="todayMenuDialog"
      class="g-dialog min-dia642"
      title="当日菜单"
      :append-to-body="true"
    >
      <div style="padding: 20px">
        <div class="arrange-cont">
          <div class="menu">
            <div class="menuTitle">早餐</div>
            <div class="food" v-for="item in breakfast">{{ item }}</div>
          </div>
          <div class="menu">
            <div class="menuTitle">午餐</div>
            <div class="food" v-for="item in lunch">{{ item }}</div>
          </div>
          <div class="menu">
            <div class="menuTitle">晚餐</div>
            <div class="food" v-for="item in dinner">{{ item }}</div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getMenuList,
  getMenuDateList,
  getMenuReportList,
  getMenuInfoList,
  getMenuEvalList,
} from '../../../api/api.js'
export default {
  props: {
    isShowReports: {
      type: Boolean,
      default: false,
    },
    isEdit:{
      type: Boolean,
      default: false,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    planId: {
      type: String,
      default: 0,
    },
  },
  data() {
    return {
      menuEvalTotal: 0,
      menuEvalList: [],
      breakfast: [],
      lunch: [],
      dinner: [],
      menuList: [],
      menuDate: [],
      selectDate: '',
      menuReport: {
        breakfastCount: 0,
        lunchCount: 0,
        dinnerCount: 0,
      },
      listLoading: false,
      menuTotal: 0,
      pagesize: 10,
      currentPage: 1,
      currentPage1: 1,
      reportList: [{ index: '0', name: '张三', status: '0' }],
      Filter: {
        date: '',
      },
      multion: [],
      todayMenuDialog: false,
      appraiseDialog: false,
      workTypeManageDialog: false,
      workTypeForm: {
        workType: '',
        submission: '',
      },
      workTypeFormRules: {},
      stopSubmit: true,
      // breakfast: ['豆浆', '油条'],
    }
  },
  mounted() {
    this.MenuDate()
    // this.MenuList()
  },
  methods: {
    /**
     * 用餐管理
     * openTodayMenuDialog:打开当日菜单弹窗
     * openWorkTypeDialog:打开新增-编辑作业类型弹窗
     * choiceSex:选择性别
     * updateStudent:新增-编辑学生信息
     * 勾选
     */
    // 查询报餐统计
    MenuReport(date) {
      // console.log(this.menuDate)
      let para = {
        trainingPlanId: this.planId,
        menuDate: date,
      }
      console.log('para', para)
      getMenuReportList(para).then((res) => {
        console.log('res', res)
        if (res.data.data[0]) {
          this.menuReport = res.data.data[0]
        }
      })
    },
    // 查询用餐列表
    MenuList(date) {
      // console.log(this.menuDate)
      let para = {
        trainingPlanId: this.planId,
        menuDate: date,
        pageSize:this.Filter.size,
        pageNum:this.Filter.current,
      }
      // console.log('para', para)
      getMenuList(para).then((res) => {
        // console.log(res)
        if(res.data.data != null){
          this.menuList = res.data.data
          this.menuTotal = res.data.data.length
        }
      
      })
    },
    updateMenuInfo(date) {
      this.MenuList(date)
      this.MenuReport(date)
    },
    // 获取用餐时间
    MenuDate() {
      let para = {
        trainingPlanId: this.planId,
      }
      getMenuDateList(para).then((res) => {
        // console.log(res)
        this.menuDate = String(res.data.data[0]).split(',')
        this.selectDate = this.menuDate[0]
        // console.log(String(this.menuDate[0]).split(','))
        this.MenuList(this.menuDate[0])
        this.MenuReport(this.menuDate[0])
      })
    },
    //打开当日菜单弹窗
    openTodayMenuDialog() {
      this.todayMenuDialog = true
      console.log(this.selectDate)
      let para = {
        trainingPlanId: this.planId,
        menuDate: this.selectDate,
      }
      // console.log('para', para)
      getMenuInfoList(para).then((res) => {
        console.log('菜单:', res)
        console.log('菜单:', res.data)
        if (res.data.data != null) {
          if (res.data.data.breakfast) {
            this.breakfast = res.data.data.breakfast.split(',')
          }
          if (res.data.data.lunch) {
            this.lunch = res.data.data.lunch.split(',')
          }
          if (res.data.data.dinner) {
            this.dinner = res.data.data.dinner.split(',')
          }
        }
      })
    },
    // 修改日期
    changeDate(date) {
      console.log(date)
      this.selectDate = date
    },
    // 打开教学评估汇总表弹窗
    openAppraiseDialog() {
      this.appraiseDialog = true
      let para = {
        trainingPlanId: this.planId,
        menuDate: this.selectDate,
      }
      // console.log('para', para)
      getMenuEvalList(para).then((res) => {
        this.menuEvalList = res.data.data
        this.menuEvalTotal = res.data.data
        // this.menuList = res.data.data
        // this.menuTotal = res.data.total
      })
    },
    // 重置
    resetFilter() {},

    // 勾选
    handleSelectionChange: function (data) {
      for (var i = 0; i < data.length; i++) {
        this.multion.push(data[i].id)
      }
    },
    // 打开作业类型管理弹窗
    openWorkTypeManageDialog() {
      this.workTypeManageDialog = true
    },
    // 打开新增-编辑作业类型弹窗
    openWorkTypeDialog() {
      this.workTypeDialog = true
    },
    //新增-编辑学生信息
    updateStudent() {
      // todo
      this.studentDialog = false
    },
    // 取消新增-编辑学生信息
    cancalUpdateStudent() {
      // todo
      this.studentDialog = false
    },
    // 隔行颜色
    tableRowClassName: function (rowIndex) {
      if (rowIndex.rowIndex % 2 != 0) {
        return 'evenRow'
      }
      return 'oddRow'
    },
    // 分页
    handleSizeChange: function (size) {
      this.pagesize = size
      this.Filter.size = size
      this.MenuList()
    },
    // 分页
    handleCurrentChange: function (val) {
      this.Filter.current = val
      this.MenuList(val)
    },
  },
}
</script>
<style>
.xq-whole .name {
  width: 296px !important;
}
.lab {
  width: calc(100% - 305px) !important;
}
.last {
  width: 296px !important;
}
.lastlab {
  width: calc(100% - 305px) !important;
}
.menu {
  width: 32%;
  height: auto;
  float: left;
  margin-left: 5px;

  /* background-color: rebeccapurple; */
}
.menuTitle {
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background-color: #bdbdbd;
  border: 1px solid #848484;
}
.food {
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border: 1px solid #848484;
  border-top: none;
}
.btn-box .menu-report {
  line-height: 40px;
  margin-left: 20px;
  font-size: 22px;
}
.menu-eval .menu-eval-col {
  border: none;
}
.menu-eval .menu-eval-col h1 {
  float: left;
}
.menu-eval .menu-eval-col .menu-eval-total {
  /* float: left; */
  margin-left: 10px;
  line-height: 50px;
}
.menu-eval-list {
  border-bottom: 1px solid #dcdcdc;
}
.el-rate__icon {
  font-size: 30px !important;
}

.menu-eval-time{
  text-align: right;
}
</style>
