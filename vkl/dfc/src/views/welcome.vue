<template>
	<div class="g-welcome">
		<img src="../assets/img/basehd.png" class="base-hdimg" />
		<div class="base-text">v1.0</div>
		<div class="backc" @click="goback">
			<img src="../assets/img/backcjj.png" alt="">
		</div>
		<ul class="base-ul">
			<li class="base-lst" >
				<img src="../assets/img/h-djyl.png" class="img" @click="handletab('Djyl')">
			</li>
			<li class="base-lst" >
				<img src="../assets/img/h-xczx.png" class="img" @click="handletab('Xczx')">
			</li>
			<li class="base-lst">
				<img src="../assets/img/h-frcwgl.png" class="img" @click="handletab('Frcgl')">
			</li>
			<li class="base-lst">
				<img src="../assets/img/h-dlhjgl.png" class="img" @click="handletab('Road')">
			</li>
			<li class="base-lst" >
				<img src="../assets/img/h-hdldgl.png" class="img" @click="handletab('River')">
			</li>
			<li class="base-lst" >
				<img src="../assets/img/h-xcwygl.png" class="img" @click="handletab('Wygl')">
			</li>
		</ul>
	</div>
</template>

<script>
	import axios from 'axios'
	import { GetRouters } from '../api/api.js'
	export default{
		data(){
			return{
				menulist:[],
			}
		},
		mounted(){
			var Authorization = localStorage.getItem('Authorization');
			if (Authorization) {
				axios.defaults.headers.common['Authorization'] = JSON.parse(Authorization)
			}
			this.getlimit()
		},
		methods:{
			handletab(type){
				// console.log(this.menulist,'name')
				let menulist = []
				if(type =='Ypgl'){
					window.open('http://dust.vkeline.com:1281/index')
				}else{
					const clickMenu = this.menulist.filter(item => item.name == type)[0]
					console.log(clickMenu);
					sessionStorage.setItem('menulist', JSON.stringify(clickMenu.children))
					this.$router.push({path: clickMenu.children[0].children[0].component})
				}
			},
			// 获取权限
			getlimit:function(){
				GetRouters().then((res)=>{
					console.log(res);
					if(res.data.data.length>0){
						let routers = res.data.data[0].children
						this.menulist = routers
					}else{
						this.$message({
							message:'暂无权限',
							type:'error'
						})
					}
				})
			},
			goback(){
				this.$router.push({ path: '/Introduction'})
			}
		}
	}
</script>

<style>
</style>