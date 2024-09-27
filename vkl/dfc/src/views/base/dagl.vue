<template>
  <div class="g-cont">
    <div class="m-contain">
      <div class="m-search">
        <span
          class="btn export-btn"
          @click="handlexport"
          style="margin-right: 0.08rem"
          >导出</span
        >
        <el-form :model="filters" :inline="true" ref="filters">
          <el-form-item label="房屋名称" prop="homeName">
            <el-input
              v-model="filters.homeName"
              placeholder="房屋名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="房间编号" prop="roomNo">
            <el-input
              v-model="filters.roomNo"
              placeholder="房间编号"
            ></el-input>
          </el-form-item>
          <el-form-item label="居住人数" prop="liveNumber">
            <el-input
              v-model="filters.liveNumber"
              placeholder="居住人数"
            ></el-input>
          </el-form-item>
          <el-form-item label="居民姓名" prop="name">
            <el-input v-model="filters.name" placeholder="居民姓名"></el-input>
          </el-form-item>
          <el-form-item label="车牌号" prop="vehicleNo">
            <el-input
              v-model="filters.vehicleNo"
              placeholder="车牌号"
            ></el-input>
          </el-form-item>
          <el-form-item label="面积" prop="area" class="mj">
            <el-input v-model="filters.area" placeholder="最小"></el-input
            >至<el-input
              v-model="filters.areaEnd"
              placeholder="最大"
            ></el-input>
          </el-form-item>
          <el-form-item label="煤气罐数量" prop="gasTank" class="mq">
            <el-input
              v-model="filters.gasTankStart"
              placeholder="最小"
            ></el-input
            >至<el-input
              v-model="filters.gasTankEnd"
              placeholder="最大"
            ></el-input>
          </el-form-item>
          <el-form-item label="租赁状态" prop="rentalStatus">
            <el-select v-model="filters.rentalStatus">
              <el-option
                :value="item.dictValue"
                :label="item.dictLabel"
                :key="index"
                v-for="(item, index) in rentstatus"
              ></el-option>
            </el-select>
          </el-form-item>
          <div class="search-btnbox">
            <span class="btn search-btn" @click="getlist(1)">查询</span>
            <span class="btn reset-btn" @click="resetForm('filters')"
              >重置</span
            >
          </div>
        </el-form>
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
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="照片" prop="">
            <template slot-scope="scope">
              <img
                :src="scope.row.roomImgUrl"
                class="news-img"
                v-if="scope.row.roomImg != null && scope.row.roomImg != ''"
                @click="previewFile(scope.row.roomImgUrl, 'image')"
              />
              <img
                src="../../assets/img/empty1.png"
                class="news-img"
                v-else=""
              />
            </template>
          </el-table-column>
          <el-table-column
            label="房屋名称"
            prop="homeName"
            :show-overflow-tooltip="true"
          >
          </el-table-column>

          <el-table-column label="楼层" prop="floors"> </el-table-column>
          <el-table-column label="房间编号" prop="roomNo"> </el-table-column>
          <el-table-column label="屋主" prop="homeOwner"> </el-table-column>
          <el-table-column label="联系方式" prop="phone"> </el-table-column>
          <el-table-column
            label="租赁状态"
            prop="rentalStatus"
            :formatter="rentformat"
          >
          </el-table-column>
          <el-table-column label="居住人数" prop="">
            <template slot-scope="scope">
              <div
                class="f-green"
                style="text-align: center; width: 80px"
                @click="handleuser(scope.row)"
              >
                {{ scope.row.liveNumber }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="车辆数量" prop="">
            <template slot-scope="scope">
              <div
                class="f-blue"
                style="text-align: center; width: 80px"
                @click="handlecar(scope.row)"
              >
                {{ scope.row.vehicleNumber }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="面积" prop="area"> </el-table-column>
          <el-table-column label="煤气罐数量" prop="gasTank">
            <template slot-scope="scope">
              <div
                class="f-blue"
                style="text-align: center; width: 80px"
                @click="handleGastank(scope.row)"
              >
                {{ scope.row.gasTank }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="">
            <template slot-scope="scope">
              <span class="detail-title" @click="handleDetail(scope.row)"
                >详情</span
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
    <!-- 居住人员列表 -->
    <el-dialog
      :visible.sync="jmdialog"
      v-if="jmdialog"
      class="g-dialog"
      title="居住人员列表"
    >
      <div class="jmbox">
        <div class="m-table" style="padding: 0.16667rem">
          <el-table
            :data="jmlist"
            highlight-current-row
            v-loading="listLoading"
            style="width: 100%"
            border
            :row-class-name="tableRowClassName"
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }"
          >
            <el-table-column label="姓名" prop="name"> </el-table-column>
            <el-table-column label="联系方式" prop="phone"> </el-table-column>
            <el-table-column label="性别" prop="">
              <template slot-scope="scope">
                <span v-if="scope.row.sex == '0'">男</span>
                <span v-else-if="scope.row.sex == '1'">女</span>
                <span v-else="">/</span>
              </template>
            </el-table-column>
            <el-table-column label="是否外来人员" prop="">
              <template slot-scope="scope">
                <span v-if="scope.row.outsider == '0'">是</span>
                <span v-else-if="scope.row.outsider == '1'">否</span>
                <span v-else="">/</span>
              </template>
            </el-table-column>
            <el-table-column label="户籍" prop="registered"> </el-table-column>
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
            <el-table-column label="操作" prop="">
              <template slot-scope="scope">
                <span class="detail-title" @click="handlejmdetail(scope.row)"
                  >详情</span
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
    <!-- 居民详情 -->
    <el-dialog
      :visible.sync="jmxqdialog"
      v-if="jmxqdialog"
      class="g-dialog"
      title="居民信息详情"
    >
      <span class="tip">基础信息</span>
      <div class="xq-content">
        <div class="xq-lst" style="width: 100%">
          <span class="name">照片</span>
          <img :src="jmform.residentAvatarFile" class="jmzp" />
        </div>
        <div class="xq-lst">
          <span class="name">姓名</span>
          <span class="lab">{{ jmform.name }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">性别</span>
          <span class="lab" v-if="jmform.sex == '0'">男</span>
          <span class="lab" v-else-if="jmform.sex == '1'">女</span>
          <span class="lab" v-else-if="jmform.sex == '2'">未知</span>
        </div>
        <div class="xq-lst">
          <span class="name">身份证号</span>
          <span class="lab">{{ jmform.idCard }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">居住房屋</span>
          <span class="lab">{{ jmform.room }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">是否户主</span>
          <span class="lab" v-if="jmform.houseHolder == '0'">是</span>
          <span class="lab" v-else-if="jmform.houseHolder == '1'">否</span>
          <span class="lab" v-else="">/</span>
        </div>
        <div class="xq-lst">
          <span class="name">户主姓名</span>
          <span class="lab">{{ jmform.residentName }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">与户主关系</span>
          <span class="lab">{{ jmform.relationship }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">民族</span>
          <span class="lab">{{ jmform.nation }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">政治面貌</span>
          <span class="lab">{{ jmform.politicsFace }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">婚姻状况</span>
          <span class="lab">{{ jmform.marriage }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">文化程度</span>
          <span class="lab">{{ jmform.education }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">健康状况</span>
          <span class="lab">{{ jmform.health }}</span>
        </div>
        <div class="xq-lst" style="width: 100%">
          <span class="name">户口所在地</span>
          <span class="lab">{{ jmform.registered }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">联系方式</span>
          <span class="lab">{{ jmform.phone }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">工作单位</span>
          <span class="lab">{{ jmform.workUnit }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">获得荣誉</span>
          <span class="lab">{{ jmform.honor }}</span>
        </div>
        <div class="xq-lst" style="width: 100%">
          <span class="name">是否外来人员</span>
          <span class="lab" v-if="jmform.outsider == '0'">是</span>
          <span class="lab" v-else-if="jmform.outsider == '1'">否</span>
          <span class="lab" v-else="">/</span>
        </div>
        <div class="xq-lst">
          <span class="name">人员标签</span>
          <ul class="lab-ul">
            <li
              class="lab-lst"
              v-for="(item, index) in lablist"
              :style="{ color: item.color, borderColor: item.color }"
            >
              {{ item.name }}
            </li>
          </ul>
        </div>
      </div>
    </el-dialog>
    <!-- 车辆列表 -->
    <el-dialog
      :visible.sync="cardialog"
      v-if="cardialog"
      class="g-dialog"
      title="车辆列表"
    >
      <div class="jmbox">
        <div class="m-table" style="padding: 0.16667rem">
          <el-table
            :data="carlist"
            highlight-current-row
            v-loading="listLoading"
            style="width: 100%"
            border
            :row-class-name="tableRowClassName"
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }"
          >
            <el-table-column label="车牌号" prop="vehicleNo"> </el-table-column>
            <el-table-column label="车辆类型" prop="typeName">
            </el-table-column>
            <el-table-column label="车辆信息" prop="">
              <template slot-scope="scope">
                <span class="detail-title" @click="handlecardetail(scope.row)"
                  >查看</span
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
    <!-- 车辆详情 -->
    <el-dialog
      :visible.sync="carxqdialog"
      v-if="carxqdialog"
      class="g-dialog min-dia642"
      title="车辆详情"
    >
      <span class="tip">基础信息</span>
      <div class="xq-content car-detail">
        <div class="xq-lst">
          <span class="name">车辆所有人</span>
          <span class="lab">{{ detailform.vehicleOwner }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">车辆所属房屋</span>
          <span class="lab">{{ detailform.vehicleHouse }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">车牌号</span>
          <span class="lab">{{ detailform.vehicleNo }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">车辆类型</span>
          <span class="lab">{{ detailform.typeName }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">照片</span>
          <img :src="detailform.vehicleImgFile" class="carimg" />
        </div>
      </div>
    </el-dialog>
    <!-- 档案详情 -->
    <el-dialog
      :visible.sync="xqdialog"
      v-if="xqdialog"
      class="g-dialog"
      title="档案详情"
    >
      <div class="addbox">
        <div class="lt">
          <div class="gj-box">
            <div class="gj-lst" style="width: 50%">
              <img src="../../assets/img/id.png" class="img" />
              <span class="num">{{ roomform.houseId }}</span>
              <span class="type">ID</span>
            </div>
            <div class="gj-lst" style="width: 50%">
              <img src="../../assets/img/sj.png" class="img" />
              <span class="num">{{ roomform.createTime }}</span>
              <span class="type">发起时间</span>
            </div>
          </div>
          <div class="xq-content car-detail">
            <div class="xq-lst">
              <span class="name">房屋名称</span>
              <span class="lab">{{ roomform.homeName }}</span>
            </div>
            <div class="xq-lst">
              <span class="name">楼层</span>
              <span class="lab">{{ roomform.floors }}</span>
            </div>
            <div class="xq-lst">
              <span class="name">房间编号</span>
              <span class="lab">{{ roomform.roomNo }}</span>
            </div>
            <div class="xq-lst">
              <span class="name">照片</span>
              <img :src="roomform.roomImgUrl" class="carimg" />
            </div>
            <div class="xq-lst">
              <span class="name">煤气罐</span>
              <div class="m-table" style="width: 200px;margin: 20px;"  >
              <template>
    <el-table
          :data="roomform.gasTankVoList"
      style="width: 160px">
      <el-table-column
        prop="brand"
        label="品牌"
        width="80">
      </el-table-column>
      <el-table-column
        prop="number"
        label="数量"
        width="80">
      </el-table-column>
    </el-table>
  </template>
</div>
            </div>
            <div class="xq-lst">
              <span class="name">房屋面积</span>
              <span class="lab">{{ roomform.area }}</span>
            </div>
            <div class="xq-lst">
              <span class="name">是否出租</span>
              <span class="lab" v-if="roomform.leaseStatus == '0'">是</span>
              <span class="lab" v-else-if="roomform.leaseStatus == '1'"
                >否</span
              >
              <span class="lab" v-else="">/</span>
            </div>
            <div class="xq-lst">
              <span class="name">屋主</span>
              <span class="lab">{{ roomform.homeOwner }}</span>
            </div>
            <div class="xq-lst">
              <span class="name">居住人员</span>
              <div
                class="choose-box"
                v-if="roomform.listVos && roomform.listVos.length > 0"
                style="width: 52%; margin-left: 0.083rem"
              >
                <div
                  class="choose-lst"
                  v-for="(item, index) in roomform.listVos"
                >
                  <span class="choose-name">{{ item.name }}</span>
                  <span class="choose-id">&nbsp;&nbsp;{{ item.idCard }}</span>
                </div>
              </div>
              <span class="lab f-red" v-else="">暂无数据</span>
            </div>
            <div class="xq-lst">
              <span class="name">车辆</span>
              <ul class="file-ul" v-if="vehiclelist && vehiclelist.length > 0">
                <li class="file-li" v-for="(item, index) in vehiclelist">
                  {{ item }}
                </li>
              </ul>
              <span class="lab f-red" v-else="">暂无数据</span>
            </div>
            <div class="xq-lst">
              <span class="name">备注</span>
              <span class="lab">{{ roomform.remark }}</span>
            </div>
            <div class="xq-lst">
              <span class="name">附件</span>
              <ul class="file-ul" v-if="filelist && filelist.length > 0">
                <li class="file-li" v-for="(item, index) in filelist">
                  <img src="../../assets/img/file.png" class="fileimg" />{{
                    item.name
                  }}
                </li>
              </ul>
              <span class="lab f-red" v-else="">暂无数据</span>
            </div>
          </div>
        </div>
        <div class="editbox">
          <span class="edit-tip">房屋日志</span>
          <ul class="record-box">
            <li class="record-lst" v-for="(item, index) in loglist">
              <i class="line"></i>
              <span class="dot"></span>
              <div class="rec-rt" v-if="item.operType == '1'">
                <span class="button">新增</span>
                <div class="inf">
                  <img :src="item.avatarUrl" class="avater" />{{
                    item.createBy
                  }}
                </div>
                <span class="bbh">{{ item.createTime }}</span>
              </div>
              <div class="rec-rt" v-if="item.operType == '2'">
                <span class="button">修改</span>
                <div class="inf">
                  <img :src="item.avatarUrl" class="avater" />{{
                    item.createBy
                  }}
                </div>
                <span class="bbh">{{ item.updateTime }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </el-dialog>
    <!-- 煤气罐详情 -->
    <el-dialog
      :visible.sync="gastankDialog"
      v-if="gastankDialog"
      class="g-dialog"
      title="煤气罐"
      @close="gastankClosed"
    >
      <div class="jmbox">
        <div class="addbtnbox">
          <span class="btn search-btn addbtn" @click="addNewinGastank()"
            >添加</span
          >
        </div>
        <div class="m-table" style="padding: 0.16667rem">
          <el-table
            :data="gastankDetail"
            highlight-current-row
            v-loading="listLoading"
            style="width: 100%"
            border
            :row-class-name="tableRowClassName"
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }"
          >
            <el-table-column label="品牌" prop="brand">
              <template slot-scope="scope">
                <span
                  >{{ scope.$index === editIndex ? "" : scope.row.brand }}
                </span>
                <el-input
                  style="width: 180px"
                  v-if="scope.$index === editIndex && editFlag"
                  v-model="gastankEditBrand"
                >
                </el-input>
                <el-input
                  style="width: 180px"
                  v-if="gastankDetail.length - 1 == scope.$index && flag"
                  v-model="gastankAddForm.brand"
                  placeholder="请输入品牌"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="数量" prop="number">
              <template slot-scope="scope">
                <span
                  >{{ scope.$index === editIndex ? "" : scope.row.number }}
                </span>
                <el-input type="number" min="0"
                  style="width: 180px"
                  v-if="scope.$index === editIndex && editFlag"
                  v-model="gastankEditNumber"
                >
                </el-input>
                <el-input type="number"
                  style="width: 180px" 
                  v-if="gastankDetail.length - 1 == scope.$index && flag"
                  v-model="gastankAddForm.number"
                  placeholder="请输入数量"
                ></el-input>
              </template>
            </el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <span
                  class="detail-title"
                  v-if="gastankDetail.length - scope.$index != 1 || !flag"
                  @click="
                    editFlag
                      ? saveEdit(scope.row, scope.$index)
                      : editGastank(scope.row, scope.$index)
                  "
                >
                  {{ editFlag && scope.$index === editIndex ? "保存" : "编辑" }}
                  &nbsp;&nbsp;</span
                >
                <span
                  class="detail-title"
                  v-if="gastankDetail.length - scope.$index != 1 || !flag"
                  @click="deleteGastank(scope.row)"
                  >删除</span
                >
                <span
                  class="detail-title"
                  v-if="gastankDetail.length - scope.$index == 1 && flag"
                  @click="addGastank(scope.row)"
                  >保存&nbsp;&nbsp;</span
                >
                <span
                  class="detail-title"
                  v-if="gastankDetail.length - scope.$index == 1 && flag"
                  @click="resetGastankAddForm(scope.row)"
                  >重置</span
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import qs from "qs";
import {
  FileList,
  DictType,
  RentUser,
  ResidentfindById,
  RentRoomCar,
  VehiclefindById,
  RoomfindById,
  gastankDetail,
  AddGastank,
  DelGastank,
  EditGastank,
} from "../../api/api.js";
export default {
  data() {
    return {
      gastankEditBrand: "",
      gastankEditNumber:'',
      flag: false,
      editFlag: false,
      editIndex: "",
      rentstatus: [],
      filters: {
        homeName: "",
        roomNo: "",
        liveNumber: "",
        name: "",
        vehicleNo: "",
        area: "",
        areaEnd: "",
        gasTankStart: "",
        gasTankEnd: "",
        rentalStatus: "",
        size: 10,
        current: 1,
      },
      gastankAddForm: {
        brand: "",
        number: "",
      },
      multion: [],
      datalist: [],
      listLoading: false,
      total: 0,
      currentPage: 1,
      currentPage1: 1,
      pagesize: 10,
      jmdialog: false,
      jmlist: [],
      jmxqdialog: false,
      jmform: {},
      lablist: [],
      gastankDialog: false,
      cardialog: false,
      carlist: [],
      carxqdialog: false,
      detailform: {},

      xqdialog: false,
      roomform: {},
      loglist: [],
      vehiclelist: [],
      filelist: [],
      gastankDetail: [],
      choiceRoom: "",
    };
  },
  mounted() {
    this.getlist("");
    this.getdict("rental_status");
    // this.addNewRow();
  },
  methods: {
    // 字典
    getdict: function (val) {
      DictType(val).then((res) => {
        let data = res.data.data;
        console.log(data, "100101");
        this.rentstatus = res.data.data;
      });
    },
    // 转换
    rentformat: function (row, column) {
      for (var i = 0; i < this.rentstatus.length; i++) {
        if (row.rentalStatus == this.rentstatus[i].dictValue) {
          return this.rentstatus[i].dictLabel;
        }
      }
    },
    // 单行变色
    tableRowClassName: function (rowIndex) {
      if (rowIndex.rowIndex % 2 != 0) {
        return "evenRow";
      }
      return "oddRow";
    },
    // 列表
    getlist: function (val) {
      let para = {
        homeName: this.filters.homeName,
        roomNo: this.filters.roomNo,
        liveNumber: this.filters.liveNumber,
        name: this.filters.name,
        vehicleNo: this.filters.vehicleNo,
        area: this.filters.area,
        areaEnd: this.filters.areaEnd,
        gasTankStart: this.filters.gasTankStart,
        gasTankEnd: this.filters.gasTankEnd,
        rentalStatus: this.filters.rentalStatus,
        pageSize: this.filters.size,
        pageNum: this.filters.current,
      };
      if (val) {
        para.pageNum = val;
        this.currentPage1 = val;
      }
      FileList(qs.stringify(para)).then((res) => {
        // console.log('档案管理信息列表：',JSON.parse(JSON.stringify(res)))
        this.datalist = res.rows;
        this.total = res.total;
        // if (res.rows[0].gasTank == null) {
        //   console.log(res.rows[0].gasTank);
        // }
      });
    },
    // 重置
    resetForm: function (filters) {
      this.$refs.filters.resetFields();
      this.filters = {
        homeName: "",
        roomNo: "",
        liveNumber: "",
        name: "",
        vehicleNo: "",
        area: "",
        areaEnd: "",
        gasTankStart: "",
        gasTankEnd: "",
        rentalStatus: "",
        size: 10,
        current: 1,
      };
      this.getlist(1);
    },
    // 分页
    handleSizeChange: function (size) {
      this.pagesize = size;
      this.filters.size = size;
      this.getlist("");
    },
    // 分页
    handleCurrentChange: function (val) {
      this.filters.current = val;
      this.getlist(val);
    },

    // 勾选
    handlegx: function (data) {
      console.log(data, "00101");
      this.multion = [];
      for (var i = 0; i < data.length; i++) {
        this.multion.push(data[i].roomId);
      }
    },
    // 导出
    handlexport: function () {
      if (this.multion.length > 0) {
        let url = "/basic/room/fileListExport/" + this.multion.join(",");
        this.comjs.downfile(url);
      } else {
        this.$message({
          message: "至少勾选一条数据",
          type: "info",
        });
      }
    },
    // 居住人员
    handleuser: function (row) {
      this.jmdialog = true;
      this.getuser(row.roomId);
    },
    // 居住人员列表
    getuser: function (para) {
      RentUser(para).then((res) => {
        console.log(res, "列表");
        this.jmlist = res.data.data;
      });
    },
    // 查看居民详情
    handlejmdetail: function (row) {
      this.jmxqdialog = true;
      this.getjmxq(row.residentId);
    },
    getjmxq: function (id) {
      ResidentfindById(id).then((res) => {
        this.jmform = res.data.data;
        this.lablist = res.data.data.tags;
      });
    },
    // 车辆数量
    handlecar: function (row) {
      this.cardialog = true;
      this.getcar(row.roomId);
    },
    // 车辆数量列表
    getcar: function (para) {
      RentRoomCar(para).then((res) => {
        console.log(res, "cel");
        this.carlist = res.data.data;
      });
    },
    // 查看车辆详情
    handlecardetail: function (row) {
      this.carxqdialog = true;
      this.getxqcar(row.vehicleId);
    },
    // 车辆详情
    getxqcar: function (id) {
      VehiclefindById(id).then((res) => {
        this.detailform = {};
        this.detailform = res.data.data;
        if (
          this.detailform.vehicleImgFile == "" ||
          this.detailform.vehicleImgFile == null
        ) {
          this.detailform.vehicleImgFile = require("@/assets/img/empty.png");
        } else {
        }
      });
    },
    addNewinGastank() {
      this.gastankDetail.push({
        brand: "", // 新行品牌为空
        number: "", // 新行数量为空
      });
      this.gastankDetail.length + 1;
      this.flag = true;
    },
    // 煤气罐编辑
    handleGastank: function (row) {
      this.gastankDialog = true;
      // let isPush = true;
      this.getGastankDetail(row.roomId);
      this.choiceRoom = row.roomId;
    },
    // 获取煤气罐详情
    getGastankDetail: function (id) {
      gastankDetail(id).then((res) => {
        this.gastankDetail = res.data.data;
      });
    },
    // 添加煤气罐
    addGastank: function (row) {
      let para = {
        roomId: this.choiceRoom,
        brand: this.gastankAddForm.brand,
        number: this.gastankAddForm.number,
      };
      console.log(para);
      AddGastank(para).then((res) => {
        this.resetGastankAddForm();
        this.getGastankDetail(this.choiceRoom);
        this.flag = false;
        this.$message({
								message:'添加成功',
								type:'success'
							})
      });
    },
    deleteGastank: function (row) {
      DelGastank(row.gasTankId).then((res) => {
        this.getGastankDetail(this.choiceRoom);
        this.$message({
								message:'删除成功',
								type:'success'
							})
      });
      this.editFlag = false;
      this.editIndex = "";
    },
    // 重置添加
    resetGastankAddForm() {
      this.gastankAddForm = {
        brand: "",
        number: "",
      };
    },
    // 编辑煤气罐
    editGastank(row, index) {
      this.editFlag = true;
      this.editIndex = index;
      this.gastankEditNumber = row.number
      this.gastankEditBrand = row.brand
    },
    saveEdit(row, index) {
      let para = {
        roomId: row.roomId,
        gasTankId: row.gasTankId,
        number: this.gastankEditNumber == '' ? row.number:this.gastankEditNumber,
        brand:this.gastankEditBrand == '' ? row.brand:this.gastankEditBrand
      };
      EditGastank(para).then((res) => {
        this.$message({
								message:'编辑成功',
								type:'success'
							})
        this.gastankEditNumber = ""
        this.gastankEditBrand = ""
        this.getGastankDetail(this.choiceRoom);
      });
      this.editFlag = false;
      this.editIndex = "";
    },
    // 煤气罐弹窗关闭
    gastankClosed() {
      this.gastankDetail = [];
      this.flag = false;
      this.editFlag = false;
      this.editIndex = "";
      this.getlist(1);
    },

    // 弹窗关闭
    handlecancel: function (type) {},

    // 查看
    handleDetail: function (row) {
      this.xqdialog = true;
      this.getDetail(row.roomId);
    },
    // 详情
    getDetail: function (id) {
      RoomfindById(id).then((res) => {
        console.log("居民信息详情：", JSON.parse(JSON.stringify(res)));
        this.roomform = res.data.data;
        this.loglist = res.data.data.logList;
        // 车辆
        this.vehicleName = res.data.data.vehicleName;
        this.vehiclelist = []
        if ( this.vehicleName != null) {
          
          this.vehiclelist =  this.vehicleName.split(",");
          console.log(this.vehiclelist, "this.vehiclelistthis.vehiclelist");
        }
        // 附件
        this.filelist = [];
        let roomFile = res.data.data.roomFileName; //文件名
        if (roomFile != "" && roomFile != null && roomFile.length > 0) {
          let roomFile1 = roomFile.split(",");
          let roomFileurl = res.data.data.roomFileUrl.split(","); //url
          let roomFileid = res.data.data.roomFile.split(","); //id
          for (var i = 0; i < roomFile1.length; i++) {
            this.filelist.push({
              name: roomFile1[i],
              ossId: roomFileid[i],
              url: roomFileurl[i],
            });
          }
        }
      });
    },
    // 预览
    previewFile: function (url, type) {
      if (type === "image") {
        // 图片预览
        this.$alert(
          `<img src="${url}" style='max-width:100%; mac-height:100%;' >`,
          "图片预览",
          {
            dangerouslyUseHTMLString: true,
            customClass: "image-perview-dialog",
          }
        ).catch(() => {}); // 添加错误捕获
      }
    },
  },
};
</script>

<style>
.addbtnbox {
  width: 100%;
  height: 40px;
  /* background-color: black; */
}
.addbtn {
  float: right !important;
  margin-right: 50px;
  margin-top: 10px;
  background-color: #00beb8;
}
</style>