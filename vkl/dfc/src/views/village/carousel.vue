<template>
  <div class="g-cont">
    <div class="g-ltside">
      <div class="tab-ul">
        <div
          :class="['tab-lst', { active: current == index }]"
          @click="handletab(index)"
          v-for="(item, index) in sidelist"
          :key="item.title"
        >
          {{ item.title }}
        </div>
      </div>
    </div>
    <div class="g-rtside" style="overflow-y: auto">
      <div class="c-header">
        <div class="add-cbtn" v-if="current === 0" @click="handleAddPhoto">
          添加图片
        </div>
        <div class="add-cbtn" v-else @click="handleAddVideo">添加视频</div>
      </div>
      <div class="c-main">
        <div
          class="c-main-item"
          v-for="(item, index) in dataList1"
          :key="index + 'a'"
        >
          <video
            v-if="current === 1"
            class="wrapper"
            :src="item.videoUrl"
            controls
          ></video>
          <img v-else class="wrapper" :src="item.pictureUrl" alt="" />
          <!-- <video class="wrapper" src=""></video> -->
          <div class="main-content">
            <div class="mc-left">{{ item.name }}</div>
            <div class="mc-right">
              <!-- 轮播图-编辑 -->
              <img 
                v-if="current === 0"
                class="icon-wh"
                src="../../assets/img/edit.png"
                alt=""
                @click="handleEditPhoto(item.carouselChartId)"
              />
              <!-- 轮播视频-编辑 -->
              <img
                v-else
                class="icon-wh"
                src="../../assets/img/edit.png"
                alt=""
                @click="handleEditPhoto(item.carouselVideoId)"
              />
              <!-- 轮播图-删除 -->
              <el-popover
                v-if="current === 0"
                :ref="item.carouselChartId"
                placement="top"
                width="160"
                popper-class="popover"
              >
                <p class="del-tip">是否删除该轮播图？</p>
                <div class="pop-btnbox">
                  <span
                    class="cancel-btn"
                    @click="visibleDelCancel(item.carouselChartId)"
                    >取消</span
                  >
                  <span
                    class="ok-btn"
                    @click="visibleDelSubmit(item.carouselChartId)"
                    >确定</span
                  >
                </div>
                <span slot="reference">
                  <img
                    class="icon-wh"
                    src="../../assets/img/delete2.png"
                    alt=""
                  />
                </span>
              </el-popover>
              <!-- 轮播视频-删除 -->
              <el-popover
                v-else
                :ref="item.carouselVideoId"
                placement="top"
                width="160"
                popper-class="popover"
              >
                <p class="del-tip">是否删除该轮播视频？</p>
                <div class="pop-btnbox">
                  <span
                    class="cancel-btn"
                    @click="visibleDelCancel(item.carouselVideoId)"
                    >取消</span
                  >
                  <span
                    class="ok-btn"
                    @click="visibleDelSubmit(item.carouselVideoId)"
                    >确定</span
                  >
                </div>
                <span slot="reference">
                  <img
                    class="icon-wh"
                    src="../../assets/img/delete2.png"
                    alt=""
                  />
                </span>
              </el-popover>
            </div>
          </div>
        </div>
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
        <el-form-item label="名称" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="序号" prop="sort">
          <el-input
            type="number"
            v-model="addForm.sort"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <template v-if="current === 0">
          <el-form-item label="照片" prop="pictureId" class="delbgimg">
            <div
              class="upimgbox"
              :style="{
                backgroundImage: 'url(' + addForm.pictureUrl + ')',
              }"
            >
              <input
                ref="file1"
                type="file"
                class="file"
                @change="choosefile($event)"
              />
            </div>
            <i class="del-tip1" v-if="addForm.pictureId" @click="handlesyimg"
              >删除</i
            >
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="视频" prop="" class="delbgimg">
            <div
              v-if="!addForm.videoId"
              class="upimgbox"
              :style="{
                backgroundImage: 'url(' + tipsUrl + ')',
              }"
            >
              <input
                ref="file1"
                type="file"
                class="file"
                @change="choosefile($event)"
              />
            </div>
            <video
              v-else
              class="video-list"
              :src="addForm.videoUrl"
              controls
            ></video>
            <i class="del-tip1" v-if="addForm.videoId" @click="handlesyimg"
              >删除</i
            >
          </el-form-item>
          <el-form-item label="视频地址" prop="videoUrl">
            <el-input v-model="addForm.videoUrl" disabled></el-input>
          </el-form-item>
        </template>
      </el-form>
      <div class="dialog-foot" v-if="current === 0">
        <span class="btn-cancel" @click="handlecancel">取消</span>
        <span class="btn-save" @click="handleSubmit">保存</span>
      </div>
      <div class="dialog-foot" v-else>
        <span class="btn-cancel" @click="handlecancel">取消</span>
        <span class="btn-save" @click="handleSubmit2">保存</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCarouselPList,
  addCarouselP,
  editCarouselP,
  delCarouselP,
  getCarouselP,
} from "../../api/api";
import {
  getCarouselVList,
  addCarouselV,
  editCarouselV,
  delCarouselV,
  getCarouselV,
} from "../../api/api";
import axios from "axios";
export default {
  data() {
    return {
      sidelist: [
        { title: "轮播图", type: 0 },
        { title: "轮播视频", type: 1 },
      ],
      current: 0,
      adddialog: false,
      addForm: {},
      addForm2: {},
      diatitle: "",
      addFormRules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        pictureId: [{ required: true, message: "请上传图片", trigger: "blur" }],
      },
      dataList1: [],
      tipsUrl: require("@/assets/img/empty.png"),
    };
  },
  mounted() {
    this.getList1();
  },
  methods: {
    handletab(index) {
      this.dataList1 = [];
      if (index === 0) {
        this.getList1();
      } else {
        this.getList2();
      }
      this.current = index;
    },
    // 添加图片
    handleAddPhoto() {
      this.initAddForm();
      this.adddialog = true;
      this.diatitle = "添加轮播图";
    },
    // 添加视频
    handleAddVideo() {
      this.initAddForm2();
      this.adddialog = true;
      this.diatitle = "添加轮播视频";
    },
    // 修改图片
    handleEditPhoto(id) {
      if (this.current === 0) {
        this.diatitle = "修改轮播图";
        this.getDetail(id);
      } else {
        this.diatitle = "修改轮播视频";
        this.getDetail2(id);
      }
      this.adddialog = true;
    },
    // 取消删除
    visibleDelCancel(id) {
      this.$refs[id][0].doClose();
    },
    // 确定删除
    visibleDelSubmit(id) {
      if (this.current === 0) {
        delCarouselP(id).then((res) => {
          if (res.code == "200") {
            this.$message({
              message: res.msg,
              type: "success",
            });
            this.$refs[id][0].doClose();
            this.getList1();
          } else {
            this.$message({
              message: res.msg,
              type: "error",
            });
          }
        });
      } else {
        delCarouselV(id).then((res) => {
          if (res.code == "200") {
            this.$message({
              message: res.msg,
              type: "success",
            });
            this.$refs[id][0].doClose();
            this.getList2();
          } else {
            this.$message({
              message: res.msg,
              type: "error",
            });
          }
        });
      }
    },
    // 取消
    handlecancel() {
      this.adddialog = false;
      this.initAddForm();
    },
    // 保存
    handleSubmit() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          if (!this.addForm.pictureId) {
            this.$message({
              message: "请上传图片123",
              type: "error",
            });
            return;
          }
          if (!this.addForm.carouselChartId) {
            addCarouselP(this.addForm).then((res) => {
              if (res.code == 200) {
                this.$message({
                  message: "添加成功",
                  type: "success",
                });
                this.adddialog = false;
                this.getList1();
              } else {
                this.$message({
                  message: res.msg,
                  type: "error",
                });
              }
            });
          } else {
            editCarouselP(this.addForm).then((res) => {
              if (res.code == 200) {
                this.$message({
                  message: "修改成功",
                  type: "success",
                });
                this.adddialog = false;
                this.getList2();
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
    handleSubmit2() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          if (!this.addForm.videoId) {
            this.$message({
              message: "请上传视频",
              type: "error",
            });
            return;
          }
          if (!this.addForm.carouselVideoId) {
            addCarouselV(this.addForm).then((res) => {
              if (res.code == 200) {
                this.$message({
                  message: "添加成功",
                  type: "success",
                });
                this.adddialog = false;
                this.getList2();
              } else {
                this.$message({
                  message: res.msg,
                  type: "error",
                });
              }
            });
          } else {
            editCarouselV(this.addForm).then((res) => {
              if (res.code == 200) {
                this.$message({
                  message: "修改成功",
                  type: "success",
                });
                this.adddialog = false;
                this.getList2();
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
    // 获取图片列表
    getList1() {
      getCarouselPList().then((res) => {
        if (res.code == 200) {
          this.dataList1 = res.rows;
        }
      });
    },
    // 获取视频列表
    getList2() {
      getCarouselVList().then((res) => {
        if (res.code == 200) {
          this.dataList1 = res.rows;
        }
      });
    },
    // 获取详情-轮播图
    getDetail(id) {
      getCarouselP(id).then((res) => {
        if (res.code == 200) {
          this.addForm = res.data;
        }
      });
    },
    // 获取详情-轮播视频
    getDetail2(id) {
      getCarouselV(id).then((res) => {
        if (res.code == 200) {
          this.addForm = res.data;
        }
      });
    },
    // 导入、图片上传
    choosefile: function (e) {
      // 文件上传
      let file = this.$refs.file1.files[0];
      const filename = file.name.split(".").pop().toLowerCase();
      if (this.current === 1) {
        const videoExtensions = ["mp4", "wmv", "avi", "mov"];
        if (!videoExtensions.includes(filename)) {
          this.$message({
            message: "请上传mp4/wmv/avi/mov的视频格式文件",
            type: "error",
          });
          return;
        }
      }
      this.uploadfile(file);
      e.target.value = "";
    },
    // 文件上传后获取数据
    uploadfile: function (data) {
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
            if (this.current === 0) {
              this.addForm.pictureUrl = res.data.data.url;
              this.addForm.pictureId = res.data.data.ossId;
            } else {
              this.addForm.videoUrl = res.data.data.url;
              this.addForm.videoId = res.data.data.ossId;
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
      if (this.current === 0) {
        this.addForm.pictureUrl = require("@/assets/img/empty.png");
        this.addForm.pictureId = "";
      } else {
        this.addForm.videoUrl = "";
        this.addForm.videoId = "";
      }
    },
    // 重置addForm
    initAddForm() {
      this.addForm = {
        name: "",
        sort: "",
        pictureId: "",
        pictureUrl: require("@/assets/img/empty.png"),
      };
    },
    // 重置addForm
    initAddForm2() {
      this.addForm = {
        name: "",
        sort: "",
        videoId: "",
        videoUrl: "",
      };
    },
  },
};
</script>

<style scoped>
::v-deep .el-input__inner {
  width: 500px;
}
.g-rtside {
  display: flex;
  flex-direction: column;
  padding: 0;
}
/* 订部信息 */
.c-header {
  height: 80px;
  border-bottom: 1px solid #eeeeee;
  display: flex;
  align-items: center;
}
.c-header .add-cbtn {
  width: 120px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background: #e1edfe;
  border-radius: 2px 2px 2px 2px;
  border: 1px solid #4892fd;
  cursor: pointer;
  margin-left: 12px;
}
.c-main {
  padding: 12px;
  flex: 1;
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 8px;
  box-sizing: border-box;
}
.c-main .c-main-item {
  flex-shrink: 0;
  width: 430px;
  height: 363px;
  background: #ffffff;
  box-shadow: 0px 3px 6px 1px #eeeeee;
  border-radius: 8px 8px 8px 8px;
  border: 1px solid #dddddd;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 12px;
}
.c-main .c-main-item .main-content {
  width: 398px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.main-content .mc-left {
  flex: 1;
  font-size: 16px;
  color: #333333;
}
.main-content .mc-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.video-list {
  width: 200px;
  height: 100px;
}
.wrapper {
  width: 398px;
  height: 299px;
}
.icon-wh {
  width: 24px;
  height: 24px;
  cursor: pointer;
}
</style>