<template>
  <div class="g-cont">
    <div class="m-contain">
      <span class="btn add-btn" @click="handleAdd">新增</span>
      <span class="btn down-btn" @click="handledown">下载导入模版</span>
      <span class="btn import-btn"
        ><input
          type="file"
          ref="filebox"
          name="file"
          class="fileipt"
          @change="handleimport($event)"
        />导入</span
      >
      <span class="btn export-btn" @click="handlexport">导出</span>
      <div
        class="m-search"
        style="margin-top: 0.083rem; float: left; margin-left: 30px"
      >
        <el-form :model="filters" :inline="true" ref="filters">
          <el-form-item label="类型" prop="partyMemberType">
            <el-select v-model="filters.facilityTypeId">
              <el-option
                :value="item.value"
                :label="item.label"
                :key="index"
                v-for="(item, index) in partyMemberTypeList"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="facilitiesStatus">
            <el-select v-model="filters.facilitiesStatus">
              <el-option
                :value="item.value"
                :label="item.label"
                :key="index"
                v-for="(item, index) in rentstatus"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设施名称" prop="facilitiesName">
            <el-input
              v-model="filters.facilitiesName"
              placeholder="名称"
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
          @selection-change="handlegx"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="设施编号" prop="facilitiesNo" width="150">
          </el-table-column>
          <el-table-column
            label="设施名称"
            prop="facilitiesName"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            label="设施类型"
            prop="facilityTypeName"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column label="状态" prop="">
            <template slot-scope="scope">
              <span
                class="f-blue"
                v-if="scope.row.facilitiesStatus == '1'"
                style="color: #00cc00"
                >正常</span
              >
              <span
                class="f-blue"
                v-else-if="scope.row.facilitiesStatus == '2'"
                style="color: red"
                >损坏</span
              >
              <span
                class="f-blue"
                v-else-if="scope.row.facilitiesStatus == '3'"
                style="color: black"
                >报废</span
              >
              <span
                class="f-blue"
                v-else-if="scope.row.facilitiesStatus == '4'"
                style="color: #e3a80d"
                >遗失</span
              >
              <span v-else>/</span>
            </template>
          </el-table-column>
          <el-table-column
            label="备注"
            prop="remarks"
            :show-overflow-tooltip="true"
          >
          </el-table-column>

          <el-table-column label="操作" prop="" width="150">
            <template slot-scope="scope">
              <span class="edit-title" @click="handlEdit(scope.row)">编辑</span
              >&nbsp;&nbsp;
              <span class="detail-title" @click="handleDetail(scope.row)"
                >详情</span
              >&nbsp;&nbsp;
              <el-popover
                :ref="scope.row.facilitiesId"
                placement="top"
                width="160"
                popper-class="popover"
              >
                <p class="del-tip">是否删除该设施信息？</p>
                <div class="pop-btnbox">
                  <span
                    class="cancel-btn"
                    @click="visibleDelCancel(scope.row.facilitiesId)"
                    >取消</span
                  >
                  <span
                    class="ok-btn"
                    @click="visibleDelSubmit(scope.row.facilitiesId)"
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
      <el-form
        :model="addForm"
        :inline="true"
        ref="addForm"
        :rules="addFormRules"
        class="addform add-signcent"
        label-postion="right"
        label-width="80px"
      >
        <el-form-item label="设施编号" prop="facilitiesNo">
          <el-input
            v-model="addForm.facilitiesNo"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="设施名称" prop="facilitiesName">
          <el-input
            v-model="addForm.facilitiesName"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="照片" prop="" class="delbgimg" :key="formItemKey">
          <div
            class="upimgbox"
            :style="{
              backgroundImage: 'url(' + addForm.photoUrl + ')',
            }"
          >
            <input
              ref="file1"
              type="file"
              class="file"
              @change="choosefile($event, '1')"
            />
          </div>
          <i class="del-tip1" v-if="editflag" @click="handlesyimg">删除</i>
        </el-form-item>
        <el-form-item label="设施类型" prop="facilityTypeName">
          <el-select v-model="addForm.facilityTypeName" placeholder="请选择">
            <el-option
              :value="item.value"
              :label="item.label"
              :key="index"
              v-for="(item, index) in partyMemberTypeList"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设施状态" >
          <el-select v-model="addForm.facilitiesStatus" default="" name="rentstatus[addForm.facilitiesStatus].value" >
          <!-- <el-select v-model="rentstatus[addForm.facilitiesStatus].value" placeholder="请选择"> -->
            <el-option
              :value="item.value"
              :label="item.label"
              :key="index"
              v-for="(item, index) in rentstatus"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input
            type="textarea"
            v-model="addForm.remarks"
            placeholder="请输入介绍"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-foot">
        <span class="btn-cancel" @click="handlecancel('0')">取消</span>
        <span class="btn-save" @click="handleSubmit">保存</span>
      </div>
    </el-dialog>

    <!-- 详情 -->
    <el-dialog
      :visible.sync="xqdialog"
      v-if="xqdialog"
      class="g-dialog"
      title="设施信息详情"
    >
      <span class="tip">基础信息</span>
      <div class="xq-content">
        <div class="xq-lst">
          <span class="name">设施编号</span>
          <span class="lab">{{ detailform.facilitiesNo }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">设施名称</span>
          <span class="lab">{{ detailform.facilitiesName }}</span>
        </div>

        <div class="xq-lst">
          <span class="name">设施类型</span>
          <span class="lab">{{ detailform.facilityTypeName }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">设施状态</span>
          <span class="lab" v-if="detailform.facilitiesStatus == '1'"
            >正常</span
          >
          <span class="lab" v-else-if="detailform.facilitiesStatus == '2'"
            >损坏</span
          >
          <span class="lab" v-else-if="detailform.facilitiesStatus == '3'"
            >报废</span
          >
          <span class="lab" v-else-if="detailform.facilitiesStatus == '4'"
            >遗失</span
          >
        </div>
        <div class="xq-lst">
          <span class="name">备注</span>
          <span class="lab">{{ detailform.remarks }}</span>
        </div>

        <div class="xq-lst" style="width: 100%">
          <span class="name">照片</span>
          <img
            :src="detailform.photoUrl"
            class="jmzp"
            v-if="detailform.photoId"
          />
        </div>
        <div class="xq-lst" style="width: 100%">
          <span class="name">设施照片</span>
          <img
            :src="detailform.photoExportUrl"
            class="jmzp"
            v-if="detailform.photoExportUrl"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  facilitiesList,
  facilitiesAdd,
  facilitiesUpdate,
  facilitiesDelete,
  facilitiesQuery,
} from "../../api/api.js";
import axios from "axios";
export default {
  data() {
    return {
      filters: {
        facilitiesId: "",
        facilitiesName: "",
        facilityTypeId: "",
        facilitiesStatus: "",
        size: 10,
        current: 1,
      },
      datalist: [],
      listLoading: false,
      total: 0,
      currentPage: 1,
      currentPage1: 1,
      pagesize: 10,
      pagesize1: 10,
      adddialog: false,
      diatitle: "",
      addForm: {
        facilitiesId: "", //设施id
        photoId: "", //照片
        photoUrl: "url('../img/empty.png') no-repeat",
        facilitiesNo: "", //设施编号
        facilitiesName: "", //设施名称
        facilityTypeId: "", //设施类型id
        remarks: "", //备注
        facilitiesStatus: "", //设施状态
      },
      residential: false,
      addFormRules: {
        facilitiesNo: [
          { required: true, message: "请输入设施编号", trigger: "blur" },
        ],
        facilitiesName: [
          { required: true, message: "请输入设施名称", trigger: "blur" },
        ],
        facilityTypeId: [
          { required: true, message: "请选择设施类型", trigger: "change" },
        ],
        facilitiesStatus: [
          { required: true, message: "请选择设施状态", trigger: "change" },
        ],
      },
      editflag: false,
      current: "0",
      gxfloor: [],
      xqdialog: false,
      detailform: {},
      multion: [],
      formItemKey: 0,
      rentstatus: [
        {
          value: 1,
          label: "正常",
        },
        {
          value: 2,
          label: "损坏",
        },
        {
          value: 3,
          label: "报废",
        },
        {
          value: 4,
          label: "遗失",
        },
      ],
      partyMemberTypeList: [
        {
          value: "1",
          label: "路灯",
        },
        {
          value: "2",
          label: "垃圾桶",
        },
      ],
      jxddialog: false,
      mapZoom: 13,
      mapCenter: {
        //青原
        lng: 115.01747,
        lat: 27.10577,
      },
      mapbox: {},
      placeName: "",
    };
  },
  mounted() {
    this.getlist(1);
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
        facilityTypeId: this.filters.facilityTypeId,
        facilitiesStatus: this.filters.facilitiesStatus,
        facilitiesName: this.filters.facilitiesName,
        pageSize: this.filters.size,
        pageNum: this.filters.current,
      };
      if (val) {
        para.pageNum = val;
        this.currentPage1 = val;
      }
      facilitiesList(para).then((res) => {
        this.datalist = res.data.rows;
        this.total = res.data.total;
      });
    },
    // 重置
    resetForm: function (filters) {
      this.$refs.filters.resetFields();
      this.filters = {
        facilitiesId: "",
        facilitiesName: "",
        facilityTypeId: "",
        facilitiesStatus: "",
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
      this.$refs[id].doClose();
    },
    // 删除 确定
    visibleDelSubmit(id) {
      facilitiesDelete(id).then((res) => {
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
    // 新增
    handleAdd: function () {
      this.adddialog = true;
      this.diatitle = "添加设施";
      this.addForm = {
        facilitiesId: "", //设施id
        photoId: "", //照片
        photoUrl: "url('../img/empty.png') no-repeat",
        facilitiesNo: "", //设施编号
        facilitiesName: "", //设施名称
        facilityTypeId: "", //设施类型id
        remarks: "", //备注
        facilitiesStatus: "", //设施状态
      };
      this.gxfloor = [];

      this.editflag = false;
    },
    // 编辑
    handlEdit: function (row) {
      this.adddialog = true;
      this.diatitle = "修改设施";
      this.getDetail(row.facilitiesId);
    },
    // 详情
    handleDetail: function (row) {
      this.xqdialog = true;
      console.log(row.facilitiesId);
      this.getDetail(row.facilitiesId);
    },
    // 详情接口
    getDetail: function (id) {
      facilitiesQuery(id).then((res) => {
        console.log(res.data.data, "101001");
        this.detailform = res.data.data;
        this.addForm = res.data.data;
        this.addForm.facilitiesStatus = this.rentstatus[this.addForm.facilitiesStatus-1].value
        if (this.addForm.photoUrl == "" || this.addForm.photoUrl == null) {
          this.addForm.photoUrl = require("@/assets/img/empty.png");
          this.editflag = false;
        } else {
          this.editflag = true;
        }
      });
    },
    // 删除图片
    handlesyimg: function () {
      this.addForm.photoUrl = require("@/assets/img/empty.png");
      this.addForm.photo = "";
      this.editflag = false;
      // 更新key，强制el-form-item 重新渲染
      this.formItemKey += 1;
    },
    // 下载导入模版
    handledown: function () {
      let url = "/basic/facilities/download";
      this.comjs.downfile(url);
    },
    // 导入、图片上传
    choosefile: function (event, type) {
      // 文件上传
      let file = this.$refs.file1.files[0];
      console.log(file, "010100");
      this.uploadfile(file, type);
    },
    // 文件上传后获取数据
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
            // 图片上传后
            console.log(res.data.data.url);
            this.addForm.photoUrl = res.data.data.url;
            this.addForm.photo = res.data.data.ossId;
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
    // 导入
    handleimport: function () {
      let file = this.$refs.filebox.files[0];
      var random = new Date().getTime().toString();
      let formData = new FormData();
      formData.append("file", file);
      axios
        .post("/basic/facilities/import?t=" + random, formData, {
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
        this.$refs.filebox.value = '';
    },
    // 勾选
    handlegx: function (data) {
      console.log(data, "00101");
      this.multion = [];
      for (var i = 0; i < data.length; i++) {
        this.multion.push(data[i].facilitiesId);
      }
      console.log(this.multion);
    },
    // 导出
    handlexport: function () {
      if (this.multion.length > 0) {
        let url = "/basic/facilities/export?id=" + this.multion.join(",");
        this.comjs.downfile(url);
      } else {
        this.$message({
          message: "至少勾选一条数据",
          type: "info",
        });
      }
    },
    // 图片上传
    uploadimg: function (event) {
      let file = this.$refs.file;
      console.log(file.files[0], "10100");
    },
    // 取消
    handlecancel: function (type) {
      if (type == "0") {
        this.adddialog = false;
        this.addForm = {
          facilitiesId: "", //设施id
          photoId: "", //照片
          photoUrl: "url('../img/empty.png') no-repeat",
          facilitiesNo: "", //设施编号
          facilitiesName: "", //设施名称
          facilityTypeId: "", //设施类型id
          remarks: "", //备注
          facilitiesStatus: "", //设施状态
        };
      }
    },
    // 保存
    handleSubmit: function () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          let para = {
            facilitiesId: this.addForm.facilitiesId,
            facilitiesNo: this.addForm.facilitiesNo,
            facilitiesName: this.addForm.facilitiesName,
            photoId: this.addForm.photoId,
            facilityTypeId: this.addForm.facilityTypeId,
            remarks: this.addForm.remarks,
            facilitiesStatus: this.addForm.facilitiesStatus,
          };
          if (this.addForm.facilitiesId) {
            facilitiesUpdate(para).then((res) => {
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
              this.$refs.addForm.resetFields();
              this.adddialog = false;
              this.getlist(1);
            });
          } else {
            facilitiesAdd(para).then((res) => {
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
              this.$refs.addForm.resetFields();
              this.adddialog = false;
              this.getlist(1);
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