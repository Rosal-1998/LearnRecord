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
        <el-form-item label="姓名" prop="name">
          <el-input v-model="filters.name" placeholder="输入姓名"></el-input>
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
            label="姓名"
            prop="name"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column label="年龄" prop="age"> </el-table-column>
          <el-table-column label="村居委职务" prop="post"> </el-table-column>
          <el-table-column label="妇联职务" prop="womenPost"> </el-table-column>
          <el-table-column label="兴趣爱好特长" prop="hobbies">
          </el-table-column>
          <el-table-column label="展示状态" prop="">
            <template slot-scope="scope">
              <span
                v-if="scope.row.showStatus === '1'"
                @click="handlestatus(scope.row, scope.$index, '0')"
              >
                隐藏&nbsp;<img
                  src="../../assets/img/status-gray.png"
                  class="status-img"
                />
              </span>
              <span v-else @click="handlestatus(scope.row, scope.$index, '1')">
                展示&nbsp;<img
                  src="../../assets/img/status-active.png"
                  class="status-img"
                />
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="">
            <template slot-scope="scope">
              <span
                class="edit-title"
                @click="handleEdit(scope.row)"
                >编辑&nbsp;&nbsp;</span
              >
              <el-popover
                :ref="scope.row.beautifulSisterId"
                placement="top"
                width="160"
                popper-class="popover"
              >
                <p class="del-tip">是否删除该动态？</p>
                <div class="pop-btnbox">
                  <span
                    class="cancel-btn"
                    @click="visibleDelCancel(scope.row.beautifulSisterId)"
                    >取消</span
                  >
                  <span
                    class="ok-btn"
                    @click="visibleDelSubmit(scope.row.beautifulSisterId)"
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
        <el-row>
          <el-col :span="24">
            <el-form-item label="姓名" prop="name" label-width="100px">
              <el-input
                v-model="addForm.name"
                placeholder="请输入姓名"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="序号" prop="sort" label-width="100px">
              <el-input
                v-model="addForm.sort"
                placeholder="请输入序号"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="展示状态"
              prop="showStatus"
              label-width="100px"
            >
              <el-radio-group v-model="addForm.showStatus">
                <el-radio label="0">展示</el-radio>
                <el-radio label="1">隐藏</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="年龄" prop="age" label-width="100px">
              <el-input
                v-model="addForm.age"
                placeholder="请输入年龄"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="村居委职务" prop="post" label-width="100px">
              <el-input
                v-model="addForm.post"
                placeholder="请输入村居委职务"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="妇联职务" prop="womenPost" label-width="100px">
              <el-input
                v-model="addForm.womenPost"
                placeholder="请输入妇联职务"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="兴趣爱好特长	"
              prop="hobbies"
              class="max-textarea"
              label-width="100px"
            >
              <el-input
                type="textarea"
                v-model="addForm.hobbies"
                placeholder="请输入兴趣爱好特长	"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
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
  addPrettySister,
  listPrettySister,
  statuPrettySister,
  getPrettySister,
  editPrettySister,
  delPrettySister,
} from "../../api/api.js";
export default {
  data() {
    return {
      filters: {
        name: "",
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
      diatitle: "新增",
      addForm: {},
      addFormRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        showStatus: [
          { required: true, message: "请选择展示状态", trigger: "change" },
        ],
      },
      editflag: false,
    };
  },
  mounted() {
    this.initForm();
    this.getlist();
  },
  methods: {
    // 初始化表单
    initForm() {
      this.addForm = {
        name: "",
        sort: "",
        showStatus: "0",
        age: "",
        post: "",
        womenPost: "",
        hobbies: "",
      };
    },
    // 单行变色
    tableRowClassName: function (rowIndex) {
      if (rowIndex.rowIndex % 2 != 0) {
        return "evenRow";
      }
      return "oddRow";
    },
    // 列表
    getlist: function () {
      listPrettySister(this.filters).then((res) => {
        this.datalist = res.rows;
        this.total = res.total;
        // console.log(typeof(res.rows[0].beautifulSisterId))
      });
    },
    // 重置
    resetForm: function (filters) {
      this.$refs.filters.resetFields();
      this.filters = {
        name: "", // 姓名
        pageSize: 10,
        pageNum: 1,
      };
      this.getlist(1);
    },
    // 分页
    handleSizeChange: function (size) {
      this.pagesize = size;
      this.filters.pageSize = size;
      this.getlist("");
    },
    // 分页
    handleCurrentChange: function (val) {
      this.filters.pageNum = val;
      this.getlist(val);
    },
    // 切换状态
    handlestatus: function (row, index, type) {
      const id = row.beautifulSisterId;
      statuPrettySister(id).then((res) => {
        if (res.code == 200) {
          this.$message({
            message: "状态修改成功",
            type: "success",
          });
          this.datalist[index].showStatus = type;
        }
      });
    },
    // 删除取消
    visibleDelCancel(id) {
      // 取消
      this.$refs[id].doClose();
    },
    // 删除确认
    visibleDelSubmit(id) {
      // 确定
      delPrettySister(id).then((res) => {
        console.log(res);
        if (res.code == "200") {
          this.$message({
            message: res.msg,
            type: "success",
          });
          this.$refs[id].doClose();
          this.getlist();
        } else {
          this.$message({
            message: res.data.msg,
            type: "error",
          });
        }
      });
    },
    // 新增
    handleAdd: function () {
      this.adddialog = true;
      this.diatitle = "添加";
      this.initForm();
      this.editflag = false;
      this.filelist = [];
    },

    // 编辑
    handleEdit: function (row) {
      this.adddialog = true;
      this.diatitle = "编辑";
      this.getDetail(row.beautifulSisterId);
      this.editflag = true;
    },
    // 详情
    getDetail(id) {
      getPrettySister(id).then((res) => {
        this.addForm = res.data;
      });
    },

    // 取消
    handlecancel: function () {
      this.$refs.addForm.resetFields();
      this.initForm();
      this.adddialog = false;
    },
    // 保存
    handleSubmit: function () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          if (!this.addForm.beautifulSisterId) {
            addPrettySister(this.addForm).then((res) => {
              if (res.code == "200") {
                this.$message({
                  message: "添加成功",
                  type: "success",
                });
                this.adddialog = false;
                this.getlist();
              } else {
                this.$message({
                  message: res.msg,
                  type: "error",
                });
              }
            });
          } else {
            editPrettySister(this.addForm).then((res) => {
              if (res.code == "200") {
                this.$message({
                  message: "修改成功",
                  type: "success",
                });
                this.adddialog = false;
                this.getlist();
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
  },
};
</script>

<style>
</style>