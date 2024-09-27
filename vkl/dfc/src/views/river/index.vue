<template>
	<div class="g-cont">
		<div class="m-contain" style="padding: 0;background: transparent; border: none;">
			<div class="g-ltside" style="padding:0">
				<div class="etab-box">
					<div class="etab-lst active">事件列表</div>
				</div>
				<el-form :model="filters" ref="filters" class="event-form" v-if="type =='0'">
					<el-form-item label="">
						<el-select v-model="filters.evtTypeId" placeholder="事件类型">
							<el-option v-for="(item,index) in eventypelist" :value="item.evtTypeId" :label="item.evtTypeName" :key="index"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="">
						<el-select v-model="filters.evtNodeFlowId" placeholder="节点">
							<el-option v-for="(item,index) in nodelist" :value="item.evtNodeFlowId" :label="item.evtNodeName"  :key="index"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="">
						<el-input v-model="filters.evtInitiatorName" placeholder="发起人"></el-input>
					</el-form-item>
					<el-form-item label="">
						<el-date-picker v-model="filters.evtNodeReceiptBeginTime" type="date" placeholder="年/月/日"></el-date-picker>
					</el-form-item>
					<div class="btnbox">
						<span class="btn search-btn" @click="getlist">查询</span>
						<button class="btn reset-btn" @click="resetForm">重置</button>
					</div>
				</el-form>

			</div>
			<div class="g-rtside" style="padding: 0; position: relative;">
				<div class="status-box">
					<div v-for="(item,index) in sidelist" :class="['tab-lst',{'active':current == index}]" @click="handletab(index)">{{item.evtSidebarName}}</div>
				</div>
                <div ref="map" class="partybuild-bm-view" id="map"></div>
			</div>
		</div>

        <!--弹层-->
        <div id="popup"></div>

		<!-- 详情 -->
		<el-dialog :visible.sync="xqdialog" v-if="xqdialog" class="g-dialog" title="事件处理详情">
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
									<img :src="item.url" class="img" @click="bigpic(item.url)">
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
			<!-- 受理 -->
			<div class="dialog-foot five-btn" v-if="current =='0' && evtNodeFlowId == 'Activity_sjsl002'">
                <span class="btn-cx" style="margin-left: 0;background: #00a0e9;border: 1px solid #00a0e9" @click="yjclbtn">一键处理</span>
				<span class="btn-save" @click="handleEvent('0')">受理并分配</span>
				<span class="btn-cx" @click="handleEvent('1')">事件撤销</span>
				<span class="btn-save" @click="handleEvent('2')">发起核查</span>
				<span class="btn-ht" @click="handleEvent('3')">回退</span>
			</div>
			<!-- 重新上报 -->
			<div class="dialog-foot" v-if="current =='0' && evtNodeFlowId == 'Activity_sjsb001'">
				<span class="btn-cx" style="margin-left: 0;" @click="handlecancel('0')">取消</span>
				<span class="btn-save" @click="SubmitEvent">重新上报</span>
			</div>
			<!-- 受理并分配 签收、拒签  -->
			<div class="dialog-foot" v-if="current =='0' && evtNodeFlowId == 'Activity_sjczqs005'">
				<span class="btn-cx" style="margin-left: 0;" @click="handleEvent('5')">拒签</span>
				<span class="btn-save" @click="handleEvent('4')">签收</span>
			</div>
			<!-- 发起核查 签收、拒签 -->
			<div class="dialog-foot" v-if="current =='0' && evtNodeFlowId == 'Activity_sjhcqs003'">
				<span class="btn-cx" style="margin-left: 0;" @click="handleEvent('7')">拒签</span>
				<span class="btn-save" @click="handleEvent('6')">签收</span>
			</div>
			<!-- 核查完成 -->
			<div class="dialog-foot" v-if="current =='0' && evtNodeFlowId == 'Activity_sjhc004'">
				<span class="btn-save" @click="handleEvent('13')">核查完成</span>
			</div>
			<!-- 提交办结 自处置完成 挂起 转派-->
			<div class="dialog-foot four-btn" v-if="current =='0' && evtNodeFlowId == 'Activity_sjcz006'">
				<span class="btn-save" style="margin-left: 0;" @click="handleEvent('8')">提交办结</span>
				<span class="btn-cx" @click="handleEvent('9')">自处置完成</span>
				<span class="btn-save" @click="handleEvent('10')">挂起</span>
				<span class="btn-ht" @click="handleEvent('17')">转派</span>
			</div>
			<!-- 挂起审批 -->
			<div class="dialog-foot" v-if="current =='0' && evtNodeFlowId == 'Activity_sjgqsp007'">
				<span class="btn-cx" style="margin-left: 0;" @click="handleEvent('15')">拒绝</span>
				<span class="btn-save" @click="handleEvent('14')">同意挂起</span>
			</div>
			<div class="dialog-foot" v-if="current =='0' && evtNodeFlowId == 'Activity_sjgq009'">
				<span class="btn-save" @click="handleEvent('16')">取消挂起</span>
			</div>

			<!-- 事件办结 -->
			<div class="dialog-foot" v-if="current =='0' && evtNodeFlowId == 'Activity_sjbj008'">
				<span class="btn-cx" style="margin-left: 0;" @click="handleEvent('12')">退回处置</span>
				<span class="btn-save" @click="handleEvent('11')">确认办结</span>
			</div>
		</el-dialog>
		<!-- 意见框 -->
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
							<li class="file-li" v-for="(item,index) in filelist" @click="handdelfile(index)">
								<img src="../../assets/img/file.png" class="fileimg">{{item.fileName}}
								<span class="delfile">删除</span>
							</li>
						</ul>
					</div>
				</el-form-item>
				<!-- 受理分派、发起核查时展示 -->
				<el-form-item label="分派人员" class="user-tree" prop="" v-if="yjjdtype == '0' || yjjdtype =='2' || yjjdtype =='17'">
					<el-tree :data="userlist" ref="roletree" node-key="id" show-checkbox :props="defaultProps" highlight-current @node-click="handleClick">
					</el-tree>
				</el-form-item>
			</el-form>
			<div class="dialog-foot">
				<span class="btn-cancel" @click="yjclose">取消</span>
				<span class="btn-save" v-if="yjjdtype =='0'" @click="slfpsubmit">受理并分派</span>
				<span class="btn-save" v-if="yjjdtype =='1'" @click="handledete('0')">事件撤销</span>
				<span class="btn-save" v-if="yjjdtype =='2'" @click="hcsubmit">发起核查</span>
				<span class="btn-save" v-if="yjjdtype =='3'" @click="handledete('1')">回退</span>
				<span class="btn-save" v-if="yjjdtype =='4'" @click="signSubmit('0')">签收</span>
				<span class="btn-save" v-if="yjjdtype =='5'" @click="signSubmit('1')">拒签</span>
				<span class="btn-save" v-if="yjjdtype =='6'" @click="checksignSubmit('0')">签收</span>
				<span class="btn-save" v-if="yjjdtype =='7'" @click="checksignSubmit('1')">拒签</span>
				<span class="btn-save" v-if="yjjdtype =='8'" @click="eventsubmit('0')">提交办结</span>
				<span class="btn-save" v-if="yjjdtype =='9'" @click="eventsubmit('1')">自动完成处置</span>
				<span class="btn-save" v-if="yjjdtype =='10'" @click="eventsubmit('2')">挂起</span>
				<span class="btn-save" v-if="yjjdtype =='11'" @click="eventcomplet('0')">确认办结</span>
				<span class="btn-save" v-if="yjjdtype =='12'" @click="eventcomplet('1')">退回处置</span>
				<span class="btn-save" v-if="yjjdtype =='13'" @click="checksubmit">核查完成</span>
				<span class="btn-save" v-if="yjjdtype =='14'" @click="eventgq('0')">同意挂起</span>
				<span class="btn-save" v-if="yjjdtype =='15'" @click="eventgq('1')">拒绝挂起</span>
				<span class="btn-save" v-if="yjjdtype =='16'" @click="eventgq('2')">取消挂起</span>
				<span class="btn-save" v-if="yjjdtype =='17'" @click="zpsubmit">转派</span>
			</div>
		</el-dialog>

        <el-dialog :visible.sync="bigDialog" width="30%" title="">
            <img :src="bigUrl" alt="" style="width: 100%;">
        </el-dialog>
	</div>
</template>

<script>
	import { EventType ,EventNode,EventSidebar ,RPageEvt, RRoadList,SelectDeptUserTree} from '../../api/api.js'
	import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
	import moment from 'moment'
	import { EventDetil,EvtFlowAllot,EvtFlowDisSign,EvtFlowDisRefuseSign,EvtFlowSubCon,EvtFlowSelfDisComp,EvtFlowSuspend,EvtFlowConfbCon,EvtFlowBackDis,EvtFlowRevo,EvtFlowBackReport,EvtFlowCheck,EvtFlowCheckSign
,EvtFlowCheckRefuseSign,EvtReportAgain,EvtFlowAgreeSuspend,EvtFlowRefuseSuspend,EvtFlowCancSuspend,EvtFlowTransfer,EvtFlowDelete,EventRecall,EvtFlowCheckComplete } from '../../api/api.js'

    import 'ol/ol.css';
    import Map from 'ol/Map';
    import View from 'ol/View';
    import TileLayer from 'ol/layer/Tile';
    import VectorLayer from "ol/layer/Vector";
    import VectorSource from 'ol/source/Vector';
    import Feature from 'ol/Feature';
    import { Point, LineString } from "ol/geom";
    import {fromLonLat} from 'ol/proj';
    import { Style, Stroke, Icon } from "ol/style";
    import Overlay from 'ol/Overlay.js';
    import XYZ from 'ol/source/XYZ';
    import axios from "axios";

    export default {
		components: {
			BaiduMap
		},
		data(){
			return{
				type:'0',
				filters:{
					evtTypeId:'',
					evtNodeFlowId:'',
					evtInitiatorName:'',
					evtNodeReceiptBeginTime:'',
					evtNodeReceiptEndTime:'',
					sidebarType:'0',
				},
				eventypelist:[],
				nodelist:[],
				sidelist:[],

				mapZoom: 13,
				mapCenter: { //青原
					lng: 115.01747,
					lat: 27.10577,
				},
				mapLocation: {
					address: undefined,
					coordinate: undefined
				},

				xqdialog:false,
				detailfrom:{},
				addForm:{},
				recordlist:[],
				current:'0',
				evtNodeFlowId:'',
				piclist:[],
				audiolist:[],
				videolist:[],
				flowTaskId:'',
				flowInstanceId:'',
				evtId:'',

				yjdialog:false,
				yjForm:{
					comment:'',
					candidateUsers:[],
				},
				filelist:[],
				yjFormRules:{},
				yjjdtype:'',
				userlist:[],
				defaultProps: {
					children: 'children',
					label: 'label'
				},
                mapView:{
                    center:fromLonLat([121.6983152030946, 31.226084580813365]),
                    zoom:14,
                    minZoom:10,
                    maxZoom:14
                },
                map:null,
                dangLayer:null,
                mapUrl:'roadmap/{z}/{x}/{y}.png',
                center: {
                    lng: "115.86459",
                    lat: "28.68946",
                },
                zoom: 15,
                mapbox: {},
                popup:null,
                bigDialog:false,
                bigUrl:''
			}
		},
		mounted(){
			this.getsjlx()
			this.getnode()
			this.getside()
			this.getlist()
			this.getuser()
            this.initMap();
		},
		methods:{
            bigpic(url){
                this.bigDialog = true;
                this.bigUrl = url;
            },
			// 事件类型
			getsjlx:function(){
				EventType({evtParentType:"riverwayEvent"}).then((res)=>{
					this.eventypelist = res.data.data
				})
			},
			// 节点类型
			getnode:function(){
				EventNode().then((res)=>{
					this.nodelist = res.data.data
				})
			},
			// 状态
			getside:function(){
				EventSidebar().then((res)=>{
					this.sidelist = res.data.data
				})
			},
            initMap(){
                const tileLayer = new TileLayer({
                    source: new XYZ({
                        url:this.mapUrl
                    })
                })
                this.map = new Map({
                    target:this.$refs.map,
                    layers:[tileLayer],
                    view: new View(this.mapView)
                })
                this.dangLayer = new VectorLayer({
                    source: new VectorSource()
                });
                // 添加图层
                this.map.addLayer(this.dangLayer);

                this.popup = new Overlay({
                    element: document.getElementById('popup'),
                    positioning:'bottom-center',
                    stopEvent:true,
                    autoPan:true,
                    offset:[0,-52]
                });
                this.map.addOverlay(this.popup);
                this.getlist();
            },
			// 获取数据
			getlist:function(){
                if(this.dangLayer != null){
                    this.dangLayer.getSource().clear();
                }
				let para ={
					evtTypeId:this.filters.evtTypeId,
					evtNodeFlowId:this.filters.evtNodeFlowId,
					evtInitiatorName:this.filters.evtInitiatorName,
					evtNodeReceiptBeginTime:this.filters.evtNodeReceiptBeginTime,
					evtNodeReceiptEndTime:this.filters.evtNodeReceiptEndTime,
					evtParentType:'riverwayEvent',
					sidebarType:this.filters.sidebarType
				}
				RPageEvt(para).then((res)=>{
					let datalist = res.data.data
                    let featuresArr = [];
                    for (let i = 0; i < datalist.length; i++) {
                        // 创建feature，一个feature就是一个点坐标信息
                        let feature = new Feature({
                            geometry: new Point(fromLonLat([Number(datalist[i].evtLongitude), Number(datalist[i].evtLatitude)])),
                            datas:datalist[i]
                        });
                        if(datalist[i].evtNodeResult == 'unhandled' || datalist[i].evtNodeResult =='unreported'){
                            feature.setStyle(new Style({
                                // 设置图片效果
                                image: new Icon({
                                    src: require("../../assets/img/type0.png"),
                                    // anchor: [1, 1]
                                })
                            }));
                        }else{
                            feature.setStyle(new Style({
                                // 设置图片效果
                                image: new Icon({
                                    src: require("../../assets/img/type1.png"),
                                    // anchor: [1, 1]
                                })
                            }));
                        }
                        featuresArr.push(feature);
                    }
                    // 批量添加feature
                    this.dangLayer.getSource().addFeatures(featuresArr);
                    this.map.on("pointermove", this.mapmove);
                    this.map.on("click", this.mapclick);
				})
			},
            mapmove(e){
                //获取点标记信息
                const Feature = this.map.forEachFeatureAtPixel(e.pixel, (feature) => {
                    return feature
                })
                if(Feature != undefined){
                    let icondot = Feature.get('datas');
                    var html;
                    if(icondot.evtNodeResult == 'unhandled'){
                        html = "<div class='infoBoxCon2'>" +
                            "<div class='inf-cont'>" +
                            "<div class='lst'><i class='tipname'>事件标题：</i>" + icondot.evtTitle + "</div>" +
                            "<div class='lst'><i class='tipname'>事件类型：</i>" + icondot.evtTypeName + "</div>" +
                            "<div class='lst'><i class='tipname'>处理节点：</i>" + icondot.evtNodeName + "</div>" +
                            "<div class='lst'><i class='tipname1'>处理结果：</i><i style='color:#FB9E2B'>" + icondot.evtNodeResultName + "</i></div>" +
                            "<div class='lst'><i class='tipname'>发起人：</i>" + icondot.evtInitiatorName + "</div>" +
                            "<div class='lst'><i class='tipname'>发起时间：</i>" + icondot.evtStartTime + "</div>" +
                            "<div class='dot-line'></div>"+
                            "<div class='del-btn1' style='background:#FB9E2B'>处理</div>"+
                            "</div>" +
                            "</div>";
                    }else{
                        html = "<div class='infoBoxCon2'>" +
                            "<div class='inf-cont'>" +
                            "<div class='lst'><i class='tipname'>事件标题：</i>" + icondot.evtTitle + "</div>" +
                            "<div class='lst'><i class='tipname'>事件类型：</i>" + icondot.evtTypeName + "</div>" +
                            "<div class='lst'><i class='tipname'>处理节点：</i>" + icondot.evtNodeName + "</div>" +
                            "<div class='lst'><i class='tipname'>处理结果：</i>" + icondot.evtNodeResultName + "</div>" +
                            "<div class='lst'><i class='tipname'>发起人：</i>" + icondot.evtInitiatorName + "</div>" +
                            "<div class='lst'><i class='tipname'>发起时间：</i>" + icondot.evtStartTime + "</div>" +
                            "<div class='dot-line'></div>"+
                            "<div class='del-btn1'>详情</div>"+
                            "</div>" +
                            "</div>";
                    }
                    document.getElementById('popup').innerHTML = html;
                    this.popup.setPosition(fromLonLat([Number(icondot.evtLongitude), Number(icondot.evtLatitude)]));
                }else{
                    this.popup.setPosition(undefined)
                }
            },
            mapclick(e){
                const Feature = this.map.forEachFeatureAtPixel(e.pixel, (feature) => {
                    return feature
                })
                if(Feature != undefined) {
                    let icondot = Feature.get('datas');
                    this.xqdialog = true;
                    this.evtNodeFlowId = icondot.evtNodeFlowId
                    this.getDetail(icondot)
                }
            },
			// 重置
			resetForm:function(){
				this.$refs.filters.resetFields()
				this.filters = {
					evtTypeId:'',
					evtNodeFlowId:'',
					evtInitiatorName:'',
					evtNodeReceiptBeginTime:'',
					evtNodeReceiptEndTime:'',
					sidebarType:'0',
				}
			},
			// 详情
			getDetail:function(data){
				let para ={
					procInsId:data.flowInstanceId,
					taskId:data.flowTaskId,
					evtId:data.evtId,
				}
				EventDetil(para).then((res)=>{
					console.log(res.data,'详情')
					this.addForm = res.data.data.formData
					this.detailfrom =res.data.data.evtInfoVo
					this.recordlist = res.data.data.historyProcNodeList

                    this.piclist = typeof(res.data.data.formData.pictureAttachment) != "undefined" ? res.data.data.formData.pictureAttachment :[]
                    this.videolist = typeof(res.data.data.formData.videoAttachment) != "undefined" ? res.data.data.formData.videoAttachment :[]
                    this.audiolist = typeof(res.data.data.formData.audioAttachment) != "undefined" ? res.data.data.formData.audioAttachment :[]
					// 流程任务id
					this.flowTaskId = res.data.data.flowTaskId
					this.flowInstanceId = res.data.data.flowInstanceId
					this.evtId = res.data.data.evtInfoVo.evtId
				})
			},
			// 意见弹窗关闭
			yjclose:function(){
				this.yjForm = {
					comment:'',
					candidateUsers:[],
				}
				this.filelist = []
				this.yjdialog = false
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
			},
            //一键处理
            yjclbtn(){
                var params = {
                    taskId:this.flowTaskId,
                    procInsId:this.flowInstanceId,
                    businessKey:this.evtId,
                    variables:{
                        evtTypeId:this.addForm.evtTypeId,
                        evtTitle:this.addForm.evtTitle,
                        evtPlaceName:this.addForm.evtPlaceName,
                        evtDescription:this.addForm.evtDescription,
                        pictureAttachment:this.piclist, //附件 图片
                        videoAttachment:this.videolist, //附件 视频
                        audioAttachment:this.audiolist, //附件 音频
                    },
                }
                axios.post('/event/evtFlow/eventOneClickFinish', params).then((res) =>{
                    if(res.data.code == 200){
                        this.$message({
                            message:res.data.msg,
                            type:'success'
                        })
                        this.xqdialog = false;
                        this.getlist();
                    }else {
                        this.$message({
                            message:res.data.msg,
                            type:'error'
                        })
                    }
                }).catch((res) =>{
                    console.log(res)
                })
            },
			// 受理分派确定
			slfpsubmit:function(){
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
				let para = {
					taskId:this.flowTaskId,
					procInsId:this.flowInstanceId,
					businessKey:this.evtId,
					comment:'处理描述：'+this.yjForm.comment, //意见
					attachmentList:this.filelist, //附件
					candidateUsers:this.yjForm.candidateUsers,
				}
				console.log(para,'传参')
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
					this.xqdialog = false
					this.getlist()
				})
			},
			// 签收、拒签确定
			signSubmit:function(type){
				let para = {
					taskId:this.flowTaskId,
					procInsId:this.flowInstanceId,
					businessKey:this.evtId,
					comment:'处理描述：'+this.yjForm.comment, //意见
					attachmentList:this.filelist, //附件
				}
				if(type == '0'){
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
						this.xqdialog = false
						this.getlist()
					})
				}else{
					EvtFlowDisRefuseSign(para).then((res)=>{
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
						this.getlist()
					})
				}

			},

			// 事件处置 提交办结 、自动完成处置 、挂起
			eventsubmit:function(type){
				let para = {
					taskId:this.flowTaskId,
					procInsId:this.flowInstanceId,
					businessKey:this.evtId,
					comment:'处理描述：'+this.yjForm.comment,  //意见
					attachmentList:this.filelist, //附件
				}
				if(type == '0'){
					EvtFlowSubCon(para).then((res)=>{
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
						this.getlist()
					})
				}else if(type == '1'){
					EvtFlowSelfDisComp(para).then((res)=>{
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
						this.getlist()
					})
				}else{
					EvtFlowSuspend(para).then((res)=>{
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
						this.getlist()
					})
				}
			},
			// 确认办结、退出处置
			eventcomplet:function(type){
				let para = {
					taskId:this.flowTaskId,
					procInsId:this.flowInstanceId,
					businessKey:this.evtId,
					comment:'处理描述：'+this.yjForm.comment, //意见
					attachmentList:this.filelist, //附件
				}
				if(type == '0'){
					EvtFlowConfbCon(para).then((res)=>{
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
						this.getlist()
					})
				}else{
					EvtFlowBackDis(para).then((res)=>{
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
						this.getlist()
					})
				}
			},
			// 事件撤销 确定
			handledete:function(type){
				let para = {
					taskId:this.flowTaskId,
					procInsId:this.flowInstanceId,
					businessKey:this.evtId,
					comment:'处理描述：'+this.yjForm.comment, //意见
					attachmentList:this.filelist, //附件
				}
				if(type == '0'){
					EvtFlowRevo(para).then((res)=>{
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
						this.getlist()
					})
				}else{
					EvtFlowBackReport(para).then((res)=>{
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
						this.getlist()
					})
				}

			},
			// 核查确定
			hcsubmit:function(){
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

				let para = {
					taskId:this.flowTaskId,
					procInsId:this.flowInstanceId,
					businessKey:this.evtId,
					comment:'处理描述：'+this.yjForm.comment, //意见
					attachmentList:this.filelist, //附件
					candidateUsers:this.yjForm.candidateUsers,
				}
				EvtFlowCheck(para).then((res)=>{
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
					this.getlist()
				})
			},

			// 签收、拒签确定
			checksignSubmit:function(type){
				let para = {
					taskId:this.flowTaskId,
					procInsId:this.flowInstanceId,
					businessKey:this.evtId,
					comment:'处理描述：'+this.yjForm.comment, //意见
					attachmentList:this.filelist, //附件
				}
				if(type == '0'){
					EvtFlowCheckSign(para).then((res)=>{
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
						this.getlist()
					})
				}else{
					EvtFlowCheckRefuseSign(para).then((res)=>{
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
						this.getlist()
					})
				}

			},

			// 核查完成
			checksubmit:function(){
				let para = {
					taskId:this.flowTaskId,
					procInsId:this.flowInstanceId,
					businessKey:this.evtId,
					comment:'处理描述：'+this.yjForm.comment, //意见
					attachmentList:this.filelist, //附件
				}
				EvtFlowCheckComplete(para).then((res)=>{
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
					this.getlist()
				})
			},
			// 撤回
			handlech:function(row){
				let para = {
					taskId:row.flowTaskId,
					procInsId:row.flowInstanceId,
					businessKey:row.evtId,
				}
				EventRecall(para).then((res)=>{
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
					this.getlist()
				})
			},
			// 事件删除
			handledel:function(row){
				let para ={
					taskId:row.flowTaskId,
					procInsId:row.flowInstanceId,
					businessKey:row.evtId,
				}
				EvtFlowDelete(para).then((res)=>{
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
					this.getlist()
				})
			},
			// 同意挂起、 拒绝挂起
			eventgq:function(type){
				let para = {
					taskId:this.flowTaskId,
					procInsId:this.flowInstanceId,
					businessKey:this.evtId,
					comment:'处理描述：'+this.yjForm.comment, //意见
					attachmentList:this.filelist, //附件
				}
				if(type == '0'){
					EvtFlowAgreeSuspend(para).then((res)=>{
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
						this.getlist()
					})
				}else if(type == '1'){
					EvtFlowRefuseSuspend(para).then((res)=>{
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
						this.getlist()
					})
				}else{
					EvtFlowCancSuspend(para).then((res)=>{
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
						this.getlist()
					})
				}
			},
			// 转派
			zpsubmit:function(){
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
				let para = {
					taskId:this.flowTaskId,
					procInsId:this.flowInstanceId,
					businessKey:this.evtId,
					comment:'处理描述：'+this.yjForm.comment, //意见
					attachmentList:this.filelist, //附件
					candidateUsers:this.yjForm.candidateUsers,

				}
				EvtFlowTransfer(para).then((res)=>{
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
					this.getlist()
				})
			},
			// 重新上报确认0
			SubmitEvent:function(type){
				let variables = {
					evtTypeId:this.addForm.evtTypeId,
					evtTitle:this.addForm.evtTitle,
					evtPlaceName:this.addForm.evtPlaceName,
					evtDescription:this.addForm.evtDescription,
					pictureAttachment:this.piclist, //附件 图片
					videoAttachment:this.videolist, //附件 视频
					audioAttachment:this.audiolist, //附件 音频
				}
				let para = {
					taskId:this.flowTaskId,
					procInsId:this.flowInstanceId,
					businessKey:this.evtId,
					variables:variables, //流程变量信息
				}

				EvtReportAgain(para).then((res)=>{
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
					this.adddialog = false
					this.getlist(1)
				})
			},
			// 弹窗关闭
			handlecancel:function(type){
				this.xqdialog = false
			},

			// 获取分派人员
			getuser:function(){
				SelectDeptUserTree().then((res)=>{
					this.userlist = res.data.data
				})
			},
			// 勾选人员
			handleClick:function(data){
				let childata = this.$refs.roletree.getCheckedKeys()
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

				}
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
			// 切换事件
			handletab:function(index){
                this.current = index
                this.filters.sidebarType = this.sidelist[index].evtSidebarType
                this.getlist()
			},
		},
	}
</script>
<style scoped>
.partybuild-bm-view {
    width: 100%;
    height: 100%;
}
</style>
