<template>
  <div class="g-cont">
    <div class="m-contain">
      <span class="btn add-btn" @click="handleAdd">新增</span>
      <div class="m-search">
        <el-form
          :inline="true"
          :model="filters"
          ref="filters"
          id="filters"
          class="search-form"
        >
          <el-form-item label="角色名称:" prop="roleName">
            <el-input
              v-model="filters.roleName"
              placeholder="请输入角色名称"
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
          <el-table-column prop="roleId" label="角色编号"> </el-table-column>
          <el-table-column prop="roleName" label="角色名称"> </el-table-column>
          <el-table-column prop="roleKey" label="权限字符"> </el-table-column>
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
          <el-table-column prop="createTime" label="创建时间">
          </el-table-column>
          <el-table-column prop="" label="操作">
            <template slot-scope="scope">
              <span class="edit-title" @click="handlEdit(scope.row)">编辑</span
              >&nbsp;&nbsp;
              <el-popover
                :ref="scope.row.roleId"
                placement="top"
                width="160"
                popper-class="popover"
              >
                <p class="del-tip">是否删除该角色信息？</p>
                <div class="pop-btnbox">
                  <span
                    class="cancel-btn"
                    @click="visibleDelCancel(scope.row.roleId)"
                    >取消</span
                  >
                  <span class="ok-btn" @click="visibleDelSubmit(scope.row)"
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
            class="addform add-signcent"
            ref="addForm"
            :rules="addFormRules"
          >
            <el-form-item label="角色名称" prop="roleName">
              <el-input
                v-model="addForm.roleName"
                placeholder="请输入角色名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="权限字符" prop="roleKey">
              <el-input
                v-model="addForm.roleKey"
                placeholder="请输入权限字符"
              ></el-input>
            </el-form-item>
            <el-form-item label="角色顺序" prop="roleSort">
              <el-input
                v-model="addForm.roleSort"
                placeholder="请输入角色顺序"
              ></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
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
            <el-form-item label="权限" prop="rolePermissionsIds">
              <el-tree
                class="role-treebox"
                :data="treeData"
                show-checkbox
                ref="roletree"
                node-key="id"
                :default-checked-keys="addForm.menuIds"
                @node-click="handleClick"
                empty-text="加载中，请稍候"
                :props="defaultProps"
              ></el-tree>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input
                type="textarea"
                v-model="addForm.remark"
                placeholder="请输入备注符"
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
  RoleList,
  AddRole,
  UpdateRole,
  DelRole,
  RolefindById,
  Treeselect,
  RoleUpdateStatus,
  RoleMenuTreeselect,
} from "../../api/api.js";
import qs from "qs";

export default {
  data() {
    var validatePass = (rule, value, callback) => {
      let arr = this.$refs.roletree.getCheckedKeys(); // 在此获取选中的树形数据
      if (arr.length == 0 || !arr) {
        callback(new Error("请选择权限设置"));
      } else {
        callback();
      }
    };
    return {
      filters: {
        roleName: "",
        size: 10,
        current: 1,
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
        roleId: "",
        roleName: "",
        roleKey: "",
        roleSort: "",
        status: "0",
        menuIds: [],
        remark: "",
      },
      addFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleKey: [
          { required: true, message: "请输入权限字符", trigger: "blur" },
        ],
        rolePermissionsIds: [
          { required: true, validator: validatePass, trigger: "change" },
        ],
        roleSort: [
          { required: true, message: "请输入角色顺序", trigger: "blur" },
        ],
      },
      treeData: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  mounted() {
    this.getlist("");
  },
  methods: {
    // 获取权限树
    getqxlist: function () {
      Treeselect().then((res) => {
        console.log(res, "quax");
        this.treeData = res.data.data;
      });
    },
    // 点击树状
    handleClick: function (data) {
      let childata = this.$refs.roletree.getCheckedKeys();
      console.log(childata, "childatachildatachildata");
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
        roleName: this.filters.roleName,
        pageSize: this.filters.size,
        pageNum: this.filters.current,
      };
      if (val) {
        para.pageNum = val;
        this.currentPage1 = val;
      }
      RoleList(para).then((res) => {
        this.datalist = res.data.rows;
        this.total = res.data.total;
      });
    },
    // 重置
    resetForm: function (filters) {
      this.$refs.filters.resetFields();
      this.filters = {
        name: "",
        size: 10,
        current: 1,
      };
      this.pagesize = 10;
      this.currentPage = 1;
      this.currentPage1 = 1;
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
    // 更改状态
    handlestatus: function (row, type) {
      let para = {
        roleId: row.roleId,
        status: type,
      };
      RoleUpdateStatus(para).then((res) => {
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
    // 新增
    handleAdd: function () {
      this.adddialog = true;
      this.diatitle = "新增";
      this.addForm = {
        roleId: "",
        roleName: "",
        roleKey: "",
        roleSort: "",
        status: "0",
        menuIds: [],
        remark: "",
      };
      this.getqxlist();
    },
    // 编辑
    handlEdit: function (row) {
      this.adddialog = true;
      this.diatitle = "编辑";
      this.getDetail(row.roleId);
      this.getxqtree(row.roleId);
      this.getqxlist();
    },
    // 详情
    getDetail: function (id) {
      RolefindById(id).then((res) => {
        this.addForm = res.data.data;
      });
    },
    // 菜单
    getxqtree: function (id) {
      RoleMenuTreeselect(id).then((res) => {
        this.addForm.menuIds = [];
        this.$nextTick(() => {
          this.addForm.menuIds = res.data.data.checkedKeys;
        });
      });
    },
    // 切换 账号状态
    handlestat: function (val, type) {
      this.addForm.status = val;
    },
    // 弹窗关闭
    handleclose: function (type) {
      this.$refs.addForm.resetFields();
      this.addForm = {
        roleId: "",
        roleName: "",
        roleKey: "",
        roleSort: "",
        status: "0",
        menuIds: [],
        remark: "",
      };
      this.adddialog = false;
    },
    // 关闭新增弹窗
    handlecloseDialog: function () {
      this.$refs.addForm.resetFields();
      this.adddialog = false;
      this.getlist(1);
    },
    // 完成
    handlesubmit: function () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          let para = {
            roleId: this.addForm.roleId,
            roleName: this.addForm.roleName,
            roleKey: this.addForm.roleKey,
            status: this.addForm.status,
            roleSort: this.addForm.roleSort,
            menuIds: this.$refs.roletree.getCheckedKeys(),
            remark: this.addForm.remark,
          };
          if (this.addForm.roleId) {
            UpdateRole(para).then((res) => {
              if (res.code == "200") {
                this.$message({
                  message: res.msg,
                  type: "success",
                });
								this.handlecloseDialog()
              } else {
                this.$message({
                  message: res.msg,
                  type: "error",
                });
								this.handlecloseDialog()
              }
            });
          } else {
            AddRole(para).then((res) => {
              if (res.code == "200") {
                this.$message({
                  message: res.msg,
                  type: "success",
                });
                this.handlecloseDialog()
              } else {
                this.$message({
                  message: res.msg,
                  type: "error",
                });
								this.handlecloseDialog()
              }
            });
          }
        }
      });
    },
    // 删除 取消
    visibleDelCancel(id) {
      this.$refs[id].doClose();
    },
    // 删除确认
    visibleDelSubmit(rowData) {
      DelRole(rowData.roleId).then((res) => {
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
        this.$refs[rowData.roleId].doClose();
        this.getlist(1);
      });
    },
  },
};
</script>

<style>
</style>