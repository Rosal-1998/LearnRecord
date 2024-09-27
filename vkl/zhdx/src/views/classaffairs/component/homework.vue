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
        <el-form-item label="" prop="name">
          <el-input v-model="studentFilter.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="" prop="studentNo">
          <el-input
            v-model="studentFilter.studentNo"
            placeholder="学号"
          ></el-input>
        </el-form-item>
        <el-form-item label="" prop="workTypeName">
          <el-input
            v-model="studentFilter.workTypeName"
            placeholder="作业类型"
          ></el-input>
        </el-form-item>
        <el-form-item label="" prop="uploadStatus">
          <el-select v-model="studentFilter.uploadStatus" placeholder="请选择">
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
          <span class="btn search-btn" @click="HomeworkList()">查询</span>
          <span
            class="btn reset-btn"
            @click="resetstudentFilter('studentFilter')"
            >重置</span
          >
        </div>
      </el-form>
    </div>
    <div class="btn-box">
      <span
        class="btn search-btn"
        @click="openWorkTypeManageDialog()"
        v-if="isEdit"
        >作业类型管理</span
      >
      <span class="btn reset-btn" @click="pushHomeworkByID()" v-if="isEdit"
        >催交</span
      >
			<span class="btn reset-btn" @click="pushBatchHomeworkByID()" v-if="isEdit"
        >一键催交</span
      >
      <span
        class="btn search-btn"
        @click="downloadBatchHomework()"
        v-if="isEdit"
        >批量下载作业</span
      >
      <span class="menu-report">作业类型：{{ homeworkCount.typeCount }}</span>
      <span class="menu-report">已上传：{{ homeworkCount.uploadCount }}份</span>
      <span class="menu-report"
        >未上传：{{ homeworkCount.noUploadCount }}份</span
      >
    </div>

    <div class="m-table">
      <el-table
        ref="multipleTable"
        :data="homeworkList"
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
          :selectable="selectStatu"
          type="selection"
        >
        </el-table-column>
        <el-table-column
          prop="studentNo"
          label="学号"
          width="70"
        ></el-table-column>
        <el-table-column prop="name" label="姓名"> </el-table-column>
        <el-table-column prop="workTypeName" label="作业类型">
        </el-table-column>
        <!-- <el-table-column prop="uploadStatus" label="作业上传情况"> </el-table-column> -->
        <el-table-column prop="" label="作业上传情况">
          <template slot-scope="scope">
            <el-tag :type="scope.row.uploadStatus == 1 ? 'success' : 'info'">{{
              scope.row.uploadStatus == 1 ? '已上传' : '未上传'
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="uploadTime" label="上传时间"> </el-table-column>
        <el-table-column prop="" label="操作">
          <template slot-scope="scope">
            <span
              class="edit-title"
              v-if="scope.row.uploadStatus == 1"
              @click="downloadHomework(scope.row.homeworkFiles)"
              >下载&nbsp;&nbsp;</span
            >
            <el-popover
              v-if="isEdit"
              :ref="scope.row.id"
              placement="top"
              popper-class="popover"
            >
              <p class="del-tip">是否删除该作业？</p>
              <div class="pop-btnbox">
                <span class="cancel-btn" @click="visibleGdCancel(scope.row.id)"
                  >取消</span
                >
                <span class="ok-btn" @click="deleteHomeworkByID(scope.row.id)"
                  >确定</span
                >
              </div>
              <span
                slot="reference"
                class="del-title"
                v-if="scope.row.uploadStatus == 1"
                >删除</span
              >
            </el-popover>
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
        :total="homeworkTotal"
      >
      </el-pagination>
      <i class="total">共有{{ homeworkTotal }}条数据</i>
    </div>

    <!-- 新增作业类型 -->
    <el-dialog
      :visible.sync="workTypeDialog"
      v-if="workTypeDialog"
      class="m-dialog"
      title="作业类型新增"
      :append-to-body="true"
    >
      <el-form
        :model="workTypeForm"
        :inline="true"
        ref="workTypeForm"
        :rules="workTypeFormRules"
        class="formbox"
      >
        <el-form-item label="作业类型" prop="typeName" style="width: 100%">
          <el-input
            v-model="workTypeForm.typeName"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="提交说明" prop="illustrate" style="width: 100%">
          <el-input
            v-model="workTypeForm.illustrate"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-foot">
        <span class="btn-cancel" @click="closeWorkTypeDialog">取消</span>
        <span class="btn-save" @click="handleSubmit">确定</span>
      </div>
    </el-dialog>

    <!-- 作业类型管理弹窗 -->
    <el-dialog
      :visible.sync="workTypeManageDialog"
      v-if="workTypeManageDialog"
      class="g-dialog min-dia642"
      title="作业详情"
      :append-to-body="true"
    >
      <div style="padding: 20px">
        <div class="m-search">
          <el-form
            :inline="true"
            :model="homeworkFilter"
            ref="homeworkFilter"
            id="homeworkFilter"
            class="search-form"
          >
            <el-form-item label="" prop="name">
              <el-input
                v-model="homeworkFilter.typeName"
                placeholder="作业类型名称"
              ></el-input>
            </el-form-item>
            <div class="search-btnbox">
              <span class="btn search-btn" @click="HomeworkTypeList()"
                >查询</span
              >
              <span class="btn reset-btn" @click="resetHomeworkTypeFilter()"
                >重置</span
              >
            </div>
          </el-form>
        </div>
        <div class="btn-box">
          <span class="btn search-btn" @click="openWorkTypeDialog()">新增</span>
        </div>

        <div class="m-table">
          <el-table
            :data="homeworkTypeList"
            highlight-current-row
            v-loading="listLoading"
            style="width: 100%"
            border
            :row-class-name="tableRowClassName"
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }"
          >
            <el-table-column
              type="index"
              label="序号"
              width="70"
            ></el-table-column>
            <el-table-column prop="typeName" label="作业类型名称">
            </el-table-column>
            <el-table-column prop="illustrate" label="提交说明">
            </el-table-column>
            <el-table-column prop="" label="操作">
              <template slot-scope="scope">
                <span
                  class="edit-title"
                  @click="openWorkTypeDialog(scope.row.homeworkTypeId, 'edit')"
                  >编辑&nbsp;&nbsp;</span
                >
                <el-popover
                  v-if="isEdit"
                  :ref="scope.row.homeworkTypeId"
                  placement="top"
                  popper-class="popover"
                >
                  <p class="del-tip">是否删除该作业类型？</p>
                  <div class="pop-btnbox">
                    <span
                      class="cancel-btn"
                      @click="visibleGdCancel(scope.row.homeworkTypeId)"
                      >取消</span
                    >
                    <span
                      class="ok-btn"
                      @click="deleteHomeworkTypeByID(scope.row.homeworkTypeId)"
                      >确定</span
                    >
                  </div>
                  <span slot="reference" class="del-title">删除</span>
                </el-popover>
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
            :total="homeworkTypeTotal"
          >
          </el-pagination>
          <i class="total">共有{{ homeworkTypeTotal }}条数据</i>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getHomeworkList,
  deleteHomework,
  getHomeworkTypeList,
  deleteHomeworkType,
  addHomeworkType,
  updateHomeworkType,
  homeworkTypeDetail,
  pushHomeWork,
  getHomeworkCount,
} from '../../../api/api.js'
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
      homeworkTotal: 0,
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
      workTypeDialog: false,
      workTypeManageDialog: false,
      workTypeForm: {
        homeworkTypeId: '',
        trainingPlanId: '',
        typeName: '',
        illustrate: '',
      },
      homeworkFilter: {
        typeName: '',
      },
      workTypeFormRules: {
        typeName: [
          {
            required: true,
            message: '请输入作业类型',
            trigger: 'blur',
          },
        ],
        illustrate: [
          {
            required: true,
            message: '请选择说明',
            trigger: 'blur',
          },
        ],
      },
      homeworkList: [],
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
      homeworkTypeList: [],
      homeworkTypeTotal: 0,
      selectedItems: [],
      homeworkCount: {
        typeCount: '',
        uploadCount: '',
        noUploadCount: '',
      },
    }
  },
  mounted() {
    this.HomeworkList()
    this.HomeworkCount()
  },
  methods: {
    /**
     * 作业管理
     * openWorkTypeManageDialog:打开作业类型管理弹窗
     * openWorkTypeDialog:打开新增-编辑作业类型弹窗
     * choiceSex:选择性别
     * updateStudent:新增-编辑学生信息
     * 勾选
     */
    // 批量下载作业
    downloadBatchHomework() {
      let ids = []
      for (let i = 0; i < this.homeworkList.length; i++) {
        if (this.homeworkList[i].uploadStatus == '1') {
          ids.push(this.homeworkList[i].homeworkFiles)
        }
      }
      if (ids.length > 0) {
        let selectID = ids.join(',')
        let url = '/system/oss/batchDownload/' + selectID
        this.comjs.downfile(url)
      } else {
        this.$message({
          message: '暂无可以下载的作业',
          type: 'fail',
        })
      }
    
    },

    // 查询作业类型列表
    HomeworkTypeList() {
      let para = {
        trainingPlanId: this.planId,
        typeName: this.homeworkFilter.typeName,
      }
      getHomeworkTypeList(para).then((res) => {
        console.log(res)
        this.homeworkTypeList = res.data.rows
        this.homeworkTypeTotal = res.data.total
      })
    },
    // 获取作业统计
    HomeworkCount() {
      console.log('----HomeworkCount----')
      let para = {
        trainingPlanId: this.planId,
      }
      getHomeworkCount(para).then((res) => {
        console.log(res)
        if (res.data.code == 200) {
          this.homeworkCount = res.data.data
        }
      })
    },
    // 查询作业列表
    HomeworkList() {
      let para = {
        trainingPlanId: this.planId,
        name: this.studentFilter.name,
        studentNo: this.studentFilter.studentNo,
        workTypeName: this.studentFilter.workTypeName,
        uploadStatus: this.studentFilter.uploadStatus,
        pageSize: this.studentFilter.size,
        pageNum: this.studentFilter.currentPage,
      }
      getHomeworkList(para).then((res) => {
        console.log(res)
        this.homeworkList = res.data.rows
        this.homeworkTotal = res.data.total
      })
    },
    // 重置
    resetstudentFilter() {
      this.studentFilter = {
        name: '',
        studentNo: '',
        workTypeName: '',
        uploadStatus: '',
        currentPage: 1,
        size: 10,
      }
      this.HomeworkList()
    },
    resetHomeworkTypeFilter() {
      this.homeworkFilter = {
        typeName: '',
      }
      this.HomeworkTypeList()
    },

    // 删除作业
    deleteHomeworkByID(id) {
      deleteHomework(id).then((res) => {
        if (res.code == '200') {
          this.$message({
            message: res.msg,
            type: 'success',
          })
          this.HomeworkList()
        } else {
          this.$message({
            message: res.msg,
            type: 'error',
          })
        }
      })
    },
    // 删除作业类型
    deleteHomeworkTypeByID(id) {
      deleteHomeworkType(id).then((res) => {
        if (res.code == '200') {
          this.$message({
            message: res.msg,
            type: 'success',
          })
          this.HomeworkTypeList()
        } else {
          this.$message({
            message: res.msg,
            type: 'error',
          })
        }
      })
    },
    // 新增作业类型
    handleSubmit() {
      this.$refs.workTypeForm.validate((valid) => {
        if (valid) {
          let para = {
            trainingPlanId: this.planId,
            homeworkTypeId: this.workTypeForm.homeworkTypeId,
            typeName: this.workTypeForm.typeName,
            illustrate: this.workTypeForm.illustrate,
          }
          // console.log('para',para)
          if (para.homeworkTypeId) {
            updateHomeworkType(para).then((res) => {
              if (res.code == '200') {
                this.$message({
                  message: res.msg,
                  type: 'success',
                })
                // this.$refs.addForm.resetFields()
                this.workTypeDialog = false
                this.HomeworkTypeList()
              } else {
                this.$message({
                  message: res.msg,
                  type: 'error',
                })
              }
            })
          } else {
            addHomeworkType(para).then((res) => {
              if (res.code == '200') {
                this.$message({
                  message: res.msg,
                  type: 'success',
                })
                // this.$refs.addForm.resetFields()
                // this.workTypeDialog = false
                this.closeWorkTypeDialog()
                this.HomeworkTypeList()
              } else {
                this.$message({
                  message: res.msg,
                  type: 'error',
                })
              }
            })
          }
        }
      })
    },
    // 取消新增作业类型
    closeWorkTypeDialog: function () {
      this.workTypeForm = {
        homeworkTypeId: '',
        trainingPlanId: '',
        typeName: '',
        illustrate: '',
      }
      this.workTypeDialog = false
    },

    // 勾选
    handleSelectionChange(selection) {
      console.log(selection)
      this.selectedItems = selection
    },
    // 催交作业
    pushHomeworkByID() {
      if (this.selectedItems.length == 0) {
        this.$message({
          message: '请选择要催交的作业',
          type: 'fail',
        })
      } else {
        let ids = []
        for (let i = 0; i < this.selectedItems.length; i++) {
          // console.log(this.selectedItems[i])
          let homework = {
            id: this.selectedItems[i].id,
            trainingPlanId: this.planId,
            workTypeName: this.selectedItems[i].workTypeName,
            userId: this.selectedItems[i].userId,
            homeworkTypeId: this.selectedItems[i].homeworkTypeId,
          }
          ids.push(homework)
        }

        pushHomeWork(ids).then((res) => {
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
		// 一键催交作业
		pushBatchHomeworkByID(){
			let ids = []
      for (let i = 0; i < this.homeworkList.length; i++) {
        if (this.homeworkList[i].uploadStatus == '0') {
          let homework = {
            id: this.homeworkList[i].id,
            trainingPlanId: this.planId,
            workTypeName: this.homeworkList[i].workTypeName,
            userId: this.homeworkList[i].userId,
            homeworkTypeId: this.homeworkList[i].homeworkTypeId,
          }
          ids.push(homework)
        }
      }
      if (ids.length > 0) {
        pushHomeWork(ids).then((res) => {
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
          message: '暂无可以催交的作业',
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
    // 筛选可选作业
    selectStatu(row) {
      return row.uploadStatus === '0'
    },
    // 下载作业
    downloadHomework(ossid) {
      let url = '/system/oss/download/' + ossid
      this.comjs.downfile(url)
    },
    // 打开作业类型管理弹窗
    openWorkTypeManageDialog() {
      this.workTypeManageDialog = true
      this.HomeworkTypeList()
    },
    // 获取作业类型详情
    getHomeworkTypeDetail(id) {
      homeworkTypeDetail(id).then((res) => {
        this.workTypeForm = res.data.data
      })
    },
    // 打开新增-编辑作业类型弹窗
    openWorkTypeDialog(id, type) {
      if (type == 'edit') {
        this.getHomeworkTypeDetail(id)
      }
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
      this.HomeworkList()
    },
    // 分页
    handleCurrentChange: function (val) {
      this.studentFilter.currentPage = val
      this.HomeworkList()
    },
  },
}
</script>
<style>
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
.menu-report {
  line-height: 40px;
  margin-left: 10px !important;
  font-size:18px !important;
}
</style>
