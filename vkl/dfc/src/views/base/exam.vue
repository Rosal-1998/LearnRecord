<template>
	<div class="g-cont">
		<div class="g-ltside">
			<div class="tab-ul">
				<div :class="['tab-lst',{'active':current == 0}]" @click="handletab('0')">待审核</div>
				<div :class="['tab-lst',{'active':current == 1}]" @click="handletab('1')">已审核</div>
			</div>
		</div>
		<div class="g-rtside">
			<div class="m-search">
				<el-form :model="filters" :inline="true" ref="filters" >
					<el-form-item label="房屋" prop="homeName" class="ipt150">
						<el-input v-model="filters.homeName" placeholder="房屋"></el-input>
					</el-form-item>
					<el-form-item label="房间号" prop="roomNo" class="ipt150">
						<el-input v-model="filters.roomNo" placeholder="房间号"></el-input>
					</el-form-item>
					<el-form-item label="租赁状态" prop="flowStatus">
						<el-select v-model="filters.flowStatus">
							<el-option :value="item.flowStatus" :label="item.statusName" :key="index" v-for="(item,index) in rentstatus"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="籍贯" prop="registered" class="ipt150">
						<el-input v-model="filters.registered" placeholder="籍贯"></el-input>
					</el-form-item>
					<el-form-item label="联系电话" prop="contactPhone" class="ipt150">
						<el-input v-model="filters.contactPhone" placeholder="联系电话"></el-input>
					</el-form-item>
					<span class="auto-btn">自动审核：
						<el-switch v-model="value"  active-color="#13ce66" inactive-color="#ff4949"  @change="handleAutsh"></el-switch>
					</span>
					<el-form-item label="租赁人姓名/房东" prop="name" class="ipt150">
						<el-input v-model="filters.name" placeholder="租赁人姓名/房东"></el-input>
					</el-form-item>
					<el-form-item label="租赁时间" prop="time">
						<el-date-picker v-model="filters.time" type="daterange" start-placeholder="年-月-日" end-placeholder="年-月-日"></el-date-picker>
					</el-form-item>
					<div class="search-btnbox" style="margin-left: 0;">
						<span class="btn search-btn" @click="getlist(1)">查询</span>
						<span class="btn reset-btn" @click="resetForm('filters')">重置</span>
					</div>
					
				</el-form>
			</div>
			<div class="m-table">
				<el-table :data="datalist" highlight-current-row v-loading="listLoading" style="width: 100%;"
					border :row-class-name="tableRowClassName" :header-cell-style="{'text-align':'center'}"
				:cell-style="{'text-align':'center'}">
					<el-table-column label="" type="selection" width="80">
					</el-table-column>
					<el-table-column label="房屋名称" prop="homeName" :show-overflow-tooltip='true'>
					</el-table-column>
					<el-table-column label="房间号" prop="roomNo">
					</el-table-column>
					<el-table-column label="租赁人姓名" prop="renterName">
					</el-table-column>
					<el-table-column label="籍贯" prop="registered" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column label="联系电话" prop="contactPhone" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column label="房东" prop="homeownerName">
					</el-table-column>
					<el-table-column label="房东联系电话" prop="homeownerPhone" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column label="租赁状态" prop="flowStatusName">
					</el-table-column>
					<el-table-column label="提交人" prop="submitterName">
					</el-table-column>
					<el-table-column label="租赁时间" prop="rentDate" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column label="操作" prop="" width="200">
						<template slot-scope="scope">
							<div v-if="current == '0'">
								<span class="edit-title" @click="handldetail(scope.row)">审核</span>
							</div>
							<div v-if="current == '1'">
								<span class="edit-title" @click="handldetail(scope.row)">重新审核</span>
							</div>
							
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
						prev-text="< 上一页"
					    next-text="下一页 >"
				        :total="total">
				</el-pagination>
				<i class="total">共有{{total}}条数据</i>
			</div>
		</div>
		<!-- 详情 -->
		<el-dialog :visible.sync="xqdialog" v-if="xqdialog" class="g-dialog" title="租赁详情">
			<div class="addbox">
				<div class="lt">
					<div class="xq-content event-detail">
						<div class="xq-lst">
							<span class="name">房屋名称</span>
							<span class="lab">{{detailfrom.homeName}}</span>
						</div>
						<div class="xq-lst">
							<span class="name">楼层</span>
							<span class="lab">{{detailfrom.floors}}</span>
						</div>
						<div class="xq-lst">
							<span class="name">房间编号</span>
							<span class="lab">{{detailfrom.roomNo}}</span>
						</div>
						<div class="xq-lst">
							<span class="name">租赁人</span>
							<span class="lab">{{detailfrom.renterName}}</span>
						</div>
						
						<div class="xq-lst">
							<span class="name">联系电话</span>
							<span class="lab">{{detailfrom.contactPhone}}</span>
						</div>
						<div class="xq-lst">
							<span class="name">其他居住人</span>
							<!-- <span class="lab">{{detailfrom.otherLiver}}</span> -->
							<div class="">
								<i class="lab" v-for="(item,index) in detailfrom.otherLiver">
									{{item.name}}
								</i>
							</div>
						</div>
						<div class="xq-lst">
							<span class="name">居住人数</span>
							<span class="lab">{{detailfrom.population}}</span>
						</div>
						<div class="xq-lst">
							<span class="name">房东</span>
							<span class="lab">{{detailfrom.homeownerName}}</span>
						</div>
						<div class="xq-lst">
							<span class="name">联系电话</span>
							<span class="lab">{{detailfrom.homeownerPhone}}</span>
						</div>
						<div class="xq-lst">
							<span class="name">租赁时间</span>
							<span class="lab">{{detailfrom.rentDate}}</span>
						</div>
						
						<div class="xq-lst">
							<span class="name">租赁合同</span>
							<ul class="picul" v-if="detailfrom.rentContractList && detailfrom.rentContractList.length>0" >
								<li class="pic-lst" v-for="(item,index) in detailfrom.rentContractList">
									<!-- {{item.fileName}} -->
									<img :src="item.url" alt="" style="width: 30px; height: 30px;">
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div class="editbox">
					<span class="edit-tip">租赁日志</span>
					<ul class="record-box">
						<li class="record-lst" v-for="(item,index) in recordlist">
							<i class="line"></i>
							<span class="dot"></span>
							<div class="rec-rt">
								<span class="button">{{item.activityName}}</span>
								<div class="inf"><img :src="item.avatar" class="avater">{{item.nickname}}</div>
								<span class="bbh">{{item.finishTime}}</span>
								<span class="bbh">{{item.message}}</span>
							</div>
						</li>
					</ul>
				</div>
				<div class="dialog-foot">
					<span class="btn-cancel" @click="handlevent('1')">不通过</span>
					<span class="btn-save" @click="handlevent('0')">通过</span>
				</div>
			</div>
		</el-dialog>
		<!-- 意见框 -->
		<el-dialog :visible.sync="yjdialog" v-if="yjdialog" class="g-dialog min-dia642" title="租赁审核">
			<el-form :model="yjForm" :inline="true" ref="yjForm" :rules="yjFormRules" class="addform add-signcent">
				<el-form-item label="审核说明" prop="evtDescription">
					<el-input type="textarea" v-model="yjForm.comment" placeholder="请输入审核说明"></el-input>
				</el-form-item>
			</el-form>
			<div class="dialog-foot">
				<span class="btn-cancel" @click="yjclose">取消</span>
				<span class="btn-save" v-if="yjjdtype =='0'" @click="handlesubmit('0')">通过</span>
				<span class="btn-save" v-if="yjjdtype =='1'" @click="handlesubmit('1')">不通过</span>
			</div>
		</el-dialog>
		
		
	</div>
</template>

<script>
	import { HomeRentListW,HomeRentListO, HomeRentDt, HomeRentTg,HomeRentNtg,RentRecord, AutshHomeRent,GetStatusCombo,EditStatusCombo} from '../../api/api.js'
	import axios from 'axios'
	import qs from 'qs'
	import moment from 'moment'
	
	export default {
		data(){
			return{
				current:'0',
				filters:{
					homeName:'',
					roomNo:'',
					flowStatus:'',
					registered:'',
					contactPhone:'',
					name:'',
					time:[],
					rentStartDate:'',
					rentEndDate:'',
					size:10,
					current:1
				},
				datalist:[],
				listLoading:false,
				total:0,
				currentPage:1,
				currentPage1:1,
				pagesize:10,
				
				xqdialog :false,
				xqtitle:'',
				rentInfoId:'',
				detailfrom:{},
				recordlist:[],
				piclist:[],
				yjdialog:false,
				yjForm:{
					comment:'',
				},
				yjFormRules:{},
				rentstatus:[],
				value:'',
			}
		},
		mounted(){
			this.getstatus()
			this.handlecxstatus()
			this.getlist('')
		},
		methods:{
			// 租赁状态
			getstatus:function(){
				GetStatusCombo().then((res)=>{
					this.rentstatus = res.data.data
				})
			},
			// 单行变色
			tableRowClassName:function(rowIndex){
				if (rowIndex.rowIndex % 2 != 0) {
					return 'evenRow';
				}
				return 'oddRow';
			},
			// 列表
			getlist:function(val){
				if(this.filters.time && this.filters.time.length>0){
					this.filters.rentStartDate = moment(this.filters.time[0]).format('yyyy-MM-DD')
					this.filters.rentEndDate = moment(this.filters.time[1]).format('yyyy-MM-DD')
				}else{
					this.filters.rentStartDate = null
					this.filters.rentEndDate = null
				}
				let para ={
					homeName:this.filters.homeName,
					roomNo:this.filters.roomNo,
					flowStatus:this.filters.flowStatus,
					registered:this.filters.registered,
					contactPhone:this.filters.contactPhone,
					name:this.filters.name,
					rentStartDate:this.filters.rentStartDate,
					rentEndDate:this.filters.rentEndDate,
					pageSize:this.filters.size,
					pageNum:this.filters.current
				}
				if(val){
					para.pageNum = val
					this.currentPage1 = val
				}
				if(this.current == 0){
					HomeRentListW(para).then((res)=>{
						this.datalist = res.data.rows
						this.total = res.data.total
					})
				}else{
					HomeRentListO(para).then((res)=>{
						this.datalist = res.data.rows
						this.total = res.data.total
					})
				}
				
				
			},
			// 重置
			resetForm:function(filters){
				this.$refs.filters.resetFields();
				this.filters = {
					homeName:'',
					roomNo:'',
					flowStatus:'',
					registered:'',
					contactPhone:'',
					name:'',
					time:[],
					rentStartDate:'',
					rentEndDate:'',
					size:10,
					current:1
				}
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
			// 切换
			handletab:function(type){
				this.current = type
				this.$refs.filters.resetFields();
				this.filters = {
					homeName:'',
					roomNo:'',
					flowStatus:'',
					registered:'',
					contactPhone:'',
					name:'',
					time:[],
					rentStartDate:'',
					rentEndDate:'',
					size:10,
					current:1
				}
				this.getlist(1)
			},
			// 查看详情
			handldetail:function(row){
				this.xqdialog = true
				this.rentInfoId = row.rentInfoId
				this.getdetail(row.rentInfoId)
			},
			// 详情
			getdetail:function(id){
				HomeRentDt(id).then((res)=>{
					this.detailfrom = res.data.data.rentInfoVo
					console.log(this.detailfrom,'this.detailfromthis.detailfrom')
					this.recordlist = res.data.data.rentLogVos
				})
			},
			
			// 意见弹窗关闭
			yjclose:function(){
				this.yjForm = {
					comment:'',
				}
				this.yjdialog = false
			},
			// 操作按钮
			handlevent:function(type){
				this.yjdialog = true
				this.yjForm = {
					comment:'',
				}
				this.yjjdtype = type
			},
			// 事件处理操作
			handlesubmit:function(type){
				let para = {
					rentInfoId:this.rentInfoId,
					message:this.yjForm.comment, //意见
				}
				if(type == '0'){
					HomeRentTg(para).then((res)=>{
						console.log(res,'通过')
						if(res.code =='200'){
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
						this.yjdialog = false
						this.xqdialog = false
						this.getlist(1)
					})
				}else{
					HomeRentNtg(para).then((res)=>{
						console.log(res,'不通过')
						if(res.code =='200'){
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
						this.yjdialog = false
						this.xqdialog = false
						this.getlist(1)
					})
				}
			},
			// 自动审核
			handleAutsh:function(value){
				this.value =value
				let val
				if(value == true){
					val = false
				}else{
					val = true
				}
				let para = val
				EditStatusCombo(para).then((res)=>{
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
					this.getlist(1)
				})
			},
			// 修改状态
			handlecxstatus:function(){
				AutshHomeRent().then((res)=>{
					console.log(res.data.data,'0001')
					this.value = JSON.parse(res.data.data)
				})
			}
			
		}
	}
</script>

<style>
</style>