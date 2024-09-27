<template>
  <div class="g-cont">
    <div class="g-ltside">
      <div class="tab-ul">
        <div
          :class="['tab-lst', { active: current == index }]"
          @click="handletab(index)"
          v-for="(item, index) in sidelist"
        >
          {{ item.prtSidebarName }}
        </div>
      </div>
    </div>
    <div class="g-rtside" style="overflow-y: auto">
      <div class="m-search">
        <el-form :model="filters" :inline="true" ref="filters">
          <el-form-item label="物业服务类型" prop="prtTypeId">
            <el-select v-model="filters.prtTypeId" placeholder="物业服务类型">
              <el-option
                v-for="(item, index) in typelist"
                :value="item.prtTypeId"
                :label="item.prtTypeName"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="处理节点" prop="prtNodeFlowId">
            <el-select v-model="filters.prtNodeFlowId" placeholder="处理节点">
              <el-option
                v-for="(item, index) in nodelist"
                :value="item.prtNodeFlowId"
                :label="item.prtNodeName"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" class="ipt150" prop="nickname">
            <el-input
              v-model="filters.nickname"
              placeholder="登记人员/分配人员"
            ></el-input>
          </el-form-item>
          <el-form-item label="登记日期">
            <el-date-picker
              v-model="filters.time"
              type="daterange"
              start-placeholder="年-月-日"
              end-placeholder="年-月-日"
            ></el-date-picker>
          </el-form-item>
          <div class="search-btnbox" style="margin-left: 0">
            <span class="btn search-btn" @click="getlist(1)">查询</span>
            <span class="btn reset-btn" @click="resetForm('filters')"
              >重置</span
            >
          </div>
        </el-form>
      </div>
      <span
        class="btn add-btn"
        style="margin-bottom: 0.08333rem"
        v-if="current == '2'"
        @click="handledj"
        >登记</span
      >

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
            label="ID"
            prop="prtId"
            width="200"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column label="服务地点" prop="prtPlaceName">
          </el-table-column>
          <el-table-column label="联系人" prop="prtContact"></el-table-column>
          <el-table-column label="联系电话" prop="prtPhone"></el-table-column>
          <!-- <el-table-column label="物业服务类型" prop="prtTypeId" :formatter="prttypeformat">
					</el-table-column> -->
          <el-table-column label="物业服务类型" prop="prtTypeName">
          </el-table-column>
          <el-table-column label="处理节点" prop="prtNodeName">
          </el-table-column>
          <el-table-column label="处理结果" prop="">
            <template slot-scope="scope">
              <span
                class="f-orange"
                v-if="
                  scope.row.evtNodeResultName == '待处理' ||
                  scope.row.evtNodeResultName == '待登记'
                "
                >{{ scope.row.evtNodeResultName }}</span
              >
              <span v-else-if="scope.row.evtNodeResultName == ''">/</span>
              <span class="f-blue" v-else>{{
                scope.row.evtNodeResultName
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="登记人员"
            prop="prtInitiatorName"
            width="200"
          ></el-table-column>
          <el-table-column label="分派人员" prop="assigner"></el-table-column>
          <el-table-column
            label="登记时间"
            prop="registerTime"
            width="200"
          ></el-table-column>
          <el-table-column label="操作" prop="" width="200">
            <template slot-scope="scope">
              <div v-if="current == '0'">
                <span
                  class="edit-title"
                  v-if="scope.row.prtNodeFlowId == 'Activity_19un991'"
                  @click="resetdj(scope.row)"
                  >处理</span
                >
                <span class="edit-title" v-else="" @click="handlEdit(scope.row)"
                  >处理</span
                >
              </div>
              <div v-if="current == '1'">
                <span class="detail-title" @click="handldetail(scope.row)"
                  >详情</span
                >
              </div>
              <div v-if="current == '2'">
                <span
                  class="edit-title"
                  v-if="
                    scope.row.prtNodeResult == 'unregistered' &&
                    scope.row.prtNodeFlowId == 'Activity_19un991'
                  "
                  @click="resetdj(scope.row)"
                  >重新登记&nbsp;&nbsp;</span
                >
                <span
                  class="del-title"
                  v-if="
                    scope.row.prtNodeResult == 'unregistered' &&
                    scope.row.prtNodeFlowId == 'Activity_19un991'
                  "
                  @click="handledel(scope.row)"
                  >删除&nbsp;&nbsp;</span
                >
                <span
                  class="edit-title"
                  v-if="
                    scope.row.prtNodeResult == 'unhandled' &&
                    scope.row.prtNodeFlowId == 'Activity_0ajtgr9'
                  "
                  @click="handlech(scope.row)"
                  >撤回&nbsp;&nbsp;</span
                >
                <span
                  class="detail-title"
                  v-if="scope.row.prtNodeResult != 'unregistered'"
                  @click="handldetail(scope.row)"
                  >详情</span
                >
              </div>
              <div v-if="current == '3'">
                <span class="detail-title" @click="handldetail(scope.row)"
                  >详情</span
                >
              </div>
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
    <!-- 登记 -->
    <el-dialog
      :visible.sync="adddialog"
      v-if="adddialog"
      class="g-dialog"
      :title="diatitle"
    >
      <div :class="['addbox', addflag ? 'showlog' : 'hidelog']">
        <div class="gj-box">
          <div class="gj-lst">
            <img src="../../assets/img/id.png" class="img" />
            <span class="num">{{ detailform.prtId }}</span>
            <span class="type">ID</span>
          </div>
          <div class="gj-lst">
            <img src="../../assets/img/zdjy.png" class="img" />
            <span class="num">{{ detailform.prtTypeName }}</span>
            <span class="type">服务类型</span>
          </div>
          <div class="gj-lst">
            <img src="../../assets/img/fqr.png" class="img" />
            <span class="num">{{ detailform.prtInitiatorName }}</span>
            <span class="type">登记人</span>
          </div>
          <div class="gj-lst">
            <img src="../../assets/img/sj.png" class="img" />
            <span class="num">{{ detailform.registerTime }}</span>
            <span class="type">发起时间</span>
          </div>
        </div>
        <div class="lt">
          <span class="tip">基础信息</span>
          <el-form
            :model="addForm"
            :inline="true"
            ref="addForm"
            :rules="addFormRules"
            class="addform add-signcent"
          >
            <el-form-item label="类型" prop="prtTypeId">
              <el-select v-model="addForm.prtTypeId" @change="choosetype">
                <el-option
                  v-for="(item, index) in typelist"
                  :value="item.prtTypeId"
                  :label="item.prtTypeName"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="服务地点" prop="prtPlaceName">
              <el-input
                v-model="addForm.prtPlaceName"
                placeholder="请输入服务地点"
              ></el-input>
            </el-form-item>
            <el-form-item label="联系人" prop="prtContact">
              <el-input
                v-model="addForm.prtContact"
                placeholder="请输入联系人"
              ></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="prtPhone">
              <el-input
                v-model="addForm.prtPhone"
                placeholder="请输入联系电话"
              ></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input
                type="textarea"
                v-model="addForm.remark"
                placeholder="请输入备注"
              ></el-input>
            </el-form-item>
            <el-form-item label="附件" prop="">
              <div class="file-lst">
                <div class="filebox">
                  <input
                    type="file"
                    ref="file"
                    class="file1"
                    @change="choosefile($event, '0')"
                  />
                  <span class="upfile-btn">点击上传文件</span>
                </div>
                <ul class="file-ul" style="width: 100%; float: left">
                  <li
                    class="file-li"
                    v-for="(item, index) in filelist"
                    @click="handdelfile(index, '0')"
                  >
                    <img src="../../assets/img/file.png" class="fileimg" />
                    <i class="" :title="item.name">{{ item.fileName }}</i>
                    <span class="delfile">删除</span>
                  </li>
                </ul>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div class="editbox">
          <span class="edit-tip">物业服务流转日志</span>
          <ul class="record-box">
            <li class="record-lst" v-for="(item, index) in recordlist">
              <i class="line"></i>
              <span class="dot"></span>
              <div class="rec-rt">
                <span class="button" v-if="item.actionType == '0'">新增</span>
                <span class="button" v-if="item.actionType == '1'">修改</span>
                <span class="button" v-if="item.actionType == '2'">删除</span>
                <div class="inf">
                  <img :src="item.actionUserAvatar" class="avater" />{{
                    item.actionUserName
                  }}
                </div>
                <span class="bbh">{{ item.actionTime }}</span>
                <span class="bbh">版本：{{ item.patrolTemplateVersion }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- 修改 -->
      <div class="dialog-foot">
        <span class="btn-cancel" @click="handlecancel('1')">取消</span>
        <span class="btn-save" @click="handleSave" v-if="nodetype == '0'"
          >提交</span
        >
        <span class="btn-save" @click="resetsubmit" v-if="nodetype == '1'"
          >重新登记</span
        >
      </div>
    </el-dialog>
    <!-- 详情 -->
    <el-dialog
      :visible.sync="xqdialog"
      v-if="xqdialog"
      class="g-dialog"
      :title="xqtitle"
      @close="handleClose"
    >
      <div class="addbox">
        <div class="gj-box">
          <div class="gj-lst">
            <img src="../../assets/img/id.png" class="img" />
            <span class="num">{{ detailform.prtId }}</span>
            <span class="type">ID</span>
          </div>
          <div class="gj-lst">
            <img src="../../assets/img/zdjy.png" class="img" />
            <span class="num">{{ detailform.prtTypeName }}</span>
            <span class="type">服务类型</span>
          </div>
          <div class="gj-lst">
            <img src="../../assets/img/fqr.png" class="img" />
            <span class="num">{{ detailform.prtInitiatorName }}</span>
            <span class="type">登记人</span>
          </div>
          <div class="gj-lst">
            <img src="../../assets/img/sj.png" class="img" />
            <span class="num">{{ detailform.registerTime }}</span>
            <span class="type">发起时间</span>
          </div>
        </div>
        <div class="lt">
          <div class="xq-content event-detail">
            <div class="xq-lst">
              <span class="name">类型</span>
              <span class="lab">{{ detailform.prtTypeName }}</span>
            </div>
            <div class="xq-lst">
              <span class="name">服务地点</span>
              <span class="lab">{{ addForm.prtPlaceName }}</span>
            </div>
            <div class="xq-lst">
              <span class="name">联系人</span>
              <span class="lab">{{ addForm.prtContact }}</span>
            </div>
            <div class="xq-lst">
              <span class="name">联系电话</span>
              <span class="lab">{{ addForm.prtPhone }}</span>
            </div>
            <div class="xq-lst">
              <span class="name">备注</span>
              <span class="remark1">{{ addForm.remark }}</span>
            </div>
            <div class="xq-lst">
              <span class="name">附件</span>
              <ul class="file-ul xq-filebox">
                <li class="file-li" v-for="(item, index) in filelist">
                  <img src="../../assets/img/file.png" class="fileimg" />{{
                    item.fileName
                  }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="editbox">
          <span class="edit-tip">物业服务流转日志</span>

          <div class="record">
            <div class="record-item" v-for="(item, index) in recordlist">
              <div class="record-dot">
                <div class="dot"></div>
              </div>
              <div class="record-content">
                <span class="activity-name"
                  >{{ item.activityName }}</span
                >

                <div class="inf">
                  <img :src="item.assigneeAvatarUrl" class="avater" />{{
                    item.candidate
                  }}
                </div>
                <div class="detail-content">
                  <span>
                    {{
                      item.activityName == '流程开始' ||
                      item.activityName == '流程结束' ||
                      item.commentList.length > 0
                        ? item.endTime
                        : item.createTime
                    }}
                  </span>
                  <span
                    class="change-time"
                    v-if="item.endTime != null"
                    @click="changeTime(item)"
                    >修改时间</span
                  >
                  <div
                    class="detail"
                    v-if="item.activityId == 'Activity_1cbhhpu'"
                  >
                    <span
                      >详细地址:{{
                        item.commentList[0].fullMessage.detailedAddress == ' '
                          ? item.commentList[0].fullMessage.location.address
                          : item.commentList[0].fullMessage.detailedAddress
                      }}</span
                    >
                    <div class="img-box" v-if="item.commentList[0].fullMessage.tempImgFilePath && item.commentList[0].fullMessage.tempImgFilePath.length > 0" >
                      签到:
                      <img class="img-item" v-for="(img,index) in item.commentList[0].fullMessage.tempImgFilePath" :key="index" :src="img.url" alt=""  @click="bigpic(img.url)">
                    </div>
                    <div class="img-box" v-if="item.commentList[0].fullMessage.tempImgFilePath2 &&item.commentList[0].fullMessage.tempImgFilePath2.length > 0" >
                      签退:
                      <img class="img-item" v-for="(img,index) in item.commentList[0].fullMessage.tempImgFilePath2" :key="index" :src="img.url" alt="" @click="bigpic(img.url)">
                    </div>
                    <div class="img-box" v-if="item.commentList[0].fullMessage.tempImgFilePath3 &&item.commentList[0].fullMessage.tempImgFilePath3.length > 0" >
                      附件:
                      <img class="img-item" v-for="(img,index) in item.commentList[0].fullMessage.tempImgFilePath3" :key="index" :src="img.url" alt=""@click="bigpic(img.url)">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 受理 -->
      <div
        class="dialog-foot three-btn"
        v-if="current == '0' && prtNodeFlowId == 'Activity_0ajtgr9'"
      >
        <span class="btn-save" @click="handlevent('0')">同意受理</span>
        <span class="btn-cx" @click="handlevent('1')">服务撤销</span>
        <span class="btn-ht" @click="handlevent('2')">回退</span>
      </div>
      <!-- 分派 -->
      <div
        class="dialog-foot one-btn"
        v-if="current == '0' && prtNodeFlowId == 'Activity_0geuabw'"
      >
        <span class="btn-save" style="margin-left: 0" @click="handlevent('3')"
          >分派</span
        >
      </div>
      <!-- 签收 -->
      <div
        class="dialog-foot"
        v-if="current == '0' && prtNodeFlowId == 'Activity_1sktnqy'"
      >
        <span class="btn-cancel" @click="handlevent('4')">拒签</span>
        <span class="btn-save" @click="handlevent('5')">签收</span>
      </div>
    </el-dialog>
    <!-- 意见框 -->
    <el-dialog
      :visible.sync="yjdialog"
      v-if="yjdialog"
      class="g-dialog min-dia642"
      title="事件处理详情"
    >
      <el-form
        :model="yjForm"
        :inline="true"
        ref="yjForm"
        :rules="yjFormRules"
        class="addform add-signcent"
      >
        <el-form-item label="处理描述" prop="evtDescription">
          <el-input
            type="textarea"
            v-model="yjForm.comment"
            placeholder="请输入处理描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="文件" prop="">
          <div class="file-lst">
            <div class="filebox">
              <input
                type="file"
                ref="file1"
                class="file1"
                @change="choosefile($event, '1')"
              />
              <span class="upfile-btn">选择上传文件</span>
            </div>
            <ul class="file-ul" style="float: left; width: 100%">
              <li
                class="file-li"
                v-for="(item, index) in attachmentList"
                @click="handdelfile(index, '1')"
              >
                <img src="../../assets/img/file.png" class="fileimg" />{{
                  item.fileName
                }}
                <span class="delfile">删除</span>
              </li>
            </ul>
          </div>
        </el-form-item>
        <!-- 受理分派、发起核查时展示 -->
        <el-form-item
          label="分派人员"
          class="user-tree"
          prop="rolePermissionsIds"
          v-if="yjjdtype == '3'"
        >
          <el-tree
            :data="userlist"
            ref="roletree"
            node-key="id"
            show-checkbox
            :props="defaultProps"
            highlight-current
            @node-click="handleClick"
          >
          </el-tree>
        </el-form-item>
      </el-form>
      <div class="dialog-foot">
        <span class="btn-cancel" @click="yjclose">取消</span>
        <span class="btn-save" v-if="yjjdtype == '0'" @click="handlesubmit('0')"
          >同意受理</span
        >
        <span class="btn-save" v-if="yjjdtype == '1'" @click="handlesubmit('1')"
          >服务撤销</span
        >
        <span class="btn-save" v-if="yjjdtype == '2'" @click="handlesubmit('2')"
          >回退</span
        >
        <span class="btn-save" v-if="yjjdtype == '3'" @click="handlesubmit('3')"
          >分派</span
        >
        <span class="btn-save" v-if="yjjdtype == '4'" @click="handlesubmit('4')"
          >拒签</span
        >
        <span class="btn-save" v-if="yjjdtype == '5'" @click="handlesubmit('5')"
          >签收</span
        >
        <span class="btn-save" v-if="yjjdtype == '6'" @click="handlesubmit('6')"
          >回退</span
        >
        <span class="btn-save" v-if="yjjdtype == '7'" @click="handlesubmit('7')"
          >确认完结</span
        >
      </div>
    </el-dialog>
    <el-dialog :visible.sync="bigDialog" width="30%" title="">
      <img :src="bigUrl" alt="" style="width: 100%" />
    </el-dialog>
    <!-- 修改时间框 -->
    <!-- 意见框 -->
    <el-dialog
      :visible.sync="changetimedialog"
      v-if="changetimedialog"
      class="g-dialog min-dia642"
      title="修改时间"
    >
      <el-form
        :model="yjForm"
        :inline="true"
        ref="yjForm"
        :rules="yjFormRules"
        class="addform add-signcent"
      >
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="valueStart"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="valueEnd"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div class="dialog-foot">
        <span class="btn-cancel" @click="closeChangeTimeDialog">取消</span>
        <span class="btn-save" @click="saveChangeTime">保存</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  ServiceSidebar,
  PrtList,
  PrtDetail,
  ServiceTypeCombobox,
  ServiceNodeCombobox,
  GetprtReportForm,
  PSelectDeptUserTree,
} from '../../api/api.js'
import {
  StartPrt,
  ServiceAccept,
  ServiceRevocation,
  ServiceRollToRegister,
  ServiceAllot,
  ServiceSign,
  ServiceRejectSign,
  ServiceRollToFinished,
  ServiceConclude,
  RegisterAgain,
  ServiceDelete,
  ServiceWithdraw,
  UpdateTime,
} from '../../api/api.js'

import axios from 'axios'
import qs from 'qs'
import moment from 'moment'

export default {
  data() {
    var validatePass = (rule, value, callback) => {
      let arr = this.$refs.roletree.getCheckedKeys() // 在此获取选中的树形数据
      if (arr.length == 0 || !arr) {
        callback(new Error('请选择'))
      } else {
        callback()
      }
    }
    return {
      bigDialog:false,
      changeTimeRow: {
        prtId: '',
        flowInstanceId: '',
        flowTaskId: '',
      },
      historyID: '',
      valueStart: '',
      valueEnd: '',
      changetimedialog: false,
      typelist: [],
      nodelist: [],
      sidelist: [],
      current: '0',
      filters: {
        prtTypeId: '', //类型id
        prtNodeFlowId: '', //节点id
        nickname: '', //登记人
        registerBeginTime: '', //开始时间
        registerEndTime: '', //结束时间
        time: [],
        size: 10,
        current: 1,
      },
      datalist: [],
      listLoading: false,
      total: 0,
      currentPage: 1,
      currentPage1: 1,
      pagesize: 10,
      adddialog: false,
      addflag: false,
      diatitle: '',
      addForm: {
        prtTypeId: '', //服务类型
        prtPlaceName: '', //服务地点
        prtContact: '', //联系人
        prtPhone: '', //电话
        remark: '', //备注
        attachmentList: [],
      },
      addFormRules: {
        prtTypeId: [
          { required: true, message: '请选择类型', trigger: 'change' },
        ],
        prtPlaceName: [
          { required: true, message: '请输入服务地点', trigger: 'blur' },
        ],
        prtPhone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
        ],
      },
      filelist: [],
      attachmentList: [],
      nodetype: '0',
      flowTaskId: '',
      flowInstanceId: '',
      prtId: '',
      flowConfId: '',
      reportform: {},

      xqdialog: false,
      xqtitle: '',
      prtNodeFlowId: '',
      detailform: {},
      recordlist: [],
      yjdialog: false,
      yjForm: {
        comment: '',
        candidateUsers: [],
      },
      yjFormRules: {
        rolePermissionsIds: [
          { required: true, validator: validatePass, trigger: 'change' },
        ],
      },
      yjjdtype: '',

      userlist: [],
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      styleChangeHeight: '',
    }
  },
  mounted() {
    this.gettype()
    this.getnode()
    this.getside()
    this.getlist('')
    this.getuser()
    this.styleChangeHeight = window.innerHeight + 'px'
  },
  methods: {
    // 关闭详情弹窗
    handleClose() {
      this.changeTimeRow = {
        prtId: '',
        flowInstanceId: '',
        flowTaskId: '',
      }
    },
    // 打开修改时间弹窗
    changeTime(item) {
      console.log(item.id)
      this.changetimedialog = true
      this.valueStart = item.createTime
      this.valueEnd = item.endTime
      this.historyID = item.id
    },
    // 关闭修改时间弹窗
    closeChangeTimeDialog() {
      this.changetimedialog = false
      this.valueStart = ''
      this.valueEnd = ''
      this.historyID = ''
    },
    // 修改时间
    saveChangeTime() {
      let data = {
        id: this.historyID,
        startTime: moment(this.valueStart).format('yyyy-MM-DD HH:mm:ss'),
        endTime: moment(this.valueEnd).format('YYYY-MM-DD HH:mm:ss'),
        // startTime: this.valueStart,
        // endTime:this.valueEnd
      }
      UpdateTime(data).then((res) => {
        if (res.code == 200) {
          this.$message({
            message: '修改成功',
            type: 'success',
          })
          this.closeChangeTimeDialog()
          console.log('this.changeTimeRow', this.changeTimeRow)
          this.getdetail(this.changeTimeRow)
        }
      })
    },
    // 服务类型
    gettype: function () {
      ServiceTypeCombobox().then((res) => {
        this.typelist = res.data.data
      })
    },
    // 转换服务类型
    prttypeformat: function (row, column) {
      for (var i = 0; i < this.typelist.length; i++) {
        if (row.prtTypeId == this.typelist[i].prtTypeId) {
          return this.typelist[i].prtTypeName
        }
      }
    },
    // 服务节点
    getnode: function () {
      ServiceNodeCombobox().then((res) => {
        this.nodelist = res.data.data
      })
    },
    // 获取左侧栏
    getside: function () {
      ServiceSidebar().then((res) => {
        console.log(res.data, '01')
        this.sidelist = res.data.data
      })
    },
    // 单行变色
    tableRowClassName: function (rowIndex) {
      if (rowIndex.rowIndex % 2 != 0) {
        return 'evenRow'
      }
      return 'oddRow'
    },
    // 列表
    getlist: function (val) {
      if (this.filters.time && this.filters.time.length > 0) {
        this.filters.registerBeginTime = moment(this.filters.time[0]).format(
          'yyyy-MM-DD'
        )
        this.filters.registerEndTime = moment(this.filters.time[1]).format(
          'yyyy-MM-DD'
        )
      } else {
        this.filters.registerBeginTime = ''
        this.filters.registerEndTime = ''
      }
      let para = {
        prtTypeId: this.filters.prtTypeId, //类型id
        prtNodeFlowId: this.filters.prtNodeFlowId, //节点id
        nickname: this.filters.nickname, //登记人
        registerBeginTime: this.filters.registerBeginTime, //开始时间
        registerEndTime: this.filters.registerEndTime, //结束时间
        pageSize: this.filters.size,
        pageNum: this.filters.current,
        sidebarType: this.current,
      }
      if (val) {
        para.pageNum = val
        this.currentPage1 = val
      }
      PrtList(para).then((res) => {
        this.datalist = res.data.rows
        this.total = res.data.total
      })
    },
    // 重置
    resetForm: function (filters) {
      this.$refs.filters.resetFields()
      this.filters = {
        prtTypeId: '', //类型id
        prtNodeFlowId: '', //节点id
        nickname: '', //登记人
        registerBeginTime: '', //开始时间
        registerEndTime: '', //结束时间
        time: [],
        size: 10,
        current: 1,
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
    // 切换
    handletab: function (type) {
      this.current = type
      this.$refs.filters.resetFields()
      this.filters = {
        prtTypeId: '', //类型id
        prtNodeFlowId: '', //节点id
        nickname: '', //登记人
        prtNodeReceiptBeginTime: '', //开始时间
        prtNodeReceiptEndTime: '', //结束时间
        time: [],
        size: 10,
        current: 1,
      }
      this.getlist(1)
    },
    // 查看详情
    handldetail: function (row) {
      this.changeTimeRow = {
        prtId: row.prtId,
        flowInstanceId: row.flowInstanceId,
        flowTaskId: row.flowTaskId,
      }
      this.xqdialog = true
      this.xqtitle = '物业服务详情'
      this.getdetail(row)
    },
    // 详情
    getdetail: function (row) {
      let para = {
        prtId: row.prtId,
        procInsId: row.flowInstanceId,
        taskId: row.flowTaskId,
      }
      console.log('-----', para)
      PrtDetail(para).then((res) => {
        console.log(res.data.data, '详情')
        this.addForm = res.data.data.formData
        this.detailform = res.data.data.prtInfoVo
        this.recordlist = res.data.data.historyProcNodeList
        this.flowTaskId = res.data.data.flowTaskId
        this.flowInstanceId = res.data.data.flowInstanceId
        this.prtId = res.data.data.prtInfoVo.prtId
        this.filelist = res.data.data.formData.attachmentList
        this.recordlist.forEach((item) => {
          if (item.activityId == 'Activity_1cbhhpu') {
            item.commentList.forEach((iten) => {
              iten.fullMessage = JSON.parse(iten.fullMessage)
            })
          }
          console.log('this.recordlist', this.recordlist)
        })
      })
    },
    // 登记
    handledj: function () {
      this.adddialog = true
      this.diatitle = '物业服务登记'
      this.addflag = false
      this.addForm = {
        prtTypeId: '', //服务类型
        prtPlaceName: '', //服务地点
        prtContact: '', //联系人
        prtPhone: '', //电话
        remark: '', //备注
        attachmentList: [],
      }
      this.filelist = []
      this.nodetype = '0'
    },
    // 弹窗关闭
    handlecancel: function (type) {
      if (type == '0') {
        this.adddialog = false
      } else if (type == '1') {
        this.adddialog = false
      } else {
        this.wydialog = false
      }
    },
    // 上传文件
    choosefile: function (event, type) {
      let file
      if (type == '0') {
        file = this.$refs.file.files[0]
      } else {
        file = this.$refs.file1.files[0]
      }
      this.uploadfile(file, type)
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
            if (type == '0') {
              this.filelist.push({
                fileName: res.data.data.fileName,
                url: res.data.data.url,
                ossId: res.data.data.ossId,
              })
            } else {
              this.attachmentList.push({
                fileName: res.data.data.fileName,
                url: res.data.data.url,
                ossId: res.data.data.ossId,
              })
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
    handdelfile: function (index, type) {
      if (type == '0') {
        this.filelist.splice(index, 1)
      } else {
        this.attachmentList.splice(index, 1)
      }
    },
    // 删除 取消
    visibleDelCancel(id) {
      this.$refs[id].doClose()
    },
    // 删除确认
    visibleDelSubmit(rowData) {
      DelUserSign(rowData.id).then((res) => {
        console.log(res, '10101')
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
        this.$refs[rowData.id].doClose()
        this.getlist(1)
      })
    },
    // 选择事件类型
    choosetype: function (val) {
      console.log(val, '010100')
      let obj = this.typelist.filter((obj) => {
        return obj.prtTypeId == val
      })
      console.log(obj, '0bj')
      this.flowConfId = obj[0].flowConfId
      this.getreport()
    },
    //获取上报内容表单
    getreport: function () {
      let para = this.flowConfId
      GetprtReportForm(para).then((res) => {
        console.log(res, '010')
        this.reportform = res.data.data.fields
        console.log(this.reportform, 'this.reportform')
      })
    },
    // 编辑
    handlEdit: function (row) {
      console.log(row, '处理')
      this.prtNodeFlowId = row.prtNodeFlowId
      this.prtId = row.prtId
      this.changeTimeRow = {
        prtId: row.prtId,
        flowInstanceId: row.flowInstanceId,
        flowTaskId: row.flowTaskId,
      }
      this.xqdialog = true
      this.xqtitle = '物业服务处理'
      this.getdetail(row)
    },
    // 提交(登记)
    handleSave: function () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          let para = {
            prtTypeId: this.addForm.prtTypeId, //服务类型
            prtPlaceName: this.addForm.prtPlaceName, //服务地点
            prtContact: this.addForm.prtContact, //联系人
            prtPhone: this.addForm.prtPhone, //电话
            remark: this.addForm.remark, //备注
            attachmentList: this.filelist,
          }
          StartPrt(para).then((res) => {
            console.log(res, '登记')
            if (res.code == '200') {
              this.$message({
                message: res.msg,
                type: 'success',
              })
            } else {
              this.$message({
                message: res.msg,
                type: 'success',
              })
            }
            this.adddialog = false
            this.getlist(1)
          })
        }
      })
    },

    // 意见弹窗关闭
    yjclose: function () {
      this.yjForm = {
        comment: '',
        candidateUsers: [],
      }
      this.attachmentList = []
      this.yjdialog = false
    },
    // 操作按钮
    handlevent: function (type) {
      this.yjdialog = true
      this.yjForm = {
        comment: '',
        candidateUsers: [],
      }
      this.attachmentList = []
      this.yjjdtype = type
    },
    // 事件处理操作
    handlesubmit: function (type) {
      this.$refs.yjForm.validate((valid) => {
        if (valid) {
          let para = {
            taskId: this.flowTaskId,
            procInsId: this.flowInstanceId,
            businessKey: this.prtId,
            comment: '处理描述：' + this.yjForm.comment, //意见
            attachmentList: this.attachmentList, //附件
          }
          if (type == '0') {
            ServiceAccept(para).then((res) => {
              console.log(res, '同意受理')
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
              this.yjdialog = false
              this.xqdialog = false
              this.getlist(1)
            })
          } else if (type == '1') {
            ServiceRevocation(para).then((res) => {
              console.log(res, '服务撤销')
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
              this.yjdialog = false
              this.xqdialog = false
              this.getlist(1)
            })
          } else if (type == '2') {
            ServiceRollToRegister(para).then((res) => {
              console.log(res, '回退到登记')
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
              this.yjdialog = false
              this.xqdialog = false
              this.getlist(1)
            })
          } else if (type == '3') {
            let arr = this.$refs.roletree.getCheckedKeys()
            let c = []
            for (var i = 0; i < arr.length; i++) {
              c.push({
                name: arr[i],
                value: arr[i].indexOf('user'),
              })
            }
            this.yjForm.candidateUsers = []
            for (var j = 0; j < c.length; j++) {
              if (c[j].value == 0) {
                this.yjForm.candidateUsers.push(c[j].name.slice(4))
              }
            }
            para.candidateUsers = this.yjForm.candidateUsers
            ServiceAllot(para).then((res) => {
              console.log(res, '分派')
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
              this.yjdialog = false
              this.xqdialog = false
              this.getlist(1)
            })
          } else if (type == '4') {
            ServiceRejectSign(para).then((res) => {
              console.log(res, '拒签')
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
              this.yjdialog = false
              this.xqdialog = false
              this.getlist(1)
            })
          } else if (type == '5') {
            ServiceSign(para).then((res) => {
              console.log(res, '签收')
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
              this.yjdialog = false
              this.xqdialog = false
              this.getlist(1)
            })
          } else if (type == '6') {
            ServiceRollToFinished(para).then((res) => {
              console.log(res, '服务办结回退到服务完成')
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
              this.yjdialog = false
              this.xqdialog = false
              this.getlist(1)
            })
          } else {
            ServiceConclude(para).then((res) => {
              console.log(res, '服务办结')
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
              this.yjdialog = false
              this.xqdialog = false
              this.getlist(1)
            })
          }
        }
      })
    },
    // 重新登记
    resetdj: function (row) {
      debugger
      this.adddialog = true
      this.addflag = true
      this.getdetail(row)
      this.nodetype = '1'
    },
    // 重新登记提交
    resetsubmit: function () {
      let variables = {
        prtTypeId: this.addForm.prtTypeId,
        prtPlaceName: this.addForm.prtPlaceName,
        prtContact: this.addForm.prtContact,
        prtPhone: this.addForm.prtPhone,
        remark: this.addForm.remark,
        attachmentList: this.filelist, //附件 图片
      }
      let para = {
        taskId: this.flowTaskId,
        procInsId: this.flowInstanceId,
        businessKey: this.prtId,
        variables: variables, //流程变量信息
      }
      RegisterAgain(para).then((res) => {
        console.log(res, '重新登记')
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
        this.adddialog = false
        this.getlist(1)
      })
    },
    // 事件删除
    handledel: function (row) {
      console.log(row, '191919')
      let para = {
        taskId: row.flowTaskId,
        procInsId: row.flowInstanceId,
        businessKey: row.prtId,
      }
      ServiceDelete(para).then((res) => {
        console.log(res, '事件删除')
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
        this.getlist(1)
      })
    },
    // 撤回
    handlech: function (row) {
      let para = {
        taskId: row.flowTaskId,
        procInsId: row.flowInstanceId,
        businessKey: row.prtId,
      }
      ServiceWithdraw(para).then((res) => {
        console.log(res, '撤回')
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
        this.getlist(1)
      })
    },

    // 获取分派人员
    getuser: function () {
      PSelectDeptUserTree().then((res) => {
        this.userlist = res.data.data
        console.log(this.userlist, '获取分派人员')
      })
    },
    // 勾选人员
    handleClick: function (data) {
      console.log(data, '001010')
      let childata = this.$refs.roletree.getCheckedKeys()
      console.log(childata, 'childatachildatachildata')
    },
    bigpic(url) {
      this.bigDialog = true
      this.bigUrl = url
    },
  },
}
</script>

<style scoped>
.record-item {
  width: 100%;
  height: auto;
  padding: 10px;
  /* background-color: blue; */
  margin-bottom: 20px;
}
.record span {
  line-height: 30px;
}
.record-dot {
  /* background-color: #00beb8; */
  width: 20px;
  height: 100%;
  float: left;
}
.dot {
  width: 15px;
  height: 15px;
  border-radius: 100%;
  background-color: gray;
}
.record-content {
  /* background-color: blueviolet; */
  width: calc(100% - 30px);
  height: auto;
  border-left: 1px solid gray;
  float: left;
  margin-bottom: 20px;
  padding-left: 5px;
}
.detail-content {
  margin-left: 15px;
}
.activity-name {
  display: inline-block;
  width: 100%;
}
.editbox {
  /* background-color: red; */
}
.record {
  /* background-color: yellowgreen; */
}
.record-list {
  /* background-color: blue; */
}
.img-item{
  width: 50px;
}
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
.inf .avater {
  width: 15px;
}
.change-time {
  background-color: #00beb8;
  color: white;
  margin: 4px;
  padding: 4px;
}
.buttonforchangetime {
  /* background-color: #00beb8; */
  color: white;
  margin: 4px;
  padding: 4px;
}
.record {
  float: left;
  width: 80%;
  height: 400px;
  overflow: auto;
  padding: 20px;
  /* background-color: green; */
}
.record-list {
  /* background-color: red; */
  width: 80%;
  /* height: 150px; */
  /* height: auto !important; */
  border-left: 1px solid gray;
  margin-bottom: 15px;
  padding-left: 10px;
}
.dott {
  width: 15px;
  height: 15px;
  border-radius: 100%;
  background-color: gray;
  float: left;
  margin-left: -30px;
}

.rec-rt {
}
</style>
