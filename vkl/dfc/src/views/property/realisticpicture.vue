<template>
	<div class="g-cont">
		<div class="m-contain">
			<span class="btn add-btn" style="margin-right: 30px" @click="addLeader">添加</span>
			<div class="m-search" style="margin-top: 0.083rem; float: left">
				<el-form :model="filters" :inline="true" ref="filters">
					<el-form-item label="展示状态" prop="showStatus">
						<el-select v-model="filters.showStatus" placeholder="展示状态">
							<el-option value="0" label="展示"></el-option>
							<el-option value="1" label="隐藏"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="名称" prop="name">
						<el-input v-model="filters.name" placeholder="输入名称"></el-input>
					</el-form-item>
					<div class="search-btnbox">
						<span class="btn search-btn" @click="getlist(1)">查询</span>
						<span class="btn reset-btn" @click="resetForm('filters')">重置</span>
					</div>
				</el-form>
			</div>
			<div class="m-table">
				<div class="realist-main">
					<div class="realist" v-for="(item,index) in datalist" :key="index">
						<div class="realist-img">
							<img :src="item.picturedUrl" alt="">
						</div>
						<div class="realist-name">
							<span>名称：</span>
							<span>{{item.name}}</span>
						</div>
						<div class="realist-number">
							<span>序号：</span>
							<span>{{item.number}}</span>
						</div>
						<div class="realist-show">
							<div class="ztshow">
								<span>状态:</span>
								<span class="radio-tab" v-if="item.showStatus == '0'"
									@click="handlestatus(item.realisticViewId, '0')">
									展示&nbsp;<img src="../../assets/img/status-active.png" class="status-img" />
								</span>
								<span class="radio-tab" v-else-if="item.showStatus == '1'"
									@click="handlestatus(item.realisticViewId, '0')">
									隐藏&nbsp;<img src="../../assets/img/status-gray.png" class="status-img" />
								</span>
								<span v-else> / </span>
							</div>
							<div class="realist-icon">
								<img src="../../assets/img/file.png" alt="" @click="handleEdit(item.realisticViewId)">
								<img src="../../assets/img/delete.png" alt=""
									@click="visibleDelSubmit(item.realisticViewId)">
							</div>
						</div>
					</div>
				</div>

			</div>
			<div class="m-pagination">
				<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
					:current-page="currentPage" :page-size="pagesize" layout="prev, pager, next"
					:current-page.sync="currentPage1" prev-text="上一页" next-text="下一页" :total="total">
				</el-pagination>
				<i class="total">共有{{ total }}条数据</i>
			</div>
			<!-- 新增、编辑 -->
			<el-dialog :visible.sync="adddialog" v-if="adddialog" class="g-dialog" :title="diatitle">
				<el-form :model="addForm" :inline="true" ref="addForm" :rules="addFormRules" class="addform">
					<el-form-item label="名称" prop="name">
						<el-input v-model="addForm.name" placeholder="请输入名称"></el-input>
					</el-form-item>
					<el-form-item label="展示状态" prop="showStatus">
						<div class="radio-lst" v-if="addForm.showStatus == '0'" @click="handlestatus('1', '1')">
							<img src="../../assets/img/status-active.png" class="status-img" />
							展示
						</div>
						<div class="radio-lst" v-if="addForm.showStatus == '1'" @click="handlestatus('0', '1')">
							<img src="../../assets/img/status-gray.png" class="status-img" />
							隐藏
						</div>
					</el-form-item>
					<el-form-item label="序号" prop="number" style="width:100%">
						<el-input v-model="addForm.number" placeholder="请输入序号"></el-input>
					</el-form-item>
					<el-form-item label="照片" prop="" class="delbgimg" :key="formItemKey">
						<div class="upimgbox" :style="{
              backgroundImage: 'url(' + addForm.picturedUrl + ')',
            }">
							<input ref="file1" type="file" class="file" @change="choosefile($event, '1')" />
						</div>
						<i class="del-tip1" v-if="editflag" @click="handlesyimg">删除</i>
					</el-form-item>
				</el-form>
				<div class="dialog-foot">
					<span class="btn-cancel" @click="handlecancel('0')">取消</span>
					<span class="btn-save" @click="handleSave">保存</span>
				</div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import {
		realisticViewList,
		realisticViewAdd,
		realisticViewUpdate,
		realisticViewQuery,
		realisticViewDelete,
		realisticViewShow
	} from "../../api/api";
	import BaiduMap from "vue-baidu-map/components/map/Map.vue";
	import axios from "axios";
	export default {
		data() {
			return {
				filters: {
					showStatus: '',
					name: "",
					size: 10,
					current: 1,
				},
				total: 0,
				currentPage: 1,
				currentPage1: 1,
				pagesize: 10,
				datalist: [],
				listLoading: false,
				adddialog: false,
				addForm: {
					realisticViewId: '',
					name: "",
					number: "",
					showStatus: '0',
					pictureId: '',
					picturedUrl: ''
				},
				superiorList: [],
				addFormRules: {
					name: [{
						required: true,
						message: '请输入党组织名称',
						trigger: 'blur'
					}],
					position: [{
						required: true,
						message: '请选择位置',
						trigger: "change"
					}],
					showStatus: [{
						required: true,
						message: '请选择',
						trigger: 'change'
					}],
				},
				iseidt: false, //是否为编辑框
				detailform: {},
				xqdialog: false,
				editflag: false,
				formItemKey: 0,
				realisticViewId: null
			};
		},
		mounted() {
			this.getlist('');
		},
		methods: {
			// 单行变色
			tableRowClassName: function(rowIndex) {
				if (rowIndex.rowIndex % 2 != 0) {
					return "evenRow";
				}
				return "oddRow";
			},
			// 重置
			resetForm: function() {
				this.filters = {
					name: "",
					size: 10,
					current: 1,
				};
				this.getlist()
			},
			// 分页
			handleSizeChange: function(size) {
				this.pagesize = size;
				this.filters.size = size;
				this.getlist("");
			},
			// 分页
			handleCurrentChange: function(val) {
				this.filters.current = val;
				this.getlist(val);
			},
			// 获取列表
			getlist: function(val) {
				let para = {
					showStatus: this.filters.showStatus,
					name: this.filters.name,
					pageSize: this.filters.size,
					pageNum: this.filters.current,
				};
				if (val) {
					para.pageNum = val;
					this.currentPage1 = val;
				}
				realisticViewList(para).then((res) => {
					this.datalist = res.data.rows;
					this.total = res.data.total;
					this.realisticViewId = res.data.rows.realisticViewId
				});
			},
			// 切换状态
			handlestatus: function(row, type) {
				if (type == "0") {
					realisticViewShow(row).then((res) => {
						if (res.data.code == "200") {

							this.$message({
								message: res.data.msg,
								type: "success",
							});
							this.getlist("");
						} else {
							this.$message({
								message: res.data.msg,
								type: "error",
							});
						}
					});
				} else {
					console.log(row);
					this.addForm.showStatus = row;
				}
			},
			// 导入、图片上传
			choosefile: function(event, type) {
				// 文件上传
				let file = this.$refs.file1.files[0];
				console.log(file, "010100");
				this.uploadfile(file, type);
			},
			// 文件上传后获取数据
			uploadfile: function(data, type) {
				var random = new Date().getTime().toString();
				let formData = new FormData();
				formData.append("file", data);
				axios
					.post("/system/oss/upload?t=" + random, formData, {
						headers: {
							"Content-Type": "multipart/form-data",
						},
						withCredentials: true,
					})
					.then((res) => {
						if (res.data.code == 200) {
							// 图片上传后
							console.log(res.data.data.url);
							this.addForm.picturedUrl = res.data.data.url;
							this.addForm.pictureId = res.data.data.ossId;
							this.editflag = true;
						} else {
							this.$message({
								message: res.data.msg,
								type: "error",
							});
						}
					})
					.catch((res) => {
						console.log(res, "2");
					});
			},
			// 删除图片
			handlesyimg: function() {
				this.addForm.picturedUrl = require("@/assets/img/empty.png");
				this.addForm.pictureId = "";
				this.editflag = false;
				// 更新key，强制el-form-item 重新渲染
				this.formItemKey += 1;
			},
			// 新增
			addLeader() {
				this.adddialog = true;
				this.diatitle = "添加实景图";
				this.iseidt = false;
				this.addForm = {
					realisticViewId: '',
					name: "",
					number: "",
					showStatus: '0',
					pictureId: '',
					picturedUrl: "url('../img/empty.png') no-repeat",
				};
				this.editflag = false;
			},
			// 编辑
			handleEdit: function(row) {
				this.adddialog = true;
				this.diatitle = "编辑实景图";
				this.addForm.realisticViewId = row
				this.getDetail(row);
			},
			// 获取详情
			getDetail(id) {
				realisticViewQuery(id).then((res) => {
					this.addForm = res.data.data;
					if (
						this.addForm.picturedUrl == "" ||
						this.addForm.picturedUrl == null
					) {
						this.addForm.picturedUrl = require("@/assets/img/empty.png");
						this.editflag = false;
					} else {
						this.editflag = true;
					}
				});
			},
			// 保存
			handleSave() {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						let para = {
							realisticViewId: this.addForm.realisticViewId,
							name: this.addForm.name,
							number: this.addForm.number,
							pictureId: this.addForm.pictureId,
							showStatus: this.addForm.showStatus,
						};
						if (this.addForm.realisticViewId) {
							realisticViewUpdate(para).then((res) => {
								if (res.code == "200") {
									this.$message({
										message: res.msg,
										type: "success",
									});
									this.getlist(1);
								} else {
									this.$message({
										message: res.msg,
										type: "error",
									});
								}
								this.$refs.addForm.resetFields();
								this.adddialog = false;
								this.getlist(1);
							});
						} else {
							realisticViewAdd(para).then((res) => {
								if (res.code == "200") {
									this.$message({
										message: res.msg,
										type: "success",
									});
								} else {
									this.$message({
										message: res.msg,
										type: "error",
									});
								}
								this.$refs.addForm.resetFields();
								this.adddialog = false;
								this.getlist(1);
							});
						}
					}
				});
			},
			// 弹窗关闭
			handlecancel: function() {
				this.$refs.addForm.resetFields();
				this.addForm = {
					realisticViewId: '',
					name: "",
					number: "",
					showStatus: '0',
					pictureId: '',
					picturedUrl: "url('../img/empty.png') no-repeat",
				};
				this.adddialog = false;
			},
			// 删除确定
			visibleDelSubmit(id) {
				realisticViewDelete(id).then((res) => {
					if (res.data.code == '200') {
						this.$message({
							message: res.data.msg,
							type: 'success'
						})
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						})
					}
					this.getlist(1)
				})
			},
		},
	};
</script>

<style>
</style>