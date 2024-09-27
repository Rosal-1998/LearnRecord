<template>
  <div class="g-cont">
    <div class="m-contain">
      <span class="btn add-btn" @click="handleAdd">新增</span>
      <div class="m-search">
        <el-form :model="filters" :inline="true" ref="filters">
          <el-form-item label="姓名" prop="name">
            <el-input
              v-model="filters.name"
              placeholder="请输入姓名"
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
          <el-table-column label="序号" prop="sort" width="80">
          </el-table-column>
          <el-table-column label="姓名" prop="name"> </el-table-column>
          <el-table-column label="手机号" prop="phone"> </el-table-column>
          <el-table-column label="照片">
            <template slot-scope="scope">
              <img
                v-if="scope.row.photoUrl"
                width="80px"
                height="50px"
                :src="scope.row.photoUrl"
                style="margin: 5px 0px"
                alt=""
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="">
            <template slot-scope="scope">
              <span class="edit-title" @click="handlEdit(scope.row)">编辑</span
              >&nbsp;&nbsp;
              <el-popover
                :ref="scope.row.id"
                placement="top"
                width="160"
                popper-class="popover"
              >
                <p class="del-tip">是否删除该信息？</p>
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
          prev-text="上一页"
          next-text="下一页"
          :total="total"
        >
        </el-pagination>
        <i class="total">共有{{ total }}条数据</i>
      </div>
    </div>
    <!-- 新增 -->
    <el-dialog
      :visible.sync="adddialog"
      v-if="adddialog"
      class="g-dialog"
      :title="diatitle"
      label-postion="right"
    >
      <!-- <span class="tip">基础信息</span> -->
      <el-form
        :model="addForm"
        :inline="true"
        ref="addForm"
        :rules="addFormRules"
        class="addform add-signcent"
        label-postion="right"
        label-width="80px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="addForm.phone"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item label="序号" prop="sort">
          <el-input
            type="number"
            v-model="addForm.sort"
            placeholder="请输入序号"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="照片"
          prop=""
          style="width: 100%"
          class="delbgimg"
          :key="formItemKey"
        >
          <div
            class="upimgbox"
            :style="{ backgroundImage: 'url(' + addForm.photoUrl + ')' }"
          >
            <input
              ref="file"
              type="file"
              class="file"
              @change="choosefile($event, '0')"
            />
          </div>
          <i class="del-tip1" v-if="editflag" @click="handlesyimg">删除</i>
        </el-form-item>
      </el-form>
      <div class="dialog-foot">
        <span class="btn-cancel" @click="handlecancel('0')">取消</span>
        <span class="btn-save" @click="handleSubmit">保存</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import {
  StaffList,
  AddStaffManagement,
  EditStaffManagement,
  GetStaffManagement,
  DelStaffManagement,
} from "../../api/api.js";
export default {
  data() {
    return {
      filters: {
        name: "",
        size: 10,
        current: 1,
      },
      datalist: [],
      listLoading: false,
      total: 0,
      total1: 0,
      currentPage: 1,
      currentPage1: 1,
      currentPage2: 1,
      currentPage3: 1,
      pagesize: 10,
      pagesize1: 10,
      adddialog: false,
      diatitle: "",
      addForm: {
        name: "",
        phone: "",
        sort: "",
        photoId: "",
        photoUrl: require("@/assets/img/empty.png"),
      },
      addFormRules: {
        name: [{ required: true, message: "请选择姓名", trigger: "blur" }],
        phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
      },
      imgflag: false,
      editflag: false,
      formItemKey: 0,
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
      let para = {
        name: this.filters.name,
        pageSize: this.filters.size,
        pageNum: this.filters.current,
      };
      if (val) {
        para.pageNum = val;
        this.currentPage1 = val;
      }
      StaffList(para).then((res) => {
        console.log(222, res);
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
    // 删除 取消
    visibleDelCancel(id) {
      console.log('id123123123',id)
      this.$refs[id].doClose();
    },
    // 删除 确定
    visibleDelSubmit(id) {
      DelStaffManagement(id).then((res) => {
        console.log(1111, res);
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
        this.getlist("");
      });
    },

    // 新增
    handleAdd: function () {
      this.adddialog = true;
      this.diatitle = "添加";
      this.InitAddForm();
      this.editflag = false;
    },

    // 图片上传
    choosefile: function (event, type) {
      let file = this.$refs.file.files[0];
      this.uploadfile(file, type);
      event.target.value = "";
    },
    // 文件上传
    uploadfile: function (data, type) {
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
            this.addForm.photoUrl = res.data.data.url;
            this.addForm.photoId = res.data.data.ossId;
            this.editflag = true;
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
    // 弹窗关闭
    handlecancel: function (type) {
      if (type == "0") {
        this.adddialog = false;
      } else {
        this.jmdialog = false;
      }
    },
    // 保存
    handleSubmit: function () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          let para = {
            name: this.addForm.name,
            phone: this.addForm.phone,
            sort: this.addForm.sort,
            photoId: this.addForm.photoId,
          };
          if (this.addForm.id) {
            para.id = this.addForm.id;
            EditStaffManagement(para).then((res) => {
              if (res.code == "200") {
                this.$message({
                  message: res.msg,
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
            AddStaffManagement(para).then((res) => {
              if (res.code == "200") {
                this.$message({
                  message: res.msg,
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
    // 详情
    getDetail: function (id) {
      GetStaffManagement(id).then((res) => {
        this.addForm = res.data;
        if (this.addForm.photoUrl == "" || this.addForm.photoUrl == null) {
          this.addForm.photoUrl = require("@/assets/img/empty.png");
        } else {
          this.editflag = true;
        }
      });
    },

    // 编辑
    handlEdit: function (row) {
      this.adddialog = true;
      this.diatitle = "编辑";
      this.getDetail(row.id);
    },
    // 删除图片
    handlesyimg: function () {
      this.addForm.photoUrl = require("@/assets/img/empty.png");
      this.addForm.photoId = "";
      this.editflag = false;
      // 更新key，强制el-form-item 重新渲染
      this.formItemKey += 1;
    },
    InitAddForm() {
      this.addForm = {
        name: "",
        phone: "",
        sort: "",
        photoId: "",
        photoUrl: require("@/assets/img/empty.png"),
      };
    },
  },
};
</script>

<style>
</style>