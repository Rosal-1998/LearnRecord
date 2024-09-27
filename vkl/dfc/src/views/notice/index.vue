<template>
	<div class="g-cont">
		<div class="m-contain">
			<span class="btn add-btn" @click="handleAdd">新增</span>
			<el-form :model="filters" ref="filters" :inline="true" class="m-search">
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
				<el-form-item label="标题" prop="title">
					<el-input v-model="filters.title" placeholder="输入标题"></el-input>
				</el-form-item>
				<el-form-item label="发布日期">
					<el-date-picker v-model="filters.time" type="daterange" start-placeholder="年-月-日" end-placeholder="年-月-日" range-separator="至"></el-date-picker>
				</el-form-item>
				<div class="search-btnbox">
					<span class="btn search-btn" @click="getlist(1)">查询</span>
					<span class="btn reset-btn" @click="resetForm('filters')">重置</span>
				</div>
			</el-form>
			<div class="m-table">
				<el-table :data="datalist" highlight-current-row v-loading="listLoading" style="width: 100%;" :row-class-name="tableRowClassName" :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}">
					<el-table-column label="序号" type="index" width="80"></el-table-column>
					<el-table-column label="标题" prop="noticeTitle" :show-overflow-tooltip='true'></el-table-column>
					<el-table-column label="首图" prop="">
						<template slot-scope="scope">
							<img :src="scope.row.homeImageUrl" class="news-img" v-if="scope.row.homeImageUrl !=null && scope.row.homeImageUrl != ''">
							<img src="../../assets/img/empty1.png" class="news-img" v-else="">
						</template>
					</el-table-column>
					<el-table-column label="类型" prop="noticeType">
						<template slot-scope="scope">
							<span v-if="scope.row.noticeType == '0'" style="color: #00BEB8;">通知公告</span>
							<span v-else="">/</span>
						</template>
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
							<span class="radio-tab" v-if="scope.row.displayStatus =='0'" @click="handlestatus(scope.row,'0')">
								展示&nbsp;<img src="../../assets/img/status-active.png" class="status-img" />
							</span>
							<span class="radio-tab" v-else-if="scope.row.displayStatus =='1'" @click="handlestatus(scope.row,'0')">
								隐藏&nbsp;<img src="../../assets/img/status-gray.png" class="status-img" />
							</span>
							<span v-else="">
								/
							</span>
						</template>
					</el-table-column>
					<el-table-column label="查阅情况" prop="">
						<template slot-scope="scope">
							<span class="">{{scope.row.viewNumber}}&nbsp;&nbsp;</span>
							<span class="refer-btn" v-if="scope.row.viewNumber>'0'" @click="handlerefer(scope.row)">查阅情况</span>
						</template>
					</el-table-column>
					<el-table-column label="发布人" prop="publishUserName"></el-table-column>
					<el-table-column label="发布时间" prop="publishTime"></el-table-column>
					<el-table-column label="操作" prop="">
						<template slot-scope="scope">
							<span class="detail-title" v-if="scope.row.publishStatus == '0'" @click="handleDetail(scope.row)">详情&nbsp;&nbsp;</span>
							<span class="edit-title" v-if="scope.row.publishStatus == '1'" @click="handleEdit(scope.row)">编辑&nbsp;&nbsp;</span>
							<el-popover :ref="scope.row.noticeId" placement="top" width="160" popper-class="popover">
								<p class="del-tip">是否删除该公告？</p>
								<div class="pop-btnbox">
									<span class="cancel-btn" @click="visibleDelCancel(scope.row.noticeId)">取消</span>
									<span class="ok-btn" @click="visibleDelSubmit(scope.row.noticeId)">确定</span>
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
						:current-page.sync="currentPage1"
				        layout="prev, pager, next"
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
				<el-form-item label="标题" prop="noticeTitle">
					<el-input v-model="addForm.noticeTitle" placeholder="请输入标题"></el-input>
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
				<el-form-item label="可见范围" prop="" class="yxry">
					<span class="choose-btn" @click="handlechoose">选择</span>
					<i class="f-clearfix"></i>
					<ul class="gx-ul">
						<li class="gx-lst" v-for="(item,index) in gxuserlist">{{item.userName}}</li>
					</ul>
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
				<el-form-item label="展示状态" prop="displayStatus">
					<div class="radio-lst" v-if="addForm.displayStatus =='0'" @click="handlestatus('1','2')">
						<img src="../../assets/img/status-active.png" class="status-img"/> 展示
					</div>
					<div class="radio-lst" v-if="addForm.displayStatus =='1'" @click="handlestatus('0','2')">
						<img src="../../assets/img/status-gray.png" class="status-img"/> 隐藏
					</div>
				</el-form-item>
				<el-form-item label="发布时间" prop="publishSignTime" style="width: 100%;" v-if="addForm.publishType == '1'">
					<el-date-picker v-model="addForm.publishSignTime"  type="datetime"  placeholder="选择日期时间"></el-date-picker>
				</el-form-item>
				<i style="display: block;width: 100%; float:left;"></i>
				<el-form-item label="描述" prop="describes" class="max-textarea">
					<el-input type="textarea" v-model="addForm.describes" placeholder="请输入描述"></el-input>
				</el-form-item>
				<el-form-item label="内容" prop="" style="width: 100%;">
					<quill-editor ref="mwQuillEditor" v-model="addForm.noticeContent" class="bjq-tool ql-editors" />
				</el-form-item>
				<el-form-item label="附件" prop="" style="width: 100%;">
					<div class="filebox">
						<input type="file" ref="file1" class="file1" @change="choosefile($event,'1')"/>
						<span class="upfile-btn">选择上传文件</span>
					</div>
					<span class="tip-gray">文件不能超过5MB</span>
					<ul class="file-ul" style="float: left;width: 100%;">
						<li class="file-li" v-for="(item,index) in filelist" @click="handdelfile(index)">
							<img src="../../assets/img/file.png" class="fileimg">
							<span class="filename">{{item.name}}</span>
							<span class="delfile">删除</span>
						</li>
					</ul>
				</el-form-item>
			</el-form>
			<div class="dialog-foot">
				<span class="btn-cancel" @click="handlecancel('1')">取消</span>
				<span class="btn-save" @click="handleSubmit">保存</span>
			</div>
		</el-dialog>
		<!-- 详情 -->
		<el-dialog :visible.sync="xqdialog" v-if="xqdialog" class="g-dialog" title="详情">
			<div class="xq-content noticbox">
				<span class="title">{{detailform.noticeTitle}}</span>
				<div class="infobox">作者：{{detailform.author}} &nbsp;&nbsp;发布时间：{{detailform.publishTime}}</div>
				<div class="xq-nr" v-html="detailform.noticeContent"></div>
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
		<!-- 查阅情况 -->
		<el-dialog :visible.sync="cydialog" v-if="cydialog" class="g-dialog min-dia642" title="查阅情况">
			<div class="refer-content">
				<div class="refer-lt">
					<div :class="['read-lst',{'active':current == '0'}]" @click="handleread('0')">已读</div>
					<div :class="['read-lst',{'active':current == '1'}]" @click="handleread('1')">未读</div>
				</div>
				<div class="refer-rt">
					<div class="m-table">
						<el-table :data="referlist" highlight-current-row v-loading="listLoading" style="width: 100%;" :row-class-name="tableRowClassName" :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}">
							<el-table-column label="姓名" prop="userName">
							</el-table-column>
							<el-table-column label="部门" prop="deptName">
							</el-table-column>
							<el-table-column label="查阅时间" prop="viewTime" v-if="current == ''">
							</el-table-column>
						</el-table>
					</div>
				</div>
			</div>
		</el-dialog>
		<!-- 可见范围 -->
		<el-dialog :visible.sync="userdialog" v-if="userdialog" class="g-dialog min-dia642" title="选择人员">
			<div class="refer-content">
				<div class="user-lt">
					<el-tree class="role-treebox"
						:data="treeData"  ref="roletree" 
						node-key="id"
						show-checkbox
						@node-click="handleClick" 
						highlight-current
						:default-expanded-keys="treeexpandData"
						@check-change="handleCheckChange"
						:default-checked-keys="defaultChecked"
						empty-text="加载中，请稍候" :props="defaultProps"
					></el-tree>
				</div>
				<div class="user-rt">
					<div class="gxbox">
						<i class="tipname">已选择人员</i>
						<ul class="gx-ul">
							<li v-for="(item,index) in gxlist" class="gx-lst">{{item.userName}}</li>
						</ul>
					</div>
				</div>
			</div>
			<div class="dialog-foot">
				<span class="btn-cancel" @click="handlecancel('2')">取消</span>
				<span class="btn-save" @click="handleuser">保存</span>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { UseNoticeList,AddNotice,UpdateNotice,DelNoticer,NoticerfindById, ChangestatusNotice, NoticerReadfo, SelectDeptTree,SelectDeptUser , NSelectDeptUserTree} from '../../api/api.js'
	import { quillEditor,Quill  } from 'vue-quill-editor'
	import 'quill/dist/quill.core.css'
	import 'quill/dist/quill.snow.css'
	import 'quill/dist/quill.bubble.css'
	import moment from 'moment'
	import axios from 'axios'
	import qs from 'qs'
	
	export default {
		components: {
		    quillEditor
		},
		data(){
			return{
				filters:{
					publishStatus:'', //发布状态
					displayStatus:'', //展示状态
					title:'', //新闻标题
					startDate:'', //开始时间
					endDate:'', //结束时间
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
				adddialog:false,
				diatitle:'',
				addForm:{
					noticeId:'', //id
					noticeTitle:'', //标题
					author:'',// 作者
					describes:'',
					homeImage:'', //首图地址ossid
					homeImageUrl:'', //首图地址
					visibility:'', //可见范围
					publishType:'0', //发布类型 立即发布
					displayStatus:'0', //展示状态
					publishStatus:'', //发布状态
					publishSignTime:'', //发布时间
					noticeContent:'', //公告内容
					attachmentUrl:'', //附件地址
				},
				addFormRules:{
					noticeTitle:[{required:true, message:'请输入标题',trigger:'blur'}],
					displayStatus:[{required:true, message:'请选择展示状态',trigger:'change'}],
					publishSignTime:[{required:true, message:'请选择发布时间',trigger:'change'}]
				},
				filelist:[], //文件集合
				gxuserlist:[], //勾选人员
				xqdialog:false,
				detailform:{},
				cydialog:false, //查阅情况
				current:'0',
				referlist:[], //查阅数据
				userdialog:false,
				userlist:[],
				multipleSelection:[],
				gxlist:[],
				noticeId:'',
				treeData:[],
				defaultProps:{
					children: 'children',
					label: 'label',
					id:'id'
				},
				departid:'',
				userform:{
					name:''
				},
				treeexpandData:[],
				usergx:[],
				choosetype:'0',
				defaultChecked:[],
				editflag:false,
				formItemKey:0,
			}
		},
		mounted(){
			this.getlist('')
			this.gettree()
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
				if(this.filters.time && this.filters.time.length>0){
					this.filters.startDate = moment(this.filters.time[0]).format('yyyy-MM-DD')
					this.filters.endDate = moment(this.filters.time[1]).format('yyyy-MM-DD')
				}else{
					this.filters.startDate = ''
					this.filters.endDate = ''
				}
				let para = {
					publishStatus:this.filters.publishStatus,
					displayStatus:this.filters.displayStatus,
					title:this.filters.title,
					startDate:this.filters.startDate,
					endDate:this.filters.endDate,
					pageSize:this.filters.size,
					pageNum:this.filters.current
				}
				if(val){
					para.pageNum = val
					this.currentPage1 = val
				}
				UseNoticeList(para).then((res)=>{
					this.datalist = res.data.rows
					this.total = res.data.total
				})
			},
			// 重置
			resetForm:function(filters){
				this.$refs.filters.resetFields()
				this.filters ={
					publishStatus:'', //发布状态
					displayStatus:'', //展示状态
					title:'', //新闻标题
					startDate:'', //开始时间
					endDate:'', //结束时间
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
			// 切换状态
			handlestatus:function(row,type){
				if(type == '0'){
					ChangestatusNotice(row.noticeId).then((res)=>{
						console.log(res,'10010')
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
			// 删除 取消
			visibleDelCancel(id) {
			  this.$refs[id].doClose()
			},
			// 删除 确定
			visibleDelSubmit(id) {
				DelNoticer(id).then((res)=>{
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
				this.diatitle = '公告添加'
				this.addForm = {
					noticeTitle:'', //标题
					author:'',// 作者
					describes:'',
					homeImageUrl:"url('../img/empty.png') no-repeat", //首图地址
					homeImage:'',
					visibility:'0', //可见范围
					publishType:'0', //发布类型
					displayStatus:'0', //展示状态
					publishStatus:'0', //发布状态
					publishSignTime:'', //发布时间
					noticeContent:'', //公告内容
					attachmentUrl:'', //附件地址
				}
				this.filelist = []
				this.gxuserlist = []
				this.defaultChecked = []
				this.choosetype = '0'
				this.editflag = false
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
			// 编辑
			handleEdit:function(row){
				this.adddialog = true
				this.diatitle = '公告编辑'
				this.gxuserlist =[]
				this.defaultChecked = []
				this.getDetail(row.noticeId)
				this.choosetype = '1'
				this.editflag = true
			},
			// 详情
			handleDetail:function(row){
				this.xqdialog = true
				this.getDetail(row.noticeId)
			},
			// 详情
			getDetail:function(id){
				NoticerfindById(id).then((res)=>{
					this.detailform = res.data.data
					this.addForm = res.data.data
					// 附件
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
					// 可选范围
					this.gxuserlist = []
					let visibility = res.data.data.visibility
					if(visibility != null && visibility != '' && visibility.length>0){
						let visibility1 = visibility.split(',')
						let visibilityUserNames = res.data.data.visibilityUserNames.split(',')
						for(var j=0;j<visibility1.length;j++){
							this.gxuserlist.push({
								userId:visibility1[j],
								userName:visibilityUserNames[j],
							})
							this.defaultChecked.push('user'+visibility1[j])
						}
						this.gxlist = this.gxuserlist
						
					}
					if(this.addForm.homeImageUrl == null || this.addForm.homeImageUrl == ''){
						this.addForm.homeImageUrl = require("@/assets/img/empty.png")
						this.addForm.homeImage = ''
						this.editflag = false
					}
					
				})
			},
			// 下载
			handdown:function(index){
				let url ='/system/oss/download/'+this.filelist[index].ossId
				this.comjs.downfile(url)
			},
			// 取消
			handlecancel:function(type){
				if(type =='1'){
					this.$refs.addForm.resetFields()
					this.addForm = {
						noticeTitle:'', //标题
						publishBy:'',// 作者
						describes:'',
						homeImageUrl:"url('../img/empty.png') no-repeat", //首图地址
						homeImage:'',
						visibility:'0', //可见范围
						publishType:'0', //发布类型
						displayStatus:'0', //展示状态
						publishStatus:'0', //发布状态
						publishSignTime:'', //发布时间
						noticeContent:'', //公告内容
						attachmentUrl:'', //附件地址
					}
					this.filelist = []
					this.adddialog = false
				}else{
					this.userdialog = false
				}
				
			},
			// 新增 保存
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
						if(this.gxuserlist.length>0){
							let arr =[]
							for(var j =0;j<this.gxuserlist.length;j++){
								arr.push(this.gxuserlist[j].userId)
							}
							this.addForm.visibility =arr.join(',')
						}else{
							this.addForm.visibility = '0'
						}
						let para = {
							noticeId:this.addForm.noticeId,
							noticeTitle:this.addForm.noticeTitle, //标题
							author:this.addForm.author,// 作者
							describes:this.addForm.describes, // 描述
							homeImage:this.addForm.homeImage, //首图地址
							visibility:this.addForm.visibility, //可见范围
							publishType:this.addForm.publishType, //发布类型
							displayStatus:this.addForm.displayStatus, //展示状态
							publishStatus:this.addForm.publishStatus, //发布状态
							publishSignTime:this.addForm.publishSignTime, //发布时间
							noticeContent:this.addForm.noticeContent, //公告内容
							attachmentUrl:attachmentUrl,
						}
						if(this.addForm.noticeId){
							UpdateNotice(para).then((res)=>{
								if(res.code =='200'){
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
								this.$refs.addForm.resetFields()
								this.adddialog = false
								this.getlist(1)
							})
						}else{
							AddNotice(para).then((res)=>{
								if(res.code =='200'){
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
								this.$refs.addForm.resetFields()
								this.adddialog = false
								this.getlist(1)
							})
						}
						
					}
				})
				
			},
			// 查阅情况
			handlerefer:function(row){
				this.cydialog = true
				this.getcyqk(row.noticeId)
				this.noticeId = row.noticeId
			},
			// 查阅情况列表
			getcyqk:function(id){
				NoticerReadfo(id).then((res)=>{
					let readInfoEleVoList = res.data.data.readInfoEleVoList
					let unReadInfoEleVoList = res.data.data.unReadInfoEleVoList
					this.referlist = []
					if(this.current == '0'){
						this.referlist = readInfoEleVoList
					}else{
						this.referlist = unReadInfoEleVoList
						
					}
				})
			},
			// 阅读状态切换
			handleread:function(index){
				this.current = index
				this.getcyqk(this.noticeId)
			},
			
			// 删除文件
			handdelfile:function(index){
				this.filelist.splice(index,1)
			},
			// 选择
			handlechoose:function(){
				this.userdialog = true
				if(this.choosetype =='0'){
					this.gxuserlist = []
					this.gxlist = []
					
				}else if(this.choosetype =='1'){
					this.defaultChecked = this.defaultChecked
				}
			},
			// 勾选人员
			handleSelectionChange:function(val){
				if(this.choosetype !== '1'){
					this.multipleSelection = val
					this.gxlist = this.multipleSelection
					this.gxuserlist = this.gxlist
				}
			},
			
			// 人员弹窗确定
			handleuser:function(){
				this.userdialog = false
				this.gxuserlist = this.gxlist
				this.choosetype ='1'
			},
			// 部门树
			gettree:function(){
				NSelectDeptUserTree().then((res)=>{
					console.log(res.data.data);
					this.treeData = res.data.data
				})
			},
			// 勾选树
			handleCheckChange(data, checked, indeterminate) {
				let arr = this.$refs.roletree.getCheckedNodes()
				console.log(arr);
				this.gxlist = []
				for(var i=0; i<arr.length;i++){
					if(arr[i].id.indexOf('user') == 0){
						this.gxlist.push({
							userName:arr[i].label,
							userId:arr[i].id.slice('4')
						})
						this.defaultChecked.push(arr[i].id)
					}
				}
				console.log(this.defaultChecked);
			},
			// 点击树状
			handleClick:function(data,node) {
				console.log(data,'10100')
				console.log(node,'nodenodenode')
			},
			// 删除图片
			handlesyimg:function(){
				this.addForm.homeImageUrl = require("@/assets/img/empty.png")
				this.addForm.homeImage = ''
				this.editflag = false
				// 更新key，强制el-form-item 重新渲染
				this.formItemKey+=1
			}
			
		}
	}
</script>
<style>
</style>