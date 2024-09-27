<template>
	<div class="g-cont" style="height: auto;">
		<div class="m-contain" style="overflow-y:auto;" :style="{height:styleChangeHeight}">
			<div class="m-search" style="float: left;">
				<el-form :model="filters" :inline="true" ref="filters">
					<el-form-item prop="time" class="">
						<el-date-picker v-model="filters.time" type="daterange" start-placeholder="年/月/日" end-placeholder="年/月/日"></el-date-picker>
					</el-form-item>
					<div class="search-btnbox">
						<span class="btn search-btn" @click="getlist">查询</span>
						<span class="btn reset-btn" @click="resetForm('filters')">重置</span>
					</div>
				</el-form>
			</div>
			<div class="page-box">
				<div class="page-lst"><i class="wz">事件上报趋势图</i></div>
				<div class="linechart" id="eventline"></div>
			</div>
			<div class="page-box" >
				<div class="page-lst"><i class="wz">事件分类统计</i></div>
				<div class="linechart" id="lbbar"></div>
			</div>
			<div class="page-box" style="width: 50%;">
				<div class="page-lst"><i class="wz">事件类型占比图</i></div>
				<div class="pie1" :id="lxzbid"></div>
			</div>
			<div class="page-box" style="width: 50%;">
				<div class="page-lst"><i class="wz">事件办结比例图</i></div>
				<div class="pie1" :id="bjblid"></div>
			</div>
			<div class="page-box">
				<div class="page-lst"><i class="wz1">道路人工巡查主题趋势图</i></div>
				<div class="linechart" id="xcline"></div>
			</div>
			<div class="page-box">
				<div class="page-lst"><i class="wz1">巡查人员巡查次数统计</i></div>
				<div class="tablebox">
					<ul class="hd-tabel hdfirst">
						<li class="hd-lst" v-if="numdata.length>0">
							<span class="name" :style="{'width':wt+'%'}">姓名</span>
							<ul class="cont-ul" :style="{'width':mwt+'%'}">
								<li class="cont-lst" :style="{'width':wt1+'%'}" v-for="(items,index) in  numdata[0].patrolTopicStatic">
									{{items.patrolTopic}}
								</li>
							</ul>
							<span class="totol" :style="{'width':wt+'%'}">人员合计</span>
						</li>
					</ul>
					<ul class="hd-tabel sectabel">
						<li class="hd-lst" v-for="(item,index) in numdata" v-if="numdata.length>0">
							<span class="name" :style="{'width':wt+'%'}">{{item.nickName}}</span>
							<ul class="cont-ul" :style="{'width':mwt+'%'}">
								<li class="cont-lst" :style="{'width':wt1+'%'}" v-for="(items,index) in numdata[index].patrolTopicStatic">{{items.amount}}</li>
							</ul>
							<span class="totol" :style="{'width':wt+'%'}">{{item.totalAmount}}</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { RReportTrend ,REventSortStatistics ,REventTypeScale ,REvtDoneScale ,RPatrolTopic ,RPatrolUserStatis} from '../../api/api.js'
	import qs from 'qs'
	import moment from 'moment'
	import * as echarts from 'echarts'
	import highcharts from 'highcharts'
	import highcharts3d from 'highcharts/highcharts-3d'
	highcharts3d(highcharts)
	
	export default{
		data(){
			return{
				filters:{
					time:[],
					startDate:'',
					endDate:'',
					evtParentType:'roadEvent',
				},
				lxzbid:'lxzbid',
				bjblid:'bjblid',
				numdata:[],
				hddata:[],
				wt:'100px',
				mwt:'100px',
				wt1:'100px',
				styleChangeHeight: '',
			}
		},
		mounted(){
			this.gethdqs()
			this.getfltj();
			this.getrgqs();
			this.getlxzb()
			this.getbjbl()
			this.getxcnum();
			this.styleChangeHeight=window.innerHeight+'px';
		},
		methods:{
			// 获取
			getlist:function(){
				this.gethdqs()
				this.getfltj();
				this.getrgqs();
				this.getlxzb()
				this.getbjbl()
				this.getxcnum();
			},
			// 重置
			resetForm:function(filters){
				this.$refs.filters.resetFields()
				this.filters ={
					time:[],
					startDate:'',
					endDate:'',
					evtParentType:'roadEvent',
				}
				this.gethdqs()
				this.getfltj();
				this.getrgqs();
				this.getlxzb()
				this.getbjbl()
				this.getxcnum();
			},
			// 河道上报趋势
			gethdqs:function(){
				if(this.filters.time && this.filters.time.length>0){
					this.filters.startDate = moment(this.filters.time[0]).format('yyyy-MM-DD')
					this.filters.endDate = moment(this.filters.time[1]).format('yyyy-MM-DD') 
				}else{
					this.filters.startDate = ''
					this.filters.endDate = ''
				}
				let para = {
					startDate:this.filters.startDate,
					endDate:this.filters.endDate,
					evtParentType:this.filters.evtParentType,
				}
				RReportTrend(qs.stringify(para)).then((res)=>{
					console.log(res,'1001')
					let data = res.data
					let aiVo = data.aiVo
					let humanVo = data.humanVo
					let time = []
					let aidata = []
					let humdata = []
					if(aiVo.length>0){
						for(var i=0; i<aiVo.length;i++){
							time.push(aiVo[i].timeSlot)
							aidata.push(aiVo[i].amount)
							humdata.push(humanVo[i].amount)
						}
						let _this =this
						_this.$nextTick(() => {
							_this.sbqsline(time,aidata,humdata)
						})
					}
				})
				
			},
			// 上报趋势图
			sbqsline: function(time,aidata,humdata) {
				var chartDom = document.getElementById('eventline');
				var myChart = echarts.init(chartDom);
				var option = {
					legend: {
						data: ['AI识别', '人工上报'],
						textStyle: {
							color: '#666666'
						},
						icon: "roundRect", 
						y: 'top',
						x:'4%',
						padding: [20, 0, 0, 0]
					},
					grid: {
						top: '20%',
						left:'5%',
						bottom: '10%'
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
							name: 'AI识别',
							data: aidata,
							type: 'line',
							smooth: true,
							symbolSize: 0,
							lineStyle: {
								color: '#01FFFF', //折线的颜色
							},
						},
						{
							name: '人工上报',
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
			getfltj:function(){
				if(this.filters.time && this.filters.time.length>0){
					this.filters.startDate = moment(this.filters.time[0]).format('yyyy-MM-DD')
					this.filters.endDate = moment(this.filters.time[1]).format('yyyy-MM-DD') 
				}else{
					this.filters.startDate = ''
					this.filters.endDate = ''
				}
				let para = {
					startDate:this.filters.startDate,
					endDate:this.filters.endDate,
					evtParentType:this.filters.evtParentType,
				}
				REventSortStatistics(qs.stringify(para)).then((res)=>{
					let eventType = res.data
					let ydata = []
					let aidata1 =[]
					let rgdata1 = []
					if(eventType.length>0){
						for(var i= 0;i<eventType.length;i++){
							ydata.push(eventType[i].evtType)
							aidata1.push(eventType[i].showVo.aiAmount)
							rgdata1.push(eventType[i].showVo.humanAmount)
						}
						
						let _this =this
						_this.$nextTick(() => {
							_this.fltjbar(ydata,aidata1,rgdata1)
						})
						
					}
				})
			},
			// 分类统计 柱状图
			fltjbar: function(ydata,aidata,rgdata) {
				var chartDom = document.getElementById('lbbar');
				var myChart2 = echarts.init(chartDom);
				var option = {
					legend: {
						data: ['AI识别', '人工上报'],
						textStyle: {
							color: '#666666'
						},
						y: 'top',
						x:'4%',
						padding: [20, 0,0, 0]
					},
					grid: {
						left: '8%',
						top: '20%',
						bottom: '10%'
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
							name: 'AI识别',
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
							name: '人工上报',
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
			
			// 事件分类趋势图
			getrgqs:function(){
				if(this.filters.time && this.filters.time.length>0){
					this.filters.startDate = moment(this.filters.time[0]).format('yyyy-MM-DD')
					this.filters.endDate = moment(this.filters.time[1]).format('yyyy-MM-DD') 
				}else{
					this.filters.startDate = ''
					this.filters.endDate = ''
				}
				let para = {
					startDate:this.filters.startDate,
					endDate:this.filters.endDate,
					evtParentType:this.filters.evtParentType,
				}
				RPatrolTopic(qs.stringify(para)).then((res)=>{
					console.log(res,'事件分类趋势图')
					let data = res.data
					let dlPatrolLine = res.data
					let dltime = []
					let dllegend = []
					let dlarr = []
					
					if(dlPatrolLine.length>0){
						let firstdata1 = dlPatrolLine[0].list
						for(var n=0;n<firstdata1.length;n++){
							dltime.push(firstdata1[n].timeSlot)
						}
						for(var i=0; i<dlPatrolLine.length;i++){
							dllegend.push(dlPatrolLine[i].patrolTemplateTopic)
							dlarr.push({
								name:dlPatrolLine[i].patrolTemplateTopic,
								data:[],
							})
							for(var j=0;j<dlPatrolLine[i].list.length;j++){
								dlarr[i].data.push(dlPatrolLine[i].list[j].amount)
							}
						}
						let _this = this
						_this.$nextTick(()=>{
							this.xcqsline(dllegend,dltime,dlarr)
						})
					}
				})
			},
			
			// 事件分类趋势图
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
						let colorArr = ['#4AD882','#48CFF6','#FB9E2B','#FE5858','#FEDB65']
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
			// 类型占比
			getlxzb:function(){
				if(this.filters.time && this.filters.time.length>0){
					this.filters.startDate = moment(this.filters.time[0]).format('yyyy-MM-DD')
					this.filters.endDate = moment(this.filters.time[1]).format('yyyy-MM-DD') 
				}else{
					this.filters.startDate = ''
					this.filters.endDate = ''
				}
				let para = {
					startDate:this.filters.startDate,
					endDate:this.filters.endDate,
					evtParentType:this.filters.evtParentType,
				}
				REventTypeScale(qs.stringify(para)).then((res)=>{
					let data = res.data
					
					let evtTypeList = data.evtTypeList
					let evtProportionList = data.evtProportionList
					let arr = []
					for(var i=0; i<evtTypeList.length;i++){
						arr.push({
							name:evtTypeList[i],
							y:Number(evtProportionList[i]),
							sliced:true,
							selected: true
						})
					}
					let _this = this
					_this.$nextTick(()=>{
						_this.lbzbpie(arr)
					})
				})
				
			},
			// 类型占比3d
			lbzbpie:function(data) {
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
						height: 260 //设置大小是为了饼图能在想要的区域中显示
					},
					title: {
						text: "", //图表的标题文字
					},
					tooltip:{
						enabled:false,
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
								color: '#333333', //全局设置字体颜色
								style: {
									textOutline: 'none', //去掉文字白边 
									fontSize: '12'
								},
								formatter: function() {
									return (
										this.point.name + this.y + '%'
									)
								}
							},
						},
					},
					colors: ["#FB9E2B", "#4AD882", "#FE5858", "#48CFF6"],
					
					credits: {
						enabled: false, // 禁用版权信息
					},
					series: [{
						type: "pie",
						name: "", //统一的前置词,非必须
						data: data
			
					}],
				}
				highcharts.chart(this.lxzbid, option)
			
			},
			// 办结比例
			getbjbl:function(){
				if(this.filters.time && this.filters.time.length>0){
					this.filters.startDate = moment(this.filters.time[0]).format('yyyy-MM-DD')
					this.filters.endDate = moment(this.filters.time[1]).format('yyyy-MM-DD') 
				}else{
					this.filters.startDate = ''
					this.filters.endDate = ''
				}
				let para = {
					startDate:this.filters.startDate,
					endDate:this.filters.endDate,
					evtParentType:this.filters.evtParentType,
				}
				REvtDoneScale(qs.stringify(para)).then((res)=>{
					let data = res.data
					
					let evtTypeList = data.evtStatusList
					let evtProportionList = data.evtProportionList
					let arr = []
					for(var i=0; i<evtTypeList.length;i++){
						arr.push({
							name:evtTypeList[i],
							y:Number(evtProportionList[i]),
							sliced:true,
							selected: true
						})
					}
					let _this = this
					_this.$nextTick(()=>{
						_this.bjblpie(arr)
					})
				})
			},
			// 办结比例3dd
			bjblpie:function(data){
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
						height: 260 //设置大小是为了饼图能在想要的区域中显示
					},
					title: {
						text: "", //图表的标题文字
					},
					tooltip:{
						enabled:false,
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
								color: '#333333', //全局设置字体颜色
								style: {
									textOutline: 'none', //去掉文字白边 
									fontSize: '12'
								},
								formatter: function() {
									return (
										this.point.name + this.y + '%'
									)
								}
							},
						},
					},
					colors: ["#FB9E2B", "#4AD882", "#FE5858", "#48CFF6"],
					
					credits: {
						enabled: false, // 禁用版权信息
					},
					series: [{
						type: "pie",
						name: "", //统一的前置词,非必须
						data: data
							
					}],
				}
				highcharts.chart(this.bjblid, option)
							
			},
			// 巡查次数统计
			getxcnum:function(){
				if(this.filters.time && this.filters.time.length>0){
					this.filters.startDate = moment(this.filters.time[0]).format('yyyy-MM-DD')
					this.filters.endDate = moment(this.filters.time[1]).format('yyyy-MM-DD') 
				}else{
					this.filters.startDate = ''
					this.filters.endDate = ''
				}
				let para = {
					startDate:this.filters.startDate,
					endDate:this.filters.endDate,
					type:'2',
				}
				RPatrolUserStatis(para).then((res)=>{
					this.numdata = res.data.data
					if(this.numdata.length>0){
						let contnum = res.data.data[0].patrolTopicStatic.length
						let num  = 2+contnum
						this.wt = 100 / num 
						this.mwt = 100 - this.wt*2
						this.wt1 = 100 / contnum
					}
					
					
				})
			}
			
		}
	}
</script>

<style>
</style>