<template>
	<div class="g-cont">
		<div class="m-contain">
			<div class="m-search">
				<el-form :model="filters" :inline="true" ref="filters">
					<el-form-item label="用户名" prop="userName">
						<el-input v-model="filters.userName" placeholder="用户名"></el-input>
					</el-form-item>
					<el-form-item label="IP地址" prop="ipaddr">
						<el-input v-model="filters.ipaddr" placeholder="IP地址"></el-input>
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
					<el-table-column label="部门名称" prop="deptName">
					</el-table-column>
					<el-table-column label="用户名称" prop="userName">
					</el-table-column>
					<el-table-column label="登录IP地址" prop="ipaddr">
					</el-table-column>
					<el-table-column label="登录地址" prop="loginLocation">
					</el-table-column>
					<el-table-column label="浏览器类型" prop="browser" >
					</el-table-column>
					<el-table-column label="操作系统" prop="os" :show-overflow-tooltip="true" >
					</el-table-column>
					<el-table-column label="登录时间" prop="loginTime">
					</el-table-column>
					<el-table-column label="操作" prop="">
						<template slot-scope="scope">
							<el-popover :ref="scope.row.tokenId" placement="top" width="160" popper-class="popover">
								<p class="del-tip">是否退出该用户吗？</p>
								<div class="pop-btnbox">
									<span class="cancel-btn" @click="visibleDelCancel(scope.row.tokenId)">取消</span>
									<span class="ok-btn" @click="visibleDelSubmit(scope.row.tokenId)">确定</span>
								</div>
								<span slot="reference" class="del-title">强退</span>
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
		
	</div>
</template>

<script>
	import axios from 'axios'
	import {OnlineList,DelOnline } from '../../api/api.js'
	export default {
		data(){
			return{
				filters:{
					ipaddr:'',
					userName:'',
					size:10,
					current:1
				},
				datalist:[],
				listLoading:false,
				total:0,
				currentPage:1,
				currentPage1:1,
				pagesize:10,
				
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
				let para = {
					ipaddr:this.filters.ipaddr,
					userName:this.filters.userName,
					pageSize:this.filters.size,
					pageNum:this.filters.current
				}
				if(val){
					para.pageNum = val
					this.currentPage1 = val
				}
				OnlineList(para).then((res)=>{
					this.datalist = res.data.rows
					this.total = res.data.total
				})
			},
			// 重置
			resetForm:function(filters){
				this.$refs.filters.resetFields()
				this.filters = {
					ipaddr:'',
					userName:'',
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
			// 删除 取消
			visibleDelCancel(id) {
			  this.$refs[id].doClose()
			},
			// 删除 确定
			visibleDelSubmit(id) {
				DelOnline(id).then((res)=>{
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
			
		}
	}
</script>

<style>
</style>