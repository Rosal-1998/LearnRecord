<template>
	<div class="g-cont">
		<div class="m-contain">
			<div class="m-search" style="float: left;">
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
					<div class="search-btnbox">
						<span class="btn search-btn" @click="getlist(1)">查询</span>
						<span class="btn reset-btn" @click="resetForm('filters')">重置</span>
					</div>
				</el-form>
			</div>
			<div class="operate-btn">
				<span class="btn export-btn" @click="handleexport">导出</span>
			</div>
			<div class="m-table">
				<el-table :data="datalist" highlight-current-row v-loading="listLoading" style="width: 100%;"
					border :row-class-name="tableRowClassName" :header-cell-style="{'text-align':'center'}"
				:cell-style="{'text-align':'center'}"  @selection-change="handlegx">
					<el-table-column label="" type="selection" width="80">
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
					<el-table-column label="认证通过时间" prop="authTime">
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
		<el-dialog :visible.sync="xqdialog" v-if="xqdialog" class="g-dialog" title="屋主详情">
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
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { HomeAuthList,HomeAuthDt } from '../../api/api.js'
	import moment from 'moment'
	export default {
		data(){
			return{
				filters:{
					name:'',
					roomNo:'',
					homeownerPhone:'',
					homeownerName:'',
					time:[],
					startAuthTime:'',
					endAuthTime:'',
					authStatusType:'0',
					size:10,
					current:1
				},
				datalist:[],
				listLoading:false,
				total:0,
				currentPage:1,
				currentPage1:1,
				pagesize:10,
				multion:[],
				xqdialog:false,
				detailfrom:{},
				piclist:[],
				recordlist:[],
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
				if(val){
					para.pageNum = val
					this.currentPage1 = val
				}
				HomeAuthList(para).then((res)=>{
					this.datalist = res.data.rows
					this.total = res.data.total
				})
			},
			// 重置
			resetForm:function(filters){
				this.$refs.filters.resetFields()
				this.filters ={
					name:'',
					roomNo:'',
					homeownerPhone:'',
					homeownerName:'',
					time:[],
					startAuthTime:'',
					endAuthTime:'',
					authStatusType:'0',
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
			// 勾选
			handlegx:function(data){
				this.multion = []
				for(var i=0;i<data.length;i++){
					this.multion.push(data[i].homeownerAuthId)
				}
			},
			
			// 导出
			handleexport:function(){
				if(this.multion.length>0){
					let url = '/ren/homeownerAuth/exportById/'+this.multion.join(',')
					this.comjs.downfile(url)
				}else{
					this.$message({
						message:'请至少勾选一条数据',
						type:'info'
					})
				}
				
			},
			// 详情
			handleDetail:function(row){
				this.xqdialog = true
				this.getDetail(row.homeownerAuthId)
			},
			getDetail:function(id){
				HomeAuthDt(id).then((res)=>{
					console.log(res.data,'xq')
					this.detailfrom = res.data.data
					this.recordlist = res.data.data.rentAuthLogVos
					let ownershipCertUrl = res.data.data.ownershipCertUrl
					this.piclist = []
					if(ownershipCertUrl != null && ownershipCertUrl != ''&& ownershipCertUrl.length>0){
						this.piclist = ownershipCertUrl.split(',')
						console.log(this.piclist,'this.piclistthis.piclist')
					}
				})
			}
		}
	}
</script>

<style>
</style>