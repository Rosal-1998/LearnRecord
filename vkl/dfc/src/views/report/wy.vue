<template>
	<div class="g-cont">
		<div class="m-contain">
			 <span class="btn add-btn" @click="handleAdd">生成报表</span>
			<div class="m-search" style="float: left;">
				<el-form :model="filters" :inline="true" ref="filters">
					<el-form-item label="报表类型" prop="reportType">
						<el-select v-model="filters.reportType">
							<el-option value="week" label="周报"></el-option>
							<el-option value="month" label="月报"></el-option>
							<el-option value="other" label="其他"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="报表名称" prop="reportName" class="ipt150">
						<el-input v-model="filters.reportName" placeholder="报表名称"></el-input>
					</el-form-item>
					<el-form-item label="日期">
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
						<span class="btn reset-btn" @click="resetForm('filters')">重置</span>
					</div>
				</el-form>
			</div>
			<div class="m-table">
				<el-table :data="datalist" highlight-current-row v-loading="listLoading" style="width: 100%;"
					border :row-class-name="tableRowClassName" :header-cell-style="{'text-align':'center'}"
				:cell-style="{'text-align':'center'}">
					<el-table-column label="ID" prop="reportId">
					</el-table-column>
					<el-table-column label="报表名称" prop="reportName">
					</el-table-column>
					<el-table-column label="报表类型" prop="">
						<template slot-scope="scope">
							<span v-if="scope.row.reportType =='week'">周报</span>
							<span v-else-if="scope.row.reportType =='month'">月报</span>
							<span v-else="">/</span>
						</template>
					</el-table-column>
					<el-table-column label="报表统计时间范围" prop="">
						<template slot-scope="scope">
							<span>{{scope.row.reportStartDate}}~{{scope.row.reportEndDate}}</span>
						</template>
					</el-table-column>
					<el-table-column label="报表生成时间" prop="crtTime">
					</el-table-column>
					<el-table-column label="操作" prop="" width="400">
						<template slot-scope="scope">
							<span class="edit-title" @click="handledown(scope.row,'4')">物业服务下载</span>&nbsp;&nbsp;
							<span class="edit-title" @click="handledown(scope.row,'5')">安全巡查下载</span>&nbsp;&nbsp;
							<span class="edit-title" @click="handledown(scope.row,'6')">人工打卡下载</span>&nbsp;&nbsp;
							<span class="detail-title" @click="handledetail(scope.row)">详情</span>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="m-pagination">
				<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
				        :current-page="currentPage"
				        :page-size="pagesize"
				        layout="prev, pager, next"
						:current-page.sync="currentPage1"
						prev-text="上一页"
					    next-text="下一页"
				        :total="total">
				</el-pagination>
				<i class="total">共有{{total}}条数据</i>
			</div>
		</div>
		<el-dialog :visible.sync="xqdialog" v-if="xqdialog" class="g-dialog" :title="dialogtitle">
			<div class="report-content" id="demo">
				<span class="time">报表统计时间范围：{{startDate}}~{{endDate}}</span>
				<div class="page-box">
					<div class="page-lst"><i class="wz">物业上门服务统计</i></div>
					<div class="page-half">
						<div class="linbox">
							<i class="greenline"></i>物业服务趋势图
						</div>
						<div class="linechart" id="eventline"></div>
					</div>
					<div class="page-half">
						<div class="linbox">
							<i class="greenline"></i>物业服务分类统计
						</div>
						<div class="linechart" id="lbbar"></div>
					</div>
				</div>
				<div class="page-box">
					<div class="page-lst"><i class="wz">物业村庄安全巡查统计</i></div>
					<div class="linbox">
						<i class="greenline"></i>巡查类型趋势图
					</div>
					<div class="linechart" id="xcline"></div>
				</div>
			</div>
			<div class="dialog-foot">
				<span class="btn down-btn" @click="loadPdf">导出pdf</span>
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
	import { PropertyReport, PropertyReportAdd} from '../../api/api.js'
	import moment from 'moment'
	import * as echarts from 'echarts'
	import { downloadPDF } from '../../assets/js/pdf.js'
	export default {
		data(){
			return{
				filters:{
					reportType:'',
					reportName:'',
					reportStartDate: "",
        reportEndDate: "",
					size:10,
					current:1
				},
				datalist:[],
				listLoading:false,
				total:0,
				currentPage:1,
				currentPage1:1,
				pagesize:10,
				xqdialog:false,
				dialogtitle:'',
				startDate:'',
				endDate:'',
				
				headdata:[],
				
				xcrydata:[],
				num:'',
				addForm: {
        reportStartDate: "",
        reportEndDate: "",
        reportType: "",
      },
      addFormRules: {
		reportType:[{required:true,message:'请选择报表类型',trigger:'chang'}],
		reportStartDate:[{required:true,message:'请选择时间段',trigger:'chang'}]
	  },
      adddialog: false,
			}
		},
		mounted(){
			this.getlist('')
		},
		methods:{
			// 单行变色
			tableRowClassName:function(rowIndex){
				if (rowIndex.rowIndex % 2 != 0) {
					return 'evenRow';
				}
				return 'oddRow';
			},
			// 列表
			getlist:function(val){
				let para ={
					reportType:this.filters.reportType,
					reportName:this.filters.reportName,
					pageSize:this.filters.size,
					pageNum:this.filters.current,
					reportStartDate:this.filters.reportStartDate,
					reportEndDate:this.filters.reportEndDate
				}
				if(val){
					para.pageNum = val
					this.currentPage1 = val
				}
				PropertyReport(para).then((res)=>{
					this.datalist = res.data.rows
					this.total = res.data.total
				})
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
            businessType: "property",
            reportStartDate: this.addForm.reportStartDate,
            reportEndDate: this.addForm.reportEndDate,
          };
          PropertyReportAdd(para).then((res) => {
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
			resetForm:function(filters){
				this.$refs.filters.resetFields()
				this.filters ={
					reportType:'',
					reportName:'',
					size:10,
					current:1
				}
				this.getlist(1)
			},
			// 分页
			handleSizeChange:function(size){
			    this.pagesize = size;
			    this.filters.size = size
			    this.getlist('')
			},
			// 分页
			handleCurrentChange:function(val){
			   this.filters.current = val;
			   this.getlist(val);
			},
			// 查看详情
			handledetail:function(row){
				this.xqdialog = true
				let data = JSON.parse(row.businessData)
				this.dialogtitle = data.title
				this.startDate = data.startDate
				this.endDate = data.endDate
				
				// 物业服务趋势图
				let aiVo = data.prtServiceTrend.propertyList
				let humanVo = data.prtServiceTrend.residentList
				let time = []
				let aidata = []
				let humdata = []
				if(aiVo.length>0){
					for(var i=0; i<aiVo.length;i++){
						time.push(aiVo[i].time)
						aidata.push(aiVo[i].number)
						humdata.push(humanVo[i].number)
					}
					let _this =this
					_this.$nextTick(() => {
						_this.sbqsline(time,aidata,humdata)
					})
				}
				
				// 物业服务分类统计
				let eventType = data.propertyServiceSort
				let ydata = []
				let aidata1 =[]
				let rgdata1 = []
				if(eventType.length>0){
					for(var j= 0;j<eventType.length;j++){
						ydata.push(eventType[j].type)
						aidata1.push(eventType[j].propertyNumber)
						rgdata1.push(eventType[j].residentNumber)
					}
					
					let _this =this
					_this.$nextTick(() => {
						_this.fltjbar(ydata,aidata1,rgdata1)
					})
					
				}
				
				
				// 巡查类型趋势
				let hdPatrolLine = data.wyPatrolLine
				let hdtime = []
				let legend =[]
				let arr = []
				if(hdPatrolLine.length>0){
					let firstdata = hdPatrolLine[0].list
					for(var m=0;m<firstdata.length;m++){
						hdtime.push(firstdata[m].dtime)
					}
					for(var i=0; i<hdPatrolLine.length;i++){
						legend.push(hdPatrolLine[i].patrolTopic)
						arr.push({
							name:hdPatrolLine[i].patrolTopic,
							data:[],
						})
						for(var j=0;j<hdPatrolLine[i].list.length;j++){
							arr[i].data.push(hdPatrolLine[i].list[j].amount)
						}
					}
					let _this = this
					_this.$nextTick(()=>{
						this.xcqsline(legend,hdtime,arr)
					})
				}
			},
			// 下载
			handledown:function(row,type){
				let url = '/system/reportData/downloadAsExcel/'+row.reportId+'/'+type
				this.comjs.downfile(url)
			},
			// 上报趋势图
			sbqsline: function(time,aidata,humdata) {
				var chartDom = document.getElementById('eventline');
				var myChart = echarts.init(chartDom);
				var option = {
					legend: {
						data: ['物业登记', '居民登记'],
						textStyle: {
							color: '#666666'
						},
						icon: "roundRect", 
						y: 'top',
						padding: [0, 0, 10, 0]
					},
					grid: {
						top: '10%',
						bottom: '20%'
					},
					xAxis: {
						data: time,
						axisLine: {
							show: true,
							lineStyle: {
								color: '#dddddd' // 设置y轴的颜色为蓝色
							}
						},
						axisTick: {
							show: false
						},
						splitLine: {
							show: false
						},
						axisLabel: {
							show: true,
							textStyle: {
								color: '#666666'
							}
						},
					},
					yAxis: {
						axisLine: {
							show: false
						},
						axisTick: {
							show: false
						},
						splitLine: {
							show: true
						},
						axisLabel: {
							show: true,
							textStyle: {
								color: '#666666'
							}
						},
					},
					series: [{
							name: '物业登记',
							data: aidata,
							type: 'line',
							smooth: true,
							symbolSize: 0,
							lineStyle: {
								color: '#01FFFF', //折线的颜色
							},
						},
						{
							name: '居民登记',
							data: humdata,
							type: 'line',
							smooth: true,
							symbolSize: 0,
							lineStyle: {
								color: '#0082F8', //折线的颜色
							},
						},
					]
				};
				myChart.setOption(option);
				window.addEventListener("resize", function() {
					myChart.resize();
				})
			},
			// 分类统计
			fltjbar: function(ydata,aidata,rgdata) {
				var chartDom = document.getElementById('lbbar');
				var myChart2 = echarts.init(chartDom);
				var option = {
					legend: {
						data: ['物业登记', '居民登记'],
						textStyle: {
							color: '#666666'
						},
						y: 'bottom',
						padding: [0, 0, 10, 0]
					},
					grid: {
						left: '15%',
						top: '10%',
						bottom: '18%'
					},
					xAxis: {
						type: 'value',
						axisLine: {
							show: true,
							lineStyle: {
								color: '#dddddd' // 设置y轴的颜色为蓝色
							}
						},
						axisTick: {
							show: false
						},
						splitLine: {
							show: false
						},
						axisLabel: {
							show: true,
							textStyle: {
								color: '#666666'
							}
						},
					},
					yAxis: {
						type: 'category',
						axisLine: {
							show: true,
							lineStyle: {
								color: '#dddddd' // 设置y轴的颜色为蓝色
							}
						},
						axisTick: {
							show: false
						},
						splitLine: {
							show: false
						},
						axisLabel: {
							show: true,
							textStyle: {
								color: '#666666'
							}
						},
						data:ydata,
					},
					series: [{
							name: '物业登记',
							data: aidata,
							type: 'bar',
							stack: "Search Engine",
							barMaxWidth: 16, // 每一个都要设置
							showBackground: false,
							itemStyle: {
								normal: {
									borderWidth: 1,
									color: '#48CFF6',
								}
							},
							label: { //柱体上显示数值
								show: true, //开启显示
								position: 'inside', //在上方显示
								textStyle: { //数值样式
									fontSize: '12px',
									color: '#ffffff'
								},
								formatter: '{c}',
							}
						},
						{
							name: '居民登记',
							data: rgdata,
							type: 'bar',
							stack: "Search Engine",
							showBackground: false,
							barMaxWidth: 16, // 每一个都要设置
							itemStyle: {
								normal: {
									borderWidth: 1,
									color: '#0082F8',
								}
							},
							label: { //柱体上显示数值
								show: true, //开启显示
								position: 'inside', //在上方显示
								textStyle: { //数值样式
									fontSize: '12px',
									color: '#ffffff'
								},
								formatter: '{c}',
							}
						}
					]
				};
				myChart2.setOption(option);
				window.addEventListener("resize", function() {
					myChart2.resize();
				})
			},
			
			// 巡查类型趋势图
			xcqsline:function(legend,xdata,ydata){
				var chartDom = document.getElementById('xcline');
				var myChart = echarts.init(chartDom);
				var option = {
					legend: {
						data: legend,
						textStyle: {
							color: '#666666'
						},
						icon: "roundRect", 
						y: 'top',
						padding: [0, 0, 10, 0]
					},
					grid: {
						top: '10%',
						bottom: '20%'
					},
					xAxis: {
						data: xdata,
						axisLine: {
							show: true,
							lineStyle: {
								color: '#dddddd' // 设置y轴的颜色为蓝色
							}
						},
						axisTick: {
							show: false
						},
						splitLine: {
							show: false
						},
						axisLabel: {
							show: true,
							textStyle: {
								color: '#666666'
							}
						},
					},
					yAxis: {
						axisLine: {
							show: false
						},
						axisTick: {
							show: false
						},
						splitLine: {
							show: true
						},
						axisLabel: {
							show: true,
							textStyle: {
								color: '#666666'
							}
						},
					},
					series: (function() {
						let colorArr = ['#03D8BC','#00BCFF','#18EA5E','#F87C18','#FEDB65']
						var series = [];
						for (var i = 0; i<ydata.length; i++){
							var item = {
								name: ydata[i].name,
								type: "line",
								symbolSize: 0,
								itemStyle: {
									color:colorArr[i]
								},
								data: ydata[i].data
							};
							series.push(item);
						}
						return series;
					})(),
					
				};
				myChart.setOption(option);
				window.addEventListener("resize", function() {
					myChart.resize();
				})
			},
			// 导出pdf
			loadPdf:function(){
				 downloadPDF(document.getElementById('demo'))
			}
			
		}
	}
</script>

<style>
</style>