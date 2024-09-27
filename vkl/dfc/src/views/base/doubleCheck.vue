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
        <el-form-item label="所属党组织" prop="organizationId">
          <el-input
            v-model="filters.partyBranchName"
            placeholder="输入党组织名称"
          ></el-input>
        </el-form-item>
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
          <el-table-column label="性别">
            <template slot-scope="scope">
              <span v-if="scope.row.sex == 1">男</span>
              <span v-else>女</span>
            </template>
          </el-table-column>
          <el-table-column label="年龄" prop="age"> </el-table-column>
          <el-table-column label="手机号码" prop="phone"> </el-table-column>
          <el-table-column label="居住地址" prop="address" width="200">
          </el-table-column>
          <el-table-column
            label="工作单位"
            prop="workUnit"
            width="200"
          ></el-table-column>
          <el-table-column
            label="所属党组织"
            prop="partyBranchName"
            width="240"
          ></el-table-column>
          <el-table-column label="操作" prop="">
            <template slot-scope="scope">
              <span class="edit-title" @click="handleEdit(scope.row)"
                >编辑&nbsp;&nbsp;</span
              >
              <el-popover
                :ref="scope.row.id"
                placement="top"
                width="160"
                popper-class="popover"
              >
                <p class="del-tip">是否删除该动态？</p>
                <div class="pop-btnbox">
                  <span
                    class="cancel-btn"
                    @click="visibleDelCancel(scope.row.id)"
                    >取消</span
                  >
                  <span class="ok-btn" @click="visibleDelSubmit(scope.row.id)"
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
            <el-form-item
              label="所属党组织"
              prop="partyBranchName"
              label-width="100px"
            >
              <el-input
                v-model="addForm.partyBranchName"
                placeholder="请输入所属党组织"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="  " prop="" label-width="100px">
              <span class="gl-btn" @click="handleChooseRs">选择居民</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="姓名" prop="name" label-width="100px">
              <el-input
                disabled
                v-model="addForm.name"
                placeholder="请输入选择居民"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="身份证号" prop="idCard" label-width="100px">
              <el-input
                disabled
                v-model="addForm.idCard"
                placeholder="请输入选择居民"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="序号" prop="sort" label-width="100px">
              <el-input
                v-model="addForm.sort"
                type="number"
                placeholder="请输入序号"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="手机号码" prop="phone" label-width="100px">
              <el-input
                v-model="addForm.phone"
                placeholder="请输入手机号码"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="性别" prop="sex" label-width="100px">
              <el-radio-group v-model="addForm.sex">
                <el-radio label="1">男</el-radio>
                <el-radio label="0">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="出生年月" label-width="100px" prop="birthDate">
              <el-date-picker
                v-model="addForm.birthDate"
                type="month"
                value-format="yyyy-MM"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="居住地址" prop="address" label-width="100px">
              <el-input
                v-model="addForm.address"
                placeholder="请输入居住地址"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="工作单位" prop="workUnit" label-width="100px">
              <el-input
                v-model="addForm.workUnit"
                placeholder="请输入工作单位"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="照片1"
              prop=""
              class="delbgimg"
              label-width="100px">
              <div
                class="upimgbox"
                :style="{
                  backgroundImage: addForm.photoUrl?'url(' + addForm.photoUrl + ')' :'url(' + emptyPhoto + ')' ,
                }"
              >
                <input
                  ref="file"
                  type="file"
                  class="file"
                  @change="choosefile($event)"
                />
              </div>
              <i class="del-tip1" v-if="addForm.photo" @click="handlesyimg"
                >删除</i
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="dialog-foot">
        <span class="btn-cancel" @click="handlecancel">取消</span>
        <span class="btn-save" @click="handleSubmit">保存</span>
      </div>
    </el-dialog>

    <!-- 租赁人-居民选择 -->
    <add-resident
      :jmdialog="jmdialog"
      @handleCloseAdd="handleCloseAdd"
      @handleAddResident="handleAddResident"
    />
  </div>
</template>

<script>
import {
  basicOrganizationList,
  DoubleCheckList,
  addDoubleCheck,
  editDoubleCheck,
  getDoubleCheck,
  delDoubleCheck,
} from "../../api/api.js";
import axios from "axios";
import AddResident from "./rhouse/addResident.vue";
export default {
  data() {
    return {
      organizationList: [], // 党组织列表
      filters: {
        partyBranch: "",
        name: "",
        pageSize: 10,
        pageNum: 1,
        partyBranchName: "",
      },
      emptyPhoto:require("@/assets/img/empty.png"),
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
        name: [{ required: true, message: "请选择居民", trigger: "blur" }],
        idCard: [{ required: true, message: "请选择居民", trigger: "blur" }],
        sex: [{ required: true, message: "请选择性别", trigger: "change" }],
        partyBranch: [
          { required: true, message: "请选择党组织", trigger: "change" },
        ],
      },
      jmdialog: false,
    };
  },
  components: {
    AddResident,
  },
  mounted() {
    this.initForm();
    this.getlist();

    this.Organization();
  },
  methods: {
    // 获取所属党组织
    Organization() {
      basicOrganizationList().then((res) => {
        console.log(res);
        this.organizationList = res.data;
      });
    },
    // 导入、图片上传
    choosefile: function (event) {
      // 文件上传
      let file = this.$refs.file.files[0];
      this.uploadfile(file);
      event.target.value = "";
    },
    // 文件上传后获取数据
    uploadfile: function (data) {
      var random = new Date().getTime().toString();
      let formData = new FormData();
      formData.append("file", data);
      axios
        .post("/system/oss/upload?t=" + random, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.code == 200) {
            // 图片上传后
            // console.log(res.data.data.url);
            this.addForm.photoUrl = res.data.data.url;
            this.addForm.photo = res.data.data.ossId;
          } else {
            this.$message({
              message: res.data.msg,
              type: "error",
            });
          }
        })
        .catch((res) => {
          console.log(res, "2");
        });
    },
    // 删除图片
    handlesyimg: function () {
      this.addForm.photoUrl = require("@/assets/img/empty.png");
      this.addForm.photo = "";
    },
    // 选择居民
    handleChooseRs() {
      this.jmdialog = true;
    },
    handleAddResident(e) {
      this.addForm.idCard = e.idCard;
      this.addForm.name = e.name;
      this.jmdialog = false;
    },
    // 关闭居民选择弹窗
    handleCloseAdd() {
      this.jmdialog = false;
    },
    // 初始化表单
    initForm() {
      this.addForm = {
        partyBranchName: "",
        partyBranch: "", // 所属党支部
        name: "", // 姓名
        idCard: "", // 身份证号
        sort: "", // 排序
        sex: "", // 性别 0:女 1:男
        workUnit: "", // 工作单位
        address: "", // 居住地址
        phone: "", // 手机号
        birthDate: "", // 出生年月
        photoUrl: require("@/assets/img/empty.png"),
        photo: "",
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
      DoubleCheckList(this.filters).then((res) => {
        this.datalist = res.rows;
        this.total = res.total;
        console.log("1212121", res);
      });
    },
    // 重置
    resetForm: function (filters) {
      this.$refs.filters.resetFields();
      this.filters = {
        partyBranch: "",
        name: "", // 姓名
        pageSize: 10,
        pageNum: 1,
        partyBranchName: "",
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
    // 删除取消
    visibleDelCancel(id) {
      // 取消
      this.$refs[id].doClose();
    },
    // 删除确认
    visibleDelSubmit(id) {
      // 确定
      delDoubleCheck(id).then((res) => {
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
    },

    // 编辑
    handleEdit: function (row) {
      this.adddialog = true;
      this.diatitle = "编辑";
      this.getDetail(row.id);
    },
    // 详情
    getDetail(id) {
      getDoubleCheck(id).then((res) => {
        this.addForm = res.data;
        console.log(this.addForm)
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
        console.log("22222", this.addForm);
        if (valid) {
          if (!this.addForm.id) {
            addDoubleCheck(this.addForm).then((res) => {
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
            editDoubleCheck(this.addForm).then((res) => {
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