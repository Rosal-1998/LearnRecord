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
				<el-form-item label="" prop="postName">
					<el-input v-model="studentFilter.postName" placeholder="职务"></el-input>
				</el-form-item>
				<div class="search-btnbox">
					<span class="btn search-btn" @click="StudentList()">查询</span>
					<span class="btn reset-btn" @click="resetstudentFilter('studentFilter')">重置</span>
				</div>
			</el-form>
		</div>
		<div class="btn-box">
			<span class="btn search-btn" v-if="isEdit" @click="openAddStudentDialog('add')">新增学员</span>
			<span class="btn reset-btn" v-if="isEdit" @click="downloadTemple()">下载导入模板</span>
			<span class="btn import-btn" v-if="isEdit"><input type="file" ref="filebox" name="file" class="fileipt"
					@change="importStudent($event)" />导入学员</span>
			<span class="btn reset-btn" @click="derivedStudentForm()">导出学员</span>
			<span class="btn reset-btn" v-if="isEdit" @click="deleteSelectStudent()">批量删除</span>
		</div>

		<div class="m-table">
			<el-table :data="studentList" highlight-current-row v-loading="listLoading" style="width: 100%" border
				:row-class-name="tableRowClassName" :header-cell-style="{ 'text-align': 'center' }"
				:cell-style="{ 'text-align': 'center' }" @selection-change="handleSelectionChange">
				<el-table-column label="全选" type="selection" width="60">
				</el-table-column>
				<el-table-column prop="studentNo" label="学号"></el-table-column>
				<el-table-column prop="name" label="姓名"> </el-table-column>
				<el-table-column prop="" label="性别">
					<template slot-scope="scope">
						{{ scope.row.sex == 1 ? '男' : '女' }}
					</template>
				</el-table-column>
				<!-- <el-table-column prop="idCard" label="身份证号" width="200">
				</el-table-column> -->
				<el-table-column prop="phone" label="手机号码" width="200">
				</el-table-column>
				<el-table-column prop="unit" label="单位" width="200">
				</el-table-column>
				<el-table-column prop="postName" label="职务" width="200">
				</el-table-column>
				<el-table-column prop="classPost" label="班级职务" width="200">
				</el-table-column>
				<el-table-column prop="unitRegion" label="单位所属区域" width="200">
				</el-table-column>
				<el-table-column prop="unitLevel" label="单位层级" width="200">
				</el-table-column>
				<el-table-column prop="politicalOutlook" label="政治面貌" width="100">
				</el-table-column>
				<el-table-column prop="" label="操作" width="100" fixed="right">
					<template slot-scope="scope">
						<span v-if="isRead" class="edit-title"
							@click="openStudentDetailDialog(scope.row)">查看&nbsp;&nbsp;</span>
						<span v-if="isEdit" class="edit-title"
							@click="editStudentDetail(scope.row)">编辑&nbsp;&nbsp;</span>
						<el-popover v-if="isEdit" :ref="scope.row.id" placement="top" popper-class="popover">
							<p class="del-tip">是否删除该学生？</p>
							<div class="pop-btnbox">
								<span class="cancel-btn" @click="visibleGdCancel(scope.row.id)">取消</span>
								<span class="ok-btn" @click="deleteStudentByID(scope.row.id)">确定</span>
							</div>
							<span slot="reference" class="del-title">删除</span>
						</el-popover>
					</template>
				</el-table-column>
			</el-table>
			<div class="m-pagination">
				<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
					:current-page="currentPage" :page-size="pagesize" layout="prev, pager, next" prev-text="上一页"
					next-text="下一页" :total="studentTotal">
				</el-pagination>
				<i class="total">共有{{ studentTotal }}条数据</i>
			</div>
		</div>

		<!-- 新增-编辑学生窗口 -->
		<el-dialog :visible.sync="studentDialog" v-if="studentDialog" class="m-dialog" :title="studentDialogTitle" :append-to-body="true" @close="studentDialogClose">
			<el-form :model="studentForm" :inline="true" ref="studentForm" :rules="studentFormRules" class="formbox lab140">
				<div class="form-lst">
					<el-form-item label="照片" prop="" class="delbgimg" :key="formItemKey">
						<div class="upimgbox" :style="{  backgroundImage: 'url(' + studentForm.avatarFile + ')', backgroundPosition: 'center',}">
							<input ref="file" type="file" class="file" @change="choosefile($event, '1')" />
						</div>
						<i class="del-tip1" v-if="editflag" @click="handlesyimg">删除</i>
					</el-form-item>
				</div>
				<div class="form-lst">
					<el-form-item class="wholeitm" style="width: 100%" label="姓名" prop="name">
						<el-input  v-model="studentForm.name" placeholder="请输入姓名"></el-input>
					</el-form-item>
					<el-form-item style="width: 100%" label="性别" prop="sex">
						<div class="sex-box">
							<div :class="['sex-lst', { active: studentForm.sex == '0' }]" @click="choiceSex('0')"><i class="dot"></i>男</div>
							<div :class="['sex-lst', { active: studentForm.sex == '1' }]" @click="choiceSex('1')"><i class="dot"></i>女</div>
						</div>
					</el-form-item>
				</div>
				<el-form-item label="学号" prop="studentNo">
					<el-input v-model="studentForm.studentNo" type="Number" placeholder="请输入学号"></el-input>
				</el-form-item>
				<!-- <el-form-item  label="身份证号" prop="idCard">
					<el-input v-model="studentForm.idCard" placeholder="请输入身份证号"></el-input>
				</el-form-item> -->
				<el-form-item label="单位"  prop="unit">
					<el-input  v-model="studentForm.unit" placeholder="请输入单位"></el-input>
				</el-form-item>
				<el-form-item label="手机号码"  prop="phone">
					<el-input v-model="studentForm.phone" type="Number"
						placeholder="请输入手机号码"></el-input>
				</el-form-item>
				<el-form-item label="班级职务"  prop="classPost">
					<el-input  v-model="studentForm.classPost" placeholder="请输入班级职务"></el-input>
				</el-form-item>
				<el-form-item label="职务"  prop="postName">
					<el-input v-model="studentForm.postName" placeholder="请输入职务"></el-input>
				</el-form-item>
				<el-form-item label="单位所属区域"  prop="unitRegion">
					<el-input v-model="studentForm.unitRegion" placeholder="请输入单位所属区域"></el-input>
				</el-form-item>
				<el-form-item label="最高学历"  prop="highestDegree">
					<el-input v-model="studentForm.highestDegree" placeholder="请输入最高学历"></el-input>
				</el-form-item>
				<el-form-item label="政治面貌"  prop="politicalOutlook">
					<el-select v-model="studentForm.politicalOutlook" placeholder="请选择政治面貌">
						<el-option v-for="item in politicsFaceList" :key="item.value" :label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="单位层级"  prop="unitLevel">
					<el-input v-model="studentForm.unitLevel" placeholder="请输入单位层级"></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="remarks" style="width: 100%;">
					<el-input v-model="studentForm.remarks" placeholder="请输入备注" class="max0-ipt"></el-input>
				</el-form-item>
			</el-form>
			<div class="dialog-foot">
				<span class="btn-cancel" @click="cancalUpdateStudent">取消</span>
				<span class="btn-save" @click="editStudent">保存</span>
			</div>
		</el-dialog>
		<!-- 学生信息详情窗口 -->
		<el-dialog :visible.sync="studentDetailDialog" v-if="studentDetailDialog" class="m-dialog" :append-to-body="true" title="详情">
			<el-form :model="studentForm" :inline="true" ref="studentForm" :rules="studentFormRules" class="formbox lab140">
				<div class="form-lst">
					<el-form-item label="照片" prop="" class="delbgimg" :key="formItemKey">
						<div class="upimgbox" :style="{ backgroundImage: 'url(' + studentForm.photo + ')', }"></div>
					</el-form-item>
				</div>
				<div class="form-lst">
					<el-form-item class="wholeitm" style="width: 100%" label="姓名" prop="name">
						<el-input  v-model="studentForm.name" placeholder="请输入姓名"></el-input>
					</el-form-item>
					<el-form-item style="width: 100%" label="性别" prop="sex">
						<div class="sex-box">
							<div :class="['sex-lst', { active: studentForm.sex == '0' }]" @click="choiceSex('0')"><i class="dot"></i>男</div>
							<div :class="['sex-lst', { active: studentForm.sex == '1' }]" @click="choiceSex('1')"><i class="dot"></i>女</div>
						</div>
					</el-form-item>
				</div>
				<!-- <el-form-item label="身份证号" prop="idCard">
					<el-input v-model="studentForm.idCard" placeholder="请输入身份证号" :disabled="true"></el-input>
				</el-form-item> -->
				<el-form-item label="单位" prop="unit">
					<el-input v-model="studentForm.unit" placeholder="请输入单位" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="班级职务" prop="classPost">
					<el-input v-model="studentForm.classPost" placeholder="请输入班级职务" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="单位所属区域" prop="unitRegion">
					<el-input v-model="studentForm.unitRegion" placeholder="请输入单位所属区域" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="政治面貌" prop="politicalOutlook">
					<el-input v-model="studentForm.politicalOutlook" placeholder="请输入政治面貌" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="手机号码" prop="phone">
					<el-input v-model="studentForm.phone" placeholder="请输入手机号码" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="职务" prop="duties">
					<el-input v-model="studentForm.duties" placeholder="请输入职务" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="最高学历" prop="highestDegree">
					<el-input v-model="studentForm.highestDegree" placeholder="请输入最高学历" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="单位层级" prop="unitLevel">
					<el-input v-model="studentForm.unitLevel" placeholder="请输入单位层级" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="remark" style="width: 100%;">
					<el-input v-model="studentForm.remarks" placeholder="请输入备注" class="max0-ipt" :disabled="true"></el-input>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
	import { getStudentList, deleteStudent, addStudent, updateStudent, studentDetail,} from '../../../api/api.js'
	import axios from 'axios'
	export default {
		props: {
			isShowStudentManage: {
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
				fainInfo: {
					failMessage: '',
					failFileUrl: '',
					successMessage: '',
					ossId: '',
				},
				studentDialogTitle: '',
				failImportDialog: false,
				listLoading: false,
				studentTotal: 123,
				pagesize: 10,
				currentPage: 1,
				currentPage1: 1,
				studentList: [],
				studentFilter: {
					name: '',
					studentNo: '',
					postName: '',
					currentPage: 1,
					size: 10,
				},
				studentDialog:false ,
				studentDetailDialog: false,
				studentForm: {
					id: '',
					studentNo: '',
					photos: '',
					avatarFile:require('@/assets/img/empty.png'),
					name: '',
					sex: '0',
					// idCard: '',
					phone: '',
					postName: '',
					highestDegree: '', //最高学历
					unit: '', // 单位
					unitLevel: '', // 单位层级
					unitRegion: '', // 单位所属区域
					classPost: '', // 班级职务
					politicalOutlook: '', // 政治面貌
					remarks: '', // 备注
				},
				studentFormRules: {
					name: [{
						required: true,
						message: '请输入姓名',
						trigger: 'blur',
					}, ],
					sex: [{
						required: true,
						message: '请选择性别',
						trigger: 'blur',
					}, ],
					// idCard: [{
					// 	required: true,
					// 	message: '请输入身份证号',
					// 	trigger: 'blur',
					// }, ],
					unit: [{
						required: true,
						message: '请输入单位',
						trigger: 'blur',
					}],
					studentNo:[{
						required: true,
						message: '请输入学号',
						trigger: 'blur',
					}],
					// unitLevel: [{
					// 	required: true,
					// 	message: '请输入单位层级',
					// 	trigger: 'blur',
					// }, ],
					unitRegion: [{
						required: true,
						message: '请输入单位所属区域',
						trigger: 'blur',
					}, ],
					politicalOutlook: [{
						required: true,
						message: '请选择政治面貌',
						trigger: 'change',
					}, ],
					phone: [{
							required: true,
							message: '请输入手机号码',
							trigger: 'input',
						},
						{
							pattern: /^1[3-9]\d{9}$/,
							message: '手机号码格式不正确',
							trigger: 'blur',
						},
					],
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
				selectedItems: [],
				editflag: false,
			}
		},
		mounted() {
			this.StudentList()
		},
		methods: {
			/**
			 * 学员管理
			 * openAddStudentDialog:打开新增学员弹窗
			 * openStudentDetailDialog:打开学生详情窗口
			 * choiceSex:选择性别
			 * editStudent:新增-编辑学生信息
			 */
			// 选择性别
			choiceSex: function(val) {
				console.log('选择性别', val)
				this.studentForm.sex = val
				console.log(this.studentForm)
			},
			// 下载导入失败的数据
			downloadFailUrl(url) {
				// let url = '/bw/student/download'
				// this.$download(url,url)
				this.comjs.downfile(url)
			},
			// 导入学员
			importStudent: function(event) {
				console.log('-???--')
				let file = this.$refs.filebox.files[0]
				var random = new Date().getTime().toString()
				let formData = new FormData()
				formData.append('file', file)
				axios
					.post('/bw/student/import?trainingPlanId=' + this.planId, formData, {
						headers: {
							'Content-Type': 'multipart/form-data',
						},
						withCredentials: true,
					})
					.then((res) => {
						if (res.data.code == 200) {
							this.fainInfo = res.data.data
							// console.log(this.fainInfo)
							console.log(res.data.data.failMessage)
							let msg
							if (res.data.data.failMessage != null) {
								// msg = str(this.fainInfo.successMessage) + str(this.failInfo.failMessage)
								msg = res.data.data.successMessage.concat(
									',',
									res.data.data.failMessage
								)
							} else {
								msg = res.data.data.successMessage
							}
							this.$confirm(msg, '提示', {
									confirmButtonText: '确定',
									cancelButtonText: '取消',
									type: 'warning',
								})
								.then(() => {
									if (res.data.data.failMessage != null) {
										let url = res.data.data.failFileUrl
										console.log(url)
										// this.comjs.downfile(url)
										const a = document.createElement('a')
										a.href = url
										a.download = '失败数据.xlsx' // 指定下载后的文件名
										document.body.appendChild(a) // 将a标签添加到文档中
										a.click() // 触发点击事件进行下载
										document.body.removeChild(a) // 下载后移除a标签
										this.$message({
											type: 'success',
											message: '下载成功!',
										})
									} else {
										this.$message({
											type: 'success',
											message: '导入成功!',
										})
									}
								})
								.catch(() => {
									// this.$message({
									//   type: 'info',
									//   // message: '',
									// })
								})
							this.StudentList()
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
				this.$refs.filebox.value = ''
			},
			// 导出学员
			derivedStudentForm() {
				let ids = []
				if (this.selectedItems.length == 0) {
					this.$message({
						message: '未选中学员!',
						type: 'error',
					})
					return
				} else {
					for (let i = 0; i < this.selectedItems.length; i++) {
						ids.push(this.selectedItems[i].id)
					}
					let selectID = ids.join(',')
					let url = '/bw/student/export?ids=' + selectID
					this.comjs.downfile(url)
				}
			},
			// 下载导入模板
			downloadTemple() {
				let url = '/bw/student/download'
				this.comjs.downfile(url)
			},
			// 编辑学生
			editStudentDetail(row) {
				this.openAddStudentDialog('edit')
				studentDetail(row.id).then((res) => {
					this.studentForm = res.data.data
					if (res.data.data.photo != null) {
						this.studentForm.avatarFile = res.data.data.photo
						this.editflag = true
					} else {
						this.studentForm.avatarFile = "url('../img/empty.png') no-repeat"
						this.editflag = false
					}
				})
				console.log('打开编辑窗口了', this.studentForm)
			},
			// 获取学生列表
			StudentList() {
				let para = {
					trainingPlanId: this.planId,
					name: this.studentFilter.name,
					studentNo: this.studentFilter.studentNo,
					postName: this.studentFilter.postName,
					pageSize: this.studentFilter.size,
					pageNum: this.studentFilter.currentPage,
				}
				getStudentList(para).then((res) => {
					console.log(res)
					this.studentList = res.data.rows
					this.studentTotal = res.data.total
				})
			},
			// 多选学员进行操作
			handleSelectionChange(selection) {
				console.log(selection)
				this.selectedItems = selection
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
							this.studentForm.photos = res.data.data.ossId
							this.studentForm.avatarFile = res.data.data.url
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
				this.studentForm.photos = ''
				this.studentForm.avatarFile = require('@/assets/img/empty.png')
				this.$refs.file.value = ''
				this.editflag = false
			},

			// 批量删除
			deleteSelectStudent() {
				let ids = []
				for (let i = 0; i < this.selectedItems.length; i++) {
					ids.push(this.selectedItems[i].id)
				}
				let selectID = ids.join(',')
				this.deleteStudentByID(selectID)
			},
			// 删除学生
			deleteStudentByID(id) {
				deleteStudent(id).then((res) => {
					if (res.code == '200') {
						this.$message({
							message: '删除成功',
							type: 'success',
						})
						this.StudentList()
					}
				})
			},
			// 重置
			resetstudentFilter() {
				this.studentFilter = {
					name: '',
					studentNo: '',
					postName: '',
					currentPage: 1,
					size: 10,
				}
				this.StudentList()
			},
			// 重置学生表单
			resetStudentForm() {
				this.studentForm = {
					id: '',
					studentNo: '',
					avatarFile: "url('../img/empty.png') no-repeat",
					name: '',
					sex: '0',
					// idCard: '',
					phone: '',
					duties: '', //职务
					highestDegree: '', //最高学历
					unit: '', // 单位
					unitLevel: '', // 单位层级
					unitRegion: '', // 单位所属区域
					classPost: '', // 班级职务
					politicalOutlook: '', // 政治面貌
					remarks: '', // 备注
				}
			},

			// 打开学生详情窗口
			openStudentDetailDialog(row) {
				console.log(row)
				this.studentDetailDialog = true
				studentDetail(row.id).then((res) => {
					this.studentForm = res.data.data
					this.studentForm.avatarFile = res.data.data.photo
				})
			},
			// 打开新增学员窗口
			openAddStudentDialog(type) {
				this.studentDialog = true
				console.log(type)
				if (type == 'add') {
					this.studentDialogTitle = '新增学员'
				} else {
					this.studentDialogTitle = '编辑学员'
				}
				this.studentForm = {
					id: '',
					studentNo: '',
					avatarFile: "url('../img/empty.png') no-repeat",
					name: '',
					sex: '0',
					// idCard: '',
					phone: '',
					duties: '', //职务
					highestDegree: '', //最高学历
					unit: '', // 单位
					unitLevel: '', // 单位层级
					unitRegion: '', // 单位所属区域
					classPost: '', // 班级职务
					politicalOutlook: '', // 政治面貌
					remarks: '', // 备注
				}
			},
			//新增-编辑学生信息
			editStudent() {
				this.$refs.studentForm.validate((valid)=>{
					if(valid){
						let para = {
							id: this.studentForm.id,
							studentNo: this.studentForm.studentNo,
							trainingPlanId: this.planId,
							avatarFile: this.studentForm.avatarFile,
							photo: this.studentForm.avatarFile,
							name: this.studentForm.name,
							sex: this.studentForm.sex,
							// idCard: this.studentForm.idCard,
							phone: this.studentForm.phone,
							postName: this.studentForm.postName,
							highestDegree: this.studentForm.highestDegree, //最高学历
							unit: this.studentForm.unit, // 单位
							unitLevel: this.studentForm.unitLevel, // 单位层级
							unitRegion: this.studentForm.unitRegion, // 单位所属区域
							classPost: this.studentForm.classPost, // 班级职务
							politicalOutlook: this.studentForm.politicalOutlook, // 政治面貌
							remarks: this.studentForm.remarks, // 备注
						}
						if (para.id != '') {
							// 编辑
							updateStudent(para).then((res) => {
								if (res.code == '200') {
									this.$message({
										message: '编辑成功',
										type: 'success',
									})
								} else {
									this.$message({
										message: res.msg,
										type: 'error',
									})
								}
								this.StudentList()
							})
						} else {
							addStudent(para).then((res) => {
								if (res.code == '200') {
									this.$message({
										message: '新增成功',
										type: 'success',
									})
								} else {
									this.$message({
										message: res.msg,
										type: 'error',
									})
								}
								this.StudentList()
							})
						}
						this.studentDialog = false
						this.resetStudentForm()
					}
				})
				
			},
			// 取消新增-编辑学生信息
			cancalUpdateStudent() {
				// todo
				this.studentDialog = false
				this.resetStudentForm()
			},
			// 监听关闭
			studentDialogClose() {
				// console.log('---关闭')
				this.resetStudentForm()
				this.editflag = false
			},
			visibleGdCancel(id) {
				this.$refs[id].doClose()
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
				this.StudentList()
			},
			// 分页
			handleCurrentChange: function(val) {
				this.studentFilter.currentPage = val
				this.StudentList()
			},
		},
	}
</script>
<style>
	.newdig .el-form .el-input {
		width: 400px;
		background-color: #f9f9f9;
	}

	.line3 {
		width: 100%;
		height: 150px;
		margin-bottom: 10px;
	}

	.line3L {
		float: left;
		width: 50%;
	}

	.line3R {
		float: right;
		width: 50%;
		/* background-color: red */
	}

	.wholeitm {
		display: inline-block;
		width: 100%;
		/* background-color: aqua; */
		/* float:right; */
	}
</style>