<template>
  <div class="g-cont">
    <div class="m-contain">
      <span class="btn add-btn" @click="handleAdd">生成报表</span>
      <div class="m-search" style="float: left">
        <el-form :model="filters" :inline="true" ref="filters">
          <el-form-item label="报表类型" prop="reportType">
            <el-select v-model="filters.reportType">
              <el-option value="week" label="周报"></el-option>
              <el-option value="month" label="月报"></el-option>
              <el-option value="other" label="其他"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="报表名称" prop="reportName" class="ipt150">
            <el-input
              v-model="filters.reportName"
              placeholder="报表名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="日期" prop="">
            <el-date-picker
              v-model="filters.reportStartDate"
              type="date"
              placeholder="选择日期"
			  value-format="yyyy-MM-dd"
            >
            </el-date-picker
            >至
            <el-date-picker
              v-model="filters.reportEndDate"
              type="date"
              placeholder="选择日期"
			  value-format="yyyy-MM-dd"
            >
            </el-date-picker>
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
        >
          <el-table-column label="ID" prop="reportId"> </el-table-column>
          <el-table-column label="报表名称" prop="reportName">
          </el-table-column>
          <el-table-column label="报表类型" prop="">
            <template slot-scope="scope">
              <span v-if="scope.row.reportType == 'week'">周报</span>
              <span v-else-if="scope.row.reportType == 'month'">月报</span>
              <span v-else>其他</span>
            </template>
          </el-table-column>
          <el-table-column label="报表统计时间范围" prop="">
            <template slot-scope="scope">
              <span
                >{{ scope.row.reportStartDate }}~{{
                  scope.row.reportEndDate
                }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="报表生成时间" prop="crtTime">
          </el-table-column>
          <el-table-column label="操作" prop="" width="400">
            <template slot-scope="scope">
              <span class="edit-title" @click="handledown(scope.row, '1')"
                >事件下载</span
              >&nbsp;&nbsp;
              <span class="edit-title" @click="handledown(scope.row, '2')"
                >道路下载</span
              >&nbsp;&nbsp;
              <span class="edit-title" @click="handledown(scope.row, '3')"
                >河道下载</span
              >&nbsp;&nbsp;
              <span class="detail-title" @click="handledetail(scope.row)"
                >详情</span
              >
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
    <el-dialog
      :visible.sync="xqdialog"
      v-if="xqdialog"
      class="g-dialog"
      :title="dialogtitle"
    >
      <div class="report-content" id="demo">
        <span class="time"
          >报表统计时间范围：{{ startDate }}~{{ endDate }}</span
        >
        <div class="page-box">
          <div class="page-lst"><i class="wz">村人口变化</i></div>
          <div class="tj-box">
            <div class="tj-lst">
              <span class="title">本村人口变化统计</span>
              <div class="box">
                <div class="peo-lst">
                  <img src="../../assets/img/man.png" class="img" />
                  <span class="num">{{ rkLocalAdd }}</span>
                  <span class="name">新增人数</span>
                </div>
                <div class="peo-lst">
                  <img src="../../assets/img/women.png" class="img" />
                  <span class="num">{{ rkLocalDel }}</span>
                  <span class="name">新增人数</span>
                </div>
              </div>
            </div>
            <div class="tj-lst">
              <span class="title">外来人口变化统计</span>
              <div class="box">
                <div class="peo-lst">
                  <img src="../../assets/img/man.png" class="img" />
                  <span class="num">{{ rkForeignAdd }}</span>
                  <span class="name">新增人数</span>
                </div>
                <div class="peo-lst">
                  <img src="../../assets/img/women.png" class="img" />
                  <span class="num">{{ rkForeignDel }}</span>
                  <span class="name">新增人数</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="page-box">
          <div class="page-lst"><i class="wz">事件分类统计</i></div>
          <div class="page-half">
            <div class="linbox"><i class="greenline"></i>事件上报趋势图</div>
            <div class="linechart" id="eventline"></div>
          </div>
          <div class="page-half">
            <div class="linbox"><i class="greenline"></i>事件分类统计</div>
            <div class="linechart" id="lbbar"></div>
          </div>
        </div>
        <div class="page-box">
          <div class="page-lst"><i class="wz">住房租赁统计</i></div>
          <div class="page-lt1">
            <div class="pie" :id="zlid"></div>
          </div>
          <div class="page-rt1">
            <div class="page-table">
              <div class="table-lst">
                <div class="table-name" style="border-left: none">
                  租房提交租赁
                </div>
                <div class="num">{{ rentform.tenantRent }}</div>
                <div class="table-name" style="color: #4ad882">审核通过</div>
                <div class="num">{{ rentform.tenantPassTheAudit }}</div>
                <div class="table-name" style="color: #fe5858">审核不通过</div>
                <div class="num">{{ rentform.tenantFailTheAudit }}</div>
                <div class="table-name" style="color: #fb9e2b">审核中</div>
                <div class="num">{{ rentform.tenantUnderReview }}</div>
              </div>
              <div class="table-lst">
                <div class="table-name" style="border-left: none">
                  房主上报租赁
                </div>
                <div class="num">{{ rentform.hostRent }}</div>
                <div class="table-name" style="color: #4ad882">审核通过</div>
                <div class="num">{{ rentform.hostPassTheAudit }}</div>
                <div class="table-name" style="color: #fe5858">审核不通过</div>
                <div class="num">{{ rentform.hostFailTheAudit }}</div>
                <div class="table-name" style="color: #fb9e2b">审核中</div>
                <div class="num">{{ rentform.hostUnderReview }}</div>
              </div>
              <div class="table-lst">
                <div class="table-name" style="border-left: none">
                  新增租赁人数
                </div>
                <div class="num1">{{ rentform.addLease }}</div>
                <div class="table-name">退租人数</div>
                <div class="num1">{{ rentform.leaseOut }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="dialog-foot">
        <span class="btn down-btn" @click="loadPdf">导出pdf</span>
      </div>
      <div class="report-content" id="demo1">
        <div class="page-box">
          <div class="page-lst"><i class="wz">道路人工巡查统计</i></div>
          <div class="linbox"><i class="greenline"></i>巡查类型趋势图</div>
          <div class="linechart" id="xcline"></div>
        </div>
        <div class="page-box">
          <div class="page-lst"><i class="wz">河道巡查人员统计</i></div>
          <div class="linbox"><i class="greenline"></i>巡查类型趋势图</div>
          <div class="linechart" id="hdxcline"></div>
        </div>
      </div>
      <div class="dialog-foot">
        <span class="btn down-btn" @click="loadPdf1">导出pdf</span>
      </div>
    </el-dialog>
    <!-- 生成报表 -->
    <el-dialog
      :visible.sync="adddialog"
      v-if="adddialog"
      class="g-dialog min-dia642"
      title="生成报表"
    >
      <el-form
        :model="addForm"
        :inline="true"
        ref="addForm"
        :rules="addFormRules"
        class="addform add-signcent"
      >
        <el-form-item label="报表类型" prop="reportType">
          <el-select v-model="addForm.reportType">
            <el-option value="other" label="其他"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间段选择" prop="reportStartDate">
          <el-date-picker
            v-model="addForm.reportStartDate"
            type="date"
            placeholder="选择日期"
			value-format="yyyy-MM-dd"
          >
          </el-date-picker
          >至
          <el-date-picker
            v-model="addForm.reportEndDate"
            type="date"
            placeholder="选择日期"
			value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div class="dialog-foot">
        <span class="btn-cancel" @click="handlecancel('0')">取消</span>
        <span class="btn-save" @click="handleSubmit">保存</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { TownReport, TownReportDt, TownReportAdd } from "../../api/api.js";
import moment from "moment";
import highcharts from "highcharts";
import highcharts3d from "highcharts/highcharts-3d";
highcharts3d(highcharts);
import * as echarts from "echarts";
import { downloadPDF } from "../../assets/js/pdf.js";

export default {
  data() {
    return {
      filters: {
        reportType: "",
        reportName: "",
        reportStartDate: "",
        reportEndDate: "",
        size: 10,
        current: 1,
      },
      datalist: [],
      listLoading: false,
      total: 0,
      currentPage: 1,
      currentPage1: 1,
      pagesize: 10,
      xqdialog: false,
      dialogtitle: "",
      startDate: "",
      endDate: "",
      rkForeignAdd: "0",
      rkForeignDel: "0",
      rkLocalAdd: "0",
      rkLocalDel: "0",
      eventStatistics: [],
      headdata: [],

      zlid: "zlid",
      num: "",
      rentform: {},
      addForm: {
        reportStartDate: "",
        reportEndDate: "",
        reportType: "",
      },
      addFormRules: {
		reportType:[{required:true,message:'请选择报表类型',trigger:'change'}],
		reportStartDate:[{required:true,message:'请选择时间段',trigger:'blur'}]
	  },
      adddialog: false,
    };
  },
  mounted() {
    this.getlist("");
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
        reportType: this.filters.reportType,
        reportName: this.filters.reportName,
        reportStartDate: this.filters.reportStartDate,
        reportEndDate: this.filters.reportEndDate,
        pageSize: this.filters.size,
        pageNum: this.filters.current,
      };
      if (val) {
        para.pageNum = val;
        this.currentPage1 = val;
      }
      TownReport(para).then((res) => {
        this.datalist = res.data.rows;
        this.total = res.data.total;
      });
    },
    // 点击添加
    handleAdd() {
      this.adddialog = true;
      this.addForm = {
        reportStartDate: "",
        reportEndDate: "",
        reportType: "",
      };
    },
	// 取消
	handlecancel(type){
		if (type == "0") {
        this.adddialog = false;
        this.addForm = {
          reportStartDate: "",
        reportEndDate: "",
        reportType: "",
        };
      }
	},
    // 保存
    handleSubmit() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          let para = {
            reportType: this.addForm.reportType,
            businessType: "town",
            reportStartDate: this.addForm.reportStartDate,
            reportEndDate: this.addForm.reportEndDate,
          };
          TownReportAdd(para).then((res) => {
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
      });
    },
    // 重置
    resetForm: function (filters) {
      this.$refs.filters.resetFields();
      this.filters = {
        reportType: "",
        reportName: "",
        reportStartDate: "",
        reportEndDate: "",
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
    // 查看详情
    handledetail: function (row) {
      this.xqdialog = true;
      let data = JSON.parse(row.businessData);
      this.dialogtitle = data.title;
      this.startDate = data.startDate;
      this.endDate = data.endDate;
      this.rkForeignAdd = data.rkForeignAdd;
      this.rkForeignDel = data.rkForeignDel;
      this.rkLocalAdd = data.rkLocalAdd;
      this.rkLocalDel = data.rkLocalDel;
      this.rentform = data.RentVo;

      // 上报趋势图
      let aiVo = data.eventTrend.aiVo;
      let humanVo = data.eventTrend.humanVo;
      let time = [];
      let aidata = [];
      let humdata = [];
      if (aiVo.length > 0) {
        for (var i = 0; i < aiVo.length; i++) {
          time.push(aiVo[i].timeSlot);
          aidata.push(aiVo[i].amount);
          humdata.push(humanVo[i].amount);
        }
        let _this = this;
        _this.$nextTick(() => {
          _this.sbqsline(time, aidata, humdata);
        });
      }

      // 事件分类统计
      let eventType = data.eventType;
      let ydata = [];
      let aidata1 = [];
      let rgdata1 = [];
      if (eventType.length > 0) {
        for (var j = 0; j < eventType.length; j++) {
          ydata.push(eventType[j].evtType);
          aidata1.push(eventType[j].showVo.aiAmount);
          rgdata1.push(eventType[j].showVo.humanAmount);
        }

        let _this = this;
        _this.$nextTick(() => {
          _this.fltjbar(ydata, aidata1, rgdata1);
        });
      }

      // 住房租赁占比
      let rentAudit = data.rentAudit;

      let _this = this;
      _this.$nextTick(() => {
        _this.zlpie(rentAudit);
      });

      // 河道巡查折线
      let hdPatrolLine = data.hdPatrolLine;
      let hdtime = [];
      let legend = [];
      let arr = [];
      if (hdPatrolLine.length > 0) {
        let firstdata = hdPatrolLine[0].list;
        for (var m = 0; m < firstdata.length; m++) {
          hdtime.push(firstdata[m].dtime);
        }
        for (var i = 0; i < hdPatrolLine.length; i++) {
          legend.push(hdPatrolLine[i].patrolTopic);
          arr.push({
            name: hdPatrolLine[i].patrolTopic,
            data: [],
          });
          for (var j = 0; j < hdPatrolLine[i].list.length; j++) {
            arr[i].data.push(hdPatrolLine[i].list[j].amount);
          }
        }
        let _this = this;
        _this.$nextTick(() => {
          this.riveqsline(legend, hdtime, arr);
        });
      }

      // 道路巡查折现
      let dlPatrolLine = data.dlPatrolLine;
      let dltime = [];
      let dllegend = [];
      let dlarr = [];

      if (dlPatrolLine.length > 0) {
        let firstdata1 = dlPatrolLine[0].list;
        for (var n = 0; n < firstdata1.length; n++) {
          dltime.push(firstdata1[n].dtime);
        }
        for (var i = 0; i < dlPatrolLine.length; i++) {
          dllegend.push(dlPatrolLine[i].patrolTopic);
          dlarr.push({
            name: dlPatrolLine[i].patrolTopic,
            data: [],
          });
          for (var j = 0; j < dlPatrolLine[i].list.length; j++) {
            dlarr[i].data.push(dlPatrolLine[i].list[j].amount);
          }
        }
        let _this = this;
        _this.$nextTick(() => {
          this.xcqsline(dllegend, dltime, dlarr);
        });
      }
    },
    // 下载
    handledown: function (row, type) {
      let url =
        "/system/reportData/downloadAsExcel/" + row.reportId + "/" + type;
      this.comjs.downfile(url);
    },
    // 上报趋势图
    sbqsline: function (time, aidata, humdata) {
      var chartDom = document.getElementById("eventline");
      var myChart = echarts.init(chartDom);
      var option = {
        legend: {
          data: ["AI识别", "人工上报"],
          textStyle: {
            color: "#666666",
          },
          icon: "roundRect",
          y: "top",
          padding: [0, 0, 10, 0],
        },
        grid: {
          top: "10%",
          bottom: "20%",
        },
        xAxis: {
          data: time,
          axisLine: {
            show: true,
            lineStyle: {
              color: "#dddddd", // 设置y轴的颜色为蓝色
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "#666666",
            },
          },
        },
        yAxis: {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: true,
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "#666666",
            },
          },
        },
        series: [
          {
            name: "AI识别",
            data: aidata,
            type: "line",
            smooth: true,
            symbolSize: 0,
            lineStyle: {
              color: "#01FFFF", //折线的颜色
            },
          },
          {
            name: "人工上报",
            data: humdata,
            type: "line",
            smooth: true,
            symbolSize: 0,
            lineStyle: {
              color: "#0082F8", //折线的颜色
            },
          },
        ],
      };
      myChart.setOption(option);
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    // 分类统计
    fltjbar: function (ydata, aidata, rgdata) {
      var chartDom = document.getElementById("lbbar");
      var myChart2 = echarts.init(chartDom);
      var option = {
        legend: {
          data: ["AI识别", "人工上报"],
          textStyle: {
            color: "#666666",
          },
          y: "bottom",
          padding: [0, 0, 10, 0],
        },
        grid: {
          left: "15%",
          top: "10%",
          bottom: "18%",
        },
        xAxis: {
          type: "value",
          axisLine: {
            show: true,
            lineStyle: {
              color: "#dddddd", // 设置y轴的颜色为蓝色
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "#666666",
            },
          },
        },
        yAxis: {
          type: "category",
          axisLine: {
            show: true,
            lineStyle: {
              color: "#dddddd", // 设置y轴的颜色为蓝色
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "#666666",
            },
          },
          data: ydata,
        },
        series: [
          {
            name: "AI识别",
            data: aidata,
            type: "bar",
            stack: "Search Engine",
            barMaxWidth: 16, // 每一个都要设置
            showBackground: false,
            itemStyle: {
              normal: {
                borderWidth: 1,
                color: "#48CFF6",
              },
            },
            label: {
              //柱体上显示数值
              show: true, //开启显示
              position: "inside", //在上方显示
              textStyle: {
                //数值样式
                fontSize: "12px",
                color: "#ffffff",
              },
              formatter: "{c}",
            },
          },
          {
            name: "人工上报",
            data: rgdata,
            type: "bar",
            stack: "Search Engine",
            showBackground: false,
            barMaxWidth: 16, // 每一个都要设置
            itemStyle: {
              normal: {
                borderWidth: 1,
                color: "#0082F8",
              },
            },
            label: {
              //柱体上显示数值
              show: true, //开启显示
              position: "inside", //在上方显示
              textStyle: {
                //数值样式
                fontSize: "12px",
                color: "#ffffff",
              },
              formatter: "{c}",
            },
          },
        ],
      };
      myChart2.setOption(option);
      window.addEventListener("resize", function () {
        myChart2.resize();
      });
    },
    // 住房租赁统计
    zlpie: function (data) {
      let option = {
        chart: {
          backgroundColor: "none",
          type: "pie", //饼图
          // margin: [0, 0, 0, 100],
          options3d: {
            enabled: true, //使用3d功能
            alpha: 50, //延y轴向内的倾斜角度
            beta: 0,
          },
          height: 260, //设置大小是为了饼图能在想要的区域中显示
        },
        title: {
          text: "", //图表的标题文字
        },
        tooltip: {
          enabled: false,
        },
        plotOptions: {
          pie: {
            allowPointSelect: true, //每个扇块能否选中
            cursor: "pointer", //鼠标指针
            innerSize: 0,
            depth: 40, //饼图的厚度
            dataLabels: {
              enabled: true, //是否显示饼图的线形tip
              distance: 20, //设置引导线的长度
              color: "#333333", //全局设置字体颜色
              style: {
                textOutline: "none", //去掉文字白边
                fontSize: "12",
              },
              formatter: function () {
                return this.point.name + this.y + "%";
              },
            },
          },
        },
        colors: ["#FB9E2B", "#4AD882", "#FE5858", "#48CFF6"],

        credits: {
          enabled: false, // 禁用版权信息
        },
        series: [
          {
            type: "pie",
            name: "", //统一的前置词,非必须
            data: [
              {
                name: "村部审核中",
                y: data.villageAudit,
                sliced: true,
                selected: true,
              },
              {
                name: "审核不通过",
                y: data.villageAuditFail,
                sliced: true,
                selected: true,
              },
              {
                name: "屋主审核中",
                y: data.homeownerAudit,
                sliced: true,
                selected: true,
              },
              {
                name: "审核通过",
                y: data.homeownerAuditFail,
                sliced: true,
                selected: true,
              },
            ],
          },
        ],
      };
      highcharts.chart(this.zlid, option);
    },
    // 道路巡查类型趋势图
    xcqsline: function (legend, xdata, ydata) {
      var chartDom = document.getElementById("xcline");
      var myChart = echarts.init(chartDom);
      var option = {
        legend: {
          data: legend,
          textStyle: {
            color: "#666666",
          },
          icon: "roundRect",
          y: "top",
          padding: [0, 0, 10, 0],
        },
        grid: {
          top: "10%",
          bottom: "20%",
        },
        xAxis: {
          data: xdata,
          axisLine: {
            show: true,
            lineStyle: {
              color: "#dddddd", // 设置y轴的颜色为蓝色
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "#666666",
            },
          },
        },
        yAxis: {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: true,
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "#666666",
            },
          },
        },
        series: (function () {
          let colorArr = [
            "#03D8BC",
            "#00BCFF",
            "#18EA5E",
            "#F87C18",
            "#FEDB65",
          ];
          var series = [];
          for (var i = 0; i < ydata.length; i++) {
            var item = {
              name: ydata[i].name,
              type: "line",
              symbolSize: 0,
              itemStyle: {
                color: colorArr[i],
              },
              data: ydata[i].data,
            };
            series.push(item);
          }
          return series;
        })(),
      };
      myChart.setOption(option);
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    // 河道巡查趋势图
    riveqsline: function (legend, xdata, ydata) {
      var chartDom = document.getElementById("hdxcline");
      var myChart = echarts.init(chartDom);
      var option = {
        legend: {
          data: legend,
          textStyle: {
            color: "#666666",
          },
          icon: "roundRect",
          y: "top",
          padding: [0, 0, 10, 0],
        },
        grid: {
          top: "10%",
          bottom: "20%",
        },
        xAxis: {
          data: xdata,
          axisLine: {
            show: true,
            lineStyle: {
              color: "#dddddd", // 设置y轴的颜色为蓝色
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "#666666",
            },
          },
        },
        yAxis: {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: true,
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "#666666",
            },
          },
        },
        series: (function () {
          let colorArr = [
            "#03D8BC",
            "#00BCFF",
            "#18EA5E",
            "#F87C18",
            "#FEDB65",
          ];
          var series = [];
          for (var i = 0; i < ydata.length; i++) {
            var item = {
              name: ydata[i].name,
              type: "line",
              symbolSize: 0,
              itemStyle: {
                color: colorArr[i],
              },
              data: ydata[i].data,
            };
            series.push(item);
          }
          return series;
        })(),
      };
      myChart.setOption(option);
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    // 导出pdf
    loadPdf: function () {
      downloadPDF(document.getElementById("demo"));
    },
    // 导出pdf
    loadPdf1: function () {
      downloadPDF(document.getElementById("demo1"));
    },
  },
};
</script>

<style>
</style>