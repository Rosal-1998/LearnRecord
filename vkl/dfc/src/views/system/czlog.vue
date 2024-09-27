<template>
	<div class="g-cont">
		<div class="m-contain">
			<div class="m-search" style="float: left;">
				<el-form :model="filters" :inline="true" ref="filters">
					<el-form-item label="系统模块" prop="title" >
						<el-input v-model="filters.title" placeholder="系统模块"></el-input>
					</el-form-item>
					<el-form-item label="操作人员" prop="operName" class="ipt150">
						<el-input v-model="filters.operName" placeholder="操作人员"></el-input>
					</el-form-item>
					<el-form-item label="类型" prop="businessType">
						<el-select v-model="filters.businessType" placeholder="类型">
							<el-option v-for="(item,index) in businessTypelist" :value="item.dictValue" :label="item.dictLabel" :key="index"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="状态" prop="status">
						<el-select v-model="filters.status" placeholder="状态">
							<el-option value="0" label="正常"></el-option>
							<el-option value="1" label="异常"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="操作时间" prop="time">
						<el-date-picker v-model="filters.time" type="daterange" start-placeholder="年-月-日" end-placeholder="年-月-日"></el-date-picker>
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
					<el-table-column label="日志编号" prop="operId" width="200">
					</el-table-column>
					<el-table-column label="系统模块" prop="title">
					</el-table-column>
					<el-table-column label="操作类型" prop="businessType" :formatter="bustypeformat">
					</el-table-column>
					<el-table-column label="请求方式" prop="requestMethod">
					</el-table-column>
					<el-table-column label="操作人员" prop="operName">
					</el-table-column>
					<el-table-column label="操作地址" prop="operIp">
					</el-table-column>
					<el-table-column label="操作地点" prop="operLocation">
					</el-table-column>
					<el-table-column label="操作状态" prop="status">
						<template slot-scope="scope">
							<span v-if="scope.row.status =='0'" class="f-green">正常</span>
							<span v-else-if="scope.row.status =='1'" class="f-red">异常</span>
							<span v-else=""></span>
						</template>
					</el-table-column>
					<el-table-column label="操作日期" prop="operTime"  width="160">
					</el-table-column>
					<!-- <el-table-column label="操作" prop="">
						<template slot-scope="scope">
							<span class="detail-title" @click="handleDetail(scope.row)">详情</span>
						</template>
					</el-table-column> -->
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
		<el-dialog :visible.sync="xqdialog" v-if="xqdialog" class="g-dialog" title="操作日志详情">
			<div class="xc-cont">
			</div>
		</el-dialog>
		
	</div>
</template>

<script>
	import { OperlogList,OperlogExport,DelOperlog,DictType } from '../../api/api.js'
	import moment from 'moment'
	export default {
		data(){
			return{
				filters:{
					title:'',
					operName:'',
					businessType:'',
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
				xqdialog:false,
				detailform:{},
				businessTypelist:[],
			}
		},
		mounted(){
			this.getlist('')
			this.getdict('sys_oper_type')
		},
		methods:{
			// 字典
			getdict:function(type){
				let para = type
				DictType(para).then((res)=>{
					if(type =='sys_oper_type'){
						this.businessTypelist = res.data.data
					}else{
						
					}
				})
			},
			// 转换
			bustypeformat:function(row,column){
				for(var i=0;i<this.businessTypelist.length;i++){
					if(row.businessType == this.businessTypelist[i].dictValue){
						return this.businessTypelist[i].dictLabel
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
					this.filters.beginTime = moment(this.filters.time[0]).format('yyyy-MM-DD')
					this.filters.endTime = moment(this.filters.time[1]).format('yyyy-MM-DD')
				}else{
					this.filters.beginTime = ''
					this.filters.endTime = ''
				}
				let para ={
					title:this.filters.title,
					operName:this.filters.operName,
					businessType:this.filters.businessType,
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
				OperlogList(para).then((res)=>{
					this.datalist = res.data.rows
					this.total = res.data.total
				})
			},
			// 重置
			resetForm:function(filters){
				this.$refs['filters'].resetFields();

				this.filters ={
					title:'',
					operName:'',
					businessType:'',
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
			// 详情
			handleDetail:function(row){
				this.xqdialog = true
				
			},
			// 勾选
			handlegx:function(data){
				// console.log(data,'00101')
				this.multion = []
				for(var i=0;i<data.length;i++){
					this.multion.push(data[i].operId)
				}
			},
			// 批量删除
			handlepldel:function(){
				if(this.multion.length>0){
					let para = this.multion.join(',')
					DelOperlog(para).then((res)=>{
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
				if (this.multion.length <= 0) {
					this.$message({
						message: '至少勾选一条数据',
						type: 'error'
					})
				} else {
					const operIds = this.multion.join(',')
					let url = '/monitor/operlog/export?operIds='+ operIds
					this.comjs.downfile(url)
				}
			}
		}
	}
</script>

<style>
</style>