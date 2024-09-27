<template>
  <div class="g-cont">
    <div
      class="m-contain"
      style="overflow-y: auto"
      :style="{ height: styleChangeHeight }"
    >
      <div class="clock-lt">
        <div style="overflow: auto">
          <div class="time-select">
            <span
              :class="['select-lst', { active: current == '0' }]"
              @click="handleday('0')"
              >年</span
            >
            <span
              :class="['select-lst', { active: current == '1' }]"
              @click="handleday('1')"
              >月</span
            >
            <div class="mon-selet">
              <div
                class=""
                v-if="current == '1'"
                style="display: inline-block; float: left"
              >
                本月：<el-date-picker
                  v-model="time"
                  type="month"
                  placeholder="选择月"
                  :clearable="false"
                  @change="selecttime($event, '1')"
                  foramt="yyyy年MM"
                  ref="time"
                ></el-date-picker>
              </div>
              <div
                class=""
                v-if="current == '0'"
                style="display: inline-block; float: left"
              >
                本年：<el-date-picker
                  v-model="time"
                  type="year"
                  placeholder="选择年"
                  :clearable="false"
                  @change="selecttime($event, '0')"
                ></el-date-picker>
              </div>
              <i class="iconfont icon-huifu"></i>
            </div>
          </div>
          <div class="table-box">
            <table border="0" cellspacing="0" cellpadding="0">
              <thead>
                <tr>
                  <th class="min-th">姓名</th>
                  <th class="min-th">
                    <div class="out">
                      <b>日</b>
                      <em>月</em>
                    </div>
                  </th>
                  <th v-for="(item, index) in timelist" :key="index">
                    <i class="bg-th" v-if="item.type == '2'">{{ item.day }}</i>
                    <i class="bg-th" v-else-if="item.type == '1'">{{
                      item.day
                    }}</i>
                    <i class="bg-th" v-else-if="item.type == '0'">{{
                      item.day
                    }}</i>
                    <i v-else>{{ item.day }}</i>
                  </th>
                </tr>
              </thead>
              <tbody v-if="daylist.length > 0">
                <tr v-for="(item, index) in daylist" :key="index">
                  <td>{{ item.nickName }}</td>
                  <td>{{ item.month }}</td>
                  <td
                    v-for="(items, index) in item.arr"
                    :key="index"
                    :class="{
                      holidy: items.type == '2',
                      week: items.type == '1',
                    }"
                  >
                    <i
                      class="icon-tiaoxiushenqing"
                      v-if="items.status == '4'"
                    ></i>
                    <i
                      class="icon-qingjia1"
                      v-else-if="items.status == '3'"
                    ></i>
                    <i class="icon-jiaban" v-else-if="items.status == '2'"></i>
                    <i
                      class="icon-zhengchang"
                      v-else-if="items.status == '1'"
                    ></i>
                    <i
                      class="icon-jingyingyichang"
                      v-else-if="items.status == '0'"
                    ></i>
                    <i
                      class="icon-shijian"
                      v-else-if="items.status == '-1'"
                    ></i>
                    <i class="icon-zaotui" v-else-if="items.status == '-2'"></i>
                    <i class="icon-yanchi" v-else-if="items.status == '-3'"></i>
                    <i class="icon-shalou" v-else-if="items.status == '-4'"></i>
                    <i
                      class="icon-kuanggong"
                      v-else-if="items.status == '-5'"
                    ></i>
                    <i v-else></i>
                  </td>
                </tr>
              </tbody>
              <tbody v-else class="empty-tbody">
                <td colspan="33">暂时数据</td>
              </tbody>
            </table>
          </div>
          <div class="msbox">
            <div class="lt-icon">
              <i class="mstip">图标说明：</i>
              <div class="col-lst">
                <i class="icon-zhengchang" style=""></i> 正常
              </div>
              <div class="col-lst"><i class="icon-shijian"></i> 迟到</div>
              <div class="col-lst"><i class="icon-zaotui"></i> 早退</div>
              <div class="col-lst"><i class="icon-kuanggong"></i> 旷工</div>
              <div class="col-lst"><i class="icon-shalou"></i> 漏签</div>
              <div class="col-lst"><i class="icon-qingjia1"></i> 请假</div>
              <div class="col-lst">
                <i class="icon-chuchalvyouchuxing"></i> 出差
              </div>
              <div class="col-lst"><i class="icon-jiaban"></i> 加班</div>
              <div class="col-lst">
                <i class="icon-jingyingyichang"></i> 异常
              </div>
              <div class="col-lst"><i class="icon-yanchi"></i> 迟到早退</div>
            </div>
            <div class="rt-color">
              <i class="mstip">颜色说明：</i>
              <div class="col-lst">
                <i class="boxicon" style="background-color: #90ffaf"></i> 节假日
              </div>
              <div class="col-lst">
                <i class="boxicon" style="background-color: #e9e9e9"></i> 周末
              </div>
              <div class="col-lst">
                <i class="boxicon" style="background-color: #b7b7b7"></i> 无效
              </div>
            </div>
          </div>
        </div>
        <span class="tjname">统计分析</span>
        <div class="m-table">
          <!-- <span class="btn down-btn" @click="handledown">下载导入模版</span>
          <span class="btn import-btn"
            ><input
              type="file"
              ref="filebox"
              name="file"
              class="fileipt"
              @change="handleimport($event)"
            />导入</span
          > -->
          <span
            class="btn down-btn"
            @click="handownload"
            style="margin-bottom: 0.083rem; float: right"
            >导出</span
          >
          <el-table
            :data="depatlist"
            border
            highlight-current-row
            v-loading="listLoading"
            style="width: 100%"
          >
            <el-table-column prop="deptName" label="部门"></el-table-column>
            <el-table-column
              prop="nickName"
              label="姓名"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column prop="ycqts" label="应出勤天数"></el-table-column>
            <el-table-column
              prop="sjcqts"
              label="实际出勤天使"
            ></el-table-column>
            <el-table-column prop="ztts" label="早退天数"></el-table-column>
            <el-table-column prop="cdts" label="迟到天数"></el-table-column>
            <el-table-column prop="kgts" label="旷工天数"></el-table-column>
            <el-table-column prop="lqts" label="漏签天数"></el-table-column>
          </el-table>
        </div>
      </div>
      <div class="clock-rt">
        <span class="zzjg">组织机构</span>
        <div class="clock-search">
          <el-input v-model="name" class="nameipt"></el-input>
          <span class="czbtn" @click="initcz">重置</span>
          <span class="cxbtn" @click="initqx">查询</span>
        </div>
        <el-tree
          node-key="id"
          ref="usertree"
          highlight-current
          :data="usertree"
          :props="defaultProps"
          @node-click="handleNodeClick"
        >
        </el-tree>
      </div>
    </div>
  </div>
</template>

<script>
import {
  MonthDayList,
  AttendDayStatis,
  AttendMonthStatis,
  userWithDeptTree,
} from "../../api/api.js";
import moment from "moment";

export default {
  data() {
    return {
      current: 1,
      filters: {
        deptId: "",
        userId: "",
        size: 10,
        current: 1,
      },
      time: moment(new Date()).format("yyyy-MM"),
      timelist: [
        { day: "01" },
        { day: "02" },
        { day: "03" },
        { day: "04" },
        { day: "05" },
        { day: "06" },
        { day: "07" },
        { day: "08" },
        { day: "09" },
        { day: "10" },
        { day: "11" },
        { day: "12" },
        { day: "13" },
        { day: "14" },
        { day: "15" },
        { day: "16" },
        { day: "17" },
        { day: "18" },
        { day: "19" },
        { day: "20" },
        { day: "21" },
        { day: "22" },
        { day: "23" },
        { day: "24" },
        { day: "25" },
        { day: "26" },
        { day: "27" },
        { day: "28" },
        { day: "29" },
        { day: "30" },
        { day: "31" },
      ], //日期
      typelist: [], //状态集合
      daylist: [],

      depatlist: [],
      listLoading: false,
      usertree: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      peoplist: [], //勾选人员集合
      colnum: 0, //合并单元格
      name: "",
      styleChangeHeight: "",
    };
  },
  mounted() {
    this.getdate();
    this.initqx();
    this.styleChangeHeight = window.innerHeight + "px";
  },
  methods: {
    // 切换时间类型
    handleday: function (value) {
      this.current = value;
      if (value == "0") {
        this.time = moment(this.time).format("yyyy");
      } else {
        this.time = moment(new Date()).format("yyyy-MM");
      }
      this.getdate();
    },
    // 选择时间
    selecttime: function (value, type) {
      if (type == "1") {
        this.time = moment(value).format("YYYY-MM");
      } else {
        this.time = moment(value).format("YYYY");
      }
      this.getdate();
    },
    // 获取当前时间
    getdate: function () {
      let para = {
        dateSign: this.time,
      };
      MonthDayList(para).then((res) => {
        console.log(res, "01res");
        this.getDaylist();
        this.getmonthlist();
      });
    },
    // 获取 组织结构
    initqx: function () {
      let para = {
        searchVal: this.name,
      };
      userWithDeptTree(para).then((res) => {
        this.usertree = res.data.data;
      });
    },
    // 重置
    initcz: function () {
      this.filters = {
        deptId: "",
        userId: "",
        size: 10,
        current: 1,
      };
      this.getdate();
      this.name = "";
      this.initqx();
    },
    // 勾选 人员
    handleNodeClick: function (node, e) {
      if (node.type == "2") {
        this.filters.deptId = node.id;
        this.filters.userId = 0;
      } else {
        this.filters.deptId = 0;
        this.filters.userId = node.id;
      }
      this.getDaylist();
      this.getmonthlist();
    },

    // 数组去重
    uniquelist: function (arr) {
      for (var i = 0; i < arr.length; i++) {
        for (var j = i + 1; j < arr.length; j++) {
          if (arr[i] == arr[j]) {
            //第一个等同于第二个，splice方法删除第二个
            arr.splice(j, 1);
            j--;
          }
        }
      }
      return arr;
    },

    // 按日列表
    getDaylist: function () {
      let para = {
        dateSign: this.time,
        pageNum: this.filters.current,
        pageSize: this.filters.size,
        deptId: this.filters.deptId,
        userId: this.filters.userId,
      };
      AttendDayStatis(para).then((res) => {
        console.log(res, "00daylisy");
        let daylist = res.rows;
        if (daylist.length > 0) {
          for (var i = 0; i < daylist.length; i++) {
            this.$set(daylist[i], "statlist", daylist[i].dayStatus.split(","));
            this.$set(daylist[i], "dayTypes", daylist[i].dayType.split(","));
            this.$set(daylist[i], "arr", []);
          }

          for (var j = 0; j < daylist.length; j++) {
            for (var m = 0; m < daylist[j].statlist.length; m++) {
              daylist[j].arr.push({
                status: daylist[j].statlist[m],
                type: daylist[j].dayTypes[m],
              });
            }
          }
          console.log(daylist, "arrarrarrarrarr");
          this.daylist = daylist;
          console.log(this.daylist, "daylist");
        } else {
          this.daylist = [];
        }
      });
    },
    // 统计分析
    getmonthlist: function () {
      let para = {
        dateSign: this.time,
        pageNum: this.filters.current,
        pageSize: this.filters.size,
        deptId: this.filters.deptId,
        userId: this.filters.userId,
      };
      AttendMonthStatis(para).then((res) => {
        console.log(res, "yue");
        this.depatlist = res.rows;
      });
    },
    // 重置
    handlereset: function () {
      this.name = "";
    },
    // 下载
    handownload: function () {
      let url = "/work/attendDayStatis/attendMonthStatisExport";
      this.comjs.downfile(url);
    },
    // 下载导入模版
    handledown: function () {
      let url = "/system/integral/download";
      this.comjs.downfile(url);
    },
    // 导入
    handleimport: function () {
      let file = this.$refs.filebox.files[0];
      var random = new Date().getTime().toString();
      let formData = new FormData();
      formData.append("file", file);
      axios
        .post("/system/integral/import?t=" + random, formData, {
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
    },
  },
};
</script>

<style>
</style>
