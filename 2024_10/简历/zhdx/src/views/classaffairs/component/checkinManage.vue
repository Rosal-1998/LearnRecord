<template>
	<div class="app-container">
		<div>
			<div class="m-search">
				<el-form :inline="true" :model="studentFilter" ref="studentFilter" id="studentFilter"
					class="search-form">
					<el-form-item label="" prop="name">
						<el-input v-model="studentFilter.name" placeholder="姓名"></el-input>
					</el-form-item>
					<el-form-item label="" prop="studentNo">
						<el-input v-model="studentFilter.studentNo" placeholder="学号"></el-input>
					</el-form-item>
					<div class="search-btnbox">
						<span class="btn search-btn" @click="CheckinList()">查询</span>
						<span class="btn reset-btn" @click="resetstudentFilter('studentFilter')">重置</span>
					</div>
				</el-form>
			</div>
			<div class="btn-box">
				<span class="btn reset-btn" @click="openCheckinRuleDialog()" v-if="isEdit">考勤规则设置</span>
				<span class="btn search-btn" @click="derivedCheckinForm()">导出</span>
				<span class="btn search-btn" @click="downloadQrByID()" v-if="isEdit">下载二维码</span>
			</div>

			<div class="m-table">
				<el-table :data="checkinList" highlight-current-row v-loading="listLoading" style="width: 100%" border
					:row-class-name="tableRowClassName" :header-cell-style="{ 'text-align': 'center' }"
					:cell-style="{ 'text-align': 'center' }">
					<el-table-column prop="studentNo" label="学号" width="70"></el-table-column>

					<el-table-column prop="name" label="姓名"> </el-table-column>
					<el-table-column prop="signRequired" label="应签到次数">
					</el-table-column>
					<el-table-column prop="normalCheckin" label="正常签到次数">
					</el-table-column>
					<el-table-column prop="absenteeismCheckin" label="缺勤次数">
					</el-table-column>
					<el-table-column prop="lateCheckin" label="迟到次数">
					</el-table-column>
					<el-table-column prop="" label="操作">
						<template slot-scope="scope">
							<span class="edit-title"
								@click="openCheckinDetailDialog(scope.row.userId)">查看签到详情&nbsp;&nbsp;</span>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="m-pagination">
				<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
					:current-page="currentPage" :page-size="pagesize" layout="prev, pager, next" prev-text="上一页"
					next-text="下一页" :total="checkinTotal">
				</el-pagination>
				<i class="total">共有{{ checkinTotal }}条数据</i>
			</div>
		</div>

		<!-- 签到详情 -->
		<el-dialog :visible.sync="checkinDetailDialog" v-if="checkinDetailDialog" class="m-dialog"
			title="签到详情" :append-to-body="true" @close="closeCheckinDetailDialog">
			<div class="course-cont">
				<div class="checkin-lt">
					<i class="line-red"></i>
					<div class="checkinTitle">
						<span class="title"> 签到列表</span>
						<span class="download-btn" @click="derivedCheckinDetail()">导出</span>
					</div>
					<div class="m-table">
						<el-table :data="checkinDetailList" highlight-current-row v-loading="listLoading"
							style="width: 100%" border :row-class-name="tableRowClassName"
							:header-cell-style="{ 'text-align': 'center' }" :cell-style="{ 'text-align': 'center' }"
							@cell-click="changePhoto">
							<el-table-column prop="courseDate" label="日期">
							</el-table-column>
							<el-table-column prop="content" label="授课内容">
							</el-table-column>
							<el-table-column prop="courseStartTime" label="上课时间">
							</el-table-column>
							<el-table-column prop="" label="签到状态">
								<template slot-scope="scope">
									<el-tag
										:type="scope.row.status == '0' ? 'success' : 'info'">{{scope.row.status === '0' ? '正常' :    scope.row.status === '1' ? '迟到' : '缺勤' }}</el-tag>
								</template>
							</el-table-column>
							<el-table-column prop="checkTime" label="签到时间" width="200">
							</el-table-column>
						</el-table>
					</div>
				</div>
				<div class="checkin-rt">
					<i class="line-red"></i>
					<div class="checkinTitle">
						<span class="title"> 签到照片</span>
					</div>
					<img :src="checkPhoto" class="imgs" />
				</div>
			</div>
		</el-dialog>

		<!-- 规则 -->
		<el-dialog :visible.sync="checkinRuleDialog" v-if="checkinRuleDialog" class="m-dialog" title="考勤规则设置"
			:append-to-body="true">
			<div class="course-cont">
				<el-form :model="checkinForm" :inline="true" ref="checkinForm" :rules="checkinFormRules"
					class="formbox lab140">
					<el-form-item label="打卡开始时间" prop="startTime" style="width: 100%">
						<el-input v-model="checkinForm.startTime" type="number" placeholder="上课前X分钟"></el-input>
					</el-form-item>
					<el-form-item label="打卡截至时间" prop="endTime" style="width: 100%">
						<el-input type="number" v-model="checkinForm.endTime" placeholder="上课前X分钟"></el-input>
					</el-form-item>
					<div class="form-tip1">注：在以上时间范围内打卡，视为正常打卡，超过截止时间视为迟到，未打卡视为缺勤。</div>
				</el-form>
				<div class="dialog-foot">
					<span class="btn-cancel" @click="closeCheckinRuleDialog">取消</span>
					<span class="btn-save" @click="handleSubmitRule">确定</span>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { getCheckinList, addCheckinRule, checkinRuleDetail, checkinDetail, downloadCheckinQR,} from '../../../api/api.js'
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
				imgurl: '',
				checkinDetailList: [],
				checkinList: [],
				listLoading: false,
				checkinTotal: 0,
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
					studentNo: '',
					currentPage: 1,
					size: 10,
				},
				multion: [],
				checkinRuleDialog: false,
				checkinDetailDialog: false,
				checkinRuleDialog1: false,
				workTypeManageDialog: false,
				checkinForm: {
					startTime: '',
					endTime: '',
					id: '',
				},
				checkinFormRules: {},
				stopSubmit: true,
				checkPhoto: '',
				user: '',
			}
		},
		mounted() {
			this.CheckinList()
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
			// 导出考勤列表
			derivedCheckinForm() {
				let ids = []
				if (this.checkinList.length == 0) {
					this.$message({
						message: '无考勤记录!',
						type: 'error',
					})
					return
				} else {
					for (let i = 0; i < this.checkinList.length; i++) {
						ids.push(this.checkinList[i].userId)
					}
					let selectID = ids.join(',')
					let url =
						'/bwAttendanceSheet/attendanceSheet/attendanceCountExport?trainingPlanId=' +
						this.planId +
						'&ids=' +
						selectID
					this.comjs.downfile(url)
				}
			},
			// 导出考勤详情
			derivedCheckinDetail() {
				let url =
					'/bwAttendanceSheet/attendanceSheet/exportById?userId=' + this.user
				this.comjs.downfile(url)
			},
			// 查询考勤列表
			CheckinList() {
				let para = {
					trainingPlanId: this.planId,
					name: this.studentFilter.name,
					studentNo: this.studentFilter.studentNo,
					pageSize: this.studentFilter.size,
					pageNum: this.studentFilter.currentPage,
				}
				getCheckinList(para).then((res) => {
					console.log(res)
					this.checkinList = res.data.rows
					this.checkinTotal = res.data.total
				})
			},
			// 提交考勤规则
			handleSubmitRule() {
				let para = {
					id: this.checkinForm.id,
					planId: this.planId,
					startTime: Number(this.checkinForm.startTime),
					endTime: Number(this.checkinForm.endTime),
				}
				addCheckinRule(para).then((res) => {
					if (res.code == 200) {
						this.$message({
							message: res.msg,
							type: 'success',
						})
						this.closeCheckinRuleDialog()
					}
				})
			},
			//打开考勤规则设置弹窗
			openCheckinRuleDialog() {
				console.log('---?-0--')
				this.checkinRuleDialog = true

				checkinRuleDetail(this.planId).then((res) => {
					console.log('---?-0--')
					if (res.data.data != null) {
						this.checkinForm = res.data.data
					}
				})
			},
			// 关闭弹窗清除数据
			closeCheckinRuleDialog() {
				this.checkinForm = {
					trainingPlanId: this.planId,
					startTime: '',
					endTime: '',
					id: '',
				}
				this.checkinRuleDialog = false
			},
			// 打开签到详情弹窗
			openCheckinDetailDialog(id) {
				this.user = id
				this.checkinDetailDialog = true
				checkinDetail(id).then((res) => {
					this.checkinDetailList = res.data.data
					if (this.checkinDetailList.length > 0) {
						this.checkPhoto = this.checkinDetailList[0].checkPhotoUrl
					}
				})
			},
			// 签到详情弹窗关闭
			closeCheckinDetailDialog() {
				console.log('closeCheckinDetailDialog')
				this.checkinDetailList = []
				this.checkPhoto = ''
			},
			// 重置
			resetstudentFilter() {
				this.studentFilter = {
					name: '',
					studentNo: '',
					currentPage: 1,
					size: 10,
				}
				this.CheckinList()
			},
			// 导出签到详情

			// 下载签到二维码
			downloadQrByID() {
				let url = '/bwAttendanceSheet/attendanceSheet/generateQrCode?trainingPlanId=' + this.planId
				this.downloadQR.downfile(url)
			},
			// 修改签到图片展示
			changePhoto(row, column, cell, event) {
				// console.log(row, column, cell, event)
				this.checkPhoto = row.checkPhotoUrl
				console.log(this.checkPhoto)
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
				this.CheckinList()
			},
			// 分页
			handleCurrentChange: function(val) {
				this.filters.current = val
				this.CheckinList()
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