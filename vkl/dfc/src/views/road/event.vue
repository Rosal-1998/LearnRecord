<template>
	<div class="g-cont">
		<div class="g-ltside">
			<div class="tab-ul">
				<div v-for="(item, index) in sidelist" :class="['tab-lst', { active: current == index }]"
					@click="handletab(index)">
					{{ item.evtSidebarName }}
				</div>
			</div>
		</div>
		<div class="g-rtside">
			<div class="m-search" style="float: left">
				<el-form :model="filters" :inline="true" ref="filters">
					<el-form-item label="事件类型" prop="evtTypeId">
						<el-select v-model="filters.evtTypeId" placeholder="事件类型">
							<el-option v-for="(item, index) in eventypelist" :value="item.evtTypeId"
								:label="item.evtTypeName" :key="index"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="处理节点" prop="evtNodeFlowId">
						<el-select v-model="filters.evtNodeFlowId" placeholder="处理节点">
							<el-option v-for="(item, index) in nodelist" :value="item.evtNodeFlowId"
								:label="item.evtNodeName" :key="index"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="发起人" class="ipt150" prop="evtInitiatorName">
						<el-input v-model="filters.evtInitiatorName" placeholder="发起人"></el-input>
					</el-form-item>
					<el-form-item label="接收日期">
						<el-date-picker v-model="filters.time" type="daterange" start-placeholder="年/月/日"
							end-placeholder="年/月/日"></el-date-picker>
					</el-form-item>
					<div class="search-btnbox" style="margin-left: 0">
						<span class="btn search-btn" @click="getlist(1)">查询</span>
						<span class="btn reset-btn" @click="resetForm('filters')">重置</span>
					</div>
				</el-form>
			</div>
			<span class="btn add-btn" style="margin-bottom: 0.08333rem" v-if="current == '2'"
				@click="handlefq">发起</span>
			<div class="m-table">
				<div v-if="current == '0'" class="search-btnbox"
					style="float: left; margin-left: 0; margin-bottom: 20px">
					<span class="btn search-btn" style="margin-right: 20px;" @click="handleOnce()">批量处理</span>
					<template>
						<el-popover placement="top-start" width="200" popper-class="popover" v-model="visibleDelete">
							<p class="del-tip">是否删除事件？</p>
							<div class="pop-btnbox">
								<span class="cancel-btn" @click="visibleDelete = !visibleDelete">取消</span>
								<span class="ok-btn" @click="sumbitDeleteOnce()">确定</span>
							</div>
							<span slot="reference" class="btn del-btn" style="float: left">批量删除</span>
						</el-popover></template>
				</div>
				<el-table :data="datalist" highlight-current-row v-loading="listLoading" style="width: 100%"
					@selection-change="handleSelectionChange" border :row-class-name="tableRowClassName"
					:header-cell-style="{ 'text-align': 'center' }" :cell-style="{ 'text-align': 'center' }">
					<el-table-column type="selection" width="55" v-if="current == '0'" :selectable="selectable">
					</el-table-column>
					<el-table-column label="ID" prop="evtId" width="100" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column label="标题" prop="evtTitle" width="150" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column label="事件类型" prop="evtTypeName" width="160">
					</el-table-column>
					<el-table-column label="处理节点" prop="evtNodeName" width="120">
					</el-table-column>
					<el-table-column label="处理结果" prop="" width="100">
						<template slot-scope="scope">
							<span class="f-orange"
								v-if="scope.row.evtNodeResultName == '待处理'">{{ scope.row.evtNodeResultName }}</span>
							<span class="f-red" v-else-if="
                  scope.row.evtNodeResultName == '拒签' ||
                  scope.row.evtNodeResultName == '退回处置' ||
                  scope.row.evtNodeResultName == '挂起'
                ">{{ scope.row.evtNodeResultName }}</span>
							<span v-else-if="scope.row.evtNodeResultName == ''">/</span>
							<span class="f-blue" v-else>{{
                scope.row.evtNodeResultName
              }}</span>
						</template>
					</el-table-column>
					<el-table-column label="来源" prop="evtFromName"> </el-table-column>
					<el-table-column label="发起人" prop="evtInitiatorName" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column label="发起时间" prop="evtStartTime" width="200">
					</el-table-column>
					<el-table-column label="接收时间" prop="evtNodeReceiptTime" width="200">
					</el-table-column>
					<el-table-column label="操作" prop="" width="120">
						<template slot-scope="scope">
							<div v-if="current == '0'">
								<span class="edit-title" v-if="scope.row.evtNodeFlowId == 'Activity_sjsb001'"
									@click="reportagain(scope.row)">处理</span>
								<span class="edit-title" v-else="" @click="handldeal(scope.row)">处理</span>
							</div>
							<div v-if="current == '1'">
								<span class="detail-title" @click="handldetail(scope.row)">详情</span>
							</div>
							<div v-if="current == '2'">
								<span class="edit-title" v-if="
                    scope.row.evtNodeResult == 'unreported' &&
                    scope.row.evtNodeFlowId == 'Activity_sjsb001'
                  " @click="reportagain(scope.row)">重新上报&nbsp;&nbsp;</span>
								<span class="del-title" v-if="
                    scope.row.evtNodeResult == 'unreported' &&
                    scope.row.evtNodeFlowId == 'Activity_sjsb001'
                  " @click="handledel(scope.row)">删除&nbsp;&nbsp;</span>
								<span class="edit-title" v-if="
                    scope.row.evtNodeResult == 'unhandled' &&
                    scope.row.evtNodeFlowId == 'Activity_sjsl002'
                  " @click="handlech(scope.row)">撤回&nbsp;&nbsp;</span>
								<span class="detail-title" v-if="
                    scope.row.evtNodeFlowId != 'Activity_sjsb001' ||
                    scope.row.evtNodeFlowId != 'Activity_sjsl002'
                  " @click="handldetail(scope.row)">详情</span>
							</div>
							<div v-if="current == '3'">
								<span class="detail-title" @click="handldetail(scope.row)">详情</span>
							</div>
							<!-- <el-popover :ref="scope.row.evtId" placement="top" width="160" popper-class="popover">
								<p class="del-tip">是否删除该条数据？</p>
								<div class="pop-btnbox">
									<span class="cancel-btn" @click="visibleDelCancel(scope.row.evtId)">取消</span>
									<span class="ok-btn" @click="visibleDelSubmit(scope.row.evtId)">确定</span>
								</div>
								<span slot="reference" class="del-title">删除</span>
							</el-popover> -->
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="m-pagination">
				<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
					:current-page="currentPage" :page-size="pagesize" layout="prev, pager, next"
					:current-page.sync="currentPage1" prev-text="< 上一页" next-text="下一页 >" :total="total">
				</el-pagination>
				<i class="total">共有{{ total }}条数据</i>
			</div>
		</div>
		<!-- 事件上报 -->
		<el-dialog :visible.sync="adddialog" v-if="adddialog" class="g-dialog" :title="diatitle">
			<div :class="['addbox', addflag ? 'showlog' : 'hidelog']">
				<div class="gj-box">
					<div class="gj-lst">
						<img src="../../assets/img/id.png" class="img" />
						<span class="num">{{ detailfrom.evtId }}</span>
						<span class="type">ID</span>
					</div>
					<div class="gj-lst">
						<img src="../../assets/img/zdjy.png" class="img" />
						<span class="num">{{ detailfrom.evtTypeName }}</span>
						<span class="type">事件类型</span>
					</div>
					<div class="gj-lst">
						<img src="../../assets/img/fqr.png" class="img" />
						<span class="num">{{ detailfrom.evtInitiatorName }}</span>
						<span class="type">发起人</span>
					</div>
					<div class="gj-lst">
						<img src="../../assets/img/sj.png" class="img" />
						<span class="num">{{ detailfrom.evtStartTime }}</span>
						<span class="type">发起时间</span>
					</div>
				</div>
				<div class="lt">
					<span class="tip">基础信息</span>
					<el-form :model="addForm" :inline="true" ref="addForm" :rules="addFormRules"
						class="addform add-signcent">
						<el-form-item label="类型" prop="evtTypeId">
							<el-select v-model="addForm.evtTypeId" placeholder="事件类型" @change="choosetype">
								<el-option v-for="(item, index) in eventypelist" :value="item.evtTypeId"
									:label="item.evtTypeName" :key="index"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="标题" prop="evtTitle">
							<el-input v-model="addForm.evtTitle" placeholder="请输入标题"></el-input>
						</el-form-item>
						<el-form-item label="位置" prop="evtPlaceName" style="position: relative">
							<el-input v-model="addForm.evtPlaceName" placeholder="请输入位置"></el-input>
							<div class="areasite" @click="choosedt">
								<img src="../../assets/img/site.png" class="site-img" />地图选点
							</div>
						</el-form-item>
						<el-form-item label="事件描述" prop="evtDescription">
							<el-input type="textarea" v-model="addForm.evtDescription" placeholder="请输入事件描述"></el-input>
						</el-form-item>
						<el-form-item label="附件" prop="" :key="formItemKey">
							<div class="file-lst">
								<div class="filebox">
									<input type="file" ref="file" class="file1" @change="choosefile($event, '0')" />
									<span class="upfile-btn">选择上传图片</span>
								</div>
								<ul class="picul" v-if="piclist.length > 0">
									<li class="pic-lst" v-for="(item, index) in piclist"
										@click="previewFile(item.url, 'image')">
										<img :src="item.url" class="img" />
										<img src="../../assets/img/shanchu.png" class="shanchu-img"
											@click="delfile(index, '0')" />
									</li>
								</ul>
							</div>
						</el-form-item>
						<el-form-item label="附件1" prop="" class="noname">
							<div class="file-lst">
								<div class="filebox">
									<input type="file" ref="file1" class="file1" @change="choosefile($event, '1')" />
									<span class="upfile-btn">选择上传音频</span>
								</div>
								<ul class="picul" v-if="audiolist.length > 0">
									<li class="pic-lst aud-lst" v-for="(item, index) in audiolist"
										@click="previewFile(item.url, 'audio')">
										<audio controls class="audio">
											<source :src="item.url" type="audio/mpeg" />
										</audio>
										<img src="../../assets/img/shanchu.png" class="shanchu-img"
											@click="delfile(index, '1')" />
									</li>
								</ul>
							</div>
							<i class="f-clearfix"></i>
						</el-form-item>
						<el-form-item label="附件2" prop="" class="noname">
							<div class="file-lst">
								<div class="filebox">
									<input type="file" ref="file2" class="file1" @change="choosefile($event, '2')" />
									<span class="upfile-btn">选择上传视频</span>
								</div>
								<ul class="picul" v-if="videolist.length > 0">
									<li class="pic-lst" v-for="(item, index) in videolist"
										@click="previewFile(item.url, 'video')">
										<video :src="item.url" controls="controls"></video>
										<img src="../../assets/img/shanchu.png" class="shanchu-img"
											@click="delfile(index, '2')" />
									</li>
								</ul>
							</div>
						</el-form-item>
						<el-form-item label="分派人员" class="user-tree">
							<el-tree :data="userlist" ref="roletree" node-key="id" show-checkbox default-expand-all
								:check-strictly="true" :props="defaultProps" highlight-current @check="handleCheck">
							</el-tree>
						</el-form-item>
					</el-form>
				</div>
				<div class="editbox">
					<span class="edit-tip">事件流转日志</span>
					<ul class="record-box">
						<li class="record-lst" v-for="(item, index) in recordlist">
							<i class="line"></i>
							<span class="dot"></span>
							{{
                item.activityName == '流程开始' ||
                item.activityName == '流程结束' || item.commentList.length > 0 
                  ? item.endTime
                  : item.createTime
              }}
							<div class="rec-rt">
								<span class="button">{{ item.activityName }}</span>
								<div class="inf">
									<img :src="item.assigneeAvatarUrl" class="avater" />{{
                    item.assigneeName
                  }}
								</div>
								<span class="bbh">{{ item.endTime }}</span>
								<div class="com-ul" v-if="item.commentList && item.commentList.length > 0">
									<div v-for="(items, index) in item.commentList" class="com-lst">
										{{ items.fullMessage }}
									</div>
								</div>
							</div>
						</li>
					</ul>
				</div>
			</div>
			<div class="dialog-foot" v-if="current == '0'">
				<span class="btn-cancel" @click="handlecancel('0')">取消</span>
				<span class="btn-save" @click="SubmitEvent('0')" v-if="nodetype == '1'">重新上报</span>
			</div>
			<div class="dialog-foot" v-if="current == '2'">
				<span class="btn-cancel" @click="handlecancel('0')">取消</span>
				<span class="btn-save" @click="handlesb" v-if="nodetype == '0'">上报</span>
				<span class="btn-save" @click="SubmitEvent('0')" v-if="nodetype == '1'">重新上报</span>
			</div>
		</el-dialog>
		<!-- 地图 -->
		<el-dialog :visible.sync="dtdialog" v-if="dtdialog" class="g-dialog" title="事件上报">
			<span class="sitename">位置：{{ addForm.evtPlaceName }}</span>
			<div class="hqzdt">
				<baidu-map style="height: 100%" :center="mapCenter" :zoom="mapZoom" :scroll-wheel-zoom="true"
					ak="baidu-ak" @ready="handlerBMap" @click="getClickInfo" />
			</div>
			<div class="dialog-foot">
				<span class="btn-cancel" @click="handlecancel('1')">取消</span>
				<span class="btn-save" @click="handledtsub">确定</span>
			</div>
		</el-dialog>
		<!-- 详情 -->
		<el-dialog :visible.sync="xqdialog" v-if="xqdialog" class="g-dialog" title="事件处理详情">
			<div class="addbox">
				<div class="gj-box">
					<div class="gj-lst">
						<img src="../../assets/img/id.png" class="img" />
						<span class="num">{{ detailfrom.evtId }}</span>
						<span class="type">ID</span>
					</div>
					<div class="gj-lst">
						<img src="../../assets/img/zdjy.png" class="img" />
						<span class="num">{{ detailfrom.evtTypeName }}</span>
						<span class="type">事件类型</span>
					</div>
					<div class="gj-lst">
						<img src="../../assets/img/fqr.png" class="img" />
						<span class="num">{{ detailfrom.evtInitiatorName }}</span>
						<span class="type">发起人</span>
					</div>
					<div class="gj-lst">
						<img src="../../assets/img/sj.png" class="img" />
						<span class="num">{{ detailfrom.evtStartTime }}</span>
						<span class="type">发起时间</span>
					</div>
				</div>
				<div class="lt">
					<div class="xq-content event-detail">
						<div class="xq-lst">
							<span class="name">类型</span>
							<span class="lab">{{ detailfrom.evtTypeName }}</span>
						</div>
						<div class="xq-lst">
							<span class="name">标题</span>
							<span class="lab">{{ addForm.evtTitle }}</span>
						</div>
						<div class="xq-lst">
							<span class="name">位置</span>
							<span class="lab">{{ addForm.evtPlaceName }}</span>
						</div>
						<div class="xq-lst">
							<span class="name">详细地址</span>
							<span class="lab">{{ addForm.detailedAddress }}</span>
						</div>
						<div class="xq-lst">
							<span class="name">事件描述</span>
							<span class="remark1">{{ addForm.evtDescription }}</span>
						</div>
						<div class="xq-lst">
							<span class="name">分派人员</span>
							<span class="remark1">{{ allotUser }}</span>
						</div>
						<div class="xq-lst">
							<span class="name">附件</span>
							<ul class="picul" v-if="piclist.length > 0">
								<li class="pic-lst" v-for="(item, index) in piclist">
									<!-- <img :src="item.url" class="img" @click="bigpic(item.url)" /> -->
									<el-image :src="item.url" class="img" :preview-src-list="piclists"></el-image>
								</li>
							</ul>
						</div>
						<i class="f-clearfix"></i>
						<div class="xq-lst">
							<span class="name" style="color: #ffffff">附件</span>
							<ul class="picul" v-if="audiolist.length > 0">
								<li class="pic-lst aud-lst" v-for="(item, index) in audiolist">
									<audio controls class="audio">
										<source :src="item.url" type="audio/mpeg" />
									</audio>
								</li>
							</ul>
						</div>
						<i class="f-clearfix"></i>
						<div class="xq-lst">
							<span class="name" style="color: #ffffff">附件</span>
							<ul class="picul" v-if="videolist.length > 0">
								<li class="pic-lst" v-for="(item, index) in videolist">
									<video :src="item.url" controls="controls"></video>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div class="editbox">
					<span class="edit-tip">事件流转日志</span>
					<ul class="record-box">
						<li class="record-lst" v-for="(item, index) in recordlist">
							<i class="line"></i>
							<span class="dot"></span>
							{{
                item.activityName == '流程开始' ||
                item.activityName == '流程结束' || item.commentList.length > 0 
                  ? item.endTime
                  : item.createTime
              }}
							<div class="rec-rt">
								<span class="button">{{ item.activityName }}</span>
								<div class="inf">
									<img :src="item.assigneeAvatarUrl" class="avater" />{{
                    item.assigneeName
                  }}
								</div>
								<span class="bbh">{{ item.endTime }}</span>
								<div class="com-ul" v-if="item.commentList && item.commentList.length > 0">
									<div v-for="(items, index) in item.commentList" class="com-lst"
										v-if="items.fullMessage != null">
										{{ items.fullMessage }}
									</div>
								</div>
								<div class="com-ul" v-if="item.attachmentList && item.attachmentList.length > 0">

									<div class="com-lst">
										<div v-for="(items, index) in item.attachmentList">
											<p v-if="index == 0">附件：{{ items.name }}</p>
											<!-- media-todo -->
											<div class="media-box">
												<img class="img" @click="bigpic(items.url)"
													v-if="mediaType(items.url) === 1" :src="items.url" />
												<video class="pic-lst " controls v-if="mediaType(items.url) === 2">
													<source :src="items.url" type="video/mp4" />
												</video>
												<!-- <video  :src="items.url" controls="controls"></video> -->
												<audio v-if="mediaType(items.url) === 3" controls class="audio">
													<source :src="item.url" type="audio/mpeg" />
												</audio>
											</div>
										</div>


									</div>
								</div>
							</div>
						</li>
					</ul>
				</div>
			</div>
			<!-- 受理 -->
			<div class="dialog-foot five-btn" v-if="current == '0' && evtNodeFlowId == 'Activity_sjsl002'">
				<span class="btn-cx" style="margin-left: 0; background: #00a0e9; border: 1px solid #00a0e9"
					@click="yjclbtn">一键处理</span>
				<span class="btn-save" @click="handleEvent('0')">受理并分配</span>
				<span class="btn-cx" @click="handleEvent('1')">事件撤销</span>
				<span class="btn-save" @click="handleEvent('2')">发起核查</span>
				<span class="btn-ht" @click="handleEvent('3')">回退</span>
			</div>
			<!-- 受理并分配 签收、拒签  -->
			<div class="dialog-foot" v-if="current == '0' && evtNodeFlowId == 'Activity_sjczqs005'">
				<span class="btn-cx" style="margin-left: 0" @click="handleEvent('5')">拒签</span>
				<span class="btn-save" @click="handleEvent('4')">签收</span>
			</div>
			<!-- 发起核查 签收、拒签 -->
			<div class="dialog-foot" v-if="current == '0' && evtNodeFlowId == 'Activity_sjhcqs003'">
				<span class="btn-cx" style="margin-left: 0" @click="handleEvent('7')">拒签</span>
				<span class="btn-save" @click="handleEvent('6')">签收</span>
			</div>
			<!-- 核查完成 -->
			<div class="dialog-foot" v-if="current == '0' && evtNodeFlowId == 'Activity_sjhc004'">
				<span class="btn-save" @click="handleEvent('13')">核查完成</span>
			</div>
			<!-- 提交办结 自处置完成 挂起 转派-->
			<div class="dialog-foot four-btn" v-if="current == '0' && evtNodeFlowId == 'Activity_sjcz006'">
				<span class="btn-save" style="margin-left: 0" @click="handleEvent('8')">提交办结</span>
				<span class="btn-cx" @click="handleEvent('9')">自处置完成</span>
				<span class="btn-save" @click="handleEvent('10')">挂起</span>
				<span class="btn-ht" @click="handleEvent('17')">转派</span>
			</div>
			<!-- 挂起审批 -->
			<div class="dialog-foot" v-if="current == '0' && evtNodeFlowId == 'Activity_sjgqsp007'">
				<span class="btn-cx" style="margin-left: 0" @click="handleEvent('15')">拒绝</span>
				<span class="btn-save" @click="handleEvent('14')">同意挂起</span>
			</div>
			<div class="dialog-foot" v-if="current == '0' && evtNodeFlowId == 'Activity_sjgq009'">
				<span class="btn-save" @click="handleEvent('16')">取消挂起</span>
			</div>

			<!-- 事件办结 -->
			<div class="dialog-foot" v-if="current == '0' && evtNodeFlowId == 'Activity_sjbj008'">
				<span class="btn-cx" style="margin-left: 0" @click="handleEvent('12')">退回处置</span>
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
							<input type="file" ref="file3" class="file1" @change="choosefile($event, '3')" />
							<span class="upfile-btn">选择上传文件</span>
						</div>
						<ul class="file-ul" style="float: left; width: 100%">
							<li class="file-li" v-for="(item, index) in filelist" @click="handdelfile(index)">
								<img src="../../assets/img/file.png" class="fileimg" />{{
                  item.fileName
                }}
								<span class="delfile">删除</span>
							</li>
						</ul>
					</div>
				</el-form-item>
				<!-- 受理分派、发起核查时展示 -->
				<el-form-item label="分派人员" class="user-tree" prop=""
					v-if="yjjdtype == '0' || yjjdtype == '2' || yjjdtype == '17'">
					<el-tree :data="userlist" ref="roletree" node-key="id" show-checkbox :props="defaultProps"
						highlight-current @node-click="handleClick">
					</el-tree>
				</el-form-item>
			</el-form>
			<div class="dialog-foot">
				<span class="btn-cancel" @click="yjclose">取消</span>
				<span class="btn-save" v-if="yjjdtype == '0'" @click="slfpsubmit">受理并分派</span>
				<span class="btn-save" v-if="yjjdtype == '1'" @click="handledete('0')">事件撤销</span>
				<span class="btn-save" v-if="yjjdtype == '2'" @click="hcsubmit">发起核查</span>
				<span class="btn-save" v-if="yjjdtype == '3'" @click="handledete('1')">回退</span>
				<span class="btn-save" v-if="yjjdtype == '4'" @click="signSubmit('0')">签收</span>
				<span class="btn-save" v-if="yjjdtype == '5'" @click="signSubmit('1')">拒签</span>
				<span class="btn-save" v-if="yjjdtype == '6'" @click="checksignSubmit('0')">签收</span>
				<span class="btn-save" v-if="yjjdtype == '7'" @click="checksignSubmit('1')">拒签</span>
				<span class="btn-save" v-if="yjjdtype == '8'" @click="eventsubmit('0')">提交办结</span>
				<span class="btn-save" v-if="yjjdtype == '9'" @click="eventsubmit('1')">自动完成处置</span>
				<span class="btn-save" v-if="yjjdtype == '10'" @click="eventsubmit('2')">挂起</span>
				<span class="btn-save" v-if="yjjdtype == '11'" @click="eventcomplet('0')">确认办结</span>
				<span class="btn-save" v-if="yjjdtype == '12'" @click="eventcomplet('1')">退回处置</span>
				<span class="btn-save" v-if="yjjdtype == '13'" @click="checksubmit">核查完成</span>
				<span class="btn-save" v-if="yjjdtype == '14'" @click="eventgq('0')">同意挂起</span>
				<span class="btn-save" v-if="yjjdtype == '15'" @click="eventgq('1')">拒绝挂起</span>
				<span class="btn-save" v-if="yjjdtype == '16'" @click="eventgq('2')">取消挂起</span>
				<span class="btn-save" v-if="yjjdtype == '17'" @click="zpsubmit">转派</span>
			</div>
		</el-dialog>

		<el-dialog :visible.sync="bigDialog" width="30%" title="">
		      <img :src="bigUrl" alt="" style="width: 100%" />
		</el-dialog>
	</div>
</template>

<script>
	import axios from 'axios'
	import {
		EventSidebar,
		EventList,
		EventType,
		EventNode,
		EventDetil,
		DictType,
		GetReportForm,
		EvtFlowStart,
		EvtFlowRevo,
		EvtFlowBackReport,
		EvtReportAgain,
		EvtFlowDelete,
		EventHandleInOnce,
		EventDeleteInOnce
	} from '../../api/api.js'
	import {
		EvtFlowAllot,
		EvtFlowDisSign,
		EvtFlowDisRefuseSign,
		EvtFlowSubCon,
		EvtFlowSelfDisComp,
		EvtFlowSuspend,
		EvtFlowConfbCon,
		EvtFlowBackDis,
		SelectDeptUserTree,
	} from '../../api/api.js' //受理并分派
	import {
		EvtFlowCheck,
		EvtFlowCheckSign,
		EvtFlowCheckRefuseSign,
		EvtFlowCheckComplete,
		EventRecall,
		EvtFlowAgreeSuspend,
		EvtFlowRefuseSuspend,
		EvtFlowCancSuspend,
		EvtFlowTransfer,
	} from '../../api/api.js' // 发起核查

	import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
	import moment from 'moment'
	export default {
		components: {
			BaiduMap,
		},
		data() {
			return {
				allotPerson: '',
				allotUser: '',
				visibleDelete: false,
				selectedItems: [],
				current: '0',
				sidelist: [],
				filters: {
					evtTypeId: '',
					evtNodeFlowId: '',
					evtInitiatorName: '',
					time: [],
					evtNodeReceiptBeginTime: '',
					evtNodeReceiptEndTime: '',
					sidebarType: '',
					evtParentType: 'roadEvent',
					size: 10,
					current: 1,
				},
				eventypelist: [], //事件类型
				nodelist: [], //节点类型
				datalist: [],
				listLoading: false,
				total: 0,
				currentPage: 1,
				currentPage1: 1,
				pagesize: 10,
				adddialog: false, //发起弹窗
				addflag: false,
				diatitle: '',
				addForm: {
					evtTypeId: '', //类型
					evtTitle: '', //标题
					evtPlaceName: '', //位置
					evtDescription: '', //描述
					evtLongitude: '', // 经度
					evtLatitude: '', // 纬度
					pictureAttachment: '', //附件 图片
					videoAttachment: '', //附件 视频
					audioAttachment: '', //附件 音频
				},
				addFormRules: {
					evtTypeId: [{
						required: true,
						message: '请选择事件类型',
						trigger: 'blur'
					}, ],
				},
				flowConfId: '', //
				reportform: [], //返回表单
				flowTaskId: '',
				flowInstanceId: '',
				evtId: '',
				piclist: [], //图片
				piclists:[],
				audiolist: [], //音频
				videolist: [], //视频
				evtNodeFlowId: '', //判定
				nodetype: '0', //详情下 节点 0 发起 1重新上报
				yjjdtype: '0', //意见弹窗下的按钮显示

				dtdialog: false,
				mapZoom: 13,
				mapCenter: {
					//青原
					lng: 115.01747,
					lat: 27.10577,
				},
				mapLocation: {
					address: undefined,
					coordinate: undefined,
				},

				editdialog: false, // 处理弹窗

				recordlist: [],
				xqdialog: false, //详情弹窗
				yjdialog: false, //意见弹窗
				yjForm: {
					comment: '',
					candidateUsers: [],
				},
				yjFormRules: {},
				filelist: [], //文件
				detailfrom: {},
				userlist: [],
				defaultProps: {
					children: 'children',
					label: 'label',
				},
				formItemKey: 0,
				bigDialog: false,
				bigUrl: '',
			}
		},
		mounted() {
			this.getside()
			this.getsjlx()
			this.getnode()
			this.getlist('')
			this.getuser()
		},
		methods: {
			// 一键删除代办事件 
			sumbitDeleteOnce() {
				// todo 
				console.log('---一键删除代办事件---')
				let paramsList = []
				if (!this.selectedItems.length) {
					this.$message({
						message: '未选择可删除的事件!',
						type: 'error'
					})
					return
				}
				for (let i = 0; i < this.selectedItems.length; i++) {
					paramsList.push(this.selectedItems[i].evtId)
				}
				EventDeleteInOnce(paramsList).then((res) => {
					console.log(res)
					if (res.code == '200') {
						this.$message({
							message: '批量删除成功！',
							type: 'error'
						})
						this.visibleDelete = false
						this.getlist(1)
					} else {
						this.$message({
							message: '批量删除失败！',
							type: 'error'
						})
					}
				})


			},
			// 判断附件文件类型
			mediaType(url) {
				if (/(jpg|jpeg|png|gif|bmp|svg)$/i.test(url)) {
					return 1; // 图片
				} else if (/(mp4|webm|ogg|mov|avi|mkv|flv)$/i.test(url)) {
					return 2; // 视频
				} else if (/(mp3|wav|ogg|flac|m4a|aac)$/i.test(url)) {
					return 3; // 音频
				} else {
					return 0; // 未知类型
				}
			},

			bigpic(url) {
				this.bigDialog = true
				this.bigUrl = url
			},
			getside: function() {
				EventSidebar().then((res) => {
					this.sidelist = res.data.data
				})
			},
			// 单行变色
			tableRowClassName: function(rowIndex) {
				if (rowIndex.rowIndex % 2 != 0) {
					return 'evenRow'
				}
				return 'oddRow'
			},
			// 事件类型
			getsjlx: function() {
				EventType({
					evtParentType: 'roadEvent'
				}).then((res) => {
					this.eventypelist = res.data.data
				})
			},
			// 节点类型
			getnode: function() {
				EventNode().then((res) => {
					this.nodelist = res.data.data
				})
			},
			// 切换
			handletab: function(type) {
				this.current = type
				this.$refs.filters.resetFields()
				this.filters = {
					evtTypeId: '',
					evtNodeFlowId: '',
					evtInitiatorName: '',
					time: [],
					evtNodeReceiptBeginTime: '',
					evtNodeReceiptEndTime: '',
					evtParentType: 'roadEvent',
					size: 10,
					current: 1,
				}
				this.getlist(1)
			},
			// 列表
			getlist: function(val) {
				if (this.filters.time && this.filters.time.length > 0) {
					this.filters.evtNodeReceiptBeginTime = moment(
						this.filters.time[0]
					).format('yyyy-MM-DD')
					this.filters.evtNodeReceiptEndTime = moment(
						this.filters.time[1]
					).format('yyyy-MM-DD')
				} else {
					this.filters.evtNodeReceiptBeginTime = ''
					this.filters.evtNodeReceiptEndTime = ''
				}
				let para = {
					evtTypeId: this.filters.evtTypeId,
					evtNodeFlowId: this.filters.evtNodeFlowId,
					evtInitiatorName: this.filters.evtInitiatorName,
					evtNodeReceiptBeginTime: this.filters.evtNodeReceiptBeginTime,
					evtNodeReceiptEndTime: this.filters.evtNodeReceiptEndTime,
					sidebarType: this.current,
					evtParentType: this.filters.evtParentType,
					pageSize: this.filters.size,
					pageNum: this.filters.current,
				}
				if (val) {
					para.pageNum = val
					this.currentPage1 = val
				}
				EventList(para).then((res) => {
					this.datalist = res.data.rows
					this.total = res.data.total
					console.log('----拉取信息----', this.datalist)
				})
			},
			// 重置
			resetForm: function(filters) {
				this.$refs.filters.resetFields()
				this.filters = {
					evtTypeId: '',
					evtNodeFlowId: '',
					evtInitiatorName: '',
					time: [],
					evtNodeReceiptBeginTime: '',
					evtNodeReceiptEndTime: '',
					evtParentType: 'roadEvent',
					size: 10,
					current: 1,
				}
				this.getlist(1)
			},
			// 分页
			handleSizeChange: function(size) {
				this.pagesize = size
				this.filters.size = size
				this.getlist('')
			},
			// 分页
			handleCurrentChange: function(val) {
				this.filters.current = val
				this.getlist(val)
			},
			// 删除 取消
			visibleDelCancel(id) {
				this.$refs[id].doClose()
			},
			// 删除确认
			visibleDelSubmit(id) {
				DelUserSign(id).then((res) => {
					console.log(res, '10101')
					if (res.data.code == '200') {
						this.$message({
							message: res.data.msg,
							type: 'success',
						})
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error',
						})
					}
					this.$refs[id].doClose()
					this.getlist(1)
				})
			},

			// 发起
			handlefq: function() {
				this.adddialog = true
				this.diatitle = '事件上报'
				this.addflag = false
				this.addForm = {
					evtTypeId: '', //类型
					evtTitle: '', //标题
					evtPlaceName: '', //位置
					evtDescription: '', //描述
					evtLongitude: '', // 经度
					evtLatitude: '', // 纬度
					pictureAttachment: '', //附件 图片
					videoAttachment: '', //附件 视频
					audioAttachment: '', //附件 音频
				}
				this.piclist = [] //图片
				this.audiolist = [] //音频
				this.videolist = [] //视频

				this.nodetype = '0'
			},
			// 选择事件类型
			choosetype: function(val) {
				console.log(val, '010100')
				let obj = this.eventypelist.filter((obj) => {
					return obj.evtTypeId == val
				})
				console.log(obj, '0bj')
				this.flowConfId = obj[0].flowConfId
				this.getreport()
			},
			//获取上报内容表单
			getreport: function() {
				let para = this.flowConfId
				GetReportForm(para).then((res) => {
					console.log(res, '010')
					this.reportform = res.data.data.fields
					console.log(this.reportform, 'this.reportform')
				})
			},
			// 上报
			handlesb: function() {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						let para = {
							evtTypeId: this.addForm.evtTypeId, //类型
							evtTitle: this.addForm.evtTitle, //标题
							evtPlaceName: this.addForm.evtPlaceName, //位置
							evtDescription: this.addForm.evtDescription, //描述
							evtLongitude: this.addForm.evtLongitude, // 经度
							evtLatitude: this.addForm.evtLatitude, // 纬度
							pictureAttachment: this.piclist, //附件 图片
							videoAttachment: this.videolist, //附件 视频
							audioAttachment: this.audiolist, //附件 音频
							allotUserId: this.allotPerson.substring(4)
						}
						EvtFlowStart(para).then((res) => {
							console.log(res, '上报')
							if (res.code == '200') {
								this.$message({
									message: res.msg,
									type: 'success',
								})
							} else {
								this.$message({
									message: res.msg,
									type: 'error',
								})
							}
							this.adddialog = false
							this.getlist(1)
						})
					}
				})
			},
			// 选择地图
			choosedt: function() {
				this.dtdialog = true
			},
			// 初始化地图
			handlerBMap: function({
				BMap,
				map
			}) {
				var point = new BMap.Point(121.7057, 31.232451) // 上海合庆镇东风村
				map.centerAndZoom(point, 16)
				this.mapbox = {
					BMap,
					map
				}
			},
			// 点击获取定位
			getClickInfo: function(e) {
				console.log(e, '101001')
				let point = e.point
				let lng = e.point.lng
				let lat = e.point.lat
				let _this = this
				var geocoder = new BMap.Geocoder()
				geocoder.getLocation(new BMap.Point(lng, lat), function(result) {
					console.log(result)
					_this.addForm.evtPlaceName = result.address
					_this.addForm.evtLongitude = lng.toString()
					_this.addForm.evtLatitude = lat.toString()
				})
			},
			// 地图关闭
			handledtsub: function() {
				this.dtdialog = false
			},

			// 弹窗关闭
			handlecancel: function(type) {
				if (type == '0') {
					this.adddialog = false
					this.addForm = {
						evtTypeId: '', //类型
						evtTitle: '', //标题
						evtPlaceName: '', //位置
						evtDescription: '', //描述
						evtLongitude: '', // 经度
						evtLatitude: '', // 纬度
						pictureAttachment: '', //附件 图片
						videoAttachment: '', //附件 视频
						audioAttachment: '', //附件 音频
					}
				} else if (type == '1') {
					this.dtdialog = false
				} else {
					this.xqdialog = false
				}
			},
			// 勾选人员
			handleCheck(node, {
				checkedNodes
			}) {
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
			// 详情
			getDetail: function(data) {
				let para = {
					procInsId: data.flowInstanceId,
					taskId: data.flowTaskId,
					evtId: data.evtId,
				}
				EventDetil(para).then((res) => {
					console.log(res.data, '详情')
					this.allotUser = res.data.data.formData.allotUserName
					this.addForm = res.data.data.formData
					this.detailfrom = res.data.data.evtInfoVo
					this.recordlist = res.data.data.historyProcNodeList
					// this.piclist = res.data.data.formData.pictureAttachment || []
					// this.videolist = res.data.data.formData.videoAttachment || []
					// this.audiolist = res.data.data.formData.audioAttachment || []

					this.piclist =
						typeof res.data.data.formData.pictureAttachment != 'undefined' ?
						res.data.data.formData.pictureAttachment :
						[]
					this.piclists = this.piclist.map((el) => {
						return el.url
					})
						
					this.videolist =
						typeof res.data.data.formData.videoAttachment != 'undefined' ?
						res.data.data.formData.videoAttachment :
						[]
					this.audiolist =
						typeof res.data.data.formData.audioAttachment != 'undefined' ?
						res.data.data.formData.audioAttachment :
						[]
					// 流程任务id
					this.flowTaskId = res.data.data.flowTaskId
					this.flowInstanceId = res.data.data.flowInstanceId
					this.evtId = res.data.data.evtInfoVo.evtId
				})
			},
			// 查看详情
			handldetail: function(row) {
				this.xqdialog = true
				this.getDetail(row)
			},
			// 意见弹窗关闭
			yjclose: function() {
				this.yjForm = {
					comment: '',
					candidateUsers: [],
				}
				this.filelist = []
				this.yjdialog = false
			},

			// 处理 待办
			handldeal: function(row) {
				this.evtNodeFlowId = row.evtNodeFlowId
				this.xqdialog = true
				this.getDetail(row)
			},
			//一键处理
			yjclbtn() {
				var params = {
					taskId: this.flowTaskId,
					procInsId: this.flowInstanceId,
					businessKey: this.evtId,
					variables: {
						evtTypeId: this.addForm.evtTypeId,
						evtTitle: this.addForm.evtTitle,
						evtPlaceName: this.addForm.evtPlaceName,
						evtDescription: this.addForm.evtDescription,
						pictureAttachment: this.piclist, //附件 图片
						videoAttachment: this.videolist, //附件 视频
						audioAttachment: this.audiolist, //附件 音频
					},
				}
				console.log(params)
				axios
					.post('/event/evtFlow/eventOneClickFinish', params)
					.then((res) => {
						if (res.data.code == 200) {
							this.$message({
								message: res.data.msg,
								type: 'success',
							})
							this.xqdialog = false
							this.getlist('')
						} else {
							this.$message({
								message: res.data.msg,
								type: 'error',
							})
						}
					})
					.catch((res) => {
						console.log(res)
					})
			},
			// 受理并分派
			handleEvent: function(type) {
				this.yjdialog = true
				this.yjForm = {
					comment: '',
					candidateUsers: [],
				}
				this.filelist = []
				this.yjjdtype = type
			},

			// 受理分派确定
			slfpsubmit: function() {
				let arr = this.$refs.roletree.getCheckedKeys()
				console.log(arr, '101001')
				let c = []
				for (var i = 0; i < arr.length; i++) {
					c.push({
						name: arr[i],
						value: arr[i].indexOf('user'),
					})
				}
				this.yjForm.candidateUsers = []
				for (var j = 0; j < c.length; j++) {
					if (c[j].value == 0) {
						this.yjForm.candidateUsers.push(c[j].name.slice(4))
					}
				}
				let para = {
					taskId: this.flowTaskId,
					procInsId: this.flowInstanceId,
					businessKey: this.evtId,
					comment: '处理描述：' + this.yjForm.comment, //意见
					attachmentList: this.filelist, //附件
					candidateUsers: this.yjForm.candidateUsers,
				}
				console.log(para, '传参')
				EvtFlowAllot(para).then((res) => {
					console.log(res, '受理并分派')
					if (res.code == '200') {
						this.$message({
							message: res.msg,
							type: 'success',
						})
					} else {
						this.$message({
							message: res.msg,
							type: 'error',
						})
					}
					this.yjdialog = false
					this.xqdialog = false
					this.getlist(1)
				})
			},

			// 签收、拒签确定
			signSubmit: function(type) {
				let para = {
					taskId: this.flowTaskId,
					procInsId: this.flowInstanceId,
					businessKey: this.evtId,
					comment: '处理描述：' + this.yjForm.comment, //意见
					attachmentList: this.filelist, //附件
				}
				if (type == '0') {
					EvtFlowDisSign(para).then((res) => {
						debugger
						console.log(res, '签收')
						if (res.code == '200') {
							this.$message({
								message: res.msg,
								type: 'success',
							})
						} else {
							this.$message({
								message: res.msg,
								type: 'error',
							})
						}
						this.yjdialog = false
						this.xqdialog = false
						this.getlist(1)
					})
				} else {
					EvtFlowDisRefuseSign(para).then((res) => {
						debugger
						console.log(res, '拒签')
						if (res.code == '200') {
							this.$message({
								message: res.msg,
								type: 'success',
							})
						} else {
							this.$message({
								message: res.msg,
								type: 'error',
							})
						}
						this.yjdialog = false
						this.xqdialog = false
						this.getlist(1)
					})
				}
			},

			// 事件处置 提交办结 、自动完成处置 、挂起
			eventsubmit: function(type) {
				console.log(type, '00010100')
				let para = {
					taskId: this.flowTaskId,
					procInsId: this.flowInstanceId,
					businessKey: this.evtId,
					comment: '处理描述：' + this.yjForm.comment, //意见
					attachmentList: this.filelist, //附件
				}
				if (type == '0') {
					EvtFlowSubCon(para).then((res) => {
						console.log(res, '提交办结')
						if (res.code == '200') {
							this.$message({
								message: res.msg,
								type: 'success',
							})
						} else {
							this.$message({
								message: res.msg,
								type: 'error',
							})
						}
						this.yjdialog = false
						this.xqdialog = false
						this.getlist(1)
					})
				} else if (type == '1') {
					EvtFlowSelfDisComp(para).then((res) => {
						console.log(res, '自处置完成')
						if (res.code == '200') {
							this.$message({
								message: res.msg,
								type: 'success',
							})
						} else {
							this.$message({
								message: res.msg,
								type: 'error',
							})
						}
						this.yjdialog = false
						this.xqdialog = false
						this.getlist(1)
					})
				} else {
					EvtFlowSuspend(para).then((res) => {
						console.log(res, '挂起')
						if (res.code == '200') {
							this.$message({
								message: res.msg,
								type: 'success',
							})
						} else {
							this.$message({
								message: res.msg,
								type: 'error',
							})
						}
						this.yjdialog = false
						this.xqdialog = false
						this.getlist(1)
					})
				}
			},
			// 确认办结、退出处置
			eventcomplet: function(type) {
				let para = {
					taskId: this.flowTaskId,
					procInsId: this.flowInstanceId,
					businessKey: this.evtId,
					comment: '处理描述：' + this.yjForm.comment, //意见
					attachmentList: this.filelist, //附件
				}
				if (type == '0') {
					EvtFlowConfbCon(para).then((res) => {
						console.log(res, '确认办结')
						if (res.code == '200') {
							this.$message({
								message: res.msg,
								type: 'success',
							})
						} else {
							this.$message({
								message: res.msg,
								type: 'error',
							})
						}
						this.yjdialog = false
						this.xqdialog = false
						this.getlist(1)
					})
				} else {
					EvtFlowBackDis(para).then((res) => {
						console.log(res, '退出处置')
						if (res.code == '200') {
							this.$message({
								message: res.msg,
								type: 'success',
							})
						} else {
							this.$message({
								message: res.msg,
								type: 'error',
							})
						}
						this.yjdialog = false
						this.xqdialog = false
						this.getlist(1)
					})
				}
			},
			// 事件撤销 确定
			handledete: function(type) {
				let para = {
					taskId: this.flowTaskId,
					procInsId: this.flowInstanceId,
					businessKey: this.evtId,
					comment: '处理描述：' + this.yjForm.comment, //意见
					attachmentList: this.filelist, //附件
				}
				if (type == '0') {
					EvtFlowRevo(para).then((res) => {
						console.log(res, '事件撤销')
						if (res.code == '200') {
							this.$message({
								message: res.msg,
								type: 'success',
							})
						} else {
							this.$message({
								message: res.msg,
								type: 'error',
							})
						}
						this.yjdialog = false
						this.xqdialog = false
						this.getlist(1)
					})
				} else {
					EvtFlowBackReport(para).then((res) => {
						console.log(res, '回退到上报')
						if (res.code == '200') {
							this.$message({
								message: res.msg,
								type: 'success',
							})
						} else {
							this.$message({
								message: res.msg,
								type: 'error',
							})
						}
						this.yjdialog = false
						this.xqdialog = false
						this.getlist(1)
					})
				}
			},

			// 核查确定
			hcsubmit: function() {
				let arr = this.$refs.roletree.getCheckedKeys()
				let c = []
				for (var i = 0; i < arr.length; i++) {
					c.push({
						name: arr[i],
						value: arr[i].indexOf('user'),
					})
				}
				this.yjForm.candidateUsers = []
				for (var j = 0; j < c.length; j++) {
					if (c[j].value == 0) {
						this.yjForm.candidateUsers.push(c[j].name.slice(4))
					}
				}

				let para = {
					taskId: this.flowTaskId,
					procInsId: this.flowInstanceId,
					businessKey: this.evtId,
					comment: '处理描述：' + this.yjForm.comment, //意见
					attachmentList: this.filelist, //附件
					candidateUsers: this.yjForm.candidateUsers,
				}
				EvtFlowCheck(para).then((res) => {
					console.log(res, '发起核查')
					if (res.code == '200') {
						this.$message({
							message: res.msg,
							type: 'success',
						})
					} else {
						this.$message({
							message: res.msg,
							type: 'error',
						})
					}
					this.yjdialog = false
					this.xqdialog = false
					this.getlist(1)
				})
			},

			// 签收、拒签确定
			checksignSubmit: function(type) {
				let para = {
					taskId: this.flowTaskId,
					procInsId: this.flowInstanceId,
					businessKey: this.evtId,
					comment: '处理描述：' + this.yjForm.comment, //意见
					attachmentList: this.filelist, //附件
				}
				if (type == '0') {
					EvtFlowCheckSign(para).then((res) => {
						debugger
						console.log(res, '签收')
						if (res.code == '200') {
							this.$message({
								message: res.msg,
								type: 'success',
							})
						} else {
							this.$message({
								message: res.msg,
								type: 'error',
							})
						}
						this.yjdialog = false
						this.xqdialog = false
						this.getlist(1)
					})
				} else {
					EvtFlowCheckRefuseSign(para).then((res) => {
						debugger
						console.log(res, '拒签')
						if (res.code == '200') {
							this.$message({
								message: res.msg,
								type: 'success',
							})
						} else {
							this.$message({
								message: res.msg,
								type: 'error',
							})
						}
						this.yjdialog = false
						this.xqdialog = false
						this.getlist(1)
					})
				}
			},
			// 点击了选择框
			handleSelectionChange(selection) {
				console.log(selection)
				this.selectedItems = selection
			},
			// 只可选择事件受理
			selectable(row, index) {
				if (row.evtNodeName != '事件受理') {
					return false
				} else {
					return true
				}
			},
			// 批量处理
			handleOnce() {
				// console.log('---批量处理---')
				let paramsList = []
				if (!this.selectedItems.length) {
					this.$message({
						message: '未选择可受理的事件!',
						type: 'error'
					})
					return
				}
				for (let i = 0; i < this.selectedItems.length; i++) {
					let params = {
						taskId: this.selectedItems[i].flowTaskId,
						procInsId: this.selectedItems[i].flowInstanceId,
						businessKey: this.selectedItems[i].evtId,
						variables: {
							evtTypeId: this.selectedItems[i].evtTypeId,
							evtTitle: this.selectedItems[i].evtTitle,
							evtPlaceName: this.selectedItems[i].evtPlaceName,
							evtDescription: this.selectedItems[i].evtDescription,
							pictureAttachment: this.selectedItems[i].piclist, //附件 图片
							videoAttachment: this.selectedItems[i].videolist, //附件 视频
							audioAttachment: this.selectedItems[i].audiolist, //附件 音频
						},
					}
					paramsList.push(params)
				}
				EventHandleInOnce(paramsList).then((res) => {
					console.log(res)
					if (res.code == '200') {
						this.$message({
							message: '批量处理成功！',
							type: 'error'
						})
						this.getlist(1)
					} else {
						this.$message({
							message: '批量处理失败！',
							type: 'error'
						})
					}
				})
				//this.getlist(1)
			},
			// 重新上报
			reportagain: function(row) {
				this.adddialog = true
				this.diatitle = '重新上报'
				this.addflag = true
				this.nodetype = '1'
				this.getDetail(row)
			},
			// 重新上报确认0
			SubmitEvent: function(type) {
				let variables = {
					evtTypeId: this.addForm.evtTypeId,
					evtTitle: this.addForm.evtTitle,
					evtPlaceName: this.addForm.evtPlaceName,
					evtDescription: this.addForm.evtDescription,
					pictureAttachment: this.piclist, //附件 图片
					videoAttachment: this.videolist, //附件 视频
					audioAttachment: this.audiolist, //附件 音频
				}
				let para = {
					taskId: this.flowTaskId,
					procInsId: this.flowInstanceId,
					businessKey: this.evtId,
					variables: variables, //流程变量信息
				}

				EvtReportAgain(para).then((res) => {
					console.log(res, '重新上报')
					if (res.code == '200') {
						this.$message({
							message: res.msg,
							type: 'success',
						})
					} else {
						this.$message({
							message: res.msg,
							type: 'error',
						})
					}
					this.adddialog = false
					this.getlist(1)
				})
			},
			// 核查完成
			checksubmit: function() {
				let para = {
					taskId: this.flowTaskId,
					procInsId: this.flowInstanceId,
					businessKey: this.evtId,
					comment: '处理描述：' + this.yjForm.comment, //意见
					attachmentList: this.filelist, //附件
				}
				EvtFlowCheckComplete(para).then((res) => {
					console.log(res, '核查完成')
					if (res.code == '200') {
						this.$message({
							message: res.msg,
							type: 'success',
						})
					} else {
						this.$message({
							message: res.msg,
							type: 'error',
						})
					}
					this.yjdialog = false
					this.xqdialog = false
					this.getlist(1)
				})
			},
			// 撤回
			handlech: function(row) {
				debugger
				let para = {
					taskId: row.flowTaskId,
					procInsId: row.flowInstanceId,
					businessKey: row.evtId,
				}
				EventRecall(para).then((res) => {
					console.log(res, '撤回')
					if (res.code == '200') {
						this.$message({
							message: res.msg,
							type: 'success',
						})
					} else {
						this.$message({
							message: res.msg,
							type: 'error',
						})
					}
					this.getlist(1)
				})
			},
			// 事件删除
			handledel: function(row) {
				console.log(row, '191919')
				let para = {
					taskId: row.flowTaskId,
					procInsId: row.flowInstanceId,
					businessKey: row.evtId,
				}
				EvtFlowDelete(para).then((res) => {
					console.log(res, '事件删除')
					if (res.code == '200') {
						this.$message({
							message: res.msg,
							type: 'success',
						})
					} else {
						this.$message({
							message: res.msg,
							type: 'error',
						})
					}
					this.getlist(1)
				})
			},
			// 同意挂起、 拒绝挂起
			eventgq: function(type) {
				let para = {
					taskId: this.flowTaskId,
					procInsId: this.flowInstanceId,
					businessKey: this.evtId,
					comment: '处理描述：' + this.yjForm.comment, //意见
					attachmentList: this.filelist, //附件
				}
				if (type == '0') {
					EvtFlowAgreeSuspend(para).then((res) => {
						debugger
						console.log(res, '同意挂起')
						if (res.code == '200') {
							this.$message({
								message: res.msg,
								type: 'success',
							})
						} else {
							this.$message({
								message: res.msg,
								type: 'error',
							})
						}
						this.yjdialog = false
						this.xqdialog = false
						this.getlist(1)
					})
				} else if (type == '1') {
					EvtFlowRefuseSuspend(para).then((res) => {
						debugger
						console.log(res, '拒绝挂起')
						if (res.code == '200') {
							this.$message({
								message: res.msg,
								type: 'success',
							})
						} else {
							this.$message({
								message: res.msg,
								type: 'error',
							})
						}
						this.yjdialog = false
						this.xqdialog = false
						this.getlist(1)
					})
				} else {
					EvtFlowCancSuspend(para).then((res) => {
						debugger
						console.log(res, '取消挂起')
						if (res.code == '200') {
							this.$message({
								message: res.msg,
								type: 'success',
							})
						} else {
							this.$message({
								message: res.msg,
								type: 'error',
							})
						}
						this.yjdialog = false
						this.xqdialog = false
						this.getlist(1)
					})
				}
			},
			// 转派
			zpsubmit: function() {
				let arr = this.$refs.roletree.getCheckedKeys()
				let c = []
				for (var i = 0; i < arr.length; i++) {
					c.push({
						name: arr[i],
						value: arr[i].indexOf('user'),
					})
				}
				this.yjForm.candidateUsers = []
				for (var j = 0; j < c.length; j++) {
					if (c[j].value == 0) {
						this.yjForm.candidateUsers.push(c[j].name.slice(4))
					}
				}
				let para = {
					taskId: this.flowTaskId,
					procInsId: this.flowInstanceId,
					businessKey: this.evtId,
					comment: '处理描述：' + this.yjForm.comment, //意见
					attachmentList: this.filelist, //附件
					candidateUsers: this.yjForm.candidateUsers,
				}
				EvtFlowTransfer(para).then((res) => {
					console.log(res, '转派')
					if (res.code == '200') {
						this.$message({
							message: res.msg,
							type: 'success',
						})
					} else {
						this.$message({
							message: res.msg,
							type: 'error',
						})
					}
					this.yjdialog = false
					this.xqdialog = false
					this.getlist(1)
				})
			},
			// 编辑
			handlEdit: function(row) {
				this.editdialog = true
				console.log(row, '10010')
				this.getDetail(row)
			},
			// 图片上传、上传文件
			choosefile: function(event, type) {
				console.log(type, 'type')
				let file
				if (type == '0') {
					file = this.$refs.file.files[0] // 图片上传
				} else if (type == '1') {
					file = this.$refs.file1.files[0] // 音频上传
				} else if (type == '2') {
					file = this.$refs.file2.files[0] //视频上传
				} else if (type == '3') {
					file = this.$refs.file3.files[0] // 意见下的附件上传
				} else {}
				if (file) {
					if (type === '0' && file.type.startsWith('image/')) {
						this.uploadfile(file, type)
					} else if (type === '1' && file.type.startsWith('audio/')) {
						this.uploadfile(file, type)
					} else if (type === '2' && file.type.startsWith('video/')) {
						this.uploadfile(file, type)
					} else if (type === '3') {
						this.uploadfile(file, type)
					} else {
						this.$message({
							message: '所选附件的文件类型无效。',
							type: 'error',
						})
					}
				}
			},
			// 文件上传后获取数据
			uploadfile: function(data, type) {
				var random = new Date().getTime().toString()
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
							if (type == '0') {
								// 图片
								this.piclist.push({
									fileName: res.data.data.fileName,
									url: res.data.data.url,
									ossId: res.data.data.ossId,
								})
							} else if (type == '1') {
								//音频
								this.audiolist.push({
									fileName: res.data.data.fileName,
									url: res.data.data.url,
									ossId: res.data.data.ossId,
								})
							} else if (type == '2') {
								//视频
								this.videolist.push({
									fileName: res.data.data.fileName,
									url: res.data.data.url,
									ossId: res.data.data.ossId,
								})
							} else if (type == '3') {
								this.filelist.push({
									fileName: res.data.data.fileName,
									url: res.data.data.url,
									ossId: res.data.data.ossId,
								})
							} else {}
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
			// 预览
			previewFile: function(url, type) {
				if (type === 'image') {
					// 图片预览
					this.$alert(
						`<img src="${url}" style='max-width:100%; mac-height:100%;' >`,
						'图片预览', {
							dangerouslyUseHTMLString: true,
							customClass: 'image-perview-dialog',
						}
					)
				} else if (type === 'audio') {
					// 音频预览
					const audio = new Audio(url)
					audio.controls = true
					document.body.appendChild(audio)
				} else if (type === 'video') {
					// 视频预览
					const video = document.createElement('video')
					video.src = url
					video.controls = true
					document.body.appendChild(video)
				}
			},
			// 删除文件
			delfile: function(index, type) {
				if (type == '0') {
					this.piclist.splice(index, 1)
					// 更新key，强制el-form-item 重新渲染
					this.formItemKey += 1
				} else if (type == '1') {
					this.audiolist.splice(index, 1)
				} else {
					this.videolist.splice(index, 1)
				}
			},
			// 删除文件
			handdelfile: function(index) {
				this.filelist.splice(index, 1)
			},
			// 获取分派人员
			getuser: function() {
				let param = {
					roleKey: 'eventDisposer'
				}
				SelectDeptUserTree(param).then((res) => {
					this.userlist = res.data.data
					console.log(res.data.data, '获取分派人员')
				})
			},
			// 勾选人员
			handleClick: function(data) {
				console.log(data, '001010')
				let childata = this.$refs.roletree.getCheckedKeys()
				console.log(childata, 'childatachildatachildata')
			},
		},
	}
</script>

<style>
	.img {
		width: 50px;
		float: left;
		margin-left: 10px;
	}
</style>