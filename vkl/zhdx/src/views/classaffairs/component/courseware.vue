<template>
	<div class="app-container">
		<div class="m-search">
			<el-form :inline="true" :model="couresWareFilter" ref="couresWareFilter" id="couresWareFilter"
				class="search-form">
				<el-form-item label="" prop="name">
					<el-input v-model="couresWareFilter.name" placeholder="课件名称"></el-input>
				</el-form-item>
				<el-form-item label="" prop="lecturer">
					<el-input v-model="couresWareFilter.lecturer" placeholder="授课老师"></el-input>
				</el-form-item>
				<div class="search-btnbox">
					<span class="btn search-btn" @click="CourseWareList()">查询</span>
					<span class="btn reset-btn" @click="resetFilter('couresWareFilter')">重置</span>
				</div>
			</el-form>
		</div>
		<div class="btn-box">
			<span class="btn search-btn" @click="openAddWareDialog()" v-if="isEdit">上传课件</span>
		</div>
		<div class="m-table">
			<el-table :data="courseWareList" highlight-current-row v-loading="listLoading" style="width: 100%" border
				:row-class-name="tableRowClassName" :header-cell-style="{ 'text-align': 'center' }"
				:cell-style="{ 'text-align': 'center' }">
				<el-table-column type="index" label="序号" width="70"></el-table-column>
				<el-table-column prop="name" label="课件名称"> </el-table-column>
				<el-table-column prop="lecturer" label="授课老师"> </el-table-column>
				<el-table-column prop="" label="操作">
					<template slot-scope="scope">
						<span class="edit-title" @click="downloadWare(scope.row.courseware)">下载&nbsp;&nbsp;</span>
						<el-popover v-if="isEdit" :ref="scope.row.resourcesMaterialId" placement="top"
							popper-class="popover">
							<p class="del-tip">是否删除该课件？</p>
							<div class="pop-btnbox">
								<span class="cancel-btn"
									@click="visibleGdCancel(scope.row.resourcesMaterialId)">取消</span>
								<span class="ok-btn"
									@click="deleteCourseWareByID(scope.row.resourcesMaterialId)">确定</span>
							</div>
							<span slot="reference" class="del-title">删除</span>
						</el-popover>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="m-pagination">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
				:current-page="currentPage" :page-size="pagesize" layout="prev, pager, next" prev-text="上一页"
				next-text="下一页" :total="courseWareTotal">
			</el-pagination>
			<i class="total">共有{{ courseWareTotal }}条数据</i>
		</div>
		<!-- 新增 -->
		<el-dialog :visible.sync="wareDialog" v-if="wareDialog" class="g-dialog min-dia600" title="上传课件"
			:append-to-body=true>
			<el-form :model="wareForm" :inline="true" ref="wareForm" :rules="wareFormRules" class="addform">
				<el-form-item label="授课老师" prop="title" style="width: 100%">
					<el-input v-model="wareForm.lecturer" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="课件" prop="sort" style="width: 100%">
					<input ref="file" type="file" class="file" @change="choosefile($event, '0')" />
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
	import {
		getCourseWareList,
		deleteCourseWare,
		addCourseWare,
	} from '../../../api/api.js'
	import axios from 'axios'
	import Course from './course.vue'
	export default {
		props: {
			isShowReports: {
				type: Boolean,
				default: false,
			},
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
		data() {
			return {
				courseWareList: [],
				wareDialog: false,
				listLoading: false,
				courseWareTotal: 0,
				pagesize: 10,
				currentPage: 1,
				currentPage1: 1,
				reportList: [{
					index: '0',
					name: '张三',
					status: '0'
				}],
				couresWareFilter: {
					name: '',
					lecturer: '',

					currentPage: 1,
					size: 10,
				},
				wareForm: {
					lecturer: '',
					courseware: '',
					name: '',
				},
				wareFormRules: {},
			}
		},
		mounted() {
			this.CourseWareList()
		},
		methods: {
			/**
			 * 学员管理
			 * openAddStudentDialog:打开新增学员弹窗
			 * choiceSex:选择性别
			 * updateStudent:新增-编辑学生信息
			 */
			// 获取教学课件列表
			CourseWareList() {
				let para = {
					trainingPlanId: this.planId,
					// title:this.filters.title
					name: this.couresWareFilter.name,
					lecturer: this.couresWareFilter.lecturer,
					pageSize: this.couresWareFilter.size,
					pageNum: this.couresWareFilter.currentPage,
				}
				getCourseWareList(para).then((res) => {
					console.log(res)
					this.courseWareList = res.data.rows
					this.courseWareTotal = res.data.total
				})
			},
			// 重置表格
			resetFilter: function(filters) {
				this.couresWareFilter = {
					name: '',
					lecturer: '',
					current: 1,
					size: 10,
				}
				this.CourseWareList()
			},
			// 关闭新增课程弹窗
			handlecancel: function() {
				// this.$refs.wareForm.resetFields()
				this.wareForm = {
					lecturer: '',
					courseware: '',
					name: '',
				}
				// this.editflag = false
				this.wareDialog = false
			},
			// 删除课件
			deleteCourseWareByID(id) {
				deleteCourseWare(id).then((res) => {
					if (res.code == '200') {
						this.$message({
							message: res.msg,
							type: 'success',
						})
						this.CourseWareList()
					} else {
						this.$message({
							message: res.msg,
							type: 'error',
						})
					}
				})
			},
			// 下载课件
			downloadWare(ossid) {
				let url = '/system/oss/download/' + ossid
				this.comjs.downfile(url)
			},
			// 取消删除
			visibleGdCancel(id) {
				console.log('删除', id)
				console.log(this.$refs)
				this.$refs[id].doClose()
			},
			// 上传文件到oss
			choosefile: function(event, type) {
				let file = this.$refs.file.files[0]
				this.uploadfile(file, type)
			},
			// 文件上传后获取数据
			uploadfile: function(data, type) {
				let random = new Date().getTime().toString()
				let formData = new FormData()
				formData.append('file', data)
				axios.post('/system/oss/upload?t=' + random, formData, {
						headers: {
							'Content-Type': 'multipart/form-data',
						},
						withCredentials: true,
					})
					.then((res) => {
						debugger
						if (res.data.code == 200) {
							this.wareForm.courseware = res.data.data.ossId
							// this.addForm.photosUrl = res.data.data.url
							this.wareForm.name = res.data.data.fileName
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

			// 打开新增课件窗口
			openAddWareDialog() {
				this.wareDialog = true
			},
			// 上传课件
			handleSubmit() {
				console.log('----', this.wareForm)
				this.$refs.wareForm.validate((valid) => {
					if (valid) {
						let para = {
							trainingPlanId: this.planId,
							lecturer: this.wareForm.lecturer,
							courseware: this.wareForm.courseware,
							name: this.wareForm.name,
						}
						console.log('para', para)
						addCourseWare(para).then((res) => {
							if (res.code == '200') {
								this.$message({
									message: res.msg,
									type: 'success',
								})
								// this.$refs.addForm.resetFields()
								this.wareDialog = false
								this.CourseWareList()
							} else {
								this.$message({
									message: res.msg,
									type: 'error',
								})
							}
						})
					}
				})
			},
			//新增-编辑学生信息
			updateStudent() {
				// todo
				this.studentDialog = false
			},
			// 取消新增-编辑学生信息
			cancalUpdateStudent() {
				// todo
				this.studentDialog = false
			},
			// 隔行颜色
			tableRowClassName: function(rowIndex) {
				if (rowIndex.rowIndex % 2 != 0) {
					return 'evenRow'
				}
				return 'oddRow'
			},
			// 分页
			handleSizeChange: function(size) {
				this.pagesize = size
				this.couresWareFilter.size = size
				this.courseWareList()
			},
			// 分页
			handleCurrentChange: function(val) {
				this.couresWareFilter.currentPage = val
				this.courseWareList()
			},
		},
	}
</script>