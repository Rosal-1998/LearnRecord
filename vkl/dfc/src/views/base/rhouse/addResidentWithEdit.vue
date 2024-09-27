<template>
  <div>
    <el-dialog
      :visible="jmdialog"
      class="g-dialog"
      title="添加居民123"
      @close="handlecancel"
    >
      <div class="jmbox">
        <div class="m-search">
          <div class="add-btnbox">
            <span class="btn search-btn" @click="handleAdd()">添加居民</span>
          </div>
          <el-form :model="jmfilters" :inline="true" ref="jmfilters">
            <el-form-item label="姓名" prop="">
              <el-input v-model="jmfilters.name" placeholder="姓名"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="">
              <el-input
                v-model="jmfilters.phone"
                placeholder="手机号码"
              ></el-input>
            </el-form-item>
            <el-form-item label="身份证号" prop="">
              <el-input
                v-model="jmfilters.idCard"
                placeholder="身份证号"
              ></el-input>
            </el-form-item>
            <div class="search-btnbox">
              <span class="btn search-btn" @click="getList">查询</span>
              <span class="btn reset-btn" @click="resetjm('jmfilters')"
                >重置</span
              >
            </div>
          </el-form>
        </div>
        <div class="m-table">
          <el-table
            :data="datalist"
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
            <el-table-column label="身份证号" prop="idCard" width="200"></el-table-column>
            <el-table-column label="手机号" prop="phone"> </el-table-column>
            <el-table-column label="性别" prop="">
              <template slot-scope="scope">
                <span class="f-blue" v-if="scope.row.sex == '0'">男</span>
                <span class="f-gray" v-else-if="scope.row.sex == '1'">女</span>
                <span v-else>/</span>
              </template>
            </el-table-column>
            <el-table-column label="政治面貌" prop="politicsFace">
            </el-table-column>
            <el-table-column label="所属村" prop="villageName"></el-table-column>
          </el-table>
          <div class="m-pagination">
            <el-pagination
              background
              @current-change="handleCurrentChange"
              :page-size="jmfilters.pageSize"
              layout="prev, pager, next"
              :current-page.sync="jmfilters.pageNum"
              prev-text="上一页"
              next-text="下一页"
              :total="total"
            >
            </el-pagination>
            <i class="total">共有{{ total }}条数据</i>
          </div>
        </div>
      </div>
      <div class="dialog-foot">
        <span class="btn-cancel" @click="handlecancel">取消</span>
        <span class="btn-save" @click="handlejmsubmit">确定</span>
      </div>
    </el-dialog>
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
        <el-form-item label="照片" prop="" class="delbgimg" :key="formItemKey">
          <div
            class="upimgbox"
            :style="{
              backgroundImage: 'url(' + addForm.residentAvatarFile + ')',
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
        <i style="display: block; width: 100%; float: left"></i>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input
            v-model="addForm.idCard"
            placeholder="请输入身份证号"
          ></el-input>
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
        <el-form-item label="是否户主" prop="houseHolder">
          <div
            :class="['radio-lst', { active: addForm.houseHolder == '0' }]"
            @click="handletabtype('0', '1')"
          >
            <i class="dot"></i> 是
          </div>
          <div
            :class="['radio-lst', { active: addForm.houseHolder == '1' }]"
            @click="handletabtype('1', '1')"
          >
            <i class="dot"></i> 否
          </div>
        </el-form-item>
        <el-form-item label="居住房屋" prop="" style="width: 100%">
          <span class="gl-btn" @click="handlegl">关联</span>
          <ul
            class="file-ul"
            v-if="gxfloor.length > 0"
            style="float: left; width: 100%"
          >
            <li v-for="(item, index) in gxfloor" class="file-li">
              <span class="">{{ item.roomNo }}</span>
              <span class="delfile" @click="delfloor(index)">删除</span>
            </li>
          </ul>
        </el-form-item>
        <el-form-item label="户主姓名" prop="" style="width: 100%">
          <span class="gl-btn" @click="addjm">添加居民</span>
          <!-- <div
            class="gxlist"
            v-if="
              addForm.residentName != null && addForm.residentName.length > 0
            "
          >
            <span class="gx-name">{{ addForm.residentName }}</span>
            <i class="del-gx" @click="delglr">删除</i> -->
            <div
            class="gxlist"
            v-if="
              addForm.residentName != null && addForm.residentName.length > 0
            "
          >
            <span class="gx-name">{{ addForm.residentName }}</span>
            <i class="del-gx" @click="delglr">删除</i>
          </div>
        </el-form-item>
        <el-form-item label="与户主关系" prop="relationship">
          <el-input
            v-model="addForm.relationship"
            placeholder="请输入与户主关系"
          ></el-input>
        </el-form-item>
        <el-form-item label="民族" prop="nation">
          <el-input
            v-model="addForm.nation"
            placeholder="请输入民族"
          ></el-input>
        </el-form-item>
        <el-form-item label="政治面貌" prop="politicsFace">
          <el-input
            v-model="addForm.politicsFace"
            placeholder="请输入政治面貌"
          ></el-input>
        </el-form-item>
        <el-form-item label="婚姻状况" prop="marriage">
          <el-input
            v-model="addForm.marriage"
            placeholder="请输入婚姻状况"
          ></el-input>
        </el-form-item>
        <el-form-item label="文化程度" prop="education">
          <el-input
            v-model="addForm.education"
            placeholder="请输入文化程度"
          ></el-input>
        </el-form-item>
        <el-form-item label="健康状况" prop="health">
          <el-input
            v-model="addForm.health"
            placeholder="请输入健康状况"
          ></el-input>
        </el-form-item>
        <el-form-item label="户籍地址" prop="registered">
          <el-input
            v-model="addForm.registered"
            placeholder="请输入户籍地址"
          ></el-input>
        </el-form-item>
        <el-form-item label="居住地派出所" prop="registered">
          <el-input
            v-model="addForm.locationPcs"
            placeholder="请输入居住地派出所"
          ></el-input>
        </el-form-item>
        <el-form-item label="居住地址" prop="registered">
          <el-input
            v-model="addForm.location"
            placeholder="请输入居住地址"
          ></el-input>
        </el-form-item>
        <el-form-item label="户号" prop="registered">
          <el-input
            v-model="addForm.locationHh"
            placeholder="请输入户号"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input
            v-model="addForm.phone"
            placeholder="请输入联系方式"
          ></el-input>
        </el-form-item>
        <el-form-item label="工作单位" prop="workUnit">
          <el-input
            v-model="addForm.workUnit"
            placeholder="请输入工作单位"
          ></el-input>
        </el-form-item>
        <el-form-item label="获得荣誉" prop="honor">
          <el-input
            v-model="addForm.honor"
            placeholder="请输入获得荣誉"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否来沪人员" prop="outsider">
          <div
            :class="['radio-lst', { active: addForm.outsider == '0' }]"
            @click="handletabtype('0', '2')"
          >
            <i class="dot"></i> 是
          </div>
          <div
            :class="['radio-lst', { active: addForm.outsider == '1' }]"
            @click="handletabtype('1', '2')"
          >
            <i class="dot"></i> 否
          </div>
        </el-form-item>
        <el-form-item
          label="是否办理居住证"
          prop="residencePermit"
          v-if="residential"
        >
          <div
            :class="['radio-lst', { active: addForm.residencePermit == 'yes' }]"
            @click="handletabtype('0', '3')"
          >
            <i class="dot"></i> 是
          </div>
          <div
            :class="['radio-lst', { active: addForm.residencePermit == 'no' }]"
            @click="handletabtype('1', '3')"
          >
            <i class="dot"></i> 否
          </div>
        </el-form-item>
        <el-form-item label="人员标签" prop="" style="width: 100%">
          <img
            src="../../../assets/img/addbq.png"
            class="add-img"
            @click="addbq"
          />
          <ul class="lab-ul">
            <li
              class="lab-lst"
              v-for="(item, index) in lablist"
              :style="{ color: item.color, borderColor: item.color }"
            >
              {{ item.name }}
            </li>
          </ul>
        </el-form-item>
      </el-form>
      <div class="dialog-foot">
        <span class="btn-cancel" @click="handlecancel('0')">取消</span>
        <span class="btn-save" @click="handleSubmit">保存</span>
      </div>
    </el-dialog>
     <!-- 房屋选择 -->
     <el-dialog
      :visible.sync="housedialog"
      v-if="housedialog"
      class="g-dialog min-dia642"
      title="房屋选择"
      @close="closeHouse"
    >
      <div class="house-cont">
        <el-form :model="hotfilters" class="user-form" ref="ruleForm">
          <el-form-item label="" prop="orgnName">
            <el-input v-model="hotfilters.name" placeholder="房屋名"></el-input>
          </el-form-item>
          <span class="search-btn" @click="getroomSelect">搜索</span>
        </el-form>
        <div class="user-lt" @scroll="scrollEventFn">
          <ul class="houser-ul">
            <li
              :class="['houser-li', { active: current == index }]"
              v-for="(item, index) in houserlist"
            >
              <span class="home-name" @click="choosehour(index)"
                ><i class="xsj"></i>{{ item.homeName }}</span
              >
              <ul class="floor-ul">
                <li
                  :class="['floor-li', { act: gxcur == index2 }]"
                  v-for="(items, index2) in item.floorsListVos"
                  @click="handlefloor(index, index2, item.floorsListVos)"
                >
                  <span class="floor-name"
                    ><i class="gx"></i>{{ items.floors }}</span
                  >
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div class="user-rt">
          <div class="m-table">
            <el-table
              :data="roomlist"
              ref="dataTable"
              highlight-current-row
              v-loading="listLoading"
              style="width: 100%"
              :row-class-name="tableRowClassName"
              :header-cell-style="{ 'text-align': 'center' }"
              :cell-style="{ 'text-align': 'center' }"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection"></el-table-column>
              <el-table-column label="房号" prop="roomNo"> </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="dialog-foot">
        <span class="btn-cancel" @click="handlecancel('2')">取消</span>
        <span class="btn-save" @click="handlehouseSubmit">确定</span>
      </div>
    </el-dialog>
    <!-- 标签选择 -->
    <el-dialog
      :visible.sync="bqdialog"
      v-if="bqdialog"
      class="g-dialog min-dia642"
      title="标签选择"
    >
      <div class="labbox">
        <span class="add-labtn" @click="handleadlab">添加标签</span>
        <div class="m-table">
          <el-table
            :data="lablist"
            highlight-current-row
            v-loading="listLoading"
            style="width: 100%"
            border
            :row-class-name="tableRowClassName"
            :header-cell-style="{ 'text-align': 'center' }"
            @selection-change="handlelab"
            :cell-style="{ 'text-align': 'center' }"
          >
            <el-table-column type="selection" width="80"> </el-table-column>
            <el-table-column label="标签名称" prop="">
              <template slot-scope="scope">
                <span v-if="scope.row.status == '1'">{{ scope.row.name }}</span>
                <el-input
                  v-else=""
                  v-model="scope.row.name"
                  class="min-ipt"
                  @blur="inputBlur($event, scope.row)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="标签颜色" prop="">
              <template slot-scope="scope">
                <el-input
                  type="color"
                  v-model="scope.row.color"
                  @input="selectColors($event)"
                  class="fk"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" prop="">
              <template slot-scope="scope">
                <span
                  class="del-title"
                  v-if="scope.row.status != '0'"
                  @click="dellab(scope.$index)"
                  >删除</span
                >
                <span
                  class="save-title"
                  v-if="scope.row.status == '0'"
                  @click="savelab(scope.row, scope.$index)"
                  >保存&nbsp;&nbsp;</span
                >
                <span
                  class="cancel-title"
                  v-if="scope.row.status == '0'"
                  @click="cancellab(scope.row, scope.$index)"
                  >取消</span
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="dialog-foot">
        <span class="btn-cancel" @click="handlecancel('1')">取消</span>
        <span class="btn-save" @click="handlelabSubmit">保存</span>
      </div>
    </el-dialog>




<!-- 居民添加 -->
<el-dialog
      :visible.sync="jmdialog3"
      v-if="jmdialog3"
      class="g-dialog"
      title="添加居民-未添加"
      @close="closeJm"
    >
      <div class="jmbox">
        <div class="m-search">
          <el-form :model="jmfilters3" :inline="true" ref="jmfilters3">
            <el-form-item label="姓名/户主姓名" prop="">
              <el-input
                v-model="jmfilters3.name"
                placeholder="姓名/户主姓名"
              ></el-input>
            </el-form-item>
            <el-form-item label="标签" prop="">
              <el-input v-model="jmfilters3.tags" placeholder="标签"></el-input>
            </el-form-item>
            <div class="search-btnbox">
              <span class="btn search-btn" @click="getjm3()">查询</span>
              <span class="btn reset-btn" @click="resetjm3('jmfilters3')"
                >重置</span
              >
            </div>
          </el-form>
        </div>
        <div class="m-table">
          <el-table
            :data="jmlist3"
            ref="multipleTable"
            highlight-current-row
            v-loading="listLoading3"
            style="width: 100%"
            border
            :row-class-name="tableRowClassName3"
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }"
            @select="select3"
            @select-all="selectAll3"
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
              @size-change="handleSizeChange13"
              @current-change="handleCurrentChange13"
              :current-page="currentPage23"
              :page-size="pagesize13"
              layout="prev, pager, next"
              :current-page.sync="currentPage33"
              prev-text="上一页"
              next-text="下一页"
              :total="total13"
            >
            </el-pagination>
            <i class="total">共有{{ total13 }}条数据</i>
          </div>
        </div>
      </div>
      <div class="dialog-foot">
        <span class="btn-cancel" @click="handlecancel3('3')">取消</span>
        <span class="btn-save" @click="handlejmsubmit3">确定</span>
      </div>
    </el-dialog>


  </div>
  
</template>

<script>
import {
  ResidentList,
  AddResident,
  UpdateResident,
  DelResident,
  ResidentfindById,
  HouseholdInfo,
  RoomTreePages,
  RentCar,
  VehiclefindById,
} from '@/api/api'
import axios from 'axios'
export default {
  props: {
    jmdialog: {
      type: Boolean,
      default: false
    }
    ,
    // jmdialog3: {
    //   type: Boolean,
    //   default: false
    // }
  },
  data() {
    return {
      jmfilters: {
        name: '',
        phone: '',
        idCard: '',
        pageSize: 10,
        pageNum: 1
      },
      datalist: [],
      total: 0,
      listLoading: false,
      jmInfo: {},
      jmInfo3: {},
      filters: {
        registered: '',
        politicsFace: '',
        name: '',
        tags: '',
        size: 10,
        current: 1,
        outsider: '',
        residencePermit: '',
        phone: '',
        yearmax: '',
        yearmin: '',
        location: '',
      },
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
      isEdit: false,
      diatitle: '',
      addForm: {
        residentId: '', //居民id
        residentAvatar: '', //居民头像
        residentAvatarFile: "url('../img/empty.png') no-repeat",
        name: '', //姓名
        sex: '0', //性别
        idCard: '', //身份证
        room: '', //居住房屋
        roomId: '', //居住房屋id
        houseHolder: '', //是否户主
        residentName: '', //户主姓名
        relationship: '', //与户主关系
        nation: '', //民族
        politicsFace: '', //政治面貌
        marriage: '', //婚姻状况
        education: '', //文化程度
        health: '', //健康状况
        registered: '', //户口所在地
        phone: '', //联系方式
        workUnit: '', //工作单位
        honor: '', //获得荣誉
        outsider: '', //是否外来人员
        residencePermit: '', //是否办理居住证
        tags: [], //标签
        locationPcs: '', //居住地派出所
        location: '', //居住地址
        locationHh: '', //户号
      },
      residential: false,
      addFormRules: {
        name: [{ required: true, message: '请输入', trigger: 'blur' }],
        residencePermit: [
          { required: true, message: '请选择是否办理', trigger: 'change' },
        ],
      },
      editflag: false,
      hideimg: false,
      // jmdialog: false,
      jmfilters: {
        name: '',
        tags: '',
        size: 10,
        current: 1,
      },
      jmfilters3: {
        name: '',
        tags: '',
        size: 10,
        current: 1,
      },
      jmlist: [],
      jmlist3: [],
      bqdialog: false,
      lablist: [],
      housedialog: false,
      houserlist: [],
      hotfilters: {
        pageSize: 20,
        pageNum: 1,
        name: '',
      },
      hotfiltersTotal: '',
      current: '0',
      gxcur: '-1',
      roomlist: [],
      roomId: [],
      roomNo: [],
      gxfloor: [],
      qzname: '',
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
          label: '是',
        },
        {
          value: 1,
          label: '否',
        },
      ],
      rentstatuss: [
        {
          value: 'yes',
          label: '是',
        },
        {
          value: 'no',
          label: '否',
        },
      ],
      scrollEventFn: undefined,
      jmdialog3:false,
      listLoading3: false,
      total3: 0,
      total13: 0,
      currentPage3: 1,
      currentPage13: 1,
      currentPage23: 1,
      currentPage33: 1,
      pagesize13: 10,
      pagesize13: 10,
    }
  },
  emits: ['handleCloseAdd','handleAddResident'],
  mounted() {
    this.getList()
    // this.getroom()
    this.scrollEventFn = this.debounce(this.scrollEvent, 100)
  },
  methods: {
    // 单行变色
    tableRowClassName(rowIndex) {
      if (rowIndex.rowIndex % 2 != 0) {
        return "evenRow";
      }
      return "oddRow";
    },
    // 获取列表
    getList() {
      ResidentList(this.jmfilters).then(res => {
        this.datalist = res.data.data;
        this.total = res.data.total;
      });
    },
    handlecancel() {
      this.$emit('handleCloseAdd')
    },
    // 提交
    handlejmsubmit() {
      const length = Object.keys(this.jmInfo).length
      if (length <= 0) {
        this.$message({ 
          message: '请选择人员',
          type: 'error'
        })
        return
      }
      this.$emit('handleAddResident', this.jmInfo)
    },
    // 重置人员
    resetjm() {
      this.$refs.jmfilters.resetFields();
      this.jmfilters = {
        name: '',
        phone: '',
        idCard: '',
        pageSize: 10,
        pageNum: 1
      };
      this.getList()
    },
    // 选择人员
    select(selection) {
      if (selection.length > 1) {
        let del_row = selection.shift();
        this.$refs.multipleTable.toggleRowSelection(del_row, false);
      }
      if (selection.length > 0) {
        // console.log(selection[0]);
        this.jmInfo = {
          residentId: selection[0].residentId,
          name: selection[0].name,
          idCard: selection[0].idCard,
          phone: selection[0].phone,
        }
      } else {
        this.jmInfo = {}
      }
    },
    // 选择人员全选
    selectAll(selection) {
      if (selection.length > 1) {
        selection.length = 1;
      }
      if (selection.length > 0) {
        this.jmInfo = {
          residentId: selection[0].residentId,
          name: selection[0].name,
          idCard: selection[0].idCard
        }
      } else {
        this.jmInfo = {}
      }
    },
    
    // 居民选择分页
    handleCurrentChange (val) {
      this.jmfilters.pageNum = val;
      this.getList()
    },

    // 新添加代码
    // 提交
    handlejmsubmit3() {
      const length = Object.keys(this.jmInfo3).length
      if (length <= 0) {
        this.$message({ 
          message: '请选择人员',
          type: 'error'
        })
        return
      }
      console.log('this.jmInfo3',this.jmInfo3)
      this.addForm.residentName = this.jmInfo3.name
      // this.jmdialog3 = false
      // this.addForm.residentName.push()
      this.$emit('handleAddResident', this.jmInfo3)
    },
    // 重置人员
    resetjm3() {
      this.$refs.jmfilters3.resetFields();
      this.jmfilters3 = {
        name: '',
        phone: '',
        idCard: '',
        pageSize: 10,
        pageNum: 1
      };
      this.getList()
    },
    // 选择人员
    select3(selection) {
      if (selection.length > 1) {
        let del_row = selection.shift();
        this.$refs.multipleTable.toggleRowSelection(del_row, false);
      }
      if (selection.length > 0) {
        // console.log(selection[0]);
        this.jmInfo3 = {
          residentId: selection[0].residentId,
          name: selection[0].name,
          idCard: selection[0].idCard,
          phone: selection[0].phone,
        }
      } else {
        this.jmInfo3 = {}
      }
    },
    // 选择人员全选
    selectAll3(selection) {
      if (selection.length > 1) {
        selection.length = 1;
      }
      if (selection.length > 0) {
        this.jmInfo3 = {
          residentId: selection[0].residentId,
          name: selection[0].name,
          idCard: selection[0].idCard
        }
      } else {
        this.jmInfo3 = {}
      }
    },
     // 单行变色
     tableRowClassName3: function (rowIndex) {
      if (rowIndex.rowIndex % 2 != 0) {
        return 'evenRow'
      }
      return 'oddRow'
    },
    // 列表
    getlist: function (val) {
      // let para = {
      //   registered: this.filters.registered,
      //   politicsFace: this.filters.politicsFace,
      //   name: this.filters.name,
      //   tags: this.filters.tags,
      //   pageSize: this.filters.size,
      //   pageNum: this.filters.current,
      //   outsider: this.filters.outsider,
      //   residencePermit: this.filters.residencePermit,
      //   phone: this.filters.phone,
      //   ageStart: this.filters.yearmin,
      //   ageEnd: this.filters.yearmax,
      //   location: this.filters.location,
      // }
      // if (val) {
      //   para.pageNum = val
      //   this.currentPage1 = val
      // }
      // ResidentList(para).then((res) => {
      //   // console.log('--------',res);
      //   this.datalist = res.data.data
      //   this.total = res.data.total
      // })
    },
    // 重置
    resetForm: function (filters) {
      this.$refs.filters.resetFields()
      this.filters = {
        registered: '',
        politicsFace: '',
        name: '',
        tags: '',
        size: 10,
        current: 1,
        outsider: '',
        residencePermit: '',
        phone: '',
        yearmax: '',
        yearmin: '',
      }
      this.getlist(1)
    },
    // 分页
    handleSizeChange: function (size) {
      this.pagesize = size
      this.filters.size = size
      this.getlist('')
    },
    // 分页
    handleCurrentChange: function (val) {
      this.filters.current = val
      this.getlist(val)
    },
    // 删除 取消
    visibleDelCancel(id) {
      this.$refs[id].doClose()
    },
    // 删除 确定
    visibleDelSubmit(id) {
      DelResident(id).then((res) => {
        if (res.data.code == '200') {
          this.$message({
            message: res.data.msg,
            type: 'success',
          })
        } else {
          this.$message({
            message: res.data.msg,
            type: 'error',
          })
        }
        this.$refs[id].doClose()
        this.getlist(1)
      })
    },
    // 新增
    handleAdd: function () {
      this.adddialog = true
      this.isEdit = false
      this.diatitle = '添加居民信息'
      this.addForm = {
        residentId: '', //居民id
        residentAvatarFile: "url('../img/empty.png') no-repeat", //图地址
        residentAvatar: '', //居民头像
        name: '', //姓名
        sex: '0', //性别
        idCard: '', //身份证
        room: '', //居住房屋
        roomId: '', //居住房屋id
        houseHolder: '0', //是否户主
        residentName: '', //户主姓名
        relationship: '', //与户主关系
        nation: '', //民族
        politicsFace: '', //政治面貌
        marriage: '', //婚姻状况
        education: '', //文化程度
        health: '', //健康状况
        registered: '', //户口所在地
        phone: '', //联系方式
        workUnit: '', //工作单位
        honor: '', //获得荣誉
        outsider: '', //是否外来人员
        residencePermit: '', //是否办理居住证
        tags: [], //标签
        locationPcs: '', //居住地派出所
        location: '', //居住地址
        locationHh: '', //户号
      }
      this.lablist = []
      this.gxfloor = []

      this.editflag = false
    },
    // 编辑
    handlEdit: function (row) {
      this.adddialog = true
      this.isEdit = true
      this.diatitle = '编辑居民信息'
      this.roomNo = []
      this.gxfloor = []
      this.getDetail(row.residentId)
    },
    // 详情
    handleDetail: function (row) {
      this.xqdialog = true
      this.getDetail(row.residentId)
    },
    // 详情接口
    getDetail: function (id) {
      ResidentfindById(id).then((res) => {
        this.detailform = { ...res.data.data }
        this.addForm = { ...res.data.data }
        this.lablist = res.data.data.tags
        // 房间回显
        const roomIds = this.addForm.roomId.split(',')
        const rooms = this.addForm.room.split(',')
        for (var i = 0; i < roomIds.length; i++) {
          this.gxfloor.push({
            roomId: roomIds[i],
            roomNo: rooms[i],
          })
        }
        if (
          this.addForm.residentAvatarFile == '' ||
          this.addForm.residentAvatarFile == null
        ) {
          this.addForm.residentAvatarFile = require('@/assets/img/empty.png')
          this.editflag = false
        } else {
          this.editflag = true
        }
        if (this.addForm.outsider == '0') {
          this.residential = true
        }
      
      })
    },
    // 删除图片
    handlesyimg: function () {
      this.addForm.residentAvatarFile = require('@/assets/img/empty.png')
      this.addForm.residentAvatar = ''
      this.editflag = false
      // 更新key，强制el-form-item 重新渲染
      this.formItemKey += 1
    },
    // 下载导入模版
    handledown: function () {
      let url = '/basic/resident/download'
      this.comjs.downfile(url)
    },
    // 导入、图片上传
    choosefile: function (event, type) {
      // 文件上传
      let file = this.$refs.file1.files[0]
      console.log(file, '010100')
      this.uploadfile(file, type)
    },
    // 文件上传后获取数据
    uploadfile: function (data, type) {
      var random = new Date().getTime().toString()
      let formData = new FormData()
      formData.append('file', data)
      axios
        .post('/system/oss/upload?t=' + random, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.code == 200) {
            // 图片上传后
            this.addForm.residentAvatarFile = res.data.data.url
            this.addForm.residentAvatar = res.data.data.ossId
            this.editflag = true
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error',
            })
          }
        })
        .catch((res) => {
          console.log(res, '2')
        })
    },

    // 导入
    handleimport: function (event) {
      // console.log('this.$refs.file.value',this.$refs.filebox.value)
      let file = this.$refs.filebox.files[0]
      var random = new Date().getTime().toString()
      let formData = new FormData()
      formData.append('file', file)
      axios
        .post('/basic/resident/import?t=' + random, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.$message({
              message: res.data.msg,
              type: 'success',
            })
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error',
            })
          }
          this.getlist(1)
        })
        .catch((res) => {
          console.log(res, '2')
        })
      this.$refs.filebox.value = ''
      // console.log('this.$refs.file.value',this.$refs.filebox.value)
    },
    // 勾选
    handlegx: function (data) {
      console.log(data, '00101')
      this.multion = []
      for (var i = 0; i < data.length; i++) {
        this.multion.push(data[i].residentId)
      }
    },
    // 导出
    handlexport: function () {
      if (this.multion.length > 0) {
        let url =
          'basic/resident/export?name=' +
          this.filters.name +
          '&tags=' +
          this.filters.tags +
          '&residentIds=' +
          this.multion.join(',')
        this.comjs.downfile(url)
      } else {
        this.$message({
          message: '至少勾选一条数据',
          type: 'info',
        })
      }
    },
    // 图片上传
    uploadimg: function (event) {
      let file = this.$refs.file
      console.log(file.files[0], '10100')
    },
    // 选择性别、户主、外来人员
    handletabtype: function (val, type) {
      if (type == '0') {
        this.addForm.sex = val
      } else if (type == '1') {
        this.addForm.houseHolder = val
      } else if (type == '2') {
        this.addForm.outsider = val
        if (val == '0') {
          this.residential = true
        } else {
          this.residential = false
        }
      } else {
        if (val == '0') {
          this.addForm.residencePermit = 'yes'
        } else if (val == '1') {
          this.addForm.residencePermit = 'no'
        }
      }
    },
    // 取消
    handlecancel: function (type) {
      if (type == '0') {
        this.adddialog = false
        this.addForm = {
          residentId: '', //居民id
          residentAvatar: '', //居民头像
          residentAvatarFile: "url('../img/empty.png') no-repeat",
          name: '', //姓名
          sex: '0', //性别
          idCard: '', //身份证
          room: '', //居住房屋
          roomId: '', //居住房屋id
          houseHolder: '', //是否户主
          residentName: '', //户主姓名
          relationship: '', //与户主关系
          nation: '', //民族
          politicsFace: '', //政治面貌
          marriage: '', //婚姻状况
          education: '', //文化程度
          health: '', //健康状况
          registered: '', //户口所在地
          phone: '', //联系方式
          workUnit: '', //工作单位
          honor: '', //获得荣誉
          outsider: '', //是否外来人员
          residencePermit: '', //是否办理居住证
          tags: [], //标签
          locationPcs: '', //居住地派出所
          location: '', //居住地址
          locationHh: '', //户号
        }
      } else if (type == '1') {
        this.bqdialog = false
      } else if (type == '2') {
        this.housedialog = false
        this.gxfloor = []
        this.hotfilters.name = null
        this.hotfilters.pageSize = 20
        this.hotfilters.pageNum = 1
      } else {
        // this.jmdialog = false
        // this.resetjm();
      }
    },
    // 保存
    handleSubmit: function () {
      // console.log('this.gxfloor',this.gxfloor)
      this.roomNo = []
      this.roomId = []
      this.gxfloor.map((item) => {
        this.roomNo.push(item.roomNo)
        this.roomId.push(item.roomId)
      })
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          if (this.roomNo.length > 0) {
            this.addForm.room = this.roomNo.join(',')
          }
          if (this.roomId.length > 0) {
            this.addForm.roomId = this.roomId.join(',')
          }
          let para = {
            residentId: this.addForm.residentId, //居民id
            residentAvatar: this.addForm.residentAvatar, //居民头像
            name: this.addForm.name, //姓名
            sex: this.addForm.sex, //性别
            idCard: this.addForm.idCard, //身份证
            room: this.addForm.room, //居住房屋
            roomId: this.addForm.roomId, //居住房屋id
            houseHolder: this.addForm.houseHolder, //是否户主
            residentName: this.addForm.residentName, //户主姓名
            relationship: this.addForm.relationship, //与户主关系
            nation: this.addForm.nation, //民族
            politicsFace: this.addForm.politicsFace, //政治面貌
            marriage: this.addForm.marriage, //婚姻状况
            education: this.addForm.education, //文化程度
            health: this.addForm.health, //健康状况
            registered: this.addForm.registered, //户口所在地
            phone: this.addForm.phone, //联系方式
            workUnit: this.addForm.workUnit, //工作单位
            honor: this.addForm.honor, //获得荣誉
            outsider: this.addForm.outsider, //是否外来人员
            residencePermit: this.addForm.residencePermit, //是否办理居住证
            tags: this.lablist, //标签
            locationPcs: this.addForm.locationPcs, //居住地派出所
            location: this.addForm.location, //居住地址
            locationHh: this.addForm.locationHh, //户号
          }
          // console.log('para',para)
          if (this.addForm.residentId) {
            UpdateResident(para).then((res) => {
              if (res.code == '200') {
                this.$message({
                  message: res.msg,
                  type: 'success',
                })
              } else {
                this.$message({
                  message: res.msg,
                  type: 'error',
                })
              }
              this.$refs.addForm.resetFields()
              this.adddialog = false
              this.getlist(1)
            })
          } else {
            AddResident(para).then((res) => {
              if (res.code == '200') {
                this.$message({
                  message: res.msg,
                  type: 'success',
                })
              } else {
                this.$message({
                  message: res.msg,
                  type: 'error',
                })
              }
              this.$refs.addForm.resetFields()
              this.adddialog = false
              this.getlist(1)
            })
          }
        }
      })
    },

    // 人员标签
    addbq: function () {
      this.bqdialog = true
    },
    // 添加标签
    handleadlab: function () {
      let obj = {
        name: '',
        color: '',
        status: '0',
      }
      this.lablist.push(obj)
    },
    // 选择颜色
    selectColors(event) {
      console.log(event, 'evnet')
    },
    // 失去焦点
    inputBlur(event, row) {
      console.log(row, '11')
      // row.status = '1'
    },
    // 勾选标签
    handlelab: function (data) {
      this.gxlabbox = data
    },

    // 标签保存
    handlelabSubmit: function () {
      this.bqdialog = false
    },
    // 保存标签
    savelab: function (row, index) {
      row.status = '1'
    },
    // 取消标签
    cancellab: function (row, index) {
      row.name = ''
      row.color = ''
      this.lablist.splice(index, 1)
    },
    // 删除标签
    dellab: function (index) {
      this.lablist.splice(index, 1)
    },

    // 房屋关联
    handlegl: function () {
      this.housedialog = true
      this.getroom()
    },
    // 房屋关联关闭事件
    closeHouse: function () {
      this.hotfilters.name = null
      this.hotfilters.pageSize = 20
      this.hotfilters.pageNum = 1
    },
    // 房屋搜索
    getroomSelect() {
      this.houserlist = []
      this.hotfilters.pageNum = 1
      this.roomlist = []
      this.getroom()
    },
    // 监听滚动到底部
    scrollEvent() {
      const scroll = document.querySelector('.user-lt')
      if (scroll.scrollHeight - scroll.scrollTop - 5 < scroll.clientHeight) {
        const total = this.hotfiltersTotal
        const houserlistL = this.houserlist.length
        if (houserlistL < total) {
          this.hotfilters.pageNum = this.hotfilters.pageNum + 1
          this.getroom()
        }
      }
    },
    debounce(func, delay = 1000, immediate = false) {
      //闭包
      let timer = null
      //不能用箭头函数
      return function () {
        if (timer) {
          clearTimeout(timer)
        }
        if (immediate && !timer) {
          func.apply(this, arguments)
        }
        timer = setTimeout(() => {
          func.apply(this, arguments)
        }, delay)
      }
    },
    // 房屋
    getroom: function () {
      let para = this.hotfilters
      RoomTreePages(para).then((res) => {
        this.houserlist = this.houserlist.concat(res.data.rows)
        this.hotfiltersTotal = res.data.total
      })
    },
    // 选择房屋
    choosehour: function (index) {
      this.gxcur = '-1'
      this.current = index
      this.roomlist = []
      this.$refs.dataTable.clearSelection()
    },
    // 选择楼层
    handlefloor: function (index, index2, data) {
      this.gxcur = ''
      this.current = index
      this.gxcur = index2
      this.roomlist = data[index2].treeVos
    },
    // 勾选房屋房号
    handleSelectionChange: function (data) {
      console.log('--勾选房屋房号--')
      // this.gxfloor = [];
      this.qzname =
        this.houserlist[this.current].homeName +
        '-' +
        this.houserlist[this.current].floorsListVos[this.gxcur].floors
      for (var i = 0; i < data.length; i++) {
        this.gxfloor.push({
          roomId: data[i].roomId,
          roomNo: this.qzname + '-' + data[i].roomNo,
        })
      }
    },
    // 房屋确认
    handlehouseSubmit: function () {
      this.roomId = []
      this.roomNo = []
      for (var i = 0; i < this.gxfloor.length; i++) {
        this.roomId.push(this.gxfloor[i].roomId)
        this.roomNo.push(this.gxfloor[i].roomNo)
      }
      this.housedialog = false
      this.hotfilters.name = null
    },
    // 删除房屋
    delfloor: function (index) {
      this.gxfloor.splice(index, 1)
      this.addForm.room = ''
      this.addForm.roomId = ''
    },

    //  添加居民
    addjm: function () {
      this.jmdialog3= true
      this.roomNo = []
      // this.gxfloor = []
      this.getjm3()
    },
    // 添加居民房主关闭事件
    closeJm: function () {
      this.resetjm()
    },
    // 查看居民
    getjm3: function (val) {
      let para = {
        name: this.jmfilters.name,
        tags: this.jmfilters.tags,
        pageSize: this.jmfilters.size,
        pageNum: this.jmfilters.current,
      }
      if (val) {
        para.pageNum = val
        this.currentPage33 = val
      }
      HouseholdInfo(para).then((res) => {
        console.log(res, 'kkk')
        this.jmlist3 = res.data.rows
        this.total13 = res.data.total
      })
    },
    // 查看居民
    getjm: function (val) {
      let para = {
        name: this.jmfilters.name,
        tags: this.jmfilters.tags,
        pageSize: this.jmfilters.size,
        pageNum: this.jmfilters.current,
      }
      if (val) {
        para.pageNum = val
        this.currentPage3 = val
      }
      HouseholdInfo(para).then((res) => {
        console.log(res, 'kkk')
        this.jmlist = res.data.rows
        this.total1 = res.data.total
      })
    },
    // 重置人员
    resetjm: function (filters) {
      this.$refs.jmfilters.resetFields()
      this.jmfilters = {
        name: '',
        tags: '',
        size: 10,
        current: 1,
      }
      this.getjm(1)
    },
    // 居民选择分页
    handleSizeChange13: function (size) {
      this.pagesize1 = size
      this.jmfilters.size = size
      this.getjm('')
    },
    // 居民选择分页
    handleCurrentChange13: function (val) {
      this.jmfilters.current = val
      this.getjm(val)
    },
    // 选择人员
    select(selection, row) {
      if (selection.length > 1) {
        let del_row = selection.shift()
        // console.log(del_row, "del_rowdel_row");
        this.$refs.multipleTable.toggleRowSelection(del_row, false)
      }
      if (selection.length > 0) {
        this.addForm.residentName = selection[0].name
      } else {
        this.addForm.residentName = ''
      }
    },
    // 选择人员全选
    selectAll(selection) {
      if (selection.length > 1) {
        selection.length = 1
      }
      if (selection.length > 0) {
        this.addForm.residentName = selection[0].name
      } else {
        this.addForm.residentName = ''
      }
    },
    // 删除关联人
    delglr: function () {
      this.addForm.residentName = ''
    },
    // 居民确认
    handlejmsubmit: function () {
      // this.jmdialog = false
      this.resetjm()
    },
    // 点击车辆数量
    handlecar: function (row) {
      this.cardialog = true
      this.getcar(row.residentId)
    },
    // 车辆数量列表
    getcar: function (para) {
      RentCar(para).then((res) => {
        console.log(res, 'cel')
        this.carlist = res.data.data
      })
    },
    // 查看车辆
    handlecardetail: function (row) {
      this.carxqdialog = true
      this.getxqcar(row.vehicleId)
    },
    // 车辆详情
    getxqcar: function (id) {
      VehiclefindById(id).then((res) => {
        this.cardetailform = {}
        this.cardetailform = res.data.data
        if (
          this.cardetailform.vehicleImgFile == '' ||
          this.cardetailform.vehicleImgFile == null
        ) {
          this.cardetailform.vehicleImgFile = require('@/assets/img/empty.png')
        } else {
        }
      })
    },
  }
};
</script>

<style scoped>
.btn {
  width: 80px !important;
}
.search-btnbox {
  display: inline-block;
  /* float: right; */
  float: none !important;
  margin-left: 20px;
}
.add-btnbox {
  float: left;
  margin-right: 10px;
}
.m-search {
  float: none !important;
  display: block !important;
}
</style>