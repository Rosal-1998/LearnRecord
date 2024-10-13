<template>
	<div class="g-contain">
		<div class="g-header">
			<img src="../assets/img/title.png" class="title-img" />
			<div class="rt-info">
				<!-- <span class="wel-tip" @click="handleinfo">{{ userName }}</span> -->
				<span class="wel-tip" >{{ userName }}</span>
				<span class="edit-password" @click="handlepassword">修改密码</span>
				<i class="line"> </i>
				<!-- <img src="../assets/img/notic.png" class="notic-img" @click="handlexw"/> -->
				<div class="tuichubox">
					<el-popconfirm title="确定要退出系统吗？" confirm-button-text="确定" cancel-button-text="取消"
						@cancel="handlecancel" @confirm="handleLogout" confirm-button-type="success"
						cancel-button-type="">
						<span slot="reference">
							<img src="../assets/img/exit.png" class="exit-img" />
						</span>
					</el-popconfirm>
				</div>
			</div>
		</div>
		<div class="g-aside">
			<el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleopen" @close="handleclose"
				@select="handleselect" unique-opened router>
				<!-- <template v-for="(item, index) in menulist" v-if="!item.hidden">
					<el-submenu :index="index + ''" v-if="!item.hidden && item.leaf != true">
						<template slot="title">
							<div class="icon">
								<div class="iconfont" :class="item.iconCls"></div>
							</div>

							<div class="menu-title">
								{{ item.name }}
							</div>
						</template>
						<el-menu-item v-for="child in item.children" :index="child.path" :key="child.path"
							v-if="!child.hidden" class="menu-item">
							<i class="bqbg-img"></i>{{ child.name }}
						</el-menu-item>
					</el-submenu>
					<el-menu-item v-if="item.leaf && item.children.length > 0" :index="item.children[0].path">
						<span class="menu-title"><i :class="'iconfont ' + item.iconCls"></i>{{ item.name }}</span>
					</el-menu-item>
				</template> -->
				<template v-for="(item,index) in menulist " v-if="!item.hidden">
					<el-submenu :index="index+''">
						<template slot="title">
							<div class="icon">
								<div class="iconfont" :class="item.meta.icon"></div>
							</div>
							<span class="menu-title"> {{item.meta.title}}</span>
						</template>
						<el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">
							<i class="bqbg-img"></i>{{child.meta.title}}
						</el-menu-item>
					</el-submenu>
				</template>
			</el-menu>
		</div>
		<section class="g-main">
			<div class="tabs" v-if="visitedPages.length">
				<div v-for="(page, index) in visitedPages" :key="index" @click="goToPage(page,index)"
					:class="currentPageIndex == index ? 'tab':'tabActivate'">
					{{ page.name }}
					<div @click="removePage(index)" :class="currentPageIndex == index ? 'del':'delActivate'"></div>
				</div>
			</div>
			<router-view></router-view>
		</section>
		<!-- 个人信息 -->
		<el-dialog :visible.sync="infodialog" v-if="infodialog" class="g-dialog min-dia642" title="个人信息">
			<div class="xq-content grxx-cont">
				<div class="xq-lst">
					<span class="name">头像</span>
					<img :src="detailform.avatarUrl" class="avater" />
					<div class="avaterfile">
						<input type="file" ref="file" class="file" @change="choosefile($event)" />
						<span class="ava-name">头像上传</span>
					</div>
				</div>
				<div class="xq-lst">
					<span class="name">姓名</span>
					<span class="lab">{{ detailform.nickName }}</span>
				</div>
			</div>
			<div class="dialog-foot">
				<span class="btn-cancel" @click="handlepassword">修改密码</span>
				<span class="btn-save" @click="handleLogout">退出登录</span>
			</div>
		</el-dialog>
		<!-- 修改密码 -->
		<el-dialog :visible.sync="passdialog" v-if="passdialog" class="g-dialog min-dia642" title="修改密码">
			<el-form :model="addForm" :inline="true" ref="addForm" :rules="addFormRules" class="addform add-signcent">
				<el-form-item label="旧密码" prop="oldPassword">
					<el-input v-model="addForm.oldPassword" placeholder="请输入旧密码"></el-input>
				</el-form-item>
				<el-form-item label="新密码" prop="newPassword">
					<el-input v-model="addForm.newPassword" placeholder="请输入新密码"></el-input>
				</el-form-item>
				<el-form-item label="重复密码" prop="newPassword1">
					<el-input v-model="addForm.newPassword1" placeholder="请输入重复密码"></el-input>
				</el-form-item>
			</el-form>
			<div class="dialog-foot">
				<span class="btn-cancel" @click="handlecancel">取消</span>
				<span class="btn-save" @click="handleSubmit">立即修改</span>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import axios from 'axios'
	import { logout, GetInfo, UpdatePwd, GetRouters } from '../api/api.js'
	import qs from 'qs'
	export default {
		data() {
			return {
				projectName: '新建区委党校智慧党校平台',
				userName: '',
				detailform: {},
				menulist: [],
				infodialog: false,
				passdialog: false,
				addForm: {
					oldPassword: '',
					newPassword: '',
					newPassword1: '',
				},
				visitedPages: [
					{name: '首页', path: '/Home'}
				],
				addFormRules: {
					oldPassword: [{
						required: true,
						message: '请输入旧密码',
						trigger: 'blur'
					}, ],
					newPassword: [{
						required: true,
						message: '请输入新密码',
						trigger: 'blur'
					}, ],
					newPassword1: [{
						required: true,
						message: '请输入重复密码',
						trigger: 'blur'
					}, ],
				},
				currentPageIndex: '',
			}
		},
		watch: {
			$route(to, from) {
				// 检查是否已经访问过该页面；
				const exists = this.visitedPages.findIndex((p) => p.name === to.name)
				/*
				 * exists:【-1】不存在，未访问过。【>0】存在。
				 * 【>0】如果是已经访问过，且未删除的页面，定位到该页面序列
				 * 【-1】如果是未访问的，定位到最后一个序列
				 **/
				if (exists == -1) {
					this.visitedPages.push({
						name: to.name,
						path: to.path
					})
					this.currentPageIndex = this.visitedPages.length - 1
				} else {
					this.currentPageIndex = exists
				}
			},
		},
		mounted() {
			let Authorization = localStorage.getItem('Authorization')
			if (Authorization) {
				axios.defaults.headers.common['Authorization'] = JSON.parse(Authorization)
			}
			this.getlimit()
			this.getuser()
		},
		methods: {
			// 系统管理
			getlimit:function(){
				GetRouters().then((res)=>{
					let routers = res.data.data
					this.menulist  = routers
				})
			},
			// 菜单打开
			handleopen: function() {},
			// 菜单关闭
			handleclose: function() {},
			// 菜单选择
			handleselect: function(a, b) {},
			// 获取用户信息
			getuser: function() {
				GetInfo().then((res) => {
					this.userName = res.data.data.user.nickName
					this.detailform = res.data.data.user
				})
			},
			// navigate(name) {
			//   this.$router.push({ name });
			// },
			goToPage(page, index) {
				this.currentPageIndex = index
				if (this.$route.path != page.path) {
					this.$router.push({
						name: page.name
					})
				}
			},
			removePage(index) {
				// 当删除的Index是最后一个，将currentPageIndex重定位为0
				this.visitedPages.splice(index, 1)
				console.log('index', index)
				console.log('this.visitedPages.length', this.visitedPages.length)
				if (index == this.visitedPages.length) {
					this.currentPageIndex = 0
				}

				// console.log(index,this.currentPageIndex)
			},
			// 查看个人信息
			handleinfo: function() {
				this.infodialog = true
			},
			// 修改密码
			handlepassword: function() {
				this.infodialog = false
				this.passdialog = true
				this.addForm = {
					oldPassword: '',
					newPassword: '',
					newPassword1: '',
				}
			},
			// 跳转新闻公告
			handlexw: function() {
				this.$router.push({
					path: '/Info'
				})
			},
			handlecancel: function() {},
			// 用户退出
			handleLogout: function() {
				logout().then((res) => {
					if (res.code == '200') {
						this.$message({
							message: res.msg,
							type: 'success',
						})
						localStorage.removeItem('Authorization')
						sessionStorage.removeItem('menulist')
						this.$router.push({
							path: '/'
						})
					} else {
						this.$message({
							message: res.msg,
							type: 'error',
						})
					}
				})
			},
			// 取消
			handlecancel: function() {
				this.$refs.addForm.resetFields()
				this.addForm = {
					oldPassword: '',
					newPassword: '',
					newPassword1: '',
				}
				this.passdialog = false
			},
			// 立即修改
			handleSubmit: function() {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						let para = {
							oldPassword: this.addForm.oldPassword,
							newPassword: this.addForm.newPassword,
						}
						UpdatePwd(para).then((res) => {
							console.log(res, 'xiugaimma')
							if (res.data.code == '200') {
								this.$message({
									message: res.data.msg,
									type: 'success',
								})
								this.passdialog = false
								localStorage.removeItem('Authorization')
								this.$router.push({
									path: '/'
								})
							} else {
								this.$message({
									message: res.data.msg,
									type: 'error',
								})
							}
						})
					}
				})
			},
			// 修改头衔
			choosefile: function(event) {
				let file = this.$refs.file.files[0]
				this.uploadfile(file)
			},
			// 文件上传后获取数据
			uploadfile: function(data) {
				var random = new Date().getTime().toString()
				let formData = new FormData()
				formData.append('avatarfile', data)
				axios
					.post('/system/user/profile/updateAvatar?t=' + random, formData, {
						headers: {
							'Content-Type': 'multipart/form-data',
						},
						withCredentials: true,
					})
					.then((res) => {
						if (res.data.code == 200) {
							this.$message({
								message: res.data.msg,
								type: 'success',
							})
						} else {
							this.$message({
								message: res.data.msg,
								type: 'error',
							})
						}
						this.infodialog = false
						this.getuser()
					})
					.catch((res) => {
						console.log(res, '2')
					})
			},
			// 系统管理
			handlext:function(){
				GetRouters().then((res)=>{
					console.log('---getrouters---res',res)
					let routers = res.data.data[0].children
					
					console.log(routers,'routersroutersrouters')
					let xtgl 
					xtgl = routers.filter((obj)=>{
						return obj.name == 'Stgl'
					})
					console.log(xtgl,'xtglxtglxtgl')
					this.menulist = xtgl[0].children
					sessionStorage.setItem('menulist', JSON.stringify(xtgl[0].children))
					this.$router.push({path:xtgl[0].children[0].children[0].component})
				})
			},
		},
	}
</script>

<style></style>