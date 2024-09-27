<template>
  <div class="g-cont">
    <div class="g-ltside">
      <div class="tab-ul">
       
        <div
          v-for="(item, index) in allotlist"
          :class="['tab-lst', { active: current == index }]"
          @click="handletab(index)"
        >
        {{ item.evtTypeVo.evtTypeName }}
        <span class="unset-num"> {{ item.unsetNum }} </span>
        </div>
      </div>
    </div>
    <div class="g-rtside">
      <div class="">
        <el-form :inline="true" :model="filters" ref="filters">
          <el-form-item label="" prop="name" class="ipt150">
            <h2>规则列表</h2>
          </el-form-item>
          <div
            class="search-btnbox"
            style="margin-left: 0; margin-bottom: 0.08333rem"
          >
            <span class="btn del-btn" @click="clearAllot()">清除人员选择</span>
            <span class="btn search-btn" @click="openDialog()"
              >设置自动分派人员</span
            >
          </div>
        </el-form>
      </div>
      <div class="m-table">
        <el-table
          :data="ruleListCurrentPage"
          @selection-change="handleSelectionChange"
          highlight-current-row
          v-loading="listLoading"
          style="width: 100%"
          border
          :row-class-name="tableRowClassName"
          :header-cell-style="{ 'text-align': 'center' }"
          :cell-style="{ 'text-align': 'center' }"
        >
          <el-table-column type="selection" width="80"> </el-table-column>
          <el-table-column label="摄像头编号" prop="channelCode">
          </el-table-column>
          <el-table-column label="摄像头名称" prop="channelName">
          </el-table-column>
          <el-table-column label="人员姓名" prop="nickName"> </el-table-column>
        </el-table>
      </div>

      <div class="m-pagination">
        <el-pagination
          background
          @size-change="handleSizeChangeAllotList"
          @current-change="handleCurrentChangeAllotList"
          :current-page="currentPageAllotList"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="pageSizeAllotList"
          :total="ruleList.length"
          layout=" prev, pager, next"
          prev-text="< 上一页"
          next-text="下一页 >"
        >
        </el-pagination>
        <i class="total">共有{{ ruleList.length }}条数据</i>
      </div>

    </div>
  
    <!-- 详情 -->
    <el-dialog
      :visible.sync="allotPersonVisible"
      v-if="allotPersonVisible"
      class="g-dialog"
      title="设置自动分派人员"
    >
      <el-form :model="allot" ref="allot">
        <el-form-item label="分派人员" class="user-tree" prop="name">
          <el-tree
            :data="allotPersonList"
            :props="defaultProps"
            node-key="id"
            default-expand-all
            show-checkbox
            :check-strictly="true"
            :highlight-current="true"
            @check="handleCheck"
            ref="tree"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div class="dialog-foot">
        <span class="btn-cancel" @click="allotPersonVisible = false">取消</span>
        <span class="btn-save" @click="setAllot()">保存</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  HomeAuthList,
  HomeAuthDt,
  UpdateHomeAuth,
  AutshHomeAuth,
  EditAutshHome,
  getAllotList,
  clearAllotManager,
  setAllotManager,
  SelectDeptUserTree,
} from '../../api/api.js'
import axios from 'axios'
import qs from 'qs'
import moment from 'moment'

export default {
  data() {
    return {
      allot: {
        name:'',
      },
      allotPerson: '',
      allotPersonVisible: false,
      allotlist: [],
      current: '0',
      filters: {
        name: '',
      
      },
      listLoading: false,
      currentPageAllotList: 1, // 当前页
      pageSizeAllotList: 15, // 每页显示条数
      paramsList: [],
      selectedList: [],
      allotPersonList: [],
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      ruleList: [],
      // ruleListCurrentPage:[],
    }
  },
  computed:{
    ruleListCurrentPage(){
      const start = (this.currentPageAllotList - 1) * this.pageSizeAllotList;
      const end = start + this.pageSizeAllotList;
      return this.ruleList.slice(start, end);
    }
  },
  mounted() {
    this.AllotList()
    this.getAllotPersonList()
  },
  methods: {
    // 打开勾选人员弹窗
    openDialog() {
      console.log('打开勾选人员弹窗')
      this.allotPersonVisible = true
    },
    // 勾选人员
    handleCheck(node, { checkedNodes }) {
      const isLeaf = node.children === undefined || node.children.length === 0
      // 如果选中的节点不是叶子节点，则取消选中
      if (!isLeaf) {
        this.$refs.tree.setChecked(node, false)
        return
      }
      // 如果节点被选中，取消其他所有选中节点
      if (checkedNodes) {
        this.$refs.tree.setCheckedKeys([node.id])
        this.$nextTick(() => {
          const checkedNodes = this.$refs.tree.getCheckedNodes()
          this.allotPerson = checkedNodes[0].id
        })
      }
    },

    // 点击了选择框
    handleSelectionChange(selection) {
      console.log(this.selectedList)
      console.log('点击了选择框', selection)
      this.selectedList = selection
    },
    // 清除选择人员
    clearAllot() {
      let paramsList = []
      if (!this.selectedList.length) {
        this.$message({
          message: '未选择任何人员!',
          type: 'error',
        })
        return
      }
      for (let i = 0; i < this.selectedList.length; i++) {
        paramsList.push(this.selectedList[i].channelCode)
        console.log(this.selectedList[i])
      }
      let param = {
        evtTypeId: this.allotlist[this.current].evtTypeVo.evtTypeId,
        channelCodeList: paramsList,
      }
      clearAllotManager(param).then((res) => {
        if(res.code == '200'){
          this.allotPersonVisible = false
          this.AllotList()
          this.$message({
            message: '清除成功',
            type: 'success'
          })
        }else{
          this.$message({
            message: '清除失败',
            type: 'error'
          })
        }
      })
    },
    // 获取分派人员列表 SelectDeptUserTree
    getAllotPersonList() {
      let param = {
        roleKey:'eventDisposer'
      }
      SelectDeptUserTree(param).then((res) => {
        if (res.data.code == '200') {
          this.allotPersonList = res.data.data
        } else {
          this.$message({
            message: '获取分派人员失败',
            type: 'error',
          })
        }
      })
    },
    // 设置自动分派人员
    setAllot() {
      let paramsList = []
      if (!this.selectedList.length) {
        this.$message({
          message: '未选择任何人员!',
          type: 'error',
        })
        return
      }
      for (let i = 0; i < this.selectedList.length; i++) {
        paramsList.push(this.selectedList[i].channelCode)
        console.log(this.selectedList[i])
      }
      let param = {
        evtTypeId: this.allotlist[this.current].evtTypeVo.evtTypeId,
        channelCodeList: paramsList,
        userId: this.allotPerson.substring(4),
      }
      setAllotManager(param).then((res) => {
        if(res.code == '200'){
          this.allotPersonVisible = false
          this.AllotList()
          this.$message({
            message: '分配成功',
            type: 'success'
          })
        }else{
          this.$message({
            message: '分配失败',
            type: 'error'
          })
        }
      })
    },

    // 分页
    // 每页显示条数改变
    handleSizeChangeAllotList(val) {
      this.pageSizeAllotList = val
    },
    // 当前页改变
    handleCurrentChangeAllotList(val) {
      this.currentPageAllotList = val
    },
    // 获取事件自动分派列表
    AllotList() {
      getAllotList().then((res) => {
        if (res.data.code == '200') {
          this.allotlist = res.data.data
          this.ruleList = this.allotlist[this.current].ruleList
        }
      })
    },
    // 单行变色
    tableRowClassName: function (rowIndex) {
      if (rowIndex.rowIndex % 2 != 0) {
        return 'evenRow'
      }
      return 'oddRow'
    },
    // 切换
    handletab: function (index) {
      this.current = index
      this.currentPageAllotList = 1
      this.ruleList = this.allotlist[index].ruleList
    },
  },
}
</script>
<style>
.tab-lst{
  /* align-items: center; */
}
.unset-num{
  float:right;
  width: 40px;
  height: 40px;
  color: white;
  border-radius: 30%;
  background-color: #fe8d00;
  text-align: center;
  align-items: center;
  margin-top: 2px;
  /* padding: 0 10px; */
}</style>