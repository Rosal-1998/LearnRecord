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
			<div class="operate-btn">
				<span class="btn add-btn" @click="handleAdd">新增</span>
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
							<span class="edit-title" v-if="scope.row.status != '1'" @click="handlEdit(scope.row.id)">编辑&nbsp;&nbsp;</span>
							<el-popover :ref="scope.row.id" placement="top" width="160" popper-class="popover">
								<p class="del-tip">确定删除吗？</p>
								<div class="pop-btnbox">
									<span class="cancel-btn" @click="visibleDelCancel(scope.row.id)">取消</span>
									<span class="ok-btn" @click="visibleDelSubmit(scope.row.id)">确定</span>
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
					next-text="下一页" :total="total">
				</el-pagination>
				<i class="total">共有{{ total }}条数据</i>
			</div>
		</div>
		<!-- 新增、编辑 -->
		<el-dialog :visible.sync="adddialog" v-if="adddialog" class="m-dialog" :title="diatitle">
			<div class="dia-contont">
				<div class="dia-cont">
					<el-form :model="addForm" :inline="true"  ref="addForm" :rules="addFormRules" class="formbox lab140">
						<el-form-item label="班次名称" prop="shiftName" style="width: 100%;">
							<el-input v-model="addForm.shiftName" placeholder="班次名称" class="max0-ipt"></el-input>
						</el-form-item>
						<el-form-item label="办班开始时间"  prop="startTime">
							<el-date-picker v-model="addForm.startTime" type="date" placeholder="选择日期"
								@change="pickEndTime">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="办班结束时间"  prop="endTime">
							<el-date-picker v-model="addForm.endTime" type="date" placeholder="选择日期"
								@change="pickEndTime">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="办班时间" style="width: 100%;">
							<div class="tag-box">
								<el-tag v-for="tag in addForm.classSchedule" @close="handleClose(tag)" :key="tag" closable>
									{{ tag }}
								</el-tag>
							</div>
						</el-form-item>
						<el-form-item label="学制(天)" prop="educational">
							<el-input v-model="addForm.educational" placeholder="学制(天)"></el-input>
						</el-form-item>
						<el-form-item label="人数" prop="number">
							<el-input v-model="addForm.number" placeholder="人数"></el-input>
						</el-form-item>
						<el-form-item label="总学时" prop="totalHours">
							<el-input v-model="addForm.totalHours" placeholder="总学时"></el-input>
						</el-form-item>
						<el-form-item label="是否计划内" prop="plan">
							<el-select v-model="addForm.plan" placeholder="是否计划内">
								<el-option value="0" label="是"></el-option>
								<el-option value="1" label="否"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="报到开始时间" prop="registrationStartTime">
							<el-date-picker v-model="addForm.registrationStartTime" type="datetime"
								placeholder="选择日期-时间">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="报到结束时间" prop="registrationEndTime">
							<el-date-picker v-model="addForm.registrationEndTime" type="datetime" placeholder="选择日期-时间">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="培训对象" prop="trainingTarget">
							<el-input v-model="addForm.trainingTarget" placeholder="培训对象"></el-input>
						</el-form-item>
						<el-form-item label="培训内容" prop="content">
							<el-input v-model="addForm.content" placeholder="培训内容"></el-input>
						</el-form-item>
						<el-form-item label="年度" prop="year">
							<el-input v-model="addForm.year" placeholder="年度"></el-input>
						</el-form-item>
						<el-form-item label="期数" prop="periodsNumber">
							<el-input v-model="addForm.periodsNumber" placeholder="期数"></el-input>
						</el-form-item>
						<el-form-item label="备注" prop="remark" style="width: 100%;">
							<el-input type="textarea" v-model="addForm.remark" placeholder="备注" class="max0-ipt"></el-input>
						</el-form-item>
					</el-form>
					<div class="dialog-foot">
						<span class="btn-cancel" @click="handleclose('0')">取消</span>
						<span class="btn-save" @click="handlesubmit">完成</span>
					</div>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { UserList, AddUser, UpdateUser, DelUser, UserUpdateStatus, UserDeptTree, Userdetal, UserInfo, ResetPassword, getTrainingPlanList, addTrainPlan, TrainPlanDetail, updateTrainPlan, deleteTrainPlan,} from '../../api/api.js'
	import qs from 'qs'
	import axios from 'axios'
	import moment from 'moment'
	import { generateDates } from '../../api/timeArray.js'
	export default {
		data() {
			return {
				filters: {
					shiftName: '',
					startTime: '',
					endDateTime: '',
					plan: '',
					periodsNumber: '',
					time: '',
				},
				datalist: [],
				listLoading: false,
				total: 0,
				pagesize: 10,
				currentPage: 1,
				currentPage1: 1,
				adddialog: false,
				diatitle: '',
				addForm: {
					userId: '',
					deptId: null,
					nickName: '',
					userName: '',
					phonenumber: '',
					roleIds: [],
					password: '',
					postName: '',
					status: '0',
					workContent: '',
					classSchedule: [],
					time: [],
				},

				trainingPlanList: [],
				addFormRules: {
					shiftName: [{
						required: true,
						message: '请输入班次名称',
						trigger: 'blur'
					}, ],
					startTime: [{
						required: true,
						message: '请输入办班开始时间',
						trigger: 'blur'
					}, ],
					endTime: [{
						required: true,
						message: '请输入办班结束时间',
						trigger: 'blur'
					}, ],
					number: [{
						required: true,
						message: '请输入人数',
						trigger: 'blur'
					}],
					plan: [{
						required: true,
						message: '请输入是否计划内',
						trigger: 'blur'
					}, ],
					registrationStartTime: [{
						required: true,
						message: '请输入报到开始时间',
						trigger: 'blur'
					}, ],
					registrationEndTime: [{
						required: true,
						message: '请输入报到结束时间',
						trigger: 'blur'
					}, ],
					classSchedule: [],
				},
			}
		},
		mounted() {
			// this.getlist('')
			// this.getrole()
			this.TrainingPlanList()
		},
		methods: {
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
				}
				getTrainingPlanList(para).then((res) => {
					console.log(res)
					this.trainingPlanList = res.data.rows
					this.total = res.data.total
				})
				// let list = this.TrainingPlanList()
				// console.log(list)
			},
			// 选择结束日期s
			pickEndTime(e) {
				console.log(moment(e).format('yyyy-MM-DD HH:mm:ss'))
				// if(this.addForm.StartTime== ''){
				//   console.log('请选择开始时间')
				//   this.$message.error('请选择开始时间!')
				//   return
				// }
				if (this.addForm.startTime > e) {
					// console.log('结束日期大于开始日期')
					this.$message({
						message: '结束日期小于开始日期',
						type: 'error',
					})
					return
				}
				if (this.addForm.startTime && e) {
					let array = generateDates(this.addForm.startTime, e)
					console.log(this.addForm)
					this.addForm.classSchedule = []
					this.addForm.classSchedule = array

					console.log('this.addForm.classSchedule', this.addForm.classSchedule)
				}
			},
			// 新增培训计划
			// 保存
			handlesubmit: function() {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						let para = {
							shiftName: this.addForm.shiftName,
							// startTime:this.addForm.startTime,
							// endTime:this.addForm.endTime,
							startTime: moment(this.addForm.startTime).format(
								'yyyy-MM-DD HH:mm:ss'
							),
							endTime: moment(this.addForm.endTime).format('yyyy-MM-DD HH:mm:ss'),
							classSchedule: this.addForm.classSchedule.join(','),
							educational: this.addForm.educational,
							number: this.addForm.number,
							totalHours: this.addForm.totalHours,
							plan: this.addForm.plan,
							// registrationStartTime:this.addForm.registrationStartTime,
							// registrationEndTime:this.addForm.registrationEndTime,
							registrationStartTime: moment(
								this.addForm.registrationStartTime
							).format('yyyy-MM-DD HH:mm:ss'),
							registrationEndTime: moment(
								this.addForm.registrationEndTime
							).format('yyyy-MM-DD HH:mm:ss'),
							trainingTarget: this.addForm.trainingTarget,
							content: this.addForm.content,
							year: this.addForm.year,
							periodsNumber: this.addForm.periodsNumber,
							remark: this.addForm.remark,
							id: this.addForm.id,
						}
						if (this.addForm.id) {
							updateTrainPlan(para).then((res) => {
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
								this.adddialog = false
								this.TrainingPlanList()
							})
						} else {
							addTrainPlan(para).then((res) => {
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
								this.adddialog = false
								this.TrainingPlanList()
							})
						}
					}
				})
			},

			// 获取角色
			getrole: function() {
				Userdetal().then((res) => {
					console.log(res, '101001')
					this.rolelist = res.data.data.roles
				})
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
			// 下载模版
			handledown: function() {
				let url = '/system/user/importTemplate'
				this.comjs.downfile(url)
			},

			// 新增
			handleAdd: function(row) {
				this.adddialog = true
				this.diatitle = '培训计划新增'
				this.addForm = {
					userId: '',
					deptId: null,
					nickName: '',
					userName: '',
					phonenumber: '',
					roleIds: [],
					password: '',
					postName: '',
					status: '0',
					workContent: '',
					classSchedule: [],
					time: [],
				}
			},
			// 切换 账号状态
			handlestat: function(val, type) {
				this.addForm.status = val
			},
			// 编辑
			handlEdit: function(id) {
				this.adddialog = true
				this.diatitle = '培训计划编辑'
				this.getTrainPlanDetail(id)
			},
			// 详情
			getTrainPlanDetail: function(id) {
				console.log(id)
				// let time = [
				//   convertDateTimeManual(this.currentDate, row.startTime),
				//   convertDateTimeManual(this.currentDate, row.endTime),
				// ]
				TrainPlanDetail(id).then((res) => {
					console.log(res, 'x1')
					this.addForm = res.data.data
					this.addForm.id = res.data.data.id
					// this.addForm.time = []
					// console.log(this.addForm.time)
					// this.addForm.time[0] =res.data.data.startTime
					// this.addForm.time[1] =res.data.data.endTime
					// 将办班时间转为数组的形式
					this.addForm.classSchedule = res.data.data.classSchedule.split(',')
				})
			},
			// 删除某天
			handleClose(tag) {
				console.log(this.addForm.classSchedule.indexOf(tag))
				this.addForm.classSchedule.splice(
					this.addForm.classSchedule.indexOf(tag),
					1
				)
			},

			// 弹窗关闭
			handleclose: function(type) {
				this.adddialog = false
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
			// 删除 取消
			visibleDelCancel(id) {
				console.log('visibleDelCancel', id)
				console.log(this.$refs)
				this.$refs[id].doClose()
			},
			// 删除确认
			visibleDelSubmit(id) {
				deleteTrainPlan(id).then((res) => {
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
					this.$refs[id].doClose()
					this.TrainingPlanList()
				})
			},
		},
	}
</script>

