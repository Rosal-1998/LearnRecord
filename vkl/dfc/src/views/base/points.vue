<template>
  <div class="g-cont">
    <div class="m-contain">
      <!-- <span class="btn add-btn" @click="handleAdd">添加</span> -->
      <span class="btn down-btn" @click="handledown">下载导入模版</span>
      <span class="btn import-btn"
        ><input
          type="file"
          ref="filebox"
          name="file"
          class="fileipt"
          @change="handleimport($event)"
        />导入</span
      >
      <span class="btn export-btn" @click="handlexport">导出</span>
      <div class="m-search" style="margin-top: 0.083rem; float: left;">
        <el-form :model="filters" :inline="true" ref="filters">
          <el-form-item label="积分区间" prop="" class="mj">
            <el-input v-model="filters.integralStartNumber" placeholder="最低" ></el-input>至<el-input v-model="filters.integralEndNumber" placeholder="最高"></el-input>
          </el-form-item>
          <el-form-item label="积分年度" prop="integralYear">
            <el-date-picker v-model="filters.integralYear" type="year" value-format="yyyy" ></el-date-picker>
          </el-form-item>
          
          <el-form-item label="身份证号" prop="idCard">
            <el-input
              v-model="filters.idCard"
              placeholder="身份证号"
            ></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input
              v-model="filters.name"
              placeholder="姓名"
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
          @selection-change="handlegx"
          @sort-change="sortChange" :default-sort="{prop: 'viewNum', order: 'descending'}"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="ID" prop="integralId" width="80">
          </el-table-column>
          <el-table-column
            label="户名"
            prop="name"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            label="人口类型"
            prop="populationType"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            label="门牌号"
            prop="houseNumber"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            label="联系方式"
            prop="mobile"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            label="身份证号"
            prop="idCard"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            label="积分年度"
            prop="integralYear"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column label="总分" sortable="custom" :sort-orders="['descending','ascending']"  prop="integralNumber">
          </el-table-column>
          <el-table-column label="操作" prop="" width="200">
            <template slot-scope="scope">
              <span class="edit-title" @click="handlEdit(scope.row)">编辑</span
              >&nbsp;&nbsp;
              <span class="detail-title" @click="handleDetail(scope.row)"
                >详情</span
              >&nbsp;&nbsp;
              <el-popover
                :ref="scope.row.integralId"
                placement="top"
                width="160"
                popper-class="popover"
              >
                <p class="del-tip">是否删除该积分信息？</p>
                <div class="pop-btnbox">
                  <span
                    class="cancel-btn"
                    @click="visibleDelCancel(scope.row.integralId)"
                    >取消</span
                  >
                  <span
                    class="ok-btn"
                    @click="visibleDelSubmit(scope.row.integralId)"
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
      
      <el-form
        :model="addForm"
        :inline="true"
        ref="addForm"
        :rules="addFormRules"
        class="addform add-signcent"
        label-postion="right"
        label-width="65px"
      >
        
        <el-form-item label="姓名" label-width="160px" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="人口类型" label-width="160px" prop="populationType">
          <el-input v-model="addForm.populationType" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="门牌号" label-width="160px" prop="houseNumber">
          <el-input v-model="addForm.houseNumber" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" label-width="160px" prop="idCard">
          <el-input
            v-model="addForm.idCard"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="积分年度" label-width="160px" prop="integralYear">
            <el-date-picker v-model="addForm.integralYear" type="year" value-format="yyyy"></el-date-picker>
        </el-form-item>
        <el-form-item label="总分" label-width="160px" prop="integralNumber">
          <el-input
            v-model="addForm.integralNumber"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-foot">
        <span class="btn-cancel" @click="handlecancel('0')">取消</span>
        <span class="btn-save" @click="handleSubmit">保存</span>
      </div>
    </el-dialog>

    <!-- 详情 -->
    <el-dialog
      :visible.sync="xqdialog"
      v-if="xqdialog"
      class="g-dialog"
      title="积分详情"
    >
      <div class="xq-infos">
        <div class="xq-top">
          <div class="xq-top-list">
            <span class="xq-top-list-name">户名</span>
            <span class="xq-top-list-lab">{{ detailform.name }}</span>
          </div>
          <div class="xq-top-list">
            <span class="xq-top-list-name">人口类型</span>
            <span class="xq-top-list-lab">{{ detailform.populationType }}</span>
          </div>
          <div class="xq-top-list">
            <span class="xq-top-list-name">门牌号</span>
            <span class="xq-top-list-lab">{{ detailform.houseNumber }}</span>
          </div>
          <div class="xq-top-list">
            <span class="xq-top-list-name">联系方式</span>
            <span class="xq-top-list-lab">{{ detailform.mobile }}</span>
          </div>
          <div class="xq-top-list">
            <span class="xq-top-list-name">身份证号</span>
            <span class="xq-top-list-lab">{{ detailform.idCard }}</span>
          </div>
          <div class="xq-top-list">
            <span class="xq-top-list-name">积分年度</span>
            <span class="xq-top-list-lab">{{ detailform.integralYear }}</span>
          </div>
          <div class="xq-top-list">
            <span class="xq-top-list-name">备注</span>
            <span class="xq-top-list-lab">{{ detailform.remark }}</span>
          </div>
        </div>
        <div class="xq-bottom">
          <div class="xq-bottom-title bDAF9F8">合庆镇乡村治理积分制积分明细表</div>
          <div class="xq-bottom-title">总分：{{detailform.integralNumber}}</div>
          <div class="jf-detail">
            <div class="jf-detail-left bDAF9F8">
              <span>农户零星养殖鸡鸭棚规范管理</span>
            </div>
            <div class="jf-detail-right">
              <div class="jf-detail-item">
                <span class="jf-detail-name bDAF9F8">第1季度</span>
                <span class="jf-detail-count bDAF9F8">{{detailform.type1 || '/'}}</span>
              </div>
              <div class="jf-detail-item">
                <span class="jf-detail-name">第2季度</span>
                <span class="jf-detail-count">{{detailform.type2 || '/'}}</span>
              </div>
              <div class="jf-detail-item">
                <span class="jf-detail-name bDAF9F8">第3季度</span>
                <span class="jf-detail-count bDAF9F8">{{detailform.type3 || '/'}}</span>
              </div>
              <div class="jf-detail-item">
                <span class="jf-detail-name">第4季度</span>
                <span class="jf-detail-count">{{detailform.type4 || '/'}}</span>
              </div>
            </div>
          </div>
          <div class="jf-detail">
            <div class="jf-detail-left bDAF9F8">
              <span>小菜园规范种植、禁止毁绿占绿进行种植</span>
            </div>
            <div class="jf-detail-right">
              <div class="jf-detail-item">
                <span class="jf-detail-name bDAF9F8">第1季度</span>
                <span class="jf-detail-count bDAF9F8">{{detailform.type5 || '/'}}</span>
              </div>
              <div class="jf-detail-item">
                <span class="jf-detail-name">第2季度</span>
                <span class="jf-detail-count">{{detailform.type6 || '/'}}</span>
              </div>
              <div class="jf-detail-item">
                <span class="jf-detail-name bDAF9F8">第3季度</span>
                <span class="jf-detail-count bDAF9F8">{{detailform.type7 || '/'}}</span>
              </div>
              <div class="jf-detail-item">
                <span class="jf-detail-name">第4季度</span>
                <span class="jf-detail-count">{{detailform.type8 || '/'}}</span>
              </div>
            </div>
          </div>
          <div class="jf-detail">
            <div class="jf-detail-left bDAF9F8">
              <span>垃圾干湿要分离、禁止乱抛、乱倒、乱堆（垃圾分类）</span>
            </div>
            <div class="jf-detail-right">
              <div class="jf-detail-item">
                <span class="jf-detail-name bDAF9F8">1-2月</span>
                <span class="jf-detail-count bDAF9F8">{{detailform.type9 || '/'}}</span>
              </div>
              <div class="jf-detail-item">
                <span class="jf-detail-name">3-4月</span>
                <span class="jf-detail-count">{{detailform.type10 || '/'}}</span>
              </div>
              <div class="jf-detail-item">
                <span class="jf-detail-name bDAF9F8">5-6月</span>
                <span class="jf-detail-count bDAF9F8">{{detailform.type11 || '/'}}</span>
              </div>
              <div class="jf-detail-item">
                <span class="jf-detail-name">7-8月</span>
                <span class="jf-detail-count">{{detailform.type12 || '/'}}</span>
              </div>
              <div class="jf-detail-item">
                <span class="jf-detail-name">9-10月</span>
                <span class="jf-detail-count">{{detailform.type13 || '/'}}</span>
              </div>
              <div class="jf-detail-item">
                <span class="jf-detail-name">11-12月</span>
                <span class="jf-detail-count">{{detailform.type14 || '/'}}</span>
              </div>
            </div>
          </div>
          <div class="jf-detail">
            <div class="jf-detail-left bDAF9F8">
              <span>庭内庭外整洁、宅前屋后堆物整齐、居住环境优美（星级户）</span>
            </div>
            <div class="jf-detail-right">
              <div class="jf-detail-item">
                <span class="jf-detail-name bDAF9F8">上半年</span>
                <span class="jf-detail-count bDAF9F8">{{detailform.type15 || '/'}}</span>
              </div>
              <div class="jf-detail-item">
                <span class="jf-detail-name">下半年</span>
                <span class="jf-detail-count">{{detailform.type16 || '/'}}</span>
              </div>
            </div>
          </div>
          <div class="jf-detail">
            <div class="jf-detail-left bDAF9F8">
              <span>婚事要新办、丧事要简办、祭祀要文明</span>
            </div>
            <div class="jf-detail-right">
              <div class="jf-detail-item">
                <span class="jf-detail-name bDAF9F8">上半年</span>
                <span class="jf-detail-count bDAF9F8">{{detailform.type17 || '/'}}</span>
              </div>
              <div class="jf-detail-item">
                <span class="jf-detail-name">下半年</span>
                <span class="jf-detail-count">{{detailform.type18 || '/'}}</span>
              </div>
            </div>
          </div>
          <div class="jf-detail">
            <div class="jf-detail-left bDAF9F8">
              <span>传承家风家训、注重邻里和谐</span>
            </div>
            <div class="jf-detail-right">
              <div class="jf-detail-item">
                <span class="jf-detail-name bDAF9F8">上半年</span>
                <span class="jf-detail-count bDAF9F8">{{detailform.type19 || '/'}}</span>
              </div>
              <div class="jf-detail-item">
                <span class="jf-detail-name">下半年</span>
                <span class="jf-detail-count">{{detailform.type20 || '/'}}</span>
              </div>
            </div>
          </div>
          <div class="jf-detail">
            <div class="jf-detail-left bDAF9F8">
              <span>弘扬孝老爱亲</span>
            </div>
            <div class="jf-detail-right">
              <div class="jf-detail-item">
                <span class="jf-detail-name bDAF9F8">上半年</span>
                <span class="jf-detail-count bDAF9F8">{{detailform.type21 || '/'}}</span>
              </div>
              <div class="jf-detail-item">
                <span class="jf-detail-name">下半年</span>
                <span class="jf-detail-count">{{detailform.type22 || '/'}}</span>
              </div>
            </div>
          </div>
          <div class="jf-detail">
            <div class="jf-detail-left bDAF9F8">
              <span>学习法律知识、参加普法教育</span>
            </div>
            <div class="jf-detail-right">
              <div class="jf-detail-item">
                <span class="jf-detail-name bDAF9F8">上半年</span>
                <span class="jf-detail-count bDAF9F8">{{detailform.type23 || '/'}}</span>
              </div>
              <div class="jf-detail-item">
                <span class="jf-detail-name">下半年</span>
                <span class="jf-detail-count">{{detailform.type24 || '/'}}</span>
              </div>
            </div>
          </div>
          <div class="jf-detail">
            <div class="jf-detail-left bDAF9F8">
              <span>参加法治建设</span>
            </div>
            <div class="jf-detail-right">
              <div class="jf-detail-item">
                <span class="jf-detail-name bDAF9F8">上半年</span>
                <span class="jf-detail-count bDAF9F8">{{detailform.type25 || '/'}}</span>
              </div>
              <div class="jf-detail-item">
                <span class="jf-detail-name">下半年</span>
                <span class="jf-detail-count">{{detailform.type26 || '/'}}</span>
              </div>
            </div>
          </div>
          <div class="jf-detail">
            <div class="jf-detail-left bDAF9F8">
              <span>办理养犬登记、养犬接种疫苗、栓绳遛犬外出</span>
            </div>
            <div class="jf-detail-right">
              <div class="jf-detail-item">
                <span class="jf-detail-name bDAF9F8">上半年</span>
                <span class="jf-detail-count bDAF9F8">{{detailform.type27 || '/'}}</span>
              </div>
              <div class="jf-detail-item">
                <span class="jf-detail-name">下半年</span>
                <span class="jf-detail-count">{{detailform.type28 || '/'}}</span>
              </div>
            </div>
          </div>
          <div class="jf-detail">
            <div class="jf-detail-left bDAF9F8">
              <span>家庭有现役军人</span>
            </div>
            <div class="jf-detail-right">
              <div class="jf-detail-item">
                <span class="jf-detail-name bDAF9F8">全年</span>
                <span class="jf-detail-count bDAF9F8">{{detailform.type29 || '/'}}</span>
              </div>
            </div>
          </div>
          <div class="jf-detail">
            <div class="jf-detail-left bDAF9F8">
              <span>发挥先锋模范、引导个人争优</span>
            </div>
            <div class="jf-detail-right">
              <div class="jf-detail-item">
                <span class="jf-detail-name bDAF9F8">上半年</span>
                <span class="jf-detail-count bDAF9F8">{{detailform.type30 || '/'}}</span>
              </div>
              <div class="jf-detail-item">
                <span class="jf-detail-name">下半年</span>
                <span class="jf-detail-count">{{detailform.type31 || '/'}}</span>
              </div>
            </div>
          </div>
          <div class="jf-detail">
            <div class="jf-detail-left bDAF9F8">
              <span>配合村级事务、参与村级活动、践行志愿精神（志愿者活动）</span>
            </div>
            <div class="jf-detail-right">
              <div class="jf-detail-item">
                <span class="jf-detail-name bDAF9F8">第1季度</span>
                <span class="jf-detail-count bDAF9F8">{{detailform.type32 || '/'}}</span>
              </div>
              <div class="jf-detail-item">
                <span class="jf-detail-name bDAF9F8">第2季度</span>
                <span class="jf-detail-count bDAF9F8">{{detailform.type33 || '/'}}</span>
              </div>
              <div class="jf-detail-item">
                <span class="jf-detail-name bDAF9F8">第3季度</span>
                <span class="jf-detail-count bDAF9F8">{{detailform.type34 || '/'}}</span>
              </div>
              <div class="jf-detail-item">
                <span class="jf-detail-name bDAF9F8">第4季度</span>
                <span class="jf-detail-count bDAF9F8">{{detailform.type35 || '/'}}</span>
              </div>
            </div>
          </div>
          <div class="jf-detail">
            <div class="jf-detail-left bDAF9F8">
              <span>热心社会公益慈善，积极开展帮扶济困</span>
            </div>
            <div class="jf-detail-right">
              <div class="jf-detail-item">
                <span class="jf-detail-name bDAF9F8">上半年</span>
                <span class="jf-detail-count bDAF9F8">{{detailform.type36 || '/'}}</span>
              </div>
              <div class="jf-detail-item">
                <span class="jf-detail-name">下半年</span>
                <span class="jf-detail-count">{{detailform.type37 || '/'}}</span>
              </div>
            </div>
          </div>
          <div class="jf-detail">
            <div class="jf-detail-left bDAF9F8">
              <span>严禁拒绝、逃避兵役登记和征集服现役行为</span>
            </div>
            <div class="jf-detail-right">
              <div class="jf-detail-item">
                <span class="jf-detail-name bDAF9F8">上半年</span>
                <span class="jf-detail-count bDAF9F8">{{detailform.type38 || '/'}}</span>
              </div>
              <div class="jf-detail-item">
                <span class="jf-detail-name">下半年</span>
                <span class="jf-detail-count">{{detailform.type39 || '/'}}</span>
              </div>
            </div>
          </div>
          <div class="jf-detail">
            <div class="jf-detail-left bDAF9F8">
              <span>严禁新增违法建筑、违法用地行为</span>
            </div>
            <div class="jf-detail-right">
              <div class="jf-detail-item">
                <span class="jf-detail-name bDAF9F8">上半年</span>
                <span class="jf-detail-count bDAF9F8">{{detailform.type40 || '/'}}</span>
              </div>
              <div class="jf-detail-item">
                <span class="jf-detail-name">下半年</span>
                <span class="jf-detail-count">{{detailform.type41 || '/'}}</span>
              </div>
            </div>
          </div>
          <div class="jf-detail">
            <div class="jf-detail-left bDAF9F8">
              <span>杜绝非访行为</span>
            </div>
            <div class="jf-detail-right">
              <div class="jf-detail-item">
                <span class="jf-detail-name bDAF9F8">上半年</span>
                <span class="jf-detail-count bDAF9F8">{{detailform.type42 || '/'}}</span>
              </div>
              <div class="jf-detail-item">
                <span class="jf-detail-name">下半年</span>
                <span class="jf-detail-count">{{detailform.type43 || '/'}}</span>
              </div>
            </div>
          </div>
          <div class="jf-detail">
            <div class="jf-detail-left bDAF9F8">
              <span>杜绝涉黑涉恶、黄赌毒、参与邪教组织等行为</span>
            </div>
            <div class="jf-detail-right">
              <div class="jf-detail-item">
                <span class="jf-detail-name bDAF9F8">上半年</span>
                <span class="jf-detail-count bDAF9F8">{{detailform.type44 || '/'}}</span>
              </div>
              <div class="jf-detail-item">
                <span class="jf-detail-name">下半年</span>
                <span class="jf-detail-count">{{detailform.type45 || '/'}}</span>
              </div>
            </div>
          </div>
          <div class="jf-detail">
            <div class="jf-detail-left bDAF9F8">
              <span>涉邪人员积极配合社区管控</span>
            </div>
            <div class="jf-detail-right">
              <div class="jf-detail-item">
                <span class="jf-detail-name bDAF9F8">上半年</span>
                <span class="jf-detail-count bDAF9F8">{{detailform.type46 || '/'}}</span>
              </div>
              <div class="jf-detail-item">
                <span class="jf-detail-name">下半年</span>
                <span class="jf-detail-count">{{detailform.type47 || '/'}}</span>
              </div>
            </div>
          </div>
          <div class="jf-detail">
            <div class="jf-detail-left bDAF9F8">
              <span>社戒、社康人员严格按照协议配合禁毒部门工作，其他吸毒对象积极配合社区管控</span>
            </div>
            <div class="jf-detail-right">
              <div class="jf-detail-item">
                <span class="jf-detail-name bDAF9F8">上半年</span>
                <span class="jf-detail-count bDAF9F8">{{detailform.type48 || '/'}}</span>
              </div>
              <div class="jf-detail-item">
                <span class="jf-detail-name">下半年</span>
                <span class="jf-detail-count">{{detailform.type49 || '/'}}</span>
              </div>
            </div>
          </div> 
        </div>
      </div>
      <!-- <div class="xq-content">
        
        <div class="xq-lst">
          <span class="name">户名</span>
          <span class="lab">{{ detailform.name }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">人口类型</span>
          <span class="lab">{{ detailform.name }}</span>
        </div>

        <div class="xq-lst">
          <span class="name">门牌号</span>
          <span class="lab">{{ detailform.idCard }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">联系方式</span>
          <span class="lab">{{ detailform.idCard }}</span>
        </div>

        <div class="xq-lst">
          <span class="name">身份证号</span>
          <span class="lab">{{ detailform.idCard }}</span>
        </div>
        <div class="xq-lst">
          <span class="name">积分年度</span>
          <span class="lab">{{ detailform.integralYear }}</span>
        </div>
        
        <div class="xq-lst">
          <span class="name">备注</span>
          <span class="lab">{{ detailform.integralNumber }}</span>
        </div>
      </div> -->
    </el-dialog>
  </div>
</template>

<script>
import {
  integralList,
  integralAdd,
  integralUpdate,
  integralDelete,
  integralQuery,
} from "../../api/api.js";
import axios from "axios";
export default {
  data() {
    return {
      filters: {
        name:'',
        idCard:'',
        integralStartNumber:'',
        integralEndNumber:'',
        integralYear:'',
        size: 10,
        current: 1,
        isAsc:'',
        orderByColumn:''
      },
      datalist: [],
      listLoading: false,
      total: 0,
      currentPage: 1,
      currentPage1: 1,
      pagesize: 10,
      pagesize1: 10,
      adddialog: false,
      diatitle: "",
      addForm: {
        integralId:'',
        name:'',
        idCard:'',
        integralYear:'',
        integralNumber:''
      },
      residential: false,
      addFormRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        idCard: [{ required: true, message: "请输入身份证号", trigger: "blur" }],
        integralNumber: [{ required: true, message: "请输入积分", trigger: "blur" }],
        integralYear: [{ required: true, message: "请选择年度", trigger: "change" }],
      },
      editflag: false,
      current: "0",
      gxfloor: [],
      xqdialog: false,
      detailform: {},
      multion: [],
      formItemKey: 0,
    };
  },
  mounted() {
    this.getlist(1);
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
        name:this.filters.name,
        idCard:this.filters.idCard,
        integralStartNumber: this.filters.integralStartNumber,
        integralEndNumber:this.filters.integralEndNumber,
        integralYear:this.filters.integralYear,
        pageSize: this.filters.size,
        pageNum: this.filters.current,
        orderByColumn:this.filters.orderByColumn,
        isAsc:this.filters.isAsc
      };
      if (val) {
        para.pageNum = val;
        this.currentPage1 = val;
      }
      integralList(para).then((res) => {
        console.log('----获取列表----')
        console.log(res)
        console.log('----获取列表----')
        this.datalist = res.data.rows;
        this.total = res.data.total;
      });
    },
    // 重置
    resetForm: function (filters) {
      this.$refs.filters.resetFields();
      this.filters = {
        name:'',
        idCard:'',
        integralStartNumber:'',
        integralEndNumber:'',
        integralYear:'',
        size: 10,
        current: 1,
      };
      this.getlist(1);
    },
     resetQuery() {
      this.$refs.table.sort('viewNum','descending');
    },
    sortChange(row) {
      const { column, prop, order } = row;
      if(order=='descending'){
        this.filters.isAsc="desc"
      }else if(order=='ascending'){
        this.filters.isAsc="asc"
      }
      this.filters.orderByColumn=prop
      // 列表查询方法
      this.getlist();
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
    // 删除 确定
    visibleDelSubmit(id) {
      integralDelete(id).then((res) => {
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
        this.$refs[id].doClose();
        this.getlist(1);
      });
    },
    // 新增
    handleAdd: function () {
      this.adddialog = true;
      this.diatitle = "添加积分信息";
      this.addForm = {
       integralId:'',
        name:'',
        idCard:'',
        integralYear:'',
        integralNumber:''
      };
      this.gxfloor = [];

      this.editflag = false;
    },
    // 编辑
    handlEdit: function (row) {
      this.adddialog = true;
      this.diatitle = "编辑积分信息";
      this.getDetail(row.integralId);
    },
    // 详情
    handleDetail: function (row) {
      this.xqdialog = true;
      this.getDetail(row.integralId);
    },
    // 详情接口
    getDetail: function (id) {
      integralQuery(id).then((res) => {
        console.log(res.data.data, "101001");
        this.detailform = res.data.data;
        this.addForm = res.data.data;
        
      });
    },
    // 导入
    handleimport: function () {
      let file = this.$refs.filebox.files[0];
      var random = new Date().getTime().toString();
      let formData = new FormData();
      formData.append("file", file);
      axios
        .post("/system/integral/import?t=" + random, formData, {
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
        this.$refs.filebox.value = '';
    },
    // 勾选
    handlegx: function (data) {
      console.log(data, "00101");
      this.multion = [];
      for (var i = 0; i < data.length; i++) {
        this.multion.push(data[i].integralId);
      }
      console.log(this.multion);
    },
    // 导出
    handlexport: function () {
      if (this.multion.length > 0) {
        let url =
          "/system/integral/export?id=" +this.multion.join(',');
        this.comjs.downfile(url);
      } else {
        this.$message({
          message: "至少勾选一条数据",
          type: "info",
        });
      }
    },
    // 取消
    handlecancel: function (type) {
      if (type == "0") {
        this.adddialog = false;
        this.addForm = {
          integralId:'',
        name:'',
        idCard:'',
        integralYear:'',
        integralNumber:''
        };
      } 
    },
    // 保存
    handleSubmit: function () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          let para = {
            integralId: this.addForm.integralId,
            name: this.addForm.name,
            idCard: this.addForm.idCard,
            integralYear: this.addForm.integralYear,
            integralNumber: this.addForm.integralNumber,
            populationType: this.addForm.populationType,
            houseNumber	: this.addForm.houseNumber
          };
          if (this.addForm.integralId) {
            integralUpdate(para).then((res) => {
              if (res.code == "200") {
                this.$message({
                  message: res.msg,
                  type: "success",
                });
              } else {
                this.$message({
                  message: res.msg,
                  type: "error",
                });
              }
              this.$refs.addForm.resetFields();
              this.adddialog = false;
              this.getlist(1);
            });
          } else {
            integralAdd(para).then((res) => {
              if (res.code == "200") {
                this.$message({
                  message: res.msg,
                  type: "success",
                });
              } else {
                this.$message({
                  message: res.msg,
                  type: "error",
                });
              }
              this.$refs.addForm.resetFields();
              this.adddialog = false;
              this.getlist(1);
            });
          }
        }
      });
    },
    // 下载导入模版
    handledown: function () {
      let url = "/system/integral/download";
      this.comjs.downfile(url);
    },
  },
};
</script>

<style lang="scss" scoped>
  .xq-infos {
    height: 600px;
    display: flex;
    flex-direction: column;
    padding: 20px 16px;
    box-sizing: border-box;
    gap: 16px;
  }
  .xq-top {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    font-size: 16px;
    color: #333333;
    gap: 16px;
    .xq-top-list {
      display: flex;
      gap: 16px;
      .xq-top-list-name {
        width: 120px;
        text-align: right;
        color: #666666;
      }
      .xq-top-list-lab {
        flex: 1;
      }
    }
  }
  .xq-bottom {
    flex: 1;
    overflow: auto;
    .xq-bottom-title {
      height: 40px;
      line-height: 40px;
      text-align: center;
    }
    // 积分
    .jf-detail {
      display: flex;
      gap: 3px;
      margin-bottom: 3px;
      .jf-detail-left {
        flex: 1;
        padding: 0 26px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .jf-detail-right {
        .jf-detail-item {
          display: flex;
          gap: 3px;
          .jf-detail-name, .jf-detail-count {
            height: 40px;
            line-height: 40px;
            width: 180px;
            text-align: center;
          }
        }
      }
    }
  }
  .bDAF9F8 {
    background: #DAF9F8;
  }
</style>