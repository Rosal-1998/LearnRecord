<template>
	<div class="g-cont">
		<div class="m-contain">
			<span class="btn export-btn" @click="handlexport">导出</span>
			<el-form :model="filters" :inline="true" class="m-search" ref="filters">
				<el-form-item label="姓名" prop="userName">
					<el-input v-model="filters.userName" placeholder="输入姓名"></el-input>
				</el-form-item>
				<el-form-item label="打卡位置" prop="signinLocation">
					<el-input v-model="filters.signinLocation" placeholder="打卡位置"></el-input>
				</el-form-item>
				<el-form-item label="打卡时间">
					<el-date-picker v-model="filters.time" type="daterange" start-placeholder="年-月-日" end-placeholder="年-月-日" range-separator="至"></el-date-picker>
				</el-form-item>
				<div class="search-btnbox">
					<span class="btn search-btn" @click="getlist(1)">查询</span>
					<span class="btn reset-btn" @click="resetForm('filters')">重置</span>
				</div>
			</el-form>
			<div class="m-table">
				<el-table :data="datalist" highlight-current-row v-loading="listLoading" style="width: 100%;" :row-class-name="tableRowClassName" :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}"  @selection-change="handleSelectionChange">
					<el-table-column label="全选" type="selection">
					</el-table-column>
					<el-table-column label="序号" type="index" width="80">
					</el-table-column>
					<el-table-column label="姓名" prop="userName">
					</el-table-column>
					<el-table-column label="打卡前照片" prop="">
						<template slot-scope="scope">
							<img :src="scope.row.signinPhotoFile" class="news-img">
						</template>
					</el-table-column>
					<el-table-column label="打卡前时间" prop="signinTime">
					</el-table-column>
					<el-table-column label="打卡前位置" prop="signinLocation" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column label="打卡后照片" prop="">
						<template slot-scope="scope">
							<img :src="scope.row.signoutPhotoFile" class="news-img">
						</template>
					</el-table-column>
					<el-table-column label="打卡后时间" prop="signoutTime">
					</el-table-column>
					<el-table-column label="打卡后位置" prop="signoutLocation" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column label="操作" prop="">
						<template slot-scope="scope">
							<span class="detail-title" @click="handleDetail(scope.row)">查看&nbsp;&nbsp;</span>
							<el-popover :ref="scope.row.id" placement="top" width="160" popper-class="popover">
								<p class="del-tip">是否删除该人员打卡信息？</p>
								<div class="pop-btnbox">
									<span class="cancel-btn" @click="visibleDelCancel(scope.row.id)">取消</span>
									<span class="ok-btn" @click="visibleDelSubmit(scope.row.id)">确定</span>
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
		<!-- 详情 -->
		<el-dialog :visible.sync="xqdialog" v-if="xqdialog" class="g-dialog min-dia642" title="查看工作打卡">
			<div class="xq-content work-cont">
				<div class="xq-lst" style="width: 100%;">
					<span class="name">姓名</span>
					<span class="lab">{{detailform.userName}}</span>
				</div>
				<div class="xq-lst">
					<span class="name">打卡前时间</span>
					<span class="lab" style="width: auto;">{{detailform.signinTime}}</span>
				</div>
				<div class="xq-lst">
					<span class="name">打卡后时间</span>
					<span class="lab" style="width: auto;">{{detailform.signoutTime}}</span>
				</div>
				<div class="xq-lst">
					<span class="name">打卡前照片</span>
					<img :src="detailform.signinPhotoFile" class="dkzp">
				</div>
				<div class="xq-lst">
					<span class="name">打卡后照片</span>
					<img :src="detailform.signoutPhotoFile" class="dkzp">
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { UserSignList, DelUserSign ,UserSignfindById } from '../../api/api.js'
	import moment from 'moment'
	
	export default {
		data(){
			return{
				filters:{
					userName:'',
					signinLocation:'',
					time:[],
					startDate:'',
					endDate:'',
					current:1,
					size:10,
				},
				datalist:[],
				listLoading:false,
				total:0,
				currentPage:1,
				currentPage1:1,
				pagesize:10,
				xqdialog:false,
				detailform:{},
				multion:[],
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
					this.filters.startDate = moment(this.filters.time[0]).format('yyyy-MM-DD')
					this.filters.endDate = moment(this.filters.time[1]).format('yyyy-MM-DD')
				}else{
					this.filters.startDate = ''
					this.filters.endDate = ''
				}
				let para = {
					userName:this.filters.userName,
					signinLocation:this.filters.signinLocation,
					startDate:this.filters.startDate,
					endDate:this.filters.endDate,
					pageNum:this.filters.current,
					pageSize:this.filters.size,
				}
				if(val){
					para.pageNum = val
					this.currentPage1 = val
				}
				UserSignList(para).then((res)=>{
					this.datalist = res.data.rows
					this.total = res.data.total
				})
			},
			// 重置
			resetForm:function(filters){
				this.$refs.filters.resetFields()
				this.filters = {
					userName:'',
					signinLocation:'',
					time:[],
					startDate:'',
					endDate:'',
					current:1,
					size:10,
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
			
			// 删除 取消
			visibleDelCancel(id) {
				this.$refs[id].doClose()
			},
			// 删除确认
			visibleDelSubmit(id) { 
				DelUserSign(id).then((res)=>{
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
			// 详情
			handleDetail:function(row){
				this.xqdialog = true
				this.getDetail(row)
			},
			// 详情
			getDetail:function(row){
				UserSignfindById(row.id).then((res)=>{
					this.detailform = res.data.data
				})
			},
			// 勾选
			handleSelectionChange:function(data){
				for(var i=0;i<data.length;i++){
					this.multion.push(data[i].id)
				}
			},
			// 导出
			handlexport:function(){
				if(this.multion.length>0){
					if(this.filters.time && this.filters.time.length>0){
						this.filters.startDate = moment(this.filters.time[0]).format('yyyy-MM-dd')
						this.filters.endDate = moment(this.filters.time[1]).format('yyyy-MM-dd')
					}else{
						this.filters.startDate = ''
						this.filters.endDate = ''
					}
					let url = 'system/userSign/export?userName='+this.filters.userName+'&startDate='+this.filters.startDate+'&endDate='+this.filters.endDate+'&signinLocation='+this.filters.signinLocation+'&ids='+this.multion.join(',')
					this.comjs.downfile(url) 
				}else{
					this.$message({
						message:'至少勾选一条数据',
						type:'info'
					})
				}
				
			}
			
		}
	}
</script>

<style>
</style>