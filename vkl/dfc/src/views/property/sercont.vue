<template>
	<div class="g-cont">
		<div class="m-contain">
			<span class="btn add-btn" @click="addtype">添加</span>
			<div class="m-search">
				<el-form :inline="true" :model="filters" ref="filters" id="filters" class="search-form">
					<el-form-item label="服务类别" prop="serviceCategory">
						<el-select v-model="filters.serviceCategory" clearable placeholder="服务类别">
							<el-option value="0" label="免费项目" :key="'a1'"></el-option>
							<el-option value="1" label="代办项目" :key="'a2'"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="服务类型" class="" prop="prtTypeName">
						<el-input v-model="filters.prtTypeName" placeholder="服务类型"></el-input>
					</el-form-item>
					<div class="search-btnbox">
						<span class="btn search-btn" @click="getlist(1)">查询</span>
						<span class="btn reset-btn" @click="resetForm('filters')">重置</span>
					</div>
				</el-form>
			</div>
			<div class="m-table">
				<el-table :data="datalist" highlight-current-row v-loading="listLoading" style="width: 100%;"
					border :row-class-name="tableRowClassName" :header-cell-style="{'text-align':'center'}"
				:cell-style="{'text-align':'center'}">
					<el-table-column label="ID" prop="prtTypeId" width="80"></el-table-column>
					<el-table-column label="服务类别">
						<template slot-scope="scope">
							<span v-if="scope.row.serviceCategory === '0'">免费项目</span>
							<span v-else>代办项目</span>
						</template>
					</el-table-column>
					<el-table-column label="服务类型" prop="prtTypeName">
					</el-table-column>
					<el-table-column label="是否可用" prop="">
						<template slot-scope="scope">
							<span v-if="scope.row.prtTypeStatus =='0'" @click="handlestatus(scope.row,'0')">
								可用&nbsp;<img src="../../assets/img/status-active.png" class="status-img" />
							</span>
							<span v-else-if="scope.row.prtTypeStatus =='1'" @click="handlestatus(scope.row,'0')">
								不可用&nbsp;<img src="../../assets/img/status-gray.png" class="status-img" />
							</span>
							<span v-else>
								/
							</span>
						</template>
					</el-table-column>
					<el-table-column label="收费标准" prop="prtRates">
					</el-table-column>
					<el-table-column label="服务说明" prop="prtServiceNote">
					</el-table-column>
					<el-table-column label="分派人员" prop="autoAllotUserName">
					</el-table-column>
					<el-table-column label="操作" prop="">
						<template slot-scope="scope">
							<span class="edit-title" @click="handlwyEdit(scope.row)">编辑&nbsp;&nbsp;</span>
							<el-popover :ref="scope.row.prtTypeId" placement="top" width="160" popper-class="popover">
								<p class="del-tip">是否删除该条数据？</p>
								<div class="pop-btnbox">
									<span class="cancel-btn" @click="visibleDelCancel1(scope.row.prtTypeId)">取消</span>
									<span class="ok-btn" @click="visibleDelSubmit1(scope.row.prtTypeId)">确定</span>
								</div>
								<span slot="reference" class="del-title">删除</span>
							</el-popover>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="m-pagination">
				<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
				        :current-page="currentPage"
				        :page-size="pagesize"
				        layout="prev, pager, next"
						:current-page.sync="currentPage1"
						prev-text="上一页"
					    next-text="下一页"
				        :total="total">
				</el-pagination>
				<i class="total">共有{{total}}条数据</i>
			</div>
		</div>
		<!-- 物业服务添加、编辑 -->
		<el-dialog :visible.sync="wydialog" v-if="wydialog" class="g-dialog min-dia642" :title="wytitle">
			<span class="tip">基础信息</span>
			<el-form :model="wyForm" :inline="true" ref="wyForm" :rules="wyFormRules" class="addform add-signcent">
				<el-form-item label="服务类别" prop="serviceCategory">
					<el-radio-group v-model="wyForm.serviceCategory">
						<el-radio label="0">免费项目</el-radio>
						<el-radio label="1">代办项目</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="服务类型" prop="prtTypeName">
					<el-input v-model="wyForm.prtTypeName" placeholder="请输入服务类型"></el-input>
				</el-form-item>
				<i style="display: block;width: 100%; float:left;"></i>
				<el-form-item label="是否可用" prop="">
					<div class="radio-lst" v-if="wyForm.prtTypeStatus == '0'" @click="editstatus('1')">
						<img src="../../assets/img/status-active.png" class="status-img"/> 可用
					</div>
					<div class="radio-lst" v-if="wyForm.prtTypeStatus == '1'" @click="editstatus('0')">
						<img src="../../assets/img/status-gray.png" class="status-img"/> 不可用
					</div>
				</el-form-item>
				<el-form-item label="收费标准" prop="prtRates">
					<el-input v-model="wyForm.prtRates" placeholder="请输入收费标准"></el-input>
				</el-form-item>
				<el-form-item label="服务说明" prop="prtServiceNote">
					<el-input type="textarea" v-model="wyForm.prtServiceNote" placeholder="请输入服务说明"></el-input>
				</el-form-item>
				<el-form-item
          label="分派人员"
          class="user-tree"
          prop="autoAllotUserId"
        >
				<span>{{wyForm.autoAllotUserName}}</span>
          <el-tree
            :data="userlist"
            ref="roletree"
            node-key="id"
            show-checkbox
						default-expand-all
						:check-strictly="true"
            :props="defaultProps"
            highlight-current
						@check="handleCheck"
          >
          </el-tree>
        </el-form-item>
      </el-form>
			</el-form>
			<div class="dialog-foot">
				<span class="btn-cancel" @click="handlecancel">取消</span>
				<span class="btn-save" @click="submitwy">保存</span>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { PrtTypeList ,AddPrtType ,UpdatePrtType ,DelPrtType ,UpdateStatusPrtType, PrtTypefindById,PSelectDeptUserTree } from '../../api/api.js'
	import axios from 'axios'
	import qs from 'qs'
	import Loadbox from  '../../assets/js/loading.js'
	export default {
		data() {
			return {
				allotPerson:'',
				filters: {
					serviceCategory: '',
					prtTypeName:'',
					current:1,
					size:10,
				},
				datalist: [],
				listLoading: false,
				total:0,
				pagesize:10,
				currentPage:1,
				currentPage1:1,
				wydialog:false,
				diatitle:'',
				wyForm:{
					serviceCategory: '',
					prtTypeId:'',
					prtTypeName:'',
					prtTypeStatus:'0',
					prtRates:'',
					prtServiceNote:'',
					autoAllotUserName:'',
				},
				wyFormRules:{
					serviceCategory: [{ required: true, message: '请选择服务类别', trigger: 'change' }],
					prtTypeName:[{ required:true,message:'请输入物服务类型',trigger:'blur' }]
				},
				userlist:[],
				defaultProps:{
					children:'children',
					label:'label'
				},
			}
		},
		mounted(){
			this.getlist('')
			this.getuser()
		},
		methods: {
			// 勾选人员
			handleCheck(node, { checkedNodes }) {
      const isLeaf = node.children === undefined || node.children.length === 0
      // 如果选中的节点不是叶子节点，则取消选中
      if (!isLeaf) {
        this.$refs.roletree.setChecked(node, false)
        return
      }
      // 如果节点被选中，取消其他所有选中节点
      if (checkedNodes) {
				console.log(checkedNodes)
        this.$refs.roletree.setCheckedKeys([node.id])
        this.$nextTick(() => {
          const checkedNodes = this.$refs.roletree.getCheckedNodes()
          this.allotPerson = checkedNodes[0].id
        })
      }
    },
			// 隔行颜色
			tableRowClassName: function(rowIndex) {
				if (rowIndex.rowIndex % 2 != 0) {
					return 'evenRow';
				}
				return 'oddRow';
			},
			// 获取列表
			getlist: function(val) {
				let para = {
					serviceCategory:this.filters.serviceCategory,
					prtTypeName:this.filters.prtTypeName,
					pageSize:this.filters.size,
					pageNum:this.filters.current
				}
				if(val){
					para.pageNum = val
					this.currentPage1 = val
				}
				Loadbox.showFullScreenLoading('.g-cont')
				PrtTypeList(para).then((res)=>{
					// debugger
					Loadbox.hideFullScreenLoading()
					this.datalist = res.data.rows
					this.total = res.data.total
					
				})
			},
			// 重置
			resetForm: function(filters) {
				this.$refs.filters.resetFields()
				this.filters = {
					serviceCategory:'',
					prtTypeName:'',
					current:1,
					size:10,
				}
				this.pagesize = 10
				this.currentPage1 = 1
				this.currentPage = 1
				this.getlist(1)
			},
			// 分页
			handleSizeChange:function(size){
			    this.pagesize = size;
			    this.filters.size = size
			    this.getlist('')
			},
			// 分页
			handleCurrentChange:function(val){
			   this.filters.current = val;
			   this.getlist(val);
			},
			// 新增
			addtype:function(){
				this.wydialog = true
				this.wytitle = '添加服务类型'
				this.wyForm = {
					serviceCategory: '',
					prtTypeId:'',
					prtTypeName:'',
					prtTypeStatus:'0',
					prtRates:'',
					prtServiceNote:'',
					autoAllotUserName:'',
				}
			},
			// 新增 物业服务
			submitwy:function(){
				this.$refs.wyForm.validate((valid)=>{
					if(valid){
						let para = {
							serviceCategory:this.wyForm.serviceCategory,
							prtTypeId:this.wyForm.prtTypeId,
							prtTypeName:this.wyForm.prtTypeName,
							prtTypeStatus:this.wyForm.prtTypeStatus,
							prtRates:this.wyForm.prtRates,
							prtServiceNote:this.wyForm.prtServiceNote,
							autoAllotUserId:this.allotPerson.substring(4)
						}
						console.log(para,'1001')
						if(this.wyForm.prtTypeId){
							UpdatePrtType(para).then((res)=>{
								if(res.code =='200'){
									this.$message({
										message:res.msg,
										type:'success'
									})
									this.$refs.wyForm.resetFields()
									this.wydialog = false
									this.getlist(1)
								}else{
									this.$message({
										message:res.msg,
										type:'error'
									})
									this.$refs.wyForm.resetFields()
									this.wydialog = false
									this.getlist(1)
								}
							})
						
						}else{
							AddPrtType(para).then((res)=>{
								if(res.code =='200'){
									this.$message({
										message:res.msg,
										type:'success'
									})
									this.$refs.wyForm.resetFields()
									this.wydialog = false
									this.getlist(1)
								}else{
									this.$message({
										message:res.msg,
										type:'error'
									})
									this.$refs.wyForm.resetFields()
									this.wydialog = false
									this.getlist(1)
								}
								
							})
						}
					}
				})
			},
			// 编辑
			handlwyEdit:function(row){
				this.wydialog = true
				this.wytitle = '编辑物业服务'
				this.getprtdt(row.prtTypeId)
				
			},
			// 详情
			getprtdt:function(id){
				PrtTypefindById(id).then((res)=>{
					this.wyForm = res.data.data
				})
			},
			
			// 获取分派人员
			getuser: function () {
      PSelectDeptUserTree().then((res) => {
        this.userlist = res.data.data
        console.log(this.userlist, '获取分派人员')
      })
    },
    // 勾选人员
    handleClick: function (data) {
      console.log(data, '001010')
      let childata = this.$refs.roletree.getCheckedKeys()
      console.log(childata, 'childatachildatachildata')
    },
			// 更改状态
			handlestatus:function(row,type){
				console.log(row,type,'1001001')
				if(type == '0'){
					let status
					if(row.prtTypeStatus =='0'){
						status = '1'
					}else{
						status = '0'
					}
					let para ={
						id:row.prtTypeId,
						status:status
					}
					UpdateStatusPrtType(qs.stringify(para)).then((res)=>{
						if(res.code == '200'){
							this.$message({
								message:res.msg,
								type:'success'
							})
						}else{
							this.$message({
								message:res.msg,
								type:'error'
							})
						}
						this.getlist(1)
					})
				}else{
					this.wyForm.prtTypeStatus = row
					console.log(this.wyForm.prtTypeStatus,'this.wyForm.prtTypeStatus')
				}
			},
			// 编辑下的更改状态
			editstatus:function(value){
				this.wyForm.prtTypeStatus = value
			},
			// 删除 取消
			visibleDelCancel1(id) {
				this.$refs[id].doClose()
				// this.getlist(1)
			},
			// 删除确认
			visibleDelSubmit1(id) { 
				DelPrtType(id).then((res)=>{
					console.log(res,'10101')
					if(res.data.code =='200'){
						this.$message({
							  message:res.data.msg,
							  type:'success'
						})
					}else{
						this.$message({
							message:res.data.msg,
							type:'error'
						}) 
					}
					this.$refs[id].doClose()
					this.getlist(1)
				})
			},
			// 弹窗关闭
			handlecancel:function(){
				this.$refs.wyForm.resetFields()
				this.wyForm = {
					serviceCategory: '',
					prtTypeId:'',
					prtTypeName:'',
					prtTypeStatus:'0',
					prtRates:'',
					prtServiceNote:'',
				}
				this.wydialog = false
			}
		}
	}
</script>

<style>
</style>