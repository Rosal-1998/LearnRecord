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
				<el-table :data="datalist" highlight-current-row v-loading="listLoading" style="width: 100%" border
					:row-class-name="tableRowClassName" :header-cell-style="{ 'text-align': 'center' }"
					:cell-style="{ 'text-align': 'center' }">
					<el-table-column type="selection"></el-table-column>
					<el-table-column label="序号" prop="demonstrationPostId">
					</el-table-column>
					<el-table-column label="名称" prop="name" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column label="展示状态" prop="">
						<template slot-scope="scope">
							<span class="radio-tab" v-if="scope.row.showStatus == '0'"
								@click="handlestatus(scope.row, '0')">
								展示&nbsp;<img src="../../assets/img/status-active.png" class="status-img" />
							</span>
							<span class="radio-tab" v-else-if="scope.row.showStatus == '1'"
								@click="handlestatus(scope.row, '0')">
								隐藏&nbsp;<img src="../../assets/img/status-gray.png" class="status-img" />
							</span>
							<span v-else> / </span>
						</template>
					</el-table-column>
					<el-table-column label="编辑人" prop="updateBy" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column label="编辑时间" prop="updateTime" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column label="操作" prop="" width="150">
						<template slot-scope="scope">
							<span class="edit-title" @click="handleEdit(scope.row)">编辑</span>&nbsp;&nbsp;
							<span class="detail-title" @click="handDetails(scope.row)">详情</span>&nbsp;&nbsp;
							<el-popover :ref="scope.row.demonstrationPostId" placement="top" width="160"
								popper-class="popover">
								<p class="del-tip">是否删除该信息？</p>
								<div class="pop-btnbox">
									<span class="cancel-btn"
										@click="visibleDelCancel(scope.row.demonstrationPostId)">取消</span>
									<span class="ok-btn"
										@click="visibleDelSubmit(scope.row.demonstrationPostId)">确定</span>
								</div>
								<span slot="reference" class="del-title">删除</span>
							</el-popover>
						</template>
					</el-table-column>
				</el-table>
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
					<el-form-item label="示范岗名称" prop="name">
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
					<el-form-item label="示范岗介绍" prop="introduce" style="width: 100%;">
						<quill-editor ref="mwQuillEditor" v-model="addForm.introduce"
							class="bjq-tool ql-editors" />
					</el-form-item>
					<el-form-item label="示范岗位置" prop="position">
						<el-input v-model="addForm.position" placeholder="请选择位置"></el-input>
						<span @click="Longitude">地图选点</span>
					</el-form-item>
				</el-form>
				<div class="dialog-foot">
					<span class="btn-cancel" @click="handlecancel('0')">取消</span>
					<span class="btn-save" @click="handleSave">保存</span>
				</div>
			</el-dialog>
			<!-- 详情 -->
			<el-dialog :visible.sync="xqdialog" v-if="xqdialog" class="g-dialog min-dia642" title="示范岗详情">
				<span class="tip">基础信息</span>
				<div class="xq-content car-detail">
					<div class="xq-lst">
						<span class="name">示范岗名称</span>
						<span class="lab">{{ detailform.name }}</span>
					</div>
					<div class="xq-lst">
						<span class="name">示范岗介绍</span>
						<!-- <span class="lab">{{ detailform.introduce }}</span> -->
						<div v-html="detailform.introduce"></div>
					</div>
					<div class="xq-lst">
						<span class="name">示范岗位置</span>
						<span class="lab">{{ detailform.position }}</span>
						 
					</div>
					<div class="xq-lst">
						<span class="name">展示状态</span>
						<span class="lab" v-if="detailform.showStatus=='0'">显示</span>
						<span class="lab" v-else-if="detailform.showStatus=='1'">隐藏</span>
					</div>
					<div class="xq-lst">
						<span class="name">编辑时间</span>
						<span class="lab">{{ detailform.updateTime }}</span>
					</div>
				</div>
			</el-dialog>
			<!-- 经纬度选择 -->
			<el-dialog :visible.sync="jxddialog" v-if="jxddialog" class="g-dialog" title="经纬度选择" @close="dtclose">
				<span class="tip">请在下方使用鼠标选择地址，完成选择后点击保存</span>
				<!-- <div>范围：请在下方使用鼠标点击点击画出对应河道，完成选择后点击保存</div> -->
				<div class="jwd-content">
					<baidu-map style="height: 100%" :center="mapCenter" :zoom="mapZoom" :scroll-wheel-zoom="true"
						ak="baidu-ak" @ready="handlerBMap">
					</baidu-map>
				</div>
				<div class="dialog-foot">
					<span class="btn-cancel" @click="dtclose">取消</span>
					<span class="btn-save" @click="dtsubmit">保存</span>
				</div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import {
		demonstrationPostList,
		demonstrationPostAdd,
		demonstrationPostUpdate,
		demonstrationPostQuery,
		demonstrationPostDelete,
		demonstrationPostShow
	} from "../../api/api";
	import BaiduMap from "vue-baidu-map/components/map/Map.vue";
	import axios from "axios";
	import {
		quillEditor,
		Quill
	} from 'vue-quill-editor'
	import 'quill/dist/quill.core.css'
	import 'quill/dist/quill.snow.css'
	import 'quill/dist/quill.bubble.css'
	export default {
		components: {
			BaiduMap,
			quillEditor
		},
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
					demonstrationPostId: '',
					name: "",
					introduce: "",
					position: '',
					showStatus: '0',
					longitude: "", //经度
					latitude: "", //纬度
				},
				superiorList: [],
				addFormRules: {
					name: [{
						required: true,
						message: '请输入示范岗名称',
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
				jxddialog: false,
				mapZoom: 13,
				mapCenter: {
					//青原
					lng: 115.01747,
					lat: 27.10577,
				},
				mapbox: {},
				position: ''
			};
		},
		mounted() {
			this.getlist();
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
				demonstrationPostList(para).then((res) => {
					this.datalist = res.data.rows;
					this.total = res.data.total;
				});
			},
			// 切换状态
			handlestatus: function(row, type) {
				if (type == "0") {
					let para = row.demonstrationPostId;
					demonstrationPostShow(para).then((res) => {
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
			// 新增
			addLeader() {
				this.adddialog = true;
				this.diatitle = "添加示范岗";
				this.iseidt = false;
				this.addForm = {
					demonstrationPostId: '',
					name: "",
					introduce: "",
					position: '',
					showStatus: '0',
					longitude: "", //经度
					latitude: "", //纬度
				};
			},
			// 地图选点弹框
			Longitude() {
				this.jxddialog = true;
			},
			// 初始化地图
			handlerBMap: function({
				BMap,
				map
			}) {
				var point = new BMap.Point(121.7057, 31.232451); // 上海合庆镇东风村
				map.centerAndZoom(point, 16);
				this.mapbox = {
					BMap,
					map
				};
				map.addEventListener("click", ({
					point
				}) => {
					console.log(point);
					var marker = new BMap.Marker(point); // 创建标注
					map.addOverlay(marker); // 将标注添加到地图中
					this.addForm.longitude = point.lng;
					this.addForm.latitude = point.lat;
					var aa = new BMap.Geocoder();
					aa.getLocation(point, (re) => {
						this.position = re.address
					})
				});
			},
			// 地图弹框关闭
			dtclose: function() {
				this.addForm.longitude = '';
				this.addForm.latitude = '';
				this.position = '';
				this.jxddialog = false;
			},
			// 地图保存
			dtsubmit() {
				this.addForm.position = this.position;
				this.jxddialog = false;
			},
			// 编辑
			handleEdit: function(row) {
				this.adddialog = true;
				this.diatitle = "编辑示范岗";
				this.addForm.demonstrationPostId = row.demonstrationPostId
				this.getDetail(row.demonstrationPostId);
			},
			// 点击详情
			handDetails(row) {
				this.xqdialog = true;
				this.getDetail(row.demonstrationPostId);
			},
			// 获取详情
			getDetail(id) {
				demonstrationPostQuery(id).then((res) => {
					this.addForm = res.data.data;
					this.detailform = res.data.data;
				});
			},
			// 保存
			handleSave() {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						let para = {
							demonstrationPostId: this.addForm.demonstrationPostId,
							name: this.addForm.name,
							introduce: this.addForm.introduce,
							position: this.addForm.position,
							showStatus: this.addForm.showStatus,
							longitude: this.addForm.longitude, //经度
							latitude: this.addForm.latitude, //纬度
						};
						if (this.addForm.demonstrationPostId) {
							demonstrationPostUpdate(para).then((res) => {
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
							demonstrationPostAdd(para).then((res) => {
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
					name: "",
					secretary: "",
					contacts: "",
					contactPhone: "",
					remarks: "",
				};
				this.adddialog = false;
			},
			// 删除取消
			visibleDelCancel(id) {
				this.$refs[id].doClose()
			},
			// 删除确定
			visibleDelSubmit(id) {
				demonstrationPostDelete(id).then((res) => {
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
					this.$refs[id].doClose()
					this.getlist(1)
				})
			},
		},
	};
</script>

<style>
</style>