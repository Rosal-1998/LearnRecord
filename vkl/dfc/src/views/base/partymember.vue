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
      <div class="m-search" style="margin-top: 0.083rem; float: left">
        <el-form :model="filters" :inline="true" ref="filters">
          <el-form-item label="所属党组织" prop="organizationId">
            <el-select v-model="filters.organizationId">
              <el-option
                :value="item.organizationId"
                :label="item.name"
                :key="index"
                v-for="(item, index) in organizationList"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="党员类型" prop="partyMemberType">
            <el-select v-model="filters.partyMemberType">
              <el-option
                :value="item.value"
                :label="item.label"
                :key="index"
                v-for="(item, index) in partyMemberTypeList"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="先锋党员" prop="pioneer">
            <el-select v-model="filters.pioneer">
              <el-option
                :value="item.value"
                :label="item.label"
                :key="index"
                v-for="(item, index) in rentstatuss"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="双报到党员" prop="pioneer">
            <el-select v-model="filters.doubleReportingPartyMember">
              <el-option
                :value="item.value"
                :label="item.label"
                :key="index + 'x'"
                v-for="(item, index) in doubleReports"
              ></el-option>
            </el-select>
          </el-form-item> -->
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
          <!-- <el-table-column label="ID" prop="partyMemberId" width="150"> -->
          <el-table-column label="序号" prop="sort" width="150">
          </el-table-column>
          <el-table-column
            label="姓名"
            prop="name"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            label="手机号码"
            prop="phone"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column label="所属党组织" prop="organizationName">
          </el-table-column>
          <el-table-column label="党员类型" prop="">
            <template slot-scope="scope">
              <span class="f-blue" v-if="scope.row.partyMemberType == '1'">正式党员</span>
              <span class="f-blue" v-else-if="scope.row.partyMemberType == '2'">预备党员</span>
              <span class="f-blue" v-else-if="scope.row.partyMemberType == '3'">发展对象</span>
              <span class="f-blue" v-else-if="scope.row.partyMemberType == '4'">积极分子</span>
              <span v-else>/</span>
            </template>
          </el-table-column>
          <el-table-column label="先锋党员" prop="" width="130">
            <template slot-scope="scope">
              <span class="f-blue" v-if="scope.row.pioneer == '0'">是</span>
              <span class="f-gray" v-else-if="scope.row.pioneer == '1'"
                >否</span
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
                :ref="scope.row.partyMemberId"
                placement="top"
                width="160"
                popper-class="popover"
              >
                <p class="del-tip">是否删除该党员信息？</p>
                <div class="pop-btnbox">
                  <span
                    class="cancel-btn"
                    @click="visibleDelCancel(scope.row.partyMemberId)"
                    >取消</span
                  >
                  <span
                    class="ok-btn"
                    @click="visibleDelSubmit(scope.row.partyMemberId)"
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
      <span class="tip">基础信息</span>
      <el-form
        :model="addForm"
        :inline="true"
        ref="addForm"
        :rules="addFormRules"
        class="addform"
        label-postion="right"
        label-width="110px"
      >
        <el-form-item label="所属党组织" prop="organizationId">
          <el-select v-model="addForm.organizationId" placeholder="请选择">
            <el-option
                :value="item.organizationId"
                :label="item.name"
                :key="index"
                v-for="(item, index) in organizationList"
              ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入姓名"></el-input>
          <span class="gljm-btn" @click="addjm">关联居民</span>
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input
            v-model="addForm.idCard"
            placeholder="请输入身份证号"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input
            v-model="addForm.phone"
            placeholder="请输入手机号码"
          ></el-input>
        </el-form-item>
        <el-form-item label="党员类型" prop="partyMemberType">
          <div
            :class="['radio-lst', { active: addForm.partyMemberType == '1' }]"
            @click="handletabtype('1', '4')"
          >
            <i class="dot"></i> 正式党员
          </div>
          <div
            :class="['radio-lst', { active: addForm.partyMemberType == '2' }]"
            @click="handletabtype('2', '4')"
          >
            <i class="dot"></i> 预备党员
          </div>
          <div
            :class="['radio-lst', { active: addForm.partyMemberType == '3' }]"
            @click="handletabtype('3', '4')"
          >
            <i class="dot"></i> 发展对象
          </div>
          <div
            :class="['radio-lst', { active: addForm.partyMemberType == '4' }]"
            @click="handletabtype('4', '4')"
          >
            <i class="dot"></i> 积极分子
          </div>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <div
            :class="['radio-lst', { active: addForm.sex == '0' }]"
            @click="handletabtype('0', '0')"
          >
            <i class="dot"></i> 男
          </div>
          <div
            :class="['radio-lst', { active: addForm.sex == '1' }]"
            @click="handletabtype('1', '0')"
          >
            <i class="dot"></i> 女
          </div>
        </el-form-item>
        <el-form-item label="是否先锋党员" prop="pioneer">
          <div
            :class="['radio-lst', { active: addForm.pioneer == '0' }]"
            @click="handletabtype('0', '1')"
          >
            <i class="dot"></i> 是
          </div>
          <div
            :class="['radio-lst', { active: addForm.pioneer == '1' }]"
            @click="handletabtype('1', '1')"
          >
            <i class="dot"></i> 否
          </div>
        </el-form-item>
        <!-- <el-form-item label="是否双报到党员" prop="pioneer">
          <div
            :class="['radio-lst', { active: addForm.doubleReportingPartyMember == '0' }]"
            @click="handletabtype('0', '5')"
          >
            <i class="dot"></i> 是
          </div>
          <div
            :class="['radio-lst', { active: addForm.doubleReportingPartyMember == '1' }]"
            @click="handletabtype('1', '5')"
          >
            <i class="dot"></i> 否
          </div>
        </el-form-item> -->
        <el-form-item label="序号" prop="phone">
          <el-input
            v-model="addForm.sort"
            placeholder="请输入序号"
          ></el-input>
        </el-form-item>
        <el-form-item label="入党时间" prop="partyJoining">
          <el-input
            v-model="addForm.partyJoining"
            placeholder="请输入入党时间"
          ></el-input>
        </el-form-item>
        <el-form-item label="学历" prop="education">
          <el-input
            v-model="addForm.education"
            placeholder="请输入学历"
          ></el-input>
        </el-form-item>
        <el-form-item label="出生年月" prop="" style="width: 100%">
          <el-date-picker
            v-model="addForm.birth"
            type="month"
            value-format="yyyy-MM"
            placeholder="出生年月">
          </el-date-picker>
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
        <el-form-item label="位置" prop="placeName">
                <el-input
                  v-model="addForm.placeName"
                  placeholder="请选择位置"
                ></el-input>
                <span @click="Longitude">地图选点</span>
              </el-form-item>
        
      </el-form>
      <div class="dialog-foot">
        <span class="btn-cancel" @click="handlecancel('0')">取消</span>
        <span class="btn-save" @click="handleSubmit">保存</span>
      </div>
    </el-dialog>

    <!-- 居民添加 -->
    <el-dialog
      :visible.sync="jmdialog"
      v-if="jmdialog"
      class="g-dialog"
      title="添加居民"
      @close="closeJm"
    >
      <div class="jmbox">
        <div class="m-search">
          <el-form :model="jmfilters" :inline="true" ref="jmfilters">
            <el-form-item label="姓名" prop="">
              <el-input
                v-model="jmfilters.name"
                placeholder="姓名"
              ></el-input>
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
            <el-table-column label="是否来沪人员" prop="">
              <template slot-scope="scope">
                <span class="f-blue" v-if="scope.row.outsider == '0'">是</span>
                <span class="f-gray" v-else-if="scope.row.outsider == '1'"
                  >否</span
                >
                <span v-else="">/</span>
              </template>
            </el-table-column>
            <el-table-column label="居住房屋" prop="room"> </el-table-column>
            <el-table-column label="标签" prop="">
              <template slot-scope="scope">
                <ul
                  class="lab-ul"
                  v-if="scope.row.tags && scope.row.tags.length > 0"
                >
                  <li
                    class="lab-lst"
                    v-for="(item, index) in scope.row.tags"
                    :style="{ color: item.color, borderColor: item.color }"
                  >
                    {{ item.name }}
                  </li>
                </ul>
              </template>
            </el-table-column>
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
        <span class="btn-cancel" @click="handlecancel('3')">取消</span>
        <span class="btn-save" @click="handlejmsubmit">确定</span>
      </div>
    </el-dialog>
    <!-- 详情 -->
    <el-dialog
      :visible.sync="xqdialog"
      v-if="xqdialog"
      class="g-dialog"
      title="党员信息详情"
    >
      <span class="tip">基础信息</span>
      <div class="xq-content">
        
        <div class="xq-lst">
          <span class="name">姓名</span>
          <span class="lab">{{ detailform.name }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">性别</span>
          <span class="lab" v-if="detailform.sex == '0'">男</span>
          <span class="lab" v-else-if="detailform.sex == '1'">女</span>
          <span class="lab" v-else>/</span>
        </div>
        <div class="xq-lst">
          <span class="name">身份证号</span>
          <span class="lab">{{ detailform.idCard }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">电话号码</span>
          <span class="lab">{{ detailform.phone }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">所属党组织</span>
          <span class="lab">{{ detailform.organizationName }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">党员类型</span>
          <span class="lab" v-if="detailform.partyMemberType == '1'">正式党员</span>
          <span class="lab" v-else-if="detailform.partyMemberType == '2'">预备党员</span>
          <span class="lab" v-else-if="detailform.partyMemberType == '3'">发展对象</span>
          <span class="lab" v-else-if="detailform.partyMemberType == '4'">积极分子</span>
        </div>
        <div class="xq-lst">
          <span class="name">党员先锋</span>
          <span class="lab" v-if="detailform.pioneer == '0'">是</span>
          <span class="lab" v-else-if="detailform.pioneer == '1'">否</span>
          <span class="lab" v-else>/</span>
        </div>
        <div class="xq-lst">
          <span class="name">入党年份</span>
          <span class="lab">{{ detailform.partyJoining }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">学历</span>
          <span class="lab">{{ detailform.education }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">出生年月</span>
          <span class="lab">{{ detailform.birth }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">备注</span>
          <span class="lab">{{ detailform.remarks }}</span>
        </div>
        
        <div class="xq-lst" style="width: 100%">
          <span class="name">照片</span>
          <img :src="detailform.photoUrl" class="jmzp" />
        </div>
        <div class="xq-lst">
          <span class="name">居住地址</span>
          <span class="lab">{{ detailform.placeName }}</span>
        </div>
      </div>
    </el-dialog>
    <!-- 经纬度选择 -->
      <el-dialog
        :visible.sync="jxddialog"
        v-if="jxddialog"
        class="g-dialog"
        title="经纬度选择"
        @close="dtclose"
      >
        <span class="tip">请在下方使用鼠标选择地址，完成选择后点击保存</span>
        <!-- <div>范围：请在下方使用鼠标点击点击画出对应河道，完成选择后点击保存</div> -->
        <div class="jwd-content">
          <baidu-map
            style="height: 100%"
            :center="mapCenter"
            :zoom="mapZoom"
            :scroll-wheel-zoom="true"
            ak="baidu-ak"
            @ready="handlerBMap"
          >
          </baidu-map>
        </div>
        <div class="dialog-foot">
          <span class="btn-cancel" @click="dtclose">取消</span>
          <span class="btn-save" @click="dtsubmit">保存</span>
        </div>
      </el-dialog>
  </div>
</template>

<script>
import {
  partyMemberList,
  partyMemberAdd,
  partyMemberUpdate,
  partyMemberDelete,
  partyMemberQuery,
  ResidentList,
  basicOrganizationList
} from "../../api/api.js";
import BaiduMap from "vue-baidu-map/components/map/Map.vue";
import axios from "axios";
export default {
  components: {
    BaiduMap,
  },
  data() {
    return {
      filters: {
        organizationId:'',
        name:'',
        partyMemberType:'',
        pioneer:'',
        // doubleReportingPartyMember: '',
        size: 10,
        current: 1,
      },
      doubleReports: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '是',
          value: '0'
        },
        {
          label: '否',
          value: '1'
        },
      ],
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
        partyMemberId: "", //党员id
        photo: "", //照片
        photoUrl: "url('../img/empty.png') no-repeat",
        name: "", //姓名
        sex: "0", //性别
        idCard: "", //身份证
        pioneer: "0", //是否党员先锋
        partyJoining: "", //入党年份
        birth:'',  //出生年月
        education: "", //学历
        phone: "", //联系方式
        remarks:'', //备注
        partyMemberType: "1", //党员类型
        honor: "", //获得荣誉
        longitude:'', //经度
        latitude:'',//纬度
        placeName:'',//居住点名称
        organizationId:'' , //所属党组织
        residentId:'', //居民id
        sort: '', // 序号
        doubleReportingPartyMember: '' // 双报到党员
      },
      residential: false,
      addFormRules: {
        name: [{ required: true, message: "请输入", trigger: "blur" }],
        organizationId:[{ required: true, message: "请选择所属党组织", trigger: "change" }],
        idCard:[{ required: true, message: "请输入身份证号", trigger: "blur" }],
        partyMemberType:[{ required: true, message: "请选择党员类型", trigger: "change" }],
        sex:[{ required: true, message: "请选择性别", trigger: "change" }],
        pioneer:[{ required: true, message: "请选择是否为先锋党员", trigger: "change" }],
        placeName:[{ required: true, message: "请选择居住地点", trigger: "change" }],
      },
      editflag: false,
      hideimg: false,
      jmdialog: false,
      jmfilters: {
        name: "",
        tags: "",
        size: 10,
        current: 1,
      },
      jmlist: [],
      bqdialog: false,
      housedialog: false,
      houserlist: [],
      hotfilters: {
        name: "",
      },
      current: "0",
      gxcur: "-1",
      roomlist: [],
      roomId: [],
      roomNo: [],
      gxfloor: [],
      qzname: "",
      xqdialog: false,
      detailform: {},
      multion: [],
      gxlabbox: [],
      cardialog: false,
      carlist: [],
      carxqdialog: false,
      cardetailform: {},
      formItemKey: 0,
      rentstatus: [
        {
          value: 0,
          label: "是",
        },
        {
          value: 1,
          label: "否",
        },
      ],
	  rentstatuss:[
		{
          value: "0",
          label: "是",
        },
        {
          value: "1",
          label: "否",
        },
	  ],
    organizationList:[],
    partyMemberTypeList:[
		{
          value: "1",
          label: "正式党员",
        },
        {
          value: "2",
          label: "预备党员",
        },
        {
          value: "3",
          label: "发展对象",
        },
        {
          value: "4",
          label: "积极分子",
        },
	  ],
    jxddialog:false,
    mapZoom: 13,
      mapCenter: {
        //青原
        lng: 115.01747,
        lat: 27.10577,
      },
      mapbox: {},
      placeName:''
    };
  },
  mounted() {
    this.getlist(1);
    this.Organization();
  },
  methods: {
    // 单行变色
    tableRowClassName: function (rowIndex) {
      if (rowIndex.rowIndex % 2 != 0) {
        return "evenRow";
      }
      return "oddRow";
    },
    // 获取所属党组织
    Organization(){
      basicOrganizationList().then((res) =>{
        console.log(res);
        this.organizationList = res.data
      })
    },
    // 列表
    getlist: function (val) {
      let para = {
        organizationId:this.filters.organizationId,
        partyMemberType:this.filters.partyMemberType,
        doubleReportingPartyMember:this.filters.doubleReportingPartyMember,
        pioneer:this.filters.pioneer,
        name: this.filters.name,
        pageSize: this.filters.size,
        pageNum: this.filters.current,
      };
      if (val) {
        para.pageNum = val;
        this.currentPage1 = val;
      }
      partyMemberList(para).then((res) => {
        this.datalist = res.data.rows;
        this.total = res.data.total;
      });
    },
    // 重置
    resetForm: function (filters) {
      this.$refs.filters.resetFields();
      this.filters = {
        organizationId:'',
        name:'',
        partyMemberType:'',
        pioneer:'',
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
      partyMemberDelete(id).then((res) => {
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
      this.diatitle = "添加党员信息";
      this.addForm = {
        partyMemberId: "", //党员id
        photo: "", //照片
        photoUrl: "url('../img/empty.png') no-repeat",
        name: "", //姓名
        sex: "0", //性别
        idCard: "", //身份证
        pioneer: "0", //是否党员先锋
        partyJoining: "", //入党年份
        birth:'',  //出生年月
        education: "", //学历
        phone: "", //联系方式
        remarks:'', //备注
        partyMemberType: "1", //党员类型
        honor: "", //获得荣誉
        longitude:'', //经度
        latitude:'',//纬度
        placeName:'',//居住点名称
        organizationId:'' , //所属党组织
        residentId:'', //居民id
        sort: '', // 序号
        doubleReportingPartyMember: '' // 双报到党员
      };
      this.gxfloor = [];

      this.editflag = false;
    },
    // 编辑
    handlEdit: function (row) {
      this.adddialog = true;
      this.diatitle = "编辑党员信息";
      this.getDetail(row.partyMemberId);
    },
    // 详情
    handleDetail: function (row) {
      this.xqdialog = true;
      this.getDetail(row.partyMemberId);
    },
    // 详情接口
    getDetail: function (id) {
      partyMemberQuery(id).then((res) => {
        console.log(res.data.data, "101001");
        this.detailform = res.data.data;
        this.addForm = res.data.data;
        if (
          this.addForm.photoUrl == "" ||
          this.addForm.photoUrl == null
        ) {
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
      let url = "/basic/partyMemberInfo/download";
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
        .post("/basic/partyMemberInfo/import?t=" + random, formData, {
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
        this.multion.push(data[i].partyMemberId);
      }
      console.log(this.multion.join(","));
    },
    // 导出
    handlexport: function () {
      if (this.multion.length > 0) {
        let url =
          "/basic/partyMemberInfo/export?id=" +this.multion.join(",");
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
    // 选择性别、户主、外来人员
    handletabtype: function (val, type) {
      if (type == "0") {
        this.addForm.sex = val;
      } else if (type == "1") {
        this.addForm.pioneer = val;
      } else if (type == "4") {
        this.addForm.partyMemberType = val;
      } else {
        this.addForm.doubleReportingPartyMember = val;
      }
    },
    // 地图选点弹框
    Longitude() {
      this.jxddialog = true;
    },
    // 初始化地图
    handlerBMap: function ({ BMap, map }) {
      var point = new BMap.Point(121.7057, 31.232451); // 上海合庆镇东风村
      map.centerAndZoom(point, 16);
      this.mapbox = { BMap, map };
      map.addEventListener("click", ({ point }) => {
        console.log(point);
        var marker = new BMap.Marker(point); // 创建标注
        map.addOverlay(marker); // 将标注添加到地图中
        this.addForm.longitude = point.lng;
        this.addForm.latitude =point.lat;
        var aa = new BMap.Geocoder();
        aa.getLocation(point,(re)=>{
            this.placeName=re.address
        })
      });
    },
    // 地图弹框关闭
    dtclose: function () {
      this.addForm.longitude='';
      this.addForm.latitude='';
      this.placeName='';
      this.jxddialog = false;
    },
    // 地图保存
    dtsubmit(){
        this.addForm.placeName=this.placeName;
        this.jxddialog = false;
    },
    // 取消
    handlecancel: function (type) {
      if (type == "0") {
        this.adddialog = false;
        this.addForm = {
          partyMemberId: "", //党员id
          photo: "", //照片
          photoUrl: "url('../img/empty.png') no-repeat",
          name: "", //姓名
          sex: "0", //性别
          idCard: "", //身份证
          pioneer: "0", //是否党员先锋
          partyJoining: "", //入党年份
          birth:'',  //出生年月
          education: "", //学历
          phone: "", //联系方式
          remarks:'', //备注
          partyMemberType: "1", //党员类型
          honor: "", //获得荣誉
          longitude:'', //经度
          latitude:'',//纬度
          placeName:'',//居住点名称
          organizationId:'' , //所属党组织
          residentId:'', //居民id
          sort: '', // 序号
          doubleReportingPartyMember: '' // 双报到党员
        };
      } else if (type == "1") {
        this.bqdialog = false;
      } else if (type == "2") {
        this.housedialog = false;
        this.gxfloor = [];
        this.hotfilters.name = null;
      } else {
        this.jmdialog = false;
        this.resetjm();
      }
    },
    // 保存
    handleSubmit: function () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          let para = {
            partyMemberId: this.addForm.partyMemberId,
            organizationId: this.addForm.organizationId,
            name: this.addForm.name,
            idCard: this.addForm.idCard,
            phone: this.addForm.phone,
            partyMemberType: this.addForm.partyMemberType,
            sex: this.addForm.sex,
            pioneer: this.addForm.pioneer,
            partyJoining: this.addForm.partyJoining,
            education: this.addForm.education,
            birth: this.addForm.birth,
            photo: this.addForm.photo,
            remarks: this.addForm.remarks,
            residentId: this.addForm.residentId,
            longitude: this.addForm.longitude,
            latitude: this.addForm.latitude,
            placeName: this.addForm.placeName,
            sort: this.addForm.sort,
            doubleReportingPartyMember: this.addForm.doubleReportingPartyMember
          };
          if (this.addForm.partyMemberId) {
            partyMemberUpdate(para).then((res) => {
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
            partyMemberAdd(para).then((res) => {
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

    // 选择颜色
    selectColors(event) {
      console.log(event, "evnet");
    },
    // 失去焦点
    inputBlur(event, row) {
      console.log(row, "11");
      // row.status = '1'
    },

    //  添加居民
    addjm: function () {
      this.jmdialog = true;
      this.getjm();
    },
    // 添加居民房主关闭事件
    closeJm: function () {
      this.resetjm();
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
      ResidentList(para).then((res) => {
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
      this.getjm(1);
    },
    // 居民选择分页
    handleSizeChange1: function (size) {
      this.pagesize1 = size;
      this.jmfilters.size = size;
      this.getjm("");
    },
    // 居民选择分页
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
      console.log(selection[0]);
      this.addForm.name = selection[0].name;
    },
    // 选择人员全选
    selectAll(selection) {
      if (selection.length > 1) {
        selection.length = 1;
      }
      this.addForm.name = selection[0].name;
    },
    // 居民确认
    handlejmsubmit: function () {
      this.jmdialog = false;
      this.resetjm();
    },
  },
};
</script>

<style>
</style>