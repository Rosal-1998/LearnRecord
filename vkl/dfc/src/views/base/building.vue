<template>
  <div class="g-cont">
    <div class="tab-cont">
      <div class="tab-ul">
        <div
          :class="[
            ' tab-lst-Transverse tab-lst ',
            { active: current == index },
          ]"
          @click="handletab(index)"
          v-for="(item, index) in sidelist"
          :key="index"
        >
          {{ item.prtSidebarName }}
        </div>
      </div>
    </div>
    <!-- 基本信息 -->
    <div class="m-contain" v-if="current == '0'">
      <div class="promotional-video">
        <div class="video-text">党组织情况介绍</div>
        <div class="video-main" style="margin-top: 30px">
          <quill-editor
            ref="mwQuillEditor1"
            v-model="briefIntroduction"
            class="bjq-tool ql-editors"
          />
        </div>
      </div>
      <div class="promotional-video">
        <div class="video-text">党组织架构图</div>
        <div class="video-main">
          <div class="video-btn">
            <div class="filebox">
              <input
                type="file"
                ref="file"
                class="file1"
                @change="choosefile($event, 0)"
              />
              <span class="upfile-btn">选择上传图片</span>
            </div>
          </div>
          <div class="imgbox" v-if="organizationalChart">
            <div class="videobox">
              <li class="pic-lst">
                <img :src="organizationalChartUrl" class="img" />
                <img
                  src="../../assets/img/shanchu.png"
                  class="scimg"
                  @click="delfile('0')"
                />
              </li>
            </div>
          </div>
        </div>
      </div>

      <div class="savepromotional" style="margin-top: 50px" @click="submit">
        保存
      </div>
    </div>
    <!-- 东风村网络概况 -->
    <div class="m-contain" v-if="current == '1'">
      <div class="g-ltside l-grid">
        <span
          class="btn add-btn"
          style="width: 100%; margin-bottom: 20px"
          @click="handleAddGrid"
          >添加网格</span
        >
        <div class="tab-ul">
          <div class="tab-lst tab-title">
            <div class="l-tab">微网格编号</div>
            <div class="r-tab">覆盖队组（楼组）</div>
          </div>
          <div
            v-for="(item, index) in gridList"
            :class="['tab-lst', { active: currentGrid == index }]"
            @click="handleGridTab(index)"
          >
            <div class="l-tab">
              {{ item.microgridNumber }}
            </div>
            <div class="r-tab">
              {{ item.teamTeam }}
            </div>
          </div>
        </div>
      </div>
      <div class="g-rtside r-grid">
        <div class="info-house">
          <div class="hd">
            <span class="house-title">网格信息</span>
            <span class="btn add-btn" @click="saveGrid">保存</span>
          </div>
          <div class="edit-grid">
            <el-form
            ref="grid"
        :rules="addGridRules"
              label-width="150px"
              :inline="true"
              label-position="right"
              :model="grid"
            >
              <el-form-item label="微网格编号" prop = "microgridNumber">
                <el-input
                  class="input-width"
                  v-model="grid.microgridNumber"
                  placeholder="微网格编号"
                ></el-input>
              </el-form-item>
              <el-form-item label="覆盖队组（楼组）"
              prop = "teamTeam"
              >
                <el-input
                  class="input-width"
                  v-model="grid.teamTeam"
                  placeholder="覆盖队组（楼组）"
                ></el-input>
              </el-form-item>
              <el-form-item label="覆盖户数">
                <el-input
                  class="input-width"
                  v-model="grid.households"
                  placeholder="覆盖户数"
                ></el-input>
              </el-form-item>
              <el-form-item label="覆盖人数">
                <el-input
                  class="input-width"
                  v-model="grid.peopleNumber"
                  placeholder="覆盖人数"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="info-house">
          <div class="hd">
            <span class="house-title">相关人员</span>
            <span v-if="!addGridFlag"  class="btn add-btn" @click="openGridPersonForm">新增</span>
          </div>
          <div class="edit-grid">
            <div class="m-table">
              <el-table
                :data="gridPersonList"
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
                <el-table-column label="类型" prop="">
                  <template slot-scope="scope">{{
                    gridPersonType[scope.row.personnelType - 1]
                  }}</template>
                </el-table-column>
                <el-table-column label="姓名" prop="name"></el-table-column>
                <el-table-column label="职务" prop="post"></el-table-column>
                <el-table-column
                  label="政治面貌"
                  prop="politicalAspects"
                ></el-table-column>
                <el-table-column label="年龄" prop="age"></el-table-column>
                <el-table-column label="操作" prop="">
                  <template slot-scope="scope">
                    <span class="edit-title" @click="editGridPerson
                      (scope.row)"
                      >编辑&nbsp;&nbsp;</span
                    >
                    <el-popover
                      :ref="scope.row.personnelId"
                      placement="top"
                      width="160"
                      popper-class="popover"
                    >
                      <p class="del-tip">是否删除该人员？</p>
                      <div class="pop-btnbox">
                        <span
                          class="cancel-btn"
                          @click="canceldeleteGridPerson(scope.row.personnelId)"
                          >取消</span
                        >
                        <span
                          class="ok-btn"
                          @click="deleteGridPerson(scope.row.personnelId)"
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
                :total="girdPersontotal"
              >
              </el-pagination>
              <i class="total">共有{{ girdPersontotal }}条数据</i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 宅委会成员 -->
    <div class="m-contain" v-if="current == '2'">
      <div class="m-contain">
        <div class="operate-btn">
          <span class="btn add-btn" @click="handleAdd">新增</span>
          <el-form
            :model="filters"
            :inline="true"
            ref="filters"
            class="m-search"
          >
            <el-form-item label="姓名" prop="name">
              <el-input
                v-model="filters.name"
                placeholder="输入姓名"
              ></el-input>
            </el-form-item>
            <div class="search-btnbox">
              <span class="btn search-btn" @click="getlist('2')">查询</span>
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
            <el-table-column label="人员身份" prop="identity">
            </el-table-column>
            <el-table-column label="负责队组" prop="teamTeam">
            </el-table-column>
            <el-table-column label="展示状态" prop="">
              <template slot-scope="scope">
                <span
                  v-if="scope.row.showStatus === '1'"
                  @click="handlestatus(scope.row, scope.$index, '0')"
                >
                  隐藏&nbsp;<img
                    src="../../assets/img/status-gray.png"
                    class="status-img"
                  />
                </span>
                <span
                  v-else
                  @click="handlestatus(scope.row, scope.$index, '1')"
                >
                  展示&nbsp;<img
                    src="../../assets/img/status-active.png"
                    class="status-img"
                  />
                </span>
              </template>
            </el-table-column>
            <el-table-column label="操作" prop="">
              <template slot-scope="scope">
                <span class="edit-title" @click="handleEdit(scope.row)"
                  >编辑&nbsp;&nbsp;</span
                >
                <el-popover
                  :ref="scope.row.memberId"
                  placement="top"
                  width="160"
                  popper-class="popover"
                >
                  <p class="del-tip">是否删除该人员？</p>
                  <div class="pop-btnbox">
                    <span
                      class="cancel-btn"
                      @click="visibleDelCancel(scope.row.memberId)"
                      >取消</span
                    >
                    <span
                      class="ok-btn"
                      @click="visibleDelSubmit(scope.row.memberId)"
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
    </div>
    <!-- 新增、编辑 宅委会 -->
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
            <el-form-item label="姓名" prop="name" label-width="100px">
              <el-input
                v-model="addForm.name"
                placeholder="请输入姓名"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="序号" prop="sort" label-width="100px">
              <el-input
                v-model="addForm.sort"
                placeholder="请输入序号"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="展示状态"
              prop="showStatus"
              label-width="100px"
            >
              <el-radio-group v-model="addForm.showStatus">
                <el-radio label="0">展示</el-radio>
                <el-radio label="1">隐藏</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="人员身份" prop="identity" label-width="100px">
              <el-input
                v-model="addForm.identity"
                placeholder="请输入人员身份"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="负责队组" prop="teamTeam" label-width="100px">
              <el-input
                v-model="addForm.teamTeam"
                placeholder="请输入负责队组"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="dialog-foot">
        <span class="btn-cancel" @click="handlecancel">取消</span>
        <span class="btn-save" @click="handleSubmit">保存</span>
      </div>
    </el-dialog>

    <!-- 新增、编辑 网格人员 -->
    <el-dialog
      :visible.sync="addGirdPersondialog"
      v-if="addGirdPersondialog"
      class="g-dialog"
      :title="diatitle"
    >
      <span class="tip">基础信息</span>
      <el-form
        :model="addGirdPersonForm"
        :inline="true"
        ref="addGirdPersonForm"
        :rules="addGirdPersonFormRules"
        class="addGirdPersonForm"
        ><el-row>
          <el-col :span="24">
            <el-form-item label="序号" prop="sort" label-width="100px">
              <el-input
                v-model="addGirdPersonForm.sort"
                placeholder="请输入序号"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="姓名" prop="name" label-width="100px">
              <el-input
                v-model="addGirdPersonForm.name"
                placeholder="请输入姓名"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="身份" prop="personnelType" label-width="100px">
              <el-radio-group v-model="addGirdPersonForm.personnelType">
                <el-radio label="1">网格党组织负责人</el-radio>
                <el-radio label="2">专职网格员</el-radio>
                <el-radio label="3">兼职网格员</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="职务" prop="post" label-width="100px">
              <el-input
                v-model="addGirdPersonForm.post"
                placeholder="请输入职务"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="政治面貌"
              prop="politicalAspects"
              label-width="100px"
            >
              <el-input
                v-model="addGirdPersonForm.politicalAspects"
                placeholder="请输入政治面貌"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="年龄" prop="age" label-width="100px">
              <el-input
                v-model="addGirdPersonForm.age"
                placeholder="请输入年龄"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="dialog-foot">
        <span class="btn-cancel" @click="cancelAddGridPerson">取消</span>
        <span class="btn-save" @click="saveGridPerson">保存</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  property,
  propertyAdd,
  propertyUpdate,
  propertyDelete,
  memberList,
  getMemberDetail,
  memberDetailUpdate,
  addMember,
  delMember,
  statuMember,
  gridOverviewList,
  gridDetailUpdate,
  gridPersonList,
  addGridPerson,
  updateGridPerson,
  delGridPerson,
  addGrid
} from '../../api/api'
import axios from 'axios'
import { quillEditor, Quill } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import qs from 'qs'
import { number } from 'echarts'

export default {
  components: {
    quillEditor,
  },
  data() {
    return {
      addGridFlag:false,
      addGirdPersondialog: false,
      currentGrid: 0,
      gridList: [],
      filters: {
        name: '',
        pageSize: 10,
        pageNum: 1,
      },

      addGirdPersonForm: {},
      addForm: {},
      addFormRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        showStatus: [
          { required: true, message: '请选择展示状态', trigger: 'change' },
        ],
      },
      addGirdPersonFormRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入序号', trigger: 'blur' }],
        personnelType: [{ required: true, message: '请选择身份', trigger: 'change' }],
      },
      addGridRules:{
        microgridNumber: [{ required: true, message: '请输入微网格编号', trigger: 'blur' }],
        teamTeam: [{ required: true, message: '请输入覆盖队组（楼组）', trigger: 'blur' }],
      },
      sidelist: [
        {
          prtSidebarName: '基本信息',
        },
        {
          prtSidebarName: '东风村网络概况',
        },
        {
          prtSidebarName: '宅委会成员',
        },
      ],
      current: 0,
      briefIntroduction: '', // 红色物业简介
      organizationalChart: '', // 组织架构图
      organizationalChartUrl: '',
      redPropertyId: '', // 红色物业ID
      partyBuildingGrid: '', //	党建网格介绍
      partyBuildingGridChart: '', //	党建网格图
      partyBuildingGridChartUrl: '', //	党建网格图URL
      partyMemberStructure: '', //	宅委会党员架构介绍
      partyMemberStructureChart: '', //	宅委会党员架构图
      partyMemberStructureChartUrl: '', //	宅委会党员架构图URL
      listLoading: false,
      datalist: [],
      total: 0,
      currentPage: 1,
      currentPage1: 1,
      pagesize: 10,
      adddialog: false,
      grid: {
        microgridNumber: '',
        teamTeam: '',
        households: '',
        peopleNumber: '',
        gridOverviewId: '',
      },
      gridPersonList: [],
      gridPersonType: ['网格党组织负责人', '专职网格员', '兼职网格员'],
      girdPersontotal: 0,
    }
  },
  mounted() {
    this.initForm()
    this.getlist('0')
    this.getlist('1')
    this.getlist('2')
  },
  methods: {
    // 重置
    resetForm: function (filters) {
      this.$refs.filters.resetFields();
      this.filters = {
        name: '',
        pageSize: 10,
        pageNum: 1,
      };
      this.getlist('2');
    },
    // 取消删除
    canceldeleteGridPerson(personnelId){
      this.$refs[personnelId].doClose()
    },
// 删除网格成员确认
    deleteGridPerson(personnelId) {
      delGridPerson(personnelId).then((res) => {
        console.log(res)
        if (res.code == '200') {
          this.$message({
            message: res.msg,
            type: 'success',
          })
          this.$refs[personnelId].doClose()
          this.getlist('1')
        } else {
          this.$message({
            message: res.data.msg,
            type: 'error',
          })
        }
      })
    },
    initaddGirdPersonForm() {
      this.addGirdPersonForm = {
        name: '',
        sort: '',
        personnelType: '1',
        post: '',
        politicalAspects: '',
        age: '',
        gridOverviewId: '',
      }
    },
    // 取消网格人员添加
    cancelAddGridPerson: function () {
      this.$refs.addGirdPersonForm.resetFields()
      this.initaddGirdPersonForm()
      this.addGirdPersondialog = false
    },
    // 打开网格人员添加弹窗
    openGridPersonForm() {
      this.addGirdPersondialog = true
      this.diatitle = '新增'
      this.addGirdPersonForm.gridOverviewId = this.grid.gridOverviewId
    },
    // 编辑网格成员
    editGridPerson(row) {
      this.addGirdPersondialog = true
      this.diatitle = '编辑'
      this.addGirdPersonForm.gridOverviewId = this.grid.gridOverviewId
      console.log(row)
      this.addGirdPersonForm = row
    },

    // 新增网格人员
    saveGridPerson() {
      this.$refs.addGirdPersonForm.validate((valid) => {
        if (valid) {
          if (!this.addGirdPersonForm.personnelId) {
            addGridPerson(this.addGirdPersonForm).then((res) => {
              if (res.code == '200') {
                this.$message({
                  message: '添加成功',
                  type: 'success',
                })
                this.addGirdPersondialog = false
                this.$refs.addGirdPersonForm.resetFields()
                this.getlist('1')
              } else {
                this.$message({
                  message: res.msg,
                  type: 'error',
                })
              }
            })
          } else {
            updateGridPerson(this.addGirdPersonForm).then((res) => {
              if (res.code == '200') {
                this.$message({
                  message: '修改成功',
                  type: 'success',
                })
                this.addGirdPersondialog = false
                this.getlist('1')
              } else {
                this.$message({
                  message: res.msg,
                  type: 'error',
                })
              }
            })
          }
        }
      })
    },
    // 保存网格
    saveGrid() {
      this.$refs.grid.validate((valid) => {
        if (valid) {
          if(this.grid.gridOverviewId){
        gridDetailUpdate(this.grid).then((res) => {
        if (res.code == '200') {
          this.$message({
            message: '修改成功',
            type: 'success',
          })
          
          this.getlist('1')
        } else {
          this.$message({
            message: res.msg,
            type: 'error',
          })
        }
      })
      }else{
        addGrid(this.grid).then((res) => {
        if (res.code == '200') {
          this.$message({
            message: '添加成功',
            type: 'success',
          })
          console.log('length(this.grid)',this.gridList.length)
          this.currentGrid =this.gridList.length
          this.getlist('1')
          this.addGridFlag = false
        } else {
          this.$message({
            message: res.msg,
            type: 'error',
          })
        }
      })
      }
        }
      })
      
    },
    //切换网格
    handleGridTab(index) {
      this.currentGrid = index
      this.grid = this.gridList[index]
      this.getGridPersonList(this.grid.gridOverviewId)
      this.addGridFlag = false
    },
    // 新增网格
    handleAddGrid() {
      this.addGridFlag = true
      this.grid = {
        microgridNumber: '',
        teamTeam: '',
        households: '',
        peopleNumber: '',
        gridOverviewId: '',
      },
      this.gridPersonList = []
      this.girdPersontotal = 0
    },
    // 删除取消
    visibleDelCancel(id) {
      // 取消
      this.$refs[id].doClose()
    },
    // 删除确认
    visibleDelSubmit(id) {
      // 确定
      delMember(id).then((res) => {
        console.log(res)
        if (res.code == '200') {
          this.$message({
            message: res.msg,
            type: 'success',
          })
          this.$refs[id].doClose()
          this.getlist()
        } else {
          this.$message({
            message: res.data.msg,
            type: 'error',
          })
        }
      })
    },
    // 初始化表单
    initForm() {
      this.addForm = {
        name: '',
        sort: '',
        showStatus: '0',
        identity: '',
        teamTeam: '',
      }
    },
    // 取消宅委员添加
    handlecancel: function () {
      this.$refs.addForm.resetFields()
      this.initForm()
      this.adddialog = false
    },
    // 保存
    handleSubmit: function () {
      console.log('----保存宅委会---')
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          if (!this.addForm.memberId) {
            addMember(this.addForm).then((res) => {
              if (res.code == '200') {
                this.$message({
                  message: '添加成功',
                  type: 'success',
                })
                this.adddialog = false
                this.getlist('2')
              } else {
                this.$message({
                  message: res.msg,
                  type: 'error',
                })
              }
            })
          } else {
            memberDetailUpdate(this.addForm).then((res) => {
              if (res.code == '200') {
                this.$message({
                  message: '修改成功',
                  type: 'success',
                })
                this.adddialog = false
                this.getlist('2')
              } else {
                this.$message({
                  message: res.msg,
                  type: 'error',
                })
              }
            })
          }
        }
      })
    },
    
    // 详情
    getDetail(memberId) {
      // let num1 = number(memberId)
      // console.log(typeof(num1))
      getMemberDetail(memberId).then((res) => {
        console.log('res', res)
        this.addForm = res.data
      })
    },
    // 编辑
    handleEdit: function (row) {
      console.log('row.memberId', row.memberId)
      console.log(typeof row.memberId)
      this.adddialog = true
      this.diatitle = '编辑'
      this.getDetail(row.memberId)
      this.editflag = true
    },
    // 切换状态
    handlestatus: function (row, index, type) {
      console.log(type)
      const id = row.memberId
      statuMember(id).then((res) => {
        if (res.code == 200) {
          this.$message({
            message: '状态修改成功',
            type: 'success',
          })
          this.datalist[index].showStatus = type
        }
      })
    },
    // 分页
    handleSizeChange: function (size) {
      this.pagesize = size
      this.filters.pageSize = size
      this.getlist('')
    },
    // 分页
    handleCurrentChange: function (val) {
      this.filters.pageNum = val
      this.getlist(val)
    },
    // 单行变色
    tableRowClassName: function (rowIndex) {
      if (rowIndex.rowIndex % 2 != 0) {
        return 'evenRow'
      }
      return 'oddRow'
    },
    // 新增
    handleAdd: function () {
      this.adddialog = true
      this.diatitle = '添加'
      this.initForm()
      this.editflag = false
      this.filelist = []
    },

    getlist(type) {
      if (type == '0') {
        property('partyBuilding').then((res) => {
          this.briefIntroduction = res.data.data.briefIntroduction
          this.organizationalChartUrl = res.data.data.organizationalChartUrl
          this.organizationalChart = res.data.data.organizationalChart
          this.redPropertyId = res.data.data.redPropertyId
          this.partyBuildingGrid = res.data.data.partyBuildingGrid
          this.partyBuildingGridChart = res.data.data.partyBuildingGridChart
          this.partyBuildingGridChartUrl =
            res.data.data.partyBuildingGridChartUrl
          this.partyMemberStructure = res.data.data.partyMemberStructure
          this.partyMemberStructureChart =
            res.data.data.partyMemberStructureChart
          this.partyMemberStructureChartUrl =
            res.data.data.partyMemberStructureChartUrl
        })
      } else if (type == '1') {
        gridOverviewList().then((res) => {
          this.gridList = res.data.rows
          this.grid = this.gridList[this.currentGrid]
          this.getGridPersonList(this.grid.gridOverviewId)
        })
      } else {
        memberList(this.filters).then((res) => {
          this.datalist = res.data.rows
          this.total = res.data.total
          console.log(typeof res.data.rows[0].memberId)
        })
      }
    },
    // 获取网格对应的人员信息
    getGridPersonList(gridOverviewId) {
      let para = {
        gridOverviewId,
      }
      console.log('this.grid.gridOverviewId', this.grid.gridOverviewId)
      console.log('this.grid', this.grid)
      console.log('para', para)
      gridPersonList(para).then((res) => {
        this.gridPersonList = res.data.rows
        this.girdPersontotal = res.data.total
        console.log('gridPersonList', res.data)
      })
    },

    // 切换
    handletab: function (type) {
      this.current = type
    },
    // 图片上传
    choosefile: function (e, type) {
      let file
      if (type === 0) {
        file = this.$refs.file.files[0] // 图片上传
      } else if (type === 1) {
        file = this.$refs.file1.files[0] // 图片上传
      } else {
        file = this.$refs.file2.files[0] // 图片上传
      }
      this.uploadfile(file, type)
      e.target.value = ''
    },
    // 文件上传
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
            if (type === 0) {
              this.organizationalChartUrl = res.data.data.url
              this.organizationalChart = res.data.data.ossId
            } else if (type === 1) {
              this.partyBuildingGridChartUrl = res.data.data.url
              this.partyBuildingGridChart = res.data.data.ossId
            } else {
              this.partyMemberStructureChartUrl = res.data.data.url
              this.partyMemberStructureChart = res.data.data.ossId
            }
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
    // 删除文件
    delfile: function (type) {
      if (type === '0') {
        this.organizationalChartUrl = ''
        this.organizationalChart = ''
      } else if (type === '1') {
        this.partyBuildingGridChartUrl = ''
        this.partyBuildingGridChart = ''
      } else {
        this.partyMemberStructureChartUrl = ''
        this.partyMemberStructureChart = ''
      }
    },
    // 保存
    submit() {
      let para = {
        redPropertyId: this.redPropertyId,
        briefIntroduction: this.briefIntroduction,
        organizationalChart: this.organizationalChart,
        classification: 'partyBuilding',
        partyBuildingGrid: this.partyBuildingGrid,
        partyBuildingGridChart: this.partyBuildingGridChart,
        partyMemberStructure: this.partyMemberStructure,
        partyMemberStructureChart: this.partyMemberStructureChart,
      }
      if (this.redPropertyId) {
        propertyUpdate(para).then((res) => {
          if (res.code == '200') {
            this.$message({
              message: res.msg,
              type: 'success',
            })
            this.getlist()
          } else {
            this.$message({
              message: res.msg,
              type: 'error',
            })
          }
        })
      } else {
        propertyAdd(para).then((res) => {
          if (res.code == '200') {
            this.$message({
              message: res.msg,
              type: 'success',
            })
            this.getlist()
          } else {
            this.$message({
              message: res.msg,
              type: 'error',
            })
          }
        })
      }
    },
  },
}
</script>

<style scoped>
.line {
  margin-top: -10px;
  margin-left: 10px;
}
.rec-rt {
  position: relative;
}
.button {
  position: absolute;
  top: 30px;
}
.inf {
  position: absolute;
  top: 50px;
}
.tab-lst-Transverse {
  float: left;
  width: 10% !important;
  text-align: center !important;
  display: inline-block;
  /* float: left; */
  /* width: 100%; */
  /* height: 0.22917rem; */
  /* line-height: 0.22396rem; */
  /* margin-right: 0.05208rem; */
  cursor: pointer;
  border-right: 0.00521rem solid #dddddd;
  border-bottom: none !important;
  border-radius: 0.02083rem;
  padding: 0 0.08333rem;
  box-sizing: border-box;
}
.tab-cont {
  /* display: inline-block; */
  height: 80px;
  background: linear-gradient(180deg, #ffffff 0%, #f8feff 100%);
  box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.0784);
  border-radius: 4px 4px 0px 0px;
  /* opacity: 1; */
  border: 1px solid #dddddd;
  box-sizing: border-box;
  padding: 16px;
  box-sizing: border-box;
  margin-bottom: 10px;
}
.l-tab {
  width: 80px;
  height: 100%;
  float: left;
}
.r-tab {
  width: 120px;
  margin-left: 20px;
  float: left;
}
.tab-title {
  background-color: rgb(238, 238, 238);
}
.l-grid {
  width: 300px !important;
}
.r-grid {
  width: calc(100% - 310px) !important;
}
.house-rt-grid {
  float: none;
  display: block;
  /* width: calc(100% -1px) !important; */
  width: 100%;
}
.input-width {
  width: 300px;
  float: right;
}

.r-grid .hd {
  display: block;
  float: left;
  width: 100%;
  height: 60px;
  padding: 0 16px;
  box-sizing: border-box;
  background-color: #eeeeee;
  margin-bottom: 8px;
}

.r-grid .house-title {
  display: inline-block;
  float: left;
  border-left: 4px solid #00beb8;
  color: #333333;
  padding-left: 8px;
  height: 16px;
  font-size: 16px;
  line-height: 16px;
  margin-top: 22px;
  cursor: pointer;
}

.r-grid .hd .btn {
  float: right;
  margin-top: 10px;
  margin-left: 16px;
}

.hd .sj-img {
  z-index: 999;
  display: none;
  float: right;
  width: 24px;
  height: 60px;
  margin-right: 8px;
  margin-top: 24px;
  margin-left: 32px;
  /* cursor: pointer; */
}
.edit-grid {
  margin-top: 80px;
}
.info-house{
  box-shadow: none !important;
}
</style>
