<template>
	<div class="g-introduction">
		<div class="intro-title">
			<img src="../assets/img/jstitle.png" alt="" />
		</div>
		<div class="intro-image">
			<div class="image-mainimg">
				<!-- <img src="../assets/img/bgbg.png" alt="" /> -->
				<video :src="videoUrl" type="video/mp4" autoplay controls loop
					style="width: 1292px;height: 726px;"></video>
			</div>
			<vue-seamless-scroll :data="picList" :class-option="classOption" class="warp">
				<ul class="item">
					<li v-for="(item, index) in picList" :key="index">
						<img :src="item" alt="" style="width: 300px;height: 169px;">
					</li>
				</ul>
			</vue-seamless-scroll>
		</div>
		<div class="intro-btn">
			<div class="btn-seen" @click="goyptg">一屏统管</div>
			<div class="btn-seen1" @click="gowelcome">后台管理系统</div>
		</div>
		<div class="intro-details">
			<div class="indetails-title">
				<img src="../assets/img/introductionstit.png" alt="" />
			</div>
			<p v-html="briefIntroduction"></p>
		</div>
		<div class="intro-details">
			<div class="indetails-title1">
				<img src="../assets/img/introductionstit2.png" alt="" />
			</div>
			<div class="indetails-image">
				<img :src="orgPictureUrl" alt="" />
			</div>
			<div class="desc-box" v-html="organizationDescribe"></div>
		</div>
		<div class="intro-details">
			<div class="indetails-title">
				<img src="../assets/img/introductionstit3.png" alt="" />
			</div>
			<div class="indetails-leader">
				<vue-seamless-scroll :data="leaderlist" style="overflow: hidden;" :class-option="classOption1"
					v-if="leaderlist.length > 5">
					<ul class="warpleader">
						<li class="main-card" v-for="(item, index) in leaderlist" :key="index">
							<img :src="item.photoUrl" alt="" />
							<div class="name-card">{{ item.name }}</div>
							<div class="zw-card">{{ item.post }}</div>
							<div class="zw-card" style="margin-top: 5px;line-height: 20px; font-size: 16px">
								{{ item.introduce }}</div>
						</li>
					</ul>
				</vue-seamless-scroll>
				<div v-else class="leader-card">
					<div class="card-main" v-for="(item, index) in leaderlist" :key="index">
						<img :src="item.photoUrl" alt="" />
						<div class="card-name">{{ item.name }}</div>
						<div class="card-zw">{{ item.post }}</div>
						<div class="card-zw" style="margin-top: 5px;line-height: 20px; font-size: 16px">
							{{ item.introduce }}</div>
						<!-- <p class="card-ader" style="line-height: 20px; font-size: 16px">
              {{ item.introduce }}
            </p> -->
					</div>
				</div>

			</div>
		</div>
	</div>
</template>

<script>
	import vueSeamlessScroll from "vue-seamless-scroll";
	import { VillageQuery, leadershipListShow } from "../api/api";
	import axios from "axios";
	export default {
		data() {
			return {
				classOption: {
					direction: 0,
					step: 0.5,
				},
				classOption1: {
					direction: 2,
					step: 0.5,
				},
				leaderlist: [],
				briefIntroduction: "", //村简介文字
				organizationDescribe: "", //组织描述
				picList: [],
				videoUrl: '',
				showUrl: '',
				orgPictureUrl: ''
			};
		},
		mounted() {
			const Authorization = localStorage.getItem("Authorization");
			if (Authorization) {
				axios.defaults.headers.common["Authorization"] =
					JSON.parse(Authorization);
			}
			this.getDate();
			this.getLeader();
		},
		methods: {
			// 获取文字
			getDate() {
				VillageQuery().then((res) => {
					this.briefIntroduction = res.data.data.briefIntroduction;
					this.organizationDescribe = res.data.data.organizationDescribe;
					let arr = [];
					this.picList = res.data.data.pictureUrl.split(",");
					this.orgPictureUrl = res.data.data.orgPictureUrl
					this.videoUrl = res.data.data.videoUrl
					this.showUrl = res.data.data.showUrl
				});
			},
			// 获取领导
			getLeader() {
				leadershipListShow().then((res) => {
					this.leaderlist = res.data;
					console.log(this.leaderlist);
				});
			},
			gowelcome() {
				this.$router.push({
					path: "/welcome"
				});
			},
			goyptg() {
				// window.open("http://dust.vkeline.com:1281/index.html");
				window.open(this.showUrl);
			},
		},
		components: {
			vueSeamlessScroll,
		},
	};
</script>

<style lang="scss" scoped>
	.warp {
		height: 726px;
		width: 300px;
		margin: 0 auto;
		overflow: hidden;

		ul {
			list-style: none;
			padding: 0;
			margin: 0 auto;

			li {
				display: block;
				display: flex;
				justify-content: space-between;
				margin-bottom: 20px
			}
		}
	}

	.warpleader {
		display: flex;
		height: 550px;
		margin: 0 auto;
		list-style: none;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;

		.main-card {
			width: 257px;
			height: 550px;
			margin: 0 19px;
		}

		.main-card img {
			height: 252px;
			width: 257px;
		}

		.name-card {
			text-align: center;
			font-size: 22px;
			margin: 13px auto 6px;
			color: #083F3C;
		}

		.zw-card {
			text-align: center;
			font-size: 22px;
			margin: 0 auto;
			color: #083F3C;
			word-wrap: break-word;
			word-break: normal;
		}
	}

	.desc-box {
		display: block;
		float: left;
		width: 100%;
		text-align: center;
		margin: 18px 0 79px;
	}

	.desc-box :deep p {
		display: inline-block;
		margin: 0;
		line-height: 24px;
	}
</style>