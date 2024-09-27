<template>
	<div class="login-contain">
		<div class="login-form">
			<div class="rt-form">
				<span class="login-title">欢迎您，请登录！</span>
				<i class="dash-line"></i>
				<el-form :model="ruleForm" :rules="rulesform" ref="ruleForm">
					<el-form-item prop="account">
						<img src="../assets/img/log-user.png" class="use-img" />
						<el-input v-model="ruleForm.account" placeholder="请输入用户账号"></el-input>
					</el-form-item>
					<el-form-item prop="password">
						<img src="../assets/img/log-password.png" class="pas-img" />
						<el-input type="password" v-model="ruleForm.password" placeholder="请输入登录密码"></el-input>
					</el-form-item>
					<div class="login-opt">
						<el-checkbox v-model="checked">记住密码</el-checkbox>
						<span class="forget-tip">忘记密码？</span>
					</div>
					<span class="btn login-btn" @click="handlelogin">登录</span>
				</el-form>
				
			</div>
			
		</div>
	</div>
</template>

<script>
	import axios from 'axios'
	import { login } from '../api/api.js'
	export default{
		data(){
			return{
				ruleForm:{
					// account:'admin',
					// password:'123456',
					account:'',
					password:''
				},
				rulesform:{
					account: [{
							required: true,
							message: '请输入您的用户名',
							trigger: 'blur'
						},
					],
					password: [{
							required: true,
							message: '请输入您的密码',
							trigger: 'blur'
						},
					]
				},
				checked:false,
			}
		},
		mounted(){
			localStorage.removeItem('Authorization')
		},
		methods:{
			// 登录
			handlelogin() {
				// this.$router.replace({ path: '/welcome'})
				let  _this = this;
				let remember = ''
				if (_this.checked) {
					_this.setCookie(this.ruleForm.account, this.ruleForm.password, 7);
					remember = '1';
				} else {
					_this.clearCookie();
					remember = '0';
				}
				this.$refs.ruleForm.validate((valid) => {
					if (valid) {
						let para = {
							username: this.ruleForm.account,
							password: this.ruleForm.password,
						}
						login(para).then((res) => {
							console.log(res,'1001100')
							if(res.code == '200'){
								let Authorization = 'Bearer '+ res.data.token
								localStorage.setItem('Authorization', JSON.stringify(Authorization));
								this.$router.push({ path: '/Introduction'})
							}else{
								this.$message({
									message: res.msg,
									type: 'error'
								});
							}
						}).catch((res)=>{
							this.$message({
								message: '登录失败',
								type: 'error'
							});
						})
						
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			//设置cookie
			setCookie(c_name, c_pwd, exdays) {
				var exdate = new Date(); //获取时间
				exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
				//字符串拼接cookie
				window.document.cookie = "userName" + "=" + c_name + ";path=/;expires=" + exdate.toGMTString();
				window.document.cookie = "userPwd" + "=" + c_pwd + ";path=/;expires=" + exdate.toGMTString();
			},
			//读取cookie
			getCookie:function() {
				if (document.cookie.length > 0) {
					var arr = document.cookie.split('; '); //这里显示的格式需要切割一下自己可输出看下
					for (var i = 0; i < arr.length; i++) {
						var arr2 = arr[i].split('='); //再次切割
						//判断查找相对应的值
						if (arr2[0] == 'userName') {
							this.ruleForm.username = arr2[1]; //保存到保存数据的地方
						} else if (arr2[0] == 'userPwd') {
							this.ruleForm.password = arr2[1];
						}
					}
				}
			},
			//清除cookie
			clearCookie: function() {
				this.setCookie("", "", -1); //修改2值都为空，天数为负1天就好了
			},
		}
	}
</script>

<style>
	.login-contain{
		font-size: 20px;
	}
</style>