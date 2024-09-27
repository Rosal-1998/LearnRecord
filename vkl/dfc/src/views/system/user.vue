<template>
  <div class="g-cont">
    <div class="m-contain">
      <div class="m-search" style="float: left">
        <el-form
          :inline="true"
          :model="filters"
          ref="filters"
          id="filters"
          class="search-form"
        >
          <el-form-item label="姓名:" prop="nickName">
            <el-input
              v-model="filters.nickName"
              placeholder="请输入姓名"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号:" prop="phonenumber">
            <el-input
              v-model="filters.phonenumber"
              placeholder="请输入手机号"
            ></el-input>
          </el-form-item>
          <el-form-item label="职务:" prop="postName">
            <el-input
              v-model="filters.postName"
              placeholder="请输入职务"
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
      <div class="operate-btn">
        <span class="btn add-btn" @click="handleAdd">新增</span>
        <span class="btn down-btn" @click="handledown">下载导入模版</span>
        <span class="btn import-btn">
          <input
            type="file"
            ref="filebox"
            name="file"
            class="fileipt"
            @change="handleimport($event, '0')"
          />导入
        </span>
        <span class="btn del-btn" @click="handlecz('', '0')">批量重置密码</span>
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
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="userId" label="ID"> </el-table-column>
          <el-table-column prop="nickName" label="姓名"> </el-table-column>
          <el-table-column prop="userName" label="账号"> </el-table-column>
          <el-table-column prop="dept.deptName" label="部门(队组)">
          </el-table-column>
          <el-table-column prop="postName" label="职务"> </el-table-column>
          <el-table-column prop="phonenumber" label="手机号"> </el-table-column>
          <el-table-column prop="" label="状态">
            <template slot-scope="scope">
              <span
                class="radio-tab"
                v-if="scope.row.status == '0'"
                @click="handlestatus(scope.row, '1')"
              >
                正常&nbsp;<img
                  src="../../assets/img/status-active.png"
                  class="status-img"
                />
              </span>
              <span
                class="radio-tab"
                v-else-if="scope.row.status == '1'"
                @click="handlestatus(scope.row, '0')"
              >
                停用&nbsp;<img
                  src="../../assets/img/status-gray.png"
                  class="status-img"
                />
              </span>
              <span v-else=""> / </span>
            </template>
          </el-table-column>
          <el-table-column prop="workContent" label="工作内容">
          </el-table-column>
          <el-table-column prop="" label="操作">
            <template slot-scope="scope">
              <span class="edit-title" @click="handlEdit(scope.row)"
                >编辑&nbsp;&nbsp;</span
              >
              <el-popover
                :ref="scope.row.userId"
                placement="top"
                width="160"
                popper-class="popover"
              >
                <p class="del-tip">是否删除该用户信息？</p>
                <div class="pop-btnbox">
                  <span
                    class="cancel-btn"
                    @click="visibleDelCancel(scope.row.userId)"
                    >取消</span
                  >
                  <span
                    class="ok-btn"
                    @click="visibleDelSubmit(scope.row.userId)"
                    >确定</span
                  >
                </div>
                <span slot="reference" class="del-title">删除</span>
              </el-popover>
              <span class="detail-title" @click="handlecz(scope.row, '1')"
                >&nbsp;&nbsp;重置密码</span
              >
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
      <div class="dia-contont">
        <div class="dia-cont">
          <el-form
            :model="addForm"
            :inline="true"
            class="addform"
            ref="addForm"
            :rules="addFormRules"
          >
            <el-form-item label="姓名" prop="nickName">
              <el-input
                v-model="addForm.nickName"
                placeholder="请输入姓名"
              ></el-input>
            </el-form-item>
            <el-form-item label="部门(队组)" prop="deptId">
              <treeselect
                v-model="addForm.deptId"
                :options="deptOptions"
                :normalizer="normalizer"
                placeholder="请选择部门"
              />
            </el-form-item>
            <el-form-item label="角色" prop="roleIds">
              <el-select
                v-model="addForm.roleIds"
                multiple
                placeholder="请选择角色"
              >
                <el-option
                  v-for="(item, index) in rolelist"
                  :key="index"
                  :value="item.roleId"
                  :label="item.roleName"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="账号" prop="userName">
              <el-input
                v-model="addForm.userName"
                placeholder="请输入账号"
              ></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phonenumber">
              <el-input
                v-model="addForm.phonenumber"
                placeholder="请输入手机号"
              ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="addForm.password"
                placeholder="请输入密码"
              ></el-input>
            </el-form-item>
            <el-form-item label="职务" prop="postName">
              <el-input
                v-model="addForm.postName"
                placeholder="请输入职务"
              ></el-input>
            </el-form-item>
            <el-form-item label="账号状态" prop="status">
              <div
                class="radio-lst"
                v-if="addForm.status == '0'"
                @click="handlestat('1', '1')"
              >
                <img
                  src="../../assets/img/status-active.png"
                  class="status-img"
                />
                启用
              </div>
              <div
                class="radio-lst"
                v-if="addForm.status == '1'"
                @click="handlestat('0', '1')"
              >
                <img
                  src="../../assets/img/status-gray.png"
                  class="status-img"
                />
                禁用
              </div>
            </el-form-item>
            <el-form-item
              label="工作内容"
              prop="workContent"
              style="width: 100%"
            >
              <el-input
                type="textarea"
                v-model="addForm.workContent"
                placeholder="请输入工作内容"
              ></el-input>
            </el-form-item>
          </el-form>
          <div class="dialog-foot">
            <span class="btn-cancel" @click="handleclose('0')">取消</span>
            <span class="btn-save" @click="handlesubmit">完成</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  UserList,
  AddUser,
  UpdateUser,
  DelUser,
  UserUpdateStatus,
  UserDeptTree,
  Userdetal,
  UserInfo,
  ResetPassword,
} from "../../api/api.js";
import qs from "qs";
import axios from "axios";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  components: {
    Treeselect,
  },
  data() {
    return {
      filters: {
        nickName: "",
        phonenumber: "",
        postName: "",
        current: 1,
        size: 10,
      },
      datalist: [],
      listLoading: false,
      total: 0,
      pagesize: 10,
      currentPage: 1,
      currentPage1: 1,
      adddialog: false,
      diatitle: "",
      addForm: {
        userId: "",
        deptId: null,
        nickName: "",
        userName: "",
        phonenumber: "",
        roleIds: [],
        password: "",
        postName: "",
        status: "0",
        workContent: "",
      },
      addFormRules: {
        nickName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        userName: [{ required: true, message: "请输入账号", trigger: "blur" }],
      },
      deptOptions: [],
      rolelist: [],
      passwordflag: true,
      multion: [],
    };
  },
  mounted() {
    this.getlist("");
    this.getdept();
    this.getrole();
  },
  methods: {
    // 部门树
    getdept: function () {
      UserDeptTree().then((res) => {
        this.deptOptions = res.data.data;
      });
    },
    // 转换树
    normalizer(node) {
      if (node.children == null || node.children == "null") {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.label,
        children: node.children,
      };
    },
    // 获取角色
    getrole: function () {
      Userdetal().then((res) => {
        console.log(res, "101001");
        this.rolelist = res.data.data.roles;
      });
    },
    // 隔行颜色
    tableRowClassName: function (rowIndex) {
      if (rowIndex.rowIndex % 2 != 0) {
        return "evenRow";
      }
      return "oddRow";
    },
    // 获取列表
    getlist: function (val) {
      let para = {
        nickName: this.filters.nickName,
        phonenumber: this.filters.phonenumber,
        postName: this.filters.postName,
        pageNum: this.filters.current,
        pageSize: this.filters.size,
      };
      if (val) {
        para.pageNum = val;
        this.currentPage1 = val;
      }
      UserList(para).then((res) => {
        this.datalist = res.data.rows;
        this.total = res.data.total;
      });
    },
    // 重置
    resetForm: function (filters) {
      this.$refs.filters.resetFields();
      this.filters = {
        nickName: "",
        phonenumber: "",
        postName: "",
        current: 1,
        size: 10,
      };
      this.pagesize = 10;
      this.currentPage1 = 1;
      this.currentPage = 1;
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
    // 下载模版
    handledown: function () {
      let url = "/system/user/importTemplate";
      this.comjs.downfile(url);
    },
    // 导入
    handleimport: function (event) {
      let file = this.$refs.filebox.files[0];
      var random = new Date().getTime().toString();
      let formData = new FormData();
      formData.append("file", file);
      axios
        .post("/system/user/importData?t=" + random, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.$message({
              message: res.data.msg,
              type: "success",
            });
          } else {
            this.$message({
              message: res.data.msg,
              type: "error",
            });
          }
          this.getlist(1);
        })
        .catch((res) => {
          console.log(res, "2");
        });
    },
    // 新增
    handleAdd: function (row) {
      this.adddialog = true;
      this.diatitle = "新增用户";
      this.addForm = {
        userId: "",
        deptId: null,
        nickName: "",
        userName: "",
        phonenumber: "",
        roleIds: [],
        password: "",
        postName: "",
        status: "0",
        workContent: "",
      };
      this.passwordflag = true;
    },
    // 切换 账号状态
    handlestat: function (val, type) {
      this.addForm.status = val;
    },
    // 编辑
    handlEdit: function (row) {
      this.adddialog = true;
      this.diatitle = "编辑用户";
      this.getDetail(row.userId);
    },
    // 详情
    getDetail: function (id) {
      UserInfo(id).then((res) => {
        console.log(res, "x1");
        this.addForm = res.data.data.user;
        this.addForm.roleIds = res.data.data.roleIds;
        this.passwordflag = false;
      });
    },

    // 弹窗关闭
    handleclose: function (type) {
      this.adddialog = false;
    },
    // 保存
    handlesubmit: function () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          let para = {
            userId: this.addForm.userId,
            deptId: this.addForm.deptId,
            nickName: this.addForm.nickName,
            userName: this.addForm.userName,
            phonenumber: this.addForm.phonenumber,
            roleIds: this.addForm.roleIds,
            password: this.addForm.password,
            postName: this.addForm.postName,
            status: this.addForm.status,
            workContent: this.addForm.workContent,
          };
          if (this.addForm.userId) {
            UpdateUser(para).then((res) => {
              if (res.code == "200") {
                this.$message({
                  message: res.msg,
                  type: "success",
                });
                this.adddialog = false;
                this.getlist(1);
              } else {
                this.$message({
                  message: res.msg,
                  type: "error",
                });
                this.adddialog = false;
                this.getlist(1);
              }
            });
          } else {
            AddUser(para).then((res) => {
              if (res.code == "200") {
                this.$message({
                  message: res.msg,
                  type: "success",
                });
                this.adddialog = false;
                this.getlist(1);
              } else {
                this.$message({
                  message: res.msg,
                  type: "error",
                });
                this.adddialog = false;
                this.getlist(1);
              }
            });
          }
        }
      });
    },
    // 更改状态
    handlestatus: function (row, type) {
      let para = {
        userId: row.userId,
        status: type,
      };
      UserUpdateStatus(para).then((res) => {
        if (res.code == "200") {
          this.$message({
            message: res.msg,
            type: "success",
          });
        } else {
          this.$message({
            message: res.msg,
            type: "error",
          });
        }
        this.getlist(1);
      });
    },
    // 删除 取消
    visibleDelCancel(id) {
      this.$refs[id].doClose();
    },
    // 删除确认
    visibleDelSubmit(id) {
      DelUser(id).then((res) => {
        console.log(res, "10101");
        if (res.data.code == "200") {
          this.$message({
            message: res.data.msg,
            type: "success",
          });
        } else {
          this.$message({
            message: res.data.msg,
            type: "error",
          });
        }
        this.$refs[id].doClose();
        this.getlist(1);
      });
    },
    //
    handleSelectionChange: function (data) {
      this.multion = [];
      for (var i = 0; i < data.length; i++) {
        this.multion.push(data[i].userId);
      }
    },

    // 单个重置
    handlecz: function (row, type) {
      if (type == "0") {
        if (this.multion.length > 0) {
          let ids = this.multion.join(",");
          this.updataps(ids);
        } else {
          this.$message({
            message: "至少勾选一条数据",
            type: "info",
          });
        }
      } else {
        this.updataps(row.userId);
      }
    },
    // 重置密码
    updataps: function (id) {
      ResetPassword(id).then((res) => {
        if (res.data.code == "200") {
          this.$message({
            message: res.data.msg,
            type: "success",
          });
        } else {
          this.$message({
            message: res.data.msg,
            type: "error",
          });
        }
        this.getlist(1);
      });
    },
  },
};
</script>

<style>
</style>