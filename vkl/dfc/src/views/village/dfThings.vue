<template>
  <div class="g-cont">
    <div class="m-contain">
      <el-form
        :model="filters"
        :inline="true"
        ref="filters"
        class="m-search"
        style="float: left"
      >
        <el-form-item label="展示状态" prop="showStatus">
          <el-select v-model="filters.showStatus" placeholder="展示状态">
            <el-option value="0" label="展示"></el-option>
            <el-option value="1" label="隐藏"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="filters.title" placeholder="输入标题"></el-input>
        </el-form-item>
        <el-form-item label="发布日期">
          <el-date-picker
            v-model="dateArea"
            type="daterange"
            start-placeholder="年-月-日"
            end-placeholder="年-月-日"
            range-separator="至"
          ></el-date-picker>
        </el-form-item>
        <div class="search-btnbox">
          <span class="btn search-btn" @click="getlist(1)">查询</span>
          <span class="btn reset-btn" @click="resetForm('filters')">重置</span>
        </div>
      </el-form>
      <div class="operate-btn">
        <span class="btn add-btn" @click="handleAdd">新增</span>
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
          <el-table-column
            label="序号"
            prop="sort"
            width="80"
          ></el-table-column>
          <el-table-column
            label="标题"
            prop="title"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column label="展示状态" prop="">
            <template slot-scope="scope">
              <span
                v-if="scope.row.showStatus == '0'"
                @click="handlestatus(scope.row, '1')"
              >
                展示&nbsp;<img
                  src="../../assets/img/status-active.png"
                  class="status-img"
                />
              </span>
              <span v-else @click="handlestatus(scope.row, '0')">
                隐藏&nbsp;<img
                  src="../../assets/img/status-gray.png"
                  class="status-img"
                />
              </span>
              <span v-else> / </span>
            </template>
          </el-table-column>
          <el-table-column label="发布人" prop="createBy"></el-table-column>
          <el-table-column label="发布时间" prop="releaseTime"></el-table-column>
          <el-table-column label="操作" prop="">
            <template slot-scope="scope">
              <span class="edit-title" @click="handleEdit(scope.row)"
                >编辑&nbsp;&nbsp;</span
              >
              <el-popover
                :ref="scope.row.memoirsId"
                placement="top"
                width="160"
                popper-class="popover"
              >
                <p class="del-tip">是否删除该动态？</p>
                <div class="pop-btnbox">
                  <span
                    class="cancel-btn"
                    @click="visibleDelCancel(scope.row.memoirsId)"
                    >取消</span
                  >
                  <span
                    class="ok-btn"
                    @click="visibleDelSubmit(scope.row.memoirsId)"
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
          :current-page.sync="currentPage1"
          prev-text="< 上一页"
          next-text="下一页 >"
          :total="total"
        >
        </el-pagination>
        <i class="total">共有{{ total }}条数据</i>
      </div>
    </div>
    <!-- 新增、编辑 -->
    <el-dialog
      :visible.sync="adddialog"
      v-if="adddialog"
      class="g-dialog"
      :title="diatitle"
    >
      <span class="tip">基础信息</span>
      <el-form
        :model="addForm"
        :inline="true"
        ref="addForm"
        :rules="addFormRules"
        class="addform"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="addForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="序号" prop="sort">
          <el-input v-model="addForm.sort" placeholder="请输入序号"></el-input>
        </el-form-item>
        <i style="display: block; width: 100%; float: left"></i>
        <el-form-item label="展示状态" prop="">
          <div
            class="radio-lst"
            v-if="addForm.showStatus == '0'"
            @click="handlestatus(false, '1')"
          >
            <img src="../../assets/img/status-active.png" class="status-img" />
            展示
          </div>
          <div v-else class="radio-lst" @click="handlestatus(false, '0')">
            <img src="../../assets/img/status-gray.png" class="status-img" />
            隐藏
          </div>
        </el-form-item>
        <el-form-item label="发布时间" prop="" style="width: 100%;" >
					<el-date-picker v-model="addForm.releaseTime"  type="datetime"  placeholder="选择日期时间"></el-date-picker>
				</el-form-item>
        <el-form-item label="内容" prop="" style="width: 100%">
          <quill-editor
            ref="mwQuillEditor"
            v-model="addForm.content"
            class="bjq-tool ql-editors"
          />
        </el-form-item>
      </el-form>
      <div class="dialog-foot">
        <span class="btn-cancel" @click="handlecancel">取消</span>
        <span class="btn-save" @click="handleSubmit">保存</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDThingsList,
  addDThingsList,
  editDThingsList,
  getDThings,
  delDThings,
  statuDThings
} from "../../api/api.js";
import { quillEditor, Quill } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import moment from "moment";
export default {
  components: {
    quillEditor,
  },
  data() {
    return {
      dateArea: [],
      filters: {
        memoirsType: 1,
        title: "", //新闻标题
        showStatus: "", //展示状态 显示:0 隐藏:1
        beginTime: "", //开始时间
        endTime: "", //结束时间
        pageSize: 10,
        pageNum: 1,
      },
      datalist: [],
      listLoading: false,
      total: 0,
      currentPage: 1,
      currentPage1: 1,
      pagesize: 10,
      adddialog: false,
      diatitle: "",
      addForm: {},
      addFormRules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
      },
      editflag: false,
    };
  },
  mounted() {
    this.getlist("");
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
    getlist: function (val) {
      if (this.dateArea && this.dateArea.length > 0) {
        this.filters.beginTime = moment(this.dateArea[0]).format("yyyy-MM-DD");
        this.filters.endTime = moment(this.dateArea[1]).format("yyyy-MM-DD");
      } else {
        this.filters.beginTime = "";
        this.filters.endTime = "";
      }
      if (val) {
        this.filters.pageNum = val;
        this.currentPage1 = val;
      }
      getDThingsList(this.filters).then((res) => {
        this.datalist = res.rows;
        this.total = res.total;
      });
    },
    // 重置
    resetForm: function (filters) {
      this.$refs.filters.resetFields();
      this.filters = {
        memoirsType: 1,
        title: "", //新闻标题
        showStatus: "", //展示状态 显示:0 隐藏:1
        beginTime: "", //开始时间
        endTime: "", //结束时间
        pageSize: 10,
        pageNum: 1,
      }
      this.dateArea = []
      this.getlist(1);
    },
    // 分页
    handleSizeChange: function (size) {
      this.pagesize = size;
      this.filters.size = size;
      this.getlist("");
    },
    // 分页
    handleCurrentChange: function (val) {
      this.filters.current = val;
      this.getlist(val);
    },
    // 切换状态
    handlestatus: function (row, type) {
      if (!row) {
        this.addForm.showStatus = type;
      } else {
        statuDThings(row.memoirsId).then((res) => {
          if (res.code == 200) {
            this.$message({
              message: res.msg,
              type: "success",
            });
            this.getlist("");
          }
        });
      }
    },
    // 删除取消
    visibleDelCancel(id) {
      // 取消
      this.$refs[id].doClose();
    },
    // 删除确认
    visibleDelSubmit(id) {
      // 确定
      delDThings(id).then((res) => {
        if (res.code == "200") {
          this.$message({
            message: res.msg,
            type: "success",
          });
          this.$refs[id].doClose();
          this.getlist(1);
        } else {
          this.$message({
            message: res.msg,
            type: "error",
          });
        }
      });
    },
    // 新增
    handleAdd: function () {
      this.adddialog = true;
      this.diatitle = "东风大事记添加";
      this.initAddform();
      this.editflag = false;
    },
    // 编辑
    handleEdit: function (row) {
      this.adddialog = true;
      this.diatitle = "东风大事记编辑";
      this.getDetail(row.memoirsId);
      this.editflag = true;
    },
    // 详情
    getDetail: function (id) {
      getDThings(id).then((res) => {
        this.addForm = res.data;
      });
    },
    // 取消
    handlecancel: function () {
      this.$refs.addForm.resetFields();
      this.initAddform();
      this.adddialog = false;
    },
    // 保存
    handleSubmit: function () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          let para = {
            title: this.addForm.title,
            sort: this.addForm.sort,
            showStatus: this.addForm.showStatus,
            content: this.addForm.content,
            memoirsType: 1,
            releaseTime:moment(this.addForm.releaseTime).format('yyyy-MM-DD HH:mm:ss')
          };
          if (this.addForm.memoirsId) {
            para.memoirsId = this.addForm.memoirsId;
            editDThingsList(para).then((res) => {
              if (res.code == "200") {
                this.$message({
                  message: "编辑成功",
                  type: "success",
                });
                this.$refs.addForm.resetFields();
                this.adddialog = false;
                this.getlist(1);
              } else {
                this.$message({
                  message: res.msg,
                  type: "error",
                });
              }
            });
          } else {
            addDThingsList(para).then((res) => {
              if (res.code == "200") {
                this.$message({
                  message: "添加成功",
                  type: "success",
                });
                this.$refs.addForm.resetFields();
                this.adddialog = false;
                this.getlist(1);
              } else {
                this.$message({
                  message: res.msg,
                  type: "error",
                });
              }
            });
          }
        }
      });
    },
    initAddform() {
      this.addForm = {
        title: "",
        sort: "",
        showStatus: 0,
        memoirsType: 1,
        content: "",
      };
    },
  },
};
</script>

<style>
</style>