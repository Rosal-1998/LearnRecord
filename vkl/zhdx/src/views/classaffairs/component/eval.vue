<template>
  <div class="app-container">
    <div class="m-search-short">
      <el-form
        :inline="true"
        :model="studentFilter"
        ref="studentFilter"
        id="studentFilter"
        class="search-form"
      >
        <el-form-item label="" prop="teacher">
          <el-input
            v-model="studentFilter.teacher"
            placeholder="授课老师"
          ></el-input>
        </el-form-item>
        <el-form-item label="" prop="courseName">
          <el-input
            v-model="studentFilter.courseName"
            placeholder="课程名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="" prop="name">
          <el-input v-model="studentFilter.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="" prop="status">
          <el-select v-model="studentFilter.status" placeholder="提交状态">
            <el-option
              v-for="item in uploadOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <div class="search-btnbox">
          <span class="btn search-btn" @click="EvalList()">查询</span>
          <span
            class="btn reset-btn"
            @click="resetstudentFilter('studentFilter')"
            >重置</span
          >
        </div>
      </el-form>
    </div>
    <div class="btn-box">
      <span class="btn reset-btn" @click="pushEvalByID()" v-if="isEdit"
        >催交</span
      >
      <span class="btn search-btn" @click="openEvalAllDetailDialog()"
        >教学评估汇总表</span
      >
      <span class="btn reset-btn" @click="pushBatchEvalByID()" v-if="isEdit"
        >一键催交</span
      >
    </div>

    <div class="m-table">
      <el-table
        ref="multipleTable"
        :data="evalList"
        highlight-current-row
        v-loading="listLoading"
        style="width: 100%"
        border
        :row-class-name="tableRowClassName"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          label="全选"
          type="selection"
          :selectable="selectStatu"
        >
        </el-table-column>
        <el-table-column
          prop="studentNo"
          label="学号"
          width="70"
        ></el-table-column>
        <el-table-column prop="teacher" label="授课老师"> </el-table-column>
        <el-table-column prop="courseName" label="课程名称"> </el-table-column>
        <el-table-column prop="name" label="姓名"> </el-table-column>
        <el-table-column prop="" label="提交状态">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status == '1' ? 'success' : 'info'">{{
              scope.row.status == '1' ? '已上传' : '未上传'
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="submissionTime" label="提交时间" width="200">
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
        :total="evalTotal"
      >
      </el-pagination>
      <i class="total">共有{{ evalTotal }}条数据</i>
    </div>
    <!-- 教学评估详情 -->
    <el-dialog
      :visible.sync="evalDetailDialog"
      v-if="evalDetailDialog"
      class="m-dialog"
      title="教学评估详情"
    >
      <div style="padding: 20px">
        <div class="arrange-cont">
          <div class="xq-content">
            <div class="xq-whole">
              <span class="name">授课老师</span>
              <span class="lab">2024青年干部培训班</span>
            </div>
            <div class="xq-whole">
              <span class="name">课程名称</span>
              <span class="lab">2024青年干部培训班</span>
            </div>
            <div class="xq-whole">
              <span class="name">学员姓名</span>
              <span class="lab">2024青年干部培训班</span>
            </div>
            <div class="xq-whole">
              <span class="name">评估时间</span>
              <span class="lab">2024青年干部培训班</span>
            </div>
            <div class="xq-whole">
              <span class="name">评分</span>
              <span class="lab">2024青年干部培训班</span>
            </div>
            <div class="xq-whole">
              <span class="last">备注</span>
              <span class="lastlab">123123</span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 教学评估汇总表 -->
    <el-dialog
      :visible.sync="evalAllDetailDialog"
      v-if="evalAllDetailDialog"
      class="g-dialog min-dia642"
      title="教学评估汇总表"
      :append-to-body="true"
    >
      <div style="padding: 20px">
        <div class="arrange-cont">
          <div class="xq-content">
            <el-row>
              <el-col :span="4">
                <div class="grid-content floatR bg-red">
                  <span class="red-star">*</span>培训名称：
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content bg-red pdd5">
                  {{ evalSummaryList.trainName }}
                </div>
              </el-col>
              <el-col :span="4">
                <div class="grid-content floatR bg-red">
                  <span class="red-star">*</span>培训时间：
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content bg-red pdd5">
                  {{ evalSummaryList.trainDate }}
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                <div class="grid-content center bg-purple">授课老师</div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content center bg-purple-light">课程名称</div>
              </el-col>
              <el-col :span="4">
                <div class="grid-content center bg-purple">得分</div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content center bg-purple-light pdd5">
                  意见结果
                </div>
              </el-col>
            </el-row>
            <div
              v-for="(item, index) in evalSummaryList.bwCourseVoList"
              :key="index"
            >
              <el-row>
                <el-col :span="4">
                  <div class="grid-content center bg-purple" style="">
                    {{ item.teacher }}
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="grid-content center bg-purple-light">
                    {{ item.courseName }}
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content center bg-purple" style="">
                    {{ item.score }}
                  </div>
                </el-col>
                <el-col :span="8">
                  <div
                    class="grid-content bg-purple-light"
                    style="text-align: center; overflow-y: scroll; height: 36px"
                  >
                    <i
                      v-for="(item1, index1) in item.contentList"
                      :key="index1"
                    >
                      {{ index1 + 1 }}.{{ item1 }}
                    </i>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </div>
      <div class="dialog-foot">
				
				<span class="btn-download" @click="downloadEval">下载</span>
			</div>
    </el-dialog>
  </div>
</template>

<script>
import { getEvalList, pushEval, getEvalSummaryList } from '../../../api/api.js'
export default {
  props: {
    isShowReports: {
      type: Boolean,
      default: false,
    },
    isEdit: {
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
      listLoading: false,
      evalList: [],
      evalTotal: 0,
      pagesize: 10,
      currentPage: 1,
      currentPage1: 1,
      reportList: [
        {
          index: '0',
          name: '张三',
          status: '0',
        },
      ],
      studentFilter: {
        name: '',
        studentID: '',
        duties: '',
        currentPage: 1,
        size: 10,
      },
      multion: [],
      evalDetailDialog: false,
      evalAllDetailDialog: false,
      workTypeManageDialog: false,
      workTypeForm: {
        workType: '',
        submission: '',
      },
      workTypeFormRules: {},
      uploadOptions: [
        {
          value: '0',
          label: '未上传',
        },
        {
          value: '1',
          label: '已上传',
        },
      ],
      selectedItems: [],
      evalSummaryList: [],
    }
  },
  mounted() {
    this.EvalList()
  },
  methods: {
    /**
     * 教学评估管理
     * openEvalDetailDialog:打开查看学生评估结果详情弹窗
     * openWorkTypeDialog:打开新增-编辑作业类型弹窗
     * choiceSex:选择性别
     * updateStudent:新增-编辑学生信息
     * 勾选
     */


     // 下载评估表
     downloadEval(){

				let url =
					'/bw/evaluation/summaryListExport?trainingPlanId=' +
					this.planId
				this.downloadQR.downfile(url)
     },
    // 查询评估列表
    EvalList() {
      let para = {
        trainingPlanId: this.planId,
        // typeName: this.homeworkFilter.typeName,
        courseName: this.studentFilter.courseName,
        teacher: this.studentFilter.teacher,
        name: this.studentFilter.name,
        status: this.studentFilter.status,
        pageSize: this.studentFilter.size,
        pageNum: this.studentFilter.currentPage,
      }
      getEvalList(para).then((res) => {
        console.log(res)
        this.evalList = res.data.rows
        this.evalTotal = res.data.total
      })
    },
    // 重置
    resetstudentFilter() {
      this.studentFilter = {
        teacher: '',
        name: '',
        status: '',
        courseName: '',
        currentPage: 1,
        size: 10,
      }
      this.EvalList()
    },
    // 筛选催缴人员
    selectStatu(row) {
      return row.status === '0'
    },
    // 勾选
    handleSelectionChange(selection) {
      console.log(selection)
      this.selectedItems = selection
    },
    // 催交评估
    pushEvalByID() {
      if (this.selectedItems.length == 0) {
        this.$message({
          message: '请选择要催交的人员',
          type: 'fail',
        })
      } else {
        let ids = []
        for (let i = 0; i < this.selectedItems.length; i++) {
          let homework = {
            userId: this.selectedItems[i].userId,
            trainingPlanId: this.planId,
            courseId: this.selectedItems[i].courseId,
          }
          ids.push(homework)
        }

        pushEval(ids).then((res) => {
          if (res.code == '200') {
            this.$message({
              message: res.msg,
              type: 'success',
            })
            this.toggleSelection()
          } else {
            this.$message({
              message: res.msg,
              type: 'error',
            })
            this.toggleSelection()
          }
        })
      }
    },
    // 一键催交
    pushBatchEvalByID() {
      let ids = []
      for (let i = 0; i < this.evalList.length; i++) {
        if (this.evalList[i].status == '0') {
          let homework = {
            userId: this.evalList[i].userId,
            trainingPlanId: this.planId,
            courseId: this.evalList[i].courseId,
          }
          ids.push(homework)
        }
      }
      if (ids.length > 0) {
        pushEval(ids).then((res) => {
          if (res.code == '200') {
            this.$message({
              message: res.msg,
              type: 'success',
            })
            this.toggleSelection()
          } else {
            this.$message({
              message: res.msg,
              type: 'error',
            })
            this.toggleSelection()
          }
        })
      } else {
        this.$message({
          message: '暂无可以催交的人员',
          type: 'fail',
        })
      }
    },
    //取消全选
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    //打开查看学生评估结果详情弹窗
    openEvalDetailDialog() {
      this.evalDetailDialog = true
    },
    // 打开教学评估汇总表弹窗
    openEvalAllDetailDialog() {
      this.evalAllDetailDialog = true
      let para = {
        trainingPlanId: this.planId,
      }
      getEvalSummaryList(para).then((res) => {
        this.evalSummaryList = res.data.data
        console.log(this.evalSummaryList)
      })
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
      this.pageSize = size
      this.studentFilter.size = size

      this.EvalList()
    },
    // 分页
    handleCurrentChange: function (val) {
      this.studentFilter.currentPage = val

      this.EvalList()
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
.m-search-short {
  width: 100%;
  height: 60px;
  /* background-color: red; */
  display: inline-block;
  /* float: right; */
  margin-bottom: 10px;
  border-bottom: 1px solid #e8e8e8;
}

.m-search-short .el-form-item {
  margin-bottom: 16px;
}

.m-search-short .el-form-item__content {
  width: auto;
}
.m-search-short .el-input {
  width: 150px !important;
}
.m-search-short .el-input .el-input__inner {
  width: 150px;
  border-radius: 0;
}
</style>
