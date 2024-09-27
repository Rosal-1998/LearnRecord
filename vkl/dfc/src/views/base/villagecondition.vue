<template>
  <div class="g-cont">
    <div class="g-ltside">
      <div class="tab-ul">
        <div
          :class="['tab-lst', { active: current == index }]"
          @click="handletab(index)"
          v-for="(item, index) in sidelist"
          :key="index"
        >
          {{ item.prtSidebarName }}
        </div>
      </div>
    </div>
    <div class="g-rtside" style="overflow-y: auto">
      <div v-if="current == '0'">
        <div class="promotional-video">
          <div class="video-text">宣传视频</div>
          <div class="video-main">
            <div class="video-btn">
              <div class="filebox">
                <input
                  type="file"
                  ref="file2"
                  class="file1"
                  @change="choosefile($event, '2')"
                />
                <span class="upfile-btn">选择上传视频</span>
              </div>
            </div>
            <div class="videobox">
              <li class="vide-lst">
                <video :src="videolist" controls="controls"></video>
                <img
                  src="../../assets/img/shanchu.png"
                  class="scimg"
                  @click="delfile(index, '2')"
                />
              </li>
            </div>
          </div>
        </div>
        <div class="promotional-video">
          <div class="video-text">大屏地址</div>
          <div class="video-main" style="margin-top: 30px">
            <el-input ref="firstInput"  class="bjq-tool" type="textarea" v-model="showUrl"></el-input>
          </div>
        </div>
        <div class="promotional-video">
          <div class="video-text">宣传图片</div>
          <div class="video-main">
            <div class="video-btn">
              <div class="filebox">
                <input
                  type="file"
                  ref="fileImg1"
                  class="file1"
                  @change="choosefile($event, '0', 1)"
                />
                <span class="upfile-btn">选择上传图片</span>
              </div>
            </div>
            <div class="imgbox">
              <div class="videobox" v-if="piclist.length > 0">
                <li
                  class="pic-lst"
                  v-for="(item, index) in piclist"
                  :key="index"
                >
                  <img :src="item.url" class="img" />
                  <img
                    src="../../assets/img/shanchu.png"
                    class="scimg"
                    @click="delfile(index, '0', 1)"
                  />
                </li>
              </div>
            </div>
          </div>
        </div>
        <div class="promotional-video">
          <div class="video-text">村简介文字</div>
          <div class="video-main" style="margin-top: 30px">
            <quill-editor
              ref="mwQuillEditor"
              v-model="briefIntroduction"
              class="bjq-tool ql-editors"
            />
            <!-- <el-input type="textarea" v-model="briefIntroduction"></el-input> -->
          </div>
        </div>
        <div class="promotional-video">
          <div class="video-text">村组织结构图</div>
          <div class="video-main">
            <div class="video-btn">
              <div class="filebox">
                <input
                  type="file"
                  ref="fileImg2"
                  class="file1"
                  @change="choosefile($event, '0', 2)"
                />
                <span class="upfile-btn">选择上传图片</span>
              </div>
            </div>
            <div class="imgbox">
              <div class="videobox" v-if="orgPicture.length > 0">
                <li
                  class="pic-lst"
                  v-for="(item, index) in orgPicture"
                  :key="index"
                >
                  <img :src="item.url" class="img" />
                  <img
                    src="../../assets/img/shanchu.png"
                    class="scimg"
                    @click="delfile(index, '0', 2)"
                  />
                </li>
              </div>
            </div>
          </div>
        </div>
        <div class="promotional-video">
          <div class="video-text">村组织领导</div>
          <div class="video-main" style="margin-top: 30px">
            <quill-editor
              ref="mwQuillEditor1"
              v-model="briefleader"
              class="bjq-tool ql-editors"
            />
            <!-- <el-input type="textarea" v-model="briefleader"></el-input> -->
          </div>
        </div>
        <div class="savepromotional" @click="submitpromot">保存</div>
      </div>
      <div v-if="current == '1'">
        <div class="m-search" style="display: flex">
          <span
            class="btn add-btn"
            style="margin-right: 560px"
            @click="addLeader"
            >添加</span
          >
          <el-form :model="filters" :inline="true" ref="filters">
            <el-form-item label="姓名" class="ipt150" prop="name">
              <el-input
                v-model="filters.name"
                placeholder="输入姓名"
              ></el-input>
            </el-form-item>
            <div class="search-btnbox" style="margin-left: 0">
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
            <el-table-column
              label="序号"
              prop="number"
              width="100"
              :show-overflow-tooltip="true"
            >
            </el-table-column>
            <el-table-column
              label="姓名"
              prop="name"
              width="150"
              :show-overflow-tooltip="true"
            >
            </el-table-column>
            <el-table-column label="照片" prop="" class="leaderimg">
              <template slot-scope="scope">
                <img
                  :src="scope.row.photoUrl"
                  alt=""
                  style="widch: 60px; height: 60px"
                />
              </template>
            </el-table-column>
            <el-table-column label="职务" prop="post" width="120">
            </el-table-column>
            <el-table-column label="展示状态" prop="">
              <template slot-scope="scope">
                <span
                  class="radio-tab"
                  v-if="scope.row.showStatus == '0'"
                  @click="handlestatus(scope.row, '0')"
                >
                  展示&nbsp;<img
                    src="../../assets/img/status-active.png"
                    class="status-img"
                  />
                </span>
                <span
                  class="radio-tab"
                  v-else-if="scope.row.showStatus == '1'"
                  @click="handlestatus(scope.row, '0')"
                >
                  隐藏&nbsp;<img
                    src="../../assets/img/status-gray.png"
                    class="status-img"
                  />
                </span>
                <span v-else> / </span>
              </template>
            </el-table-column>
            <el-table-column label="介绍" prop="introduce"> </el-table-column>
            <el-table-column label="操作" prop="" width="200">
              <template slot-scope="scope">
                <div>
                  <span class="detail-title" @click="handDetails(scope.row)"
                    >详情</span
                  >
                  <span class="detail-title" style="margin: 0 10px;" @click="handleEdit(scope.row)"
                    >编辑</span
                  >
                  <el-popover
                    :ref="scope.row.leadershipId"
                    placement="top"
                    width="160"
                    popper-class="popover"
                  >
                    <p class="del-tip">是否删除该条数据？</p>
                    <div class="pop-btnbox">
                      <span
                        class="cancel-btn"
                        @click="visibleDelCancel(scope.row.leadershipId)"
                        >取消</span
                      >
                      <span
                        class="ok-btn"
                        @click="visibleDelSubmit(scope.row.leadershipId)"
                        >确定</span
                      >
                    </div>
                    <span slot="reference" class="del-title">删除</span>
                  </el-popover>
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
      <!-- 新增、编辑 -->
      <el-dialog
        :visible.sync="adddialog"
        v-if="adddialog"
        class="g-dialog"
        :title="diatitle"
      >
        <div :class="iseidt ? 'addbox' : ''">
          <div class="lt">
            <el-form
              :model="addForm"
              :inline="true"
              ref="addForm"
              :rules="addFormRules"
              class="addform add-signcent"
              label-postion="right"
              label-width="100px"
            >
              <el-form-item label="姓名" prop="name">
                <el-input
                  v-model="addForm.name"
                  placeholder="请输入姓名"
                ></el-input>
              </el-form-item>
              <el-form-item label="序号" prop="number">
                <el-input
                type = "number"
                  v-model="addForm.number"
                  placeholder="请输入序号"
                ></el-input>
              </el-form-item>
              <el-form-item label="职务" prop="post">
                <el-input
                  v-model="addForm.post"
                  placeholder="请输入职务"
                ></el-input>
              </el-form-item>
              <el-form-item label="展示状态" prop="showStatus">
                <div
                  class="radio-lst"
                  v-if="addForm.showStatus == '0'"
                  @click="handlestatus('1', '1')"
                >
                  <img
                    src="../../assets/img/status-active.png"
                    class="status-img"
                  />
                  展示
                </div>
                <div
                  class="radio-lst"
                  v-if="addForm.showStatus == '1'"
                  @click="handlestatus('0', '1')"
                >
                  <img
                    src="../../assets/img/status-gray.png"
                    class="status-img"
                  />
                  隐藏
                </div>
              </el-form-item>
              <el-form-item
                label="照片"
                prop="photoId"
                style="width: 100%"
                class="delbgimg"
                :key="formItemKey"
              >
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
                <i class="del-tip1" v-if="editflag" @click="handlesyimg"
                  >删除</i
                >
              </el-form-item>
              <el-form-item label="介绍" prop="introduce">
                <el-input
                  type="textarea"
                  v-model="addForm.introduce"
                  placeholder="请输入介绍"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="dialog-foot">
          <span class="btn-cancel" @click="handlecancel('0')">取消</span>
          <span class="btn-save" @click="handleSave">保存</span>
        </div>
      </el-dialog>
      <!-- 详情 -->
      <el-dialog
        :visible.sync="xqdialog"
        v-if="xqdialog"
        class="g-dialog min-dia642"
        title="领导详情"
      >
        <span class="tip">基础信息</span>
        <div class="xq-content car-detail">
          <div class="xq-lst">
            <span class="name">序号</span>
            <span class="lab">{{ detailform.number }}</span>
          </div>
          <div class="xq-lst">
            <span class="name">姓名</span>
            <span class="lab">{{ detailform.name }}</span>
          </div>
          <div class="xq-lst">
            <span class="name">职务</span>
            <span class="lab">{{ detailform.post }}</span>
          </div>
          <div class="xq-lst">
            <span class="name">状态</span>
            <span class="lab" v-if="detailform.showStatus == '0'">显示</span>
            <span class="lab" v-if="detailform.showStatus == '1'">隐藏</span>
          </div>
          <div class="xq-lst">
            <span class="name">照片</span>
            <img :src="detailform.photoUrl" class="carimg" />
          </div>
          <div class="xq-lst">
            <span class="name">介绍</span>
            <span class="lab">{{ detailform.introduce }}</span>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  leadershipList,
  leaderUpdateStatus,
  leaderAdd,
  leaderEdit,
  leaderQuery,
  leaderDelete,
  VillageQuery,
  VillageAdd,
  VillageUpdate,
} from "../../api/api.js";
import axios from "axios";
import { quillEditor, Quill } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import qs from "qs";

export default {
  components: {
    quillEditor,
  },
  data() {
    return {
      sidelist: [
        {
          prtSidebarName: "村简介",
        },
        {
          prtSidebarName: "领导分工",
        },
      ],
      current: "0",
      briefIntroduction: "",
      briefleader: "",
      showUrl: '',
      filters: {
        name: "",
        size: 10,
        current: 1,
      },
      total: 0,
      currentPage: 1,
      currentPage1: 1,
      pagesize: 10,
      datalist: [],
      listLoading: false,
      adddialog: false,
      diatitle: "",
      addForm: {
        number: "",
        name: "",
        photoId: "",
        post: "",
        introduce: "",
        showStatus: "0",
        photoUrl: "",
        leadershipId: "",
      },
      addFormRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        post: [{ required: true, message: "请输入职务", trigger: "blur" }],
        showStatus: [
          { required: true, message: "请选择是否展示", trigger: "blur" },
        ],
        introduce: [{ required: true, message: "请输入介绍", trigger: "blur" }],
        photoId: [{ required: true, message: "请上传图片", trigger: "blur" }],
      },
      iseidt: false, //是否为编辑框
      formItemKey: 0,
      editflag: false,
      xqdialog: false,
      detailform: {},
      filelist: [],
      videolist: "", //村简介视频
      videoId: "", //视频id
      piclist: [], //村简介图片
      // picIdlist: "", //图片id
      orgPicture: [], // 村组织图片
      orgPictureId: "", // 村组织图片id
      imgStatu: '', // 图片类型
      photoList: [],
      villageIntroductionId: "", //村简介id
    };
  },
  mounted() {
    // 获取村
    this.getVillageContent();
    this.getlist("");
    // this.$refs.firstInput.focus();
  },
  methods: {
    // 切换
    handletab: function (type) {
      this.current = type;
    },
    // 重置
    resetForm: function () {
      this.filters = {
        name: "",
        size: 10,
        current: 1,
      };
      this.getlist("");
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
    // 单行变色
    tableRowClassName: function (rowIndex) {
      if (rowIndex.rowIndex % 2 != 0) {
        return "evenRow";
      }
      return "oddRow";
    },
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
      console.log(para);
      leadershipList(para).then((res) => {
        this.datalist = res.data.rows;
        this.total = res.data.total;
        console.log(res);
      });
    },
    // 切换状态
    handlestatus: function (row, type) {
      if (type == "0") {
        let para = row.leadershipId;
        leaderUpdateStatus(para).then((res) => {
          console.log(res, "状态");
          if (res.code == "200") {
            this.$message({
              message: res.msg,
              type: "success",
            });
            this.getlist("");
          } else {
            this.$message({
              message: res.msg,
              type: "error",
            });
          }
        });
      } else {
        console.log(row);
        this.addForm.showStatus = row;
      }
    },
    // 新增
    addLeader: function () {
      this.adddialog = true;
      this.diatitle = "添加领导";
      this.iseidt = false;
      this.addForm = {
        number: "",
        name: "",
        photoId: "",
        post: "",
        introduce: "",
        showStatus: "0",
        photoUrl: "url('../img/empty.png') no-repeat",
        leadershipId: "",
      };
      this.editflag = false;
    },
    // 编辑
    handleEdit: function (row) {
      this.adddialog = true;
      this.editflag = true
      this.diatitle = "编辑领导";
      this.getDetail(row.leadershipId);
    },
    // 图片上传
    choosefile: function (event, type, imgType = '') {
      let file;
      if (type == "0") {
        if (imgType == 1) {
          // 宣传图片
          this.imgStatu = 1
          file = this.$refs.fileImg1.files[0]; // 图片上传
        } else {
          // 组织结构图
          this.imgStatu = 2
          if (this.orgPicture.length > 0) {
            this.$message({
              message: "请先删除已上传的图片",
              type: "error",
            })
          }
          file = this.$refs.fileImg2.files[0]; // 图片上传
        }
      } else if (type == "2") {
        file = this.$refs.file2.files[0]; //视频上传
      } else if (type == "1") {
        console.log('上传头像')
        file = this.$refs.file1.files[0]; // 新增弹框下图片上传
      } else {
      }
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
            console.log(res.data.data.url);
            if (type == "0") {
              // 图片
              if (this.imgStatu == 1) {
                this.piclist.push({
                  url: res.data.data.url,
                });
                this.photoList.push({
                  ossId: res.data.data.ossId,
                });
              } else {
                this.orgPicture = [{
                  url: res.data.data.url,
                }]
                this.orgPictureId = res.data.data.ossId
              }
            } else if (type == "2") {
              //视频
              this.videolist = res.data.data.url;
              this.videoId = res.data.data.ossId;
            } else if (type == "1") {
              this.filelist = [];
              this.filelist.push({
                name: res.data.data.fileName,
                ossId: res.data.data.ossId,
              });
              this.addForm.photoUrl = res.data.data.url;
              this.addForm.photoId = res.data.data.ossId;
              this.editflag = true;
            } else {
            }
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
    // 删除图片
    handlesyimg: function () {
      this.addForm.photoId = ''
      this.addForm.photoUrl = require("@/assets/img/empty.png");
      this.editflag = false;
      // 更新key，强制el-form-item 重新渲染
      this.formItemKey += 1;
    },
    // 删除文件
    delfile: function (index, type, fileType = '') {
      if (type == "0") {
        if (fileType == 1) {
          this.piclist.splice(index, 1);
          this.photoList.splice(index, 1);
        } else {
          this.orgPicture.splice(index, 1)
          this.orgPictureId = ""
        }
      } else if (type == "2") {
        this.videolist.splice(index, 1);
      } else {
      }
    },
    // 弹窗关闭
    handlecancel: function () {
      this.$refs.addForm.resetFields();
      this.addForm = {
        number: "",
        name: "",
        photoId: "",
        post: "",
        introduce: "",
        showStatus: "0",
        photoUrl: "",
        leadershipId: "",
      };
      this.adddialog = false;
    },
    // 保存
    handleSave: function () {
      // console.log('this.$refs.addForm',this.$refs.addForm.attributes)
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          let photoId;
          let arr = [];
          if (this.filelist.length > 0) {
            for (var i = 0; i < this.filelist.length; i++) {
              arr.push(this.filelist[i].ossId);
            }
            photoId = arr.join(",");
          } else {
            photoId = "";
          }
          let para = {
            number: this.addForm.number,
            name: this.addForm.name,
            photoId: this.addForm.photoId,
            post: this.addForm.post,
            introduce: this.addForm.introduce,
            showStatus: this.addForm.showStatus,
            leadershipId: this.addForm.leadershipId,
          };
          if (this.addForm.leadershipId) {
            leaderEdit(para).then((res) => {
              if (res.code == "200") {
                this.$message({
                  message: res.msg,
                  type: "success",
                });
                this.getlist(1);
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
            leaderAdd(para).then((res) => {
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
    // 点击详情
    handDetails(row) {
      this.xqdialog = true;
      this.getDetail(row.leadershipId);
    },
    // 详情
    getDetail(id) {
      leaderQuery(id).then((res) => {
        this.addForm = res.data.data;
        this.detailform = res.data.data;
      });
    },
    // 删除取消
    visibleDelCancel(id) {
      this.$refs[id].doClose();
    },
    // 删除确定
    visibleDelSubmit(id) {
      leaderDelete(id).then((res) => {
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
        this.$refs[id].doClose();
        this.getlist(1);
      });
    },
    // 获取村简介
    getVillageContent() {
      this.piclist = [];
      this.picIdlist = "";
      VillageQuery().then((res) => {
        if (res.data.code == "200") {
          console.log(res.data.data);
          this.showUrl = res.data.data.showUrl;
          this.briefIntroduction = res.data.data.briefIntroduction;
          this.briefleader = res.data.data.organizationDescribe;
          this.videolist = res.data.data.videoUrl;
          this.videoId = res.data.data.videoId;
          this.villageIntroductionId = res.data.data.villageIntroductionId;
          
          let arr = [];
          arr = res.data.data.pictureUrl.split(",");
          for (var i = 0; i < arr.length; i++) {
            this.piclist.push({
              url: arr[i],
            });
          }
          let arr1 = [];
          arr1 = res.data.data.pictureId.split(",");
          for (var i = 0; i < arr1.length; i++) {
            this.photoList.push({
              ossId: arr1[i],
            });
          }
          this.orgPicture = [{
            url: res.data.data.orgPictureUrl
          }]
          this.orgPictureId = res.data.data.orgPictureId
        }
      });
    },
    //村简介保存
    submitpromot() {
      let para = {
        videoId: this.videoId,
        pictureId: this.photoList.map(item => item.ossId).join(','),
        orgPictureId: this.orgPictureId	,
        briefIntroduction: this.briefIntroduction,
        organizationDescribe: this.briefleader,
        villageIntroductionId: this.villageIntroductionId,
        showUrl: this.showUrl
      };
      if (
        this.briefIntroduction ||
        this.briefleader ||
        this.videoId ||
        this.villageIntroductionId
      ) {
        VillageUpdate(para).then((res) => {
          if (res.code == "200") {
            this.$message({
              message: res.msg,
              type: "success",
            });
            this.piclist = []
            this.photoList = []
            this.getVillageContent();
          } else {
            this.$message({
              message: res.msg,
              type: "error",
            });
          }
        });
      } else {
        VillageAdd(para).then((res) => {
          if (res.code == "200") {
            this.$message({
              message: res.msg,
              type: "success",
            });
            this.getVillageContent();
          } else {
            this.$message({
              message: res.msg,
              type: "error",
            });
          }
        });
      }
    },
  },
};
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
</style>