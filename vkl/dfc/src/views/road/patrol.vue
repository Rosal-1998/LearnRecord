<template>
	<div class="g-cont">
		<div class="m-contain">
			<span class="btn export-btn" @click="handleexport">导出检查文件</span>
			<div class="m-search">
				<el-form :model="filters" :inline="true" ref="filters">
					<el-form-item label="巡查类型" prop="patrolTemplateType">
						<el-select v-model="filters.patrolTemplateType" placeholder="巡查类型">
							<el-option v-for="(item,index) in patrtypelist" :value="item.dictValue" :label="item.dictLabel" :key="index"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="巡查主题" prop="patrolTemplateTopic">
						<el-input v-model="filters.patrolTemplateTopic" placeholder="巡查主题"></el-input>
					</el-form-item>
					<el-form-item label="巡查人员" prop="patrolUserName">
						<el-input v-model="filters.patrolUserName" placeholder="巡查人员"></el-input>
					</el-form-item>
					<el-form-item label="巡查日期" prop="time">
						<el-date-picker v-model="filters.time" type="daterange" start-placeholder="年-月-日" end-placeholder="年-月-日"></el-date-picker>
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
				:cell-style="{'text-align':'center'}"  @selection-change="handlegx">
					<el-table-column label="" type="selection" width="50">
					</el-table-column>
					<el-table-column label="ID" prop="id">
					</el-table-column>
					<el-table-column label="巡查主题" prop="patrolTemplateTopic">
					</el-table-column>
					<el-table-column label="巡查类型" prop="patrolTemplateType" :formatter="partformat">
					</el-table-column>
					<el-table-column label="巡查人员" prop="patrolUserName">
					</el-table-column>
					<el-table-column label="巡查时间" prop="patrolDateTime" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column label="操作" prop="">
						<template slot-scope="scope">
							<span class="detail-title" @click="handleDetail(scope.row)">详情</span>
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
		<!-- 详情 -->
		<el-dialog :visible.sync="xqdialog" v-if="xqdialog" class="g-dialog" :title="diatitle">
			<div class="xc-cont">
				<div class="gj-box">
					<div class="gj-lst">
						<img src="../../assets/img/id.png" class="img">
						<span class="num">{{detailform.id}}</span>
						<span class="type">ID</span>
					</div>
					<div class="gj-lst">
						<img src="../../assets/img/zdjy.png" class="img">
						<span class="num">{{detailform.patrolTemplateTopic}}</span>
						<span class="type">巡查主题</span>
					</div>
					<div class="gj-lst">
						<img src="../../assets/img/fqr.png" class="img">
						<span class="num">{{detailform.patrolUserName}}</span>
						<span class="type">巡查人</span>
					</div>
					<div class="gj-lst">
						<img src="../../assets/img/sj.png" class="img">
						<span class="num">{{detailform.patrolDateTime}}</span>
						<span class="type">巡查时间</span>
					</div>
				</div>
				<div class="refer-lt">
					<div :class="['read-lst',{'active':current == '0'}]" @click="handleType('0')">巡查轨迹</div>
					<div :class="['read-lst',{'active':current == '1'}]" @click="handleType('1')">巡查结果</div>
					<div :class="['read-lst',{'active':current == '2'}]" @click="handleType('2')">事件上报列表</div>
				</div>
				<div class="refer-rt">
					<div class="dt" v-if="current=='0'">
						<baidu-map style="height: 100%;" :center="mapCenter" :zoom="mapZoom" :scroll-wheel-zoom="true" ak="baidu-ak"
							@ready="handlerBMap" />
					</div>
					<div class="result-box" v-if="current =='1'">
						<span class="btn down-btn" @click="handledown">下载</span>
						<div class=""></div>
						<iframe :src="detailform.patrolResultPdfFileUrl" class="iframpdf"></iframe>
					</div>
					<div class="m-table" v-if="current =='2'">
						<el-table :data="reportlist" highlight-current-row v-loading="listLoading" style="width: 100%;"
							border :row-class-name="tableRowClassName" :header-cell-style="{'text-align':'center'}"
						:cell-style="{'text-align':'center'}">
							<el-table-column label="ID" prop="evtId" width="100" :show-overflow-tooltip="true">
							</el-table-column>
							<el-table-column label="标题" prop="evtTitle" width="100" :show-overflow-tooltip="true">
							</el-table-column>
							<el-table-column label="事件类型" prop="evtTypeName">
							</el-table-column>
							<el-table-column label="处理节点" prop="evtNodeName">
							</el-table-column>
							<el-table-column label="处理结果" prop="">
								<template slot-scope="scope">
                                    <span class="f-orange" v-if="scope.row.evtNodeResultName == '待处理'">{{scope.row.evtNodeResultName}}</span>
                                    <span class="f-red" v-else-if="scope.row.evtNodeResultName == '拒签' || scope.row.evtNodeResultName == '退回处置'
                                    || scope.row.evtNodeResultName == '挂起'">{{scope.row.evtNodeResultName}}</span>
                                    <span v-else-if="scope.row.evtNodeResultName == ''">/</span>
                                    <span class="f-blue" v-else>{{scope.row.evtNodeResultName}}</span>
								</template>
							</el-table-column>
							<el-table-column label="来源" prop="evtFromName">
							</el-table-column>
							<el-table-column label="发起人" prop="evtInitiatorName">
							</el-table-column>
							<el-table-column label="发起时间" prop="evtStartTime" width="200">
							</el-table-column>
							<el-table-column label="操作" prop="">
								<template slot-scope="scope">
									<span class="detail-title" @click="handlereportdt(scope.row)">详情</span>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</div>

			</div>

		</el-dialog>
		<!-- 事件详情 -->
		<el-dialog :visible.sync="reportdialog" v-if="reportdialog" class="g-dialog" title="事件处理详情">
			<div class="addbox">
				<div class="gj-box">
					<div class="gj-lst">
						<img src="../../assets/img/id.png" class="img">
						<span class="num">{{evtInfoVo.evtId}}</span>
						<span class="type">ID</span>
					</div>
					<div class="gj-lst">
						<img src="../../assets/img/zdjy.png" class="img">
						<span class="num">{{evtInfoVo.evtTypeName}}</span>
						<span class="type">事件类型</span>
					</div>
					<div class="gj-lst">
						<img src="../../assets/img/fqr.png" class="img">
						<span class="num">{{evtInfoVo.evtInitiatorName}}</span>
						<span class="type">发起人</span>
					</div>
					<div class="gj-lst">
						<img src="../../assets/img/sj.png" class="img">
						<span class="num">{{evtInfoVo.evtStartTime}}</span>
						<span class="type">发起时间</span>
					</div>
				</div>
				<div class="lt">
					<div class="xq-content event-detail">
						<div class="xq-lst">
							<span class="name">类型</span>
							<span class="lab">{{evtInfoVo.evtTypeName}}</span>
						</div>
						<div class="xq-lst">
							<span class="name">标题</span>
							<span class="lab">{{reportfrom.evtTitle}}</span>
						</div>
						<div class="xq-lst">
							<span class="name">位置</span>
							<span class="lab">{{reportfrom.evtPlaceName}}</span>
						</div>
						<div class="xq-lst">
							<span class="name">事件描述</span>
							<span class="remark1">{{reportfrom.evtDescription}}</span>
						</div>
						<div class="xq-lst">
							<span class="name">附件</span>
							<ul class="picul" v-if="piclist.length>0" >
								<li class="pic-lst" v-for="(item,index) in piclist">
									<img :src="item.url" class="img">
								</li>
							</ul>
						</div>
						<i class="f-clearfix"></i>
						<div class="xq-lst">
							<span class="name" style="color:#ffffff">附件</span>
							<ul class="picul" v-if="audiolist.length>0">
								<li class="pic-lst aud-lst" v-for="(item,index) in audiolist">
									<audio controls class="audio">
										<source :src="item.url" type="audio/mpeg">
									</audio>
								</li>
							</ul>
						</div>
						<i class="f-clearfix"></i>
						<div class="xq-lst">
							<span class="name" style="color:#ffffff">附件</span>
							<ul class="picul" v-if="videolist.length>0">
								<li class="pic-lst" v-for="(item,index) in videolist">
									<video :src="item.url" controls="controls"></video>
								</li>
							</ul>
						</div>
					</div>

				</div>
				<div class="editbox">
					<span class="edit-tip">事件流转日志</span>
					<ul class="record-box">
						<li class="record-lst" v-for="(item,index) in recordlist">
							<i class="line"></i>
							<span class="dot"></span>
							{{
                item.activityName == '流程开始' ||
                item.activityName == '流程结束' || item.commentList.length > 0 
                  ? item.endTime
                  : item.createTime
              }}
							<div class="rec-rt">
								<span class="button">{{item.activityName}}</span>
								<div class="inf"><img :src="item.assigneeAvatarUrl" class="avater">{{item.assigneeName}}</div>
								<span class="bbh">{{item.endTime
              }}</span>
								<div class="com-ul" v-if="item.commentList && item.commentList.length>0">
									<div v-for="(items,index) in item.commentList" class="com-lst" v-if="items.fullMessage != null">{{items.fullMessage}}</div>
								</div>
								<div class="com-ul" v-if="item.attachmentList && item.attachmentList.length>0">
									<div v-for="(items,index) in item.attachmentList" class="com-lst">附件：{{items.name}}</div>
								</div>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { UserPatrolList ,DelUserPatrol,UserPatrolfindById,UserPatrolEvents,EventDetil,DictType} from '../../api/api.js'
	import moment from 'moment'

	import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
	export default {
		components: {
			BaiduMap
		},
		data(){
			return{
				filters:{
					patrolTemplateType:'2', //巡查类型
					patrolUserName:'',
					patrolTemplateTopic:'',
					patrolStartDate:'',
					patrolEndDate:'',
					time:[],
					size:10,
					current:1
				},
				datalist:[],
				listLoading:false,
				total:0,
				currentPage:1,
				currentPage1:1,
				pagesize:10,
				patrtypelist:[], //巡查类型
				multion:[],
				xqdialog:false,
				diatitle:'巡查详情',
				current:0,
				mapZoom: 13,
				mapCenter: { //青原
					lng: 115.01747,
					lat: 27.10577,
				},
				mapLocation: {
					address: undefined,
					coordinate: undefined
				},
				mapbox:{},
				detailform:{},
				patrolPoints:[],
				mapbox:{},
				reportlist:[],

				reportdialog:false,
				reportfrom:{},
				evtInfoVo:{},
				piclist:[],
				audiolist:[],
				videolist:[],
				recordlist:[],
			}
		},
		mounted(){
			this.getdict('patrol_template_type')
			this.getlist('')
		},
		methods:{
			// 获取字典
			getdict:function(val){
				DictType(val).then((res)=>{
					console.log(res,'191')
					this.patrtypelist = res.data.data
				})
			},
			// 转化
			partformat:function(row,column){
				for(var i=0;i<this.patrtypelist.length;i++){
					if(row.patrolTemplateType == this.patrtypelist[i].dictValue){
						return this.patrtypelist[i].dictLabel
					}
				}
			},
			// 初始化地图
			handlerBMap:function({BMap,map}) {
				this.mapbox = {BMap,map}
			},
			// 单行变色
			tableRowClassName:function(rowIndex){
				if (rowIndex.rowIndex % 2 != 0) {
					return 'evenRow';
				}
				return 'oddRow';
			},
			// 列表
			getlist:function(val){
				if(this.filters.time && this.filters.time.length>0){
					this.filters.patrolStartDate = moment(this.filters.time[0]).format('yyyy-MM-DD')
					this.filters.patrolEndDate = moment(this.filters.time[1]).format('yyyy-MM-DD')
				}else{
					this.filters.patrolStartDate = ''
					this.filters.patrolEndDate = ''
				}
				let para ={
					patrolTemplateType:this.filters.patrolTemplateType,
					patrolUserName:this.filters.patrolUserName,
					patrolTemplateTopic:this.filters.patrolTemplateTopic,
					patrolStartDate:this.filters.patrolStartDate,
					patrolEndDate:this.filters.patrolEndDate,
					pageSize:this.filters.size,
					pageNum:this.filters.current
				}
				if(val){
					para.pageNum = val
					this.currentPage1 = val
				}
				UserPatrolList(para).then((res)=>{
					this.datalist = res.data.rows
					this.total = res.data.total
				})
			},
			// 重置
			resetForm:function(filters){
				this.$refs.filters.resetFields()
				this.filters ={
					patrolTemplateType:'',
					patrolUserName:'',
					patrolTemplateTopic:'',
					patrolStartDate:'',
					patrolEndDate:'',
					time:[],
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
			// 详情
			handleDetail:function(row){
				this.xqdialog = true
				this.current = '0'
				this.getDetail(row.id)
				this.getreport(row.id)
			},
			// 详情
			getDetail:function(id){
				UserPatrolfindById(id).then((res)=>{
					console.log(res,'111')
					this.detailform = res.data.data
					let patrolPoints = res.data.data.patrolPoints //巡查路线点
					for(var i=0;i<patrolPoints.length;i++){
						this.$set(patrolPoints[i], 'latitude', patrolPoints[i].pointPositions.split(',')[1])
						this.$set(patrolPoints[i], 'longitude', patrolPoints[i].pointPositions.split(',')[0])
					}
					this.patrolPoints = patrolPoints
					console.log(this.patrolPoints,'this.patrolPointsthis.patrolPointsthis.patrolPoints')
					this.initlinemap(this.mapbox,this.patrolPoints)
				})
			},
			// 开始划线
			initlinemap:function({BMap,map},data){
				console.log(data,'010010')
				var myIcon = new BMap.Icon(require('../../assets/img/xuncha.png'), new BMap.Size(47, 50), {
					offset: new BMap.Size(24, 25), // 指定定位位置
				})

				for(var i=0;i<data.length;i++){
					var marker = new BMap.Marker(new BMap.Point(data[i].latitude, data[i].longitude), {
						icon: myIcon
					});
					console.log(marker,'00011')
					marker.customData = {
						'xcmark': 'marker'
					}
					map.addOverlay(marker); // 将标注添加到地图中
					marker.disableMassClear();
					var html = "<div class='infoBoxContent1 infoBoxCon'>" +
						"<div class='inf-cont'>" +
							"<h3 class='result'>" + data[i].pointDesc + "</h3>" +
							"<div class='time'>" + data[i].pointTime + "</div>" +
						"</div>" +
					"</div>";
					let infoBox = new BMapLib.InfoBox(map, html, {
						boxStyle: {
							width: "156px",
							height: "74px",
						},
						enableAutoPan: true,
						align: INFOBOX_AT_TOP,
						offset: new BMap.Size(0, 40),
					});
					infoBox.open(marker);
				}
			},
			// 巡查上报列表
			getreport:function(id){
				UserPatrolEvents(id).then((res)=>{
					this.reportlist = res.data.data

				})
			},
			// 切换类型
			handleType:function(type){
				this.current = type
			},
			// 下载
			handledown:function(){
				// debugger
				// let url = '/system/oss/download/'+this.detailform.patrolResultPdf
				// this.comjs.downfile(url)
				let url = this.detailform.patrolResultPdfFileUrl;
				fetch(url)
					.then(response => response.blob())
					.then(blob => {
						// 创建一个下载链接
						var downloadLink = document.createElement('a');
						downloadLink.href = window.URL.createObjectURL(blob);
						downloadLink.download = '12121.pdf'; // 替换为你想要的文件名

						// 将链接添加到文档中，并触发点击
						document.body.appendChild(downloadLink);
						downloadLink.click();

						// 移除链接
						document.body.removeChild(downloadLink);
					})
					.catch(error => {
						console.error('下载文件时发生错误:', error);
					});
			},
			// 勾选
			handlegx:function(data){
				console.log(data,'00101')
				this.multion = []
				for(var i=0;i<data.length;i++){
					this.multion.push(data[i].id)
				}
			},
			// 导出
			handleexport:function(){
				if(this.multion.length>0){
					let url = '/system/userPatrol/exportZip/'+ this.multion.join(',')
					this.comjs.downfile(url)
				}else{
					this.$message({
						message:'至少勾选一条数据'
					})
				}

			},
			// 事件上报详情
			handlereportdt:function(row){
				this.reportdialog = true
				this.getDetail1(row)
			},
			// 详情
			getDetail1:function(data){
				let para ={
					procInsId:data.flowInstanceId,
					taskId:data.flowTaskId,
					evtId:data.evtId,
				}
				EventDetil(para).then((res)=>{
					console.log(res.data,'详情')
					this.reportfrom = res.data.data.formData
					this.evtInfoVo = res.data.data.evtInfoVo
					this.recordlist = res.data.data.historyProcNodeList
                    this.piclist = typeof(res.data.data.formData.pictureAttachment) != "undefined" ? res.data.data.formData.pictureAttachment :[]
                    this.videolist = typeof(res.data.data.formData.videoAttachment) != "undefined" ? res.data.data.formData.videoAttachment :[]
                    this.audiolist = typeof(res.data.data.formData.audioAttachment) != "undefined" ? res.data.data.formData.audioAttachment :[]

				})
			},


		}
	}
</script>

<style>
</style>
