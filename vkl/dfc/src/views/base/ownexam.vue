<template>
	<div class="g-cont">
		<div class="g-ltside">
			<div class="tab-ul">
				<div :class="['tab-lst',{'active':current == 0}]" @click="handletab('0')">待审核</div>
				<div :class="['tab-lst',{'active':current == 1}]" @click="handletab('1')">已审核</div>
			</div>
		</div>
		<div class="g-rtside">
			<div class="m-search">
				<el-form :model="filters" :inline="true" ref="filters" >
					<el-form-item label="房屋" prop="name" class="ipt150">
						<el-input v-model="filters.name" placeholder="房屋"></el-input>
					</el-form-item>
					<el-form-item label="房间号" prop="roomNo" class="ipt150">
						<el-input v-model="filters.roomNo" placeholder="房间号"></el-input>
					</el-form-item>
					<el-form-item label="联系电话" prop="homeownerPhone" class="ipt150">
						<el-input v-model="filters.homeownerPhone" placeholder="联系电话"></el-input>
					</el-form-item>
					<el-form-item label="屋主" prop="homeownerName" class="ipt150">
						<el-input v-model="filters.homeownerName" placeholder="屋主"></el-input>
					</el-form-item>
					<el-form-item label="认证通过时间" prop="time">
						<el-date-picker v-model="filters.time" type="daterange" start-placeholder="年-月-日" end-placeholder="年-月-日"></el-date-picker>
					</el-form-item>
					<div class="search-btnbox" style="margin-left: 0;margin-bottom: 0.08333rem;">
						<span class="btn search-btn" @click="getlist(1)">查询</span>
						<span class="btn reset-btn" @click="resetForm('filters')">重置</span>
					</div>
					<span class="auto-btn">自动审核：
						<el-switch v-model="value"  active-color="#13ce66" inactive-color="#ff4949"  @change="handleAutsh"></el-switch>
					</span>
				</el-form>
			</div>
			<div class="m-table">
				<el-table :data="datalist" highlight-current-row v-loading="listLoading" style="width: 100%;"
					border :row-class-name="tableRowClassName" :header-cell-style="{'text-align':'center'}"
				:cell-style="{'text-align':'center'}">
					<el-table-column type="selection" width="80">
					</el-table-column>
					<el-table-column label="房屋名称" prop="name">
					</el-table-column>
					<el-table-column label="房间号" prop="roomNo">
					</el-table-column>
					<el-table-column label="屋主" prop="homeownerName">
					</el-table-column>
					<el-table-column label="联系电话" prop="homeownerPhone">
					</el-table-column>
					<el-table-column label="提交人" prop="nickName">
					</el-table-column>
					<el-table-column label="审核状态" prop="">
						<template slot-scope="scope">
							<span  class="f-blue" v-if="scope.row.authStatus =='0'">待审核</span>
							<span class="f-green" v-else-if="scope.row.authStatus =='1'">审核通过</span>
							<span class="f-red" v-else-if="scope.row.authStatus =='2'">审核失败</span>
							<span v-else="">/</span>
						</template>
					</el-table-column>
					<el-table-column label="提交认证时间" prop="authSubmitTime" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column label="操作" prop="" width="200">
						<template slot-scope="scope">
							<div v-if="current == '0'">
								<span class="edit-title" @click="handldetail(scope.row)">审核</span>
							</div>
							<div v-if="current == '1'">
								<span class="edit-title" @click="handldetail(scope.row)">重新审核</span>
							</div>
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
		<!-- 详情 -->
		<el-dialog :visible.sync="xqdialog" v-if="xqdialog" class="g-dialog" title="屋主审核">
			<div class="addbox">
				<div class="lt">
					<div class="xq-content event-detail">
						<div class="xq-lst">
							<span class="name">房屋名称</span>
							<span class="lab">{{detailfrom.houseName}}</span>
						</div>
						<div class="xq-lst">
							<span class="name">楼层</span>
							<span class="lab">{{detailfrom.floors}}</span>
						</div>
						<div class="xq-lst">
							<span class="name">房间编号</span>
							<span class="lab">{{detailfrom.roomNo}}</span>
						</div>
						<div class="xq-lst">
							<span class="name">房间面积</span>
							<span class="lab">{{detailfrom.area}}</span>
						</div>
						<div class="xq-lst">
							<span class="name">性质</span>
							<span class="lab">{{detailfrom.nature}}</span>
						</div>
						<div class="xq-lst">
							<span class="name">屋主</span>
							<span class="lab">{{detailfrom.homeownerName}}</span>
						</div>
						<div class="xq-lst">
							<span class="name">联系电话</span>
							<span class="lab">{{detailfrom.homeownerPhone}}</span>
						</div>
						<div class="xq-lst">
							<span class="name">房屋产权证明或其他</span>
							<ul class="picul" v-if="piclist.length>0" >
								<li class="pic-lst" v-for="(item,index) in piclist">
									<img :src="item" class="img">
								</li>
							</ul>
						</div>
					</div>
					
				</div>
				<div class="editbox">
					<span class="edit-tip">认证日志</span>
					<ul class="record-box">
						<li class="record-lst" v-for="(item,index) in recordlist">
							<i class="line"></i>
							<span class="dot"></span>
							<div class="rec-rt">
								<span class="button">{{item.activityName}}</span>
								<div class="inf"><img :src="item.userAvatar" class="avater">{{item.username}}</div>
								<div class="bbh" v-if="item.message != null">审核说明：{{item.message}}</div>
								<span class="bbh">{{item.finishTime}}</span>
							</div>
						</li>
					</ul>
				</div>
				<div class="dialog-foot">
					<span class="btn-cancel" @click="handlevent('2')">不通过</span>
					<span class="btn-save" @click="handlevent('1')">通过</span>
				</div>
			</div>
		</el-dialog>
		<!-- 意见框 -->
		<el-dialog :visible.sync="yjdialog" v-if="yjdialog" class="g-dialog min-dia642" title="租赁审核">
			<el-form :model="yjForm" :inline="true" ref="yjForm" :rules="yjFormRules" class="addform add-signcent">
				<el-form-item label="审核说明" prop="evtDescription">
					<el-input type="textarea" v-model="yjForm.comment" placeholder="请输入审核说明"></el-input>
				</el-form-item>
			</el-form>
			<div class="dialog-foot">
				<span class="btn-cancel" @click="yjclose">取消</span>
				<span class="btn-save" v-if="yjjdtype =='1'" @click="handlesubmit('1')">通过</span>
				<span class="btn-save" v-if="yjjdtype =='2'" @click="handlesubmit('2')">不通过</span>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { HomeAuthList,HomeAuthDt,UpdateHomeAuth, AutshHomeAuth,EditAutshHome} from '../../api/api.js'
	import axios from 'axios'
	import qs from 'qs'
	import moment from 'moment'
	
	export default {
		data(){
			return{
				current:'0',
				filters:{
					name:'',
					roomNo:'',
					homeownerPhone:'',
					homeownerName:'',
					time:[],
					startAuthTime:'',
					endAuthTime:'',
					authStatusType:'-1',
					size:10,
					current:1,
				},
				datalist:[],
				listLoading:false,
				total:0,
				currentPage:1,
				currentPage1:1,
				pagesize:10,
				xqdialog :false,
				xqtitle:'',
				detailfrom:{},
				recordlist:[],
				xqdialog:false,
				piclist:[],
				yjdialog:false,
				yjForm:{},
				yjFormRules:{},
				rentAuthId:'',
				value:'',
			}
		},
		mounted(){
			this.handlecxstatus()
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
				if(this.filters.time && this.filters.time.length>0){
					this.filters.startAuthTime = moment(this.filters.time[0]).format('yyyy-MM-DD')
					this.filters.endAuthTime = moment(this.filters.time[1]).format('yyyy-MM-DD')
				}else{
					this.filters.startAuthTime = ''
					this.filters.endAuthTime = ''
				}
				let para ={
					name:this.filters.name,
					roomNo:this.filters.roomNo,
					homeownerPhone:this.filters.homeownerPhone,
					homeownerName:this.filters.homeownerName,
					startAuthTime:this.filters.startAuthTime,
					endAuthTime:this.filters.endAuthTime,
					authStatusType:this.filters.authStatusType,
					pageSize:this.filters.size,
					pageNum:this.filters.current
				}
				HomeAuthList(para).then((res)=>{
					this.datalist = res.data.rows
					this.total = res.data.total
				})
				
			},
			// 重置
			resetForm:function(filters){
				let lastAuthStatusType = this.filters.authStatusType
				this.$refs.filters.resetFields();
				this.filters = {
					name:'',
					roomNo:'',
					homeownerPhone:'',
					homeownerName:'',
					time:[],
					startAuthTime:'',
					endAuthTime:'',
					authStatusType:lastAuthStatusType,
					size:10,
					current:1,
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
			   if(this.current === '0'){
				this.filters.authStatusType = -1; //待审核
			   }else if(this.current === '1'){
				this.filters.authStatusType = 1; //已审核
			   }
			   this.getlist(val);
			},
			// 切换
			handletab:function(type){
				this.current = type
				
				this.$refs.filters.resetFields();
				this.filters = {
					name:'',
					roomNo:'',
					homeownerPhone:'',
					homeownerName:'',
					time:[],
					startAuthTime:'',
					endAuthTime:'',
					authStatusType:'',
					size:10,
					current:1,
				}
				if(type =='0'){
					this.filters.authStatusType = -1
				}else{
					this.filters.authStatusType = 1
				}
				this.getlist(1)
			},
			// 查看详情
			handldetail:function(row){
				this.xqdialog = true
				this.getdetail(row.homeownerAuthId)
				this.rentAuthId = row.homeownerAuthId
			},
			// 详情
			getdetail:function(id){
				HomeAuthDt(id).then((res)=>{
					console.log(res.data,'xq')
					this.detailfrom = res.data.data
					this.recordlist = res.data.data.rentAuthLogVos
					let ownershipCertUrl = res.data.data.ownershipCertUrl
					this.piclist = []
					if(ownershipCertUrl != null && ownershipCertUrl != ''&& ownershipCertUrl.length>0){
						this.piclist = ownershipCertUrl.split(',')
					}
					
				})
			},
			
			// 意见弹窗关闭
			yjclose:function(){
				this.yjForm = {
					comment:'',
				}
				this.yjdialog = false
			},
			// 操作按钮
			handlevent:function(type){
				this.yjdialog = true
				this.yjForm = {
					comment:'',
				}
				this.yjjdtype = type
			},
			// 事件处理操作
			handlesubmit:function(type){
				let para = {
					rentAuthId:this.rentAuthId,
					message:this.yjForm.comment, //意见
					authResult:type
				}
				UpdateHomeAuth(para).then((res)=>{
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
					this.yjdialog = false
					this.xqdialog = false
					this.getlist(1)
				})
			},
			// 自动审核
			handlecxstatus:function(){
				AutshHomeAuth().then((res)=>{
					console.log(res.data,'0001')
					this.value = JSON.parse(res.data)
					console.log(this.value,'this.value')
				})
			},
			
			// 自动审核
			handleAutsh:function(value){
				this.value = value
				let val
				if(value == true){
					val = false
				}else{
					val = true
				}
				let para = val
				EditAutshHome(para).then((res)=>{
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
					this.handlecxstatus()
					this.getlist(1)
				})
			},
			
		}
	}
</script>
