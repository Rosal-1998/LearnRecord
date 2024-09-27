<template>
	<div class="g-cont">
		<div class="g-lt240">
			<div :class="['read-lst',{'active':current == '0'}]" @click="handleread('0')">已读</div>
			<div :class="['read-lst',{'active':current == '1'}]" @click="handleread('1')">未读</div>
		</div>
		<div class="g-rtinfo">
			<ul class="info-ul">
				<li class="info-lst" v-for="(item,index) in infolist" @click="handlexq(item)">
					<div class="info-hd">
						<i class="dot"></i>
						<div class="info-lt" v-if="item.noticeType == '2'"><i class="f-orange" style="margin-right: 0.08333rem;">待办提醒</i> 您有一条待办</div>
						<div class="info-lt" v-else-if="item.noticeType == '1'"><i class="f-blue" style="margin-right: 0.08333rem;">系统通知</i> 您提交的事件有新进展</div>
						<div class="info-lt" v-else-if="item.noticeType == '0'"><i class="f-green" style="margin-right: 0.08333rem;">通知公告</i> {{item.noticeTitle}}</div>
						<i v-else=""></i>
						<i class="time">{{item.publishTime}}</i>
					</div>
					<div class="info-cont" v-if="item.noticeType == '0'">
						{{item.describes}}
					</div>
					<div class="info-cont" v-else="">
						{{item.noticeContent}}
					</div>
				</li>
			</ul>
		</div>
		<!-- 事件详情 -->
		<el-dialog :visible.sync="eventdialog" v-if="eventdialog" class="g-dialog" title="事件处理详情">
			<div class="addbox">
				<div class="gj-box">
					<div class="gj-lst">
						<img src="../../assets/img/id.png" class="img">
						<span class="num">{{detailfrom.evtId}}</span>
						<span class="type">ID</span>
					</div>
					<div class="gj-lst">
						<img src="../../assets/img/zdjy.png" class="img">
						<span class="num">{{detailfrom.evtTypeName}}</span>
						<span class="type">事件类型</span>
					</div>
					<div class="gj-lst">
						<img src="../../assets/img/fqr.png" class="img">
						<span class="num">{{detailfrom.evtInitiatorName}}</span>
						<span class="type">发起人</span>
					</div>
					<div class="gj-lst">
						<img src="../../assets/img/sj.png" class="img">
						<span class="num">{{detailfrom.evtStartTime}}</span>
						<span class="type">发起时间</span>
					</div>
				</div>
				<div class="lt">
					<div class="xq-content event-detail">
						<div class="xq-lst">
							<span class="name">类型</span>
							<span class="lab">{{detailfrom.evtTypeName}}</span>
						</div>
						<div class="xq-lst">
							<span class="name">标题</span>
							<span class="lab">{{addForm.evtTitle}}</span>
						</div>
						<div class="xq-lst">
							<span class="name">位置</span>
							<span class="lab">{{addForm.evtPlaceName}}</span>
						</div>
						<div class="xq-lst">
							<span class="name">事件描述</span>
							<span class="remark1">{{addForm.evtDescription}}</span>
						</div>
						<div class="xq-lst">
							<span class="name">附件</span>
							<ul class="picul" v-if="piclist.length>0" >
								<li class="pic-lst" v-for="(item,index) in piclist">
									<img :src="item.url" class="img">
								</li>
							</ul>
						</div>
						<i class="f-clearfix"></i>
						<div class="xq-lst">
							<span class="name" style="color:#ffffff">附件</span>
							<ul class="picul" v-if="audiolist.length>0">
								<li class="pic-lst aud-lst" v-for="(item,index) in audiolist">
									<audio controls class="audio">
										<source :src="item.url" type="audio/mpeg">
									</audio>
								</li>
							</ul>
						</div>
						<i class="f-clearfix"></i>
						<div class="xq-lst">
							<span class="name" style="color:#ffffff">附件</span>
							<ul class="picul" v-if="videolist.length>0">
								<li class="pic-lst" v-for="(item,index) in videolist">
									<video :src="item.url" controls="controls"></video>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div class="editbox">
					<span class="edit-tip">事件流转日志</span>
					<ul class="record-box">
						<li class="record-lst" v-for="(item,index) in recordlist">
							<i class="line"></i>
							<span class="dot"></span>
							<div class="rec-rt">
								<span class="button">{{item.activityName}}</span>
								<div class="inf"><img :src="item.assigneeAvatarUrl" class="avater">{{item.assigneeName}}</div>
								<span class="bbh">{{item.createTime}}</span>
								<div class="com-ul" v-if="item.commentList && item.commentList.length>0">
									<div v-for="(items,index) in item.commentList" class="com-lst" v-if="items.fullMessage != null">{{items.fullMessage}}</div>
								</div>
								<div class="com-ul" v-if="item.attachmentList && item.attachmentList.length>0">
									<div v-for="(items,index) in item.attachmentList" class="com-lst">附件：{{items.name}}</div>
								</div>
							</div>
						</li>
					</ul>
				</div>
			</div>
			<div class="dialog-foot four-btn" v-if="eventtype =='0'">
				<span class="btn-save" style="margin-left: 0;" @click="handleEvent('0')">受理并分配</span>
				<span class="btn-cx"  @click="handleEvent('1')">事件撤销</span>
				<span class="btn-save" @click="handleEvent('2')">发起核查</span>
				<span class="btn-ht" @click="handleEvent('3')">回退</span>
			</div>

			<div class="dialog-foot" v-if="eventtype =='3'">
				<span class="btn-cx" style="margin-left: 0;" @click="handleEvent('5')">拒签</span>
				<span class="btn-save" @click="handleEvent('4')">签收</span>
			</div>
			<div class="dialog-foot" v-if="eventtype =='2'">
				<span class="btn-cx" style="margin-left: 0;" @click="handleEvent('7')">拒签</span>
				<span class="btn-save" @click="handleEvent('6')">签收</span>
			</div>
			<div class="dialog-foot four-btn" v-if="eventtype =='4'">
				<span class="btn-save" style="margin-left: 0;" @click="handleEvent('8')">提交办结</span>
				<span class="btn-cx" @click="handleEvent('9')">自处置完成</span>
				<span class="btn-save" @click="handleEvent('10')">挂起</span>
				<span class="btn-ht" @click="handleEvent('17')">转派</span>
			</div>
			<div class="dialog-foot" v-if="eventtype =='5'">
				<span class="btn-cx" style="margin-left: 0;" @click="handleEvent('12')">退回处置</span>
				<span class="btn-save" @click="handleEvent('11')">确认办结</span>
			</div>
			<div class="dialog-foot" v-if="eventtype =='6'">
				<span class="btn-cx" style="margin-left: 0;" @click="handleEvent('15')">拒绝</span>
				<span class="btn-save" @click="handleEvent('14')">同意挂起</span>
			</div>
		</el-dialog>
		<el-dialog :visible.sync="yjdialog" v-if="yjdialog" class="g-dialog min-dia642" title="事件处理详情">
			<el-form :model="yjForm" :inline="true" ref="yjForm" :rules="yjFormRules" class="addform add-signcent">
				<el-form-item label="处理描述" prop="evtDescription">
					<el-input type="textarea" v-model="yjForm.comment" placeholder="请输入处理描述"></el-input>
				</el-form-item>
				<el-form-item label="文件" prop="">
					<div class="file-lst">
						<div class="filebox">
							<input type="file" ref="file3" class="file1" @change="choosefile($event,'3')"/>
							<span class="upfile-btn">选择上传文件</span>
						</div>
						<ul class="file-ul" style="float: left;width: 100%;">
							<li class="file-li" v-for="(item,index) in filelist" @click="handdelfile(index,'0')">
								<img src="../../assets/img/file.png" class="fileimg">{{item.fileName}}
								<span class="delfile">删除</span>
							</li>
						</ul>
					</div>
				</el-form-item>
				<!-- 受理分派、发起核查时展示 -->
				<el-form-item label="分派人员" class="user-tree" prop="" v-if="yjjdtype == '0' || yjjdtype =='2' || yjjdtype =='17'">
					<el-tree :data="userlist" ref="roletree" node-key="id" show-checkbox :props="defaultProps" highlight-current>
					</el-tree>
				</el-form-item>
			</el-form>
			<div class="dialog-foot">
				<span class="btn-cancel" @click="yjclose('0')">取消</span>
				<span class="btn-save" v-if="yjjdtype =='0'" @click="handlesubmit('0')">受理并分派</span>
				<span class="btn-save" v-if="yjjdtype =='1'" @click="handlesubmit('1')">事件撤销</span>
				<span class="btn-save" v-if="yjjdtype =='2'" @click="handlesubmit('2')">发起核查</span>
				<span class="btn-save" v-if="yjjdtype =='3'" @click="handlesubmit('3')">回退</span>
				<span class="btn-save" v-if="yjjdtype =='4'" @click="handlesubmit('4')">签收</span>
				<span class="btn-save" v-if="yjjdtype =='5'" @click="handlesubmit('5')">拒签</span>
				<span class="btn-save" v-if="yjjdtype =='6'" @click="handlesubmit('6')">签收</span>
				<span class="btn-save" v-if="yjjdtype =='7'" @click="handlesubmit('7')">拒签</span>
				<span class="btn-save" v-if="yjjdtype =='8'" @click="handlesubmit('8')">提交办结</span>
				<span class="btn-save" v-if="yjjdtype =='9'" @click="handlesubmit('9')">自动完成处置</span>
				<span class="btn-save" v-if="yjjdtype =='10'" @click="handlesubmit('10')">挂起</span>
				<span class="btn-save" v-if="yjjdtype =='11'" @click="handlesubmit('11')">确认办结</span>
				<span class="btn-save" v-if="yjjdtype =='12'" @click="handlesubmit('12')">退回处置</span>
				<span class="btn-save" v-if="yjjdtype =='13'" @click="handlesubmit('13')">核查完成</span>
				<span class="btn-save" v-if="yjjdtype =='14'" @click="handlesubmit('14')">同意挂起</span>
				<span class="btn-save" v-if="yjjdtype =='15'" @click="handlesubmit('15')">拒绝挂起</span>
				<span class="btn-save" v-if="yjjdtype =='16'" @click="handlesubmit('16')">取消挂起</span>
				<span class="btn-save" v-if="yjjdtype =='17'" @click="handlesubmit('17')">转派</span>
			</div>
		</el-dialog>
		<!-- 物业服务 -->
		<el-dialog :visible.sync="wydialog" v-if="wydialog" class="g-dialog" title="物业服务处理">
			<div class="addbox">
				<div class="gj-box">
					<div class="gj-lst">
						<img src="../../assets/img/id.png" class="img">
						<span class="num">{{detailform1.prtId}}</span>
						<span class="type">ID</span>
					</div>
					<div class="gj-lst">
						<img src="../../assets/img/zdjy.png" class="img">
						<span class="num">{{detailform1.prtTypeName}}</span>
						<span class="type">服务类型</span>
					</div>
					<div class="gj-lst">
						<img src="../../assets/img/fqr.png" class="img">
						<span class="num">{{detailform1.prtRegistrant}}</span>
						<span class="type">登记人</span>
					</div>
					<div class="gj-lst">
						<img src="../../assets/img/sj.png" class="img">
						<span class="num">{{detailform1.registerTime}}</span>
						<span class="type">发起时间</span>
					</div>
				</div>
				<div class="lt">
					<div class="xq-content event-detail">
						<div class="xq-lst">
							<span class="name">类型</span>
							<span class="lab">{{addForm1.prtTypeId}}</span>
						</div>
						<div class="xq-lst">
							<span class="name">服务地点</span>
							<span class="lab">{{addForm1.prtPlaceName}}</span>
						</div>
						<div class="xq-lst">
							<span class="name">联系人</span>
							<span class="lab">{{addForm1.prtContact}}</span>
						</div>
						<div class="xq-lst">
							<span class="name">联系电话</span>
							<span class="lab">{{addForm1.prtPhone}}</span>
						</div>
						<div class="xq-lst">
							<span class="name">备注</span>
							<span class="remark1">{{addForm1.remark}}</span>
						</div>
						<div class="xq-lst">
							<span class="name">附件</span>
							<ul class="file-ul" style="width: 75%;display: inline-block;">
								<li class="file-li" v-for="(item,index) in filelist1">
									<img src="../../assets/img/file.png" class="fileimg">{{item.fileName}}
								</li>
							</ul>
						</div>
					</div>

				</div>
				<div class="editbox">
					<span class="edit-tip">物业服务流转日志</span>
					<ul class="record-box">
						<li class="record-lst" v-for="(item,index) in recordlist1">
							<i class="line"></i>
							<span class="dot"></span>
							<div class="rec-rt">
								<span class="button">{{item.activityName}}</span>
								<div class="inf"><img :src="item.assigneeAvatarUrl" class="avater">{{item.assigneeName}}</div>
								<span class="bbh">{{item.endTime}}</span>
								<div class="com-ul" v-if="item.commentList && item.commentList.length>0">
									<div v-for="(items,index) in item.commentList" class="com-lst" v-if="items.fullMessage != null">{{items.fullMessage}}</div>
								</div>
								<div class="com-ul" v-if="item.attachmentList && item.attachmentList.length>0">
									<div v-for="(items,index) in item.attachmentList" class="com-lst">附件：{{items.name}}</div>
								</div>
							</div>
						</li>
					</ul>
				</div>
			</div>
			<!-- 受理 -->
			<div class="dialog-foot three-btn" v-if="eventtype =='8'">
				<span class="btn-save" @click="handlevent('0')">同意受理</span>
				<span class="btn-cx" @click="handlevent('1')">服务撤销</span>
				<span class="btn-ht" @click="handlevent('2')">回退</span>
			</div>
			<!-- 分派 -->
			<div class="dialog-foot one-btn" v-if="eventtype =='9'">
				<span class="btn-save" style="margin-left: 0;"  @click="handlevent('3')">分派</span>
			</div>
			<!-- 签收 -->
			<div class="dialog-foot" v-if="eventtype =='10'">
				<span class="btn-cancel"  @click="handlevent('4')">拒签</span>
				<span class="btn-save"  @click="handlevent('5')">签收</span>
			</div>
		</el-dialog>
		<el-dialog :visible.sync="yjdialog1" v-if="yjdialog1" class="g-dialog min-dia642" title="事件处理详情">
			<el-form :model="yjForm1" :inline="true" ref="yjForm" :rules="yjFormRules1" class="addform add-signcent">
				<el-form-item label="处理描述" prop="evtDescription">
					<el-input type="textarea" v-model="yjForm1.comment" placeholder="请输入处理描述"></el-input>
				</el-form-item>
				<el-form-item label="文件" prop="">
					<div class="file-lst">
						<div class="filebox">
							<input type="file" ref="file4" class="file1" @change="choosefile($event,'4')"/>
							<span class="upfile-btn">选择上传文件</span>
						</div>
						<ul class="file-ul" style="float: left;width: 100%;">
							<li class="file-li" v-for="(item,index) in attachmentList" @click="handdelfile(index,'1')">
								<img src="../../assets/img/file.png" class="fileimg">{{item.fileName}}
								<span class="delfile">删除</span>
							</li>
						</ul>
					</div>
				</el-form-item>
				<!-- 受理分派、发起核查时展示 -->
				<el-form-item label="分派人员" class="user-tree" prop="" v-if="yjtype =='3'">
					<el-tree :data="userlist1" ref="roletree1" node-key="id" show-checkbox :props="defaultProps" highlight-current>
					</el-tree>
				</el-form-item>
			</el-form>
			<div class="dialog-foot">
				<span class="btn-cancel" @click="yjclose('1')">取消</span>
				<span class="btn-save" v-if="yjtype =='0'" @click="servsubmit('0')">同意受理</span>
				<span class="btn-save" v-if="yjtype =='1'" @click="servsubmit('1')">服务撤销</span>
				<span class="btn-save" v-if="yjtype =='2'" @click="servsubmit('2')">回退</span>
				<span class="btn-save" v-if="yjtype =='3'" @click="servsubmit('3')">分派</span>
				<span class="btn-save" v-if="yjtype =='4'" @click="servsubmit('4')">拒签</span>
				<span class="btn-save" v-if="yjtype =='5'" @click="servsubmit('5')">签收</span>
				<span class="btn-save" v-if="yjtype =='6'" @click="servsubmit('6')">回退</span>
				<span class="btn-save" v-if="yjtype =='7'" @click="servsubmit('7')">确认完结</span>
			</div>
		</el-dialog>

	</div>
</template>

<script>
	import axios from 'axios'
	import { userReadInfo, SelectDeptUserTree,ChangesignReads } from '../../api/api.js'
	import { EventDetil, EvtFlowAllot,EvtFlowRevo, EvtFlowCheck, EvtFlowBackReport, EvtFlowCheckSign,EvtFlowDisSign, EvtFlowDisRefuseSign,EvtFlowCheckRefuseSign, EvtFlowSubCon, EvtFlowSelfDisComp
,EvtFlowSuspend, EvtFlowConfbCon,EvtFlowBackDis,EvtFlowCheckComplete,EvtFlowAgreeSuspend,EvtFlowRefuseSuspend,EvtFlowCancSuspend,EvtFlowTransfer } from '../../api/api.js' //事件弹窗
import {PSelectDeptUserTree, PrtDetail, ServiceAccept,ServiceRevocation,ServiceRollToRegister, ServiceAllot,ServiceRejectSign,ServiceSign,ServiceRollToFinished,ServiceConclude, RegisterAgain } from '../../api/api.js'


	export default{
		data(){
			return{
				current:'0',
				infolist:[],

				eventdialog:false,
				detailfrom:{},
				addForm:{},
				piclist:[],
				audiolist:[],
				videolist:[],
				recordlist:[],
				flowTaskId:'',
				flowInstanceId:'',
				evtId:'',
				eventtype:'', //事件流程

				yjdialog:false,
				yjForm:{
					comment:'',
					candidateUsers:[],
				},
				yjFormRules:{},
				filelist:[],
				yjjdtype:'',
				userlist:[],
				defaultProps: {
					children: 'children',
					label: 'label'
				},

				wydialog:false,
				detailform1:{},
				addForm1:{},
				recordlist1:[],
				filelist1:[],
				yjdialog1:false,
				yjForm1:{
					comment:'',
					candidateUsers:[],
				},
				yjFormRules1:{},
				attachmentList:[],
				yjtype:'',
				prtId:'',
				userlist1:[],
			}
		},
		mounted(){
			this.getlist()

		},
		methods:{
			// 获取列表
			getlist:function(){
				userReadInfo().then((res)=>{
					console.log(res.data)
					let readInfoEleVoList = res.data.data.readInfoEleVoList
					let unReadInfoEleVoList = res.data.data.unReadInfoEleVoList
					this.infolist = []
					if(this.current == '0'){
						this.infolist = readInfoEleVoList
					}else{
						this.infolist = unReadInfoEleVoList

					}
				})
			},
			// 阅读状态切换
			handleread:function(index){
				this.current = index
				this.getlist()
			},
			// 查看详情
			handlexq:function(data){
				let jumpAddress = data.jumpAddress
				console.log(jumpAddress,'jumpAddress')
				this.eventtype = jumpAddress
				let jumpParam = data.jumpParam
				if(jumpAddress == '0' || jumpAddress == '1' || jumpAddress == '2' || jumpAddress == '3' || jumpAddress == '4' ||  jumpAddress == '5'||  jumpAddress == '6' ){
					// 0 事件受理  // 1 事件详情 // 2 事件核查签收 	// 3 事件处置签收 // 4 事件处置 // 5 事件办结  // 6 事件挂起审批页面
					let procInsId = jumpParam.split('&')[0].split('=')[1]
					let taskId = jumpParam.split('&')[1].split('=')[1]
					let evtId = jumpParam.split('&')[2].split('=')[1]
					this.eventdialog = true
					this.eventDetail(procInsId,taskId,evtId)
				}else if(jumpAddress == '7'|| jumpAddress == '8' || jumpAddress == '9' || jumpAddress == '10' || jumpAddress == '11' ||  jumpAddress == '12'||  jumpAddress == '13' ){
					// 7 服务详情页面  // 8 服务受理页面 // 9 服务分派页面 	// 10 服务签收页面 // 11 服务完成页面 // 12 服务完结页面  // 13 服务重新登记页面
					let procInsId = jumpParam.split('&')[0].split('=')[1]
					let taskId = jumpParam.split('&')[1].split('=')[1]
					let prtId = jumpParam.split('&')[2].split('=')[1]
					this.wydialog = true
					this.servicedetail(prtId,procInsId,taskId)
				}else{
					console.log(data,'10010')
					// this.xqdialog = true
					this.getnotic(data.noticeId)
				}
			},
			// 事件详情
			eventDetail:function(procInsId,taskId,evtId){
				let para = {
					procInsId:procInsId,
					taskId:taskId,
					evtId:evtId,
				}
				EventDetil(para).then((res)=>{
					console.log(res.data,'详情')
					this.addForm = res.data.data.formData
					this.detailfrom =res.data.data.evtInfoVo
					this.recordlist = res.data.data.historyProcNodeList

                    this.piclist = typeof(res.data.data.formData.pictureAttachment) != "undefined" ? res.data.data.formData.pictureAttachment :[]
                    this.videolist =typeof(res.data.data.formData.videoAttachment) != "undefined" ? res.data.data.formData.videoAttachment :[]
                    this.audiolist =typeof(res.data.data.formData.audioAttachment) != "undefined" ? res.data.data.formData.audioAttachment :[]
					// 流程任务id
					this.flowTaskId = res.data.data.flowTaskId
					this.flowInstanceId = res.data.data.flowInstanceId
					this.evtId = res.data.data.evtInfoVo.evtId
				})
			},
			// 事件处理
			handleEvent:function(type){
				this.yjdialog = true
				this.yjForm = {
					comment:'',
					candidateUsers:[],
				}
				this.filelist = []
				this.yjjdtype = type
				this.getuser()
			},
			// 图片上传、上传文件
			choosefile:function(event,type){
				let file
				if(type == '0'){
					file = this.$refs.file.files[0]// 图片上传
				}else if(type == '1'){
					file = this.$refs.file1.files[0]// 音频上传
				}else if(type == '2'){
					file = this.$refs.file2.files[0] //视频上传
				}else if(type == '3'){
					file = this.$refs.file3.files[0] // 意见下的附件上传
				}else{
					file = this.$refs.file4.files[0] // 意见下的附件上传
				}
				console.log(file,'010100')
				this.uploadfile(file,type)
			},
			// 文件上传后获取数据
			uploadfile:function(data,type){
				var random = new Date().getTime().toString();
				let formData = new FormData();
				formData.append("file",data);
				axios.post('/system/oss/upload?t='+random, formData ,{
					headers: {
						"Content-Type" :"multipart/form-data",
					},
					withCredentials:true,
				}).then((res) =>{
					if(res.data.code == 200){
						if(type =='0'){// 图片
							this.piclist.push({
								fileName: res.data.data.fileName,
								url:res.data.data.url,
								ossId:res.data.data.ossId
							})
						}else if(type == '1'){//音频
							this.audiolist.push({
								fileName: res.data.data.fileName,
								url:res.data.data.url,
								ossId:res.data.data.ossId
							})
						}else if(type== '2'){//视频
							this.videolist.push({
								fileName: res.data.data.fileName,
								url:res.data.data.url,
								ossId:res.data.data.ossId
							})
						}else if(type =='3'){
							this.filelist.push({
								fileName: res.data.data.fileName,
								url:res.data.data.url,
								ossId:res.data.data.ossId
							})

						}else{
							this.attachmentList.push({
								fileName: res.data.data.fileName,
								url:res.data.data.url,
								ossId:res.data.data.ossId
							})
						}
					}else {
						this.$message({
							message:res.data.msg,
							type:'error'
						})
					}
				}).catch((res) =>{
					console.log(res,'2')
				})
			},
			// 删除文件
			handdelfile:function(index,type){
				if(type =='0'){
					this.filelist.splice(index,1)
				}else{
					this.attachmentList.splice(index,1)
				}
			},
			// 意见弹窗关闭
			yjclose:function(type){
				if(type =='0'){
					this.yjForm = {
						comment:'',
						candidateUsers:[],
					}
					this.filelist = []
					this.yjdialog = false
				}else{
					this.yjdialog1 = true
					this.yjForm1 = {
						comment:'',
						candidateUsers:[],
					}
					this.attachmentList = []
				}
			},
			// 处理事件
			handlesubmit:function(type){
				let para = {
					taskId:this.flowTaskId,
					procInsId:this.flowInstanceId,
					businessKey:this.evtId,
					comment:'处理描述：'+this.yjForm.comment, //意见
					attachmentList:this.filelist, //附件
				}
				if(type =='0'){
					// 受理并分派
					let arr = this.$refs.roletree.getCheckedKeys()
					console.log(arr,'101001')
					let c =[]
					for(var i=0; i<arr.length;i++){
						c.push({
							name:arr[i],
							value:arr[i].indexOf('user')
						})
					}
					this.yjForm.candidateUsers = []
					for(var j = 0; j<c.length;j++){
						if(c[j].value == 0){
							this.yjForm.candidateUsers.push(c[j].name.slice(4))
						}
					}
					// 分派人员
					para.candidateUsers = this.yjForm.candidateUsers
					EvtFlowAllot(para).then((res)=>{
						console.log(res,'受理并分派')
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
						this.eventdialog = false
						this.getlist()
					})
				}else if(type == '1'){
					// 事件撤销
					EvtFlowRevo(para).then((res)=>{
						console.log(res,'事件撤销')
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
						this.eventdialog = false
						this.getlist()
					})
				}else if(type == '2'){
					// 发起核查
					let arr = this.$refs.roletree.getCheckedKeys()
					let c =[]
					for(var i=0; i<arr.length;i++){
						c.push({
							name:arr[i],
							value:arr[i].indexOf('user')
						})
					}
					this.yjForm.candidateUsers = []
					for(var j = 0; j<c.length;j++){
						if(c[j].value == 0){
							this.yjForm.candidateUsers.push(c[j].name.slice(4))
						}
					}
					// 分派人员
					para.candidateUsers = this.yjForm.candidateUsers
					EvtFlowCheck(para).then((res)=>{
						console.log(res,'发起核查')
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
						this.eventdialog = false
						this.getlist(1)
					})
				}else if(type == '3'){
					EvtFlowBackReport(para).then((res)=>{
						console.log(res,'回退到上报')
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
						this.eventdialog = false
						this.getlist(1)
					})
				}else if(type =='4'){
					EvtFlowDisSign(para).then((res)=>{
						debugger
						console.log(res,'签收')
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
						this.eventdialog = false
						this.getlist(1)
					})
				}else if(type =='5'){
					EvtFlowDisRefuseSign(para).then((res)=>{
						debugger
						console.log(res,'拒签')
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
						this.eventdialog = false
						this.getlist(1)
					})
				}else if(type =='6'){
					EvtFlowCheckSign(para).then((res)=>{
						console.log(res,'签收')
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
						this.eventdialog = false
						this.getlist(1)
					})
				}else if(type =='7'){
					EvtFlowCheckRefuseSign(para).then((res)=>{
						console.log(res,'拒签')
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
						this.eventdialog = false
						this.getlist(1)
					})
				}else if(type =='8'){
					EvtFlowSubCon(para).then((res)=>{
						console.log(res,'提交办结')
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
						this.eventdialog = false
						this.getlist(1)
					})
				}else if(type =='9'){
					EvtFlowSelfDisComp(para).then((res)=>{
						console.log(res,'自处置完成')
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
						this.eventdialog = false
						this.getlist(1)
					})
				}else if(type =='10'){
					EvtFlowSuspend(para).then((res)=>{
						console.log(res,'挂起')
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
						this.eventdialog = false
						this.getlist(1)
					})
				}else if(type =='11'){
					EvtFlowConfbCon(para).then((res)=>{
						console.log(res,'确认办结')
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
						this.eventdialog = false
						this.getlist(1)
					})
				}else if(type =='12'){
					EvtFlowBackDis(para).then((res)=>{
						console.log(res,'退出处置')
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
						this.eventdialog = false
						this.getlist(1)
					})
				}else if(type =='13'){
					EvtFlowCheckComplete(para).then((res)=>{
						console.log(res,'核查完成')
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
						this.eventdialog = false
						this.getlist(1)
					})
				}else if(type =='14'){
					EvtFlowAgreeSuspend(para).then((res)=>{
						debugger
						console.log(res,'同意挂起')
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
						this.eventdialog = false
						this.getlist(1)
					})
				}else if(type == '15'){
					EvtFlowRefuseSuspend(para).then((res)=>{
						debugger
						console.log(res,'拒绝挂起')
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
						this.eventdialog = false
						this.getlist(1)
					})
				}else if(type == '16'){
					EvtFlowCancSuspend(para).then((res)=>{
						console.log(res,'取消挂起')
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
						this.eventdialog = false
						this.getlist(1)
					})
				}else{
					// 受理并分派
					let arr = this.$refs.roletree.getCheckedKeys()
					console.log(arr,'101001')
					let c =[]
					for(var i=0; i<arr.length;i++){
						c.push({
							name:arr[i],
							value:arr[i].indexOf('user')
						})
					}
					this.yjForm.candidateUsers = []
					for(var j = 0; j<c.length;j++){
						if(c[j].value == 0){
							this.yjForm.candidateUsers.push(c[j].name.slice(4))
						}
					}
					// 分派人员
					para.candidateUsers = this.yjForm.candidateUsers
					EvtFlowTransfer(para).then((res)=>{
						console.log(res,'转派')
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
						this.eventdialog = false
						this.getlist(1)
					})
				}
			},

			// 获取分派人员
			getuser:function(){
				SelectDeptUserTree().then((res)=>{
					this.userlist = res.data.data
					console.log(res.data.data,'获取分派人员')
				})
			},


			// 物业服务详情
			servicedetail:function(prtId,flowInstanceId,flowTaskId){
				let para = {
					prtId:prtId,
					procInsId:flowInstanceId,
					taskId:flowTaskId,
				}
				PrtDetail(para).then((res)=>{
					console.log(res.data.data,'物业详情')
					this.addForm1 = res.data.data.formData
					this.detailform1 =res.data.data.prtInfoVo
					this.recordlist1 = res.data.data.historyProcNodeList
					this.filelist1 = res.data.data.formData.attachmentList
					this.flowTaskId = res.data.data.flowTaskId
					this.flowInstanceId = res.data.data.flowInstanceId
					this.prtId = res.data.data.prtInfoVo.prtId

				})
			},
			// 物业服务处理
			handlevent:function(type){
				this.yjdialog1 = true
				this.yjForm1 = {
					comment:'',
					candidateUsers:[],
				}
				this.attachmentList = []
				this.yjtype = type
				this.getuser1()

			},
			// 服务处理
			servsubmit:function(type){
				let para = {
					taskId:this.flowTaskId,
					procInsId:this.flowInstanceId,
					businessKey:this.prtId,
					comment:'处理描述：'+this.yjForm1.comment, //意见
					attachmentList:this.attachmentList, //附件
				}
				if(type =='0'){
					ServiceAccept(para).then((res)=>{
						console.log(res,'同意受理')
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
						this.yjdialog1 = false
						this.wydialog = false
						this.getlist()
					})
				}else if(type =='1'){
					ServiceRevocation(para).then((res)=>{
						console.log(res,'服务撤销')
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
						this.yjdialog1 = false
						this.wydialog = false
						this.getlist()
					})
				}else if(type =='2'){
					ServiceRollToRegister(para).then((res)=>{
						console.log(res,'回退到登记')
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
						this.yjdialog1 = false
						this.wydialog = false
						this.getlist()
					})
				}else if(type =='3'){
					let arr = this.$refs.roletree1.getCheckedKeys()
					let c =[]
					for(var i=0; i<arr.length;i++){
						c.push({
							name:arr[i],
							value:arr[i].indexOf('user')
						})
					}
					this.yjForm.candidateUsers = []
					for(var j = 0; j<c.length;j++){
						if(c[j].value == 0){
							this.yjForm1.candidateUsers.push(c[j].name.slice(4))
						}
					}
					para.candidateUsers = this.yjForm1.candidateUsers
					ServiceAllot(para).then((res)=>{
						console.log(res,'分派')
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
						this.yjdialog1 = false
						this.wydialog = false
						this.getlist()
					})
				}else if(type =='4'){
					ServiceRejectSign(para).then((res)=>{
						console.log(res,'拒签')
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
						this.yjdialog1 = false
						this.wydialog = false
						this.getlist()
					})
				}else if(type =='5'){
					ServiceSign(para).then((res)=>{
						console.log(res,'签收')
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
						this.yjdialog1 = false
						this.wydialog = false
						this.getlist()
					})
				}else if(type =='6'){
					ServiceRollToFinished(para).then((res)=>{
						console.log(res,'服务办结回退到服务完成')
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
						this.yjdialog1 = false
						this.wydialog = false
						this.getlist()
					})
				}else{
					ServiceConclude(para).then((res)=>{
						console.log(res,'服务办结')
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
						this.yjdialog1 = false
						this.wydialog = false
						this.getlist()
					})
				}

			},
			// 获取分派人员
			getuser1:function(){
				PSelectDeptUserTree().then((res)=>{
					this.userlist1 = res.data.data
				})
			},
			// 通知公告详情
			getnotic:function(id){
				ChangesignReads(id).then((res)=>{
					console.log(res,'100101')
					this.current = '0'
					this.getlist()
				})
			}
		}
	}
</script>

<style>
</style>
