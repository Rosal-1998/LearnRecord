<template>
	<div class="g-cont">
		<div class="m-contain">
			<div class="m-search" style="float: left">

				<el-form :inline="true" :model="filters" ref="filters" id="filters" class="search-form">
					<el-form-item label="" prop="plan">
						<el-select v-model="filters.plan" placeholder="展示状态">
							<el-option value="0" label="是"></el-option>
							<el-option value="1" label="否"></el-option>
						</el-select>
					</el-form-item>
          
          <el-form-item label="" prop="shiftName">
						<el-input v-model="filters.shiftName" placeholder="输入标题"></el-input>
					</el-form-item>
					<el-form-item label="" prop="time">
						<el-date-picker v-model="filters.time" type="daterange" start-placeholder="年/月/日"
							end-placeholder="年/月/日"></el-date-picker>
					</el-form-item>
					
					
					<div class="search-btnbox">
						<span class="btn search-btn" @click="TrainingPlanList()">查询</span>
						<span class="btn reset-btn" @click="resetForm('filters')">重置</span>
					</div>
				</el-form>
			</div>

			<div class="m-table">
				<el-table :data="noticeList" highlight-current-row v-loading="listLoading" style="width: 100%"
					border :row-class-name="tableRowClassName" :header-cell-style="{ 'text-align': 'center' }"
					:cell-style="{ 'text-align': 'center' }">
					<el-table-column type="index" label="序号" width="80">
					</el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="shiftName" label="标题"> </el-table-column>
          <el-table-column prop="endTime" label="发布范围"> </el-table-column>
          <el-table-column prop="status" label="展示状态">
						<template slot-scope="scope">
							<span v-if="scope.row.status == '1'" class="f-black">已办</span>
							<span v-else-if="scope.row.status == '0'" class="f-green">待办</span>
						</template>
					</el-table-column>
          <el-table-column prop="endTime" label="发布人"> </el-table-column>
					<el-table-column prop="startTime" label="发布时间"> </el-table-column>
					
					
					<el-table-column prop="" label="操作">
						<template slot-scope="scope">
							<span class="edit-title" @click="openManageDialog(scope.row)">查看&nbsp;&nbsp;</span>
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
		getNoticeList
	} from '../../api/api.js'
	import qs from 'qs'
	import axios from 'axios'
	import Reports from './component/reports.vue'
	import StudentManage from './component/studentManage.vue'
	import Album from './component/album.vue'
	import CourseWare from './component/courseware.vue'
	import HomeworkManage from './component/homework.vue'
	import TeachEval from './component/eval.vue'
	import SatisfactionEval from './component/satisfaction.vue'
	import MenuManage from './component/menuManage.vue'
	import CheckinManage from './component/checkinManage.vue'
	import Course from './component/course.vue'
	import moment from 'moment'
	export default {
		components: {
			Reports,
			StudentManage,
			Album,
			CourseWare,
			HomeworkManage,
			TeachEval,
			SatisfactionEval,
			MenuManage,
			CheckinManage,
			Course,
		},

		data() {
			return {
				noticeList: [],
				filters: {
					shiftName: '',
					startDateTime: '',
					endDateTime: '',
					plan: '',
					periodsNumber: '',
					time: '',
					status: '1',
				},
				datalist: [{
					index: '0'
				}],
				listLoading: false,
				total: 0,
				pagesize: 10,
				currentPage: 1,
				currentPage1: 1,
				manageDialog: false,
				classInfo: {
					classTitle: '',
				},

				currentManage: '0',
				currentPlanID: '',
			}
		},
		mounted() {
			// this.getlist('')
			// this.getdept();
			// this.getrole()
			this.NoticeList()
		},
		methods: {
		
			// 消息公告列表
			NoticeList() {
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
					status: this.filters.status,
				}
				getNoticeList(para).then((res) => {
					
					this.noticeList = res.data.rows
					this.total = res.data.total
				
				})
			
			},
			// openManageDialog:打开查看弹窗
			openManageDialog(row) {
				console.log(row)
				this.currentPlanID = row.id
				this.classInfo.classTitle = row.shiftName
				this.manageDialog = true
				this.currentManage = 0
			},
			// 切换管理列表tab
			changeTab: function(type) {
				this.currentManage = type
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
					startDateTime: '',
					endDateTime: '',
					plan: '',
					periodsNumber: '',
					status: 1,
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

			// 详情
			getDetail: function(id) {
				UserInfo(id).then((res) => {
					console.log(res, 'x1')
					this.addForm = res.data.data.user
					this.addForm.roleIds = res.data.data.roleIds
					this.passwordflag = false
				})
			},

			// 更改状态
			handlestatus: function(row, type) {
				let para = {
					userId: row.userId,
					status: type,
				}
				UserUpdateStatus(para).then((res) => {
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
					this.getlist(1)
				})
			},
		},
	}
</script>

<style></style>