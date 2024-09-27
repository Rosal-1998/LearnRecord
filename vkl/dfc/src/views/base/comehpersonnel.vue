<template>
  <div class="g-cont">
    <div class="m-contain">
      <!-- <span class="btn add-btn" @click="handleAdd">添加</span> -->
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
      <div class="m-search" style="margin-top: 0.083rem; float: left;">
        <el-form :model="filters" :inline="true" ref="filters">
            <el-form-item label="是否缴纳" prop="status">
            <el-select v-model="filters.status">
              <el-option
                :value="item.value"
                :label="item.label"
                :key="index"
                v-for="(item, index) in rentstatuss"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="缴费年度" prop="paymentYear">
            <el-date-picker v-model="filters.paymentYear" type="year" value-format="yyyy" ></el-date-picker>
          </el-form-item>
          
          <el-form-item label="身份证号" prop="idCard">
            <el-input
              v-model="filters.idCard"
              placeholder="身份证号"
            ></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input
              v-model="filters.name"
              placeholder="姓名"
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
          <el-table-column label="ID" prop="id" width="150">
          </el-table-column>
          <el-table-column
            label="姓名"
            prop="name"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            label="身份证号"
            prop="idCard"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            label="缴费年度"
            prop="paymentYear"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column label="是否缴纳" prop="">
            <template slot-scope="scope">
                <span class="f-blue" v-if="scope.row.status == '0'"
                  >否</span
                >
                <span class="f-gray" v-else-if="scope.row.status == '1'"
                  >是</span
                >
                <span v-else>/</span>
              </template>
          </el-table-column>
          <el-table-column label="操作" prop="" width="150">
            <template slot-scope="scope">
              <span class="edit-title" @click="handlEdit(scope.row)">编辑</span
              >&nbsp;&nbsp;
              <span class="detail-title" @click="handleDetail(scope.row)"
                >详情</span
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
                  <span
                    class="ok-btn"
                    @click="visibleDelSubmit(scope.row.id)"
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
        label-width="65px"
      >
        
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input
            v-model="addForm.idCard"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="缴费年度" prop="paymentYear">
            <el-date-picker v-model="addForm.paymentYear" type="year" value-format="yyyy"></el-date-picker>
        </el-form-item>
        <el-form-item label="是否缴纳" prop="status">
          <el-select v-model="addForm.status">
              <el-option
                :value="item.value"
                :label="item.label"
                :key="index"
                v-for="(item, index) in rentstatuss"
              ></el-option>
            </el-select>
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
      title="缴纳信息详情"
    >
      <div class="xq-content">
        
        <div class="xq-lst">
          <span class="name">姓名</span>
          <span class="lab">{{ detailform.name }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">身份证号</span>
          <span class="lab">{{ detailform.idCard }}</span>
        </div>
        
        <div class="xq-lst">
          <span class="name">是否缴纳</span>
          <span class="lab" v-if="detailform.status == '0'">否</span>
          <span class="lab" v-else-if="detailform.status == '1'">是</span>
          <span class="lab" v-else>/</span>
        </div>
        <div class="xq-lst">
          <span class="name">缴费年度</span>
          <span class="lab">{{ detailform.paymentYear }}</span>
        </div>
        
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  paymentList,
  paymentAdd,
  paymentUpdate,
  paymentDelete,
  paymentQuery,
} from "../../api/api.js";
import axios from "axios";
export default {
  data() {
    return {
      filters: {
        name:'',
        idCard:'',
        status:'',
        paymentYear:'',
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
        id:'',
        name:'',
        idCard:'',
        status:'',
        paymentYear:''
      },
      residential: false,
      addFormRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        idCard: [{ required: true, message: "请输入身份证号", trigger: "blur" }],
        status: [{ required: true, message: "请选择是否缴纳", trigger: "change" }],
        paymentYear: [{ required: true, message: "请选择年度", trigger: "change" }],
      },
      editflag: false,
      current: "0",
      gxfloor: [],
      xqdialog: false,
      detailform: {},
      multion: [],
      formItemKey: 0,
      rentstatuss:[
		{
          value: "0",
          label: "否",
        },
        {
          value: "1",
          label: "是",
        },
	  ],
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
        name:this.filters.name,
        idCard:this.filters.idCard,
        status:this.filters.status,
        paymentYear:this.filters.paymentYear,
        pageSize: this.filters.size,
        pageNum: this.filters.current,
      };
      if (val) {
        para.pageNum = val;
        this.currentPage1 = val;
      }
      paymentList(para).then((res) => {
        this.datalist = res.data.rows;
        this.total = res.data.total;
      });
    },
    // 重置
    resetForm: function (filters) {
      this.$refs.filters.resetFields();
      this.filters = {
        name:'',
        idCard:'',
        status:'',
        paymentYear:'',
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
      paymentDelete(id).then((res) => {
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
      this.diatitle = "添加缴纳信息";
      this.addForm = {
       integralId:'',
        name:'',
        idCard:'',
        integralYear:'',
        integralNumber:''
      };
      this.gxfloor = [];

      this.editflag = false;
    },
    // 编辑
    handlEdit: function (row) {
      this.adddialog = true;
      this.diatitle = "编辑缴纳信息";
      this.getDetail(row.id);
    },
    // 详情
    handleDetail: function (row) {
      this.xqdialog = true;
      this.getDetail(row.id);
    },
    // 详情接口
    getDetail: function (id) {
      paymentQuery(id).then((res) => {
        console.log(res.data.data, "101001");
        this.detailform = res.data.data;
        this.addForm = res.data.data;
        
      });
    },
    // 导入
    handleimport: function () {
      let file = this.$refs.filebox.files[0];
      
      var random = new Date().getTime().toString();
      let formData = new FormData();
      formData.append("file", file);
      axios
        .post("/system/payment/import?t=" + random, formData, {
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
        this.multion.push(data[i].id);
      }
      console.log(this.multion);
    },
    // 导出
    handlexport: function () {
      if (this.multion.length > 0) {
        let url =
          "/system/payment/export?ids="+this.multion.join(',');
        this.comjs.downfile(url);
      } else {
        this.$message({
          message: "至少勾选一条数据",
          type: "info",
        });
      }
    },
    // 取消
    handlecancel: function (type) {
      if (type == "0") {
        this.adddialog = false;
        this.addForm = {
          integralId:'',
        name:'',
        idCard:'',
        integralYear:'',
        integralNumber:''
        };
      } 
    },
    // 保存
    handleSubmit: function () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          let para = {
            id: this.addForm.id,
            name: this.addForm.name,
            idCard: this.addForm.idCard,
            status: this.addForm.status,
            paymentYear	: this.addForm.paymentYear	,
          };
          if (this.addForm.id) {
            paymentUpdate(para).then((res) => {
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
            paymentAdd(para).then((res) => {
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
    // 下载导入模版
    handledown: function () {
      let url = "/system/payment/download";
      this.comjs.downfile(url);
    },
  },
};
</script>

<style>
</style>