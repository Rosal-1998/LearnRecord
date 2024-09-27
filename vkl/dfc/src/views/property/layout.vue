<template>
	<div class="g-cont">
		<div class="m-contain">
			<span class="btn add-btn" @click="handleAdd">新增检查单</span>
			<div class="m-search">
				<el-form :model="filters" :inline="true" ref="filters">
					<el-form-item label="巡查类型" class="" prop="patrolTemplateType">
						<el-select v-model="filters.patrolTemplateType" placeholder="巡查类型">
							<el-option v-for="(item,index) in patrtypelist" :value="item.dictValue" :label="item.dictLabel" :key="index"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="巡查主题" prop="patrolTopic">
						<el-input v-model="filters.patrolTopic" placeholder="巡查主题"></el-input>
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

					<el-table-column label="ID" prop="patrolTemplateId" width="200">
					</el-table-column>
					<el-table-column label="巡查主题" prop="patrolTemplateTopic">
					</el-table-column>
					<el-table-column label="巡查类型" prop="patrolTemplateType" :formatter="partformat">
					</el-table-column>
					<el-table-column label="版本号" prop="patrolTemplateVersion">
					</el-table-column>
					<el-table-column label="是否可用" prop="">
						<template slot-scope="scope">
							<span class="radio-tab" v-if="scope.row.status =='1'" @click="handlestatus(scope.row,'0')">
								是&nbsp;<img src="../../assets/img/status-active.png" class="status-img" />
							</span>
							<span class="radio-tab" v-else-if="scope.row.status =='0'" @click="handlestatus(scope.row,'0')">
								否&nbsp;<img src="../../assets/img/status-gray.png" class="status-img" />
							</span>
							<span v-else="">
								/
							</span>
						</template>
					</el-table-column>
					<el-table-column label="备注" prop="remark" :show-overflow-tooltip='true'>
					</el-table-column>
					<el-table-column label="更新时间" prop="updateTime">
					</el-table-column>
					<el-table-column label="操作" prop="">
						<template slot-scope="scope">
							<span class="detail-title" @click="handlesyqk(scope.row)">使用情况&nbsp;&nbsp;</span>
							<span class="edit-title" @click="handleEdit(scope.row)">编辑&nbsp;&nbsp;</span>
							<el-popover :ref="scope.row.patrolTemplateId" placement="top" width="160" popper-class="popover">
								<p class="del-tip">是否删除该检查单模板？</p>
								<div class="pop-btnbox">
									<span class="cancel-btn" @click="visibleDelCancel(scope.row.patrolTemplateId)">取消</span>
									<span class="ok-btn" @click="visibleDelSubmit(scope.row.patrolTemplateId)">确定</span>
								</div>
								<span slot="reference" class="del-title">删除</span>
							</el-popover>
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
		<!-- 新增、编辑 -->
		<el-dialog :visible.sync="adddialog" v-if="adddialog" class="g-dialog" :title="diatitle">
			<div :class="iseidt ? 'addbox' : ''">
				<div class="lt">
					<el-form :model="addForm" :inline="true" ref="addForm" :rules="addFormRules" class="addform add-signcent">
						<el-form-item label="巡查主题" prop="patrolTemplateTopic">
							<el-input v-model="addForm.patrolTemplateTopic" placeholder="请输入巡查主题"></el-input>
						</el-form-item>
						<el-form-item label="巡查类型" prop="patrolTemplateType">
							<el-select v-model="addForm.patrolTemplateType" placeholder="巡查类型">
								<el-option v-for="(item,index) in patrtypelist" :value="item.dictValue" :label="item.dictLabel" :key="index"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="版本号" prop="patrolTemplateVersion">
							<el-input v-model="addForm.patrolTemplateVersion" placeholder="请输入版本号"></el-input>
						</el-form-item>
						<el-form-item label="是否可用" prop="status">
							<div class="radio-lst" v-if="addForm.status =='1'" @click="handlestatus('0','1')">
								<img src="../../assets/img/status-active.png" class="status-img"/> 是
							</div>
							<div class="radio-lst" v-if="addForm.status =='0'" @click="handlestatus('1','1')">
								<img src="../../assets/img/status-gray.png" class="status-img"/> 否
							</div>
						</el-form-item>
						<el-form-item label="检查单文件" prop="patrolTemplateCheckFiles">
							<el-input v-model="addForm.patrolTemplateCheckFiles" style="display: none;"></el-input>
							<div class="file-lst">
								<div class="filebox">
									<input type="file" ref="file" class="file1" @change="choosefile($event)"/>
									<span class="upfile-btn">选择上传文件</span>
								</div>
								<ul class="file-ul" style="width: 100%; float: left;">
									<li class="file-li" v-for="(item,index) in filelist" @click="handdelfile(index)">
										<img src="../../assets/img/file.png" class="fileimg">
										<i class="filename" :title="item.name">{{item.name}}</i>
										<span class="delfile">删除</span>
									</li>
								</ul>
							</div>
						</el-form-item>
						<el-form-item label="备注" prop="remark">
							<el-input type="textarea" v-model="addForm.remark" placeholder="请输入备注"></el-input>
						</el-form-item>
					</el-form>
				</div>
				<!-- 修改记录 -->
				<div class="editbox">
					<span class="edit-tip">修改记录</span>
					<ul class="record-box">
						<li class="record-lst" v-for="(item,index) in recordlist">
							<i class="line"></i>
							<span class="dot"></span>
							<div class="rec-rt">
								<span class="button" v-if="item.actionType == '0'">新增</span>
								<span class="button" v-if="item.actionType == '1'">修改</span>
								<span class="button" v-if="item.actionType == '2'">删除</span>
								<div class="inf"><img :src="item.actionUserAvatar" class="avater">{{item.actionUserName}}</div>
								<span class="bbh">{{item.actionTime}}</span>
								<span class="bbh"><i class="name">检查单文件:</i><i class="yl-btn" @click="handleyl(item)">预览</i><i class="file" :title="item.patrolTemplateCheckFileNames">{{item.patrolTemplateCheckFileNames}}</i> </span>
								<span class="bbh">版本：{{item.patrolTemplateVersion}}</span>
							</div>
						</li>
					</ul>
				</div>
			</div>
			<div class="dialog-foot">
				<span class="btn-cancel" @click="handlecancel('0')">取消</span>
				<span class="btn-save" @click="handleSave">保存</span>
			</div>
		</el-dialog>
		<!-- 使用情况 -->
		<el-dialog :visible.sync="syqkdialog" v-if="syqkdialog" class="g-dialog" title="使用情况">
			<div class="jmbox">
				<div class="m-search">
					<el-form :model="syqkfilters" :inline="true" ref="syqkfilters">
						<el-form-item label="版本号" prop="">
							<el-input v-model="syqkfilters.patrolTemplateVersion" placeholder="版本号"></el-input>
						</el-form-item>
						<div class="search-btnbox">
							<span class="btn search-btn" @click="getsyqk(1)">查询</span>
							<span class="btn reset-btn" @click="resetForm1('syqkfilters')">重置</span>
						</div>
					</el-form>
				</div>
				<div class="m-table">
					<el-table :data="syqklist" highlight-current-row v-loading="listLoading" style="width: 100%;" border
						:row-class-name="tableRowClassName" :header-cell-style="{'text-align':'center'}"
						:cell-style="{'text-align':'center'}">
						<el-table-column label="ID" prop="userPatrolId" width="80">
						</el-table-column>
						<el-table-column label="使用版本号" prop="patrolTemplateVersion">
						</el-table-column>
						<el-table-column label="巡查人员" prop="patrolUserName">
						</el-table-column>
						<el-table-column label="巡查时间" prop="patrolDateTime">
						</el-table-column>
						<el-table-column label="操作" prop="">
							<template slot-scope="scope">
								<span class="detail-title" @click="handlesyqkdet(scope.row)">详情</span>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="m-pagination">
					<el-pagination background @size-change="handleSizeChange1" @current-change="handleCurrentChange1"
					        :current-page="currentPage2"
					        :page-size="pagesize2"
					        layout="prev, pager, next"
							prev-text="上一页"
						    next-text="下一页"
					        :total="syqktotal">
					</el-pagination>
					<i class="total">共有{{syqktotal}}条数据</i>
				</div>
			</div>
		</el-dialog>
		<!-- 使用情况下的详情 -->
		<el-dialog :visible.sync="xqdialog" v-if="xqdialog" class="g-dialog" title="巡查详情">
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
							@ready="handlerBMap">
						</baidu-map>
					</div>
					<div class="result-box" v-if="current =='1'">
						<span class="btn down-btn" @click="handledown">下载</span>
						<div class=""></div>
						<iframe :src="detailform.patrolResultPdf" class="iframpdf"></iframe>
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
									<span class="detail-title" @click="handleDetail(scope.row)">详情</span>
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
							<div class="rec-rt">
								<span class="button">{{item.activityName}}</span>
								<div class="inf"><img :src="item.assigneeAvatarUrl" class="avater">{{item.assigneeName}}</div>
								<span class="bbh">{{item.createTime}}</span>
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
	import axios from 'axios'
	import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
	import {DictType, patrolTemplateList ,AddpatrolTemplate ,UpdatepatrolTemplate ,DelpatrolTemplate ,patrolTemplatefindById ,ChangestatusTemplate, patrolTemplateUyqk,ActionLogList, UserPatrolfindById ,Ossyl, UserPatrolEvents,EventDetil} from '../../api/api.js'
	export default {
		components: {
			BaiduMap
		},
		data(){
			return{
				filters:{
					patrolTemplateType:'1',
					patrolTopic:'',
					size:10,
					current:1
				},
				datalist:[],
				listLoading:false,
				total:0,
				currentPage:1,
				currentPage1:1,
				pagesize:10,
				adddialog:false,
				diatitle:'',
				addForm:{
					patrolTemplateId:'',
					patrolTemplateTopic:'',
					patrolTemplateVersion:'',
					patrolTemplateType:'',
					status:'0',
					patrolTemplateCheckFiles:'',
					remark:'',
				},
				addFormRules:{
					patrolTemplateTopic:[{required:true, message:'请输入巡查主题',trigger:'blur'}],
					patrolTemplateVersion:[{required:true, message:'请输入版本号',trigger:'blur'}],
					status:[{required:true, message:'请选择是否可用',trigger:'blur'}],
					patrolTemplateType:[{required:true, message:'请选择巡查类型',trigger:'change'}],
					patrolTemplateCheckFiles:[{required:true, message:'请选择上传文件',trigger:'blur'}]
				},
				filelist:[],
				syqkdialog:false,
				patrolTemplateId:'',
				syqkfilters:{
					patrolTemplateVersion:'',
					current:1,
					size:10,
				},
				syqklist:[],
				syqktotal:0,
				currentPage2:1,
				pagesize2:10,
				iseidt:false, //是否为编辑框
				recordlist:[],
				xqdialog:false,
				current:'0',
				mapZoom: 13,
				mapCenter: { //青原
					lng: 115.01747,
					lat: 27.10577,
				},
				mapLocation: {
					address: undefined,
					coordinate: undefined
				},
				center:{},
				detailform:{},
				patrolPoints:[],
				mapbox:{},
				reportlist:[],
				reportdialog:false,
				reportfrom:{},
				evtInfoVo:{},
				recordlist:[],
				piclist:[],
				videolist:[],
				audiolist:[],
				patrtypelist:[],
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
					patrolTemplateType:this.filters.patrolTemplateType,
					patrolTopic:this.filters.patrolTopic,
					pageSize:this.filters.size,
					pageNum:this.filters.current
				}
				if(val){
					para.pageNum = val
					this.currentPage1 = val
				}
				patrolTemplateList(para).then((res)=>{
					this.datalist = res.data.rows
					this.total = res.data.total
				})
			},
			// 重置
			resetForm:function(filters){
				this.$refs.filters.resetFields()
				this.filters = {
					patrolTemplateType:'',
					patrolTopic:'',
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
			// 切换状态
			handlestatus:function(row,type){
				if(type == '0'){
					let para = row.patrolTemplateId
					ChangestatusTemplate(para).then((res)=>{
						console.log(res,'状态')
						if(res.code == '200'){
							this.$message({
								message:res.msg,
								type:'success'
							})
							this.getlist('')
						}else{
							this.$message({
								message:res.msg,
								type:'error'
							})
						}
					})
				}else{
					this.addForm.status = row
				}

			},
			// 删除取消
			visibleDelCancel(id) { // 取消
				this.$refs[id].doClose()
				// this.getlist(1)
			},
			// 删除确定
			visibleDelSubmit(id) { // 确定
				// 下面写 执行删除操作
				DelpatrolTemplate(id).then((res)=>{
					console.log(res,'10101')
					if(res.data.code =='200'){
						this.$message({
							  message:res.data.msg,
							  type:'success'
						})
					}else{
						this.$message({
							message:res.data.msg,
							type:'error'
						})
					}
					this.$refs[id].doClose()
					this.getlist(1)
				})
			},
			// 新增
			handleAdd:function(){
				this.adddialog = true
				this.diatitle = '添加检查单'
				this.addForm = {
					patrolTemplateId:'',
					patrolTemplateType:'',
					patrolTemplateTopic:'',
					patrolTemplateVersion:'',
					status:'0',
					patrolTemplateCheckFiles:'',
					remark:'',
				}
				this.filelist = []
				this.iseidt = false
			},
			// 编辑
			handleEdit:function(row){
				this.adddialog = true
				this.diatitle = '编辑检查单'
				this.recordlist = []
				this.getDetail(row.patrolTemplateId)

				this.iseidt = true
			},
			// 详情
			getDetail(id){
				patrolTemplatefindById(id).then((res)=>{
					console.log(res.data.data,'0010')
					this.addForm = res.data.data
					this.filelist = []
					this.filelist = [
						{
							name:res.data.data.patrolTemplateCheckFileNames,
							ossId:res.data.data.patrolTemplateCheckFiles
						}
					]
					this.handlerecodr(id)
				})
			},
			// 修改记录
			handlerecodr:function(id){
				let para = {
					patrolTemplateId:id
				}
				ActionLogList(para).then((res)=>{
					this.recordlist = res.data
				})
			},
			// 预览文件
			handleyl:function(item){
				let url ='/system/oss/view/'+item.patrolTemplateCheckFiles
				this.comjs.downfile(url)
			},
			// 弹窗关闭
			handlecancel:function(){
				this.$refs.addForm.resetFields();
				this.addForm = {
					patrolTemplateId:'',
					patrolTemplateType:'',
					patrolTemplateTopic:'',
					patrolTemplateVersion:'',
					status:'0',
					patrolTemplateCheckFiles:'',
					remark:'',
				}
				this.adddialog = false
			},
			// 上传文件
			choosefile:function(event){
				let file = this.$refs.file.files[0]
				console.log(file,'010100')
				this.uploadfile(file)
			},
			// 文件上传
			uploadfile:function(data){
				var random = new Date().getTime().toString();
				let formData = new FormData();
				formData.append("file",data);
				axios.post('/system/oss/upload?t='+random, formData ,{
					headers: {
						"Content-Type" :"multipart/form-data",
					},
					withCredentials:true,
				}).then((res) =>{
					if(res.data.code == 200){
						// 文件上传
						this.filelist = []
						this.filelist.push({
							name: res.data.data.fileName,
							ossId:res.data.data.ossId
						})
						this.addForm.patrolTemplateCheckFiles = res.data.data.ossId
						this.$nextTick(()=>{
							this.$refs.addForm.validateField('patrolTemplateCheckFiles')
						})
					}else {
						this.$message({
							message:res.data.msg,
							type:'error'
						})
					}
				}).catch((res) =>{
					console.log(res,'2')
				})
			},
			// 删除文件
			handdelfile:function(index){
				this.filelist.splice(index,1)
				this.addForm.patrolTemplateCheckFiles = ''

				// 重新设置文件列表
				this.filelist = [...this.filelist]

				// 清空文件输入框的值
				this.$refs.file.value = ""
			},
			// 保存
			handleSave:function(){
				this.$refs.addForm.validate((valid)=>{
					if(valid){
						let patrolTemplateCheckFiles
						let arr = []
						if(this.filelist.length>0){
							for(var i=0; i<this.filelist.length;i++){
								arr.push(this.filelist[i].ossId)
							}
							patrolTemplateCheckFiles = arr.join(',')
						}else{
							patrolTemplateCheckFiles = ''
						}
						let para ={
							patrolTemplateId:this.addForm.patrolTemplateId,
							patrolTemplateType:this.addForm.patrolTemplateType,
							patrolTemplateTopic:this.addForm.patrolTemplateTopic,
							patrolTemplateVersion:this.addForm.patrolTemplateVersion,
							status:this.addForm.status,
							patrolTemplateCheckFiles:patrolTemplateCheckFiles,
							remark:this.addForm.remark,
						}
						if(this.addForm.patrolTemplateId){
							UpdatepatrolTemplate(para).then((res)=>{
								if(res.code == '200'){
									this.$message({
										message:res.msg,
										type:'success'
									})
									this.getlist(1)
								}else{
									this.$message({
										message:res.msg,
										type:'error'
									})
								}
								this.$refs.addForm.resetFields();
								this.adddialog = false
								this.getlist(1)
							})
						}else{
							AddpatrolTemplate(para).then((res)=>{
								if(res.code == '200'){
									this.$message({
										message:res.msg,
										type:'success'
									})
								}else{
									this.$message({
										message:res.msg,
										type:'error'
									})
								}
								this.$refs.addForm.resetFields();
								this.adddialog = false
								this.getlist(1)
							})

						}
					}
				})
			},
			// 使用情况
			handlesyqk:function(row,val){
				this.syqkdialog = true
				this.patrolTemplateId = row.patrolTemplateId
				this.getsyqk('')
			},
			// 查询使用情况
			getsyqk:function(val){
				let para = {
					patrolTemplateId:this.patrolTemplateId,
					patrolTemplateVersion:this.syqkfilters.patrolTemplateVersion,
					pageSize:this.syqkfilters.size,
					pageNum:this.syqkfilters.current
				}
				if(val){
					para.pageNum = val
					this.currentPage2 = val
				}
				patrolTemplateUyqk(para).then((res)=>{
					this.syqklist = res.data.rows
					this.syqktotal = res.data.total
				})
			},
			// 重置
			resetForm1:function(filters){
				this.$refs.syqkfilters.resetFields()
				this.syqkfilters = {
					patrolTemplateVersion:'',
					size:10,
					current:1,
				}
				this.getsyqk(1)
			},
			// 分页
			handleSizeChange1:function(size){
			    this.pagesize2 = size
			},
			// 分页
			handleCurrentChange1:function(val){
			   this.syqkfilters.current = val;
			   this.getsyqk(val);
			},
			// 使用情况 查看详情
			handlesyqkdet:function(row){
				console.log(row,'100101')
				this.xqdialog = true
				this.current = '0'
				this.sygetDetail(row.userPatrolId)
				this.getreport(row.userPatrolId)
			},
			// 初始化地图
			handlerBMap:function({BMap,map}) {
				this.mapbox = {BMap,map}
				// var point = new BMap.Point(115.01747,27.10577) //青原
				// map.centerAndZoom(point, 13)
				// var marker = new BMap.Marker(point) // 创建标注
				// map.addOverlay(marker) // 将标注添加到地图中
				// this.initlinemap({BMap,map},this.patrolPoints)
			},
			// 详情
			sygetDetail:function(id){
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
					this.initlinemap(this.mapbox, this.patrolPoints)

				})
			},
			// 开始划线
			initlinemap:function({BMap,map},data){
				console.log(data,'010010')
				var myIcon = new BMap.Icon(require('../../assets/img/xuncha.png'), new BMap.Size(47, 50), {
					offset: new BMap.Size(24, 25), // 指定定位位置
				})
				var marker
				for(var i=0;i<data.length;i++){
					marker = new BMap.Marker(new BMap.Point(data[i].latitude, data[i].longitude), {
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
			// 切换
			handleType:function(type){
				this.current = type
			},
			// 下载
			handledown:function(){
				let url = '/system/oss/download/'+this.detailform.patrolResultPdf
				this.comjs.downfile(url)
			},
			// 查看详情 (上报事件)
			handleDetail:function(row){
				this.reportdialog = true
				let para ={
					procInsId:row.flowInstanceId,
					taskId:row.flowTaskId,
					evtId:row.evtId,
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
			// 巡查上报列表
			getreport:function(id){
				UserPatrolEvents(id).then((res)=>{
					console.log(res.data,'1001')
					this.reportlist = res.data.data

				})
			}

		}
	}
</script>

<style>

</style>
