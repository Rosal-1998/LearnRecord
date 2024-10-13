<template>
	<section class="g-cont">
		<div class="m-contain">
			<div class="m-search">
				<el-form v-model="filters" :inline="true" ref="filters" class="search-form">
					<el-form-item prop="menuName" label="菜单名称">
						<el-input type="text" v-model="filters.menuName" placeholder="请输入菜单名称"></el-input>
					</el-form-item>
					<el-form-item prop="status" label="状态">
						<el-select v-model="filters.status" placeholder="全部">
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
				<el-table v-loading="listLoading" style="width: 100%;" border v-if="refreshTable" :data="gcdata"
					row-key="menuId" :default-expand-all="isExpandAll" :row-class-name="tableRowClassName"
					:tree-props="{children: 'children', hasChildren: 'hasChildren'}"
					@selection-change="handleSelectionChange" max-height="780">
					<el-table-column prop="menuName" label="菜单名称">
					</el-table-column>
					<el-table-column prop="icon" label="图标">
					</el-table-column>
					<el-table-column prop="orderNum" label="排序">
					</el-table-column>
					<el-table-column prop="perms" label="权限标识">
					</el-table-column>
					<el-table-column prop="component" label="组件路径">
					</el-table-column>
					<el-table-column prop="" label="所属应用">
						<template slot-scope="scope">
							<span v-if="scope.row.application =='0'" class="f-green">后台管理</span>
							<span v-else-if="scope.row.application =='1'" class="f-red">小程序</span>
							<span v-else="">/</span>
						</template>
					</el-table-column>
					<el-table-column prop="status" label="状态">
						<template slot-scope="scope">
							<span v-if="scope.row.status =='0'" class="f-green">正常</span>
							<span v-else-if="scope.row.status =='0'" class="f-red">停用</span>
							<span v-else="">/</span>
						</template>
					</el-table-column>
					<el-table-column prop="createTime" label="创建时间" width="200">
					</el-table-column>
					<el-table-column prop="" label="操作" width="120">
						<template slot-scope="scope">
							<span class="edit-title" @click="handlEdit(scope.row)">编辑&nbsp;&nbsp;</span>
							<el-popover :ref="scope.row.menuId" placement="top" width="160" popper-class="popover">
								<p class="del-tip">是否删除该菜单信息？</p>
								<div class="pop-btnbox">
									<span class="cancel-btn" @click="visibleDelCancel(scope.row.menuId)">取消</span>
									<span class="ok-btn" @click="visibleDelSubmit(scope.row.menuId)">确定</span>
								</div>
								<span slot="reference" class="del-title">删除</span>
							</el-popover>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
		<!--新增界面-->
		<el-dialog :visible.sync="addFormVisible" @close="dailogclose" :append-to-body="true" class="m-dialog" :title="diatitle">
			<div class="dia-contont">
				<div class="dia-cont">
					<el-form :model="addForm" :inline="true" :rules="addFormRules" ref="addForm" class="formbox lab140">
						<el-form-item prop="parentId" label="上级菜单：">
							<treeselect v-model="addForm.parentId" :options="menuOptions" :normalizer="normalizer"
								:show-count="true" placeholder="选择上级菜单" class="" />
						</el-form-item>
						<el-form-item prop="menuType" label="菜单类型：">
							<el-radio-group v-model="addForm.menuType">
								<el-radio label="M">目录</el-radio>
								<el-radio label="C">菜单</el-radio>
								<el-radio label="F">按钮</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item prop="icon" label="图标：">
							<el-input v-model="addForm.icon" auto-complete="off" placeholder="请输入图标"></el-input>
						</el-form-item>
						<el-form-item label="菜单名称:" prop="menuName">
							<el-input v-model="addForm.menuName" auto-complete="off" placeholder="请输入菜单名称"></el-input>
						</el-form-item>
						<el-form-item label="排序:" prop="orderNum">
							<el-input v-model="addForm.orderNum" auto-complete="off" placeholder="请输入排序"></el-input>
						</el-form-item>
						<el-form-item label="权限标识:" prop="perms">
							<el-input v-model="addForm.perms" auto-complete="off" placeholder="请输入权限标识"></el-input>
						</el-form-item>
						<el-form-item label="请求路径:" prop="component" v-if="addForm.menuType == 'C'">
							<el-input v-model="addForm.component" auto-complete="off" placeholder="请输入请求路径"></el-input>
						</el-form-item>
						<el-form-item label="路由地址:" prop="path" v-if="addForm.path != 'F'">
							<el-input v-model="addForm.path" auto-complete="off" placeholder="请输入请求路径"></el-input>
						</el-form-item>
						<el-form-item label="所属应用:" prop="application">
							<el-select v-model="addForm.application" placeholder="全部">
								<el-option label="后台管理" value="0"></el-option>
								<el-option label="小程序客户端" value="1"></el-option>
							</el-select>
						</el-form-item>
						
					</el-form>
					<div class="dialog-foot">
						<span class="btn-cancel" @click="dailogclose">取消</span>
						<span class="btn-save" @click="handlesubmit">完成</span>
					</div>
				</div>
			</div>
		</el-dialog>

	</section>
</template>

<script>
	import { MenuList, AddMenu, UpdateMenu, DelMenu, MenufindById } from '../../api/api.js'
	import qs from 'qs';
	import Treeselect from "@riophae/vue-treeselect";
	import "@riophae/vue-treeselect/dist/vue-treeselect.css"

	export default {
		components: {
			Treeselect
		},
		data() {
			return {
				filters: {
					menuName: '',
					status: '',
				},
				gcdata: [],
				listLoading: false,
				total: 0,
				pagesize: 10,
				currentPage: 1,
				currentPage1: 1,
				refreshTable: true,
				isExpandAll: false,

				diatitle: '新增',
				addFormVisible: false, //新增界面是否显示
				addLoading: false,
				//新增界面数据
				addForm: {
					menuId:'',
					parentId: null,
					menuType:'M',
					icon:'',
					menuName:'',
					orderNum:'',
					perms:'',
					component:'',
					path:'',
					application:'',
				},
				addFormRules: {
					menuName:[{ required:true, message:'请输入菜单名称',trigger:'blur'}],
					orderNum:[{ required:true, message:'请输入排序',trigger:'blur'}],
					component:[{ required:true, message:'请输入请求路径',trigger:'blur'}],
					application:[{ required:true, message:'请选择所属应用',trigger:'change'}],
				},

				multipleSelection: [],
				statelist: [], // 状态
				typelist: [], //菜单类型
				applist: [], //所属应用

				menuOptions: [], //道路列表

				defaultProps: {
					children: "children",
					label: "title"
				},
			}
		},
		mounted() {
			this.getlist();
			
		},
		methods: {
			// 隔行颜色
			tableRowClassName: function(rowIndex) {
				// if (rowIndex.rowIndex % 2 != 0) {
				// 	return 'evenRow';
				// }
				// return 'oddRow';
			},
			// 获取列表
			getlist: function() {
				let para = {
					menuName: this.filters.menuName,
					status: this.filters.status,
				}
				MenuList(para).then((res) => {
					console.log(res.data,'10010')
					if (res.data.code == '200') {
						let jsonDataTree = this.transData(res.data.data, 'menuId', 'parentId', 'children');
						console.log(jsonDataTree, 'jsonDataTreejsonDataTreejsonDataTree');
						this.gcdata = jsonDataTree
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						})
					}
				})
			},
			// 新增下的 上级菜单
			getTreeselect() {
			    MenuList().then(res => {
			        this.menuOptions = [];
			        const menu = { menuId: 0, menuName: '主类目', children: [] };
			        menu.children = this.transData(res.data.data, "menuId",'parentId', 'children');
			        this.menuOptions.push(menu);
			    });
			},
				
			// 转换菜单数据结构
			normalizer(node) {
				if (node.children && !node.children.length) {
			        delete node.children;
			    }
			    return {
					id: node.menuId,
			        label: node.menuName,
			        children: node.children
			    };
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
				this.$refs[filters].resetFields();
				this.filters = {
					menuName: '',
					status: '',
				}
				this.getlist()
			},
			
			// 多选
			handleSelectionChange: function(val) {
				this.multipleSelection = val;
			},
			

			//显示编辑界面
			handleEdit: function(index, row) {
				console.log(row, '000')
				this.addFormVisible = true;
				this.diatitle = '编辑'
				this.getTreeselect();
				this.getdetail(row.id)
			},
			// 获取当前菜单详情
			getdetail: function(id) {
				MenufindById(id).then((res) => {
					console.log(res.data.data, '详情')
					this.addForm = res.data.data
				})
			},
			//显示新增界面
			handleAdd: function() {
				this.diatitle = '新增菜单'
				this.addFormVisible = true;
				this.addForm = {
					menuId:'',
					parentId: null,
					menuType:'M',
					icon:'',
					menuName:'',
					orderNum:'',
					perms:'',
					component:'',
					path:'',
					application:'',
				}
				this.getTreeselect()
			},
			//新增
			handlesubmit: function() {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let para = {
								menuId: this.addForm.menuId,
								parentId: this.addForm.parentId,
								menuType: this.addForm.menuType,
								icon: this.addForm.icon,
								menuName: this.addForm.menuName,
								orderNum: this.addForm.orderNum,
								perms: this.addForm.perms,
								component: this.addForm.component,
								path:this.addForm.path,
								application:this.addForm.application
							}
							if(this.addForm.menuId){
								UpdateMenu(para).then((res) => {
									this.addLoading = false;
									if (res.code != '-1') {
										this.$message({
											message: res.msg,
											type: 'success'
										});
									} else {
										this.$message({
											message: res.msg,
											type: 'error'
										});
									}
									this.$refs["addForm"].clearValidate();
									this.addFormVisible = false;
									this.getlist();
								});
							}else{
								AddMenu(para).then((res) => {
									this.addLoading = false;
									if (res.code != '-1') {
										this.$message({
											message: res.msg,
											type: 'success'
										});
									} else {
										this.$message({
											message: res.msg,
											type: 'error'
										});
									}
									this.$refs["addForm"].clearValidate();
									this.addFormVisible = false;
									this.getlist();
								});
							}
							
						});
					}
				});
			},
			// 弹窗关闭
			dailogclose: function() {
				this.addFormVisible = false;
				this.$refs["addForm"].clearValidate();
				this.addForm = {
					menuId:'',
					parentId: null,
					menuType:'M',
					icon:'',
					menuName:'',
					orderNum:'',
					perms:'',
					component:'',
					path:'',
					application:'',
				}
			},
			// 编辑
			handlEdit:function(row){
				this.addFormVisible = true
				this.diatitle = '编辑菜单'
				this.getdetail(row.menuId)
			},
			// 删除 取消
			visibleDelCancel(id) {
				this.$refs[id].doClose()
			},
			// 删除确认
			visibleDelSubmit(id) { 
				DelMenu(id).then((res)=>{
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
			

		},

	}
</script>