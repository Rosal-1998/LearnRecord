<template>
	<div class="app-container">
		<div class="m-search">
			<el-form :inline="true" :model="studentFilter" ref="studentFilter" id="studentFilter" class="search-form">
				<el-form-item label="" prop="name">
					<el-input v-model="studentFilter.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item label="" prop="status">
					<el-select v-model="studentFilter.status" placeholder="提交状态">
						<el-option v-for="item in uploadOptions" :key="item.value" :label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<div class="search-btnbox">
					<span class="btn search-btn" @click="SatisfactionList()">查询</span>
					<span class="btn reset-btn" @click="resetstudentFilter('studentFilter')">重置</span>
				</div>
			</el-form>
		</div>
		<div class="btn-box">
			<span class="btn reset-btn" @click="pushSatisfactionByID()" v-if="isEdit">催交</span>
			<span class="btn search-btn" style="width: auto !important; padding: 0 10px"
				@click="openEvalAllDetailDialog()">学员满意度测评汇总表</span>
				<span class="btn reset-btn" @click="pushBatchSatisfactionByID()" v-if="isEdit">一键催交</span>
			<el-switch v-if="isEdit" v-model="satisfactionStatus" active-text="允许收集" inactive-text="已停止收集"
				@change="changeSatisfactionStatus" class="swit-btn">
			</el-switch>
		</div>

		<div class="m-table">
			<el-table ref="multipleTable" :data="satisfactionList" highlight-current-row v-loading="listLoading"
				style="width: 100%" border :row-class-name="tableRowClassName"
				:header-cell-style="{ 'text-align': 'center' }" :cell-style="{ 'text-align': 'center' }"
				@selection-change="handleSelectionChange">
				<el-table-column label="全选" :selectable="selectStatu" type="selection">
				</el-table-column>
				<el-table-column prop="studentNo" label="学号" width="70"></el-table-column>

				<el-table-column prop="name" label="姓名"> </el-table-column>
				<el-table-column prop="" label="提交状态">
					<template slot-scope="scope">
						<el-tag :type="scope.row.status == '1' ? 'success' : 'info'">{{
              scope.row.status == '1' ? '已上传' : '未上传'
            }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="submissionTime" label="提交时间">
				</el-table-column>
			</el-table>
		</div>
		<div class="m-pagination">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
				:current-page="currentPage" :page-size="pagesize" layout="prev, pager, next" prev-text="上一页"
				next-text="下一页" :total="satisfactionTotal">
			</el-pagination>
			<i class="total">共有{{ satisfactionTotal }}条数据</i>
		</div>
		<!-- 满意度测评详情 -->
		<el-dialog :visible.sync="evalDetailDialog" v-if="evalDetailDialog" class="m-dialog" title="满意度测评详情">
			<div style="padding: 20px">
				<div class="arrange-cont">
					<div class="xq-content">
						<div class="xq-whole">
							<span class="name">培训名称</span>
							<span class="lab">{{ satisfactionSummaryList.trainName }}</span>
						</div>
						<div class="xq-whole">
							<span class="name">培训时间</span>
							<span class="lab">{{ satisfactionSummaryList.trainDate }}</span>
						</div>
						<div class="xq-whole">
							<span class="name">课程设置</span>
							<span class="lab">2024青年干部培训班</span>
						</div>
						<div class="xq-whole">
							<span class="name">教学效果</span>
							<span class="lab">2024青年干部培训班</span>
						</div>
						<div class="xq-whole">
							<span class="name">学风</span>
							<span class="lab">2024青年干部培训班</span>
						</div>
						<div class="xq-whole">
							<span class="name">教学设施与环境</span>
							<span class="lab">2024青年干部培训班</span>
						</div>
						<div class="xq-whole">
							<span class="name">教学管理</span>
							<span class="lab">2024青年干部培训班</span>
						</div>
						<div class="xq-whole">
							<span class="name">后勤服务</span>
							<span class="lab">2024青年干部培训班</span>
						</div>
						<div class="xq-whole">
							<span class="name">总体评价</span>
							<span class="lab">2024青年干部培训班</span>
						</div>
						<div class="xq-whole">
							<span class="last">意见与建议</span>
							<span class="lastlab">123123</span>
						</div>
					</div>
				</div>
			</div>
		</el-dialog>

		<!-- 教学评估汇总表 -->
		<el-dialog :visible.sync="evalAllDetailDialog" v-if="evalAllDetailDialog" class="m-dialog" title="学员满意度测评总表"
			:append-to-body="true">
			<div style="padding: 20px">
				<div class="arrange-cont">
					<div class="xq-content">
						<el-row>
							<el-col :span="4">
								<div class="grid-content floatR bg-red">
									<span class="red-star">*</span>
									班次名称：
								</div>
							</el-col>
							<el-col :span="8">
								<div class="grid-content bg-red pdd5">
									{{ satisfactionSummaryList.trainName }}
								</div>
							</el-col>
							<el-col :span="4">
								<div class="grid-content floatR bg-red">
									<span class="red-star">*</span>
									培训时间：
								</div>
							</el-col>
							<el-col :span="8">
								<div class="grid-content bg-red pdd5">
									{{ satisfactionSummaryList.trainDate }}
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="4">
								<div class="grid-content bg-purple floatR">评估内容：</div>
							</el-col>
							<el-col :span="20">
								<div class="grid-content bg-purple-light" style="text-align: center">
									等级评估
								</div>
							</el-col></el-row>
						<el-row>
							<el-col :span="4">
								<div class="grid-content bg-purple floatR">课程设置：</div>
							</el-col>
							<el-col :span="20">
								<div class="grid-content bg-purple-light" style="text-align: center">
									非常满意:({{satisfactionSummaryList.curriculumSummaryVo.status1 
									  }})&nbsp;&nbsp;&nbsp;&nbsp; 满意:({{
										satisfactionSummaryList.curriculumSummaryVo.status2
									  }}) &nbsp;&nbsp;&nbsp;&nbsp;一般:({{
										satisfactionSummaryList.curriculumSummaryVo.status3
									  }}) &nbsp;&nbsp;&nbsp;&nbsp;不满意:({{
										satisfactionSummaryList.curriculumSummaryVo.status4
									  }}) &nbsp;&nbsp;&nbsp;&nbsp;非常不满意:({{
										satisfactionSummaryList.curriculumSummaryVo.status5
									  }})
								</div>
							</el-col></el-row>
						<el-row>
							<el-col :span="4">
								<div class="grid-content bg-purple floatR">教学效果：</div>
							</el-col>
							<el-col :span="20">
								<div class="grid-content bg-purple-light" style="text-align: center">
									非常满意:({{
                    satisfactionSummaryList.teachingEffectivenessSummaryVo
                      .status1
                  }})&nbsp;&nbsp;&nbsp;&nbsp; 满意:({{
                    satisfactionSummaryList.teachingEffectivenessSummaryVo
                      .status2
                  }}) &nbsp;&nbsp;&nbsp;&nbsp;一般:({{
                    satisfactionSummaryList.teachingEffectivenessSummaryVo
                      .status3
                  }}) &nbsp;&nbsp;&nbsp;&nbsp;不满意:({{
                    satisfactionSummaryList.teachingEffectivenessSummaryVo
                      .status4
                  }})&nbsp;&nbsp;&nbsp;&nbsp; 非常不满意:({{
                    satisfactionSummaryList.teachingEffectivenessSummaryVo
                      .status5
                  }})
								</div>
							</el-col></el-row>
						<el-row>
							<el-col :span="4">
								<div class="grid-content bg-purple floatR">学风：</div>
							</el-col>
							<el-col :span="20">
								<div class="grid-content bg-purple-light" style="text-align: center">
									严谨:({{ satisfactionSummaryList.studySummaryVo.status1 }})
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;一般:({{
                    satisfactionSummaryList.studySummaryVo.status2
                  }}) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;松散:({{
                    satisfactionSummaryList.studySummaryVo.status3
                  }})
								</div>
							</el-col></el-row>
						<el-row>
							<el-col :span="4">
								<div class="grid-content bg-purple floatR">
									教学设施和环境：
								</div>
							</el-col>
							<el-col :span="20">
								<div class="grid-content bg-purple-light" style="text-align: center">
									非常满意:({{
                    satisfactionSummaryList.environmentSummaryVo.status1
                  }})&nbsp;&nbsp;&nbsp;&nbsp; 满意:({{
                    satisfactionSummaryList.environmentSummaryVo.status2
                  }}) &nbsp;&nbsp;&nbsp;&nbsp;一般:({{
                    satisfactionSummaryList.environmentSummaryVo.status3
                  }})&nbsp;&nbsp;&nbsp;&nbsp; 不满意:({{
                    satisfactionSummaryList.environmentSummaryVo.status4
                  }})&nbsp;&nbsp;&nbsp;&nbsp; 非常不满意:({{
                    satisfactionSummaryList.environmentSummaryVo.status5
                  }})
								</div>
							</el-col></el-row>
						<el-row>
							<el-col :span="4">
								<div class="grid-content bg-purple floatR">教学管理：</div>
							</el-col>
							<el-col :span="20">
								<div class="grid-content bg-purple-light" style="text-align: center">
									非常满意:({{
                    satisfactionSummaryList.teachingSummaryVo.status1
                  }})&nbsp;&nbsp;&nbsp;&nbsp; 满意:({{
                    satisfactionSummaryList.teachingSummaryVo.status2
                  }})&nbsp;&nbsp;&nbsp;&nbsp; 一般:({{
                    satisfactionSummaryList.teachingSummaryVo.status3
                  }}) &nbsp;&nbsp;&nbsp;&nbsp;不满意:({{
                    satisfactionSummaryList.teachingSummaryVo.status4
                  }}) &nbsp;&nbsp;&nbsp;&nbsp;非常不满意:({{
                    satisfactionSummaryList.teachingSummaryVo.status5
                  }})
								</div>
							</el-col></el-row>
						<el-row>
							<el-col :span="4">
								<div class="grid-content bg-purple floatR">后勤服务：</div>
							</el-col>
							<el-col :span="20">
								<div class="grid-content bg-purple-light" style="text-align: center">
									非常满意:({{
                    satisfactionSummaryList.logisticsSummaryVo.status1
                  }})&nbsp;&nbsp;&nbsp;&nbsp; 满意:({{
                    satisfactionSummaryList.logisticsSummaryVo.status2
                  }})&nbsp;&nbsp;&nbsp;&nbsp; 一般:({{
                    satisfactionSummaryList.logisticsSummaryVo.status3
                  }})&nbsp;&nbsp;&nbsp;&nbsp; 不满意:({{
                    satisfactionSummaryList.logisticsSummaryVo.status4
                  }})&nbsp;&nbsp;&nbsp;&nbsp; 非常不满意:({{
                    satisfactionSummaryList.logisticsSummaryVo.status5
                  }})
								</div>
							</el-col></el-row>
						<el-row>
							<el-col :span="4">
								<div class="grid-content bg-purple floatR">总体评价：</div>
							</el-col>
							<el-col :span="20">
								<div class="grid-content bg-purple-light" style="text-align: center">
									非常满意:({{
                    satisfactionSummaryList.overallEvaluationSummaryVo.status1
                  }}) &nbsp;&nbsp;&nbsp;&nbsp; 比较满意:({{
                    satisfactionSummaryList.overallEvaluationSummaryVo.status2
                  }})&nbsp;&nbsp;&nbsp;&nbsp; 不满意:({{
                    satisfactionSummaryList.overallEvaluationSummaryVo.status3
                  }})
								</div>
							</el-col></el-row>
						<el-row>
							<div class="view-content">
								<el-col :span="4">
									<div class="grid-content bg-purple floatR" style="">
										意见与建议：
									</div>
								</el-col>
								<el-col :span="20">
									<div class="grid-content bg-purple-light"
										style="text-align: center; overflow-y: scroll;height: 36px;">
										<i v-for="(
                        item, index
                      ) in satisfactionSummaryList.contentList" v-bind:key="index">
											{{ index + 1 }}.{{ item }}
										</i>
									</div>
								</el-col>
							</div>
						</el-row>
					</div>
				</div>
			</div>
			<div class="dialog-foot">
				
				<span class="btn-download" @click="downloadSatisfaction">下载</span>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import {
		getSatisfactionList,
		pushSatisfaction,
		updateSatisfactionStatus,
		getSatisfactionStatus,
		getSatisfactionSummaryList,
	} from '../../../api/api.js'
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
				satisfactionSummaryList: [],
				satisfactionList: [],
				satisfactionStatus: false,
				listLoading: false,
				satisfactionTotal: 0,
				pagesize: 10,
				currentPage: 1,
				currentPage1: 1,
				reportList: [{
					index: '0',
					name: '张三',
					status: '0',
				}, ],
				studentFilter: {
					name: '',
					studentID: '',
					duties: '',
					currentPage: 1,
					size: 10,
				},
				multion: [],
				evalDetailDialog: false,
				evalAllDetailDialog: false,
				workTypeManageDialog: false,
				workTypeForm: {
					workType: '',
					submission: '',
				},
				workTypeFormRules: {},
				stopSubmit: true,
				uploadOptions: [{
						value: '0',
						label: '未上传',
					},
					{
						value: '1',
						label: '已上传',
					},
				],
			}
		},
		mounted() {
			this.SatisfactionList()
			this.SatisfactionStatus()
		},
		methods: {
			/**
			 * 教学评估管理
			 * openEvalDetailDialog:打开查看学生评估结果详情弹窗
			 * openWorkTypeDialog:打开新增-编辑作业类型弹窗
			 * choiceSex:选择性别
			 * updateStudent:新增-编辑学生信息
			 * 勾选
			 */
			// 下载评估表
			downloadSatisfaction(){
				let url =
					'/bw/studentSatisfaction/summaryListExport?trainingPlanId=' +
					this.planId
				this.downloadQR.downfile(url)
     },
			SatisfactionList() {
				let para = {
					trainingPlanId: this.planId,
					name: this.studentFilter.name,
					status: this.studentFilter.status,
					pageSize: this.studentFilter.size,
					pageNum: this.studentFilter.currentPage,
				}
				getSatisfactionList(para).then((res) => {
					console.log(res)
					this.satisfactionList = res.data.rows
					this.satisfactionTotal = res.data.total
				})
			},
			SatisfactionStatus() {
				let para = {
					trainingPlanId: this.planId,
				}
				getSatisfactionStatus(para).then((res) => {
					// console.log('typeof:res.data.msg',typeof(res.data.msg))
					// console.log('typeof:res.data.msg',res.data.msg)
					this.satisfactionStatus = res.data.data
				})
			},
			// 筛选催缴人员
			selectStatu(row) {
				return row.status === '0'
			},
			// 重置
			resetstudentFilter() {
				this.studentFilter = {
					name: '',
					status: '',
					currentPage: 1,
					size: 10,
				}

				this.SatisfactionList()
			},
			// 勾选
			handleSelectionChange(selection) {
				console.log(selection)
				this.selectedItems = selection
			},
			// 催交评估
			pushSatisfactionByID() {
				if (this.selectedItems.length == 0) {
					this.$message({
						message: '请选择要催交的人员',
						type: 'fail',
					})
				} else {
					let ids = []
					for (let i = 0; i < this.selectedItems.length; i++) {
						let homework = {
							userId: this.selectedItems[i].userId,
							trainingPlanId: this.planId,
						}

						ids.push(homework)
					}

					pushSatisfaction(ids).then((res) => {
						if (res.code == '200') {
							this.$message({
								message: res.msg,
								type: 'success',
							})
							this.toggleSelection()
						} else {
							this.$message({
								message: res.msg,
								type: 'error',
							})
							this.toggleSelection()
						}
					})
				}
			},
			// 一键催交
			pushBatchSatisfactionByID(){
				let ids = []
      for (let i = 0; i < this.satisfactionList.length; i++) {
        if (this.satisfactionList[i].status == '0') {
          let homework = {
            userId: this.satisfactionList[i].userId,
							trainingPlanId: this.planId,
          }
          ids.push(homework)
        }
      }
      if (ids.length > 0) {
        pushSatisfaction(ids).then((res) => {
          if (res.code == '200') {
            this.$message({
              message: res.msg,
              type: 'success',
            })
            this.toggleSelection()
          } else {
            this.$message({
              message: res.msg,
              type: 'error',
            })
            this.toggleSelection()
          }
        })
      } else {
        this.$message({
          message: '暂无可以催交的人员',
          type: 'fail',
        })
      }
			},
			//取消全选
			toggleSelection(rows) {
				if (rows) {
					rows.forEach((row) => {
						this.$refs.multipleTable.toggleRowSelection(row)
					})
				} else {
					this.$refs.multipleTable.clearSelection()
				}
			},
			// 修改收集状态
			changeSatisfactionStatus() {
				// console.log('--修改--')
				updateSatisfactionStatus({
					trainingPlanId: this.planId,
				}).then((res) => {
					// console.log('hangeSatisfactionStatus',res.data)
					this.satisfactionStatus = res.data
					// this.SatisfactionStatus()
				})
			},
			//打开查看学生评估结果详情弹窗
			openEvalDetailDialog() {
				this.evalDetailDialog = true
			},
			// 打开教学评估汇总表弹窗
			openEvalAllDetailDialog() {
				this.evalAllDetailDialog = true
				let para = {
					trainingPlanId: this.planId,
				}
				getSatisfactionSummaryList(para).then((res) => {
					debugger
					this.satisfactionSummaryList = res.data.data
				})
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
				this.studentFilter.size = size
				this.SatisfactionList()
			},
			// 分页
			handleCurrentChange: function(val) {
				this.studentFilter.currentPage = val
				this.SatisfactionList()
			},
		},
	}
</script>
<style>
	.xq-whole .name {
		width: 296px !important;
		text-align: center !important;
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

	.xq-whole .view-title {
		display: inline-block;
		float: left;
		height: 150px;
		/* line-height: 40px; */
		text-align: center;
		line-height: 150px;
		width: 296px !important;
		background-color: #f3f3f3;
		border: 1px solid #d8d8d8;
		padding-right: 5px;
		/* border-bottom: none; */
		/* margin-bottom: 3px; */
	}

	.xq-whole .view-content {
		width: calc(100% - 305px) !important;
		height: 150px;
		display: inline-block;
		float: left;
		border: 1px solid #d8d8d8;
		border-left: none;
	}

	.view-content p {
		line-height: 10px;
	}
</style>