<template>
  <div class="g-cont">
    <div class="m-contain">
      <span class="btn add-btn" style="margin-right: 30px" @click="addLeader"
        >添加</span
      >
      <div class="m-search" style="margin-top: 0.083rem; float: left">
        <el-form :model="filters" :inline="true" ref="filters">
          <el-form-item label="党组织名称" prop="name">
            <el-input
              v-model="filters.name"
              placeholder="党组织名称"
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
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="ID" prop="organizationId" width="150">
          </el-table-column>
          <el-table-column
            label="党组织名称"
            prop="name"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            label="上级"
            prop="superiorName"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            label="党组织书记"
            prop="secretary"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            label="联系人"
            prop="contacts"
            width="130"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            label="联系电话"
            prop="contactPhone"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column label="备注" prop="remarks" :show-overflow-tooltip="true"> </el-table-column>
          <el-table-column
            label="最后编辑日期"
            prop="updateTime"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column label="操作" prop="" width="150">
            <template slot-scope="scope">
              <span class="edit-title" @click="handleEdit(scope.row)">编辑</span
              >&nbsp;&nbsp;
              <span class="detail-title" @click="handDetails(scope.row)"
                >详情</span
              >&nbsp;&nbsp;
              <el-popover
                :ref="scope.row.organizationId"
                placement="top"
                width="160"
                popper-class="popover"
              >
                <p class="del-tip">是否删除该党组织信息？</p>
                <div class="pop-btnbox">
                  <span
                    class="cancel-btn"
                    @click="visibleDelCancel(scope.row.organizationId)"
                    >取消</span
                  >
                  <span
                    class="ok-btn"
                    @click="visibleDelSubmit(scope.row.organizationId)"
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
      <!-- 新增、编辑 -->
      <el-dialog
        :visible.sync="adddialog"
        v-if="adddialog"
        class="g-dialog"
        :title="diatitle"
      >
        <div :class="iseidt ? 'addbox' : ''">
          <div class="lt">
            <el-form
              :model="addForm"
              :inline="true"
              ref="addForm"
              :rules="addFormRules"
              class="addform add-signcent"
              label-postion="right"
              label-width="100px"
            >
              <el-form-item label="上级党组织" prop="superiorId">
                <el-select
                  v-model="addForm.superiorId"
                  placeholder="请选择上级"
                >
                  <el-option
                    :label="item.superiorName"
                    :value="item.superiorId"
                    v-for="(item, index) in superiorList"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="党组织名称" prop="name">
                <el-input
                  v-model="addForm.name"
                  placeholder="请输入名称"
                ></el-input>
              </el-form-item>
              <el-form-item label="党组织书记" prop="secretary">
                <el-input
                  v-model="addForm.secretary"
                  placeholder="请输入书记"
                ></el-input>
              </el-form-item>
              <el-form-item label="联系人" prop="contacts">
                <el-input
                  v-model="addForm.contacts"
                  placeholder="请输入联系人"
                ></el-input>
              </el-form-item>
              <el-form-item label="联系人电话" prop="contactPhone">
                <el-input
                  v-model="addForm.contactPhone"
                  placeholder="请输入联系人电话"
                  type="number"
                ></el-input>
              </el-form-item>
              <el-form-item label="备注" prop="remarks">
                <el-input
                  type="textarea"
                  maxlength="200"
                  v-model="addForm.remarks"
                  placeholder="请输入备注"
                ></el-input>
              </el-form-item>
              <el-form-item label="位置" prop="placeName">
                <el-input
                  v-model="addForm.placeName"
                  placeholder="请选择位置"
                ></el-input>
                <span @click="Longitude">地图选点</span>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="dialog-foot">
          <span class="btn-cancel" @click="handlecancel('0')">取消</span>
          <span class="btn-save" @click="handleSave">保存</span>
        </div>
      </el-dialog>
      <!-- 详情 -->
      <el-dialog
        :visible.sync="xqdialog"
        v-if="xqdialog"
        class="g-dialog min-dia642"
        title="党组织详情"
      >
        <span class="tip">基础信息</span>
        <div class="xq-content car-detail">
          <div class="xq-lst">
            <span class="name">党组织名称</span>
            <span class="lab">{{ detailform.name }}</span>
          </div>
          <div class="xq-lst">
            <span class="name">党组织书记</span>
            <span class="lab">{{ detailform.secretary }}</span>
          </div>
          <div class="xq-lst">
            <span class="name">联系人</span>
            <span class="lab">{{ detailform.contacts }}</span>
          </div>
          <div class="xq-lst">
            <span class="name">联系人电话</span>
            <span class="lab">{{ detailform.contactPhone }}</span>
          </div>
          <div class="xq-lst">
            <span class="name">备注</span>
            <span class="lab">{{ detailform.remarks }}</span>
          </div>
          <div class="xq-lst">
            <span class="name">最后编辑时间</span>
            <span class="lab">{{ detailform.updateTime }}</span>
          </div>
          <div class="xq-lst">
            <span class="name">地点名称</span>
            <span class="lab">{{ detailform.placeName }}</span>
          </div>
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
        <span class="tip">请在下方使用鼠标选择地址，完成选择后点击保存</span>
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
  </div>
</template>

<script>
import {
  OrganizationList,
  OrganizationAdd,
  OrganizationUpdate,
  OrganizationQuery,
  OrganizationDelete,
} from '../../api/api'
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import axios from 'axios'
export default {
  components: {
    BaiduMap,
  },
  data() {
    return {
      filters: {
        name: '',
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
        organizationId: '',
        superiorId: '',
        name: '',
        secretary: '',
        contacts: '',
        contactPhone: '',
        remarks: '',
        placeName: '',
        longitude: '', //经度
        latitude: '', //纬度
      },
      superiorList: [],
      addFormRules: {
        superiorId: [
          { required: true, message: '请选择上级组织', trigger: 'change' },
        ],
        name: [
          { required: true, message: '请输入党组织名称', trigger: 'blur' },
        ],
        secretary: [
          { required: true, message: '请输入党组织书记', trigger: 'blur' },
        ],
        contacts: [
          { required: true, message: '请输入联系人', trigger: 'blur' },
        ],
        placeName: [
          { required: true, message: '请选择位置', trigger: 'change' },
        ],
        remarks: [{ required: true, message: '请输入备注', trigger: 'blur' }],
        contactPhone: [
          { required: true, message: '请输入联系人电话', trigger: 'blur' },
        ],
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
      placeName: '',
    }
  },
  mounted() {
    this.getlist()
  },
  methods: {
    // 单行变色
    tableRowClassName: function (rowIndex) {
      if (rowIndex.rowIndex % 2 != 0) {
        return 'evenRow'
      }
      return 'oddRow'
    },
    // 重置
    resetForm: function () {
      this.filters = {
        name: '',
        size: 10,
        current: 1,
      }
      this.getlist()
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
    // 获取列表
    getlist: function (val) {
      let para = {
        name: this.filters.name,
        pageSize: this.filters.size,
        pageNum: this.filters.current,
      }
      if (val) {
        para.pageNum = val
        this.currentPage1 = val
      }
      OrganizationList(para).then((res) => {
        this.datalist = res.data.rows
        this.total = res.data.total
        if (!val) {
          const uniqueSuperiorList = new Set(
            this.datalist.map((item) => item.superiorId)
          )
          const result = []

          uniqueSuperiorList.forEach((superiorId) => {
            const foundItem = this.datalist.find(
              (item) => item.superiorId === superiorId
            )
            result.push({
              superiorId: foundItem.superiorId,
              superiorName: foundItem.superiorName,
            })
          })

          this.superiorList = result
        }

        //   this.superiorList = this.datalist.map(item =>({
        //       superiorId:item.superiorId,
        //       superiorName:item.superiorName
        //   }))
      })
    },
    // 新增
    addLeader() {
      this.adddialog = true
      this.diatitle = '添加党组织'
      this.iseidt = false
      this.addForm = {
        organizationId: '',
        superiorId: '',
        name: '',
        secretary: '',
        contacts: '',
        contactPhone: '',
        remarks: '',
        placeName: '',
        longitude: '', //经度
        latitude: '', //纬度
      }
    },
    // 地图选点弹框
    Longitude() {
      this.jxddialog = true
    },
    // 初始化地图
    handlerBMap: function ({ BMap, map }) {
      var point = new BMap.Point(121.7057, 31.232451) // 上海合庆镇东风村
      map.centerAndZoom(point, 16)
      this.mapbox = { BMap, map }
      map.addEventListener('click', ({ point }) => {
        console.log(point)
        var marker = new BMap.Marker(point) // 创建标注
        map.addOverlay(marker) // 将标注添加到地图中
        this.addForm.longitude = point.lng
        this.addForm.latitude = point.lat
        var aa = new BMap.Geocoder()
        aa.getLocation(point, (re) => {
          this.placeName = re.address
        })
      })
    },
    // 地图弹框关闭
    dtclose: function () {
      this.addForm.longitude = ''
      this.addForm.latitude = ''
      this.placeName = ''
      this.jxddialog = false
    },
    // 地图保存
    dtsubmit() {
      this.addForm.placeName = this.placeName
      this.jxddialog = false
    },
    // 编辑
    handleEdit: function (row) {
      this.adddialog = true
      this.diatitle = '编辑党组织'
      this.addForm.organizationId = row.organizationId
      this.getDetail(row.organizationId)
    },
    // 点击详情
    handDetails(row) {
      this.xqdialog = true
      this.getDetail(row.organizationId)
    },
    // 获取详情
    getDetail(id) {
      console.log('typeof(id)',typeof(id))
      OrganizationQuery(id).then((res) => {
        this.addForm = res.data.data
        this.detailform = res.data.data
      })
    },
    // 保存
    handleSave() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          let para = {
            organizationId: this.addForm.organizationId,
            superiorId: this.addForm.superiorId,
            name: this.addForm.name,
            secretary: this.addForm.secretary,
            contacts: this.addForm.contacts,
            contactPhone: this.addForm.contactPhone,
            remarks: this.addForm.remarks,
            placeName: this.addForm.placeName,
            longitude: this.addForm.longitude, //经度
            latitude: this.addForm.latitude, //纬度
          }
          if (this.addForm.organizationId) {
            OrganizationUpdate(para).then((res) => {
              if (res.code == '200') {
                this.$message({
                  message: res.msg,
                  type: 'success',
                })
                this.getlist(1)
              } else {
                this.$message({
                  message: res.msg,
                  type: 'error',
                })
              }
              this.$refs.addForm.resetFields()
              this.adddialog = false
              this.getlist(1)
            })
          } else {
            OrganizationAdd(para).then((res) => {
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
              this.$refs.addForm.resetFields()
              this.adddialog = false
              this.getlist(1)
            })
          }
        }
      })
    },
    // 弹窗关闭
    handlecancel: function () {
      this.$refs.addForm.resetFields()
      this.addForm = {
        name: '',
        secretary: '',
        contacts: '',
        contactPhone: '',
        remarks: '',
      }
      this.adddialog = false
    },
    // 删除取消
    visibleDelCancel(id) {
      this.$refs[id].doClose()
    },
    // 删除确定
    visibleDelSubmit(id) {
      OrganizationDelete(id).then((res) => {
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
  },
}
</script>

<style></style>
