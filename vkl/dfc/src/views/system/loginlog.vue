<template>
	<div class="g-cont">
		<div class="m-contain">
			<div class="m-search" style="float: left;">
				<el-form :model="filters" :inline="true" ref="filters">
					<el-form-item label="登录地址" prop="ipaddr">
						<el-input v-model="filters.ipaddr" placeholder="登录地址"></el-input>
					</el-form-item>
					<el-form-item label="用户名称" prop="userName" class="ipt150">
						<el-input v-model="filters.userName" placeholder="用户名称"></el-input>
					</el-form-item>
					<el-form-item label="状态" prop="status">
						<el-select v-model="filters.status">
							<el-option value="0" label="正常"></el-option>
							<el-option value="1" label="异常"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="登录时间" prop="time">
						<el-date-picker v-model="filters.time" type="daterange" start-placeholder="年/月/日" end-placeholder="年/月/日"></el-date-picker>
					</el-form-item>
					<div class="search-btnbox">
						<span class="btn search-btn" @click="getlist(1)">查询</span>
						<span class="btn reset-btn" @click="resetForm('filters')">重置</span>
					</div>
				</el-form>
			</div>
			<div class="operate-btn">
				<span class="btn del-btn" @click="handlepldel">删除</span>
				<span class="btn export-btn" @click="handleexport">导出</span>
			</div>
			<div class="m-table">
				<el-table :data="datalist" highlight-current-row v-loading="listLoading" style="width: 100%;"
					border :row-class-name="tableRowClassName" :header-cell-style="{'text-align':'center'}"
				:cell-style="{'text-align':'center'}"  @selection-change="handlegx">
					<el-table-column label="" type="selection" width="80">
					</el-table-column>
					<el-table-column label="访问编号" prop="infoId" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column label="用户名称" prop="userName">
					</el-table-column>
					<el-table-column label="登录地址" prop="ipaddr">
					</el-table-column>
					<el-table-column label="登录地点" prop="loginLocation" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column label="浏览器" prop="browser">
					</el-table-column>
					<el-table-column label="操作系统" prop="os" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column label="登录状态" prop="">
						<template slot-scope="scope">
							<span v-if="scope.row.status =='0'" class="f-green">正常</span>
							<span v-else-if="scope.row.status =='1'" class="f-red">异常</span>
							<span v-else=""></span>
						</template>
					</el-table-column>
					<el-table-column label="操作信息" prop="msg">
					</el-table-column>
					<el-table-column label="登录日期" prop="loginTime">
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
		
	</div>
</template>

<script>
	import { LoginlogList,LoginlogExport,DelLoginlog } from '../../api/api.js'


	import moment from 'moment'
	export default {
		data(){
			return{
				filters:{
					ipaddr:'',
					userName:'',
					status:'',
					time:[],
					beginTime:'',
					endTime:'',
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
					this.filters.beginTime = moment(this.filters.time[0]).format('yyyy-MM-DD')
					this.filters.endTime = moment(this.filters.time[1]).format('yyyy-MM-DD')
				}else{
					this.filters.beginTime = ''
					this.filters.endTime = ''
				}
				let para ={
					ipaddr:this.filters.ipaddr,
					userName:this.filters.userName,
					status:this.filters.status,
					beginTime:this.filters.beginTime,
					endTime:this.filters.endTime,
					pageSize:this.filters.size,
					pageNum:this.filters.current
				}
				if(val){
					para.pageNum = val
					this.currentPage1 = val
				}
				LoginlogList(para).then((res)=>{
					this.datalist = res.data.rows
					this.total = res.data.total
				})
			},
			// 重置
			resetForm:function(filters){
				this.$refs.filters.resetFields()
				this.filters ={
					ipaddr:'',
					userName:'',
					status:'',
					time:[],
					beginTime:'',
					endTime:'',
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
				console.log(data,'00101')
				this.multion = []
				for(var i=0;i<data.length;i++){
					this.multion.push(data[i].infoId)
				}
			},
			// 批量删除
			handlepldel:function(){
				if(this.multion.length>0){
					let para = this.multion.join(',')
					DelLoginlog(para).then((res)=>{
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
						this.getlist(1)
					})
				}else{
					this.$message({
						message:'至少勾选一条数据'
					})
				}
			},
			
			// 导出
			handleexport:function(){
				if(this.multion.length>0){
					let url = '/monitor/logininfor/exportByIds/'+ this.multion.join(',')
					this.comjs.downfile(url)
				}else{
					this.$message({
						message:'至少勾选一条数据'
					})
				}
				
			}
		}
	}
</script>

<style>
</style>