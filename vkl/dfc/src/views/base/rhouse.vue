<template>
  <div class="g-cont">
    <div class="m-contain">
      <div class="m-search" style="float: left">
        <el-form :model="filters" :inline="true" ref="filters">
          <el-form-item label="房屋" prop="homeName" class="ipt150">
            <el-input v-model="filters.homeName" placeholder="房屋"></el-input>
          </el-form-item>
          <el-form-item label="房间号" prop="roomNo" class="ipt150">
            <el-input v-model="filters.roomNo" placeholder="房间号"></el-input>
          </el-form-item>
          <el-form-item label="租赁状态" prop="flowStatus">
            <el-select v-model="filters.flowStatus">
              <el-option
                :value="item.flowStatus"
                :label="item.statusName"
                :key="index"
                v-for="(item, index) in rentstatus"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="籍贯" prop="registered" class="ipt150">
            <el-input
              v-model="filters.registered"
              placeholder="籍贯"
            ></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="contactPhone" class="ipt150">
            <el-input
              v-model="filters.contactPhone"
              placeholder="联系电话"
            ></el-input>
          </el-form-item>
          <el-form-item label="租赁人姓名/房东" prop="name" class="ipt150">
            <el-input
              v-model="filters.name"
              placeholder="租赁人姓名/房东"
            ></el-input>
          </el-form-item>
          <el-form-item label="租赁时间" prop="time">
            <el-date-picker
              v-model="filters.time"
              type="daterange"
              start-placeholder="年-月-日"
              end-placeholder="年-月-日"
            ></el-date-picker>
          </el-form-item>
          <div class="search-btnbox">
            <span class="btn search-btn" @click="getlist(1)">查询</span>
            <span class="btn reset-btn" @click="resetForm('filters')"
              >重置</span
            >
          </div>
        </el-form>
      </div>
      <div class="operate-btn">
        <span class="btn rent-btn" @click="handleBeiAn">租房备案</span>
        <span class="btn export-btn" @click="handleexport">导出</span>
      </div>
      <div class="m-table">
        <el-table
          :data="datalist"
          highlight-current-row
          v-loading="listLoading"
          style="width: 100%"
          border
          :row-class-name="tableRowClassName"
          :header-cell-style="{ 'text-align': 'center' }"
          :cell-style="{ 'text-align': 'center' }"
          @selection-change="handlegx"
        >
          <el-table-column label="" type="selection" width="80">
          </el-table-column>
          <el-table-column label="房屋名称" prop="homeName"> </el-table-column>
          <el-table-column label="房间号" prop="roomNo"> </el-table-column>
          <el-table-column label="租赁人姓名" prop="renterName">
          </el-table-column>
          <el-table-column
            label="籍贯"
            prop="registered"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column label="联系电话" prop="contactPhone">
          </el-table-column>
          <el-table-column label="房东" prop="landlordName"> </el-table-column>
          <el-table-column label="房东联系电话" prop="landlordPhone">
          </el-table-column>
          <el-table-column label="租赁状态" prop="flowStatusName">
          </el-table-column>
          <el-table-column label="提交人" prop="submitterName">
          </el-table-column>
          <el-table-column
            label="租赁时间"
            prop="rentDate"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column label="操作" prop="">
            <template slot-scope="scope">
              <span class="detail-title" @click="handleDetail(scope.row)"
                >详情</span
              >&nbsp;&nbsp;
              <span class="edit-title" @click="rentrecord(scope.row)"
                >租赁记录</span
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="m-pagination">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pagesize"
          layout="prev, pager, next"
          :current-page.sync="currentPage1"
          prev-text="上一页"
          next-text="下一页"
          :total="total"
        >
        </el-pagination>
        <i class="total">共有{{ total }}条数据</i>
      </div>
    </div>

    <!-- 房屋备案 -->
    <!-- <bei-an-dialog
      :isShowBeiAn="isShowBeiAn"
      :jzrList="jzrList"
      :zlrInfo="zlrInfo"
      @handlecancel="handlecancel"
      @handleChooseRs1="handleChooseRs1"
      @handleChooseRs2="handleChooseRs2"
      @delZLR="delZLR"
      @delJZR="delJZR"
    /> -->
    <!-- 租赁人-居民选择 -->
    <!-- <add-resident
      :jmdialog="jmdialog1"
      @handleCloseAdd="handleCloseAdd"
      @handleAddResident="handleAddResident1"
    /> -->
    <!-- 其他居住人-居民选择 -->
    <!-- <add-resident
      :jmdialog="jmdialog2"
      @handleCloseAdd="handleCloseAdd"
      @handleAddResident="handleAddResident2"
    /> -->
    <!-- 详情 -->
    <el-dialog
      :visible.sync="xqdialog"
      v-if="xqdialog"
      class="g-dialog"
      title="租赁详情"
      @close="dialogClose"
    >
      <div class="tbox">
        <div class="addbox">
          <div class="lt">
            <div class="xq-content event-detail">
              <div class="xq-lst">
                <span class="name">房屋名称</span>
                <span class="lab">{{ detailfrom.homeName }}</span>
              </div>
              <div class="xq-lst">
                <span class="name">楼层</span>
                <span class="lab">{{ detailfrom.floors }}</span>
              </div>
              <div class="xq-lst">
                <span class="name">房间编号</span>
                <span class="lab">{{ detailfrom.roomNo }}</span>
              </div>
              <div class="xq-lst">
                <span class="name">租赁人</span>
                <span class="lab">{{ detailfrom.renterName }}</span>
              </div>

              <div class="xq-lst">
                <span class="name">联系电话</span>
                <span class="lab">{{ detailfrom.contactPhone }}</span>
              </div>
              <div class="xq-lst">
                <span class="name">其他居住人</span>
                <!-- <span class="lab">{{detailfrom.otherLiver}}</span> -->
                <div class="">
                  <i class="lab" v-for="(item, index) in detailfrom.otherLiver">
                    {{ item.name }}
                  </i>
                </div>
              </div>
              <div class="xq-lst">
                <span class="name">居住人数</span>
                <span class="lab">{{ detailfrom.population }}</span>
              </div>
              <div class="xq-lst">
                <span class="name">房东</span>
                <span class="lab">{{ detailfrom.landlordName }}</span>
              </div>
              <div class="xq-lst">
                <span class="name">房东联系方式</span>
                <span class="lab">{{ detailfrom.landlordPhone }}</span>
              </div>
              <div class="xq-lst">
                <span class="name">租赁时间</span>
                <span class="lab">{{ detailfrom.rentDate }}</span>
              </div>
              <div class="xq-lst">
                <span class="name">租赁合同</span>
                <ul
                  class="picul"
                  v-if="
                    detailfrom.rentContractList &&
                    detailfrom.rentContractList.length > 0
                  "
                >
                  <li
                    class="pic-lst"
                    v-for="(item, index) in detailfrom.rentContractList"
                  >
                    <img :src="item.url" class="img" />
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="editbox">
            <span class="edit-tip">租赁日志</span>
            <ul class="record-box">
              <li class="record-lst" v-for="(item, index) in recordlist">
                <i class="line"></i>
                <span class="dot"></span>
                <div class="rec-rt">
                  <span class="button">{{ item.activityName }}</span>
                  <div class="inf">
                    <img :src="item.avatar" class="avater" />{{ item.nickname }}
                  </div>
                  <span class="bbh">{{ item.finishTime }}</span>
                  <span class="bbh">{{ item.message }}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="dialog-foot">
          <div class="m-bom">
            <span
              class="m-bom-change"
              @click="openChangeTimeDialog(detailfrom.rentInfoId)"
              >修改租赁时间</span
            >
            <el-popover
              ref="popover"
              placement="top"
              width="160"
              popper-class="popover"
            >
              <p class="del-tip">是否要退租？</p>
              <div class="pop-btnbox">
                <span class="cancel-btn" @click="visibleDelCancel">取消</span>
                <span class="ok-btn" @click="visibleDelSubmit">确定</span>
              </div>
              <span slot="reference" class="del-title">
                <div
                  class="m-bom-b"
                  v-show="detailfrom.flowStatus != 'leaseOut'"
                >
                  退租
                </div>
              </span>
            </el-popover>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 租赁记录 -->
    <el-dialog
      :visible.sync="rentdialog"
      v-if="rentdialog"
      class="g-dialog"
      title="租赁记录"
      @close="rentClose"
    >
      <div class="jmbox">
        <div class="m-search">
          <el-form :model="rentform" :inline="true" ref="rentform">
            <el-form-item label="籍贯" prop="registered" class="ipt150">
              <el-input
                v-model="rentform.registered"
                placeholder="籍贯"
              ></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="contactPhone" class="ipt150">
              <el-input
                v-model="rentform.contactPhone"
                placeholder="联系电话"
              ></el-input>
            </el-form-item>
            <el-form-item label="租赁人姓名" prop="renterName" class="ipt150">
              <el-input
                v-model="rentform.renterName"
                placeholder="租赁人姓名"
              ></el-input>
            </el-form-item>
            <el-form-item label="租赁时间" prop="">
              <el-date-picker
                v-model="rentform.time"
                type="daterange"
                start-placeholder="年-月-日"
                end-placeholder="年-月-日"
              ></el-date-picker>
            </el-form-item>
            <div class="search-btnbox" style="margin-bottom: 0.08333rem">
              <span class="btn search-btn" @click="getrent(1)">查询</span>
              <span class="btn reset-btn" @click="resetForm1('rentform')"
                >重置</span
              >
            </div>
          </el-form>
        </div>
        <div class="m-table">
          <el-table
            :data="rentlist"
            highlight-current-row
            v-loading="listLoading"
            style="width: 100%"
            border
            :row-class-name="tableRowClassName"
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }"
          >
            <el-table-column label="租赁人姓名" prop="renterName">
            </el-table-column>
            <el-table-column
              label="籍贯"
              prop="registered"
              :show-overflow-tooltip="true"
            >
            </el-table-column>
            <el-table-column label="联系电话" prop="contactPhone">
            </el-table-column>
            <el-table-column label="房东" prop="landlordName">
            </el-table-column>
            <el-table-column label="房东联系电话" prop="landlordPhone">
            </el-table-column>
            <el-table-column label="租赁状态" prop="flowStatusName">
            </el-table-column>
            <el-table-column label="提交人" prop="submitterName">
            </el-table-column>
            <el-table-column
              label="租赁时间"
              prop="rentDate"
              :show-overflow-tooltip="true"
            >
            </el-table-column>
            <el-table-column
              label="退租时间"
              prop="leaseOutTime"
              :show-overflow-tooltip="true"
            >
            </el-table-column>
            <el-table-column label="操作" prop="">
              <template slot-scope="scope">
                <span class="detail-title" @click="handlesyqkdet(scope.row)"
                  >详情</span
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
    <!-- 修改租赁时间弹窗 -->
    <el-dialog
      :visible.sync="timeDialogVisible"
      v-if="timeDialogVisible"
      class="g-dialog"
      title="修改租赁时间"
      @close="closeChangeTimeDialog"
    >
      <div class="xq-content">
        <el-form :model="rentTime" :inline="true" ref="rentTime">
          <el-form-item label="租赁时间" prop="">
            <el-date-picker
              v-model="rentTime.time"
              type="daterange"
              start-placeholder="年-月-日"
              end-placeholder="年-月-日"
            ></el-date-picker>
          </el-form-item>
          <div class="dialog-foot">
            <span class="btn search-btn" @click="updateRentTime">确定</span>
            <span class="btn reset-btn" @click="closeChangeTimeDialog"
              >取消</span
            >
          </div>
        </el-form>
      </div>
    </el-dialog>

    <!-- 租房备案 -->
    <el-dialog
      :visible.sync="isShowBeiAn"
      v-if="isShowBeiAn"
      class="g-dialog"
      title="租房备案"
      @close="beianClose"
    >
      <el-form
        :model="beiAnForm"
        :inline="true"
        ref="beiAnForm"
        :rules="beiAnFormRule"
        class="addform"
        label-width="100px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="房屋名称" prop="houseId">
              <el-select
                v-model="beiAnForm.houseId"
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="remoteMethod"
                :loading="loading"
                @change="changeHouse(beiAnForm.houseId)"
              >
                <el-option
                  v-for="item in houseList"
                  :key="item.houseName"
                  :label="item.houseName"
                  :value="item.houseId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="楼层" prop="floor">
              <el-select v-model="beiAnForm.floor" @change="changeFloor">
                <el-option
                  v-for="(item, index) in floorList"
                  :key="index + 'y'"
                  :label="item.floorName"
                  :value="item.floorName"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="房间编号" prop="roomId">
              <el-select v-model="beiAnForm.roomId" @change="changeRoom">
                <el-option
                  v-for="(item, index) in roomList"
                  :key="index + 'n'"
                  :label="item.roomNo"
                  :value="item.roomId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="租赁人" prop="" style="width: 100%">
              <span class="gl-btn" @click="handleChooseRs1(1)">选择居民</span>
              <ul class="file-ul" style="float: left; width: 100%">
                <li class="file-li" v-if="Object.keys(zlrInfo).length">
                  <span class="">{{ zlrInfo.name }} {{ zlrInfo.idCard }}</span>
                  <span class="delfile" @click="delZLR">删除</span>
                </li>
              </ul>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="其他居住人" prop="" style="width: 100%">
              <span class="gl-btn" @click="handleChooseRs1(2)">选择居民</span>
              <ul class="file-ul" style="float: left; width: 100%">
                <li
                  class="file-li"
                  v-for="(item, index) in jzrList"
                  :key="index + 'm'"
                >
                  <span class="">{{ item.name }} {{ item.idCard }}</span>
                  <span class="delfile" @click="delJZR(index)">删除</span>
                </li>
              </ul>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="居住人数" prop="riverType">
              <span>{{
                this.jzrList.length + (this.zlrInfo.name ? 1 : 0)
              }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="房东" prop="landlordId">
              <!-- 占位 -->
              <template v-if="!landlords.length">
                <span style="opacity: 0">123456789</span>
              </template>
              <el-radio-group
                v-model="beiAnForm.landlordId"
                v-if="landlords.length"
              >
                <el-radio
                  :label="item.residentId"
                  v-for="(item, index) in landlords"
                  :key="index + 'x'"
                  >{{ item.name }}</el-radio
                >
                <!-- 占位 -->
                <template v-if="landlords.length === 1">
                  <span style="opacity: 0">123456789</span>
                </template>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="租赁时间"
              prop="rentStartDate"
              style="width: 100%"
            >
              <el-date-picker
                v-model="zlTimes"
                type="daterange"
                value-format="yyyy-MM-dd"
                start-placeholder="年-月-日"
                end-placeholder="年-月-日"
                @change="handleChooseDate"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="租房合同" prop="name" style="width: 100%">
              <div
                class="upimgbox"
                :style="{ backgroundImage: 'url(' + photoFileUrls + ')' }"
              >
                <input
                  ref="file"
                  type="file"
                  class="file"
                  @change="choosefile($event)"
                />
              </div>
              <div
                v-for="(item, index) in fileList"
                :key="index + 'a'"
                class="upimgbox"
                :style="{ backgroundImage: 'url(' + item.url + ')' }"
              >
                <img
                  src="@/assets/img/shanchu.png"
                  class="shanchu-img"
                  @click="delfilee(index)"
                />
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="dialog-foot">
        <span class="btn-cancel" @click="handlecancel('beiAnForm')">取消</span>
        <span class="btn-save" @click="handleSubmit('beiAnForm')">保存</span>
      </div>
    </el-dialog>

    <!-- 选择居民 -->
    <el-dialog
      :visible.sync="choicePerson"
      v-if="choicePerson"
      class="g-dialog"
      title="选择居民"
      @close="choicePersonClose"
    >
      <div class="jmbox">
        <div class="m-search">
          <div class="add-btnbox">
            <span class="btn search-btn" @click="handleAdd()">添加居民</span>
          </div>
          <el-form :model="jmfilters" :inline="true" ref="jmfilters">
            <el-form-item label="姓名" prop="">
              <el-input v-model="jmfilters.name" placeholder="姓名"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="">
              <el-input
                v-model="jmfilters.phone"
                placeholder="手机号码"
              ></el-input>
            </el-form-item>
            <el-form-item label="身份证号" prop="">
              <el-input
                v-model="jmfilters.idCard"
                placeholder="身份证号"
              ></el-input>
            </el-form-item>
            <div class="search-btnbox">
              <span class="btn search-btn" @click="getList">查询</span>
              <span class="btn reset-btn" @click="resetjm('jmfilters')"
                >重置</span
              >
            </div>
          </el-form>
        </div>
        <div class="m-table">
          <el-table
            :data="personList"
            ref="multipleTable"
            highlight-current-row
            v-loading="listLoading"
            style="width: 100%"
            border
            :row-class-name="tableRowClassName"
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }"
            @select="select"
            @select-all="selectAll"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="ID" prop="residentId" width="80">
            </el-table-column>
            <el-table-column label="姓名" prop="name"> </el-table-column>
            <el-table-column
              label="身份证号"
              prop="idCard"
              width="200"
            ></el-table-column>
            <el-table-column label="手机号" prop="phone"> </el-table-column>
            <el-table-column label="性别" prop="">
              <template slot-scope="scope">
                <span class="f-blue" v-if="scope.row.sex == '0'">男</span>
                <span class="f-gray" v-else-if="scope.row.sex == '1'">女</span>
                <span v-else>/</span>
              </template>
            </el-table-column>
            <el-table-column label="政治面貌" prop="politicsFace">
            </el-table-column>
            <el-table-column
              label="所属村"
              prop="villageName"
            ></el-table-column>
          </el-table>
          <div class="m-pagination">
            <el-pagination
              background
              @current-change="handleCurrentChangeChoicePerson"
              :page-size="jmfilters.pageSize"
              layout="prev, pager, next"
              :current-page.sync="jmfilters.pageNum"
              prev-text="上一页"
              next-text="下一页"
              :total="total"
            >
            </el-pagination>
            <i class="total">共有{{ totalChoicePerson }}条数据</i>
          </div>
        </div>
      </div>
      <div class="dialog-foot">
        <span class="btn-cancel" @click="handlecancelChoicePerson">取消</span>
        <span class="btn-save" @click="handlejmsubmit">确定</span>
      </div>
    </el-dialog>

    <!-- 新增居民 -->
    <el-dialog
      :visible.sync="addPerson"
      v-if="addPerson"
      class="g-dialog"
      title="添加居民"
      @close="addPersonClose"
      ><span class="tip">基础信息</span>
      <el-form
        :model="addForm"
        :inline="true"
        ref="addForm"
        :rules="addFormRules"
        class="addform"
      >
        <el-form-item label="照片" prop="" class="delbgimg" :key="formItemKey">
          <div
            class="upimgbox"
            :style="{
              backgroundImage: 'url(' + addForm.residentAvatarFile + ')',
            }"
          >
            <input
              ref="file1"
              type="file"
              class="file"
              @change="choosePhoto($event, '1')"
            />
          </div>
          <i class="del-tip1" v-if="editflag" @click="handlesyimg">删除</i>
        </el-form-item>
        <i style="display: block; width: 100%; float: left"></i>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input
            v-model="addForm.idCard"
            placeholder="请输入身份证号"
            maxlength="18"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <div
            :class="['radio-lst', { active: addForm.sex == '0' }]"
            @click="handletabtype('0', '0')"
          >
            <i class="dot"></i> 男
          </div>
          <div
            :class="['radio-lst', { active: addForm.sex == '1' }]"
            @click="handletabtype('1', '0')"
          >
            <i class="dot"></i> 女
          </div>
        </el-form-item>
        <el-form-item label="是否户主" prop="houseHolder">
          <div
            :class="['radio-lst', { active: addForm.houseHolder == '0' }]"
            @click="handletabtype('0', '1')"
          >
            <i class="dot"></i> 是
          </div>
          <div
            :class="['radio-lst', { active: addForm.houseHolder == '1' }]"
            @click="handletabtype('1', '1')"
          >
            <i class="dot"></i> 否
          </div>
        </el-form-item>
        <el-form-item label="居住房屋" prop="" style="width: 100%">
          <span class="gl-btn" @click="handlegl">关联</span>
          <ul
            class="file-ul"
            v-if="gxfloor.length > 0"
            style="float: left; width: 100%"
          >
            <li v-for="(item, index) in gxfloor" class="file-li">
              <span class="">{{ item.roomNo }}</span>
              <span class="delfile" @click="delfloor(index)">删除</span>
            </li>
          </ul>
        </el-form-item>
        <el-form-item label="户主姓名" prop="" style="width: 100%">
          <span class="gl-btn" @click="addjm">添加居民</span>
          <!-- <div
            class="gxlist"
            v-if="
              addForm.residentName != null && addForm.residentName.length > 0
            "
          >
            <span class="gx-name">{{ addForm.residentName }}</span>
            <i class="del-gx" @click="delglr">删除</i> -->
          <div
            class="gxlist"
            v-if="
              addForm.residentName != null && addForm.residentName.length > 0
            "
          >
            <span class="gx-name">{{ addForm.residentName }}</span>
            <i class="del-gx" @click="delglr">删除</i>
          </div>
        </el-form-item>
        <el-form-item label="与户主关系" prop="relationship">
          <el-input
            v-model="addForm.relationship"
            placeholder="请输入与户主关系"
          ></el-input>
        </el-form-item>
        <el-form-item label="民族" prop="nation">
          <el-input
            v-model="addForm.nation"
            placeholder="请输入民族"
          ></el-input>
        </el-form-item>
        <el-form-item label="政治面貌" prop="politicsFace">
          <el-input
            v-model="addForm.politicsFace"
            placeholder="请输入政治面貌"
          ></el-input>
        </el-form-item>
        <el-form-item label="婚姻状况" prop="marriage">
          <el-input
            v-model="addForm.marriage"
            placeholder="请输入婚姻状况"
          ></el-input>
        </el-form-item>
        <el-form-item label="文化程度" prop="education">
          <el-input
            v-model="addForm.education"
            placeholder="请输入文化程度"
          ></el-input>
        </el-form-item>
        <el-form-item label="健康状况" prop="health">
          <el-input
            v-model="addForm.health"
            placeholder="请输入健康状况"
          ></el-input>
        </el-form-item>
        <el-form-item label="户籍地址" prop="registered">
          <el-input
            v-model="addForm.registered"
            placeholder="请输入户籍地址"
          ></el-input>
        </el-form-item>
        <el-form-item label="居住地派出所" prop="registered">
          <el-input
            v-model="addForm.locationPcs"
            placeholder="请输入居住地派出所"
          ></el-input>
        </el-form-item>
        <el-form-item label="居住地址" prop="registered">
          <el-input
            v-model="addForm.location"
            placeholder="请输入居住地址"
          ></el-input>
        </el-form-item>
        <el-form-item label="户号" prop="registered">
          <el-input
            v-model="addForm.locationHh"
            placeholder="请输入户号"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input
            v-model="addForm.phone"
            placeholder="请输入联系方式"
          ></el-input>
        </el-form-item>
        <el-form-item label="工作单位" prop="workUnit">
          <el-input
            v-model="addForm.workUnit"
            placeholder="请输入工作单位"
          ></el-input>
        </el-form-item>
        <el-form-item label="获得荣誉" prop="honor">
          <el-input
            v-model="addForm.honor"
            placeholder="请输入获得荣誉"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否来沪人员" prop="outsider">
          <div
            :class="['radio-lst', { active: addForm.outsider == '0' }]"
            @click="handletabtype('0', '2')"
          >
            <i class="dot"></i> 是
          </div>
          <div
            :class="['radio-lst', { active: addForm.outsider == '1' }]"
            @click="handletabtype('1', '2')"
          >
            <i class="dot"></i> 否
          </div>
        </el-form-item>
        <el-form-item
          label="是否办理居住证"
          prop="residencePermit"
          v-if="residential"
        >
          <div
            :class="['radio-lst', { active: addForm.residencePermit == 'yes' }]"
            @click="handletabtype('0', '3')"
          >
            <i class="dot"></i> 是
          </div>
          <div
            :class="['radio-lst', { active: addForm.residencePermit == 'no' }]"
            @click="handletabtype('1', '3')"
          >
            <i class="dot"></i> 否
          </div>
        </el-form-item>
        <el-form-item label="人员标签" prop="" style="width: 100%">
          <img
            src="../../assets/img/addbq.png"
            class="add-img"
            @click="addbq"
          />
          <ul class="lab-ul">
            <li
              class="lab-lst"
              v-for="(item, index) in lablist"
              :style="{ color: item.color, borderColor: item.color }"
            >
              {{ item.name }}
            </li>
          </ul>
        </el-form-item>
      </el-form>
      <div class="dialog-foot">
        <span class="btn-cancel" @click="addPersonClose">取消</span>
        <span class="btn-save" @click="handleSubmitAddPerson">保存</span>
      </div>
    </el-dialog>

    <!-- 标签选择 -->

    <el-dialog
      :visible.sync="choiceLabel"
      v-if="choiceLabel"
      class="g-dialog"
      title="选择标签"
      @close="choiceLabelClose"
    >
      <div class="labbox">
        <span class="add-labtn" @click="handleadlab">添加标签</span>
        <div class="m-table">
          <el-table
            :data="lablist"
            highlight-current-row
            v-loading="listLoading"
            style="width: 100%"
            border
            :row-class-name="tableRowClassName"
            :header-cell-style="{ 'text-align': 'center' }"
            @selection-change="handlelab"
            :cell-style="{ 'text-align': 'center' }"
          >
            <el-table-column type="selection" width="80"> </el-table-column>
            <el-table-column label="标签名称" prop="">
              <template slot-scope="scope">
                <span v-if="scope.row.status == '1'">{{ scope.row.name }}</span>
                <el-input
                  v-else=""
                  v-model="scope.row.name"
                  class="min-ipt"
                  @blur="inputBlur($event, scope.row)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="标签颜色" prop="">
              <template slot-scope="scope">
                <el-input
                  type="color"
                  v-model="scope.row.color"
                  @input="selectColors($event)"
                  class="fk"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" prop="">
              <template slot-scope="scope">
                <span
                  class="del-title"
                  v-if="scope.row.status != '0'"
                  @click="dellab(scope.$index)"
                  >删除</span
                >
                <span
                  class="save-title"
                  v-if="scope.row.status == '0'"
                  @click="savelab(scope.row, scope.$index)"
                  >保存&nbsp;&nbsp;</span
                >
                <span
                  class="cancel-title"
                  v-if="scope.row.status == '0'"
                  @click="cancellab(scope.row, scope.$index)"
                  >取消</span
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="dialog-foot">
        <span class="btn-cancel" @click="handlecancel('1')">取消</span>
        <span class="btn-save" @click="handlelabSubmitLabel">保存</span>
      </div>
    </el-dialog>

    <!-- 房屋选择 -->
    <el-dialog
      :visible.sync="housedialog"
      v-if="housedialog"
      class="g-dialog min-dia642"
      title="房屋选择"
      @close="closeHouse"
    >
      <div class="house-cont">
        <el-form :model="hotfilters" class="user-form" ref="ruleForm">
          <el-form-item label="" prop="orgnName">
            <el-input v-model="hotfilters.name" placeholder="房屋名"></el-input>
          </el-form-item>
          <span class="search-btn" @click="getroomSelect">搜索</span>
        </el-form>
        <div class="user-lt" @scroll="scrollEventFn">
          <ul class="houser-ul">
            <li
              :class="['houser-li', { active: current == index }]"
              v-for="(item, index) in houserlist"
            >
              <span class="home-name" @click="choosehour(index)"
                ><i class="xsj"></i>{{ item.homeName }}</span
              >
              <ul class="floor-ul">
                <li
                  :class="['floor-li', { act: gxcur == index2 }]"
                  v-for="(items, index2) in item.floorsListVos"
                  @click="handlefloor(index, index2, item.floorsListVos)"
                >
                  <span class="floor-name"
                    ><i class="gx"></i>{{ items.floors }}</span
                  >
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div class="user-rt">
          <div class="m-table">
            <el-table
              :data="roomlist"
              ref="dataTable"
              highlight-current-row
              v-loading="listLoading"
              style="width: 100%"
              :row-class-name="tableRowClassName"
              :header-cell-style="{ 'text-align': 'center' }"
              :cell-style="{ 'text-align': 'center' }"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection"></el-table-column>
              <el-table-column label="房号" prop="roomNo"> </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="dialog-foot">
        <span class="btn-cancel" @click="closeHouse">取消</span>
        <span class="btn-save" @click="handlehouseSubmit">确定</span>
      </div>
    </el-dialog>
    <!-- 相关人选择  -->
    <el-dialog
      :visible.sync="otherPerson"
      v-if="otherPerson"
      class="g-dialog"
      title="添加居民"
      @close="otherPersonClose"
    >
      <div class="jmbox">
        <div class="m-search">
          <el-form
            :model="otherPersonfilters"
            :inline="true"
            ref="otherPersonfilters"
          >
            <el-form-item label="姓名/户主姓名" prop="">
              <el-input
                v-model="otherPersonfilters.name"
                placeholder="姓名/户主姓名"
              ></el-input>
            </el-form-item>
            <el-form-item label="标签" prop="">
              <el-input
                v-model="otherPersonfilters.tags"
                placeholder="标签"
              ></el-input>
            </el-form-item>
            <div class="search-btnbox">
              <span class="btn search-btn" @click="getOtherPerson()">查询</span>
              <span
                class="btn reset-btn"
                @click="resetjm3('otherPersonfilters')"
                >重置</span
              >
            </div>
          </el-form>
        </div>
        <div class="m-table">
          <el-table
            :data="otherPersonList"
            ref="multipleTable"
            highlight-current-row
            v-loading="otherPersonLoading"
            style="width: 100%"
            border
            :row-class-name="tableRowClassName3"
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }"
            @select="select3"
            @select-all="selectAll3"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="ID" prop="residentId" width="80">
            </el-table-column>
            <el-table-column label="姓名" prop="name"> </el-table-column>
            <el-table-column label="性别" prop="">
              <template slot-scope="scope">
                <span class="f-blue" v-if="scope.row.sex == '0'">男</span>
                <span class="f-gray" v-else-if="scope.row.sex == '1'">女</span>
                <span v-else="">/</span>
              </template>
            </el-table-column>
            <el-table-column label="是否户主" prop="">
              <template slot-scope="scope">
                <span class="f-blue" v-if="scope.row.houseHolder == '0'"
                  >是</span
                >
                <span class="f-gray" v-else-if="scope.row.houseHolder == '1'"
                  >否</span
                >
                <span v-else="">/</span>
              </template>
            </el-table-column>
            <el-table-column label="户主" prop="residentName">
            </el-table-column>
            <el-table-column label="是否来沪人员" prop="">
              <template slot-scope="scope">
                <span class="f-blue" v-if="scope.row.outsider == '0'">是</span>
                <span class="f-gray" v-else-if="scope.row.outsider == '1'"
                  >否</span
                >
                <span v-else="">/</span>
              </template>
            </el-table-column>
            <el-table-column label="居住房屋" prop="room"> </el-table-column>
            <el-table-column label="标签" prop="">
              <template slot-scope="scope">
                <ul
                  class="lab-ul"
                  v-if="scope.row.tags && scope.row.tags.length > 0"
                >
                  <li
                    class="lab-lst"
                    v-for="(item, index) in scope.row.tags"
                    :style="{ color: item.color, borderColor: item.color }"
                  >
                    {{ item.name }}
                  </li>
                </ul>
              </template>
            </el-table-column>
          </el-table>
          <div class="m-pagination">
            <el-pagination
              background
              @size-change="handleSizeChangeOtherPerson"
              @current-change="handleCurrentChangeOtherPerson"
              :current-page="currentPageOtherPerson"
              :page-size="pagesizeOtherPerson"
              layout="prev, pager, next"
              :current-page.sync="currentPageOtherPerson"
              prev-text="上一页"
              next-text="下一页"
              :total="totalOtherPerson"
            >
            </el-pagination>
            <i class="total">共有{{ totalOtherPerson }}条数据</i>
          </div>
        </div>
      </div>
      <div class="dialog-foot">
        <span class="btn-cancel" @click="otherPersonClose">取消</span>
        <span class="btn-save" @click="handlejmsubmitOtherPerson">确定</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  HomeRentList,
  RentRecord,
  HomeRentDt,
  GetStatusCombo,
  BackRent,
  updateRentTime,
  // 备案
  getHouseList,
  getFloorList,
  getRoomList,
  getLandlordsList,
  getHomeownerInfo,
  reportTenement,
  // 备案
  // 添加居民
  ResidentList,

  // 添加居民
  // 新增居民
  AddResident,
  UpdateResident,
  // 新增居民

  // 房屋
  RoomTreePages,
  //房屋
  // 其他居民
  HouseholdInfo,
  // 其他居民
} from '../../api/api.js'
// import BeiAnDialog from "./rhouse/beiAnDialog.vue";
// import AddResident from "./rhouse/addResident.vue";
import moment from 'moment'
import axios from 'axios'
export default {
  components: {
    // BeiAnDialog,
    // AddResident,
  },
  data() {
    return {
      filters: {
        homeName: '',
        roomNo: '',
        flowStatus: '',
        registered: '',
        contactPhone: '',
        name: '',
        time: [],
        rentStartDate: '',
        rentEndDate: '',
        size: 10,
        current: 1,
      },
      datalist: [],
      listLoading: false,
      total: 0,
      currentPage: 1,
      currentPage1: 1,
      pagesize: 10,
      multion: [],
      xqdialog: false,
      detailfrom: {},
      piclist: [],
      recordlist: [],
      rentdialog: false,
      rentform: {
        registered: '',
        contactPhone: '',
        renterName: '',
        time: [],
        rentStartDate: '',
        rentEndDate: '',
      },
      rentlist: [],
      rentInfoId: '',
      rentstatus: [],
      isShowBeiAn: false,
      jmdialog1: false,
      jmdialog2: false,
      zlrInfo: {},
      jzrList: [],
      rentTime: [],
      timeDialogVisible: false,

      // 备案
      photoFileUrls: "url('@/assets/img/empty.png') no-repeat",
      beiAnForm: {
        houseId: '',
        floor: '',
        roomId: '',
        rentStartDate: '',
        rentEndDate: '',
        landlordId: '', // 房东或二房东id
        homeownerId: '', // 屋主用户id,
        homeownerResidentId: '', // 屋主居民id
        homeownerName: '', // 屋主名称
        homeownerPhone: '', // 屋主电话
      },
      beiAnFormRule: {
        houseId: [
          { required: true, message: '请选择房屋名称', trigger: 'change' },
        ],
        floor: [{ required: true, message: '请选择楼层', trigger: 'change' }],
        roomId: [
          { required: true, message: '请选择房间编号', trigger: 'change' },
        ],
        zlrInfo: [
          { required: true, message: '请选择租赁人', trigger: 'change' },
        ],
        rentStartDate: [
          { required: true, message: '请选择租赁时间', trigger: 'blur' },
        ],
        landlordId: [
          { required: true, message: '请选择房东', trigger: 'change' },
        ],
      },
      zlTimes: [], // 租赁时间
      fileAllowTypes: ['png', 'jpg', 'jpeg'],
      fileList: [], // 文件列表
      houseList: [],
      houseId: null,
      floorList: [],
      floors: null,
      roomList: [],
      landlords: [], // 房东列表
      houseList: [],
      loading: false,
      // 备案

      //  选择居民
      choicePerson: false,
      jmfilters: {
        name: '',
        phone: '',
        idCard: '',
        pageSize: 10,
        pageNum: 1,
      },
      personList: [],
      personType: '',

      // 新增居民
      addPerson: false,
      addForm: {
        residentId: '', //居民id
        residentAvatar: '', //居民头像
        residentAvatarFile: "url('../img/empty.png') no-repeat",
        name: '', //姓名
        sex: '0', //性别
        idCard: '', //身份证
        room: '', //居住房屋
        roomId: '', //居住房屋id
        houseHolder: '', //是否户主
        residentName: '', //户主姓名
        relationship: '', //与户主关系
        nation: '', //民族
        politicsFace: '', //政治面貌
        marriage: '', //婚姻状况
        education: '', //文化程度
        health: '', //健康状况
        registered: '', //户口所在地
        phone: '', //联系方式
        workUnit: '', //工作单位
        honor: '', //获得荣誉
        outsider: '', //是否外来人员
        residencePermit: '', //是否办理居住证
        tags: [], //标签
        locationPcs: '', //居住地派出所
        location: '', //居住地址
        locationHh: '', //户号
      },
      addFormRules: {
        name: [
          { required: true, message: '请输入居民姓名！', trigger: 'blur' },
        ],
        idCard: [
          { required: true, message: '请输入身份证号！', trigger: 'blur' },
        ],
        residencePermit: [
          { required: true, message: '请选择是否办理', trigger: 'change' },
        ],
      },
      formItemKey: 0,
      editflag: false,
      housedialog: false,
      gxfloor: [],
      residential: false,
      lablist: [],
      // 新增居民

      // 标签
      choiceLabel: false,
      bqdialog: false,
      // 标签

      // 房屋
      houserlist: [],
      hotfilters: {
        pageSize: 20,
        pageNum: 1,
        name: '',
      },
      hotfiltersTotal: '',
      scrollEventFn: undefined,
      roomlist: [],
      current: '0',
      gxcur: '-1',
      tmpSelectList: [],
      tmpList: [],
      // 房屋
      // 其他相关人员
      otherPerson: false,
      otherPersonfilters: {
        name: '',
        tags: '',
        size: 10,
        current: 1,
      },
      otherPersonLoading: false,
      otherPersonList: [],
      total3: 0,
      total13: 0,
      currentPage3: 1,
      currentPage13: 1,
      currentPage23: 1,
      currentPage33: 1,
      pagesize13: 10,
      pagesize13: 10,

      // 其他相关人员

      // 分页
      totalChoicePerson: 0,
      totalOtherPerson: 0,
      currentPageOtherPerson: 1,
      currentPageOtherPerson: 1,
      currentPageOtherPerson: 1,
      pagesizeOtherPerson: 10,
      pagesizeOtherPerson: 10,
      // 分页
    }
  },
  mounted() {
    this.getstatus()
    this.getlist('')
    this.scrollEventFn = this.debounce(this.scrollEvent, 100)
  },
  methods: {
    // 其他相关人员函数
    // 提交其他人员
    handlejmsubmitOtherPerson() {
      const length = Object.keys(this.jmInfo3).length
      if (length <= 0) {
        this.$message({
          message: '请选择人员',
          type: 'error',
        })
        return
      }
      console.log('this.jmInfo3', this.jmInfo3)
      this.addForm.residentName = this.jmInfo3.name
      this.otherPerson = false
      this.currentPageOtherPerson = 1
    },
    // 居民选择分页
    handleSizeChangeOtherPerson: function (size) {
      this.pagesize1 = size
      this.otherPersonfilters.size = size
      this.getOtherPerson('')
    },
    // 居民选择分页
    handleCurrentChangeOtherPerson: function (val) {
      this.otherPersonfilters.current = val
      this.getOtherPerson(val)
    },
    // 选择人员的分页
    handleCurrentChangeChoicePerson: function (val) {
      this.jmfilters.current = val
      this.getList(val)
    },
    // 选择人员
    select3(selection) {
      if (selection.length > 1) {
        let del_row = selection.shift()
        this.$refs.multipleTable.toggleRowSelection(del_row, false)
      }
      if (selection.length > 0) {
        // console.log(selection[0]);
        this.jmInfo3 = {
          residentId: selection[0].residentId,
          name: selection[0].name,
          idCard: selection[0].idCard,
          phone: selection[0].phone,
        }
      } else {
        this.jmInfo3 = {}
      }
    },
    // 选择人员全选
    selectAll3(selection) {
      if (selection.length > 1) {
        selection.length = 1
      }
      if (selection.length > 0) {
        this.jmInfo3 = {
          residentId: selection[0].residentId,
          name: selection[0].name,
          idCard: selection[0].idCard,
        }
      } else {
        this.jmInfo3 = {}
      }
    },
    // 单行变色
    tableRowClassName3: function (rowIndex) {
      if (rowIndex.rowIndex % 2 != 0) {
        return 'evenRow'
      }
      return 'oddRow'
    },
    otherPersonClose() {
      this.otherPerson = false
      this.currentPageOtherPerson = 1
    },
    // 查看居民
    getOtherPerson: function (val) {
      let para = {
        name: this.otherPersonfilters.name,
        tags: this.otherPersonfilters.tags,
        pageSize: this.otherPersonfilters.size,
        pageNum: this.otherPersonfilters.current,
      }
      if (val) {
        para.pageNum = val
        this.currentPage33 = val
      }
      HouseholdInfo(para).then((res) => {
        console.log(res, 'kkk')
        this.otherPersonList = res.data.rows
        this.totalOtherPerson = res.data.total
      })
    },
    // 其他相关人员函数
    // 房屋函数
    // 房屋
    // 房屋关联
    handlegl: function () {
      this.housedialog = true
      this.getroom()
    },
    // 房屋关联关闭事件
    closeHouse: function () {
      this.hotfilters.name = null
      this.hotfilters.pageSize = 20
      this.hotfilters.pageNum = 1
      this.housedialog = false
      this.tmpList = []
      this.tmpSelectList = []
      this.gxcur = '-1'
    },
    // 房屋搜索
    getroomSelect() {
      this.houserlist = []
      this.hotfilters.pageNum = 1
      this.roomlist = []
      this.getroom()
    },
    // 监听滚动到底部
    scrollEvent() {
      const scroll = document.querySelector('.user-lt')
      if (scroll.scrollHeight - scroll.scrollTop - 5 < scroll.clientHeight) {
        const total = this.hotfiltersTotal
        const houserlistL = this.houserlist.length
        if (houserlistL < total) {
          this.hotfilters.pageNum = this.hotfilters.pageNum + 1
          this.getroom()
        }
      }
    },
    debounce(func, delay = 1000, immediate = false) {
      //闭包
      let timer = null
      //不能用箭头函数
      return function () {
        if (timer) {
          clearTimeout(timer)
        }
        if (immediate && !timer) {
          func.apply(this, arguments)
        }
        timer = setTimeout(() => {
          func.apply(this, arguments)
        }, delay)
      }
    },
    // 房屋
    getroom: function () {
      let para = this.hotfilters
      RoomTreePages(para).then((res) => {
        this.houserlist = this.houserlist.concat(res.data.rows)
        this.hotfiltersTotal = res.data.total
      })
    },
    // 选择房屋
    choosehour: function (index) {
      this.tmpList = this.tmpList.concat(this.tmpSelectList)
      this.gxcur = '-1'
      this.current = index
      this.roomlist = []
      // this.$refs.dataTable.clearSelection()
    },
    // 选择楼层
    handlefloor: function (index, index2, data) {
      // console.log('----切换楼层了----')
      this.tmpList = this.tmpList.concat(this.tmpSelectList)
      this.gxcur = ''
      this.current = index
      this.gxcur = index2
      this.roomlist = data[index2].treeVos
      // console.log('【选择楼层】')
      // console.log('this.tmpList',this.tmpList.length,this.tmpList)
      // console.log('this.tmpSelectList',this.tmpSelectList.length,this.tmpSelectList)
      // console.log('this.gxfloor',this.gxfloor.length,this.gxfloor)
      // console.log('【选择楼层】')
    },
    // 勾选房屋房号

    handleSelectionChange: function (data) {
      if (this.gxcur != '-1') {
        this.qzname =
          this.houserlist[this.current].homeName +
          '-' +
          this.houserlist[this.current].floorsListVos[this.gxcur].floors
      }
      this.tmpSelectList = []

      for (var i = 0; i < data.length; i++) {
        const index = this.tmpList.findIndex(
          (item) => item.roomId === data[i].roomId
        )
        const index2 = this.gxfloor.findIndex(
          (item) => item.roomId === data[i].roomId
        )
        console.log('存在于该轮选择', index)
        console.log('存在于前轮选择', index2)
        // console.log(index2)
        // if(index == -1 ){
        if (index == -1 && index2 == -1) {
          this.tmpSelectList.push({
            roomId: data[i].roomId,
            roomNo: this.qzname + '-' + data[i].roomNo,
          })
        }
      }
      // console.log('【点击房屋】')
      // console.log('this.tmpList',this.tmpList.length,this.tmpList)
      // console.log('this.tmpSelectList',this.tmpSelectList.length,this.tmpSelectList)
      // console.log('this.gxfloor',this.gxfloor.length,this.gxfloor)
      // console.log('【点击房屋】')
    },
    // 房屋确认
    handlehouseSubmit: function () {
      this.roomId = []
      this.roomNo = []
      // console.log('暂时',this.tmpList)
      this.gxfloor = this.gxfloor.concat(
        this.tmpList.concat(this.tmpSelectList)
      )
      // console.log('---确认数据---', this.gxfloor)
      for (var i = 0; i < this.gxfloor.length; i++) {
        this.roomId.push(this.gxfloor[i].roomId)
        this.roomNo.push(this.gxfloor[i].roomNo)
      }
      this.closeHouse()
      // this.housedialog = false
      // this.hotfilters.name = null
      // this.gxcur = '-1'
      // console.log('【确认数据】')
      // console.log('this.tmpList', this.tmpList.length, this.tmpList)
      // console.log(
      //   'this.tmpSelectList',
      //   this.tmpSelectList.length,
      //   this.tmpSelectList
      // )
      // console.log('this.gxfloor', this.gxfloor.length, this.gxfloor)
      // console.log('【确认数据】')
    },
    // 删除房屋
    delfloor: function (index) {
      this.gxfloor.splice(index, 1)
      this.addForm.room = ''
      this.addForm.roomId = ''
    },
    // 房屋函数
    // 标签函数
    choiceLabelClose() {
      this.choiceLabel = false
    },
    // 人员标签
    addbq: function () {
      this.choiceLabel = true
    },
    // 添加标签
    handleadlab: function () {
      let obj = {
        name: '',
        color: '',
        status: '0',
      }
      this.lablist.push(obj)
    },
    // 选择颜色
    selectColors(event) {
      console.log(event, 'evnet')
    },
    // 失去焦点
    inputBlur(event, row) {
      console.log(row, '11')
      // row.status = '1'
    },
    // 勾选标签
    handlelab: function (data) {
      this.gxlabbox = data
    },

    // 标签保存
    handlelabSubmitLabel: function () {
      this.choiceLabel = false
    },
    // 保存标签
    savelab: function (row, index) {
      row.status = '1'
    },
    // 取消标签
    cancellab: function (row, index) {
      row.name = ''
      row.color = ''
      this.lablist.splice(index, 1)
    },
    // 删除标签
    dellab: function (index) {
      this.lablist.splice(index, 1)
    },
    // 标签函数

    // 新增居民的函数
    // 打开新增居民的弹窗
    handleAdd() {
      this.addPerson = true
    },
    addPersonClose() {
      this.addPerson = false
      this.addForm = {
        residentId: '', //居民id
        residentAvatar: '', //居民头像
        residentAvatarFile: "url('../img/empty.png') no-repeat",
        name: '', //姓名
        sex: '0', //性别
        idCard: '', //身份证
        room: '', //居住房屋
        roomId: '', //居住房屋id
        houseHolder: '', //是否户主
        residentName: '', //户主姓名
        relationship: '', //与户主关系
        nation: '', //民族
        politicsFace: '', //政治面貌
        marriage: '', //婚姻状况
        education: '', //文化程度
        health: '', //健康状况
        registered: '', //户口所在地
        phone: '', //联系方式
        workUnit: '', //工作单位
        honor: '', //获得荣誉
        outsider: '', //是否外来人员
        residencePermit: '', //是否办理居住证
        tags: [], //标签
        locationPcs: '', //居住地派出所
        location: '', //居住地址
        locationHh: '', //户号
      }
      this.gxfloor = []
    },
    // 房屋关联
    handlegl: function () {
      this.housedialog = true
      this.getroom()
    },
    // 提交新增居民
    handleSubmitAddPerson() {
      this.roomNo = []
      this.roomId = []
      this.gxfloor.map((item) => {
        this.roomNo.push(item.roomNo)
        this.roomId.push(item.roomId)
      })
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          if (this.roomNo.length > 0) {
            this.addForm.room = this.roomNo.join(',')
          }
          if (this.roomId.length > 0) {
            this.addForm.roomId = this.roomId.join(',')
          }
          let para = {
            residentId: this.addForm.residentId, //居民id
            residentAvatar: this.addForm.residentAvatar, //居民头像
            name: this.addForm.name, //姓名
            sex: this.addForm.sex, //性别
            idCard: this.addForm.idCard, //身份证
            room: this.addForm.room, //居住房屋
            roomId: this.addForm.roomId, //居住房屋id
            houseHolder: this.addForm.houseHolder, //是否户主
            residentName: this.addForm.residentName, //户主姓名
            relationship: this.addForm.relationship, //与户主关系
            nation: this.addForm.nation, //民族
            politicsFace: this.addForm.politicsFace, //政治面貌
            marriage: this.addForm.marriage, //婚姻状况
            education: this.addForm.education, //文化程度
            health: this.addForm.health, //健康状况
            registered: this.addForm.registered, //户口所在地
            phone: this.addForm.phone, //联系方式
            workUnit: this.addForm.workUnit, //工作单位
            honor: this.addForm.honor, //获得荣誉
            outsider: this.addForm.outsider, //是否外来人员
            residencePermit: this.addForm.residencePermit, //是否办理居住证
            tags: this.lablist, //标签
            locationPcs: this.addForm.locationPcs, //居住地派出所
            location: this.addForm.location, //居住地址
            locationHh: this.addForm.locationHh, //户号
          }
          if (para.idCard && para.name) {
            AddResident(para).then((res) => {
              if (res.code == '200') {
                this.$message({
                  message: res.msg,
                  type: 'success',
                })
                this.resetAddForm()
                this.adddialog = false
                // this.getlist(1)
                this.jmfilters.pageNum = 1
                this.getList()
                this.addPerson = false
              } else {
                this.$message({
                  message: res.msg,
                  type: 'error',
                })
              }
              // this.$refs.addForm.resetFields()
            })
          } else {
            if (!para.idCard) {
              this.$message({
                message: '请输入身份证号！',
                type: 'error',
              })
            } else {
              this.$message({
                message: '请输入居民姓名！',
                type: 'error',
              })
            }
          }
        }
      })
    },
    // 重置
    resetAddForm() {
      this.addForm = {
        residentId: '', //居民id
        residentAvatar: '', //居民头像
        residentAvatarFile: "url('../img/empty.png') no-repeat",
        name: '', //姓名
        sex: '0', //性别
        idCard: '', //身份证
        room: '', //居住房屋
        roomId: '', //居住房屋id
        houseHolder: '', //是否户主
        residentName: '', //户主姓名
        relationship: '', //与户主关系
        nation: '', //民族
        politicsFace: '', //政治面貌
        marriage: '', //婚姻状况
        education: '', //文化程度
        health: '', //健康状况
        registered: '', //户口所在地
        phone: '', //联系方式
        workUnit: '', //工作单位
        honor: '', //获得荣誉
        outsider: '', //是否外来人员
        residencePermit: '', //是否办理居住证
        tags: [], //标签
        locationPcs: '', //居住地派出所
        location: '', //居住地址
        locationHh: '', //户号
      }
    },

    // 取消新增居民
    handlecancelAddPerson() {
      this.addPerson = false
    },
    // 导入、图片上传
    choosePhoto: function (event, type) {
      // 文件上传
      let file = this.$refs.file1.files[0]
      console.log(file, '010100')
      this.uploadPhoto(file, type)
    },
    // 文件上传后获取数据
    uploadPhoto: function (data, type) {
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
            // 图片上传后
            this.addForm.residentAvatarFile = res.data.data.url
            this.addForm.residentAvatar = res.data.data.ossId
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
    // 图片上传
    uploadimg: function (event) {
      let file = this.$refs.file
      console.log(file.files[0], '10100')
    },
    // 选择性别、户主、外来人员
    handletabtype: function (val, type) {
      if (type == '0') {
        this.addForm.sex = val
      } else if (type == '1') {
        this.addForm.houseHolder = val
      } else if (type == '2') {
        this.addForm.outsider = val
        if (val == '0') {
          this.residential = true
        } else {
          this.residential = false
        }
      } else {
        if (val == '0') {
          this.addForm.residencePermit = 'yes'
        } else if (val == '1') {
          this.addForm.residencePermit = 'no'
        }
      }
    },
    addjm: function () {
      let para = {
        name: this.otherPersonfilters.name,
        tags: this.otherPersonfilters.tags,
        pageSize: this.otherPersonfilters.size,
        pageNum: this.otherPersonfilters.current,
      }
      // if (val) {
      //   para.pageNum = val
      //   this.currentPage33 = val
      // }
      HouseholdInfo(para).then((res) => {
        console.log('-----获取其他人员数据-----', res.data)
        this.otherPersonList = res.data.rows
        this.totalOtherPerson = res.data.total
        this.otherPerson = true
        console.log('-----获取其他人员数据-----', this.otherPersonList)
      })
    },
    // 删除关联人
    delglr: function () {
      this.addForm.residentName = ''
    },

    // 新增居民的函数

    // 选择居民的函数
    // 关闭选择居民弹窗
    choicePersonClose() {
      this.choicePerson = false
      this.jmfilters.pageNum = 1
    },
    // 获取列表列表
    getList() {
      ResidentList(this.jmfilters).then((res) => {
        this.personList = res.data.data
        this.totalChoicePerson = res.data.total
      })
    },
    // 选择人员
    select(selection) {
      if (selection.length > 1) {
        let del_row = selection.shift()
        this.$refs.multipleTable.toggleRowSelection(del_row, false)
      }
      if (selection.length > 0) {
        // console.log(selection[0]);
        this.jmInfo = {
          residentId: selection[0].residentId,
          name: selection[0].name,
          idCard: selection[0].idCard,
          phone: selection[0].phone,
        }
      } else {
        this.jmInfo = {}
      }
    },
    // 选择人员全选
    selectAll(selection) {
      if (selection.length > 1) {
        selection.length = 1
      }
      if (selection.length > 0) {
        this.jmInfo = {
          residentId: selection[0].residentId,
          name: selection[0].name,
          idCard: selection[0].idCard,
        }
      } else {
        this.jmInfo = {}
      }
    },
    // 提交
    handlejmsubmit() {
      const length = Object.keys(this.jmInfo).length
      if (length <= 0) {
        this.$message({
          message: '请选择人员',
          type: 'error',
        })
        return
      }
      console.log(this.jmInfo)
      // 把数据传递给住房备案
      if (this.personType == '1') {
        this.zlrInfo = this.jmInfo
        const index = this.jzrList.findIndex(
          (item) => item.residentId === this.jmInfo.residentId
        )
        if (index != -1) {
          this.$message({
            message: '该用户已是其他居住人，请现更换为租赁人！',
            type: 'warning',
          })
          this.jzrList.splice(index, 1)
        }
      } else {
        // 防止多次选中一个居民
        const isJmInfoExists = this.jzrList.some(
          (item) => item.residentId === this.jmInfo.residentId
        )
        if (
          this.zlrInfo &&
          this.zlrInfo.residentId === this.jmInfo.residentId
        ) {
          this.$message({
            message: '该用户已是租赁人，请勿重复添加！',
            type: 'warning',
          })
          return
        }
        // 如果不存在，则添加到数组中
        if (isJmInfoExists) {
          this.$message({
            message: '该用户已被选中为其他居住人，请勿重复添加！',
            type: 'warning',
          })
          return
        } else {
          this.jzrList.push(this.jmInfo)
        }
      }
      this.choicePerson = false
      this.jmfilters.pageNum = 1

      // this.$emit('handleAddResident', this.jmInfo)
    },
    handlecancelChoicePerson() {
      this.jmInfo = {}
      this.choicePerson = false
    },
    // 选择居民的函数

    // 备案
    remoteMethod(query) {
      if (query !== '') {
        this.getHouse(query)
      } else {
        this.houseList = []
      }
    },
    // 获取房屋
    getHouse(houseName) {
      getHouseList({ houseName }).then((res) => {
        this.houseList = res
      })
    },

    // 选择房屋
    changeHouse(houseId) {
      console.log(houseId)
      this.houseId = houseId
      this.floorList = []
      this.landlords = []
      this.roomList = []
      this.beiAnForm.floor = ''
      this.beiAnForm.roomId = ''
      this.beiAnForm.landlordId = ''
      // 获取楼层
      getFloorList({ houseId }).then((res) => {
        this.floorList = res
      })
    },
    // 选择楼层
    changeFloor(floors) {
      this.floors = floors
      this.roomList = []
      this.landlords = []
      this.beiAnForm.roomId = ''
      this.beiAnForm.landlordId = ''
      const param = {
        houseId: this.houseId,
        floors,
      }
      getRoomList(param).then((res) => {
        this.roomList = res
      })
    },
    // 选择房间
    changeRoom(roomId) {
      this.beiAnForm.landlordId = ''
      getLandlordsList(roomId).then((res) => {
        if (res.code == 200) {
          this.landlords = res.data
        }
      })
      getHomeownerInfo(roomId).then((res) => {
        if (res.code == 200) {
          console.log(res.data)
          this.beiAnForm.homeownerId = res.data.userId
          this.beiAnForm.homeownerResidentId = res.data.residentId
          this.beiAnForm.homeownerName = res.data.residentName
          this.beiAnForm.homeownerPhone = res.data.phone
        }
      })
    },
    // 选择时间区间
    handleChooseDate(date) {
      this.beiAnForm.rentStartDate = date[0]
      this.beiAnForm.rentEndDate = date[1]
    },
    // 选择文件
    choosefile(e) {
      // 文件上传
      let file = this.$refs.file.files[0]
      const fileType = file.name.split('.').pop()
      if (!this.fileAllowTypes.includes(fileType)) {
        this.$message({
          message: '文件格式不正确，请上传.png/.jpg/jpeg图片格式文件',
          type: 'error',
        })
        return
      }
      this.uploadfile(file)
      e.target.value = ''
    },
    // 租赁人-居民选择
    handleChooseRs1(type) {
      this.personType = type
      console.log('打开选择居民窗口')
      this.choicePerson = true
      this.getList()
      // this.$emit('handleChooseRs1')
    },
    // 租赁人-删除
    delZLR() {
      this.$emit('delZLR')
    },
    // 居住人-删除
    delJZR(index) {
      this.$emit('delJZR', index)
    },
    // 其他居住人-居民选择
    handleChooseRs2() {
      this.$emit('handleChooseRs2')
    },
    // 文件上传后获取数据
    uploadfile: function (data) {
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
            const fileList = this.fileList
            fileList.push(res.data.data)
            this.fileList = fileList
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
        })
        .catch((res) => {
          console.log(res, '2')
        })
    },
    // 删除文件
    delfilee(index) {
      this.fileList.splice(index, 1)
      this.$message({
        message: '删除成功',
        type: 'success',
      })
    },
    // 取消-关闭对话框
    handlecancel(beiAnForm) {
      this.$emit('handlecancel')
      this.resetDialog()
      // if(beiAnForm){
      if (this.$refs[beiAnForm]) {
        this.$refs[beiAnForm].resetFields()
      }
      // console.log('this.zlrInfo',this.zlrInfo)
      // this.zlrInfo = {}
    },
    // 确定-保存
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const param = {
            roomId: this.beiAnForm.roomId,
            homeownerId: this.beiAnForm.homeownerId,
            homeownerResidentId: this.beiAnForm.homeownerResidentId,
            renterId: this.zlrInfo.residentId,
            population: this.jzrList.length + (this.zlrInfo.name ? 1 : 0),
            homeownerName: this.beiAnForm.homeownerName,
            homeownerPhone: this.beiAnForm.homeownerPhone,
            contactPhone: this.zlrInfo.phone,
            rentStartDate: this.beiAnForm.rentStartDate,
            rentEndDate: this.beiAnForm.rentEndDate,
            rentContract: this.fileList.map((item) => item.ossId).join(','),
            otherResidentInfoList: this.jzrList,
            landlordId: this.beiAnForm.landlordId,
          }
          reportTenement(param).then((res) => {
            if (res.code == 200) {
              this.$message({
                message: res.msg,
                type: 'success',
              })
              this.handlecancel()
            } else {
              this.$message({ message: res.msg, type: 'error' })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重置表单等信息
    resetDialog() {
      this.beiAnForm = {
        houseId: '',
        floor: '',
        roomId: '',
        rentStartDate: '',
        rentEndDate: '',
        landlordId: '', // 房东或二房东id
        homeownerId: '', // 屋主用户id,
        homeownerResidentId: '', // 屋主居民id
        homeownerName: '', // 屋主名称
        homeownerPhone: '', // 屋主电话
      }
      this.zlTimes = [] // 租赁时间
      this.fileList = [] // 文件列表
      this.houseId = null
      this.floors = null
      this.floorList = []
      this.roomList = []
      this.landlords = []
    },
    // 备案
    // 修改租赁时间
    updateRentTime() {
      console.log(this.rentTime)
      let rentStartDate = moment(this.rentTime.time[0]).format('yyyy-MM-DD')
      let rentEndDate = moment(this.rentTime.time[1]).format('yyyy-MM-DD')
      let params = {
        rentInfoId: this.rentInfoId,
        rentStartDate: rentStartDate,
        rentEndDate: rentEndDate,
      }
      updateRentTime(params).then((res) => {
        if (res.code == 200) {
          this.$message({
            message: res.msg,
            type: 'success',
          })
          this.closeChangeTimeDialog()
          this.getDetail(this.rentInfoId)
        } else {
          this.$message({ message: res.msg, type: 'error' })
        }
      })
    },
    // 关闭修改租赁时间弹窗
    closeChangeTimeDialog: function () {
      this.timeDialogVisible = false
      this.rentTime = {
        time: [],
      }
    },
    // 打开修改租赁时间弹窗
    openChangeTimeDialog(rentInfoId) {
      this.timeDialogVisible = true
      this.rentInfoId = rentInfoId
      console.log(rentInfoId)
    },
    // 租赁备案
    handleBeiAn() {
      this.isShowBeiAn = true
    },
    // 关闭备案弹窗
    beianClose() {
      this.isShowBeiAn = false
    },
    // 房租备案
    handlecancel() {
      this.isShowBeiAn = false
      this.zlrInfo = {}
      this.jzrList = []
    },
    /** 租赁人-居民添加 */
    // handleChooseRs1() {
    //   this.jmdialog1 = true;
    // },
    handleChooseRs2() {
      this.jmdialog2 = true
    },
    handleCloseAdd() {
      this.jmdialog1 = false
      this.jmdialog2 = false
    },
    handleAddResident1(e) {
      this.zlrInfo = e
      this.jmdialog1 = false
    },
    delZLR() {
      this.zlrInfo = {}
    },
    handleAddResident2(e) {
      if (!this.jzrList.includes(e)) {
        this.jzrList.push(e)
        this.jmdialog2 = false
      } else {
        this.$message({
          message: '请勿重复添加居民',
          type: 'error',
        })
      }
    },
    delJZR(index) {
      this.jzrList.splice(index, 1)
    },
    // 租赁状态
    getstatus: function () {
      GetStatusCombo().then((res) => {
        console.log(res, '1991')
        this.rentstatus = res.data.data
      })
    },
    // 单行变色
    tableRowClassName: function (rowIndex) {
      if (rowIndex.rowIndex % 2 != 0) {
        return 'evenRow'
      }
      return 'oddRow'
    },
    // 列表
    getlist: function (val) {
      if (this.filters.time && this.filters.time.length > 0) {
        this.filters.rentStartDate = moment(this.filters.time[0]).format(
          'yyyy-MM-DD'
        )
        this.filters.rentEndDate = moment(this.filters.time[1]).format(
          'yyyy-MM-DD'
        )
      } else {
        this.filters.rentStartDate = null
        this.filters.rentEndDate = null
      }
      let para = {
        homeName: this.filters.homeName,
        roomNo: this.filters.roomNo,
        flowStatus: this.filters.flowStatus,
        registered: this.filters.registered,
        contactPhone: this.filters.contactPhone,
        name: this.filters.name,
        rentStartDate: this.filters.rentStartDate,
        rentEndDate: this.filters.rentEndDate,
        pageSize: this.filters.size,
        pageNum: this.filters.current,
      }
      if (val) {
        para.pageNum = val
        this.currentPage1 = val
      }
      HomeRentList(para).then((res) => {
        this.datalist = res.data.rows
        this.total = res.data.total
      })
    },
    // 重置
    resetForm: function (filters) {
      this.$refs.filters.resetFields()
      this.filters = {
        homeName: '',
        roomNo: '',
        flowStatus: '',
        registered: '',
        contactPhone: '',
        name: '',
        time: [],
        rentStartDate: '',
        rentEndDate: '',
        size: 10,
        current: 1,
      }
      this.getlist(1)
    },
    // 分页
    handleSizeChange: function (size) {
      this.pagesize = size
      this.filters.size = size
      this.getlist('')
    },
    // 分页
    handleCurrentChange: function (val) {
      this.filters.current = val
      this.getlist(val)
    },
    // 勾选
    handlegx: function (data) {
      console.log(data, '00101')
      this.multion = []
      for (var i = 0; i < data.length; i++) {
        this.multion.push(data[i].rentInfoId)
      }
    },
    // 导出
    handleexport: function () {
      if (this.multion.length > 0) {
        let url = '/rent/rentInfo/export?ids=' + this.multion.join(',')
        this.comjs.downfile(url)
      } else {
        this.$message({
          message: '至少勾选一条数据',
          type: 'info',
        })
      }
    },
    // 详情
    handleDetail: function (row) {
      this.xqdialog = true
      this.getDetail(row.rentInfoId)
    },
    // 详情
    getDetail: function (id) {
      HomeRentDt(id).then((res) => {
        console.log(res.data, '011')
        this.detailfrom = res.data.data.rentInfoVo
        this.recordlist = res.data.data.rentLogVos
      })
    },
    // 退租-取消
    visibleDelCancel() {
      this.$refs.popover.doClose()
    },
    // 退租-确定
    visibleDelSubmit() {
      const param = {
        rentInfoId: this.detailfrom.rentInfoId,
      }
      BackRent(param).then((res) => {
        if (res.code == 200) {
          this.$message({
            message: res.msg,
            type: 'success',
          })
          this.$refs.popover.doClose()
          this.getlist('')
          this.xqdialog = false
        } else {
          this.$message({
            message: res.msg,
            type: 'error',
          })
        }
      })
    },

    // 租赁记录
    rentrecord: function (row) {
      this.rentdialog = true
      this.rentInfoId = row.rentInfoId
      this.getrent('')
    },
    // 关闭租赁记录
    rentClose: function () {
      this.rentform = {
        registered: '',
        contactPhone: '',
        renterName: '',
        time: [],
        rentStartDate: '',
        rentEndDate: '',
      }
    },
    // 获取租赁列表
    getrent: function (val) {
      if (this.rentform.time && this.rentform.time.length > 0) {
        this.rentform.rentStartDate = moment(this.rentform.time[0]).format(
          'yyyy-MM-DD'
        )
        this.rentform.rentEndDate = moment(this.rentform.time[1]).format(
          'yyyy-MM-DD'
        )
      } else {
        this.rentform.rentStartDate = null
        this.rentform.rentEndDate = null
      }
      let para = {
        rentInfoId: this.rentInfoId,
        registered: this.rentform.registered,
        contactPhone: this.rentform.contactPhone,
        renterName: this.rentform.renterName,
        rentStartDate: this.rentform.rentStartDate,
        rentEndDate: this.rentform.rentEndDate,
      }
      RentRecord(para).then((res) => {
        this.rentlist = res.data.data
      })
    },
    // 重置
    resetForm1: function (rentform) {
      this.$refs.rentform.resetFields()
      this.rentform = {
        registered: '',
        contactPhone: '',
        renterName: '',
        time: [],
        rentStartDate: '',
        rentEndDate: '',
      }
      this.getrent(1)
    },
    // 租赁查看详情
    handlesyqkdet: function (row) {
      this.xqdialog = true
      this.getDetail(row.rentInfoId)
    },
    dialogClose: function () {
      console.log('---关闭详情弹窗---')
      this.detailfrom = {}
      this.recordlist = []
    },
  },
}
</script>

<style scoped>
.tbox {
  display: flex;
  flex-direction: column;
}
.m-bom {
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url('../../assets/img/dialog-bom.png');
  background-size: 100% 100%;
}
.m-bom .m-bom-b {
  width: 120px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #fff;
  background: #fb9e2b;
  border-radius: 2px 2px 2px 2px;
  cursor: pointer;
}

.m-bom-change {
  width: 120px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #fff;
  background: #169bd5;
  border-radius: 2px 2px 2px 2px;
  cursor: pointer;
  margin-right: 20px;
}

/* 租赁备案 */
.rent-btn {
  width: 120px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #35b2fa;
  background: #eafaff;
  border-radius: 2px 2px 2px 2px;
  border: 1px solid #48cff6;
}
.btn {
  width: 80px !important;
}
.search-btnbox {
  display: inline-block;
  /* float: right; */
  float: none !important;
  margin-left: 20px;
}
.add-btnbox {
  float: left;
  margin-right: 10px;
}
.m-search {
  float: none !important;
  display: block !important;
}
</style>
