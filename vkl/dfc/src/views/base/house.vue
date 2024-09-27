<template>
  <div class="g-cont">
    <!-- 房屋信息列表 -->
    <div class="house-lt">
      <span class="hd">房屋信息列表</span>
      <el-form :model="filters" ref="filters" class="house-form">
        <el-form-item label="">
          <el-input
            v-model="filters.name"
            placeholder="输入房屋名称"
          ></el-input>
          <span class="search-btn" @click="getlist">搜索</span>
        </el-form-item>
      </el-form>
      <span class="btn add-house" @click="handleAdd">添加</span>
      <span class="btn down-btn" @click="handledown('0')">下载导入模版</span>
      <span class="btn import-btn">
        <input
          type="file"
          ref="file"
          name="file"
          class="fileipt"
          @change="handleimport($event, '0')"
        />导入
      </span>
      <div class="house-box">
        <span class="name">房屋列表</span>
        <ul class="build-ul">
          <li
            :class="['build-lst', { active: curbuild == index }]"
            v-for="(item, index) in buildlist"
            @click="tabbuild(index)"
            :key="index"
          >
            <i class="build-img"></i>
            <span class="build-name one-line">{{ item.name }}</span>
          </li>
        </ul>
        <el-pagination
          style="margin-right: -22px; float: right"
          background
          small
          :current-page.sync="buildcurrent"
          @current-change="buildcurrentchange"
          :pager-count="5"
          layout="prev, pager, next"
          :total="buildtotal"
        ></el-pagination>
      </div>
    </div>
    <div class="house-rt">
      <div class="info-house">
        <!-- 房屋信息 筛选栏 -->
        <div class="hd">
          <span class="house-title">房屋信息</span>
          <span class="btn del-btn" @click="delbuild" v-if="floors == 0"
            >删除</span
          >
          <span class="btn edit-btn" @click="editbuild">编辑</span>
          <span class="btn add-btn" @click="addfloor">添加楼层</span>
          <span class="btn export-btn" @click="handlexport">导出</span>
          <span class="btn import-btn"
            ><input
              type="file"
              ref="filebox"
              name="file"
              class="fileipt"
              @change="handleimport($event, '1')"
            />导入</span
          >
          <span class="btn down-btn" @click="handledown('1')"
            >下载导入模版</span
          >
        </div>
        <div class="info-cont">
          <img :src="houseVo.houseImgUrl" class="houserimg" />
          <div class="info">
            <div class="info-lst">
              <span class="name">房屋名称</span>
              <span class="lab">{{ houseVo.name }}</span>
            </div>
            <div class="info-lst">
              <span class="name">房屋总面积</span>
              <span class="lab">{{ houseVo.area }}</span>
              <i class="line32"></i>
            </div>
            <div class="info-lst">
              <span class="name">房屋位置</span>
              <span class="lab">{{ houseVo.position }}</span>
              <i class="line32"></i>
            </div>
            <div class="info-lst">
              <span class="name">备注</span>
              <span class="lab">{{ truncatedRemarks }}</span>
              <i class="line32"></i>
            </div>
          </div>
          <div class="info">
            <div class="info-lst1">
              <span class="name">总层数</span>
              <span class="num">{{ houseVo.layers }}</span>
            </div>
            <div class="info-lst1">
              <span class="name">房间数</span>
              <span class="num">{{ houseVo.rooms }}</span>
              <i class="line32"></i>
            </div>
            <div class="info-lst1">
              <span class="name">居住总人口</span>
              <span class="num">{{ houseVo.liveNumber }}</span>
              <i class="line32"></i>
            </div>
            <div class="info-lst1">
              <span class="name">本村人口</span>
              <span class="num">{{ houseVo.villagePopulation }}</span>
              <i class="line32"></i>
            </div>
            <div class="info-lst1">
              <span class="name">来沪人口</span>
              <span class="num">{{ houseVo.foreignPopulation }}</span>
              <i class="line32"></i>
            </div>
            <div class="info-lst1">
              <span class="name">煤气罐</span>
              <span class="num">{{ houseVo.gasTank }}</span>
              <i class="line32"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="house-ul">
        <div
          :class="['house-lst', item.status ? 'active' : '']"
          v-for="(item, index) in sortedItems"
        >
          <div class="hd" @click="tabhouse(index, '0')">
            <span class="house-title">{{ item.floors }}</span>
            <!-- 折叠按钮 -->
            <!-- click.stop:防止点击事件重复 -->
            <img
              src="../../assets/img/botsj.png"
              class="sj-img"
              @click.stop="tabhouse(index, '1')"
            />
            <img
              src="../../assets/img/topsj.png"
              class="sj-img1"
              @click.stop="tabhouse(index, '2')"
            />
            <span
              class="btn del-btn"
              v-if="item.roomListVos.length == '0'"
              @click="delfloor(item)"
              >删除</span
            >
            <span
              class="btn add-btn"
              v-if="item.roomListVos.length == '0'"
              @click="addroom(item)"
              >添加房间</span
            >
          </div>
          <div class="floorbox">
            <div class="floor-lst" v-for="(items, index) in item.roomListVos">
              <span class="floor-name"
                >{{ items.name }}
                <i class="edit-room" @click="editroom(items)">详情</i></span
              >
              <div class="contbox">
                <div class="lst" style="width: 100%">
                  <span class="lab">屋主</span>
                  <img :src="items.avatarUrl" class="owner-img" />{{
                    items.homeOwner
                  }}
                </div>
                <div class="lst">
                  <span class="lab">房屋性质</span>
                  <span class="ct">{{ items.nature }}</span>
                </div>
                <div class="lst oth-lst">
                  <span class="lab">是否出租</span>
                  <span class="ct" v-if="items.leaseStatus == '0'">是</span>
                  <span class="ct" v-else-if="items.leaseStatus == '1'"
                    >否</span
                  >
                  <span class="ct" v-else="">/</span>
                </div>
                <div class="lst">
                  <span class="lab">居住人数</span>
                  <span class="num">{{ items.liveNumber }}</span>
                </div>
                <div class="lst oth-lst">
                  <span class="lab">面积</span>
                  <span class="num">{{ items.area }}</span>
                </div>
              </div>
            </div>
            <div class="floor-lst">
              <img
                src="../../assets/img/addhourse.png"
                class="add-houimg"
                @click="addroom(item)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 添加房屋 -->
    <el-dialog
      :visible.sync="adddialog"
      v-if="adddialog"
      class="g-dialog"
      :title="diatitle"
    >
      <div :class="['addbox', roomflag ? 'showroom' : 'hideroom']">
        <div class="lt">
          <div class="gj-box">
            <div class="gj-lst" style="width: 50%">
              <img src="../../assets/img/id.png" class="img" />
              <span class="num">{{ addForm.houseId }}</span>
              <span class="type">ID</span>
            </div>
            <div class="gj-lst" style="width: 50%">
              <img src="../../assets/img/sj.png" class="img" />
              <span class="num">{{ addForm.createTime }}</span>
              <span class="type">发起时间</span>
            </div>
          </div>
          <el-form
            :model="addForm"
            :inline="true"
            ref="addForm"
            :rules="addFormRules"
            class="addform add-signcent"
          >
            <el-form-item label="房屋名称" prop="name">
              <el-input
                v-model="addForm.name"
                placeholder="请输入房屋名称"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="房屋坐标系"
              prop="longitudeAndLatitude"
              style="position: relative"
            >
              <el-input
                type="textarea"
                v-model="addForm.longitudeAndLatitude"
                placeholder="请输入坐标系"
              ></el-input>
            </el-form-item>
            <!-- <el-form-item
              label="位置"
              prop="position"
              style="position: relative"
            >
              <el-input
                v-model="addForm.position"
                placeholder="请选择位置"
              ></el-input>
              <div class="areasite" @click="choosedt">
                <img src="../../assets/img/site.png" class="site-img" />地图选点
              </div>
            </el-form-item> -->
            <el-form-item
              label="照片"
              prop="houseImg"
              class="delbgimg"
              :key="formItemKey"
            >
              <div
                class="upimgbox"
                :style="{ backgroundImage: 'url(' + addForm.houseImgUrl + ')' }"
              >
                <input
                  ref="file"
                  type="file"
                  class="file"
                  @change="choosefile($event, '0')"
                />
              </div>
              <i class="del-tip1" v-if="editflag" @click="handlesyimg('0')"
                >删除</i
              >
            </el-form-item>
            <el-form-item label="出租方式" prop="wholeRent">
              <el-radio v-model="addForm.wholeRent" label="0">自住</el-radio>
              <el-radio v-model="addForm.wholeRent" label="1">自租</el-radio>
              <el-radio v-model="addForm.wholeRent" label="2">部分二房东转租</el-radio>
              <el-radio v-model="addForm.wholeRent" label="3">整栋二房东转租</el-radio>
            </el-form-item>
            <el-form-item label="房屋标注坐标" prop="labelingCoordinates">
              <el-input
                v-model="addForm.labelingCoordinates"
                placeholder="请输入房屋标注坐标"
              ></el-input>
            </el-form-item>
            <el-form-item label="房屋总面积" prop="area">
              <el-input
                v-model="addForm.area"
                placeholder="请输入房屋总面积"
              ></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remarks">
              <el-input
                type="textarea"
                v-model="addForm.remarks"
                placeholder="请输入备注"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="editbox">
          <span class="edit-tip">房屋日志</span>
          <ul class="record-box">
            <li class="record-lst" v-for="(item, index) in recordlist">
              <i class="line"></i>
              <span class="dot"></span>
              <div class="rec-rt" v-if="item.operType == '1'">
                <span class="button">新增</span>
                <div class="inf">
                  <img :src="item.actionUserAvatar" class="avater" />{{
                    item.actionUserName
                  }}
                </div>
                <span class="bbh">{{ item.createTime }}</span>
              </div>
              <div class="rec-rt" v-if="item.operType == '2'">
                <span class="button">修改</span>
                <div class="inf">
                  <img :src="item.actionUserAvatar" class="avater" />{{
                    item.actionUserName
                  }}
                </div>
                <span class="bbh">{{ item.updateTime }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="dialog-foot">
        <span class="btn-cancel" @click="handlecancel('0')">取消</span>
        <span class="btn-save" @click="handleSave">保存</span>
      </div>
    </el-dialog>
    <!-- 地图 -->
    <el-dialog
      :visible.sync="dtdialog"
      v-if="dtdialog"
      class="g-dialog"
      title="房屋添加"
    >
      <span class="sitename">位置：{{ addForm.position }}</span>
      <div class="hqzdt">
        <baidu-map
          style="height: 100%"
          :center="mapCenter"
          :zoom="mapZoom"
          :scroll-wheel-zoom="true"
          ak="baidu-ak"
          @ready="handlerBMap"
          @click="getClickInfo"
        />
      </div>
      <div class="dialog-foot">
        <span class="btn-cancel" @click="handlecancel('2')">取消</span>
        <span class="btn-save" @click="dtclose">确定</span>
      </div>
    </el-dialog>
    <!-- 房间 -->
    <el-dialog
      :visible.sync="roomdialog"
      v-if="roomdialog"
      class="g-dialog"
      :title="roomtitle"
      @close="closeRoomd"
    >
      <div :class="['addbox', roomflag ? 'showroom' : 'hideroom']">
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
          <!-- 新增、编辑 -->
          <el-form
            label-position="left"
            :model="roomform"
            :inline="true"
            ref="roomform"
            :rules="roomformRules"
            class="addform add-roomform"
          >
            <el-form-item label="房屋名称" prop="">
              <span class="val1">{{ homeName }}</span>
            </el-form-item>
            <el-form-item label="楼层" prop="">
              <span class="val1">{{ floors }}</span>
            </el-form-item>
            <el-form-item label="房间编号" prop="roomNo">
              <el-input
                v-model="roomform.roomNo"
                placeholder="请输入房间编号"
                v-if="xqflag"
              ></el-input>
              <span class="val1" v-if="!xqflag">{{ roomform.roomNo }}</span>
            </el-form-item>
            <el-form-item
              label="照片"
              prop="roomImg"
              class="delbgimg"
              :key="formItemKey"
            >
              <div v-if="xqflag">
                <div
                  class="upimgbox"
                  :style="{
                    backgroundImage: 'url(' + roomform.roomImgUrl + ')',
                  }"
                >
                  <input
                    ref="file2"
                    type="file"
                    class="file"
                    @change="choosefile($event, '2')"
                  />
                </div>
                <i class="del-tip1" v-if="editflag" @click="handlesyimg('1')"
                  >删除</i
                >
              </div>
              <div
                class="upimgbox"
                :style="{ backgroundImage: 'url(' + roomform.roomImgUrl + ')' }"
                v-if="!xqflag"
              ></div>
            </el-form-item>
            <el-form-item label="房间性质" prop="nature">
              <el-input
                v-model="roomform.nature"
                placeholder="请输入房间性质"
                v-if="xqflag"
              ></el-input>
              <span class="val1" v-if="!xqflag">{{ roomform.nature }}</span>
            </el-form-item>
            <el-form-item>
              <template v-if="!xqflag">
                <el-table
                  :data="roomform.gasTankVoList"
                  border
                  style="width: 100%"
                >
                  <el-table-column
                    prop="brand"
                    label="煤气罐品牌"
                    width="180"
                  />
                  <el-table-column
                    prop="number"
                    label="煤气罐数量"
                    width="180"
                  />
                </el-table>
              </template>
            </el-form-item>
            <!-- 编辑煤气罐 -->
            <div class="jmbox" style="height: 250px" v-if="xqflag">
              <span style="float: left">煤气罐</span>
              <div class="addbtnbox">
                <span class="btn search-btn addbtn" @click="addNewinGastank()"
                  >添加</span
                >
              </div>
              <div class="m-table" style="padding: 0.16667rem">
                <el-table
                  :data="gasEditFrom"
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
                      <!-- 展示 -->
                      <span
                        >{{ scope.$index === editIndex ? '' : scope.row.brand }}
                      </span>
                      <!-- 编辑 -->
                      <el-input
                        style="width: 30px"
                        v-if="scope.$index === editIndex && editFlag"
                        v-model="gastankEditBrand"
                      >
                      </el-input>
                      <!-- 新增 -->
                      <el-input
                        style="width: 30px"
                        v-if="
                          gasEditFrom.length - 1 == scope.$index && Gastankflag
                        "
                        v-model="gastankAddForm.brand"
                        placeholder="请输入品牌"
                      ></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="数量" prop="number">
                    <template slot-scope="scope">
                      <!-- 展示 -->
                      <span
                        >{{
                          scope.$index === editIndex ? '' : scope.row.number
                        }}
                      </span>
                      <!-- 编辑 -->
                      <el-input
                        type="number"
                        min="0"
                        style="width: 20px"
                        v-if="scope.$index === editIndex && editFlag"
                        v-model="gastankEditNumber"
                      >
                      </el-input>
                      <!-- 新增 -->
                      <el-input
                        type="number"
                        style="width: 20px"
                        v-if="
                          gasEditFrom.length - 1 == scope.$index && Gastankflag
                        "
                        v-model="gastankAddForm.number"
                        placeholder="请输入数量"
                      ></el-input>
                    </template>
                  </el-table-column>

                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <span
                        class="detail-title"
                        v-if="
                          gasEditFrom.length - scope.$index != 1 || !Gastankflag
                        "
                        @click="
                          editFlag
                            ? saveEdit(scope.row, scope.$index)
                            : editGastank(scope.row, scope.$index)
                        "
                      >
                        {{
                          editFlag && scope.$index === editIndex
                            ? '保存'
                            : '编辑'
                        }}
                        &nbsp;&nbsp;</span
                      >
                      <span
                        class="detail-title"
                        v-if="
                          gasEditFrom.length - scope.$index != 1 || !Gastankflag
                        "
                        @click="deleteGastank(scope.row, scope.$index)"
                        >删除</span
                      >
                      <span
                        class="detail-title"
                        v-if="
                          gasEditFrom.length - scope.$index == 1 && Gastankflag
                        "
                        @click="addGastank(scope.row)"
                        >保存&nbsp;&nbsp;</span
                      >
                      <span
                        class="detail-title"
                        v-if="
                          gasEditFrom.length - scope.$index == 1 && Gastankflag
                        "
                        @click="resetGastankAddForm(scope.row)"
                        >重置</span
                      >
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <!-- <el-form-item
              style="width: 320px !important"
              label="煤气罐数量"
              prop="gasTank"
            >
              <el-input
                style="width: 180px"
                class="gastankStyle"
                v-model="roomform.gasTank"
                placeholder="请输入煤气罐数量"
                v-if="xqflag"
              ></el-input>
              <span class="val1" v-if="!xqflag">{{ roomform.gasTank }}</span>
            </el-form-item>
            <el-form-item
              style="width: 320px !important"
              label="煤气罐品牌"
              prop="gasTank"
            >
              <el-input
                style="width: 180px"
                class="gastankStyle"
                v-model="roomform.brand"
                placeholder="请输入煤气罐品牌"
                v-if="xqflag"
              ></el-input>
              <span class="val1" v-if="!xqflag">{{ roomform.brand }}</span>
            </el-form-item> -->

            <el-form-item label="房屋面积" prop="area">
              <el-input
                v-model="roomform.area"
                placeholder="请输入房屋总面积"
                v-if="xqflag"
              ></el-input>
              <span class="val1" v-if="!xqflag">{{ roomform.area }}</span>
            </el-form-item>
            <el-form-item label="是否出租" prop="leaseStatus">
              <div class="" v-if="xqflag">
                <div
                  :class="[
                    'radio-lst',
                    { active: roomform.leaseStatus == '0' },
                  ]"
                  @click="handletabtype('0')"
                >
                  <i class="dot"></i> 是
                </div>
                <div
                  :class="[
                    'radio-lst',
                    { active: roomform.leaseStatus == '1' },
                  ]"
                  @click="handletabtype('1')"
                >
                  <i class="dot"></i> 否
                </div>
              </div>
              <div class="" v-if="!xqflag">
                <div
                  :class="[
                    'radio-lst',
                    { active: roomform.leaseStatus == '0' },
                  ]"
                >
                  <i class="dot"></i> 是
                </div>
                <div
                  :class="[
                    'radio-lst',
                    { active: roomform.leaseStatus == '1' },
                  ]"
                >
                  <i class="dot"></i> 否
                </div>
              </div>
            </el-form-item>
            <el-form-item label="屋主" prop="homeOwner">
              <div class="" v-if="xqflag">
                <span class="gl-btn" @click="addjm('0')">添加屋主</span>
                <i class="f-clearfix"></i>
                <div class="choose-box" v-if="roomform.homeOwner">
                  <div class="choose-lst">
                    <span class="choose-name">{{ roomform.homeOwner }}</span>
                    <span class="choose-id"
                      >&nbsp;&nbsp;{{ roomform.idCard }}</span
                    >
                    <span class="del" @click="deltype('', '0')">X</span>
                  </div>
                </div>
              </div>
              <div class="" v-if="!xqflag">
                <div class="choose-box" v-if="roomform.homeOwner">
                  <div class="choose-lst">
                    <span class="choose-name">{{ roomform.homeOwner }}</span>
                    <span class="choose-id"
                      >&nbsp;&nbsp;{{ roomform.idCard }}</span
                    >
                  </div>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="二房东" prop="">
              <div class="" v-if="xqflag">
                <span class="gl-btn" @click="handleChooseLandlord"
                  >添加居民</span
                >
                <i class="f-clearfix"></i>
                <div class="choose-box" v-if="roomform.mesneLandlordId">
                  <div class="choose-lst">
                    <span class="choose-name">{{
                      roomform.mesneLandlordName
                    }}</span>
                    <span class="choose-id"
                      >&nbsp;&nbsp;{{ roomform.mesneLandlordIdCard }}</span
                    >
                    <span class="del" @click="delTHouse">X</span>
                  </div>
                </div>
              </div>
              <div class="" v-if="!xqflag">
                <div class="choose-box" v-if="roomform.mesneLandlordId">
                  <div class="choose-lst">
                    <span class="choose-name">{{
                      roomform.mesneLandlordName
                    }}</span>
                    <span class="choose-id"
                      >&nbsp;&nbsp;{{ roomform.mesneLandlordIdCard }}</span
                    >
                  </div>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="居住人员" prop="">
              <div class="" v-if="xqflag">
                <span class="gl-btn" @click="addjm('1')">添加居民</span>
                <i class="f-clearfix"></i>
                <div class="choose-box">
                  <div
                    class="choose-lst"
                    v-for="(item, index) in roomLive"
                    :key="item.id"
                  >
                    <span class="choose-name">{{ item.name }}</span>
                    <span class="choose-id">&nbsp;&nbsp;{{ item.idCard }}</span>
                    <span class="del" @click="deltype(index, '1')">X</span>
                  </div>
                </div>
              </div>
              <div class="" v-if="!xqflag">
                <div class="choose-box">
                  <div
                    class="choose-lst"
                    v-for="(item, index) in roomform.roomLive"
                  >
                    <span class="choose-name">{{ item.name }}</span>
                    <span class="choose-id">&nbsp;&nbsp;{{ item.idCard }}</span>
                  </div>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="车辆" prop="">
              <div class="" v-if="xqflag">
                <!-- <span class="gl-btn" @click="addcar">添加车辆</span> -->
                <i class="f-clearfix"></i>
                <div class="choose-box">
                  <div class="choose-lst" v-for="(item, index) in vehicleNo">
                    <span class="choose-id">{{ item }}</span>
                  </div>
                </div>
                <!-- <div class="choose-box">
                  <div class="choose-lst" v-for="(item, index) in vehiclelist">
                    <span class="choose-id">{{ item }}</span>
                  </div>
                </div> -->
              </div>
              <div class="" v-if="!xqflag">
                <div class="choose-box">
                  <div class="choose-lst" v-for="(item, index) in vehiclelist">
                    <span class="choose-id">{{ item }}</span>
                  </div>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input
                type="textarea"
                v-model="roomform.remark"
                placeholder="请输入备注"
                v-if="xqflag"
              ></el-input>
              <span class="val1" v-if="!xqflag">{{ roomform.remark }}</span>
            </el-form-item>
            <el-form-item label="附件" prop="">
              <div class="" v-if="xqflag">
                <div class="czbox">
                  <div class="filebox">
                    <input
                      type="file"
                      ref="file1"
                      class="file1"
                      @change="choosefile($event, '1')"
                    />
                    <span class="upfile-btn">选择上传文件</span>
                  </div>
                  <span class="tip-gray">文件不能超过5MB</span>
                </div>
                <i class="f-clearfix"></i>
                <ul class="file-ul">
                  <li
                    class="file-li"
                    v-for="(item, index) in filelist"
                    @click="handdelfile(index)"
                  >
                    <img src="../../assets/img/file.png" class="fileimg" />{{
                      item.name
                    }}
                    <span class="delfile">删除</span>
                  </li>
                </ul>
              </div>
              <ul class="file-ul" v-if="!xqflag">
                <li class="file-li" v-for="(item, index) in filelist">
                  <img src="../../assets/img/file.png" class="fileimg" />{{
                    item.name
                  }}
                </li>
              </ul>
            </el-form-item>
          </el-form>
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
      <div :class="['dialog-foot', delflag ? 'three-btn' : '']">
        <span class="btn-cancel" @click="handlecancel('3')">取消</span>
        <span
          class="btn-save"
          v-if="xqflag"
          @click="handleaddroom"
          style="margin-left: 0.15625rem"
          >保存</span
        >
        <span
          class="btn-save"
          v-if="!xqflag"
          style="margin-left: 0.15625rem"
          @click="handledit"
          >编辑</span
        >
        <span class="btn-cx" @click="handledelroom" v-if="delflag">删除</span>
      </div>
    </el-dialog>
    <!-- 屋主 -->
    <el-dialog
      :visible.sync="wzdialog"
      v-if="wzdialog"
      class="g-dialog"
      title="选择居民"
      @close="closeWzd"
    >
      <div class="jmbox">
        <div class="m-search">
          <el-form :model="wzfilters" :inline="true" ref="wzfilters">
            <el-form-item label="姓名/户主姓名" prop="">
              <el-input
                v-model="wzfilters.name"
                placeholder="姓名/户主姓名"
              ></el-input>
            </el-form-item>
            <el-form-item label="标签" prop="">
              <el-input v-model="wzfilters.tags" placeholder="标签"></el-input>
            </el-form-item>
            <div class="search-btnbox">
              <span class="btn search-btn" @click="getwz()">查询</span>
              <span class="btn reset-btn" @click="resetjm('wzfilters')"
                >重置</span
              >
            </div>
          </el-form>
        </div>
        <div class="m-table">
          <el-table
            :data="wzlist"
            ref="multipleTable"
            highlight-current-row
            v-loading="listLoading"
            style="width: 100%"
            border
            :row-class-name="tableRowClassName"
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }"
            @selection-change="select"
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
            <el-table-column label="是否外来人员" prop="">
              <template slot-scope="scope">
                <span class="f-blue" v-if="scope.row.outsider == '0'">是</span>
                <span class="f-gray" v-else-if="scope.row.outsider == '1'"
                  >否</span
                >
                <span v-else="">/</span>
              </template>
            </el-table-column>
            <el-table-column label="居住房屋" prop="room"> </el-table-column>
            <el-table-column label="标签" prop="" width="200">
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
      </div>
      <div class="dialog-foot">
        <span class="btn-cancel" @click="handlecancel('1')">取消</span>
        <span class="btn-save" @click="handlejmsubmit1">确定</span>
      </div>
    </el-dialog>
    <!-- 居民 -->
    <el-dialog
      :visible.sync="jmdialog"
      v-if="jmdialog"
      class="g-dialog"
      title="选择居民"
      @close="closeJmd"
    >
      <div class="jmbox">
        <div class="m-search">
          <el-form :model="jmfilters" :inline="true" ref="jmfilters">
            <el-form-item label="姓名/户主姓名" prop="">
              <el-input
                v-model="jmfilters.name"
                placeholder="姓名/户主姓名"
              ></el-input>
            </el-form-item>
            <el-form-item label="标签" prop="">
              <el-input v-model="jmfilters.tags" placeholder="标签"></el-input>
            </el-form-item>
            <div class="search-btnbox">
              <span class="btn search-btn" @click="getjm()">查询</span>
              <span class="btn reset-btn" @click="resetjm('jmfilters')"
                >重置</span
              >
            </div>
          </el-form>
        </div>
        <div class="m-table">
          <el-table
            :data="jmlist"
            ref="multipleTable"
            highlight-current-row
            v-loading="listLoading"
            style="width: 100%"
            border
            :row-class-name="tableRowClassName"
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }"
            @select="handleselect"
            @select-all="selectAll"
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
            <el-table-column label="是否外来人员" prop="">
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
              @size-change="handleSizeChange1"
              @current-change="handleCurrentChange1"
              :current-page="currentPage2"
              :page-size="pagesize1"
              layout="prev, pager, next"
              :current-page.sync="currentPage3"
              prev-text="上一页"
              next-text="下一页"
              :total="total1"
            >
            </el-pagination>
            <i class="total">共有{{ total1 }}条数据</i>
          </div>
        </div>
      </div>
      <div class="dialog-foot">
        <span class="btn-cancel" @click="handlecancel('4')">取消</span>
        <span class="btn-save" @click="handlejmsubmit">确定</span>
      </div>
    </el-dialog>
    <!-- 车辆 -->
    <el-dialog
      :visible.sync="cardialog"
      v-if="cardialog"
      class="g-dialog"
      title="选择车辆"
      @close="closeCard"
    >
      <div class="jmbox">
        <div class="m-search">
          <el-form :model="carfilters" :inline="true" ref="carfilters">
            <el-form-item label="车牌号" prop="vehicleNo">
              <el-input
                v-model="carfilters.vehicleNo"
                placeholder="车牌号"
              ></el-input>
            </el-form-item>
            <el-form-item label="所有人" prop="vehicleOwner">
              <el-input
                v-model="carfilters.vehicleOwner"
                placeholder="所有人"
              ></el-input>
            </el-form-item>
            <div class="search-btnbox">
              <span class="btn search-btn" @click="getcar">查询</span>
              <span class="btn reset-btn" @click="resetcarform('carfilters')"
                >重置</span
              >
            </div>
          </el-form>
        </div>
        <div class="m-table">
          <el-table
            :data="carlist"
            ref="multipleTable"
            highlight-current-row
            v-loading="listLoading"
            style="width: 100%"
            border
            :row-class-name="tableRowClassName"
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }"
            @selection-change="choosecar"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="ID" prop="vehicleId" width="80">
            </el-table-column>
            <el-table-column label="车辆所有人" prop="vehicleOwner">
            </el-table-column>
            <el-table-column label="车牌号" prop="vehicleNo"> </el-table-column>
            <el-table-column
              label="车辆类型"
              prop="type"
              :formatter="cartypeformat"
            >
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="dialog-foot">
        <span class="btn-cancel" @click="handlecancel('5')">取消</span>
        <span class="btn-save" @click="handlecarsubmit">确定</span>
      </div>
    </el-dialog>

    <!-- 二房东-居民选择 -->
    <add-resident
      :jmdialog="addLandlord"
      @handleCloseAdd="handleCloseAdd"
      @handleAddResident="handleAddResident"
    />
  </div>
</template>

<script>
import {
  HouseList,
  AddHouse,
  UpdateHouse,
  DelHouse,
  HousefindById,
  AddFloor,
  DelFloor,
  ResidentList,
  VehicleListInfo,
  DictType,
  AddRoom,
  UpdateRoom,
  RoomfindById,
  DeleteRoom,
  OwnerList,
  CarfindById,
} from '../../api/api.js'
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import AddResident from './rhouse/addResident.vue'
import axios from 'axios'
import { number } from 'echarts'

export default {
  components: { BaiduMap, AddResident },
  data() {
    return {
      filters: {
        name: '',
      },
      buildlist: [],
      curbuild: '0',
      houseVo: {}, //当前栋的基本信息
      houselist: [], //层数
      houseId: '', //楼id
      floors: '', //楼层数
      homeName: '', //房间名
      current: '',
      adddialog: false, //新增弹窗
      diatitle: '',
      addForm: {
        houseId: '',
        name: '',
        longitudeAndLatitude: '',
        houseImg: '',
        houseImgUrl: '',
        area: '',
        remarks: '',
        labelingCoordinates:'',
        wholeRent:'0',
      },
      editflag: false,

      addFormRules: {
        name: [{ required: true, message: '请输入房屋名称', trigger: 'blur' }],
      },

      recordlist: [], //日志

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
      roomflag: true,
      roomdialog: false,
      roomtitle: '添加房间',
      roomform: {
        homeName: '', //房间名
        floors: '', //楼层
        houseId: '', // 房屋id
        roomId: '', //房间id
        roomNo: '', // 房间编号
        roomImgUrl: '',
        roomImg: '',
        gasTank: '',
        brand: '',
        area: '', // 面积
        leaseStatus: '', //是否出租
        homeOwner: '', //屋主
        residentId: '',
        idCard: '', //身份证号
        roomLive: [], //居住人
        vehicleName: '', //车辆
        remark: '', //备注
        roomFile: '', //附件
        nature: '',
      },
      roomLive: [],
      roomformRules: {
        roomNo: [
          { required: true, message: '请输入房间编号', trigger: 'blur' },
        ],
        leaseStatus: [
          { required: true, message: '请选择是否出租', trigger: 'blur' },
        ],
      },
      filelist: [],
      jmdialog: false,
      jmlist: [],
      jmfilters: {
        name: '',
        tags: '',
        size: 10,
        current: 1,
      },
      choosetype: '',
      drflag: true, //
      listLoading: false,
      cardialog: false,
      carfilters: {
        vehicleNo: '',
        vehicleOwner: '',
      },
      carlist: [],
      vehiclelist: [],
      loglist: [],
      delflag: false,
      roomId: '',
      xqflag: false,
      formItemKey: 0,
      currentPage2: 1,
      currentPage3: 1,
      currentPage: 1,
      currentPage1: 1,
      pagesize: 10,
      pagesize1: 10,
      total: 0,
      total1: 0,
      wzdialog: false,
      wzfilters: {
        name: '',
        tags: '',
        size: 10,
        current: 1,
      },
      wzlist: [],
      jmselet: [],
      buildcurrent: 1, //房屋列表当前页
      buildtotal: 0, //房屋列表总数
      addLandlord: false,
      gastankAddForm: {
        number: '',
        brand: '',
      },
      gastankDetail: [],
      Gastankflag: false,
      editFlag: false,
      editIndex: '',
      gasEditFrom: [],
      gastankEdit: {},
      gastankEditBrand: '',
      gastankEditNumber: '',
      liveForm: [],
      tabIndex: 0,
      vehicleNo: [],
    }
  },
  mounted() {
    this.getlist()
    this.getdict('car_type')
    this.getcar()
  },
  computed: {
    truncatedRemarks() {
      const maxLength = 20
      const remarks = this.houseVo.remarks

      if (remarks && remarks.length > maxLength) {
        // 如果超过20字，则截取前20个字符并加上省略号
        return remarks.substring(0, maxLength) + '…'
      } else {
        // 如果未超过20字，则直接显示内容
        return remarks
      }
    },
    sortedItems() {
      return this.houselist.sort((a, b) => {
        const floorA = parseInt(a.floors.replace('层', ''))
        const floorB = parseInt(b.floors.replace('层', ''))
        return floorA - floorB
      })
    },
  },
  methods: {
    // 编辑房屋
    handledit: function () {
      this.roomtitle = '编辑房间' // todo
      this.xqflag = true
      this.gasEditFrom = this.roomform.gasTankVoList
      this.roomLive = this.roomform.roomLive
    },
    // 添加-保存-煤气罐
    addGastank() {
      console.log('添加-保存-煤气罐')
      console.log('this.gastankAddForm', this.gastankAddForm)
      if (this.gastankAddForm.number == '') {
        this.$message({
          message: '未输入煤气罐数量!添加无效!',
          type: 'warning',
        })
        return
      }
      if (this.gastankAddForm.brand == '') {
        this.$message({
          message: '未输入煤气罐品牌!添加无效!',
          type: 'warning',
        })
        return
      }
      this.gasEditFrom.splice(-1, 1)

      this.gasEditFrom.push(this.gastankAddForm)
      this.gastankAddForm = {}
      this.Gastankflag = false
    },
    // 编辑-保存-煤气罐
    saveEdit(row, index) {
      console.log('编辑-保存-煤气罐')

      this.gasEditFrom[index].number = this.gastankEditNumber
      this.gasEditFrom[index].brand = this.gastankEditBrand
      this.editFlag = false
      this.editIndex = ''
    },
    // 编辑-煤气罐
    editGastank(row, index) {
      console.log('编辑-煤气罐')
      this.editFlag = true
      this.editIndex = index
      this.gastankEditNumber = row.number
      this.gastankEditBrand = row.brand
    },
    // 添加-煤气罐
    addNewinGastank() {
      console.log('添加-煤气罐')
      this.gasEditFrom.push({
        brand: '', // 新行品牌为空
        number: '', // 新行数量为空
      })
      this.gasEditFrom.length + 1
      this.Gastankflag = true
    },
    // 删除-煤气罐
    deleteGastank(row, index) {
      this.gasEditFrom.splice(index, 1)
    },
    // 初始化添加煤气罐表单
    resetGastankAddForm() {
      console.log('初始化添加煤气罐表单')
      this.gastankAddForm = {}
    },
    // 单行变色
    tableRowClassName: function (rowIndex) {
      if (rowIndex.rowIndex % 2 != 0) {
        return 'evenRow'
      }
      return 'oddRow'
    },
    // 列表 增加默认刷新和添加后刷新
    getlist: function (isStay) {
      let para = {
        name: this.filters.name,
        pageSize: 10,
        pageNum: this.buildcurrent,
      }
      HouseList(para).then((res) => {
        // this.curbuild = 0
        this.buildlist = res.data.rows
        this.buildtotal = res.data.total
        let houselist = []
        let k = isStay ? this.tabIndex : 0

        if (res.data.rows.length > 0) {
          this.houseVo = res.data.rows[k].houseVo
          // 设置字段默认展开、隐藏
          houselist = res.data.rows[k].basicFloorVos

          this.homeName = res.data.rows[k].name
          this.houseId = res.data.rows[k].houseVo.houseId
          this.floors = res.data.rows[k].houseVo.layers
        }
        // console.log(houselist, "houselisthouselist");
        if (houselist.length > 0) {
          for (var i = 0; i < houselist.length; i++) {
            this.$set(houselist[i], 'status', false)
          }
          houselist[0].status = true //默认第一个展开
        }
        this.houselist = houselist
        // console.log(this.floors, "this.floorsthis.floors");
      })
    },
    buildcurrentchange: function (val) {
      this.buildcurrent = val
      this.getlist()
    },
    // 切换房屋
    tabbuild: function (index) {
      console.log('---????---', index)
      this.tabIndex = index //当前选中的tab
      console.log(this.buildlist[index], '当前数据')
      this.curbuild = index
      this.houseVo = this.buildlist[index].houseVo
      let houselist = this.buildlist[index].basicFloorVos
      this.houseId = this.buildlist[index].houseVo.houseId
      this.floors = this.buildlist[index].houseVo.layers
      this.homeName = this.buildlist[index].name
      if (houselist.length > 0) {
        for (var i = 0; i < houselist.length; i++) {
          this.$set(houselist[i], 'status', false)
        }
        houselist[0].status = true //默认第一个展开
      }
      this.houselist = houselist
    },
    // 新增房屋
    handleAdd: function () {
      this.adddialog = true
      this.diatitle = '新增房屋'
      this.addForm = {
        houseId: '',
        name: '',
        position: '',
        houseImg: '',
        houseImgUrl: "url('../img/empty.png') no-repeat",
        area: '',
        remarks: '',
      }
      this.roomflag = true
      this.editflag = false
    },
    // 图片上传、上传文件
    choosefile: function (event, type) {
      console.log(type)
      let file
      if (type == '0') {
        // 图片上传
        file = this.$refs.file.files[0]
      } else if (type == '1') {
        // 文件上传
        // console.log(this.$refs.file1.files[0])
        if (this.$refs.file1.files[0].size > 1024 * 1024 * 5) {
          this.$message({
            message: '文件大小不能超过5M',
            type: 'error',
          })
          return
        }
        file = this.$refs.file1.files[0]
      } else {
        file = this.$refs.file2.files[0]
      }
      console.log(file, '010100')
      this.uploadfile(file, type)
    },
    // 文件上传后获取数据
    uploadfile: function (data, type) {
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
            console.log(res, '10101010')
            if (type == '0') {
              // 图片上传后
              this.addForm.houseImg = res.data.data.ossId
              this.addForm.houseImgUrl = res.data.data.url
              this.editflag = true
            } else if (type == '1') {
              this.filelist.push({
                name: res.data.data.fileName,
                url: res.data.data.url,
                ossId: res.data.data.ossId,
              })
            } else {
              // 图片上传后
              this.roomform.roomImg = res.data.data.ossId
              this.roomform.roomImgUrl = res.data.data.url
              this.editflag = true
            }
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
    // 删除图片
    handlesyimg: function (type) {
      if (type == '0') {
        this.addForm.houseImgUrl = require('@/assets/img/empty.png')
        this.addForm.houseImg = ''
        this.editflag = false
        // 更新key，强制el-form-item 重新渲染
        this.formItemKey += 1
      } else {
        this.roomform.roomImgUrl = require('@/assets/img/empty.png')
        this.roomform.roomImg = ''
        this.editflag = false
        // 更新key，强制el-form-item 重新渲染
        this.formItemKey += 1
      }
    },
    // 删除文件
    handdelfile: function (index) {
      this.filelist.splice(index, 1)
    },
    // 下载导入模版
    handledown: function (type) {
      if (type == '0') {
        //房屋的导入
        let url = '/basic/house/download'
        this.comjs.downfile(url)
      } else {
        // 房间的导入
        let url = 'basic/room/download'
        this.comjs.downfile(url)
      }
    },
    // 导入
    handleimport: function (event, type) {
      console.log(this.$refs.file.value)
      if (type == '0') {
        // 房屋的导入
        let file = this.$refs.file.files[0]
        console.log(this.$refs.file)
        let formData = new FormData()
        formData.append('file', file)
        axios
          .post('/basic/house/import', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
          })
          .then((res) => {
            // debugger
            if (res.data.code == 200) {
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
            this.getlist()
          })
          .catch((res) => {
            console.log(res, '2')
          })
        this.$refs.file.value = ''
      } else {
        // 房间的导入
        let file = this.$refs.filebox.files[0]
        let formData = new FormData()
        formData.append('file', file)
        axios
          .post('/basic/room/import', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
          })
          .then((res) => {
            // debugger
            if (res.data.code == 200) {
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
            this.getlist()
          })
          .catch((res) => {
            console.log(res, '2')
          })
        this.$refs.filebox.value = ''
      }
      console.log(this.$refs.file.value)
    },
    // 导出
    handlexport: function () {
      let url = '/basic/room/export?houseId=' + this.houseId
      this.comjs.downfile(url)
    },
    // 编辑
    editbuild: function () {
      this.adddialog = true
      this.diatitle = '编辑房屋'
      this.roomflag = false
      this.getbuilddetai()
    },
    // 房屋详情
    getbuilddetai: function () {
      console.log('---房屋详情---')
      let para = this.houseId
      HousefindById(para).then((res) => {
        this.addForm = res.data.data
        this.recordlist = res.data.data.logList
        if (
          this.addForm.houseImgUrl == null ||
          this.addForm.houseImgUrl == ''
        ) {
          this.addForm.houseImgUrl = require('@/assets/img/empty.png')
          this.addForm.houseImg = ''
          this.editflag = false
        } else {
          this.editflag = true
        }
      })
    },
    // 删除房屋
    delbuild: function () {
      let para = this.houseId
      DelHouse(para).then((res) => {
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
        this.getlist()
      })
    },
    // 添加楼层
    addfloor: function () {
      let para = {
        houseId: this.houseId,
      }
      console.log(para, '10100')
      AddFloor(para).then((res) => {
        console.log(res, '添加楼层')
        if (res.data.code == '200') {
          this.$message({
            message: res.data.msg,
            type: 'success',
          })
          // this.tabbuild(this.tabIndex)
        } else {
          this.$message({
            message: res.data.msg,
            type: 'error',
          })
        }
        let isStay = true
        this.getlist(isStay)
        this.tabbuild(this.tabIndex)
      })
    },
    // 删除楼层
    delfloor: function (data) {
      let para = {
        houseId: this.houseId,
        floors: data.floors,
      }
      DelFloor(para).then((res) => {
        console.log(res, '删除楼层')
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
        this.getlist()
      })
    },
    // 初始化地图
    handlerBMap: function ({ BMap, map }) {
      var point = new BMap.Point(121.7057, 31.232451) //青原
      map.centerAndZoom(point, 13)
      var marker = new BMap.Marker(point) // 创建标注
      map.addOverlay(marker) // 将标注添加到地图中
    },
    // 切换折叠
    tabhouse: function (index, type) {
      // debugger
      if (type == '0') {
        this.houselist[index].status = !this.houselist[index].status
      } else if (type == '1') {
        this.houselist[index].status = false
        return
      } else {
        this.houselist[index].status = true
        return
      }
    },

    // 切换折叠
    handlezt: function (index) {
      // for(var i=0;i<this.houselist.length;i++){
      // 	this.houselist[i].status = false
      // }
      this.houselist[index].status = !this.houselist[index].status
    },

    // 弹窗关闭
    handlecancel: function (type) {
      console.log(type, 'type')
      // debugger
      if (type == '0') {
        // 新增
        this.adddialog = false
      } else if (type == '2') {
        // 地图
        this.dtdialog = false
      } else if (type == '3') {
        // 房屋
        this.roomform = {
          homeName: '', //房间名
          floors: '', //楼层
          houseId: '', // 房屋id
          roomId: '', //房间id
          roomNo: '', // 房间编号
          area: '', // 面积
          leaseStatus: '', //是否出租
          homeOwner: '', //屋主
          idCard: '', //身份证号
          roomLive: [], //居住人
          vehicleName: '', //车辆
          remark: '', //备注
          roomFile: '', //附件
          nature: '',
        }
        this.filelist = []
        this.roomdialog = false
        this.editflag = false
      } else if (type == '4') {
        // 居民
        this.jmfilters = {
          name: '',
          tags: '',
          size: 10,
          current: 1,
        }
        this.jmdialog = false
        this.resetjm('jmfilters')
        // this.roomform.roomLive = [];
      } else if (type == '1') {
        // 屋主
        this.wzfilters = {
          name: '',
          tags: '',
          size: 10,
          current: 1,
        }
        this.wzdialog = false
        this.resetjm('wzfilters')
        this.roomform.homeOwner = ''
        this.roomform.residentId = ''
        this.roomform.idCard = ''
      } else {
        // 车辆
        this.carfilters = {
          vehicleNo: '',
          vehicleOwner: '',
        }
        this.cardialog = false
        this.vehiclelist = []
        this.resetcarform()
      }
    },
    //  新增、编辑房屋
    handleSave: function () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          let para = {
            houseId: this.addForm.houseId,
            name: this.addForm.name,
            longitudeAndLatitude: this.addForm.longitudeAndLatitude,
            houseImg: this.addForm.houseImg,
            area: this.addForm.area,
            remarks: this.addForm.remarks,
            wholeRent:this.addForm.wholeRent,
            labelingCoordinates:this.addForm.labelingCoordinates
          }
          if (this.addForm.houseId) {
            UpdateHouse(para).then((res) => {
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
              // this.curbuild = 0
              this.getlist(1)
            })
          } else {
            AddHouse(para).then((res) => {
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
              this.curbuild = 0
              this.getlist(1)
            })
          }
        }
      })
    },
    // 选择地图
    choosedt: function () {
      this.dtdialog = true
      this.addForm.area = ''
    },
    // 点击获取定位
    getClickInfo: function (e) {
      console.log(e, '101001')
      let point = e.point
      let lng = e.point.lng
      let lat = e.point.lat
      let _this = this
      var geocoder = new BMap.Geocoder()
      geocoder.getLocation(new BMap.Point(lng, lat), function (result) {
        console.log(result)
        _this.addForm.position = result.address
        console.log(_this.addForm.position, '_this.addForm.area ')
      })
    },
    // 地图关闭
    dtclose: function () {
      this.dtdialog = false
      this.$nextTick(() => {
        this.$refs.addForm.validateField('position')
      })
    },
    // 添加二房东
    handleChooseLandlord() {
      this.addLandlord = true
    },
    handleCloseAdd() {
      this.addLandlord = false
    },
    handleAddResident(e) {
      this.roomform.mesneLandlordId = e.residentId
      this.roomform.mesneLandlordName = e.name
      this.roomform.mesneLandlordIdCard = e.idCard
      this.addLandlord = false
    },
    // 删除二房东
    delTHouse() {
      this.roomform.mesneLandlordId = ''
      this.roomform.mesneLandlordName = ''
      this.roomform.mesneLandlordIdCard = ''
    },
    // 添加房间
    addroom: function (data) {
      console.log('---添加房间---')
      this.roomdialog = true
      this.roomflag = true
      this.roomtitle = '添加房间'
      this.roomform = {
        homeName: '', //房间名
        floors: '', //楼层
        houseId: '', // 房屋id
        roomId: '', //房间id
        roomNo: '', // 房间编号
        roomImg: '',
        roomImgUrl: "url('../img/empty.png') no-repeat",
        gasTank: '',
        area: '', // 面积
        leaseStatus: '', //是否出租
        homeOwner: '', //屋主
        residentId: '',
        idCard: '', //身份证号
        roomLive: [], //居住人
        vehicleName: '', //车辆
        remark: '', //备注
        roomFile: '', //附件
        nature: '',
        mesneLandlordId: '', // 二房东ID
        mesneLandlordName: '',
        mesneLandlordIdCard: '',
      }
      this.floors = data.floors //楼层
      this.delflag = false
      this.xqflag = true
    },
    // 关闭事件
    closeRoomd: function () {
      this.editflag = false
      this.Gastankflag = false
      this.gasEditFrom = []
      this.gastankAddForm = {
        number: '',
        brand: '',
      }
      this.roomLive = []
      this.vehiclelist = []
      this.vehicleNo = []
      this.filelist = []
    },
    // 切换是否出租
    handletabtype: function (val) {
      this.roomform.leaseStatus = val
    },
    // 添加居民
    addjm: function (type) {
      if (type == '0') {
        this.wzdialog = true
        this.getwz()
      } else if (type == '1') {
        this.jmdialog = true
        this.getjm()
      }
    },

    // 查看居民
    getjm: function (val) {
      let para = {
        name: this.jmfilters.name,
        tags: this.jmfilters.tags,
        pageSize: this.jmfilters.size,
        pageNum: this.jmfilters.current,
      }
      if (val) {
        para.pageNum = val
        this.currentPage3 = val
      }
      ResidentList(para).then((res) => {
        // debugger
        this.jmlist = res.data.data
        this.total1 = res.data.total
      })
    },
    // 查看屋主
    getwz: function (val) {
      let para = {
        name: this.wzfilters.name,
        tags: this.wzfilters.tags,
        pageSize: this.wzfilters.size,
        pageNum: this.wzfilters.current,
      }
      if (val) {
        para.pageNum = val
        this.currentPage1 = val
      }
      OwnerList(para).then((res) => {
        // debugger
        console.log(res)
        this.wzlist = res.data.rows
        this.total = res.data.total
      })
    },
    // 重置人员
    resetjm: function (filters) {
      if (filters == 'wzfilters') {
        this.$refs.wzfilters.resetFields()
        this.wzfilters = {
          name: '',
          tags: '',
          size: 10,
          current: 1,
        }
        this.getwz()
      } else if (filters == 'jmfilters') {
        this.$refs.jmfilters.resetFields()
        this.jmfilters = {
          name: '',
          tags: '',
          size: 10,
          current: 1,
        }
        this.getjm()
      }
    },
    // 居民选择分页
    handleSizeChange1: function (size) {
      this.pagesize1 = size
      this.jmfilters.size = size
      this.getjm('')
    },
    // 居民选择分页
    handleCurrentChange1: function (val) {
      this.jmfilters.current = val
      this.getjm(val)
    },
    // 屋主选择分页
    handleSizeChange: function (size) {
      this.pagesize = size
      this.wzfilters.size = size
      this.getwz('')
    },
    // 屋主选择分页
    handleCurrentChange: function (val) {
      this.wzfilters.current = val
      this.getwz(val)
    },
    // 选择人员
    select(selection, row) {
      if (selection.length > 1) {
        let del_row = selection.shift()
        console.log(del_row, 'del_rowdel_row')
        this.$refs.multipleTable.toggleRowSelection(del_row, false)
      }
      console.log(selection, 'selectionselectionselection')
      this.roomform.homeOwner = selection[0].name
      this.roomform.residentId = selection[0].residentId
      this.roomform.idCard = selection[0].idCard
    },
    // 选择人员全选
    selectAll(selection) {
      // debugger
      if (selection.length > 1) {
        selection.length = 1
      }
      this.roomform.homeOwner = selection[0].name
      this.roomform.residentId = selection[0].residentId
      this.roomform.idCard = selection[0].idCard
    },
    // 删除关联人
    deltype: function (index, type) {
      console.log(index)
      console.log('前', this.roomLive)
      if (type == '0') {
        this.roomform.homeOwner = ''
        this.roomform.residentId = ''
        this.roomform.idCard = ''
      } else if (type == '1') {
        // let roomLive = this.roomform.roomLive.splice(index,1)
        // this.roomform.roomLive = []
        // this.roomform.roomLive = roomLive
        // this.$forceUpdate()

        this.roomLive.splice(index, 1)
        // this.$delete(this.roomform.roomLive,index)

        console.log('后', this.roomLive)
      } else {
        this.vehiclelist.splice(index, 1)
      }
    },
    // 居住人员选择
    handleselect: function (data) {
      console.log('居民选择-点击多选框')
      // console.log(data)
      // data:已经选择的居民数据
      // residentIds: 现在居住的居民Id
      const newData = data.map((item) => {
        return {
          residentId: item.residentId,
          name: item.name,
          idCard: item.idCard,
        }
      })
      // debugger
      this.jmselet = []
      this.jmselet = newData
      // 展示居民携带的车辆
    },
    // 筛选新居民
    filterResidents() {
      const residentIds = this.roomform.roomLive.map((item) => item.residentId)
      // console.log('居民选择-点击多选框-筛选现在有的用户')
      // console.log(residentIds)
      const newJM = []
      this.jmselet.forEach((item) => {
        if (residentIds.indexOf(item.residentId) === -1) {
          newJM.push(item)
        }
      })
      this.roomLive = this.roomLive.concat(newJM)
      console.log(this.roomLive)
      this.vehicleNo = []
      for (let i = 0; i < this.roomLive.length; i++) {
        CarfindById(this.roomLive[i].residentId).then((res) => {
          // console.log(res)
          if ((res.data.code = '200')) {
            res.data.data.forEach((item) => {
              this.vehicleNo.push(item.vehicleNo)
            })
          }
          // console.log(i,res.data.data.vehicleNo)
          // this.vehicleNo.push(res.data.data.vehicleNo)
        })
      }
      // 展示居民携带的车辆
      this.jmselet = []
    },
    // 居民选择关闭事件
    closeJmd: function () {
      this.resetjm('jmfilters')
    },
    // 居民确认
    handlejmsubmit: function () {
      this.filterResidents()
      this.jmdialog = false
      this.resetjm('jmfilters')
    },
    // 屋主选择关闭事件
    closeWzd: function () {
      this.resetjm('wzfilters')
    },
    // 屋主确认
    handlejmsubmit1: function () {
      this.wzdialog = false
      this.resetjm('wzfilters')
    },
    // 添加车辆
    addcar: function () {
      this.cardialog = true
    },
    // 添加车辆关闭事件
    closeCard: function () {
      this.resetcarform()
    },
    // 字典
    getdict: function (val) {
      DictType(val).then((res) => {
        let data = res.data.data
        this.cartypelist = res.data.data
      })
    },
    // 车辆类型转换
    cartypeformat: function (row, column) {
      for (var i = 0; i < this.cartypelist.length; i++) {
        if (row.type == this.cartypelist[i].dictValue) {
          return this.cartypelist[i].dictLabel
        }
      }
    },
    // 获取车辆列表
    getcar: function () {
      let para = {
        vehicleNo: this.carfilters.vehicleNo,
        vehicleOwner: this.carfilters.vehicleOwner,
      }
      VehicleListInfo(para).then((res) => {
        this.carlist = res.data.data
      })
    },
    // 重置
    resetcarform: function (filters) {
      this.$refs.carfilters.resetFields()
      this.carfilters = {
        vehicleNo: '',
        vehicleOwner: '',
      }
      this.getcar()
    },
    // 选择车辆
    choosecar: function (data) {
      this.vehiclelist = []
      for (var i = 0; i < data.length; i++) {
        this.vehiclelist.push(data[i].typeName + ' ' + data[i].vehicleNo)
      }
      console.log(this.vehiclelist, 'this.vehiclelist')
    },
    // 车辆弹窗关闭
    handlecarsubmit: function () {
      this.cardialog = false
    },

    // 编辑房间
    editroom: function (data) {
      // console.log('---编辑房间---')
      this.roomdialog = true
      this.roomtitle = '房间详情'
      this.roomflag = false
      this.delflag = true
      this.getroomdt(data.roomId)
      this.roomId = data.roomId
      this.xqflag = false
    },
    // 获取房间详情
    getroomdt: function (id) {
      console.log('获取房间详情')
      RoomfindById(id).then((res) => {
        console.log(res.data, 'res.data')
        let data = JSON.stringify(res.data)
        this.roomform = res.data.data
        this.floors = res.data.data.floors
        this.loglist = res.data.data.logList
        this.filelist = []
        let roomFile = res.data.data.roomFileName //文件名
        if (roomFile != '' && roomFile != null && roomFile.length > 0) {
          let roomFile1 = roomFile.split(',')
          let roomFileurl = res.data.data.roomFileUrl.split(',') //url
          let roomFileid = res.data.data.roomFile.split(',') //id
          for (var i = 0; i < roomFile1.length; i++) {
            this.filelist.push({
              name: roomFile1[i],
              ossId: roomFileid[i],
              url: roomFileurl[i],
            })
          }
        }
        let vehicleName = res.data.data.vehicleName
        if (vehicleName != null) {
          this.vehiclelist = vehicleName.split(',')
          console.log(this.vehiclelist, 'this.vehiclelistthis.vehiclelist')
        }
        this.roomform.roomLive = res.data.data.listVos
        if (
          this.roomform.roomImgUrl == null ||
          this.roomform.roomImgUrl == ''
        ) {
          this.roomform.roomImgUrl = require('@/assets/img/empty.png')
          this.roomform.roomImg = ''
          this.editflag = false
        } else {
          this.editflag = true
        }
      })
    },
    // 添加房间-编辑房间
    handleaddroom: function () {
      // 判断下是否没有保存就提交
      // console.log(this.gasEditFrom[this.gasEditFrom.length - 1])
      console.log('编辑')
      console.log('this.gastankAddForm.brand', this.gastankAddForm.brand)
      if (this.gastankAddForm.brand && this.gastankAddForm.number) {
        this.gasEditFrom.splice(-1, 1)
        this.gasEditFrom.push(this.gastankAddForm)
        this.gastankAddForm = {}
      }
      console.log('this.gasEditFrom', this.gasEditFrom)
      if (this.gasEditFrom) {
        if (this.gasEditFrom.length > 0) {
          if (
            this.gasEditFrom[this.gasEditFrom.length - 1].brand == '' ||
            this.gasEditFrom[this.gasEditFrom.length - 1].number == null
          ) {
            this.gasEditFrom.splice(-1, 1)
          }
        }
      }

      this.Gastankflag = false
      this.editFlag = false
      this.editIndex = ''
      this.$refs.roomform.validate((valid) => {
        if (valid) {
          let roomFile
          let filelist = []
          if (this.filelist && this.filelist.length > 0) {
            for (var i = 0; i < this.filelist.length; i++) {
              filelist.push(this.filelist[i].ossId)
            }
            roomFile = filelist.join(',')
          } else {
            roomFile = ''
          }
          let vehicleName
          if (this.vehiclelist.length > 0) {
            vehicleName = this.vehiclelist.join(',')
          } else {
            vehicleName = ''
          }
          let para = {
            homeName: this.homeName, //房间名
            floors: this.floors, //楼层
            houseId: this.houseId, // 房屋id
            roomId: this.roomform.roomId, //房间id
            roomNo: this.roomform.roomNo, // 房间编号
            roomImg: this.roomform.roomImg,
            gasTank: this.roomform.gasTank,
            area: this.roomform.area, // 面积
            leaseStatus: this.roomform.leaseStatus, //是否出租
            residentId: this.roomform.residentId, //屋主id
            homeOwner: this.roomform.homeOwner, //屋主
            idCard: this.roomform.idCard, //身份证号
            roomLive: this.roomLive, //居住人
            vehicleName: vehicleName, //车辆
            remark: this.roomform.remark, //备注
            roomFile: roomFile, //附件
            nature: this.roomform.nature, //房间性质
            mesneLandlordId: this.roomform.mesneLandlordId, //二房东id,
            brand: this.roomform.brand,
            gasTankBoList: this.gasEditFrom,
          }
          console.log('-----请求参数----', para)
          if (this.roomform.roomId) {
            UpdateRoom(para).then((res) => {
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
              this.$refs.roomform.resetFields()
              this.roomdialog = false
              let isStay = true
              this.getlist(isStay)
              this.tabbuild(this.tabIndex)
            })
          } else {
            AddRoom(para).then((res) => {
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
              this.$refs.roomform.resetFields()
              this.roomdialog = false
              let isStay = true
              this.getlist(isStay)
              this.tabbuild(this.tabIndex)
            })
          }
        }
      })
      this.gasEditFrom = []
      this.roomLive = []
    },
    // 删除房间
    handledelroom: function () {
      let para = this.roomId
      DeleteRoom(para).then((res) => {
        console.log(res, '删除房间')
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
        this.$refs.roomform.resetFields()
        this.roomdialog = false
        let isStay = true
        this.getlist(isStay)
        this.tabbuild(this.tabIndex)
      })
    },
  },
}
</script>

<style>
/* .gastankStyle{
  width: 160px !important;
} */
.build-ul {
  padding-left: 5px !important;
}
</style>
