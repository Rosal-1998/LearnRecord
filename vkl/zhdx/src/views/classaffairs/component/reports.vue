<template>
	<div class="app-container">
		<div class="m-search">
			<el-form :inline="true" :model="studentFilter" ref="studentFilter" id="studentFilter" class="search-form">
				<el-form-item label="" prop="name">
					<el-input v-model="studentFilter.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item label="" prop="studentID">
					<el-input v-model="studentFilter.studentNo" placeholder="学号"></el-input>
				</el-form-item>
				<el-form-item label="" prop="reportStatus">
					<el-select v-model="studentFilter.reportStatus" placeholder="请选择">
						<el-option v-for="item in reportOptions" :key="item.value" :label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<div class="search-btnbox">
					<span class="btn search-btn" @click="ReportList()">查询</span>
					<span class="btn reset-btn" @click="resetstudentFilter('studentFilter')">重置</span>
				</div>
			</el-form>
		</div>
		<div class="btn-box">
			<span class="btn search-btn" @click="changeSelectReportStatus('1')" v-if="isEdit">批量报到</span>
			<span class="btn reset-btn" @click="changeSelectReportStatus('0')" v-if="isEdit">批量取消</span>
			<span class="btn reset-btn" @click="derivedReportForm()">导出</span>
		</div>

		<div class="m-table">
			<el-table :data="reportList" highlight-current-row v-loading="listLoading" style="width: 100%" border
				:row-class-name="tableRowClassName" :header-cell-style="{ 'text-align': 'center' }"
				:cell-style="{ 'text-align': 'center' }" @selection-change="handleSelectionChange">
				<el-table-column label="全选" type="selection"> 
				</el-table-column>
				<el-table-column prop="studentNo" label="学号" width="70"> 
				</el-table-column>
				<el-table-column prop="name" label="姓名"> 
				</el-table-column>
				<el-table-column prop="" label="性别">
					<template slot-scope="scope">
						<el-tag type="info">{{ scope.row.sex == 1 ? '男' : '女' }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="phone" label="手机号码"> 
				</el-table-column>
				<el-table-column prop="" label="报到情况">
					<template slot-scope="scope">
						<el-tag :type="scope.row.reportStatus == 1 ? 'success' : 'info'">{{ scope.row.reportStatus == 1 ? '已报到' : '未报到' }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="reportTime" label="报到时间" width="200"> 
				</el-table-column>
				<el-table-column prop="" label="操作" v-if="isEdit">
					<template slot-scope="scope">
						<span class="edit-title" v-if="scope.row.reportStatus == '1'"
							@click="changeReportStatus(scope.row.reportStatusId)">取消报到&nbsp;&nbsp;</span>
						<span class="edit-title" v-if="scope.row.reportStatus == '0'"
							@click="changeReportStatus(scope.row.reportStatusId)">报到&nbsp;&nbsp;</span>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="m-pagination">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
				:current-page="currentPage" :page-size="pagesize" layout="prev, pager, next" prev-text="上一页"
				next-text="下一页" :total="reportTotal">
			</el-pagination>
			<i class="total">共有{{ reportTotal }}条数据</i>
		</div>
	</div>
</template>

<script>
	import { getReportList, updateReportStatus} from '../../../api/api.js'
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
				listLoading: false,
				reportTotal: 0,
				pagesize: 10,
				currentPage: 1,
				currentPage1: 1,
				reportList: [],
				selectedItems: [],
				studentFilter: {
					name: '',
					studentNo: '',
					reportStatus: '',
					currentPage: 1,
					size: 10,
				},
				reportOptions: [{
						value: '0',
						label: '未报到',
					},
					{
						value: '1',
						label: '已报到',
					},
				],
			}
		},
		mounted() {
			this.ReportList()
		},
		methods: {
			/**
			 * 学员管理
			 * openAddStudentDialog:打开新增学员弹窗
			 * choiceSex:选择性别
			 * updateStudent:新增-编辑学生信息
			 */
			// 导出报到
			derivedReportForm() {
				let ids = []
				if (this.selectedItems.length == 0) {
					this.$message({
						message: '未选中学员!',
						type: 'error',
					})
					return
				} else {
					for (let i = 0; i < this.selectedItems.length; i++) {
						ids.push(this.selectedItems[i].reportStatusId)
					}
					let selectID = ids.join(',')
					let url = '/bw/reportStatus/export?ids=' + selectID
					this.comjs.downfile(url)
				}
			},

			// 多选学员进行操作
			handleSelectionChange(selection) {
				console.log(selection)
				this.selectedItems = selection
			},
			// 批量处理报到状态
			changeSelectReportStatus(type) {
				// type:1:批量报到,0:批量取消
				let ids = []
				console.log(this.selectedItems)
				for (let i = 0; i < this.selectedItems.length; i++) {
					if (type == '1' && this.selectedItems[i].reportStatus == '0') {

						ids.push(this.selectedItems[i].reportStatusId)
					} else if (type == '0' && this.selectedItems[i].reportStatus == '1') {
						ids.push(this.selectedItems[i].reportStatusId)
					}
				}
				if (ids.length != 0) {
					let selectID = ids.join(',')
					this.changeReportStatus(selectID)
				} else {
					this.$message({
						message: '未选择正确的数据',
						type: 'fail',
					})
				}
			},
			// 修改报到状态
			changeReportStatus(reportStatusIds) {
				let para = {
					reportStatusIds: reportStatusIds,
				}
				updateReportStatus(para).then((res) => {
					if (res.code == '200') {
						this.$message({
							message: res.msg,
							type: 'success',
						})
					} else {
						this.$message({
							message: res.msg,
							type: 'fail',
						})
					}
					this.ReportList()
				})

				// todo
			},
			// 获取报到列表
			ReportList() {
				// console.log(this.planId)
				let para = {
					trainingPlanId: this.planId,
					name: this.studentFilter.name,
					studentNo: this.studentFilter.studentNo,
					reportStatus: this.studentFilter.reportStatus,
					pageSize: this.studentFilter.size,
					pageNum: this.studentFilter.currentPage,
				}
				getReportList(para).then((res) => {
					this.reportList = res.data.rows
					this.reportTotal = res.data.total
				})
			},
			// 重置
			resetstudentFilter() {
				this.studentFilter = {
					name: '',
					studentNo: '',
					reportStatus: '',
					currentPage: 1,
					size: 10,
				}
				this.ReportList()
			},
			// 打开新增学员窗口
			openAddStudentDialog() {
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
			// 隔行颜色
			tableRowClassName: function(rowIndex) {
				if (rowIndex.rowIndex % 2 != 0) {
					return 'evenRow'
				}
				return 'oddRow'
			},
			// 分页
			handleSizeChange: function(size) {
				this.pageSize = size
				this.studentFilter.size = size
				this.ReportList()
			},
			// 分页
			handleCurrentChange: function(val) {
				this.studentFilter.currentPage = val
				this.ReportList()
			},
		},
	}
</script>