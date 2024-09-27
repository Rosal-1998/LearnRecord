<template>
	<div class="g-cont">
		<div class="m-contain">
			<span class="btn add-btn" @click="handleAdd">新增</span>
			<div class="m-search">
				<el-form :inline="true" :model="filters" ref="filters" id="filters">
					<el-form-item label="人员姓名:" prop="name">
						<el-input v-model="filters.name" placeholder="请输入人员姓名"></el-input>
					</el-form-item>
					<el-form-item label="账号:" prop="account">
						<el-input v-model="filters.account" placeholder="请输入账号"></el-input>
					</el-form-item>
					<el-form-item label="电话:" prop="phone">
						<el-input v-model="filters.phone" placeholder="请输入电话"></el-input>
					</el-form-item>
					<el-form-item label="部门" prop="deptId" >
						<treeselect v-model="filters.deptId" :options="deptOptions" :normalizer="normalizer" placeholder="请选择部门" @select="changedepat($event,'0')" style="width: 200px;"/>
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
					<el-table-column type="index" label="序号" width="80">
					</el-table-column>
					<el-table-column prop="account" label="人员账号">
					</el-table-column>
					<el-table-column prop="name" label="人员姓名">
					</el-table-column>
					<el-table-column prop="deptName" label="部门">
					</el-table-column>
					<el-table-column prop="idCard" label="身份证号">
					</el-table-column>
					<el-table-column prop="phone" label="电话">
					</el-table-column>
					<el-table-column prop="roleName	" label="角色">
					</el-table-column>
					<el-table-column prop="" label="人员状态">
						<template slot-scope="scope">
							<div class="ztbox" v-if="scope.row.status == '1'" @click="handleststatus(scope.row,'2')">正常</div>
							<div class="ztbox" v-else-if="scope.row.status == '2'"  @click="handleststatus(scope.row,'1')">禁用</div>
							<div class="ztbox" v-else="">/</div>
						</template>
					</el-table-column>
					<el-table-column prop="" label="操作">
						<template slot-scope="scope">
							<span class="edit-title" @click="handlEdit(scope.row)">编辑</span>&nbsp;&nbsp;
							<span class="del-title" @click="handleDel(scope.row)">删除</span>
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
		<el-dialog :visible.sync="adddialog" v-if="adddialog" class="g-dialog dia-wt642" :title="diatitle">
			<div class="dia-contont">
				<div class="dia-cont">
					<el-form :model="addForm" :inline="true" class="addform" ref="addForm" :rules="addFormRules">
						<el-form-item label="人员账号" prop="account">
							<el-input v-model="addForm.account" placeholder="请输入人员账号"></el-input>
						</el-form-item>
						<el-form-item label="人员姓名" prop="name">
							<el-input v-model="addForm.name" placeholder="请输入人员姓名"></el-input>
						</el-form-item>
						<el-form-item label="身份证号" prop="idCard">
							<el-input v-model="addForm.idCard" placeholder="请输入身份证号"></el-input>
						</el-form-item>
						<el-form-item label="部门" prop="deptId">
							<treeselect v-model="addForm.deptId" :options="deptOptions" :normalizer="normalizer" placeholder="请选择部门" @select="changedepat($event,'1')"/>
						</el-form-item>
						<el-form-item label="电话" prop="phone">
							<el-input v-model="addForm.phone" placeholder="请输入电话"></el-input>
						</el-form-item>
						<el-form-item label="角色" prop="roleId">
							<el-select v-model="addForm.roleId" @change="changerole">
								<el-option v-for="(item,index) in rolelist" :label="item.name" :value="item.id" :key="index"></el-option>
							</el-select>
						</el-form-item>
						
					</el-form>
					<div class="dialog-foot">
						<span class="btn-cancel" @click="handleclose('0')">取消</span>
						<span class="btn-save" @click="handlesubmit">完成</span>
					</div>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	// import { UserPageList ,AddUserPage ,UpdateUserPage ,DelUserPage ,UserPagefindById,UpdStatusUserPage, UserRoleList,UserDeptList ,InitPassword} from '../../api/api.js'
	import qs from 'qs'
	import Treeselect from "@riophae/vue-treeselect";
	import '@riophae/vue-treeselect/dist/vue-treeselect.css'
	
	export default {
		components: {
			Treeselect
		},
		data() {
			return {
				filters: {
					account:'',
					deptId:null,
					deptName:'',
					name:'',
					phone:'',
					current:1,
					size:10,
				},
				datalist: [],
				listLoading: false,
				total:0,
				pagesize:10,
				currentPage:1,
				currentPage1:1,
				adddialog:true,
				addForm:{
					id:'',
					account:'',
					name:'',
					idCard:'',
					deptId:null,
					deptName:'',
					phone:'',
					roleId:'',
					roleName:'',
					status:'',
				},
				addFormRules:{
					account:[{ required: true, message: '请输入人员账号', trigger: 'blur' },],
					name:[{ required: true, message: '请输入人员姓名', trigger: 'blur' },],
					status:[{ required: true, message: '请选择人员状态', trigger: 'blur' },],
				},
				diatitle:'',
				editflag:false,
				rolelist:[],
				deptOptions:[],
				current:'',
			}
		},
		mounted(){
			// this.getlist('')
			// this.getrole()
			// this.getdept()
		},
		methods: {
			// 隔行颜色
			tableRowClassName: function(rowIndex) {
				if (rowIndex.rowIndex % 2 != 0) {
					return 'evenRow';
				}
				return 'oddRow';
			},
			// 角色列表
			getrole:function(){
				UserRoleList().then((res)=>{
					this.rolelist = res.data.data
				})
			},
			// 选择角色
			changerole:function(val){
				let item = this.rolelist.filter((obj)=>{
					return obj.id == val
				})
				this.addForm.roleName = item[0].name
			},
			// 部门列表
			getdept:function(){
				UserDeptList().then((res)=>{
					this.deptOptions = res.data.data
				})
			},
			// 转换树
			normalizer(node) {
				if(node.children==null||node.children=='null'){
				   delete node.children;
				}
			    return {
			        id: node.deptId,
			        label: node.deptName,
			        children: node.children
			    };
			},
			// 选择部门
			changedepat:function(node,type){
				if(type == '0'){
					this.filters.deptName = node.deptName
					this.filters.deptId = node.deptId
					console.log(this.filters.deptName,'this.filters.deptNamethis.filters.deptName')
				}else{
					this.addForm.deptId = node.deptId
					this.addForm.deptName = node.deptName
				}
			},
			// 获取列表
			getlist: function(val) {
				let para  = {
					account:this.filters.account,
					deptName:this.filters.deptName,
					name:this.filters.name,
					phone:this.filters.phone,
					current:this.filters.current,
					size:this.filters.size,
				}
				if(val){
					para.current = val
					this.currentPage = val
				}
				UserPageList(para).then((res)=>{
					this.datalist = res.data.data.records
					this.total = res.data.data.total
				})
			},
			// 重置
			resetForm: function(filters) {
				this.$refs.filters.resetFields()
				this.filters = {
					account:'',
					deptId:null,
					deptName:'',
					name:'',
					phone:'',
					current:1,
					size:10,
				}
				this.pagesize = 10
				this.currentPage = 1
				this.currentPage1 = 1
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
			// 新增
			handleAdd:function(){
				this.adddialog = true
				this.diatitle = '新增人员'
				this.current = ''
				this.editflag = false
				this.addForm = {
					id:'',
					account:'',
					name:'',
					idCard:'',
					deptId:null,
					deptName:'',
					phone:'',
					roleId:'',
					roleName:'',
					status:'',
				}
				
			},
			// 弹窗关闭
			handleclose:function(type){
				this.adddialog = false
			},
			// 修改状态
			handleststatus:function(row,type){
				let para ={
					id:row.id,
					status:type
				}
				UpdStatusUserPage(qs.stringify(para)).then((res)=>{
					console.log(res,'101001')
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
					this.getlist(1)
				})
			},
			// 选择账号状态
			handleradio:function(val){
				this.addForm.status = val
				this.current = val
			},
			// 重置密码
			handlerestpasd:function(){
				let para = {
					id:this.addForm.id
				}
				InitPassword(qs.stringify(para)).then((res)=>{
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
					this.$refs.addForm.resetFields()
					this.adddialog = false
					this.getlist(1)
				})
			},
			// 保存
			handlesubmit:function(){
				this.$refs.addForm.validate((valid)=>{
					if(valid){
						let para = {
							id:this.addForm.id,
							account:this.addForm.account,
							name:this.addForm.name,
							idCard:this.addForm.idCard,
							deptId:this.addForm.deptId,
							deptName:this.addForm.deptName,
							phone:this.addForm.phone,
							roleId:this.addForm.roleId,
							roleName:this.addForm.roleName,
							status:this.addForm.status,
						}
						if(this.addForm.id){
							UpdateUserPage(qs.stringify(para)).then((res)=>{
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
							})
						}else{
							AddUserPage(qs.stringify(para)).then((res)=>{
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
							})
						}
						this.$refs.addForm.resetFields()
						this.adddialog = false
						this.getlist(1)
					}
				})
			},
			// 编辑
			handlEdit:function(row){
				this.adddialog = true
				this.diatitle = '编辑人员'
				this.editflag = true
				this.getdetail(row.id)
			},
			// 详情
			getdetail(id){
				UserPagefindById(id).then((res)=>{
					console.log(res,'xo1')
					this.addForm = res.data.data
					this.current = this.addForm.status
				})
			},
			// 删除
			handleDel:function(row){
				DelUserPage(row.id).then((res)=>{
					if(res.data.code == '200'){
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
			}
		}
	}
</script>

<style>
</style>