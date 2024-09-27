<template>
  <div class="g-cont">
    <div class="m-contain">
      <span class="btn add-btn" @click="handleAdd">新增</span>
      <span class="btn down-btn" @click="downlayout">下载导入模版</span>
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
      <div class="m-search">
        <el-form :model="filters" :inline="true" ref="filters">
          <el-form-item label="所有人" prop="vehicleOwner">
            <el-input
              v-model="filters.vehicleOwner"
              placeholder="所有人"
            ></el-input>
          </el-form-item>
          <el-form-item label="车牌号" prop="vehicleNo">
            <el-input
              v-model="filters.vehicleNo"
              placeholder="车牌号"
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
          <el-table-column label="ID" prop="vehicleId" width="80">
          </el-table-column>
          <el-table-column label="车辆所有人" prop="vehicleOwner">
          </el-table-column>
          <el-table-column label="联系方式" prop="phone"> </el-table-column>
          <el-table-column label="车牌号" prop="vehicleNo"> </el-table-column>
          <el-table-column
            label="车辆类型"
            prop="type"
            :formatter="cartypeformat"
          >
          </el-table-column>
          <el-table-column label="车辆信息" prop="">
            <template slot-scope="scope">
              <span class="detail-title" @click="handleDetail(scope.row)"
                >查看</span
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="">
            <template slot-scope="scope">
              <span class="edit-title" @click="handlEdit(scope.row)">编辑</span
              >&nbsp;&nbsp;
              <el-popover
                :ref="scope.row.vehicleId"
                placement="top"
                width="160"
                popper-class="popover"
              >
                <p class="del-tip">是否删除该车辆信息？</p>
                <div class="pop-btnbox">
                  <span
                    class="cancel-btn"
                    @click="visibleDelCancel(scope.row.vehicleId)"
                    >取消</span
                  >
                  <span
                    class="ok-btn"
                    @click="visibleDelSubmit(scope.row.vehicleId)"
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
      @closed="adddialogClosed"
      v-show="adddialog"
      class="g-dialog"
      :title="diatitle"
      label-postion="right"
    >
      <span class="tip">基础信息</span>
      <el-form
        :model="addForm"
        :inline="true"
        ref="addForm"
        :rules="addFormRules"
        class="addform add-signcent"
        label-postion="right"
        label-width="80px"
      >
        <el-form-item label="车辆所有人" prop="vehicleOwner">
          <span class="choose-btn" @click="handlegl">关联</span>
          <el-input
            v-model="addForm.vehicleOwner"
            style="display: none"
          ></el-input>
          <div class="gxlist" v-if="addForm.vehicleOwner">
            <span class="gx-name">{{ addForm.vehicleOwner }}</span>
            <i class="del-gx" @click="delglr">删除</i>
          </div>
        </el-form-item>
        <el-form-item label="车辆所属房屋" prop="vehicleHouse">
          <el-input
            v-model="addForm.vehicleHouse"
            placeholder="请输入车辆所属房屋"
          ></el-input>
        </el-form-item>
        <el-form-item label="车牌号" prop="vehicleNo">
          <el-input
            v-model="addForm.vehicleNo"
            placeholder="请输入车牌号"
          ></el-input>
        </el-form-item>
        <el-form-item label="车辆类型" prop="type">
          <el-select v-model="addForm.type" placeholder="请选择车辆类型">
            <el-option
              :label="item.dictLabel"
              :value="item.dictValue"
              v-for="(item, index) in cartypelist"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="车辆图片"
          prop=""
          style="width: 100%"
          class="delbgimg"
          :key="formItemKey"
        >
          <div
            class="upimgbox"
            :style="{ backgroundImage: 'url(' + addForm.vehicleImgFile + ')' }"
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
    <!-- 关联车辆所有人 -->
    <el-dialog
      :visible.sync="jmdialog"
      v-show="jmdialog"
      class="g-dialog"
      title="添加居民"
    >
      <div class="jmbox">
        <div class="m-search">
          <el-form :model="jmfilters" :inline="true" ref="jmfilters">
            <el-form-item label="姓名/户主姓名" prop="name">
              <el-input
                v-model="jmfilters.name"
                placeholder="姓名/户主姓名"
              ></el-input>
            </el-form-item>
            <el-form-item label="标签" prop="tages">
              <el-input v-model="jmfilters.tags" placeholder="标签"></el-input>
            </el-form-item>
            <div class="search-btnbox">
              <span class="btn search-btn" @click="getjm()">查询</span>
              <span class="btn reset-btn" @click="resetjm('jmfilters')"
                >重置</span
              >
            </div>
          </el-form>
        </div>
        <div class="m-table">
          <el-table
            :data="jmlist"
            ref="multipleTable"
            highlight-current-row
            v-loading="listLoading"
            style="width: 100%"
            border
            :row-class-name="tableRowClassName"
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }"
            @select="select"
            @select-all="selectAll"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="ID" prop="residentId" width="80">
            </el-table-column>
            <el-table-column label="姓名" prop="name"> </el-table-column>
            <el-table-column label="性别" prop="">
              <template slot-scope="scope">
                <span class="f-blue" v-if="scope.row.sex == '0'">男</span>
                <span class="f-gray" v-else-if="scope.row.sex == '1'">女</span>
                <span v-else="">/</span>
              </template>
            </el-table-column>
            <el-table-column label="是否户主" prop="">
              <template slot-scope="scope">
                <span class="f-blue" v-if="scope.row.houseHolder == '0'"
                  >是</span
                >
                <span class="f-gray" v-else-if="scope.row.houseHolder == '1'"
                  >否</span
                >
                <span v-else="">/</span>
              </template>
            </el-table-column>
            <el-table-column label="户主" prop="residentName">
            </el-table-column>
            <el-table-column label="是否外来人员" prop="">
              <template slot-scope="scope">
                <span class="f-blue" v-if="scope.row.outsider == '0'">是</span>
                <span class="f-gray" v-else-if="scope.row.outsider == '1'"
                  >否</span
                >
                <span v-else="">/</span>
              </template>
            </el-table-column>
            <el-table-column label="居住房屋" prop="room"> </el-table-column>
            <el-table-column label="标签" prop="tag"> </el-table-column>
          </el-table>
          <div class="m-pagination">
            <el-pagination
              background
              @size-change="handleSizeChange1"
              @current-change="handleCurrentChange1"
              :current-page="currentPage2"
              :page-size="pagesize1"
              layout="prev, pager, next"
              :current-page.sync="currentPage3"
              prev-text="上一页"
              next-text="下一页"
              :total="total1"
            >
            </el-pagination>
            <i class="total">共有{{ total1 }}条数据</i>
          </div>
        </div>
      </div>
      <div class="dialog-foot">
        <span class="btn-cancel" @click="handlecancel('1')">取消</span>
        <span class="btn-save" @click="handleuserSubmit">保存</span>
      </div>
    </el-dialog>
    <!-- 详情 -->
    <el-dialog
      :visible.sync="xqdialog"
      v-show="xqdialog"
      class="g-dialog min-dia642"
      title="车辆详情"
      @close="carDialogClose()"
    >
      <span class="tip">基础信息</span>
      <div class="xq-content car-detail">
        <div class="xq-lst">
          <span class="name">车辆所有人</span>
          <span class="lab">{{ detailform.vehicleOwner }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">车辆所属房屋</span>
          <span class="lab">{{ detailform.vehicleHouse }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">车牌号</span>
          <span class="lab">{{ detailform.vehicleNo }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">车辆类型</span>
          <span class="lab">{{ detailform.typeName }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">照片</span>
          <img
            v-if="detailform.vehicleImgFile || editflag"
            :src="detailform.vehicleImgFile"
            class="carimg"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import {
  VehicleList,
  AddVehicle,
  UpdateVehicle,
  DelVehicle,
  VehiclefindById,
  DictType,
  HouseholdInfo,
  OwnerList,
  ResidentList
} from "../../api/api.js";
export default {
  data() {
    return {
      filters: {
        vehicleNo: "",
        vehicleOwner: "",
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
        vehicleId: "", //
        vehicleOwner: "", //车辆所有人
        vehicleHouse: "", //所属房屋
        vehicleNo: "", //车牌号
        type: "", //车辆类型
        vehicleImg: "", //车辆照片id
        vehicleImgFile: "", //车辆照片url
      },
      addFormRules: {
        vehicleOwner: [
          { required: true, message: "请选择车辆所有人", trigger: "blur" },
        ],
        vehicleNo: [
          { required: true, message: "请输入车牌号", trigger: "blur" },
        ],
      },
      imgflag: false,
      xqdialog: false,
      jmdialog: false,
      jmfilters: {
        name: "",
        tags: "",
        size: 10,
        current: 1,
      },
      jmlist: [],
      detailform: {},
      cartypelist: [],
      editflag: false,
      multion: [],
      residentId: "",
      roomId: "",
      formItemKey: 0,
    };
  },
  mounted() {
    this.getlist("");
    this.getdict("car_type");
  },
  methods: {
    // 车辆详情关闭
    carDialogClose(){
      this.detailform = {}
    },

    // 字典
    getdict: function (val) {
      DictType(val).then((res) => {
        let data = res.data.data;
        console.log(data, "100101");
        this.cartypelist = res.data.data;
      });
    },
    // 车辆类型转换
    cartypeformat: function (row, column) {
      for (var i = 0; i < this.cartypelist.length; i++) {
        if (row.type == this.cartypelist[i].dictValue) {
          return this.cartypelist[i].dictLabel;
        }
      }
    },
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
        vehicleNo: this.filters.vehicleNo,
        vehicleOwner: this.filters.vehicleOwner,
        pageSize: this.filters.size,
        pageNum: this.filters.current,
      };
      if (val) {
        para.pageNum = val;
        this.currentPage1 = val;
      }
      VehicleList(para).then((res) => {
        console.log('列表',res)
        this.datalist = res.data.rows;
        this.total = res.data.total;
      });
    },
    // 重置
    resetForm: function (filters) {
      this.$refs.filters.resetFields();
      this.filters = {
        vehicleNo: "",
        vehicleOwner: "",
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
      console.log("----id", id);
      this.$refs[id].doClose();
    },
    // 删除 确定
    visibleDelSubmit(id) {
      DelVehicle(id).then((res) => {
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
    // 下载模版
    downlayout: function () {
      let url = "/basic/vehicle/download";
      this.comjs.downfile(url);
    },
    // 导入
    handleimport: function (event) {
      let file = this.$refs.filebox.files[0];
      var random = new Date().getTime().toString();
      let formData = new FormData();
      formData.append("file", file);
      axios
        .post("/basic/vehicle/import?t=" + random, formData, {
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
        this.multion.push(data[i].vehicleId);
      }
    },
    // 导出
    handlexport: function () {
      if (this.multion.length > 0) {
        let url = "/basic/vehicle/exportByIds/" + this.multion.join(",");
        this.comjs.downfile(url);
      } else {
        this.$message({
          message: "至少勾选一条数据",
          type: "info",
        });
      }
    },
    // 新增
    handleAdd: function () {
      this.adddialog = true;
      this.diatitle = "添加车辆";
      this.addForm = {
        vehicleId: "", //
        vehicleOwner: "", //车辆所有人
        vehicleHouse: "", //所属房屋
        vehicleNo: "", //车牌号
        type: "", //车辆类型
        vehicleImg: "", //车辆照片id
        vehicleImgFile: "url('../img/empty.png') no-repeat", //车辆照片url
      };
      this.editflag = false;
    },

    // 图片上传
    choosefile: function (event, type) {
      let file = this.$refs.file.files[0];
      console.log(file, "010100");
      this.uploadfile(file, type);
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
            this.addForm.vehicleImgFile = res.data.data.url;
            this.addForm.vehicleImg = res.data.data.ossId;
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
        console.log("---0---");
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
            vehicleId: this.addForm.vehicleId, //
            // residentId: this.residentId,
            // vehicleOwner: this.addForm.vehicleOwner, //车辆所有人
            // vehicleHouse: this.addForm.vehicleHouse, //所属房屋
            vehicleNo: this.addForm.vehicleNo, //车牌号
            type: this.addForm.type, //车辆类型
            vehicleImg: this.addForm.vehicleImg, //车辆照片id
            residentId: this.addForm.residentId,
            // roomId: this.roomId,
          };
				
					console.log('-----请求参数-----',para)
          if (this.addForm.vehicleId) {
            UpdateVehicle(para).then((res) => {
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
            AddVehicle(para).then((res) => {
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
    // 查看
    handleDetail: function (row) {
      this.xqdialog = true;
      console.log("----点击查看了---");
      let isEdit = false;
      this.getDetail(row.vehicleId);
    },
    // 详情
    getDetail: function (id) {
      VehiclefindById(id).then((res) => {
        console.log(res.data.data);
        this.detailform = { ...res.data.data };
        this.addForm = { ...res.data.data };
        if (
          this.addForm.vehicleImgFile == "" ||
          this.addForm.vehicleImgFile == null
        ) {
          console.log("---?---");
          console.log("还没请求前", this.detailform);
          this.addForm.vehicleImgFile = require("@/assets/img/empty.png");
          console.log("请求后", this.detailform);
        } else {
          this.editflag = true;
        }
      });
    },

    // 编辑
    handlEdit: function (row) {
      this.editflag = true;
      this.adddialog = true;
      this.diatitle = "编辑车辆";
      this.getDetail(row.vehicleId);
      console.log(row.vehicleId, 1000);
    },
    // 删除图片
    handlesyimg: function () {
      this.addForm.vehicleImgFile = require("@/assets/img/empty.png");
      this.editflag = false;
			this.addForm.vehicleImg = ''
      // 更新key，强制el-form-item 重新渲染
      this.formItemKey += 1;
    },
    // 关联
    handlegl: function () {
      this.jmdialog = true;
      this.jmfilters = {
        name: "",
        tags: "",
        size: 10,
        current: 1,
      };
      this.getjm();
    },

    // 查看居民
    getjm: function (val) {
      let para = {
        name: this.jmfilters.name,
        tags: this.jmfilters.tags,
        pageSize: this.jmfilters.size,
        pageNum: this.jmfilters.current,
      };
      if (val) {
        para.pageNum = val;
        this.currentPage3 = val;
      }
      //
  ResidentList(para).then((res) => {
        // HouseholdInfo(para).then((res) => {
        console.log(res, "kkk");
        this.jmlist = res.data.data;
        this.total1 = res.data.total;
      });
    },
    // 重置人员
    resetjm: function (filters) {
      this.$refs.jmfilters.resetFields();
      this.jmfilters = {
        name: "",
        tags: "",
        size: 10,
        current: 1,
      };
      this.getjm();
    },
    // 关联所有人选择分页
    handleSizeChange1: function (size) {
      this.pagesize1 = size;
      this.jmfilters.size = size;
      this.getjm("");
    },
    // 关联所有人选择分页
    handleCurrentChange1: function (val) {
      this.jmfilters.current = val;
      this.getjm(val);
    },
    // 选择人员
    select(selection, row) {
      if (selection.length > 1) {
        let del_row = selection.shift();
        console.log(del_row, "del_rowdel_row");
        this.$refs.multipleTable.toggleRowSelection(del_row, false);
      }
      console.log(selection, "selectionselection");
      this.addForm.vehicleOwner = selection[0].name;
      this.addForm.vehicleHouse = selection[0].room;
      this.addForm.residentId = selection[0].residentId;
      // this.residentId = selection[0].residentId;
      this.roomId = selection[0].roomId;
    },
    // 选择人员全选
    selectAll(selection) {
      if (selection.length > 1) {
        selection.length = 1;
      }
      this.addForm.vehicleOwner = selection[0].name;
      this.addForm.vehicleHouse = selection[0].room;
      console.log(selection, "selectionselection");
      this.residentId = selection[0].residentId;
      this.roomId = selection[0].roomId;
    },
    // 删除关联人
    delglr: function () {
      this.addForm.vehicleOwner = "";
    },
    // 人员保存
    handleuserSubmit: function (e) {
      console.log('---人员保存1',this.multipleTable)
      this.jmdialog = false;
      this.$nextTick(() => {
        
        // this.$refs.addForm.validateField("vehicleOwner");
      });
      // console.log('---人员保存2', this.$refs.addForm.validateField("vehicleOwner"));
    },
    // 监听编辑状态
    adddialogClosed: function () {
      this.editflag = false;
    },

    handleSelectionChange(e){
     console.log('00000000000000',e) 
    }
  },
};
</script>

<style>
</style>