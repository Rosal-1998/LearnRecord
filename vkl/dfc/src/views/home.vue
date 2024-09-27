<template>
	<div class="g-contain">
		<div class="g-aside">
			<div class="g-hd">
				<img src="../assets/img/logo.png" class="logo"/>
				<span class="name">数智乡村综合管理系统</span>
			</div>
			<el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleopen" @close="handleclose" @select="handleselect"
				 unique-opened router>
				 <!-- 默认初始化 -->
				<!-- <template v-for="(item,index) in menulist " v-if="!item.hidden">
					<el-submenu :index="index+''" v-if="!item.hidden && item.leaf != true">
						<template slot="title">
							<span class="menu-title"><i :class="'iconfont '+item.iconCls "></i>{{item.name}}</span>
						</template>
						<el-menu-item v-for="child in item.children"  :index="child.path" :key="child.path" v-if="!child.hidden">
							<i class="bqbg-img"></i>{{child.name}} 
						</el-menu-item>
					</el-submenu>
					<el-menu-item v-if="item.leaf && item.children.length>0"  :index="item.children[0].path">
						<span class="menu-title"><i :class="'iconfont '+item.iconCls "></i>{{item.name}}</span>
					</el-menu-item>
				</template> -->
				<template v-for="(item,index) in menulist " v-if="!item.hidden">
					<el-submenu :index="index+''" v-if="!item.hidden">
						<template slot="title">
							<span class="menu-title">
								<!-- <i :class="'iconfont '+item.meta.icon"></i> -->
								{{item.meta.title}}
							</span>
						</template>
						<el-menu-item v-for="child in item.children"  :index="child.component" :key="child.component" v-if="!child.hidden">
							<i class="bqbg-img"></i>{{child.meta.title}}
						</el-menu-item>
					</el-submenu>
					<!-- <el-menu-item v-if="item.children.length == 1"  :index="item.children[0].path">
						<span class="menu-title">
							<i :class="'iconfont '+item.iconCls "></i>
						{{item.name}}</span>
					</el-menu-item> -->
				</template>
				
			</el-menu>
		</div>
		<section class="g-main">
			<div class="m-hd">
				<div class="rt-info">
					<span class="gb-base" @click="goback">返回主页</span>
					<span class="gb-base" @click="handlext">系统管理</span>
					<span class="wel-tip" @click="handleinfo">欢迎您：{{userName}}</span>
					<span class="edit-password" @click="handlepassword">修改密码</span>
					<i class="line">  </i>
					<img src="../assets/img/notic.png" class="notic-img" @click="handlexw"/>
					<div class="tuichubox">
						<el-popconfirm  title="确定要退出系统吗？" confirm-button-text='确定'
							cancel-button-text='取消' @cancel="handlecancel" @confirm ="handleLogout" confirm-button-type="success" cancel-button-type="">
						    <span slot="reference"> 
								<img src="../assets/img/exit.png" class="exit-img"/>
							</span>
						</el-popconfirm>
					</div>
					
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
					<div class="avaterfile" >
						<input type="file" ref="file" class="file" @change="choosefile($event)"/>
						<span class="ava-name">头像上传</span>
					</div>
				</div>
				<div class="xq-lst">
					<span class="name">姓名</span>
					<span class="lab">{{detailform.nickName}}</span>
				</div>
				<!-- <div class="xq-lst">
					<span class="name">手机号</span>
					<span class="lab">{{detailform.phonenumber}}</span>
					<span class="editphone">修改手机号码</span>
				</div> -->
			</div>
			<div class="dialog-foot">
				<span class="btn-cancel" @click="handlepassword">修改密码</span>
				<span class="btn-save" @click="handleLogout">退出登录</span>
			</div>
		</el-dialog>
		<!-- 修改密码 -->
		<el-dialog :visible.sync="passdialog" v-if="passdialog" class="g-dialog min-dia642" title="修改密码">
			<el-form  :model="addForm" :inline="true" ref="addForm" :rules="addFormRules" class="addform add-signcent">
				<el-form-item label="旧密码" prop="oldPassword">
					<el-input v-model="addForm.oldPassword" placeholder="请输入旧密码"></el-input>
				</el-form-item>
				<el-form-item label="新密码" prop="newPassword">
					<el-input v-model="addForm.newPassword" placeholder="请输入新密码"></el-input>
				</el-form-item>
				<el-form-item label="重复密码" prop="newPasswordAgain">
					<el-input v-model="addForm.newPasswordAgain" placeholder="请输入重复密码"></el-input>
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
	import {logout,GetInfo,UpdatePwd,GetRouters } from '../api/api.js'
	import qs from 'qs'
	
	export default{
		data(){
			return{
				userName:'',
				detailform:{},
				menulist:[],
				infodialog:false,
				passdialog:false,
				addForm:{
					oldPassword:'',
					newPassword:'',
					newPassword1:'',
				},
				addFormRules:{
					oldPassword:[{required:true,message:'请输入旧密码',trigger:'blur'}],
					newPassword:[{required:true,message:'请输入新密码',trigger:'blur'}],
					newPasswordAgain:[{required:true,message:'请输入重复密码',trigger:'blur'}],
				}
			}
		},
		mounted(){
			// console.log(this.$router.options.routes,' this.$router.options.routes')
			// this.menulist = this.$router.options.routes
			
			let menulist = sessionStorage.getItem('menulist')
			this.menulist = JSON.parse(menulist)
			this.getuser()
		},
		methods:{
			// 菜单打开
			handleopen: function () {},
			// 菜单关闭
			handleclose: function () {},
			// 菜单选择
			handleselect: function (a, b) {},
			// 获取用户信息
			getuser:function(){
				GetInfo().then((res)=>{
					console.log(111111, res);
					this.userName = res.data.data.user.nickName
					this.detailform = res.data.data.user
				})
			},
			
			// 查看个人信息
			handleinfo:function(){
				this.infodialog = true
			},
			// 修改密码
			handlepassword:function(){
				this.infodialog = false
				this.passdialog = true
				this.addForm = {
					oldPassword:'',
					newPassword:'',
					newPassword1:'',
				}
			},
			// 跳转新闻公告
			handlexw:function(){
				this.$router.push({path:'/Info'})
			},
			handlecancel:function(){},
			// 用户退出
			handleLogout:function(){
				logout().then((res)=>{
					if(res.code =='200'){
						this.$message({
							message:res.msg,
							type:'success'
						})
						localStorage.removeItem('Authorization')
						sessionStorage.removeItem('menulist')
						this.$router.push({path:'/'})
					}else{
						this.$message({
							message:res.msg,
							type:'error'
						})
					}
				})
			},
			// 取消
			handlecancel:function(){
				this.$refs.addForm.resetFields()
				this.addForm = {
					oldPassword:'',
					newPassword:'',
					newPasswordAgain:'',
				}
				this.passdialog =  false
				
			},
			// 立即修改
			handleSubmit:function(){
				this.$refs.addForm.validate((valid)=>{
					if(valid){
						let para = {
							oldPassword:this.addForm.oldPassword,
							newPassword:this.addForm.newPassword,
							newPasswordAgain:this.addForm.newPasswordAgain
						}
						UpdatePwd(para).then((res)=>{
							console.log(res,'xiugaimma')
							if(res.data.code == '200'){
								this.$message({
									message:res.data.msg,
									type:'success'
								})
								this.passdialog = false
								localStorage.removeItem('Authorization')
								this.$router.push({path:'/'})
							}else{
								this.$message({
									message:res.data.msg,
									type:'error'
								})
							}
							
						})
					}
				})
				
			},
			// 修改头衔
			choosefile:function(event){
				let file = this.$refs.file.files[0]
				this.uploadfile(file)
			},
			// 文件上传后获取数据
			uploadfile:function(data){
				var random = new Date().getTime().toString();
				let formData = new FormData();
				formData.append("avatarfile",data);
				axios.post('/system/user/profile/updateAvatar?t='+random, formData ,{
					headers: {
						"Content-Type" :"multipart/form-data",
					},
					withCredentials:true,
				}).then((res) =>{
					if(res.data.code == 200){
						this.$message({
							message:res.data.msg,
							type:'success'
						})
					}else {
						this.$message({
							message:res.data.msg,
							type:'error'
						})
					}
					this.infodialog = false
					this.getuser()
				}).catch((res) =>{
					console.log(res,'2')
				})
			},
			// 返回主页
			goback:function(){
				this.$router.push({path:'/welcome'})
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
			
		}
	}
</script>

<style>
</style>