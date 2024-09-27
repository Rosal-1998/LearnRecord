<template>
  <div>
    <el-dialog
      :visible="isShowBeiAn"
      class="g-dialog"
      title="租房备案"
      :close-on-click-modal="false"
      :before-close="handlecancel"
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
                @change = changeHouse(beiAnForm.houseId)
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
              <span class="gl-btn" @click="handleChooseRs1">选择居民</span>
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
              <span class="gl-btn" @click="handleChooseRs2">选择居民</span>
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
              <span>{{ this.jzrList.length }}</span>
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
  </div>
</template>

<script>
import {
  getHouseList,
  getFloorList,
  getRoomList,
  getLandlordsList,
  getHomeownerInfo,
  reportTenement,
} from '@/api/api'
import axios from 'axios'
export default {
  props: {
    isShowBeiAn: {
      type: Boolean,
      default: false,
    },
    zlrInfo: {
      type: Object,
      default: () => {},
    },
    jzrList: {
      type: Array,
      default: () => [],
    },
  },
  mounted() {
    // 获取所有房屋信息
    getHouseList().then((res) => {
      this.houseList = res
    })
    // this.houseList = this.loadAll()
  },
  data() {
    return {
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
    }
  },
  emits: [
    'handlecancel',
    'handleChooseRs1',
    'handleChooseRs2',
    'delZLR',
    'delJZR',
  ],
  methods: {
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
    handleChooseRs1() {
      this.$emit('handleChooseRs1')
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
            population: this.jzrList.length,
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
  },
}
</script>

<style scoped>
.upimgbox {
  margin-right: 10px;
}
</style>
