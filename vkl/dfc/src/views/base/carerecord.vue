<template>
  <div class="g-cont">
    <div class="m-contain">
      <!-- <span class="btn add-btn" @click="handleAdd">添加</span> -->
      <span class="btn export-btn" @click="handlexport">导出</span>
      <div class="m-search" style="margin-top: 0.083rem; float: left">
        <el-form :model="filters" :inline="true" ref="filters">
          <el-form-item label="关怀日期" prop="">
            <el-date-picker v-model="filters.caringStartTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
            </el-date-picker
            >至
            <el-date-picker v-model="filters.caringEndTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="身份证号" prop="idCard">
            <el-input
              v-model="filters.idCard"
              placeholder="身份证号"
            ></el-input>
          </el-form-item>
          <el-form-item label="关怀对象姓名" prop="name">
            <el-input v-model="filters.name" placeholder="关怀对象姓名"></el-input>
          </el-form-item>
          <el-form-item label="关怀人员" prop="caringName">
            <el-input v-model="filters.caringName" placeholder="关怀人员"></el-input>
          </el-form-item>
          <el-form-item label="居住房屋" prop="roomName">
            <el-input v-model="filters.roomName" placeholder="居住房屋"></el-input>
          </el-form-item>
          <el-form-item label="年龄" prop="" class="mj">
            <el-input
              v-model="filters.ageStart"
              placeholder="最小"
            ></el-input
            >至<el-input
              v-model="filters.ageEnd"
              placeholder="最大"
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
          <el-table-column label="ID" prop="id" width="80">
          </el-table-column>
          <el-table-column
            label="关怀对象姓名"
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
            label="年龄"
            prop="age"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column label="居住房屋" prop="roomName">
          </el-table-column>
          <el-table-column label="关怀人员" prop="caringName">
          </el-table-column>
          <el-table-column label="关怀日期" prop="caringTime">
          </el-table-column>
          <el-table-column label="关怀描述" prop="describes">
          </el-table-column>
          <el-table-column label="操作" prop="" width="150">
            <template slot-scope="scope">
              <!-- <span class="edit-title" @click="handlEdit(scope.row)">编辑</span
              >&nbsp;&nbsp; -->
              <span class="detail-title" @click="handleDetail(scope.row)"
                >详情</span
              >&nbsp;&nbsp;
              <el-popover
                :ref="scope.row.id"
                placement="top"
                width="160"
                popper-class="popover"
              >
                <p class="del-tip">是否删除该关怀信息？</p>
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
          <el-input v-model="addForm.idCard" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="积分年度" prop="integralYear">
          <el-date-picker
            v-model="addForm.integralYear"
            type="year"
            value-format="yyyy"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="积分" prop="integralNumber">
          <el-input
            v-model="addForm.integralNumber"
            placeholder="请输入"
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
      title="关怀信息详情"
    >
      <div style="font-size:14px; color: #00BEB8; width: 300px; text-align: center;">老人信息</div>
      <div class="xq-content">
        <div class="xq-lst">
          <span class="name">照片</span>
          <img :src="detailform.avatarUrl" class="jmzp" />
        </div>
        <div class="xq-lst">
          <span class="name">姓名</span>
          <span class="lab">{{ detailform.name }} <span class="gljm-btn" @click="jmxq(detailform.residentId)">居民详情</span></span>
          
        </div>
        <div class="xq-lst">
          <span class="name">年龄</span>
          <span class="lab">{{ detailform.age }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">身份证号</span>
          <span class="lab">{{ detailform.idCard }}</span>
        </div>

        <div class="xq-lst">
          <span class="name">居住房屋</span>
          <span class="lab">{{ detailform.roomName }} <span class="gljm-btn" style=" white-space: nowrap;"  v-if="detailform.roomId" @click="roomxq(detailform.roomId)">房间详情</span></span>
        </div>
      </div>
      <div style="font-size:14px; color: #00BEB8; width: 300px; text-align: center;">关怀信息</div>
      <div class="xq-content">
          <div class="xq-lst">
          <span class="name">关怀人员</span>
          <span class="lab">{{ detailform.caringName }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">关怀日期</span>
          <span class="lab">{{ detailform.caringTime }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">关怀描述</span>
          <span class="lab">{{ detailform.describes }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">现场照片</span>
          <li>
            <img :src="detailform.pictureUrl" class="jmzp" />
          </li>
        </div>
        </div>
    </el-dialog>
    <!-- 居民详情弹框 -->
    <el-dialog
      :visible.sync="jmxqdialog"
      v-if="jmxqdialog"
      class="g-dialog"
      title="居民信息详情"
    >
      <span class="tip">基础信息</span>
      <div class="xq-content">
        <div class="xq-lst" style="width: 100%">
          <span class="name">照片</span>
          <img :src="detailform1.residentAvatarFile" class="jmzp" />
        </div>
        <div class="xq-lst">
          <span class="name">姓名</span>
          <span class="lab">{{ detailform1.name }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">性别</span>
          <span class="lab" v-if="detailform1.sex == '0'">男</span>
          <span class="lab" v-else-if="detailform1.sex == '1'">女</span>
          <span class="lab" v-else-if="detailform1.sex == '2'">未知</span>
          <span class="lab" v-else="">/</span>
        </div>
        <div class="xq-lst">
          <span class="name">身份证号</span>
          <span class="lab">{{ detailform1.idCard }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">居住房屋</span>
          <span class="lab">{{ detailform1.room }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">是否户主</span>
          <span class="lab" v-if="detailform1.houseHolder == '0'">是</span>
          <span class="lab" v-else-if="detailform1.houseHolder == '1'">否</span>
          <span class="lab" v-else="">/</span>
        </div>
        <div class="xq-lst">
          <span class="name">户主姓名</span>
          <span class="lab">{{ detailform1.residentName }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">与户主关系</span>
          <span class="lab">{{ detailform1.relationship }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">民族</span>
          <span class="lab">{{ detailform1.nation }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">政治面貌</span>
          <span class="lab">{{ detailform1.politicsFace }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">婚姻状况</span>
          <span class="lab">{{ detailform1.marriage }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">文化程度</span>
          <span class="lab">{{ detailform1.education }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">健康状况</span>
          <span class="lab">{{ detailform1.health }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">户籍</span>
          <span class="lab">{{ detailform1.registered }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">联系方式</span>
          <span class="lab">{{ detailform1.phone }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">工作单位</span>
          <span class="lab">{{ detailform1.workUnit }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">获得荣誉</span>
          <span class="lab">{{ detailform1.honor }}</span>
        </div>
        <div class="xq-lst" style="width: 100%">
          <span class="name">是否来沪人员</span>
          <span class="lab" v-if="detailform1.outsider == '0'">是</span>
          <span class="lab" v-else-if="detailform1.outsider == '1'">否</span>
          <span class="lab" v-else="">/</span>
        </div>
        <div class="xq-lst" style="width: 100%">
          <span class="name">是否办理居住证</span>
          <span class="lab" v-if="detailform1.residencePermit == 'yes'">是</span>
          <span class="lab" v-else-if="detailform1.residencePermit == 'no'"
            >否</span
          >
          <span class="lab" v-else="">/</span>
        </div>
        <div class="xq-lst">
          <span class="name">人员标签</span>
          <ul class="lab-ul">
            <li
              class="lab-lst"
              v-for="(item, index) in lablist"
              :style="{ color: item.color, borderColor: item.color }"
            >
              {{ item.name }}
            </li>
          </ul>
        </div>
        <div class="xq-lst">
          <span class="name">同住人关联</span>
          <ul class="lab-ul">
            <li  @click="handleDetail(item)">
              {{ detailform1.livePeople }}
            </li>
          </ul>
        </div>
      </div>
    </el-dialog>
    <!-- 房间详情弹框 -->
    <el-dialog
      :visible.sync="fjxqdialog"
      v-if="fjxqdialog"
      class="g-dialog"
      title="房间信息详情"
    >
      <span class="tip">基础信息</span>
      <div class="xq-content">
        <div class="xq-lst" style="width: 100%">
          <span class="name">照片</span>
          <img :src="detailform2.roomImgUrl" class="jmzp" />
        </div>
        <div class="xq-lst">
          <span class="name">楼层</span>
          <span class="lab">{{ detailform2.floors }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">面积</span>
          <span class="lab">{{detailform2.area}}</span>
        </div>
        <div class="xq-lst">
          <span class="name">屋主</span>
          <span class="lab">{{ detailform2.homeOwner }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">房屋名称</span>
          <span class="lab">{{ detailform2.homeName }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">房间性质</span>
          <span class="lab">{{ detailform2.nature }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  careRecordList,
  careRecordAdd,
  careRecordUpdate,
  careRecordDelete,
  careRecordQuery,
  ResidentfindById,
  RoomfindById
} from "../../api/api.js";
import axios from "axios";
export default {
  data() {
    return {
      filters: {
        name: "",
        idCard: "",
        roomName: "",
        caringName: "",
        caringStartTime: "",
        caringEndTime:'',
        ageStart:'',
        ageEnd:'',
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
        integralId: "",
        name: "",
        idCard: "",
        integralYear: "",
        integralNumber: "",
      },
      residential: false,
      addFormRules: {
      },
      editflag: false,
      current: "0",
      gxfloor: [],
      xqdialog: false,
      detailform: {},
      detailform1: {},
      detailform2:{},
      multion: [],
      formItemKey: 0,
      jmxqdialog: false,
      lablist:[],
      fjxqdialog:false,
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
        name: this.filters.name,
        idCard: this.filters.idCard,
        roomName: this.filters.roomName,
        caringName: this.filters.caringName,
        caringStartTime: this.filters.caringStartTime,
        caringEndTime:this.filters.caringEndTime,
        ageStart:this.filters.ageStart,
        ageEnd:this.filters.ageEnd,
        pageSize: this.filters.size,
        pageNum: this.filters.current,
      };
      if (val) {
        para.pageNum = val;
        this.currentPage1 = val;
      }
      careRecordList(para).then((res) => {
        this.datalist = res.data.rows;
        this.total = res.data.total;
      });
    },
    // 重置
    resetForm: function (filters) {
      this.$refs.filters.resetFields();
      this.filters = {
        name: "",
        idCard: "",
        roomName: "",
        caringName: "",
        caringStartTime: "",
        caringEndTime:'',
        ageStart:'',
        ageEnd:'',
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
      careRecordDelete(id).then((res) => {
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
      this.diatitle = "添加积分信息";
      this.addForm = {
        integralId: "",
        name: "",
        idCard: "",
        integralYear: "",
        integralNumber: "",
      };
      this.gxfloor = [];

      this.editflag = false;
    },
    // 编辑
    handlEdit: function (row) {
      this.adddialog = true;
      this.diatitle = "编辑积分信息";
      this.getDetail(row.integralId);
    },
    // 详情
    handleDetail: function (row) {
      this.xqdialog = true;
      this.getDetail(row.id);
    },
    // 详情接口
    getDetail: function (id) {
      careRecordQuery(id).then((res) => {
        console.log(res.data.data, "101001");
        this.detailform = res.data.data;
        this.addForm = res.data.data;
      });
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
        let url = "/careRecord/careRecord/export?ids=" + this.multion;
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
          integralId: "",
          name: "",
          idCard: "",
          integralYear: "",
          integralNumber: "",
        };
      }
    },
    // 点击查看居民详情
    jmxq(id){
      this.jmxqdialog=true;
      this.getjm(id)
    },    
    // 居民详情
    getjm(id){
      ResidentfindById(id).then(res =>{
        this.detailform1 = res.data.data;
        this.lablist = res.data.data.tags;
      })
    },
    // 点击查看房间详情
    roomxq(id){
      this.fjxqdialog=true;
      this.getfj(id)
    },
    // 房间详情
    getfj(id){
      RoomfindById(id).then(res =>{
        console.log(res);
        this.detailform2 = res.data.data;
      })
    },
    // 保存
    handleSubmit: function () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          let para = {
            integralId: this.addForm.integralId,
            name: this.addForm.name,
            idCard: this.addForm.idCard,
            integralYear: this.addForm.integralYear,
            integralNumber: this.addForm.integralNumber,
          };
          if (this.addForm.integralId) {
            careRecordUpdate(para).then((res) => {
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
            careRecordAdd(para).then((res) => {
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