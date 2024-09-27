<template>
	<div class="g-cont">
		<div class="m-contain">
			<div class="sqbox-cont">
				<span class="title">系统授权</span>
				<div class="lst">
					<label class="lab">项目名称：</label>
					<span class="name">{{detailfrom.projectName}}</span>
				</div>
				<div class="lst">
					<label class="lab">项目标识：</label>
					<span class="name">{{detailfrom.projectKey}}</span>
				</div>
				<div class="lst">
					<label class="lab">项目版本：</label>
					<span class="name">{{detailfrom.projectVersion}}</span>
				</div>
				<div class="lst">
					<label class="lab">机器码：</label>
					<span class="name">{{detailfrom.machindCode}} &nbsp;&nbsp;<i class="sqbtn" style="float: none;" @click="copyUrl(detailfrom.machindCode)">点击复制</i></span>
				</div>
				<div class="lst">
					<label class="lab">授权状态：</label>
					<div class="name">
						<div class="filebox" v-if="detailfrom.status == '0'">
							<input type="file" class="input" @change="choosefile($event)"/>
							<i class="sqbtn1">未授权</i>
						</div>
						<i class="sqbtn" v-if="detailfrom.status == '1'">已授权</i>
						<div class="filebox" v-if="detailfrom.status == '-1'">
							<input type="file" class="input" @change="choosefile($event)"/>
							<i class="sqbtn1">已过期</i>
						</div>
						
					</div>
				</div>
				<div class="" v-if="detailfrom.status == '1'">
					<div class="lst">
						<label class="lab">项目名称：</label>
						<span class="name">{{info.projectName}}</span>
					</div>
					<div class="lst">
						<label class="lab">申请人：</label>
						<span class="name">{{info.projectApplyer}}</span>
					</div>
					<div class="lst">
						<label class="lab">授权人：</label>
						<span class="name">{{info.licenser}}</span>
					</div>
					<div class="lst">
						<label class="lab">授权时间：</label>
						<span class="name">{{info.licenseDateTime}}</span>
					</div>
					<div class="lst">
						<label class="lab">截止时间：</label>
						<span class="name">{{info.licenseEnd}}</span>
					</div>
					<div class="lst">
						<label class="lab">项目用于：</label>
						<span class="name">{{info.projectTo}}</span>
					</div>
				</div>
			</div>
		</div>
		
	</div>
</template>

<script>
	import { getLicense ,statusLicense } from '../../api/api.js'
	import axios from 'axios'
	
	export default{
		data(){
			return{
				detailfrom:{},
				info:{}
			}
		},
		mounted(){
			this.getstatus();
		},
		methods:{
			// 初始化
			getinit:function(){
				getLicense().then((res)=>{
					console.log(res.data.data,'数据')
					this.info = res.data.data
				})
			},
			// 
			getstatus:function(){
				statusLicense().then((res)=>{
					console.log(res,'状态')
					this.detailfrom = res.data.data
					if(this.detailfrom.status == '1'){
						this.getinit()
					}
				})
			},
			// 上传合同
			choosefile:function(e){
				console.log(e,'0001011010')
				let inputDOM = e.target.files[0]
				console.log(inputDOM,'inputDOMinputDOMinputDOM')
				this.uploadimg(inputDOM)
			},
			// 文件上传
			uploadimg:function(data){
				var random = new Date().getTime().toString();
				let formData = new FormData();
				formData.append("file",data);
				axios.post('/license/upload?t='+random, formData ,{
					headers: {
						"Content-Type" :"multipart/form-data",
					},
					withCredentials:true,
				}).then((res) =>{
					debugger
					if(res.data.code == 1){
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
					this.getstatus()
					
				}).catch((res) =>{
					console.log(res,'2')
				})
			},
			// 点击复制
			copyUrl(val) {
				var cInput = document.createElement("input");
				cInput.value = val;
				document.body.appendChild(cInput);
				cInput.select(); // 选取文本框内容
				document.execCommand("copy");
				this.$message({
					type: "success",
					message: "复制成功"
				});
				// 复制成功后再将构造的标签 移除
				document.body.removeChild(cInput);
			}
			
		},
		
	}
</script>

<style>
</style>