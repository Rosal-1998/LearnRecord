<template>
	<div class="g-cont">
		<div class="m-contain">
			<el-form :model="filters" :inline="true" ref="filters"  class="m-search" style="float: left;">
				<el-form-item label="全部类型" prop="newsType">
					<el-select v-model="filters.newsType" placeholder="全部类型">
						<el-option v-for="(item,index) in newstype" :value="item.dictValue" :label="item.dictLabel" :key="index"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="发布状态" prop="publishStatus">
					<el-select v-model="filters.publishStatus" placeholder="发布状态">
						<el-option value="0" label="已发布"></el-option>
						<el-option value="1" label="待发布"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="展示状态" prop="displayStatus">
					<el-select v-model="filters.displayStatus" placeholder="展示状态">
						<el-option value="0" label="展示"></el-option>
						<el-option value="1" label="隐藏"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="标题" prop="newsTitle">
					<el-input v-model="filters.newsTitle" placeholder="输入标题"></el-input>
				</el-form-item>
				<el-form-item label="发布日期">
					<el-date-picker v-model="filters.time" type="daterange" start-placeholder="年-月-日" end-placeholder="年-月-日" range-separator="至"></el-date-picker>
				</el-form-item>
				<div class="search-btnbox">
					<span class="btn search-btn" @click="getlist(1)">查询</span>
					<span class="btn reset-btn" @click="resetForm('filters')">重置</span>
				</div>
			</el-form>
			<div class="operate-btn">
				<span class="btn add-btn" @click="handleAdd">新增</span>
			</div>
			<div class="m-table">
				<el-table :data="datalist" highlight-current-row v-loading="listLoading" style="width: 100%;"
					border :row-class-name="tableRowClassName" :header-cell-style="{'text-align':'center'}"
				:cell-style="{'text-align':'center'}">
					<el-table-column label="序号" type="index" width="80"></el-table-column>
					<el-table-column label="标题" prop="newsTitle" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column label="首图" prop="">
						<template slot-scope="scope">
							<img :src="scope.row.homeImageUrl" class="news-img" v-if="scope.row.homeImageUrl !=null && scope.row.homeImageUrl != ''">
							<img src="../../assets/img/empty1.png" class="news-img" v-else="">
						</template>
					</el-table-column>
					<el-table-column label="类型" prop="newsType" :formatter="newsformat">
					</el-table-column>
					<el-table-column label="发布状态" prop="">
						<template slot-scope="scope">
							<span v-if="scope.row.publishStatus == '0'" style="color: #00BEB8;">已发布</span>
							<span v-else-if="scope.row.publishStatus =='1'" style="color: #4892FD;">待发布</span>
							<span v-else="">/</span>
						</template>
					</el-table-column>
					<el-table-column label="展示状态" prop="">
						<template slot-scope="scope">
							<span v-if="scope.row.displayStatus =='0'" @click="handlestatus(scope.row,'0')">
								展示&nbsp;<img src="../../assets/img/status-active.png" class="status-img" />
							</span>
							<span v-else-if="scope.row.displayStatus =='1'" @click="handlestatus(scope.row,'0')">
								隐藏&nbsp;<img src="../../assets/img/status-gray.png" class="status-img" />
							</span>
							<span v-else="">
								/
							</span>
						</template>
					</el-table-column>
					<el-table-column label="浏览次数" prop="viewNumber"></el-table-column>
					<el-table-column label="发布人" prop="publishUserName"></el-table-column>
					<el-table-column label="发布时间" prop="publishTime"></el-table-column>
					<el-table-column label="操作" prop="">
						<template slot-scope="scope">
							<span class="detail-title"  @click="handleDetail(scope.row)">详情&nbsp;&nbsp;</span>
							<span class="edit-title"  @click="handleEdit(scope.row)">编辑&nbsp;&nbsp;</span>
							<el-popover :ref="scope.row.newsId" placement="top" width="160" popper-class="popover">
								<p class="del-tip">是否删除该新闻？</p>
								<div class="pop-btnbox">
									<span class="cancel-btn" @click="visibleDelCancel(scope.row.newsId)">取消</span>
									<span class="ok-btn" @click="visibleDelSubmit(scope.row.newsId)">确定</span>
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
						prev-text="< 上一页"
					    next-text="下一页 >"
				        :total="total">
				</el-pagination>
				<i class="total">共有{{total}}条数据</i>
			</div>
				
		</div>
		<!-- 新增、编辑 -->
		<el-dialog :visible.sync="adddialog" v-if="adddialog" class="g-dialog" :title="diatitle">
			<span class="tip">基础信息</span>
			<el-form :model="addForm" :inline="true" ref="addForm" :rules="addFormRules" class="addform">
				<el-form-item label="标题" prop="newsTitle">
					<el-input v-model="addForm.newsTitle" placeholder="请输入标题"></el-input>
				</el-form-item>
				<el-form-item label="作者" prop="author">
					<el-input v-model="addForm.author" placeholder="请输入作者"></el-input>
				</el-form-item>
				<el-form-item label="首图" prop="" class="delbgimg" :key="formItemKey">
					<div class="upimgbox" :style="{backgroundImage:'url('+addForm.homeImageUrl+')'}">
						<input ref="file" type="file" class="file" @change="choosefile($event,'0')"/>
					</div>
					<i class="del-tip1" v-if="editflag" @click="handlesyimg">删除</i>
				</el-form-item>
				<el-form-item label="类型" prop="newsType">
					<el-select v-model="addForm.newsType" placeholder="类型">
						<el-option v-for="(item,index) in newstype" :value="item.dictValue" :label="item.dictLabel" :key="index"></el-option>
					</el-select>
				</el-form-item>
				<i style="display: block;width: 100%; float:left;"></i>
				<el-form-item label="发布类型" prop="">
					<div class="radio-lst" v-if="addForm.publishType =='0'" @click="handlestatus('1','1')">
						<img src="../../assets/img/status-active.png" class="status-img"/> 立即发布
					</div>
					<div class="radio-lst" v-if="addForm.publishType =='1'" @click="handlestatus('0','1')">
						<img src="../../assets/img/status-gray.png" class="status-img"/> 定时发布
					</div>
				</el-form-item>
				<el-form-item label="展示状态" prop="">
					<div class="radio-lst" v-if="addForm.displayStatus =='0'" @click="handlestatus('1','2')">
						<img src="../../assets/img/status-active.png" class="status-img"/> 展示
					</div>
					<div class="radio-lst" v-if="addForm.displayStatus =='1'" @click="handlestatus('0','2')">
						<img src="../../assets/img/status-gray.png" class="status-img"/> 隐藏
					</div>
				</el-form-item>
				
				<el-form-item label="发布时间" prop="" style="width: 100%;" v-if="addForm.publishType == '1'">
					<el-date-picker v-model="addForm.publishSignTime"  type="datetime"  placeholder="选择日期时间"></el-date-picker>
				</el-form-item>
				<i style="display: block;width: 100%; float:left;"></i>
				<el-form-item label="描述" prop="describes" class="max-textarea">
					<el-input type="textarea" v-model="addForm.describes" placeholder="请输入描述"></el-input>
				</el-form-item>
				<el-form-item label="内容" prop="" style="width: 100%;">
					<quill-editor ref="mwQuillEditor" v-model="addForm.newsContent" class="bjq-tool ql-editors" />
				</el-form-item>
				<el-form-item label="附件" prop="" style="width: 100%;">
					<div class="filebox">
						<input type="file" ref="file1" class="file1" @change="choosefile($event,'1')"/>
						<span class="upfile-btn">选择上传文件</span>
					</div>
					<span class="tip-gray">文件不能超过5MB</span>
					<ul class="file-ul" style="float: left;width: 100%;">
						<li class="file-li" v-for="(item,index) in filelist" @click="handdelfile(index)">
							<img src="../../assets/img/file.png" class="fileimg">{{item.name}}
							<span class="delfile">删除</span>
						</li>
					</ul>
				</el-form-item>
			</el-form>
			<div class="dialog-foot">
				<span class="btn-cancel" @click="handlecancel">取消</span>
				<span class="btn-save" @click="handleSubmit">保存</span>
			</div>
		</el-dialog>
		<!-- 详情 -->
		<el-dialog :visible.sync="xqdialog" v-if="xqdialog" class="g-dialog" title="详情">
			<div class="xq-content noticbox">
				<span class="title">{{detailform.newsTitle}}</span>
				<div class="infobox">作者：{{detailform.author}} &nbsp;&nbsp;发布时间：{{detailform.publishTime}}</div>
				<div class="xq-nr" v-html="detailform.newsContent"></div>
				<div class="notic-file">
					<span class="name">附件：</span>
					<ul class="file-ul">
						<li class="file-li" v-for="(item,index) in filelist" @click="handdown(index)">
							<img src="../../assets/img/file.png" class="fileimg">
							<span class="filename">{{item.name}}</span>
							<span class="downfile">下载</span>
						</li>
					</ul>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import {NewsInforList ,AddNewsInfor ,UpdateNewsInfor ,DelNewsInfor ,NewsInforfindById, ChangestatusNewsInfor, DictType} from '../../api/api.js'
	import axios from 'axios'
	import { quillEditor,Quill  } from 'vue-quill-editor'
	import 'quill/dist/quill.core.css'
	import 'quill/dist/quill.snow.css'
	import 'quill/dist/quill.bubble.css'
	import moment from 'moment'
	export default {
		components: {
		    quillEditor
		},
		data(){
			return{
				filters:{
					newsTitle:'', //新闻标题
					publishStatus:'', //发布状态
					displayStatus:'', //展示状态
					newsType:'0', //新闻类型
					startDate:'', //开始时间
					endDate:'', //结束时间
					size:10,
					current:1,
					time:[],
				},
				datalist:[],
				listLoading:false,
				total:0,
				currentPage:1,
				currentPage1:1,
				pagesize:10,
				newstypelist:[], //新闻类型
				newstype:[
					{
						dictValue:'0',
						dictLabel:'新闻动态'
					}
				],
				adddialog:false,
				diatitle:'新增',
				addForm:{
					newsId:'', // 新闻id
					newsTitle:'', //新闻标题
					describes:'',
					author:'',
					homeImageUrl:"url('../img/empty.png') no-repeat",//首图地址
					homeImage:'', //首图地址id
					newsType:'',
					publishStatus:'0', //发布状态
					publishType:'0', //发布类型 立即发布
					displayStatus:'0', //展示状态
					publishSignTime:'', //发布时间
					newsContent:'', //内容
					attachmentUrl:'', //附件
				},
				addFormRules:{
					newsTitle:[{required:true, message:'请输入新闻标题',trigger:'blur'}],
					describes:[{required:true, message:'请输入新闻内容描述',trigger:'blur'}],
					displayStatus:[{required:true, message:'请选择展示状态',trigger:'change'}],
					newsType:[{required:true, message:'请选择新闻类型',trigger:'change'}],
				},
				hideimg:false,
				xqdialog:false,
				detailform:{},
				filelist:[],
				imgflag:false,
				editflag:false,
				formItemKey:0,
			}
		},
		mounted(){
			this.getdict('news_type')
			this.getlist('')
		},
		methods:{
			// 获取字典
			getdict:function(val){
				DictType(val).then((res)=>{
					console.log(res,'191')
					this.newstypelist = res.data.data
				})
			},
			// 类型转换
			newsformat:function(row,column){
				for(var i=0;i<this.newstypelist.length;i++){
					if(row.newsType == this.newstypelist[i].dictValue){
						return this.newstypelist[i].dictLabel
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
				if(this.filters.time && this.filters.time.length>0){
					this.filters.startDate = moment(this.filters.time[0]).format('yyyy-MM-DD')
					this.filters.endDate = moment(this.filters.time[1]).format('yyyy-MM-DD')
				}else{
					this.filters.startDate = ''
					this.filters.endDate = ''
				}
				let para = {
					newsType:this.filters.newsType,
					publishStatus:this.filters.publishStatus,
					displayStatus:this.filters.displayStatus,
					newsTitle:this.filters.newsTitle,
					startDate:this.filters.startDate,
					endDate:this.filters.endDate,
					pageSize:this.filters.size,
					pageNum:this.filters.current,
				}
				if(val){
					para.pageNum = val
					this.currentPage1 = val
				}
				NewsInforList(para).then((res)=>{
					this.datalist = res.data.rows
					this.total = res.data.total
					console.log('---获取列表---')
				})
			},
			// 重置
			resetForm:function(filters){
				this.$refs.filters.resetFields()
				this.filters = {
					newsType:'0',
					newsTitle:'', //新闻标题
					publishStatus:'', //发布状态
					displayStatus:'', //展示状态
					startDate:'', //开始时间
					endDate:'', //结束时间
					size:10,
					current:1,
					time:[],
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
					ChangestatusNewsInfor(row.newsId).then((res)=>{
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
						this.getlist(1)
					})
				}else if(type =='1'){
					this.addForm.publishType = row
					this.addForm.publishStatus = row
				}else{
					this.addForm.displayStatus = row
				}
			},
			// 删除取消
			visibleDelCancel(id) { // 取消
			  this.$refs[id].doClose()
			},
			// 删除确认
			visibleDelSubmit(id) { // 确定
				DelNewsInfor(id).then((res)=>{
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
				this.diatitle = '新闻添加'
				this.addForm = {
					newsId:'', // 新闻id
					newsTitle:'', //新闻标题
					describes:'', //新闻描述
					author:'',
					homeImageUrl:"url('../img/empty.png') no-repeat",//首图地址
					homeImage:'', //首图地址id
					newsType:'',
					publishStatus:'0', //发布状态
					publishType:'0', //发布类型 立即发布
					displayStatus:'0', //展示状态
					publishSignTime:'', //发布时间
					newsContent:'', //内容
					attachmentUrl:'', //附件
				}
				this.editflag = false
				this.filelist = []
			},
			
			// 编辑
			handleEdit:function(row){
				this.adddialog = true
				this.diatitle = '新闻编辑'
				this.getDetail(row.newsId)
				this.editflag = true
			},
			// 删除图片
			handlesyimg:function(){
				this.addForm.homeImageUrl = require("@/assets/img/empty.png")
				this.addForm.homeImage = ''
				this.editflag = false
				// 更新key，强制el-form-item 重新渲染
				this.formItemKey+=1
			},
			// 详情
			handleDetail:function(row){
				this.xqdialog = true
				this.getDetail(row.newsId)
			},
			// 详情
			getDetail:function(id){
				NewsInforfindById(id).then((res)=>{
					console.log(res,'详情')
					this.detailform = res.data.data
					this.addForm = res.data.data
					this.filelist = []
					let attachmentFileName = res.data.data.attachmentFileName
					if(attachmentFileName != ''&& attachmentFileName != null && attachmentFileName.length>0){
						let attachmentFileName1 = attachmentFileName.split(',')
						let attachmentFileUrl = res.data.data.attachmentFileUrl.split(',')
						let attachmentUrl = res.data.data.attachmentUrl.split(',')
						for(var i=0;i<attachmentFileName1.length;i++){
							this.filelist.push({
								name:attachmentFileName1[i],
								url:attachmentFileUrl[i],
								ossId:attachmentUrl[i],
							})
						}
					}
					if(this.addForm.homeImageUrl == null || this.addForm.homeImageUrl == ''){
						this.addForm.homeImageUrl = require("@/assets/img/empty.png")
						this.addForm.homeImage = ''
						this.editflag = false
					}
					
				})
			},
			// 导出
			handledc:function(){
				let url = '/cz/download'
				this.comjs.downfile(url)
			},
			// 图片上传、上传文件
			choosefile:function(event,type){
				let file
				if(type == '0'){
					// 图片上传
					file = this.$refs.file.files[0]
				}else{
					// 文件上传
					file = this.$refs.file1.files[0]
				}
				console.log(file,'010100')
				this.uploadfile(file,type)
			},
			// 文件上传后获取数据
			uploadfile:function(data,type){
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
						console.log(res,'10101010')
						if(type =='0'){
							// 图片上传后
							this.addForm.homeImage = res.data.data.ossId
							this.addForm.homeImageUrl = res.data.data.url
							this.editflag = true
						}else{
							// 文件上传
							this.filelist.push({
								name: res.data.data.fileName,
								url:res.data.data.url,
								ossId:res.data.data.ossId
							})
						}
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
			},
			
			// 取消
			handlecancel:function(){
				this.$refs.addForm.resetFields()
				this.addForm = {
					newsId:'', // 新闻id
					newsTitle:'', //新闻标题
					describes:'', //描述
					author:'',
					homeImageUrl:"url('../img/empty.png') no-repeat",//首图地址
					homeImage:'', //首图地址id
					newsType:'',
					publishType:'0', //发布类型 立即发布
					displayStatus:'0', //展示状态
					publishSignTime:'', //发布时间
					newContent:'', //内容
					attachmentUrl:'', //附件
				}
				this.filelist = []
				this.adddialog = false
			},
			// 保存
			handleSubmit:function(){
				this.$refs.addForm.validate((valid)=>{
					if(valid){
						let attachmentUrl
						let filelist = []
						if(this.filelist && this.filelist.length>0){
							for(var i=0; i<this.filelist.length;i++){
								filelist.push(this.filelist[i].ossId)
							}
							attachmentUrl = filelist.join(',')
						}else{
							attachmentUrl = ''
						}
						if(this.addForm.publishSignTime){
							this.addForm.publishSignTime = moment(this.addForm.publishSignTime).format('yyyy-MM-DD HH:mm:ss')
						}else{
							this.addForm.publishSignTime = ''
						}
						let para = {
							newsId:this.addForm.newsId,
							newsTitle:this.addForm.newsTitle, //标题
							author:this.addForm.author,// 作者
							describes:this.addForm.describes, //描述
							homeImage:this.addForm.homeImage, //首图地址
							newsType:this.addForm.newsType, //新闻类型
							publishType:this.addForm.publishType, //发布类型
							displayStatus:this.addForm.displayStatus, //展示状态
							publishSignTime:this.addForm.publishSignTime, //发布时间
							newsContent:this.addForm.newsContent, //公告内容
							attachmentUrl:attachmentUrl, //附件地址
						}
						if(this.addForm.newsId){
							UpdateNewsInfor(para).then((res)=>{
								console.log(res,'xinz')
								if(res.code =='200'){
									
								}else{
									this.$message({
										message:res.msg,
										type:'error'
									})
								}
								this.$refs.addForm.resetFields()
								this.adddialog = false
								this.getlist(1)
							})
						}else{
							AddNewsInfor(para).then((res)=>{
								console.log(res,'xinz')
								if(res.code =='200'){
									
								}else{
									this.$message({
										message:res.msg,
										type:'error'
									})
								}
								this.$refs.addForm.resetFields()
								this.adddialog = false
								this.getlist(1)
							})
						}
					}
				})
			},
			// 下载
			handdown:function(index){
				console.log(this.filelist[index],'1001')
				let url = '/system/oss/download/'+this.filelist[index].ossId
				this.comjs.downfile(url)
			}
			
		}
	}
</script>

<style>
</style>