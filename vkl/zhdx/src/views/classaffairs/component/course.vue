<template>
	<div class="app-container">
		<div class="plan-cont" v-if="courseList.length == 0">
			<div class="no-data">暂无数据</div>
		</div>
		<div class="plan-cont" v-if="courseList.length > 0">
			<div class="house-lt">
				<div class="tab-ul">
					<div v-for="(item, index) in courseList" :key="index"
						:class="['tab-lst', { active: currentDate == item.time }]" @click="changeCourse(item.time)">
						{{ item.time }}
					</div>
				</div>
			</div>
			<div class="house-rt">
				<div class="btn-box">
					<span class="btn reset-btn" @click="derivedCourseForm()">导出课程表</span>
				</div>
				<div class="morning">
					<div class="morning-title">上午</div>
					<div v-for="(item, index) in courseList">
						<div v-if="item.time == currentDate">
							<div class="m-table">
								<el-table :data="filter(item.jwCourseArrangeVoList, '0')" highlight-current-row
									v-loading="listLoading" style="width: 100%" border
									:row-class-name="tableRowClassName" :header-cell-style="{ 'text-align': 'center' }"
									:cell-style="{ 'text-align': 'center' }">
									<el-table-column type="index" label="序号" width="80">
									</el-table-column>
									<el-table-column prop="" label="时间" width="200">
										<template slot-scope="scope">
											{{ scope.row.startTime }} ~ {{ scope.row.endTime }}
										</template>
									</el-table-column>
									<el-table-column prop="content" label="授课内容" width="100" :show-overflow-tooltip="true">
									</el-table-column>
									<el-table-column prop="teachingForm" label="教学形式" width="100" :show-overflow-tooltip="true">
									</el-table-column>
									<el-table-column prop="courseCategory" label="课程类别" width="100" :show-overflow-tooltip="true">
									</el-table-column>
									<el-table-column prop="speaker" label="主讲人" :show-overflow-tooltip="true">
									</el-table-column>
									<el-table-column prop="classLocation" label="上课地点" width="100" :show-overflow-tooltip="true">
									</el-table-column>
								</el-table>
							</div>
						</div>
					</div>
					<div class="morning-title">下午</div>
					<div v-for="(item, index) in courseList"  class="qfbox">
						<div v-if="item.time == currentDate">
							<div class="m-table">
								<el-table :data="filter(item.jwCourseArrangeVoList, '1')"
									highlight-current-row v-loading="listLoading" style="width: 100%" border
									:row-class-name="tableRowClassName"
									:header-cell-style="{ 'text-align': 'center' }"
									:cell-style="{ 'text-align': 'center' }">
									<el-table-column type="index" label="序号" width="80">
									</el-table-column>
					
									<el-table-column prop="" label="时间" width="200">
										<template slot-scope="scope">
											{{ scope.row.startTime }} ~ {{ scope.row.endTime }}
										</template>
									</el-table-column>
									<el-table-column prop="content" label="授课内容" width="100" :show-overflow-tooltip="true">
									</el-table-column>
									<el-table-column prop="teachingForm" label="教学形式" width="100" :show-overflow-tooltip="true">
									</el-table-column>
									<el-table-column prop="courseCategory" label="课程类别" width="100" :show-overflow-tooltip="true">
									</el-table-column>
									<el-table-column prop="speaker" label="主讲人" width="100" :show-overflow-tooltip="true">
									</el-table-column>
									<el-table-column prop="classLocation" label="上课地点" width="100" :show-overflow-tooltip="true">
									</el-table-column>
									
								</el-table>
							</div>
						</div>
					</div>
					<div class="morning-title">晚上</div>
					<div v-for="(item, index) in courseList"  class="qfbox">
						<div v-if="item.time == currentDate">
							<div class="m-table">
								<el-table :data="filter(item.jwCourseArrangeVoList, '2')"
									highlight-current-row v-loading="listLoading" style="width: 100%" border
									:row-class-name="tableRowClassName"
									:header-cell-style="{ 'text-align': 'center' }"
									:cell-style="{ 'text-align': 'center' }">
									<el-table-column type="index" label="序号" width="80">
									</el-table-column>
									<el-table-column prop="" label="时间" width="200">
										<template slot-scope="scope">
											{{ scope.row.startTime }} ~ {{ scope.row.endTime }}
										</template>
									</el-table-column>
									<el-table-column prop="content" label="授课内容" width="100" :show-overflow-tooltip="true">
									</el-table-column>
									<el-table-column prop="teachingForm" label="教学形式" width="100" :show-overflow-tooltip="true">
									</el-table-column>
									<el-table-column prop="courseCategory" label="课程类别" width="100" :show-overflow-tooltip="true">
									</el-table-column>
									<el-table-column prop="speaker" label="主讲人" width="100" :show-overflow-tooltip="true">
									</el-table-column>
									<el-table-column prop="classLocation" label="上课地点" width="100" :show-overflow-tooltip="true">
									</el-table-column>
									
								</el-table>
							</div>
						</div>
					</div>
				</div>
				<div class="afternoon"></div>
				<div class="evening"></div>
			</div>
		</div>
		<!-- 新增课程弹窗 -->
		<el-dialog :visible.sync="addCourseDialog" v-if="addCourseDialog" class="g-dialog min-dia600"
			:title="addCourseDialogTitle" :append-to-body="true">
			<div class="dia-contont">
				<div class="dia-cont">
					<el-form :model="courseForm" :inline="true" class="addform" ref="courseForm"
						:rules="courseFormRules">
						<el-form-item label="时间段" prop="timeSlot">
							<el-radio-group v-model="courseForm.timeSlot">
								<el-radio label="0">上午</el-radio>
								<el-radio label="1">下午</el-radio>
								<el-radio label="2">晚上</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item label="时间" prop="">
							<el-time-picker is-range editable v-model="timeSE" range-separator="至"
								start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" :clearable="false">
							</el-time-picker>
						</el-form-item>
						<el-form-item style="width: 100%" label-width="180px" label="授课内容（课程名称）" prop="content">
							<el-input style="width: 100%" v-model="courseForm.content"
								placeholder="授课内容（课程名称）"></el-input>
						</el-form-item>
						<el-form-item label="教学形式" prop="teachingForm">
							<el-input v-model="courseForm.teachingForm" placeholder="教学形式"></el-input>
						</el-form-item>
						<el-form-item label="课程类别" prop="courseCategory">
							<el-input v-model="courseForm.courseCategory" placeholder="课程类别"></el-input>
						</el-form-item>
						<el-form-item label="主讲人" prop="speaker">
							<el-input v-model="courseForm.speaker" placeholder="主讲人"></el-input>
						</el-form-item>
						<el-form-item label="上课地点" prop="classLocation">
							<el-input v-model="courseForm.classLocation" placeholder="上课地点"></el-input>
						</el-form-item>
					</el-form>
					<div class="dialog-foot">
						<span class="btn-cancel" @click="handlecloseCourseDialog()">取消</span>
						<span class="btn-save" @click="addCourseByPlanID()">完成</span>
					</div>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import {
		getCourseListByPlanID,
		deleteCourse,
		updateCourse,
		courseDetail,
	} from '../../../api/api.js'
	import {
		convertDateTimeManual
	} from '../../../api/timeConvert.js'
	import moment from 'moment'
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
				addCourseDialog: false,
				listLoading: false,
				total: 0,
				pagesize: 10,
				currentPage: 1,
				currentPage1: 1,
				reportList: [{
					index: '0',
					name: '张三',
					status: '0'
				}],
				studentFilter: {
					name: '',
					studentID: '',
					duties: '',
					current: 1,
					size: 10,
				},
				multion: [],
				checkinRuleDialog: false,
				checkinDetailDialog: false,
				workTypeManageDialog: false,
				checkinForm: {
					startTime: '',
					endTime: '',
				},
				checkinFormRules: {},
				stopSubmit: true,
				breakfast: ['豆浆', '油条'],
				courseList: [],
				currentDate: '',
				timeSE: [new Date(2024, 1, 1, 0, 0), new Date(2024, 1, 1, 22, 0)],
				courseForm: {
					courseId: '',
					planId: '',
					courseDate: '',
					timeSlot: '0',
					time: [],
					content: '',
					teachingForm: '',
					courseCategory: '',
					speaker: '',
					classLocation: '',
				},
				courseFormRules: {
					timeSlot: [{
						required: true,
						message: '请选择时间类型',
						trigger: 'blur'
					}, ],
					time: [{
						required: true,
						type: 'array',
						message: '请选择时间',
						trigger: 'blur',
					}, ],
					content: [{
						required: true,
						message: '请输入课程名称',
						trigger: 'blur'
					}, ],
					teachingForm: [{
						required: true,
						message: '请选择教学类型',
						trigger: 'blur'
					}, ],
					courseCategory: [{
						required: true,
						message: '请选择课程类型',
						trigger: 'blur'
					}, ],
					speaker: [{
						required: true,
						message: '请输入教师名称',
						trigger: 'blur'
					}, ],
					classLocation: [{
						required: true,
						message: '请输入课程位置',
						trigger: 'blur'
					}, ],
				},
			}
		},
		mounted() {
			// this.getlist('')
			// this.TrainingPlanList()
			this.getCourseList()
		},
		methods: {
			/**
			 * 用餐管理
			 * openTodayMenuDialog:打开当日菜单弹窗
			 * openWorkTypeDialog:打开新增-编辑作业类型弹窗
			 * choiceSex:选择性别
			 * updateStudent:新增-编辑学生信息
			 * 勾选
			 */
			// 导出课程表
			derivedCourseForm() {
				console.log('导出课程表')
				let para = {
					planId: this.planId,
					courseDate: this.currentDate,
				}
				let url =
					'/jw/courseArrange/export?planId=' +
					para.planId +
					'&courseDate=' +
					para.courseDate
				this.comjs.downfile(url)
			},
			// 获取实时课程安排
			getCourseList(id) {
				// console.log('----获取实时课程安排', id)
				let para = {
					planId: this.planId,
				}
				getCourseListByPlanID(para).then((res) => {
					this.courseList = res.data.data
					if (this.courseList.length > 0) {
						this.currentDate = res.data.data[0].time
					}

					console.log(this.courseList)
				})
			},
			// 删除课程
			deleteCourseByID(id) {
				deleteCourse(id).then((res) => {
					console.log(res, '10101')
					if (res.code == '200') {
						this.$message({
							message: res.msg,
							type: 'success',
						})
					} else {
						this.$message({
							message: res.msg,
							type: 'error',
						})
					}
					// this.$refs[id].doClose()
					this.getCourseList(this.planId)
				})
			},
			// 编辑课程
			editCourse(row) {
				// this.courseForm.id = id
				console.log(row)
				courseDetail(row.id).then((res) => {
					// console.log(res)
					this.courseForm = res.data.data
					//   console.log('this.courseForm', this.courseForm)
					let time = [
						convertDateTimeManual(this.currentDate, this.courseForm.startTime),
						convertDateTimeManual(this.currentDate, this.courseForm.endTime),
					]
					//  console.log('time', time)
					// this.courseForm.time = time
					this.timeSE = time
				})

				console.log('this.courseForm.time', this.courseForm.time)
				this.openAddCourseDialog('edit')
			},
			// 打开新增课程弹窗
			openAddCourseDialog(type) {
				if (type == 'add') {
					this.addCourseDialogTitle = '新增课程'
				} else {
					this.addCourseDialogTitle = '编辑课程'
				}
				this.addCourseDialog = true
			},
			// 关闭新增课程弹窗
			handlecloseCourseDialog() {
				this.addCourseDialog = false
				this.courseForm = {
					courseId: '',
					planId: '',
					courseDate: '',
					timeSlot: '0',
					time: [],
					content: '',
					teachingForm: '',
					courseCategory: '',
					speaker: '',
					classLocation: '',
				}
				this.timeSE = [new Date(2024, 1, 1, 0, 0), new Date(2024, 1, 1, 23, 0)]
			},
			// 新增课程
			addCourseByPlanID() {
				this.$refs.courseForm.validate((valid) => {
					console.log('valid', valid)
					if (valid) {
						let para = {
							id: this.courseForm.id,
							planId: this.planId,
							courseDate: this.currentDate,
							timeSlot: this.courseForm.timeSlot,
							startTime: moment(this.timeSE[0]).format('HH:mm:ss'),
							endTime: moment(this.timeSE[1]).format('HH:mm:ss'),
							// time: this.courseForm.time,
							content: this.courseForm.content,
							teachingForm: this.courseForm.teachingForm,
							courseCategory: this.courseForm.courseCategory,
							speaker: this.courseForm.speaker,
							classLocation: this.courseForm.classLocation,
						}
						if (this.courseForm.id) {
							updateCourse(para).then((res) => {
								if (res.code == '200') {
									this.$message({
										message: res.msg,
										type: 'success',
									})
								} else {
									this.$message({
										message: res.msg,
										type: 'error',
									})
								}
								this.getCourseList(this.planId)
							})
						} else {
							addCourse(para).then((res) => {
								if (res.code == '200') {
									this.$message({
										message: res.msg,
										type: 'success',
									})
								} else {
									this.$message({
										message: res.msg,
										type: 'error',
									})
								}
								this.getCourseList(this.planId)
							})
						}
					} else {
						console.log('error submit!!')
						return
					}
				})
				this.handlecloseCourseDialog()
			},
			// 切换课程查看当天课程
			changeCourse(date) {
				this.currentDate = date
			},
			//打开考勤规则设置弹窗
			openCheckinRuleDialog() {
				this.checkinRuleDialog = true
			},
			// 打开教学评估汇总表弹窗
			openCheckinDetailDialog() {
				this.checkinDetailDialog = true
			},

			// 勾选
			handleSelectionChange: function(data) {
				for (var i = 0; i < data.length; i++) {
					this.multion.push(data[i].id)
				}
			},
			// 打开作业类型管理弹窗
			openWorkTypeManageDialog() {
				this.workTypeManageDialog = true
			},
			// 打开新增-编辑作业类型弹窗
			openWorkTypeDialog() {
				this.workTypeDialog = true
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
				this.filters.size = size
				this.getlist('')
			},
			// 分页
			handleCurrentChange: function(val) {
				this.filters.current = val
				this.getlist(val)
			},
			filter(data, type) {
				console.log(type)
				return data.filter((item) => item.timeSlot == type)
			},
		},
	}
</script>
<style>
	.xq-whole .name {
		width: 296px !important;
	}

	.lab {
		width: calc(100% - 305px) !important;
	}

	.last {
		width: 296px !important;
	}

	.lastlab {
		width: calc(100% - 305px) !important;
	}

	.menu {
		width: 32%;
		height: auto;
		float: left;
		margin-left: 5px;

		/* background-color: rebeccapurple; */
	}

	.menuTitle {
		width: 100%;
		height: 40px;
		line-height: 40px;
		text-align: center;
		background-color: #bdbdbd;
		border: 1px solid #848484;
	}

	.food {
		width: 100%;
		height: 40px;
		line-height: 40px;
		text-align: center;
		border: 1px solid #848484;
		border-top: none;
	}

	.checkin {
		width: 49%;
		height: 95%;
		float: left;
		margin-right: 5px;
	}

	.checkinTitle {
		display: block;
		float: left;
		width: 100%;
		line-height: 40px;
		font-size: 18px;
		margin-bottom: 10px;
	}

	.checkinTitle .title {
		font-weight: bold;
	}

	.btnr {
		display: inline-block;
		/* float: left; */
		float: right;
		height: 40px;
		width: 120px;
		line-height: 38px;
		cursor: pointer;
		border: 1px solid #ececec;
		text-align: center;
		border-radius: 2px;
		box-sizing: border-box;
	}
</style>