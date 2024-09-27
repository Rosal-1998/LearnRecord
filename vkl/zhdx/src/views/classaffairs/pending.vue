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
							<span class="edit-title" @click="openManageDialog(scope.row)">管理&nbsp;&nbsp;</span>
							<el-popover :ref="scope.row.id" placement="top" popper-class="popover"
								style="height: 120px;">
								<p class="del-tip" style="height: 80px;line-height: none;margin-bottom: 10px;">
									是否确定归档？归档后该班次不能修改</p>
								<div class="pop-btnbox">
									<span class="cancel-btn" @click="visibleGdCancel(scope.row.id)">取消</span>
									<span class="ok-btn" @click="visibleGdSubmit(scope.row.id)">确定</span>
								</div>
								<span slot="reference" class="del-title">归档</span>
							</el-popover>
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
		<!-- 管理窗口 -->
		<el-dialog :visible.sync="manageDialog" v-if="manageDialog" class="g-dialog min-dia600"
			:title="classInfo.classTitle">
			<div class="course-cont">
				<div class="house-lt">
					<div class="tab-ul">
						<div v-for="item in manageTabList" :class="['tab-lst', { active: currentManage == item.id }]"
							@click="changeTab(item.id)">
							{{ item.title }}
						</div>
					</div>
				</div>
				<div class="house-rt">
					<div class="student-manege" v-if="currentManage == 0">
						<StudentManage :isShowStudentManage="currentManage == 0" :planId="currentPlanID" :isRead="false"
							:isEdit="true" />
					</div>
					<div class="student-manege" v-if="currentManage == 1">
						<Reports :isShowReports="currentManage == 1" :planId="currentPlanID" :isRead="false"
							:isEdit="true" />
					</div>
					<div class="student-manege" v-if="currentManage == 2">
						<Album :planId="currentPlanID" :isRead="false" :isEdit="true" />
					</div>
					<div class="student-manege" v-if="currentManage == 3">
						<CourseWare :planId="currentPlanID" :isRead="false" :isEdit="true" />
					</div>
					<div class="student-manege" v-if="currentManage == 4">
						<HomeworkManage :planId="currentPlanID" :isRead="false" :isEdit="true" />
					</div>
					<div class="student-manege" v-if="currentManage == 5">
						<TeachEval :planId="currentPlanID" :isRead="false" :isEdit="true" />
					</div>
					<div class="student-manege" v-if="currentManage == 6">
						<SatisfactionEval :planId="currentPlanID" :isRead="false" :isEdit="true" />
					</div>
					<div class="student-manege" v-if="currentManage == 7">
						<MenuManage :planId="currentPlanID" :isRead="false" :isEdit="true" />
					</div>
					<div class="student-manege" v-if="currentManage == 8">
						<CheckinManage :planId="currentPlanID" :isRead="false" :isEdit="true" />
					</div>
					<div class="student-manege" v-if="currentManage == 9">
						<Course :planId="currentPlanID" :isRead="false" :isEdit="true" />
					</div>
				</div>
			</div>
		</el-dialog>
		<!-- 新增-编辑学生窗口 -->
		<el-dialog :visible.sync="studentDialog" v-if="studentDialog" class="g-dialog min-dia600"
			:title="studentDialogTitle">
			<span class="tip">基础信息</span>
			<el-form :model="studentForm" :inline="true" ref="studentForm" :rules="studentFormRules" class="addform">
				<el-form-item label="照片" prop="" class="delbgimg" :key="formItemKey">
					<div class="upimgbox" :style="{
              backgroundImage: 'url(' + studentForm.avatarFile + ')',
            }">
						<input ref="file1" type="file" class="file" @change="choosefile($event, '1')" />
					</div>
					<!-- <i class="del-tip1" v-if="editflag" @click="handlesyimg">删除</i> -->
				</el-form-item>
				<i style="display: block; width: 100%; float: left"></i>
				<el-form-item label="姓名" prop="name">
					<el-input v-model="studentForm.name" placeholder="请输入姓名"></el-input>
				</el-form-item>
				<el-form-item label="身份证号" prop="idCard">
					<el-input v-model="studentForm.idCard" placeholder="请输入身份证号"></el-input>
				</el-form-item>
				<el-form-item label="性别" prop="sex">
					<div :class="['radio-lst', { active: studentForm.sex == '0' }]" @click="choiceSex('0')">
						<i class="dot"></i> 男
					</div>
					<div :class="['radio-lst', { active: studentForm.sex == '1' }]" @click="choiceSex('1')">
						<i class="dot"></i> 女
					</div>
				</el-form-item>

				<el-form-item label="单位" prop="workPlace">
					<el-input v-model="studentForm.workPlace" placeholder="请输入单位"></el-input>
				</el-form-item>
				<el-form-item label="班级职务" prop="classDuties">
					<el-input v-model="studentForm.classDuties" placeholder="请输入班级职务"></el-input>
				</el-form-item>
				<el-form-item label="单位所属区域" prop="workBelong">
					<el-input v-model="studentForm.workBelong" placeholder="请输入单位所属区域"></el-input>
				</el-form-item>
				<el-form-item label="政治面貌" prop="politicsFace">
					<el-select v-model="studentForm.politicsFace" placeholder="请选择政治面貌">
						<el-option v-for="item in politicsFaceList" :key="item.value" :label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
					<!-- <el-input
            v-model="studentForm.politicsFace"
            placeholder="请输入政治面貌"
          ></el-input> -->
				</el-form-item>

				<el-form-item label="手机号码" prop="phone">
					<el-input v-model="studentForm.phone" placeholder="请输入手机号码"></el-input>
				</el-form-item>
				<el-form-item label="职务" prop="duties">
					<el-input v-model="studentForm.duties" placeholder="请输入职务"></el-input>
				</el-form-item>
				<el-form-item label="最高学历" prop="degree">
					<el-input v-model="studentForm.degree" placeholder="请输入最高学历"></el-input>
				</el-form-item>
				<el-form-item label="单位层级" prop="workDegree">
					<el-input v-model="studentForm.workDegree" placeholder="请输入单位层级"></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="remarks">
					<el-input v-model="studentForm.remarks" placeholder="请输入备注"></el-input>
				</el-form-item>
			</el-form>
			<div class="dialog-foot">
				<span class="btn-cancel" @click="cancalUpdateStudent">取消</span>
				<span class="btn-save" @click="updateStudent">保存</span>
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
		archiveTrainPlan
	} from '../../api/api.js'
	// 引用组件
	import Reports from './component/reports.vue' //报告情况
	import StudentManage from './component/studentManage.vue' //学员管理
	import Album from './component/album.vue' //相册
	import CourseWare from './component/courseware.vue' //教学资料
	import HomeworkManage from './component/homework.vue'
	import TeachEval from './component/eval.vue' //教学评估
	import SatisfactionEval from './component/satisfaction.vue'
	import MenuManage from './component/menuManage.vue'
	import CheckinManage from './component/checkinManage.vue'
	import Course from './component/course.vue'
	import qs from 'qs'
	import axios from 'axios'
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
			Course
		},
		data() {
			return {
				trainingPlanList: [],
				filters: {
					shiftName: '',
					startDateTime: '',
					endDateTime: '',
					plan: '',
					periodsNumber: '',
					time: '',
					status: '0',
				},
				studentList: [{
					index: '0',
					name: 'sa123'
				}],
				datalist: [{
					index: '0',
					name: '班级1'
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
				manageTabList: [{
						title: '学员管理',
						id: '0',
					},
					{
						title: '报到情况',
						id: '1',
					},
					{
						title: '班级相册',
						id: '2',
					},
					{
						title: '教学资料',
						id: '3',
					},
					{
						title: '作业管理',
						id: '4',
					},
					{
						title: '教学评估',
						id: '5',
					},
					{
						title: '学员满意度测评',
						id: '6',
					},
					{
						title: '用餐管理',
						id: '7',
					},
					{
						title: '考勤管理',
						id: '8',
					},
					{
						title: '课程查看',
						id: '9',
					},
				],
				studentFilter: {
					name: '',
					studentID: '',
					duties: '',
					current: 1,
					size: 10,
				},
				studentDialog: false,
				studentForm: {
					avatarFile: '',
					name: '',
					sex: '0',
					idCard: '',
					phone: '',
					duties: '',
					degree: '',
					workPlace: '', // 单位
					workDegree: '', // 单位层级
					workBelong: '', // 单位所属区域
					classDuties: '', // 班级职务
					politicsFace: '', // 政治面貌
					remarks: '', // 备注
				},
				studentFormRules: {
					name: [{
						required: true,
						message: '请输入姓名',
						trigger: 'blur'
					}],
					sex: [{
						required: true,
						message: '请选择性别',
						trigger: 'blur'
					}],
					idCard: [{
						required: true,
						message: '请输入身份证号',
						trigger: 'blur'
					}, ],
					workPlace: [{
						required: true,
						message: '请输入单位',
						trigger: 'blur'
					}],
					workDegree: [{
						required: true,
						message: '请输入单位层级',
						trigger: 'blur'
					}, ],
					workBelong: [{
						required: true,
						message: '请输入单位所属区域',
						trigger: 'blur'
					}, ],
					politicsFace: [{
						required: true,
						message: '请输入政治面貌',
						trigger: 'blur'
					}, ],
				},
				formItemKey: '',
				politicsFaceList: [{
						label: '党员',
						value: '党员',
					},
					{
						label: '预备党员',
						value: '预备党员',
					},
				],
				currentPlanID: '',
				studentDialogTitle: '',
			}
		},
		mounted() {
			// this.getlist('')
			// this.getdept();
			// this.getrole()
			this.TrainingPlanList()
		},
		methods: {
			/**
			 * 管理
			 * openManageDialog:打开管理窗口
			 * changeTab:切换管理列表tab
			 * openAddStudentDialog:打开新增学员弹窗
			 * choiceSex:选择性别
			 * updateStudent:新增-编辑学生信息
			 */
			// 获取培训计划列表
			TrainingPlanList() {
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
				getTrainingPlanList(para).then((res) => {
					this.trainingPlanList = res.data.rows
					this.total = res.data.total
				})
			},
			// 打开管理窗口
			openManageDialog(row) {
				this.currentPlanID = row.id
				this.classInfo.classTitle = row.shiftName
				this.manageDialog = true
				this.currentManage = 0
			},
			// 选择性别
			choiceSex: function(val) {
				this.studentForm.sex = val
			},
			// 打开新增学员窗口
			openAddStudentDialog(type) {

				this.studentDialog = true

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
			// 查询学生列表
			getStudentList() {},
			// 重置学生过滤器
			resetstudentFilter: function(filters) {
				this.$refs.studentFilter.resetFields()
				this.studentFilter = {
					name: '',
					studentID: '',
					duties: '',
					current: 1,
					size: 10,
				}
				// this.pagesize = 10
				// this.currentPage1 = 1
				// this.currentPage = 1
				// this.getlist(1)
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
					status: 0
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
			// 归档 取消
			visibleGdCancel(id) {
				console.log('归档', id)
				console.log(this.$refs)
				this.$refs[id].doClose()
			},
			// 归档 确认
			visibleGdSubmit(id) {
				let para = {
					id: id
				}
				archiveTrainPlan(para).then((res) => {
					console.log(res, '10101')

					if (res.data.code == '200') {
						this.$message({
							message: res.data.msg,
							type: 'success',
						})
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error',
						})
					}
					this.$refs[id].doClose()
					this.TrainingPlanList()
				})

			},
		},
	}
</script>

<style>
	.el-dialog {
		/* background-color: red; */
		width: 1500px !important;
		height: 600px !important;
	}

	.house-lt {
		width: 135px !important;
		text-align: center !important;
	}

	.house-rt {
		width: calc(100% - 146px) !important;
	}

	.btn-box {
		float: left;
		margin-bottom: 20px;
	}
</style>