<template>
  <div class="g-cont">
    <div class="top-count">
      <div
        class="count-card"
        v-for="item in roadList"
        :key="item.belongToGroup"
      >
        <div class="card-left">{{ item.belongToGroup }}</div>
        <div class="card-right">
          <span
            >总长度：<span class="num-style">{{ item.roadLength }}m</span></span
          >
          <span
            ><span style="opacity: 0">面</span>面积：<span class="num-style"
              >{{ item.roadArea }}m²</span
            ></span
          >
        </div>
      </div>
    </div>
    <div class="m-contain">
      <span class="btn add-btn" @click="handleAdd">新增</span>
      <span class="btn down-btn" @click="downlayout">下载导入模版</span>
      <span class="btn import-btn">
        <input
          type="file"
          ref="filebox"
          name="file"
          class="fileipt"
          @click="handleimport($event, '0')"
        />导入
      </span>
      <span class="btn export-btn" @click="handlexport">导出</span>
      <div class="m-search">
        <el-form :model="filters" :inline="true" ref="filters">
          <el-form-item label="所属队组" prop="belongToGroup">
            <el-select v-model="filters.belongToGroup" placeholder="队组">
              <el-option
                v-for="item in groups"
                :value="item"
                :label="item"
                :key="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="道路名称">
            <el-input
              v-model="filters.riverName"
              placeholder="道路名称"
            ></el-input>
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
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="80"> </el-table-column>
          <el-table-column label="序号" prop="sort"> </el-table-column>
          <el-table-column label="道路名称" prop="riverName"> </el-table-column>
          <!-- <el-table-column label="管理等级" prop="managerLevel">
            <template slot-scope="scope">
              <span v-if="scope.row.managerLevel == '0'">村级</span>
            </template>
          </el-table-column> -->
          <!-- <el-table-column label="所属村" prop="belongTo"> </el-table-column> -->
          <el-table-column label="道路长度(M)" prop="riverLength">
          </el-table-column>
          <!-- <el-table-column label="路长" prop="riverManager"> </el-table-column> -->
          <el-table-column label="道路宽度(M)" prop="roadWidth">
          </el-table-column>
          <el-table-column label="道路面积(M²)" prop="roadArea">
          </el-table-column>
          <el-table-column label="所属队组" prop="belongToGroup">
          </el-table-column>
          <el-table-column label="起止点" width="300">
            <template slot-scope="scope">
              <span class="two-line">{{ scope.row.startPoints }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="备注"
            prop="remarks"
          >
            <template slot-scope="scope">
              <span  class="two-line">{{ scope.row.remarks }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="" width="160">
            <template slot-scope="scope">
              <span class="edit-title" @click="handlEdit(scope.row)"
                >编辑&nbsp;&nbsp;</span
              >
              <span class="detail-title" @click="handlDetil(scope.row)"
                >详情&nbsp;&nbsp;</span
              >
              <el-popover
                :ref="scope.row.riverId"
                placement="top"
                width="160"
                popper-class="popover"
              >
                <p class="del-tip">是否删除该道路信息？</p>
                <div class="pop-btnbox">
                  <span
                    class="cancel-btn"
                    @click="visibleDelCancel(scope.row.riverId)"
                    >取消</span
                  >
                  <span class="ok-btn" @click="visibleDelSubmit(scope.row)"
                    >确定</span
                  >
                </div>
                <span slot="reference" class="del-title">删除</span>
              </el-popover>
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
    <!-- 新增、编辑 -->
    <el-dialog
      :visible.sync="adddialog"
      v-if="adddialog"
      class="g-dialog"
      :title="diatitle"
    >
      <span class="tip">基础信息</span>
      <el-form
        :model="addForm"
        :inline="true"
        ref="addForm"
        :rules="addFormRules"
        class="addform"
      >
        <!-- <el-form-item label="道路编码" prop="riverCode">
          <el-input
            v-model="addForm.riverCode"
            placeholder="请输入道路编码"
          ></el-input>
        </el-form-item> -->
        <el-form-item label="序号" prop="sort">
          <el-input
            type="number"
            v-model="addForm.sort"
            placeholder="请输入序号"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="道路名称"
          prop="riverName"
          style="position: relative"
        >
          <el-input
            v-model="addForm.riverName"
            placeholder="请输入道路名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="道路长度(M)" prop="riverLength">
          <el-input
            v-model="addForm.riverLength"
            placeholder="请输入道路长度"
          ></el-input>
        </el-form-item>
        <el-form-item label="道路宽度(M)" prop="roadWidth">
          <el-input
            v-model="addForm.roadWidth"
            placeholder="请输入道路宽度"
          ></el-input>
        </el-form-item>
        <el-form-item label="道路面积(M²)" prop="roadArea">
          <el-input
            v-model="addForm.roadArea"
            placeholder="请输入道路面积"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="管理等级" prop="managerLevel">
          <el-select v-model="addForm.managerLevel">
            <el-option label="村级" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属村" prop="belongTo">
          <el-input
            v-model="addForm.belongTo"
            placeholder="请输入所属村"
          ></el-input>
        </el-form-item> -->
        <el-form-item label="所属队组" prop="belongToGroup">
          <el-select v-model="addForm.belongToGroup">
            <el-option
              v-for="(item, index) in groups"
              :label="item"
              :value="item"
              :key="item + index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="起止点" prop="startPoints">
          <el-input
            v-model="addForm.startPoints"
            placeholder="请输入起止点"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="路长" prop="riverManager">
          <el-input
            v-model="addForm.riverManager"
            placeholder="请输入路长"
          ></el-input>
        </el-form-item>
        <el-form-item label="养护单位" prop="maintain">
          <el-input
            v-model="addForm.maintain"
            placeholder="请输入养护单位"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="connactUser">
          <el-input
            v-model="addForm.connactUser"
            placeholder="请输入联系人"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="connactMobile">
          <el-input
            v-model="addForm.connactMobile"
            placeholder="请输入联系电话"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="图片"
          prop="name"
          style="width: 100%"
          :key="formItemKey"
        >
          <div
            class="upimgbox"
            :style="{ backgroundImage: 'url(' + addForm.photoFileUrls + ')' }"
          >
            <input
              ref="file"
              type="file"
              class="file"
              @change="choosefile($event, '0')"
            />
            <img
              src="../../assets/img/shanchu.png"
              class="shanchu-img"
              v-show="imgShow"
              @click="delfilee"
            />
          </div>
        </el-form-item> -->
        <el-form-item label="备注" prop="remarks">
          <el-input
            type="textarea"
            v-model="addForm.remarks"
            placeholder="请输入备注"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="经纬度" prop="longitudeAndLatitude">
          <button
            style="
              background: #169bd5;
              border: 0;
              border-radius: 2px;
              height: 20px;
              color: #ffffff;
            "
            @click="Longitude"
          >
            地图绘制
          </button>
        </el-form-item> -->
      </el-form>
      <div class="dialog-foot">
        <span class="btn-cancel" @click="handlecancel">取消</span>
        <span class="btn-save" @click="handleSubmit">保存</span>
      </div>
    </el-dialog>
    <!-- 详情 -->
    <el-dialog
      :visible.sync="xqdialog"
      v-if="xqdialog"
      class="g-dialog"
      title="道路详情"
    >
      <span class="tip">基础信息</span>
      <div class="xq-content">
        <div class="xq-lst">
          <span class="name">序号</span>
          <span class="lab">{{ detailform.sort }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">道路名称</span>
          <span class="lab">{{ detailform.riverName }}</span>
        </div>
        <!-- <div class="xq-lst">
          <span class="name">管理等级</span>
          <span class="lab" v-if="detailform.managerLevel == '0'">村级</span>
        </div> -->
        <!-- <div class="xq-lst">
          <span class="name">所属村</span>
          <span class="lab">{{ detailform.belongTo }}</span>
        </div> -->
        <div class="xq-lst">
          <span class="name">道路长度</span>
          <span class="lab">{{ detailform.riverLength }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">道路宽度</span>
          <span class="lab">{{ detailform.roadWidth }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">道路面积</span>
          <span class="lab">{{ detailform.roadArea }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">所属队组</span>
          <span class="lab">{{ detailform.belongToGroup }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">起止点</span>
          <span class="lab">{{ detailform.startPoints }}</span>
        </div>
        <!-- <div class="xq-lst">
          <span class="name">路长</span>
          <span class="lab">{{ detailform.riverManager }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">养护单位</span>
          <span class="lab">{{ detailform.maintain }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">联系人</span>
          <span class="lab">{{ detailform.connactUser }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">联系电话</span>
          <span class="lab">{{ detailform.connactMobile }}</span>
        </div>
        <div class="xq-lst" style="width: 100%">
          <span class="name">照片</span>
          <img :src="detailform.photoFileUrls" class="jmzp" />
        </div>
        <div class="xq-lst" style="width: 100%">
          <span class="name">照片</span>
          <img :src="detailform.photoFileUrls" class="jmzp" />
        </div> -->
        <div class="xq-lst">
          <span class="name">备注1</span>
          <span class="lab" style="white-space: pre-wrap;overflow: hidden;">{{ detailform.remarks }}</span>
        </div>
        <!-- <div class="xq-lst" style="width: 100%">
          <span class="name">经纬度</span>
          <div
            class="jwd-content"
            style="width: 600px; height: 400px; margin-left: 200px"
            v-if="detailform.longitudeAndLatitude"
          >
            <baidu-map
              style="height: 100%"
              :center="mapCenter1"
              :zoom="mapZoom1"
              :scroll-wheel-zoom="true"
              ak="baidu-ak"
              @ready="handlerBMap1"
            >
            </baidu-map>
          </div>
        </div> -->
      </div>
    </el-dialog>
    <!-- 经纬度选择 -->
    <el-dialog
      :visible.sync="jxddialog"
      v-if="jxddialog"
      class="g-dialog"
      title="经纬度选择"
      @close="dtclose"
    >
      <span class="tip"
        >范围：请在下方使用鼠标点击点击画出对应河道，完成选择后点击保存</span
      >
      <!-- <div>范围：请在下方使用鼠标点击点击画出对应河道，完成选择后点击保存</div> -->
      <div class="jwd-content">
        <baidu-map
          style="height: 100%"
          :center="mapCenter"
          :zoom="mapZoom"
          :scroll-wheel-zoom="true"
          ak="baidu-ak"
          @ready="handlerBMap"
        >
        </baidu-map>
      </div>
      <div class="dialog-foot">
        <span class="btn-cancel" @click="dtclose">取消</span>
        <span class="btn-save" @click="dtsubmit">保存</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  RiverList,
  AddRiver,
  UpdateRiver,
  DelRiver,
  RiverfindById,
  RoadBasicCount,
  VillageGroups,
} from "../../api/api.js";
import BaiduMap from "vue-baidu-map/components/map/Map.vue";
import axios from "axios";
export default {
  components: {
    BaiduMap,
  },
  data() {
    return {
      groups: [],
      roadList: [],
      filters: {
        belongToGroup: "",
        riverName: "",
        roadType: "1",
        size: 10,
        current: 1,
      },
      datalist: [],
      listLoading: false,
      total: 0,
      currentPage: 1,
      currentPage1: 1,
      pagesize: 10,
      adddialog: false,
      diatitle: "",
      addForm: {},
      addFormRules: {
        sort: [
          { required: true, message: "请输入序号", trigger: "blur" },
        ],
        riverName: [
          { required: true, message: "请输入道路名称", trigger: "blur" },
        ],
        belongToGroup: [
          { required: true, message: "请输入所属队组", trigger: "blur" },
        ],
      },
      // addForm: {
      //   riverId: "", //河道id
      //   riverCode: "", //水体编码
      //   riverName: "", //水体名称
      //   managerLevel: "", //管理等级
      //   riverType: "", //水体分类
      //   belongTo: "", //所属村
      //   riverManager: "", //河长
      //   riverLength: "", //河道长度
      //   roadWidth: "", //河道宽度
      //   roadArea: "", //河道面积
      //   startPoints: "", //起止点
      //   remarks: "", //备注
      //   maintain: "", //养护单位
      //   connactUser: "", //联系人
      //   connactMobile: "", //联系电话
      //   workTarget: "", //工作目标
      //   photoFiles: "", //图片id
      //   photoFileUrls: "", //图片
      //   roadType: "1",
      //   longitudeAndLatitude: "", //经纬度
      // },
      // addFormRules: {
      //   riverCode: [
      //     { required: true, message: "请输入道路编码", trigger: "blur" },
      //   ],
      //   riverName: [
      //     { required: true, message: "请输入道路名称", trigger: "blur" },
      //   ],
      //   riverType: [
      //     { required: true, message: "请选择道路分类", trigger: "blur" },
      //   ],
      //   managerLevel: [
      //     { required: true, message: "请选择管理等级", trigger: "blur" },
      //   ],
      //   belongTo: [
      //     { required: true, message: "请输入所属村", trigger: "blur" },
      //   ],
      //   belongToGroup: [
      //     { required: true, message: "请输入所属队组", trigger: "blur" },
      //   ],
      // },
      hideimg: false,
      xqdialog: false,
      detailform: {},
      multion: [],
      imgShow: false,
      formItemKey: 0,
      jxddialog: false,
      mapZoom: 13,
      mapCenter: {
        //青原
        lng: 115.01747,
        lat: 27.10577,
      },
      mapbox: {},
      mapZoom1: 13,
      mapCenter1: {
        //青原
        lng: 115.01747,
        lat: 27.10577,
      },
      mapbox1: {},
      locationlng: [],
      locationlat: [],
      longitudee: [],
      id: "",
    };
  },
  mounted() {
    this.getlist("");
    // 道路统计
    RoadBasicCount().then((res) => {
      if (res.code == 200) {
        this.roadList = res.data;
      }
    });
    // 所属队组
    VillageGroups().then((res) => {
      if (res.code == 200) {
        this.groups = res.data;
      }
    });
  },
  methods: {
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
        belongToGroup: this.filters.belongToGroup,
        riverName: this.filters.riverName,
        roadType: "1",
        pageSize: this.filters.size,
        pageNum: this.filters.current,
      };
      if (val) {
        para.pageNum = val;
        this.currentPage1 = val;
      }
      RiverList(para).then((res) => {
        this.datalist = res.data.rows;
        this.total = res.data.total;
      });
    },
    // 重置
    resetForm: function (filters) {
      this.$refs.filters.resetFields();
      this.filters = {
        riverName: "",
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
    // 删除 取消
    visibleDelCancel(id) {
      this.$refs[id].doClose();
    },
    // 删除确认
    visibleDelSubmit(rowData) {
      DelRiver(rowData.riverId).then((res) => {
        console.log(res, "10101");
        if (res.data.code == "200") {
          this.$message({
            message: res.data.msg,
            type: "success",
          });
        } else {
          this.$message({
            message: res.data.msg,
            type: "error",
          });
        }
        this.$refs[rowData.riverId].doClose();
        this.getlist(1);
      });
    },
    // 新增
    handleAdd: function () {
      this.adddialog = true;
      this.diatitle = "添加道路";
      this.initAddForm();
      this.imgShow = false;
    },
    // 弹窗关闭
    handlecancel: function () {
      this.$refs.addForm.resetFields();
      this.initAddForm();
      this.adddialog = false;
    },
    // 导入
    handleimport: function (event, type) {
      let file = this.$refs.filebox.files[0];
      var random = new Date().getTime().toString();
      let formData = new FormData();
      formData.append("file", file);
      axios
        .post("/basic/river/import/1?t=" + random, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.$message({
              message: res.data.msg,
              type: "success",
            });
          } else {
            this.$message({
              message: res.data.msg,
              type: "error",
            });
          }
          this.getlist(1);
        })
        .catch((res) => {
          console.log(res, "2");
        });
      this.$ref.filebox = []
    },
    // 下载模版
    downlayout: function () {
      let url = "/basic/river/download/1";
      this.comjs.downfile(url);
    },
    handleSelectionChange: function (data) {
      for (var i = 0; i < data.length; i++) {
        this.multion.push(data[i].riverId);
      }
    },
    // 导出
    handlexport: function () {
      if (this.multion.length > 0) {
        let url = "basic/river/exportByIds/" + this.multion.join(",");
        this.comjs.downfile(url);
      } else {
        this.$message({
          message: "至少勾选一条数据",
        });
      }
    },

    // 图片上传
    choosefile: function (event, type) {
      let file = this.$refs.file.files[0];
      this.uploadfile(file);
      this.imgShow = true;
    },
    // 删除图片
    delfilee: function () {
      this.addForm.photoFileUrls = "url('../img/empty.png') no-repeat";
      this.imgShow = false;
      // 更新key，强制el-form-item 重新渲染
      this.formItemKey += 1;
    },
    // 文件上传
    uploadfile: function (data) {
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
            this.addForm.photoFileUrls = res.data.data.url;
            this.addForm.photoFiles = res.data.data.ossId;
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
    // 地图绘制弹框
    Longitude() {
      this.jxddialog = true;
    },
    // 初始化地图
    handlerBMap: function ({ BMap, map }) {
      this.locationlat = [];
      this.locationlng = [];
      var point = new BMap.Point(121.7057, 31.232451); // 上海合庆镇东风村
      map.centerAndZoom(point, 16);
      this.mapbox = { BMap, map };
      map.addEventListener("click", ({ point }) => {
        console.log(point);
        var marker = new BMap.Marker(point); // 创建标注
        map.addOverlay(marker); // 将标注添加到地图中
        // this.location.lng = point.lng;
        // this.location.lat = point.lat;
        this.locationlng.push(point.lng);
        this.locationlat.push(point.lat);
        if (this.locationlng.length == "2") {
          // 道路样式
          console.log(this.locationlng[0]);
          const startPoint = new BMap.Point(
            this.locationlng[0],
            this.locationlat[0]
          );
          const endPoint = new BMap.Point(
            this.locationlng[1],
            this.locationlat[1]
          );
          const drivingRoute = new BMap.DrivingRoute(map, {
            renderOptions: { map: map, autoViewport: true },
          });
          drivingRoute.search(startPoint, endPoint);
        }
      });
      // var marker = new BMap.Marker(point) // 创建标注
      // map.addOverlay(marker) // 将标注添加到地图中
    },
    // 地图弹框关闭
    dtclose: function () {
      this.jxddialog = false;
      this.locationlat = [];
      this.locationlng = [];
    },
    // 地图保存
    dtsubmit() {
      this.jxddialog = false;
      let aa = this.locationlng.concat(this.locationlat);
      this.addForm.longitudeAndLatitude = aa.join(",");
    },
    // 保存
    handleSubmit: function () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          let para = {
            roadType: 1,
            riverId: this.addForm.riverId,
            sort: this.addForm.sort,
            riverName: this.addForm.riverName,
            riverLength: this.addForm.riverLength,
            roadWidth: this.addForm.roadWidth,
            roadArea: this.addForm.roadArea,
            belongToGroup: this.addForm.belongToGroup,
            startPoints: this.addForm.startPoints,
            remarks: this.addForm.remarks
          };
          if (this.addForm.riverId) {
            UpdateRiver(para).then((res) => {
              if (res.code == "200") {
                this.$message({
                  message: res.msg,
                  type: "success",
                });
                this.$refs.addForm.resetFields();
                this.adddialog = false;
                this.getlist(1);
              } else {
                this.$message({
                  message: res.msg,
                  type: "error",
                });
                this.getlist(1);
              }
            });
          } else {
            AddRiver(para).then((res) => {
              if (res.code == "200") {
                this.$message({
                  message: res.msg,
                  type: "success",
                });
                this.$refs.addForm.resetFields();
                this.adddialog = false;
                this.getlist(1);
              } else {
                this.$message({
                  message: res.msg,
                  type: "error",
                });
                this.getlist(1);
              }
            });
          }
        }
      });
    },

    // 编辑
    handlEdit: function (row) {
      this.adddialog = true;
      this.diatitle = "编辑道路";
      this.getDetail(row.riverId);
    },
    // 详情
    getDetail: function (id) {
      RiverfindById(id).then((res) => {
        this.detailform = res.data.data;
        this.addForm = res.data.data;
        this.addForm.photoFileUrls = res.data.data.photoFileUrls;
        if (
          this.addForm.photoFileUrls == "" ||
          this.addForm.photoFileUrls == null
        ) {
          // console.log(this.addForm.photoFileUrls, "12214212");
          this.imgShow = false;
          this.addForm.photoFileUrls = "url('../img/empty.png') no-repeat";
        }
      });
    },
    // 详情
    handlDetil: function (row) {
      this.id = row.riverId;
      this.xqdialog = true;
      this.getDetail(row.riverId);
    },
    // 初始化地图
    handlerBMap1: function ({ BMap, map }) {
      var point = new BMap.Point(121.7057, 31.232451); // 上海合庆镇东风村
      map.centerAndZoom(point, 16);
      this.mapbox1 = { BMap, map };
      RiverfindById(this.id).then((res) => {
        this.longitudee = res.data.data.longitudeAndLatitude.split(",");
        const startPoint = new BMap.Point(
          this.longitudee[0],
          this.longitudee[2]
        );
        const endPoint = new BMap.Point(this.longitudee[1], this.longitudee[3]);
        const drivingRoute = new BMap.DrivingRoute(map, {
          renderOptions: { map: map, autoViewport: true },
        });
        drivingRoute.search(startPoint, endPoint);
      });

      // var marker = new BMap.Marker(point) // 创建标注
      // map.addOverlay(marker) // 将标注添加到地图中
    },
    // 初始化表单
    initAddForm() {
      this.addForm = {
        riverId: "",
        sort: "", // 序号
        riverName: "", // 道路名称
        riverLength: "", // 现状长度
        roadWidth: "", // 现状宽度
        roadArea: "", // 现状面积
        belongToGroup: "", // 所属队组
        startPoints: "", // 起止点
        remarks: "" // 备注
      };
    },
  },
};
</script>

<style scoped>
.g-cont {
  display: flex;
  flex-direction: column;
}
.top-count {
  width: 100%;
  height: 95px;
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
}
.count-card {
  flex-shrink: 0;
  display: inline-block;
  width: 225px;
  height: 80px;
  background: url("../../assets/img/road-bg1.png");
  background-size: 100% 100%;
  display: flex;
  padding: 15px 0;
  box-sizing: border-box;
}
.count-card > .card-left {
  width: 64px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-weight: bold;
  border-right: 2px dotted#CCCCCC;
}
.count-card > .card-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 12px;
  gap: 4px;
  padding-left: 12px;
}
.num-style {
  font-family: Microsoft YaHei UI, Microsoft YaHei UI;
  font-weight: bold;
  font-size: 16px;
  color: #1396c7;
}
</style>