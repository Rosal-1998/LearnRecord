<template>
  <div class="g-cont">
    <div class="m-contain">
      <div class="promotional-video">
        <div class="video-text">红色物业简介</div>
        <div class="video-main">
          <quill-editor ref="mwQuillEditor" v-model="briefIntroduction" class="bjq-tool ql-editors" />
        </div>
      </div>
      <div class="promotional-video">
        <div class="video-text">红色物业架构图</div>
        <div class="video-main">
          <div class="video-btn">
            <div class="filebox">
              <input
                type="file"
                ref="file"
                class="file1"
                @change="choosefile()"
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
                  @click="delfile(organizationalChart, '0')"
                />
              </li>
            </div>
          </div>
        </div>
      </div>
      <div class="savepromotional" style="margin-top: 200px" @click="submit">
        保存
      </div>
    </div>
  </div>
</template>

<script>
import {
  property,
  propertyAdd,
  propertyUpdate,
  propertyDelete,
} from "../../api/api";
import axios from "axios";
	import { quillEditor,Quill  } from 'vue-quill-editor'
	import 'quill/dist/quill.core.css'
	import 'quill/dist/quill.snow.css'
	import 'quill/dist/quill.bubble.css'
import qs from "qs";

export default {
    components: {
		    quillEditor
		},
  data() {
    return {
      briefIntroduction: "",
      organizationalChart: "",
      organizationalChartUrl: "",
      redPropertyId: "",
    };
  },
  mounted() {
    this.getlist();
  },
  methods: {
    getlist() {
      property("red").then((res) => {
        this.briefIntroduction = res.data.data.briefIntroduction;
        this.organizationalChartUrl = res.data.data.organizationalChartUrl;
        this.organizationalChart = res.data.data.organizationalChart;
        this.redPropertyId = res.data.data.redPropertyId;
      });
    },
    // 图片上传
    choosefile: function () {
      let file = this.$refs.file.files[0]; // 图片上传
      this.uploadfile(file);
    },
    // 文件上传
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
            this.organizationalChartUrl = res.data.data.url;
            this.organizationalChart = res.data.data.ossId;
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
    // 删除文件
    delfile: function (index, type) {
      this.organizationalChartUrl = "";
      this.organizationalChart = "";
    },
    // 保存
    submit() {
      let para = {
        redPropertyId: this.redPropertyId,
        briefIntroduction: this.briefIntroduction,
        organizationalChart: this.organizationalChart,
        classification: "red",
      };
      if (this.redPropertyId) {
        propertyUpdate(para).then((res) => {
          if (res.code == "200") {
            this.$message({
              message: res.msg,
              type: "success",
            });
            this.getlist();
          } else {
            this.$message({
              message: res.msg,
              type: "error",
            });
          }
        });
      } else {
        propertyAdd(para).then((res) => {
          if (res.code == "200") {
            this.$message({
              message: res.msg,
              type: "success",
            });
            this.getlist();
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