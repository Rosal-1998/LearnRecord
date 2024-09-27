<template>
	<div class="app-container">
		<div class="listpage">
			<div class="m-search">
				<el-form :model="filters" :inline="true" ref="filters">
					<el-form-item prop="title">
						<el-input v-model="filters.title" placeholder="照片标题"></el-input>
					</el-form-item>
					<div class="search-btnbox">
						<span class="btn search-btn" @click="AlbumList()">查询</span>
						<span class="btn reset-btn" @click="resetForm('filters')">重置</span>
					</div>
				</el-form>
			</div>
			<div class="menu-box">
				<span v-if="isEdit" class="btn add-btn" @click="handleAdd"><i class="addicon"></i>新增照片</span>
			</div>
			<div class="m-table">
				<ul class="honor-ul">
					<li class="honor-lst" v-for="item in albumList" :key="item.id">
						<div class="hd">
							<el-tooltip placement="top" :content="item.title">
								<span class="line-one">{{ item.title }}</span>
							</el-tooltip>
							<el-popconfirm v-if="isEdit" title="确定要删除吗？" hide-icon @confirm="handlDel(item.id)">
								<img slot="reference" src="../../../assets/img/delete2.png" class="img">
							</el-popconfirm>
							<img src="../../../assets/img/edit.png" class="img" style="margin-left: 10px;"
								v-if="isEdit" @click="handlEdit(item)">
						</div>
						<div class="hon-cont">
							<img :src="item.pictureUrl" class="img" />
						</div>
					</li>
				</ul>
			</div>
			<div class="m-pagination">
				<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
					:current-page="currentPage" :page-size="pagesize" layout="prev, pager, next"
					v-model:current-page="currentPage1" prev-text="< 上一页" next-text="下一页 >" :total="albumTotal">
				</el-pagination>
				<i class="total">共有{{ albumTotal }}条数据</i>
			</div>
		</div>
		<!-- 新增 -->
		<el-dialog :visible.sync="adddialog" v-if="adddialog" class="m-dialog" :title="diatitle"
			:append-to-body="true">
			<el-form :model="addForm" :inline="true" ref="addForm" :rules="addFormRules" class="formbox">
				<el-form-item label="照片标题" prop="title" style="width: 100%">
					<el-input v-model="addForm.title" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="排序" prop="sort" style="width: 100%">
					<el-input v-model="addForm.sort" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="图片" prop="photosUrl" class="delbgimg" style="width: 100%">
					<div class="upimgbox" :style="{ backgroundImage: 'url(' + addForm.photosUrl + ')',backgroundColor: '#f5f5f5'}">
						<input ref="file" type="file" class="file" @change="choosefile($event, '0')" />
					</div>
					<i class="del-tip1" v-if="editflag" @click="handlesyimg">删除</i>
				</el-form-item>
			</el-form>
			<div class="dialog-foot">
				<span class="btn-cancel" @click="handlecancel">取消</span>
				<span class="btn-save" @click="handleSubmit">确定</span>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { getAlbumList, deleteAlbum, addAlbum, albumDetail, updateAlbum } from '../../../api/api.js'
	import axios from 'axios'
	import { VueEditor, Quill } from 'vue2-editor'
	export default {
		props: {
			isEdit: {
				type: Boolean,
				default: false,
			},
			isRead: {
				type: Boolean,
				default: false,
			},
			planId: {
				type: String,
				default: 0,
			},
		},
		components: {
			VueEditor,
		},
		data() {
			return {
				villagelist: [],
				filters: {
					villageInfoId: '',
					title: '',
					size: 10,
					currentPage: 1,
				},
				albumList: [],
				listLoading: false,
				albumTotal: 0,
				currentPage: 1,
				currentPage1: 1,
				pagesize: 10,
				adddialog: false,
				diatitle: '',
				addForm: {
					// villageInfoId: '',
					// id: '',
					title: '',
					sort: '',
					photo: '',
					photosUrl: '../../assets/img/empty.png',
					content: ''
				},
				addFormRules: {
					title: [{
						required: true,
						message: '请输入标题',
						trigger: 'blur'
					}],
					sort: [{
						required: true,
						message: '请输入排序',
						trigger: 'blur'
					}],
					introduce: [{
						required: true,
						message: '请输入介绍',
						trigger: 'blur'
					}],
					photosUrl: [{
						required: true,
						message: '请上传图片',
						trigger: 'blur'
					}]
				},
				editflag: false,
				customToolbar: [
					['bold', 'italic', 'underline'],
					[{
						list: 'ordered'
					}, {
						list: 'bullet'
					}],
					['image', 'code-block'],
					[{
						indent: '-1'
					}, {
						indent: '+1'
					}],
					[{
						size: ['small', false, 'large', 'huge']
					}],
				],
			}
		},
		mounted() {
			// this.getqylist()
			// this.getlist()
			this.AlbumList()
		},
		methods: {
			// 获取相册列表
			AlbumList() {
				let para = {
					trainingPlanId: this.planId,
					title: this.filters.title,
					pagesize: this.filters.size,
					pageNum: this.filters.currentPage
				}
				getAlbumList(para).then((res) => {
					console.log(res)
					this.albumList = res.data.rows
					this.albumTotal = res.data.total
				})
			},
			// 获取区域列表
			getqylist: function() {
				UserAllLocation().then((res) => {
					this.villagelist = res.data.data
				})
			},

			// 列表
			getlist(val) {
				let para = {
					villageInfoId: this.filters.villageInfoId,
					title: this.filters.title,
					pageSize: this.filters.size,
					pageNum: this.filters.current,
				}
				if (val) {
					para.pageNum = val
					this.currentPage1 = val
				}
				RActivitiesList(para).then((res) => {
					this.datalist = res.data.rows
					this.total = res.data.total
				})
			},
			// 重置
			resetForm: function(filters) {
				this.filters = {
					title: '',
				}

				this.AlbumList()
			},
			// 分页
			handleSizeChange: function(size) {
				this.pagesize = size
				this.filters.size = size
				this.AlbumList()
			},
			// 分页
			handleCurrentChange: function(val) {
				this.filters.currentPage = val
				this.AlbumList()
			},
			// 新增
			handleAdd: function() {
				this.adddialog = true
				this.diatitle = '新增照片'
				this.addForm = {
					title: '',
					sort: '',
					introduce: '',
					photo: '',
					photosUrl: "url('../img/empty.png') no-repeat",
					// photosUrl:'../../assets/img/empty.png'
				}
				this.editflag = false
			},
			// 图片上传、上传文件
			choosefile: function(event, type) {
				let file = this.$refs.file.files[0]
				const fileTypes = ['png', 'jpg', 'jpeg']
				let suffix = file.name.substring(file.name.lastIndexOf('.') + 1)
				if (!fileTypes.includes(suffix)) {
					this.$message({
						message: '请上传png/jpg/jpeg格式文件',
						type: 'error',
					})
					return
				}
				this.uploadfile(file, type)
			},
			// 文件上传后获取数据
			uploadfile: function(data, type) {
				let random = new Date().getTime().toString()
				let formData = new FormData()
				formData.append('file', data)
				axios
					.post('/system/oss/upload?t=' + random, formData, {
						headers: {
							'Content-Type': 'multipart/form-data',
						},
						withCredentials: true,
					})
					.then((res) => {
						if (res.data.code == 200) {
							this.addForm.photos = res.data.data.ossId
							this.addForm.photosUrl = res.data.data.url
							this.editflag = true
						} else {
							this.$message({
								message: res.data.msg,
								type: 'error',
							})
						}
					})
					.catch((res) => {
						console.log(res, '2')
					})
			},
			// 删除图片
			handlesyimg: function() {
				this.addForm.photos = ''
				this.addForm.photosUrl = require('@/assets/img/empty.png')
				this.$refs.file.value = ''
				this.editflag = false
			},
			// 取消
			handlecancel: function() {
				this.$refs.addForm.resetFields()
				this.addForm = {
					villageInfoId: '',
					id: '',
					title: '',
					sort: '',
					photos: '',
					photosUrl: "url('../img/empty.png') no-repeat",
				}
				this.editflag = false
				this.adddialog = false
			},
			// 保存
			handleSubmit: function() {
				console.log('----', this.addForm)
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						let para = {
							trainingPlanId: this.planId,
							id: this.addForm.id,
							title: this.addForm.title,
							sort: this.addForm.sort,
							picture: this.addForm.photos,
						}
						if (this.addForm.id) {
							updateAlbum(para).then((res) => {
								if (res.code == '200') {
									this.$message({
										message: res.msg,
										type: 'success',
									})
									this.$refs.addForm.resetFields()
									this.adddialog = false
									this.AlbumList()
								} else {
									this.$message({
										message: res.msg,
										type: 'error',
									})
								}
							})
						} else {
							addAlbum(para).then((res) => {
								if (res.code == '200') {
									this.$message({
										message: res.msg,
										type: 'success',
									})
									this.$refs.addForm.resetFields()
									this.adddialog = false
									this.AlbumList()
								} else {
									this.$message({
										message: res.msg,
										type: 'error',
									})
								}
							})
						}
					}
				})
			},
			// 编辑
			handlEdit: function(row) {
				this.adddialog = true
				this.diatitle = '编辑'
				this.getDetail(row.id)
			},
			// 详情
			getDetail: function(id) {
				albumDetail(id).then((res) => {
					console.log(res, 'xq')
					this.addForm = res.data.data
					this.addForm.photosUrl = res.data.data.pictureUrl
					if (this.addForm.photosUrl == null || this.addForm.photosUrl == '') {
						this.addForm.photosUrl = require('@/assets/img/empty.png')
						this.addForm.photos = ''
						this.editflag = false
					} else {
						this.editflag = true
					}
				})
			},
			// 删除
			handlDel(id) {
				deleteAlbum(id).then((res) => {
					if (res.code == '200') {
						this.$message({
							message: res.msg,
							type: 'success',
						})
						this.AlbumList()
					} else {
						this.$message({
							message: res.msg,
							type: 'error',
						})
					}
				})
			},
		},
	}
</script>

<style scoped>
	.title {
		margin: 0 auto;
	}

	.hd {
		display: flex;
	}
</style>