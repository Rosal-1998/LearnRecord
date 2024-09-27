<template>
	<div class="g-cont">
		<div class="m-contain">
			<div class="m-search" style="float: left">
				<el-form :inline="true" :model="filters" ref="filters" id="filters" class="search-form">
					<el-form-item label="" prop="shiftName">
						<el-input v-model="filters.shiftName" placeholder="班次名称"></el-input>
					</el-form-item>
					<el-form-item label="" prop="time">
						<el-date-picker v-model="filters.time" type="daterange" start-placeholder="年/月/日"
							end-placeholder="年/月/日"></el-date-picker>
					</el-form-item>
					<el-form-item label="" prop="periodsNumber">
						<el-input v-model="filters.periodsNumber" placeholder="期数"></el-input>
					</el-form-item>
					<el-form-item label="" prop="plan">
						<el-select v-model="filters.plan" placeholder="是否计划内">
							<el-option value="0" label="是"></el-option>
							<el-option value="1" label="否"></el-option>
						</el-select>
					</el-form-item>
					<div class="search-btnbox">
						<span class="btn search-btn" @click="TrainingPlanList()">查询</span>
						<span class="btn reset-btn" @click="resetForm('filters')">重置</span>
					</div>
				</el-form>
			</div>

			<div class="m-table">
				<el-table :data="trainingPlanList" highlight-current-row v-loading="listLoading" style="width: 100%"
					border :row-class-name="tableRowClassName" :header-cell-style="{ 'text-align': 'center' }"
					:cell-style="{ 'text-align': 'center' }">
					<el-table-column type="index" label="序号" width="80">
					</el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="shiftName" label="班次名称"> </el-table-column>
					<el-table-column prop="startTime" label="开始时间"> </el-table-column>
					<el-table-column prop="endTime" label="结束时间"> </el-table-column>
					<el-table-column prop="status" label="状态">
						<template slot-scope="scope">
							<span v-if="scope.row.status == '1'" class="f-black">已办</span>
							<span v-else-if="scope.row.status == '0'" class="f-green">待办</span>
						</template>
					</el-table-column>
					<el-table-column prop="educational" label="学制(天)">
					</el-table-column>
					<el-table-column prop="number" label="人数"> </el-table-column>
					<el-table-column prop="plan" label="是否计划内">
						<template slot-scope="scope">
							<span v-if="scope.row.plan == '1'">否</span>
							<span v-else-if="scope.row.plan == '0'">是</span>
						</template>
					</el-table-column>
					<el-table-column prop="periodsNumber" label="期数"> </el-table-column>
					<el-table-column prop="trainingTarget" label="培训对象">
					</el-table-column>
					<el-table-column prop="" label="操作">
						<template slot-scope="scope">
							<span class="edit-title" @click="handlEdit(scope.row)">查看</span>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="m-pagination">
				<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
					:current-page="currentPage" :page-size="pagesize" layout="prev, pager, next" prev-text="上一页"
					next-text="下一页" :total="total">
				</el-pagination>
				<i class="total">共有{{ total }}条数据</i>
			</div>
		</div>
		<!-- 实时课程安排弹窗 -->
		<el-dialog :visible.sync="coursePlanDialog" v-if="coursePlanDialog" @close="coursePlanDialogClose"
			class="g-dialog min-dia600" :title="trainPlanDetail.shiftName">
			<div class="course-cont">
				<div class="house-lt">
					<div class="tab-ul">
						<div :class="['tab-lst', { active: current == 0 }]" @click="handletab('0')">
							培训计划信息
						</div>
						<div :class="['tab-lst', { active: current == 1 }]" @click="handletab('1')">
							实时课程安排
						</div>
					</div>
				</div>
				<div class="house-rt">
					<div class="arrange-cont" v-if="current == 0">
						<el-row>
							<el-col :span="4">
								<div class="grid-content bg-purple floatR">
									<span class="red-star">*</span>
									班次名称：
								</div>
							</el-col>
							<el-col :span="20">
								<div class="grid-content bg-purple-light pdd5">
									{{ trainPlanDetail.shiftName }}
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="4">
								<div class="grid-content bg-purple floatR"> <span class="red-star">*</span>办班开始时间：</div>
							</el-col>
							<el-col :span="8">
								<div class="grid-content bg-purple-light pdd5">
									{{ trainPlanDetail.startTime }}
								</div>
							</el-col>
							<el-col :span="4">
								<div class="grid-content bg-purple floatR"> <span class="red-star">*</span>办班结束时间：</div>
							</el-col>
							<el-col :span="8">
								<div class="grid-content bg-purple-light pdd5">
									{{ trainPlanDetail.endTime }}
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="4">
								<div class="grid-content bg-purple floatR"> <span class="red-star">*</span>办班时间：</div>
							</el-col>
							<el-col :span="20">
								<div class="grid-content bg-purple-light pdd5">
									{{ trainPlanDetail.classSchedule }}
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="4">
								<div class="grid-content bg-purple floatR">学制（天）：</div>
							</el-col>
							<el-col :span="8">
								<div class="grid-content bg-purple-light pdd5">
									{{ trainPlanDetail.educational }}
								</div>
							</el-col>
							<el-col :span="4">
								<div class="grid-content bg-purple floatR"> <span class="red-star">*</span>人数：</div>
							</el-col>
							<el-col :span="8">
								<div class="grid-content bg-purple-light pdd5">
									{{ trainPlanDetail.number }}
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="4">
								<div class="grid-content bg-purple floatR">总学时：</div>
							</el-col>
							<el-col :span="8">
								<div class="grid-content bg-purple-light pdd5">
									{{ trainPlanDetail.totalHours }}
								</div>
							</el-col>
							<el-col :span="4">
								<div class="grid-content bg-purple floatR"> <span class="red-star">*</span>是否计划内：</div>
							</el-col>
							<el-col :span="8">
								<div class="grid-content bg-purple-light pdd5">
									{{ trainPlanDetail.plan == 0 ? '是' : '否' }}
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="4">
								<div class="grid-content bg-purple floatR"> <span class="red-star">*</span>报到开始时间：</div>
							</el-col>
							<el-col :span="8">
								<div class="grid-content bg-purple-light pdd5">
									{{ trainPlanDetail.registrationStartTime }}
								</div>
							</el-col>
							<el-col :span="4">
								<div class="grid-content bg-purple floatR"> <span class="red-star">*</span>报到结束时间：</div>
							</el-col>
							<el-col :span="8">
								<div class="grid-content bg-purple-light pdd5">
									{{
                  trainPlanDetail.registrationEndTime
                }}
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="4">
								<div class="grid-content bg-purple floatR">培训对象：</div>
							</el-col>
							<el-col :span="8">
								<div class="grid-content bg-purple-light pdd5">
									{{ trainPlanDetail.trainingTarget }}
								</div>
							</el-col>
							<el-col :span="4">
								<div class="grid-content bg-purple floatR">培训内容：</div>
							</el-col>
							<el-col :span="8">
								<div class="grid-content bg-purple-light pdd5">
									{{trainPlanDetail.content }}
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="4">
								<div class="grid-content bg-purple floatR">年度：</div>
							</el-col>
							<el-col :span="8">
								<div class="grid-content bg-purple-light pdd5">
									{{ trainPlanDetail.year }}
								</div>
							</el-col>
							<el-col :span="4">
								<div class="grid-content bg-purple floatR">期数：</div>
							</el-col>
							<el-col :span="8">
								<div class="grid-content bg-purple-light pdd5">
									{{  trainPlanDetail.periodsNumber }}
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="4">
								<div class="grid-content bg-purple floatR">备注：</div>
							</el-col>
							<el-col :span="20">
								<div class="grid-content bg-purple-light pdd5">
									{{ trainPlanDetail.remark }}
								</div>
							</el-col>
						</el-row>
					</div>
					<div class="plan-cont" v-if="current == 1">
						<div class="house-lt">
							<div class="tab-ul">
								<div v-for="(item, index) in courseList" :key="index"
									:class="['tab-lst', { active: currentDate == item.time }]"
									@click="changeCourse(item.time)">
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
								<div v-for="(item, index) in courseList"  class="qfbox">
									<div v-if="item.time == currentDate">
										<div class="m-table">
											<el-table :data="filter(item.jwCourseArrangeVoList, '0')" highlight-current-row
												v-loading="listLoading" style="width: 100%" border
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
				</div>
			</div>
		</el-dialog>

	</div>
</template>

<script>
	import {
		UserList,
		AddUser,
		UpdateUser,
		DelUser,
		UserUpdateStatus,
		UserDeptTree,
		Userdetal,
		UserInfo,
		ResetPassword,
		getTrainingPlanList,
		TrainPlanDetail,
		getCourseListByPlanID,
	} from '../../api/api.js'
	import qs from 'qs'
	import axios from 'axios'
	import moment from 'moment'
	export default {
		data() {
			return {
				filters: {
					shiftName: '',
					startDateTime: '',
					endDateTime: '',
					plan: '',
					periodsNumber: '',
					time: '',
					status: '0',
				},
				datalist: [{
					index: 1
				}],
				listLoading: false,
				total: 0,
				pagesize: 10,
				currentPage: 1,
				currentPage1: 1,
				planDialog: false,
				// courseInfo: {
				//   courseTitle: '2024青年干部培训班',
				// },
				current: '0',
				currentDate: ' ',
				trainPlanDetail: [],
				trainingPlanList: [],
				trainPlanID: '',
				coursePlanDialog: false,
				courseList: [],
			}
		},
		mounted() {
			// this.getlist('')
			this.TrainingPlanList()
		},
		methods: {
			/** 培训计划
			 * planDetail:查看计划详情
			 * changeCourse:切换课程查看当天课程
			 */
			getCourseList(id) {
				// console.log('----获取实时课程安排', id)
				let para = {
					planId: id,
					// shiftName:
				}
				getCourseListByPlanID(para).then((res) => {
					this.courseList = res.data.data
					this.currentDate = res.data.data[0].time
					console.log(this.courseList)
				})
			},
			// 监听弹窗关闭
			coursePlanDialogClose() {
				console.log('关闭弹窗了')
				this.trainPlanDetail = []
				this.courseList = []
				this.current = '0'
				this.currentDate = ''
			},
			// 查看课程安排
			handlEdit: function(row) {
				console.log('---实时课程安排---', row)
				this.trainPlanID = row.id
				this.getTrainPlanDetail(row.id)
				this.coursePlanDialog = true
			},
			// 导出课程表
			derivedCourseForm() {
				let para = {
					planId: this.trainPlanID,
					courseDate: this.currentDate,
				}
				let url =
					'/jw/courseArrange/export?planId=' +
					para.planId +
					'&courseDate=' +
					para.courseDate
				this.comjs.downfile(url)
			},
			// 获取培训计划列表
			TrainingPlanList() {
				console.log(this.filters.time)
				if (this.filters.time && this.filters.time.length > 0) {
					this.filters.startDateTime = moment(this.filters.time[0]).format(
						'yyyy-MM-DD'
					)
					this.filters.endDateTime = moment(this.filters.time[1]).format(
						'yyyy-MM-DD'
					)
				} else {
					this.filters.startDateTime = ''
					this.filters.endDateTime = ''
				}
				let para = {
					pageSize: this.pagesize,
					pageNum: this.currentPage,
					shiftName: this.filters.shiftName,
					startDateTime: this.filters.startDateTime,
					endDateTime: this.filters.endDateTime,
					plan: this.filters.plan,
					periodsNumber: this.filters.periodsNumber,

					status: this.filters.status
				}
				getTrainingPlanList(para).then((res) => {
					// console.log(res)
					this.trainingPlanList = res.data.rows
					this.total = res.data.total
					// console.log(this.trainingPlanList)
				})
				// let list = this.TrainingPlanList()
				// console.log(list)
			},
			// 获取培训计划详情
			getTrainPlanDetail: function(id) {
				console.log(id)
				TrainPlanDetail(id).then((res) => {
					this.trainPlanDetail = res.data.data
					console.log(this.trainPlanDetail)
				})
			},
			// 查看计划详情
			planDetail: function(row) {
				this.planDialog = true
			},
			// 切换课程查看当天课程
			changeCourse(date) {
				this.currentDate = date
			},

			// 切换tab
			handletab: function(type) {
				this.current = type
				if (type == '0') {
					// 获取培训计划信息
					this.getTrainPlanDetail(this.trainPlanID)
				} else {
					this.getCourseList(this.trainPlanID)
				}

				// this.getlist(1)
			},

			// 隔行颜色
			tableRowClassName: function(rowIndex) {
				if (rowIndex.rowIndex % 2 != 0) {
					return 'evenRow'
				}
				return 'oddRow'
			},
			// 获取列表
			getlist: function(val) {
				let para = {
					nickName: this.filters.nickName,
					phonenumber: this.filters.phonenumber,
					postName: this.filters.postName,
					pageNum: this.filters.current,
					pageSize: this.filters.size,
				}
				if (val) {
					para.pageNum = val
					this.currentPage1 = val
				}
				UserList(para).then((res) => {
					this.datalist = res.data.rows
					this.total = res.data.total
				})
			},
			// 重置
			resetForm: function(filters) {
				this.$refs.filters.resetFields()
				this.filters = {
					shiftName: '',
					startTime: '',
					endTime: '',
					plan: '',
					periodsNumber: '',
					time: '',
				}
				this.pagesize = 10
				this.currentPage1 = 1
				this.currentPage = 1
				this.TrainingPlanList()
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

<style></style>