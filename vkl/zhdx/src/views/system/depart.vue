<template>
	<div class="g-cont">
		<div class="m-contain">
			<div class="m-search">
				<el-form :inline="true" :model="filters" ref="filters" id="filters">
					<el-form-item label="部门名称:" prop="deptName">
						<el-input v-model="filters.deptName" placeholder="请输入部门名称"></el-input>
					</el-form-item>
					<el-form-item label="状态:" prop="status">
						<el-select v-model="filters.status">
							<el-option label="正常" value="0"></el-option>
							<el-option label="停用" value="1"></el-option>
						</el-select>
					</el-form-item>
					<div class="search-btnbox">
						<span class="btn search-btn" @click="getlist(1)">查询</span>
						<span class="btn reset-btn" @click="resetForm('filters')">重置</span>
					</div>
				</el-form>
			</div>
			<div class="operate-btn">
				<span class="btn add-btn" @click="handleAdd"><i class="addicon"></i>新增</span>
			</div>
			<div class="m-table">
				<el-table v-loading="listLoading" style="width: 100%;" border v-if="refreshTable" :data="datalist"
					row-key="deptId" :default-expand-all="isExpandAll" :row-class-name="tableRowClassName"
					:tree-props="{children: 'children', hasChildren: 'hasChildren'}">
					<el-table-column prop="deptName" label="部门名称">
					</el-table-column>
					<el-table-column prop="orderNum" label="排序">
					</el-table-column>
					<el-table-column prop="" label="状态">
						<template slot-scope="scope">
							<span v-if="scope.row.status == '0'" class="f-green">正常</span>
							<span v-else-if="scope.row.status == '1'" class="f-red">停用</span>
							<span v-else="">/</span>
						</template>
					</el-table-column>
					<el-table-column prop="createTime" label="创建时间">
					</el-table-column>
					<el-table-column prop="" label="操作">
						<template slot-scope="scope">
							<span class="edit-title" @click="handlEdit(scope.row)">编辑&nbsp;&nbsp;</span>
							<el-popover :ref="scope.row.deptId" placement="top" width="160" popper-class="popover">
								<p class="del-tip">是否删除该部门信息？</p>
								<div class="pop-btnbox">
									<span class="cancel-btn" @click="visibleDelCancel(scope.row.deptId)">取消</span>
									<span class="ok-btn" @click="visibleDelSubmit(scope.row.deptId)">确定</span>
								</div>
								<span slot="reference" class="del-title">删除</span>
							</el-popover>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
		<!-- 新增、编辑 -->
		<el-dialog :visible.sync="adddialog" v-if="adddialog" class="m-dialog" :title="diatitle">
			<div class="dia-contont">
				<div class="dia-cont">
					<el-form :model="addForm" :inline="true" class="formbox" ref="addForm" :rules="addFormRules">
						<el-form-item label="上级部门" prop="parentId">
							<treeselect v-model="addForm.parentId" :options="deptOptions" @input="parentIdchange" :normalizer="normalizer" placeholder="请选择上级部门" @select="changedepat"/>
						</el-form-item>
						<el-form-item label="部门名称" prop="deptName">
							<el-input v-model="addForm.deptName" placeholder="请输入部门名称"></el-input>
						</el-form-item>
						<el-form-item label="负责人" prop="leader">
							<el-input v-model="addForm.leader" placeholder="请输入负责人"></el-input>
						</el-form-item>
						<el-form-item label="联系电话" prop="phone">
							<el-input v-model="addForm.phone" placeholder="请输入联系电话"></el-input>
						</el-form-item>
						<el-form-item label="排序" prop="orderNum">
							<el-input v-model="addForm.orderNum" placeholder="请输入排序"></el-input>
						</el-form-item>
						<el-form-item label="状态" prop="status">
							<div class="radio-lst" v-if="addForm.status =='0'" @click="handlestat('1','1')">
								<img src="../../assets/img/status-active.png" class="status-img" /> 正常
							</div>
							<div class="radio-lst" v-if="addForm.status =='1'" @click="handlestat('0','1')">
								<img src="../../assets/img/status-gray.png" class="status-img"/> 停用
							</div>
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
	import {DeptList ,AddDept ,UpdateDept ,DelDept,DeptfindById } from '../../api/api.js'
	import Treeselect from "@riophae/vue-treeselect";
	import '@riophae/vue-treeselect/dist/vue-treeselect.css'
	import qs from 'qs'
	
	export default {
		components: {
			Treeselect
		},
		data() {
			return {
				filters: {
					deptName:'',
					status:'',
				},
				refreshTable: true,
				isExpandAll: false,
				datalist: [],
				listLoading: false,
				adddialog:false,
				diatitle:'',
				addForm:{
					deptId:'',
					parentId:null,
					deptName:'',
					leader:'',
					phone:'',
					orderNum:'',
					status:'0',
				},
				addFormRules:{
					parentId:[{required: true, message: '请选择上级部门', trigger: 'blur'}],
					deptName:[{required: true, message: '请输入部门名称', trigger: 'blur'}],
					leader:[{required: true, message: '请输入负责人', trigger: 'blur'}],
					phone:[{required: true, message: '请输入联系电话', trigger: 'blur'}],
					orderNum:[{required: true, message: '请输入排序', trigger: 'blur'}],
				},
				deptOptions:[],
				
			}
		},
		mounted(){
			this.getlist()
			this.getsjbm();
		},
		methods: {
			// 隔行颜色
			tableRowClassName: function(rowIndex) {
				if (rowIndex.rowIndex % 2 != 0) {
					return 'evenRow';
				}
				return 'oddRow';
			},
			// 获取列表
			getlist: function() {
				let para = {
					deptName:this.filters.deptName,
					status:this.filters.status,
				}
				DeptList(para).then((res)=>{
					let jsonDataTree = this.transData(res.data.data, 'deptId', 'parentId', 'children');
					this.datalist = jsonDataTree
					console.log(jsonDataTree,'jsonDataTreejsonDataTreejsonDataTree')
				})
			},
			//数组转换为树形结构
			transData: function(data, idStr, pidStr, children) {
				var arr = [],
					hash = {},
					id = idStr,
					pid = pidStr,
					children = children;
			
				for (var i = 0; i < data.length; i++) {
					hash[data[i][id]] = data[i];
				}
				for (var j = 0; j < data.length; j++) {
					//data 中每一项
					var arrVal = data[j],
						//找父分类
						hashVP = hash[arrVal[pid]];
					//pid 不为 0
					if (hashVP) {
						!hashVP[children] && (hashVP[children] = []);
						hashVP[children].push(arrVal);
					}
					//pid 为 0
					else {
						// 将data 的对象添加到数组中
						arr.push(arrVal);
					}
				}
				return arr;
			},
			// 重置
			resetForm: function(filters) {
				this.$refs.filters.resetFields()
				this.filters = {
					deptName:'',
					status:'',
				}
				this.getlist()
			},
			// 上级部门
			getsjbm:function(){
				DeptList().then((res)=>{
					let jsonDataTree = this.transData(res.data.data, 'deptId', 'parentId', 'children');
					this.deptOptions = jsonDataTree
					console.log(jsonDataTree,'jsonDataTreejsonDataTreejsonDataTree')
				})
			},
			
			// 选择部门
			changedepat:function(node){
				this.addForm.parentId = node.deptId
				this.addForm.parentName = node.deptName
			},
			// 部门树
			tree:function(){
				DeptTreelist().then((res)=>{
					this.deptOptions = res.data.data
				})
			},
			// 构建树标签
			normalizer(node) {
				if (node.children && !node.children.length) {
			        delete node.children;
				}
			    return {
			        id: node.deptId,
			        label: node.deptName,
			        children: node.children
			    };
			},
			// 选择部门校验
			parentIdchange:function(val){
				this.$nextTick(()=>{
					this.$refs.addForm.validateField('parentId')
				})
			},
			// 新增
			handleAdd:function(){
				this.adddialog = true
				this.diatitle = '新增部门'
				this.addForm = {
					deptId:'',
					parentId:null,
					deptName:'',
					leader:'',
					phone:'',
					orderNum:'',
					status:'0',
				}
			},
			// 弹窗关闭
			handleclose:function(type){
				this.$refs.addForm.resetFields();
				this.addForm = {
					deptId:'',
					parentId:null,
					deptName:'',
					leader:'',
					phone:'',
					orderNum:'',
					status:'0',
				}
				this.adddialog = false
			},
			// 切换 账号状态
			handlestat:function(val,type){
				this.addForm.status = val
			},
			// 完成
			handlesubmit:function(){
				this.$refs.addForm.validate((valid)=>{
					if(valid){
						let para = {
							deptId:this.addForm.deptId,
							deptName:this.addForm.deptName,
							parentId:this.addForm.parentId,
							parentName:this.addForm.parentName,
							leader:this.addForm.leader,
							link:this.addForm.link,
							phone:this.addForm.phone,
							orderNum:this.addForm.orderNum,
							status:this.addForm.status,
						}
						if(this.addForm.deptId){
							UpdateDept(para).then((res)=>{
								if(res.code == '200'){
									this.$message({
										message:res.msg,
										type:'success'
									})
									this.$refs.addForm.resetFields()
									this.adddialog = false
									this.getlist()
								}else{
									this.$message({
										message:res.msg,
										type:'error'
									})
									this.$refs.addForm.resetFields()
									this.adddialog = false
									this.getlist()
								}
							})
							
						}else{
							AddDept(para).then((res)=>{
								if(res.code == '200'){
									this.$message({
										message:res.msg,
										type:'success'
									})
									this.$refs.addForm.resetFields()
									this.adddialog = false
									this.getlist()
								}else{
									this.$message({
										message:res.msg,
										type:'error'
									})
									this.$refs.addForm.resetFields()
									this.adddialog = false
									this.getlist()
								}
							})
						}
						
					}
				})
			},
			// 编辑
			handlEdit:function(row){
				this.adddialog = true
				this.diatitle = '编辑部门'
				this.getDetail(row.deptId)
			},
			// 详情
			getDetail:function(id){
				DeptfindById(id).then((res)=>{
					this.addForm = res.data.data
					if(this.addForm.parentId == 0){
						this.addForm.parentId = null
					}
				})
			},
			// 删除 取消
			visibleDelCancel(id) {
				this.$refs[id].doClose()
				this.getlist()
			},
			// 删除确认
			visibleDelSubmit(id) { 
				DelDept(id).then((res)=>{
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
					this.getlist()
				})
			},
		}
	}
</script>

<style>
</style>