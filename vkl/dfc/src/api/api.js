import axios from 'axios';

let base = '';
// 测试
// let base = 'http://192.168.1.30:8083/api'
// 线上
// let base = 'http://192.168.1.195:8083/api'
// 系统登出
export const login = params => { return axios.post(`${base}/login`, params).then(res => res.data)};
// 退出
export const logout = params => { return axios.post(`${base}/logout`).then(res => res.data)};

// 获取用户信息
export const GetInfo = params => { return axios.get(`${base}/getInfo`)};
// 获取路由
export const GetRouters = params => { return axios.get(`${base}/getRouters`)};
// 字典 
export const DictType = params => { return axios.get(`${base}/system/dict/data/type/`+ params )}; 

// 修改密码
export const UpdatePwd= params =>{ return axios.get(`${base}/system/user/profile/updatePwd`, { params: params})};
// 修改头像
export const UpdateAvatar= params =>{ return axios.get(`${base}/system/user/profile/updateAvatar`, { params: params})};

// 文件预览
export const Ossyl = params => { return axios.get(`${base}/system/oss/view/`+ params )}; 
// 部门树
export const SelectDeptTree = params => { return axios.get(`${base}/selectDeptTree`, { params: params })};
// 部门下的用户
export const SelectDeptUser = params => { return axios.get(`${base}/selectDeptUser`, { params: params })};

// 通知公告 列表
export const UseNoticeList = params => { return axios.get(`${base}/noticeAnnouncement/announcement/list`, { params: params })};
// 新增
export const AddNotice = params =>{ return axios.post(`${base}/noticeAnnouncement/announcement`, params).then(res => res.data)};
// 修改
export const UpdateNotice= params =>{ return axios.put(`${base}/noticeAnnouncement/announcement`, params).then(res => res.data)};
// 删除
export const DelNoticer = params => { return axios.delete(`${base}/noticeAnnouncement/announcement/`+ params )}; 
// 详情
export const NoticerfindById = params => { return axios.get(`${base}/noticeAnnouncement/announcement/`+ params )};
// 修改状态
export const ChangestatusNotice= params =>{ return axios.put(`${base}/noticeAnnouncement/announcement/changeDisplayStatus/`+ params).then(res => res.data)};
// 查阅情况
export const NoticerReadfo = params => { return axios.get(`${base}/noticeAnnouncement/announcement/noticeReadInfo/`+ params )};
// 可选范围下的人员
export const NSelectDeptUserTree = params => { return axios.get(`${base}/noticeAnnouncement/announcement/selectDeptUserTree`)};
// 未读转已读
export const ChangesignReads= params =>{ return axios.put(`${base}/noticeAnnouncement/announcement/signRead/`+ params).then(res => res.data)};

// 通知公告（看）
export const userReadInfo = params => { return axios.get(`${base}/noticeAnnouncement/announcement/userReadInfo`)};



// 新闻管理 列表
export const NewsInforList = params => { return axios.get(`${base}/newsInformation/information/list`, { params: params })};
// 新增
export const AddNewsInfor = params =>{ return axios.post(`${base}/newsInformation/information`, params).then(res => res.data)};
// 修改
export const UpdateNewsInfor= params =>{ return axios.post(`${base}/newsInformation/information/update`, params).then(res => res.data)};
// 修改序号
export const UpdateNewsSerial= params =>{ return axios.post(`${base}/newsInformation/information/updateSort`, params).then(res => res.data)};
// 删除
export const DelNewsInfor = params => { return axios.delete(`${base}/newsInformation/information/`+ params )}; 
// 详情
export const NewsInforfindById = params => { return axios.get(`${base}/newsInformation/information/`+ params )};
// 修改状态
export const ChangestatusNewsInfor= params =>{ return axios.put(`${base}/newsInformation/information/changeDisplayStatus/`+ params).then(res => res.data)};

// 档案列表
export const FileList = params => { return axios.post(`${base}/basic/room/fileList`, params).then(res => res.data)};
// 居住人员列表
export const RentUser = params => { return axios.get(`${base}/basic/room/numberOfResidents/`+ params )};
// 车辆管理列表
export const RentCar = params => { return axios.get(`${base}/basic/resident/findVehicleByResidentId/`+ params )};
// 档案列表关联车辆信息
export const RentRoomCar = params => { return axios.get(`${base}/basic/resident/findVehicleByRoomId/`+ params )};
// 获取村简介
export const VillageQuery =params => {return axios.get(`${base}/basic/villageIntroduction/query` ,{ params: params })};
// 新增村简介
export const VillageAdd = params => {return axios.post(`${base}/basic/villageIntroduction/add/` ,params).then(res => res.data)};
// 修改村简介
export const VillageUpdate = params =>{return axios.post(`${base}/basic/villageIntroduction/edit` ,params).then(res =>res.data)};
// 领导列表
export const leadershipList = params =>{return axios.get(`${base}/basic/leadership/list`,{params:params})};
// 领导列表展示
export const leadershipListShow = params =>{return axios.get(`${base}/basic/leadership/show_list`,{params})};
// 修改领导展示状态
export const leaderUpdateStatus = params =>{return axios.get(`${base}/basic/leadership/updateStatus/`+params).then(res =>res.data)}
// 新增领导
export const leaderAdd = params =>{return axios.post(`${base}/basic/leadership/add`,params).then(res => res.data)}
// 修改领导
export const leaderEdit = params =>{return axios.post(`${base}/basic/leadership/edit`,params).then(res => res.data)};
// 获取领导详情
export const leaderQuery = params =>{return axios.get(`${base}/basic/leadership/query/` +params)};
// 删除领导
export const leaderDelete = params =>{return axios.delete(`${base}/basic/leadership/remove/` +params)};
// 获取宅委会列表
export const memberList = params =>{return axios.get(`${base}/basic/member/list`,{params})};
// 获取宅委会成员详情
export const getMemberDetail = (memberId) =>{return axios.get(`${base}/basic/member/${memberId}`).then(res => res.data)};
// 修改宅委会成员信息
export const memberDetailUpdate = params =>{return axios.put(`${base}/basic/member`,params).then(res => res.data)};
// 添加宅委会成员
export const addMember = params =>{return axios.post(`${base}/basic/member`,params).then(res => res.data)};
// 删除宅委会成员信息
export const delMember = (memberId) =>{return axios.delete(`${base}/basic/member/${memberId}`).then(res => res.data)};
// 修改宅委会成员展示状态
export const statuMember = (memberId) =>{return axios.get(`${base}/basic/member/updateStatus/${memberId}`).then(res => res.data)};
// 获取网格信息
export const gridOverviewList = params =>{return axios.get(`${base}/basic/gridOverview/list`,{params})};
// 新增网格
export const addGrid = params =>{return axios.post(`${base}/basic/gridOverview`,params).then(res => res.data)};
// 修改网格信息
export const gridDetailUpdate = params =>{return axios.put(`${base}/basic/gridOverview`,params).then(res => res.data)};
// 查询网格信息人员列表
export const gridPersonList = params =>{return axios.get(`${base}/basic/gridOwerviewPersonnel/list`,{params})};
// 新增网格成员
export const addGridPerson = params =>{return axios.post(`${base}/basic/gridOwerviewPersonnel`,params).then(res => res.data)};
// 修改网格成员信息
export const updateGridPerson = params =>{return axios.put(`${base}/basic/gridOwerviewPersonnel`,params).then(res => res.data)};
// 删除网格成员 
export const delGridPerson = (personnelIds) =>{return axios.delete(`${base}/basic/gridOwerviewPersonnel/${personnelIds}`).then(res => res.data)};

// 党建介绍和党建介绍列表
export const property = params =>{return axios.get(`${base}/red/property/getInfo/`+params)};
// 新增
export const propertyAdd =params =>{return axios.post(`${base}/red/property`,params).then(res =>res.data)};
// 修改
export const propertyUpdate = params =>{return axios.put(`${base}/red/property`,params).then(res => res.data)};
// 删除
export const propertyDelete = params =>{return axios.delete(`${base}/red/property/`+params)};

// 关怀记录列表
export const careRecordList = params =>{return axios.get(`${base}/careRecord/careRecord/list`,{params:params})};
// 新增关怀记录
export const careRecordAdd = params =>{return axios.post(`${base}/careRecord/careRecord/`,params).then(res => res.data)};
// 修改关怀记录
export const careRecordUpdate = params =>{return axios.put(`${base}/careRecord/careRecord/`,params).then(res => res.data)};
// 获取详情
export const careRecordQuery = params =>{return axios.get(`${base}/careRecord/careRecord/`+params)};
// 删除关怀记录
export const careRecordDelete = params =>{return axios.delete(`${base}/careRecord/careRecord/`+params)};



// 党组织列表
export const OrganizationList = params =>{return axios.get(`${base}/basic/organization/list`,{params:params})};
// 新增党组织
export const OrganizationAdd = params =>{return axios.post(`${base}/basic/organization`,params).then(res => res.data)};
// 修改党组织
export const OrganizationUpdate = params =>{return axios.post(`${base}/basic/organization/update`,params).then(res => res.data)};
// 获取党组织详情
export const OrganizationQuery =params =>{return axios.get(`${base}/basic/organization/`+params)};
// 删除党组织
export const OrganizationDelete = params => {return axios.delete(`${base}/basic/organization/`+params)};
// 获取全部党组织
export const basicOrganizationList = params => {return axios.get(`${base}/basic/organization/basicOrganizationList` ,params)}


// 查询党员列表
export const partyMemberList = params => {return axios.get(`${base}/basic/partyMemberInfo/list`,{params:params})};
// 新增党员信息
export const partyMemberAdd = params => { return axios.post(`${base}/basic/partyMemberInfo`,params).then(res => res.data)};
// 修改党员信息
export const partyMemberUpdate =params => { return axios.put(`${base}/basic/partyMemberInfo`,params).then(res => res.data)};
// 获取党员详情
export const partyMemberQuery = params => {return axios.get(`${base}/basic/partyMemberInfo/`+params)};
// 删除党员
export const partyMemberDelete = params => {return axios.delete(`${base}/basic/partyMemberInfo/`+params)};

// 查询设备列表
export const facilitiesList = params =>{return axios.get(`${base}/basic/facilities/list`,{params:params})};
// 新增设备
export const facilitiesAdd = params =>{return axios.post(`${base}/basic/facilities/add`,params).then(res => res.data)};
// 修改设备
export const facilitiesUpdate = params =>{return axios.post(`${base}/basic/facilities/edit`,params).then(res => res.data)};
// 获取设备详情
export const facilitiesQuery = params =>{return axios.get(`${base}/basic/facilities/query/`+params)};
// 删除设备
export const facilitiesDelete = params =>{return axios.delete(`${base}/basic/facilities/remove/`+params)};

// 查询积分管理列表
export const integralList =params =>{return axios.get(`${base}/system/integral/list`,{params:params})};
// 新增积分管理
export const integralAdd = params =>{return axios.post(`${base}/system/integral`,params).then(res => res.data)};
// 修改积分管理
export const integralUpdate = params =>{return axios.put(`${base}/system/integral`,params).then(res =>res.data)};
// 获取积分详情
export const integralQuery = params =>{return axios.get(`${base}/system/integral/`+params)};
// 删除积分
export const integralDelete = params =>{return axios.delete(`${base}/system/integral/`+params)};

// 来沪人员管理费
export const paymentList = params =>{return axios.get(`${base}/system/payment/list`,{params:params})};
// 管理费新增
export const paymentAdd = params =>{return axios.post(`${base}/system/payment`,params).then(res =>res.data)};
// 管理费修改
export const paymentUpdate = params =>{return axios.put(`${base}/system/payment`,params).then(res =>res.data)};
// 管理费详情
export const paymentQuery = params =>{return axios.get(`${base}/system/payment/`+params)};
// 删除管理费
export const paymentDelete = params =>{return axios.delete(`${base}/system/payment/`+params)};



// 房屋管理 列表
export const HouseList = params => { return axios.get(`${base}/basic/house/list`, { params: params })};
// 新增 
export const AddHouse = params =>{ return axios.post(`${base}/basic/house/add`, params).then(res => res.data)};
// 修改
export const UpdateHouse= params =>{ return axios.post(`${base}/basic/house/edit`, params).then(res => res.data)};
// 删除
export const DelHouse = params => { return axios.delete(`${base}/basic/house/remove/`+ params )};
// 详情
export const HousefindById = params => { return axios.get(`${base}/basic/house/query/`+ params )};
// 添加楼层
export const AddFloor = params => { return axios.get(`${base}/basic/house/addFloor`, { params: params })};
// 删除楼层
export const DelFloor = params => { return axios.delete(`${base}/basic/room/remove`, { params: params })};

// 新增房间
export const AddRoom = params =>{ return axios.post(`${base}/basic/room/add`, params).then(res => res.data)};
// 修改
export const UpdateRoom= params =>{ return axios.post(`${base}/basic/room/edit`, params).then(res => res.data)};
// 详情
export const RoomfindById = params => { return axios.get(`${base}/basic/room/query/`+ params )};
// 删除房间
export const DeleteRoom = params => { return axios.delete(`${base}/basic/room/deleteRoom/`+ params )};
// 查询人员旗下的车辆
export const CarfindById = params => { return axios.get(`${base}/basic/room/queryVehicle/`+ params )};



// 车辆管理
export const VehicleList = params => { return axios.get(`${base}/basic/vehicle/list`, { params: params })};
// 新增 
export const AddVehicle = params =>{ return axios.post(`${base}/basic/vehicle/add`, params).then(res => res.data)};
// 修改
export const UpdateVehicle= params =>{ return axios.post(`${base}/basic/vehicle/edit`, params).then(res => res.data)};
// 删除
export const DelVehicle = params => { return axios.delete(`${base}/basic/vehicle/remove/`+ params )};
// 详情
export const VehiclefindById = params => { return axios.get(`${base}/basic/vehicle/query/`+ params )};
// 车辆列表不分页
export const VehicleListInfo = params => { return axios.get(`${base}/basic/vehicle/listInfo`, { params: params })};



// 煤气罐管理
// 煤气罐详情
export const gastankDetail = params => { return axios.get(`${base}/basic/room/gasTaskDetail/` + params )};
// 新增煤气罐
export const AddGastank = params =>{ return axios.post(`${base}/basic/room/addGasTask`, params).then(res => res.data)};
// 删除煤气罐 
export const DelGastank = params => { return axios.delete(`${base}/basic/room/deleteGasTask/`+ params )};
// 编辑煤气罐
export const EditGastank = params =>{ return axios.post(`${base}/basic/room/editGasTask`, params).then(res => res.data)};




// 居民管理
export const ResidentList = params => { return axios.get(`${base}/basic/resident/list`, { params: params })};
// 新增 
export const AddResident = params =>{ return axios.post(`${base}/basic/resident/add`, params).then(res => res.data)};
// 修改
export const UpdateResident= params =>{ return axios.post(`${base}/basic/resident/edit`, params).then(res => res.data)};
// 删除
export const DelResident = params => { return axios.delete(`${base}/basic/resident/remove/`+ params )};
// 详情
export const ResidentfindById = params => { return axios.get(`${base}/basic/resident/query/`+ params )};
// 居民信息不分页
export const ResidentListInfo = params => { return axios.get(`${base}/basic/resident/listInfo`, { params: params })};
// 户主信息
export const HouseholdInfo = params => { return axios.get(`${base}/basic/resident/householdInfo`, { params: params })};
// 屋主信息
export const OwnerList = params => { return axios.get(`${base}/basic/resident/ownerList`, { params: params })};
// 选择楼层
export const RoomTree = params => { return axios.get(`${base}/basic/room/tree`, { params: params })};
// 选择楼层分页
export const RoomTreePages = params => { return axios.get(`${base}/basic/room/treePage`, { params: params })};

/**工作人员管理 */
// 查询工作人员管理列表
export const StaffList = params => { return axios.get(`${base}/basic/staffManagement/list`, { params: params })};
// 新增工作人员管理
export const AddStaffManagement = params =>{ return axios.post(`${base}/basic/staffManagement`, params).then(res => res.data)};
// 修改工作人员管理
export const EditStaffManagement = params =>{ return axios.post(`${base}/basic/staffManagement/edit`, params).then(res => res.data)};
// 获取工作人员管理详细信息
export const GetStaffManagement = id =>{ return axios.get(`${base}/basic/staffManagement/${id}`).then(res => res.data)};
// 删除工作人员管理
export const DelStaffManagement = id =>{ return axios.delete(`${base}/basic/staffManagement/${id}`).then(res => res.data)};

// 用户管理 列表
export const UserList = params => { return axios.get(`${base}/system/user/list`, { params: params })};
// 新增
export const AddUser = params =>{ return axios.post(`${base}/system/user`, params).then(res => res.data)};
// 修改
export const UpdateUser= params =>{ return axios.put(`${base}/system/user`, params).then(res => res.data)};
// 删除
export const DelUser = params => { return axios.delete(`${base}/system/user/`+ params )}; 
// 详情
export const UserInfo = params => { return axios.get(`${base}/system/user/`+ params )};
// 修改状态
export const UserUpdateStatus= params =>{ return axios.put(`${base}/system/user/changeStatus`, params).then(res => res.data)};
// 部门树
export const UserDeptTree = params => { return axios.get(`${base}/system/user/deptTree`)};
// 部门编号获取详情
export const Userdetal = params => { return axios.get(`${base}/system/user/`)};
// 重置密码
export const ResetPassword = params => { return axios.delete(`${base}/system/user/resetPassword/`+ params )}; 


// 角色管理 列表
export const RoleList = params => { return axios.get(`${base}/system/role/list`, { params: params })};
// 新增
export const AddRole = params =>{ return axios.post(`${base}/system/role`, params).then(res => res.data)};
// 编辑
export const UpdateRole = params =>{ return axios.put(`${base}/system/role`, params).then(res => res.data)};
// 删除
export const DelRole  = params =>{ return axios.delete(`${base}/system/role/`+ params )}
// 详情
export const RolefindById = params => { return axios.get(`${base}/system/role/`+ params )};
// 权限树
export const Treeselect = params => { return axios.get(`${base}/system/menu/treeselect`)};
// 修改状态
export const RoleUpdateStatus= params =>{ return axios.put(`${base}/system/role/changeStatus`, params).then(res => res.data)};
// 菜单树
export const RoleMenuTreeselect = params => { return axios.get(`${base}/system/menu/roleMenuTreeselect/`+ params )};



//  菜单管理 列表
export const MenuList = params => { return axios.get(`${base}/system/menu/list`, { params: params })};
// 新增
export const AddMenu = params =>{ return axios.post(`${base}/system/menu`, params).then(res => res.data)};
// 编辑
export const UpdateMenu = params =>{ return axios.put(`${base}/system/menu`, params).then(res => res.data)};
// 删除
export const DelMenu  = params =>{ return axios.delete(`${base}/system/menu/`+ params )}
// 详情
export const MenufindById = params => { return axios.get(`${base}/system/menu/`+ params )};

// 部门管理 列表
export const DeptList = params => { return axios.get(`${base}/system/dept/list`, { params: params })};
// 新增
export const AddDept = params =>{ return axios.post(`${base}/system/dept`, params).then(res => res.data)};
// 编辑
export const UpdateDept = params =>{ return axios.put(`${base}/system/dept`, params).then(res => res.data)};
// 删除
export const DelDept  = params =>{ return axios.delete(`${base}/system/dept/`+ params )}
// 详情
export const DeptfindById = params => { return axios.get(`${base}/system/dept/`+ params )};

//  岗位管理 列表
export const PostList = params => { return axios.get(`${base}/system/post/list`, { params: params })};
// 新增
export const AddPost = params =>{ return axios.post(`${base}/system/post`, params).then(res => res.data)};
// 编辑
export const UpdatePost = params =>{ return axios.put(`${base}/system/post`, params).then(res => res.data)};
// 删除
export const DelPost  = params =>{ return axios.delete(`${base}/system/post/`+ params )}
// 详情
export const PostfindById = params => { return axios.get(`${base}/system/post/`+ params )};

// 河道首页
export const RPageEvt = params => { return axios.get(`${base}/data/pageEvt`, { params: params })};
// 巡查记录
export const RRoadList = params => { return axios.get(`${base}/data/roadList`, { params: params })};

// 河道总览
// 上报趋势
export const RReportTrend = params =>{ return axios.post(`${base}/data/reportTrend`, params).then(res => res.data)};
// 分类统计
export const REventSortStatistics = params =>{ return axios.post(`${base}/data/eventSortStatistics`, params).then(res => res.data)};
// 事件类型占比图
export const REventTypeScale = params =>{ return axios.post(`${base}/data/eventTypeScale`, params).then(res => res.data)};
// 事件办结比例图
export const REvtDoneScale = params =>{ return axios.post(`${base}/data/evtDoneScale`, params).then(res => res.data)};
// 河道人工巡查主题趋势图
export const RPatrolTopic = params =>{ return axios.post(`${base}/data/patrolTopic`, params).then(res => res.data)};
// 巡查人员巡查次数统计
export const RPatrolUserStatis = params => { return axios.get(`${base}/data/patrolUserStatis`, { params: params })};



//  河道 列表
export const RiverList = params => { return axios.get(`${base}/basic/river/list`, { params: params })};
// 新增
export const AddRiver = params =>{ return axios.post(`${base}/basic/river`, params).then(res => res.data)};
// 编辑
export const UpdateRiver = params =>{ return axios.put(`${base}/basic/river`, params).then(res => res.data)};
// 删除
export const DelRiver  = params =>{ return axios.delete(`${base}/basic/river/`+ params )}
// 详情 
export const RiverfindById = params => { return axios.get(`${base}/basic/river/`+ params )};
// 查询河道总长度
export const RiverLongCount = () => { return axios.get(`${base}/basic/river/selectSum` ).then(res => res.data)};
// 道路基础统计数据
export const RoadBasicCount = () => { return axios.get(`${base}/basic/river/statisticData` ).then(res => res.data)};
// 所属队组下拉
export const VillageGroups = () => { return axios.get(`${base}/basic/river/belongToGroup` ).then(res => res.data)};

// 事件列表
// 左侧类型
export const EventSidebar = params => { return axios.get(`${base}/event/evtManagement/eventSidebar`)};
// 公用接口
export const EventList = params => { return axios.get(`${base}/event/evtManagement/page`, { params: params })};
// 待办事件
export const EventListTodo = params => { return axios.get(`${base}/event/evtManagement/page/todo`, { params: params })};
// 我的事件
export const EventListMy = params => { return axios.get(`${base}/event/evtManagement/page/my`, { params: params })};
// 已办事件
export const EventListFinish = params => { return axios.get(`${base}/event/evtManagement/page/finished`, { params: params })};
// 所有事件
export const EventListAll = params => { return axios.get(`${base}/event/evtManagement/page/all`, { params: params })};
// 事件类型下拉
export const EventType = params => { return axios.get(`${base}/event/evtManagement/eventTypeCombobox`,{params: params})};
// 事件节点
export const EventNode = params => { return axios.get(`${base}/event/evtManagement/eventNodeCombobox`)};
// 详情
export const EventDetil = params => { return axios.get(`${base}/event/evtManagement/detail`, { params: params })};
// 获取上报表单
export const GetReportForm = params => { return axios.get(`${base}/event/evtFlow/getReportForm/`+ params )};
// 发起事件流程
export const EvtFlowStart = params =>{ return axios.post(`${base}/event/evtFlow/startEvt`, params).then(res => res.data)};

// 受理并分派 1-5
export const EvtFlowAllot = params =>{ return axios.post(`${base}/event/evtFlow/eventAllot`, params).then(res => res.data)};
// 事件处理签收 1-5-1
export const EvtFlowDisSign = params =>{ return axios.post(`${base}/event/evtFlow/eventDisposalSign`, params).then(res => res.data)};
// 事件处理拒签 1-5-1
export const EvtFlowDisRefuseSign = params =>{ return axios.post(`${base}/event/evtFlow/eventDisposalRefuseSign`, params).then(res => res.data)};
// 事件提交办结 1-5-1-1
export const EvtFlowSubCon = params =>{ return axios.post(`${base}/event/evtFlow/eventSubmitConclude`, params).then(res => res.data)};
// 确认办结 1-5-1-1-1
export const EvtFlowConfbCon = params =>{ return axios.post(`${base}/event/evtFlow/eventConfirmConclude`, params).then(res => res.data)};
// 退回处置 1-5-1-1-2
export const EvtFlowBackDis = params =>{ return axios.post(`${base}/event/evtFlow/eventBackDisposal`, params).then(res => res.data)};

// 自处置完成 1-5-1-2
export const EvtFlowSelfDisComp = params =>{ return axios.post(`${base}/event/evtFlow/eventSelfDisposalComplete`, params).then(res => res.data)};

// 挂起 1-5-1-3
export const EvtFlowSuspend = params =>{ return axios.post(`${base}/event/evtFlow/eventSuspend`, params).then(res => res.data)};
// 同意挂起 1-5-1-3-1
export const EvtFlowAgreeSuspend = params =>{ return axios.post(`${base}/event/evtFlow/eventAgreeSuspend`, params).then(res => res.data)};
// 取消挂起 1-5-1-3-1-1
export const EvtFlowCancSuspend = params =>{ return axios.post(`${base}/event/evtFlow/eventCancelSuspend`, params).then(res => res.data)};
// 拒绝挂起 1-5-1-3-2
export const EvtFlowRefuseSuspend = params =>{ return axios.post(`${base}/event/evtFlow/eventRefuseSuspend`, params).then(res => res.data)};

// 转派 1-5-1-4
export const EvtFlowTransfer = params =>{ return axios.post(`${base}/event/evtFlow/eventTransfer`, params).then(res => res.data)};

// 事件撤销 1-2
export const EvtFlowRevo = params =>{ return axios.post(`${base}/event/evtFlow/eventRevocation`, params).then(res => res.data)};


// 发起核查 1-3
export const EvtFlowCheck = params =>{ return axios.post(`${base}/event/evtFlow/eventStartCheck`, params).then(res => res.data)};
// 核查签收 1-3-1
export const EvtFlowCheckSign = params =>{ return axios.post(`${base}/event/evtFlow/eventCheckerSign`, params).then(res => res.data)};
// 核查签收拒绝 1-3-1
export const EvtFlowCheckRefuseSign = params =>{ return axios.post(`${base}/event/evtFlow/eventCheckerRefuseSign`, params).then(res => res.data)};
// 核查完成
export const EvtFlowCheckComplete = params =>{ return axios.post(`${base}/event/evtFlow/eventCheckComplete`, params).then(res => res.data)};


// 事件回退到上报
export const EvtFlowBackReport = params =>{ return axios.post(`${base}/event/evtFlow/eventBackToReported`, params).then(res => res.data)};
// 事件重新上报
export const EvtReportAgain = params =>{ return axios.post(`${base}/event/evtFlow/reportAgain`, params).then(res => res.data)};
// 事件删除
export const EvtFlowDelete = params =>{ return axios.post(`${base}/event/evtFlow/delete`, params).then(res => res.data)};
// 事件撤回
export const EventRecall = params =>{ return axios.post(`${base}/event/evtFlow/eventRecall`, params).then(res => res.data)};
// 事件一键处理 
export const EventHandleInOnce = params =>{ return axios.post(`${base}/event/evtFlow/eventOneClickFinishBatch`, params).then(res => res.data)};
// 代办事件一键删除
export const EventDeleteInOnce = params =>{ return axios.post(`${base}/event/evtFlow/eventDeleteBatch`, params).then(res => res.data)};
// 查询事件自动分派列表
export const getAllotList = params => { return axios.get(`${base}/event/allot/list`, { params: params })};
// 设置自动分派人员
export const setAllotManager = params => { return axios.post(`${base}/event/allot/setAllotManager`, params).then(res => res.data)};
// 清除人员选择
export const clearAllotManager = params => { return axios.post(`${base}/event/allot/clearAllotManager`, params).then(res => res.data)};

//  巡查列表 列表
export const UserPatrolList = params => { return axios.get(`${base}/system/userPatrol/list`, { params: params })};
// 删除
export const DelUserPatrol  = params =>{ return axios.delete(`${base}/system/userPatrol/`+ params )}
// 详情 
export const UserPatrolfindById = params => { return axios.get(`${base}/system/userPatrol/`+ params )};


//  巡查模板 列表
export const patrolTemplateList = params => { return axios.get(`${base}/system/patrolTemplate/list`, { params: params })};
// 新增
export const AddpatrolTemplate = params =>{ return axios.post(`${base}/system/patrolTemplate`, params).then(res => res.data)};
// 编辑
export const UpdatepatrolTemplate = params =>{ return axios.put(`${base}/system/patrolTemplate`, params).then(res => res.data)};
// 删除
export const DelpatrolTemplate  = params =>{ return axios.delete(`${base}/system/patrolTemplate/`+ params )}
// 详情 
export const patrolTemplatefindById = params => { return axios.get(`${base}/system/patrolTemplate/`+ params )};
// 修改状态
export const ChangestatusTemplate = params =>{ return axios.put(`${base}/system/patrolTemplate/changeStatus/`+ params).then(res => res.data)};
// 使用情况
export const patrolTemplateUyqk = params => { return axios.get(`${base}/system/patrolTemplate/useInfoList`, { params: params })};
// 修改记录
export const ActionLogList = params => { return axios.get(`${base}/system/patrolTemplate/actionLogList`, { params: params })};
// 巡查上报列表
export const UserPatrolEvents = params => { return axios.get(`${base}/system/userPatrol/eventList/`+ params )};


/**物业服务人员开始 */
// 用户管理 列表
export const RefUserList2 = params => { return axios.get(`${base}/red/user/list`, { params: params })};
// 新增
export const AddRefUser2 = params =>{ return axios.post(`${base}/red/user`, params).then(res => res.data)};
// 修改
export const UpdateRefUser2 = params =>{ return axios.put(`${base}/red/user`, params).then(res => res.data)};
// 删除
export const DelRefUser2 = params => { return axios.delete(`${base}/red/user/`+ params )}; 
// 修改状态
export const RefUserUpdateStatus2 = params =>{ return axios.put(`${base}/red/user/changeStatus`, params).then(res => res.data)};
// 部门树
export const RefUserDeptTree2 = params => { return axios.get(`${base}/red/user/deptTree`)};
// 部门编号获取详情
export const RefUserdetal2 = params => { return axios.get(`${base}/red/user/`)};
// 详情
export const RefUserInfo2 = params => { return axios.get(`${base}/red/user/`+ params )};
/**物业服务人员结束 */

// 用户管理 列表
export const RefUserList = params => { return axios.get(`${base}/refuse/user/list`, { params: params })};
// 新增
export const AddRefUser = params =>{ return axios.post(`${base}/refuse/user`, params).then(res => res.data)};
// 修改
export const UpdateRefUser= params =>{ return axios.put(`${base}/refuse/user`, params).then(res => res.data)};
// 删除
export const DelRefUser = params => { return axios.delete(`${base}/refuse/user/`+ params )}; 
// 详情
export const RefUserInfo = params => { return axios.get(`${base}/refuse/user/`+ params )};
// 修改状态
export const RefUserUpdateStatus= params =>{ return axios.put(`${base}/refuse/user/changeStatus`, params).then(res => res.data)};
// 部门树
export const RefUserDeptTree = params => { return axios.get(`${base}/refuse/user/deptTree`)};
// 部门编号获取详情
export const RefUserdetal = params => { return axios.get(`${base}/refuse/user/`)};


//  工作打卡 列表
export const UserSignList = params => { return axios.get(`${base}/system/userSign/list`, { params: params })};
// 删除
export const DelUserSign  = params =>{ return axios.delete(`${base}/system/userSign/`+ params )}
// 详情
export const UserSignfindById = params => { return axios.get(`${base}/system/userSign/`+ params )};


// 操作日志
export const OperlogList = params => { return axios.get(`${base}/monitor/operlog/list`, { params: params })};
// 导出
export const OperlogExport = params =>{ return axios.post(`${base}/monitor/operlog/export`, params).then(res => res.data)};
// 删除
export const DelOperlog  = params =>{ return axios.delete(`${base}/monitor/operlog/`+ params )}

// 登录日志
export const LoginlogList = params => { return axios.get(`${base}/monitor/logininfor/list`, { params: params })};
// 导出
export const LoginlogExport = params =>{ return axios.post(`${base}/monitor/logininfor/export`, params).then(res => res.data)};
// 删除
export const DelLoginlog  = params =>{ return axios.delete(`${base}/monitor/logininfor/`+ params )}


//  服务列表
// 侧边栏菜单
export const ServiceSidebar = params => { return axios.get(`${base}/property/prtManagement/serviceSidebar`)};
// 获取服务分页
export const PrtList = params => { return axios.get(`${base}/property/prtManagement/page`, { params: params })};
// 详情
export const PrtDetail = params => { return axios.get(`${base}/property/prtManagement/detail`, { params: params })};
// 物业服务类型
export const PrtTypeList = params => { return axios.get(`${base}/property/prtType/list`, { params: params })};

// 新增
export const AddPrtType = params =>{ return axios.post(`${base}/property/prtType/add`, params).then(res => res.data)};
// 修改
export const UpdatePrtType= params =>{ return axios.put(`${base}/property/prtType/update`, params).then(res => res.data)};
// 详情
export const PrtTypefindById = params => { return axios.get(`${base}/property/prtType/`+ params )};

// 勾选分派人员
export const SelectDeptUserTree = params => { return axios.get(`${base}/event/evtManagement/selectDeptUserTree`,{ params: params })};

// 服务类型下拉
export const ServiceTypeCombobox = params => { return axios.get(`${base}/property/prtManagement/serviceTypeCombobox`)};
// 服务节点下拉
export const ServiceNodeCombobox = params => { return axios.get(`${base}/property/prtManagement/serviceNodeCombobox`)};

// 修改服务事件时间
export const UpdateTime = params =>{ return axios.post(`${base}/property/prtManagement/updateEndTime`, params).then(res => res.data)};


// 获取登记表单
export const GetprtReportForm = params => { return axios.get(`${base}/property/prtFlow/getReportForm/`+ params )};
// 发起流程
export const StartPrt = params =>{ return axios.post(`${base}/property/prtFlow/startPrt`, params).then(res => res.data)};
// 服务同意受理
export const ServiceAccept = params =>{ return axios.post(`${base}/property/prtFlow/serviceAccept`, params).then(res => res.data)};
// 服务撤销
export const ServiceRevocation = params =>{ return axios.post(`${base}/property/prtFlow/serviceRevocation`, params).then(res => res.data)};
// 服务回退到服务登记
export const ServiceRollToRegister = params =>{ return axios.post(`${base}/property/prtFlow/serviceRollToRegister`, params).then(res => res.data)};
// 服务分派
export const ServiceAllot = params =>{ return axios.post(`${base}/property/prtFlow/serviceAllot`, params).then(res => res.data)};

// 服务签收
export const ServiceSign = params =>{ return axios.post(`${base}/property/prtFlow/serviceSign`, params).then(res => res.data)};
// 拒签返回分派
export const ServiceRejectSign = params =>{ return axios.post(`${base}/property/prtFlow/serviceRejectSign`, params).then(res => res.data)};

// 服务办结回退到服务完成
export const ServiceRollToFinished = params =>{ return axios.post(`${base}/property/prtFlow/serviceRollToFinished`, params).then(res => res.data)};
// 服务完成
export const ServiceFinished = params =>{ return axios.post(`${base}/property/prtFlow/serviceFinished`, params).then(res => res.data)};
// 服务办结
export const ServiceConclude = params =>{ return axios.post(`${base}/property/prtFlow/serviceConclude`, params).then(res => res.data)};
// 重新登记
export const RegisterAgain = params =>{ return axios.post(`${base}/property/prtFlow/registerAgain`, params).then(res => res.data)};
// 删除
export const ServiceDelete = params =>{ return axios.post(`${base}/property/prtFlow/serviceDelete`, params).then(res => res.data)};
// 撤回
export const ServiceWithdraw = params =>{ return axios.post(`${base}/property/prtFlow/serviceWithdraw`, params).then(res => res.data)};
// 勾选分派人员
export const PSelectDeptUserTree = params => { return axios.get(`${base}/property/prtManagement/selectDeptUserTree`)};

// 删除
export const DelPrtType = params => { return axios.delete(`${base}/property/prtType/delete/`+ params )}; 
// 修改状态
export const UpdateStatusPrtType = params =>{ return axios.post(`${base}/property/prtType/updateStatus`, params).then(res => res.data)};

// 更新授权
// 获取授权信息
export const getLicense = params => { return  axios.get(`${base}/license/info`)};
// 授权状态
export const statusLicense = params => { return  axios.get(`${base}/license/status`)};


// 考勤打卡
// 按日列表
export const AttendDayStatis = params => { return axios.get(`${base}/work/attendDayStatis/attendDayStatis`, { params: params }).then(res => res.data);};
// 按月统计
export const AttendMonthStatis = params => { return axios.get(`${base}/work/attendDayStatis/attendMonthStatis`, { params: params }).then(res => res.data);};
// 年月日基础数据
export const MonthDayList = params => { return axios.get(`${base}/work/attendDayStatis/monthDay`, { params: params }).then(res => res.data);};
// 考勤打卡信息
export const AttendList = params => { return axios.get(`${base}/work/attendRecord/list`, { params: params }).then(res => res.data);};
// 考勤打卡详情
export const AttendRecordDt = params => { return axios.get(`${base}/work/attendRecord/`+ params )};
// 部门选择
export const userWithDeptTree = params => { return axios.get(`${base}/userWithDeptTree`,{ params: params })};

// 在线用户监控列表
export const OnlineList = params => { return axios.get(`${base}/monitor/online/listFy`,{ params: params })};
// 强退
export const DelOnline = params => { return axios.delete(`${base}/monitor/online/`+ params )};

// 东风村报表
export const TownReport = params => { return axios.get(`${base}/system/reportData/town/list`,{ params: params })};
// 新增东风村报表
export const TownReportAdd = params =>{return axios.post(`${base}/system/reportData/addTown`,params).then(res => res.data)};
// 新增物业报表
export const PropertyReportAdd = params =>{return axios.post(`${base}/system/reportData/addProperty`,params).then(res =>res.data)};
// 详情
export const TownReportDt = params => { return axios.get(`${base}/system/reportData/view/`+ params )};


// 物业报表
export const PropertyReport = params => { return axios.get(`${base}/system/reportData/property/list`,{ params: params })};

// 租赁管理
// 屋主列表
export const HomeAuthList = params => { return axios.get(`${base}/ren/homeownerAuth/list`,{ params: params })};
// 详情
export const HomeAuthDt = params => { return axios.get(`${base}/ren/homeownerAuth/`+ params )};
// 审核
export const UpdateHomeAuth = params =>{ return axios.post(`${base}/ren/homeownerAuth/processHomeownerAuth`, params).then(res => res.data)};
// 自动审核状态
export const AutshHomeAuth = params =>{ return axios.post(`${base}/ren/homeownerAuth/automaticReview`).then(res => res.data)};
// 修改状态
export const EditAutshHome = params =>{ return axios.post(`${base}/ren/homeownerAuth/modifyAutomaticReview/`+ params )};

// 租赁列表
export const HomeRentList = params => { return axios.get(`${base}/rent/rentInfo/list`,{ params: params })};
// 租赁记录
export const RentRecord = params => { return axios.get(`${base}/rent/rentInfo/rentRecord`,{ params: params })};
// 详情
export const HomeRentDt = params => { return axios.get(`${base}/rent/rentInfo/detail/`+ params )};
// 待审核
export const HomeRentListW = params => { return axios.get(`${base}/rent/rentInfo/listVillageWaitAudit`,{ params: params })};
// 已审核
export const HomeRentListO = params => { return axios.get(`${base}/rent/rentInfo/listVillageAudit`,{ params: params })};
// 审核通过
export const HomeRentTg = params =>{ return axios.post(`${base}/rent/rentInfo/villagePass`, params).then(res => res.data)};
// 审核通过
export const HomeRentNtg = params =>{ return axios.post(`${base}/rent/rentInfo/villageNoPass`, params).then(res => res.data)};
// 自动审核
export const  AutshHomeRent= params => { return axios.get(`${base}/rent/rentInfo/currentVillageStatus`,{ params: params })};
// 查询租赁状态
export const  GetStatusCombo= params => { return axios.get(`${base}/rent/rentInfo/getStatusCombo`)};
// 修改状态
export const EditStatusCombo = params => { return axios.post(`${base}/rent/rentInfo/modifyVillageStatus/`+ params )};
// 后台退租
export const BackRent= params => { return axios.post(`${base}/rent/rentInfo/leaseOut`, params ).then(res =>res.data)};
// 查询所有房屋

export const getHouseList = params => { return axios.get(`${base}/rent/rentInfo/basicRoomlist`, {params} ).then(res =>res.data)};



// 根据房屋id查询楼层
export const getFloorList = params => { return axios.get(`${base}/rent/rentInfo/basicFloorsList`, {params} ).then(res =>res.data)};
// 根据房屋id和楼层查询房间号
export const getRoomList = params => { return axios.get(`${base}/rent/rentInfo/basicRoomsList`, {params} ).then(res =>res.data)};
// 根据房间id获取房东列表
export const getLandlordsList = id => { return axios.get(`${base}/rent/rentInfo/landlords/${id}`).then(res =>res.data)};
// 根据房间id获取屋主信息
export const getHomeownerInfo = id => { return axios.get(`${base}/rent/rentInfo/homeownerInfo/${id}`).then(res =>res.data)};
// 后台-租赁备案
export const reportTenement = params => { return axios.post(`${base}/rent/rentInfo/tenementReport`, params).then(res =>res.data)};
//  修改租赁时间
export const updateRentTime = params => { return axios.post(`${base}/rent/rentInfo/updateRentTime`, params).then(res =>res.data)};





// 红色物业  党员示范岗列表
export const demonstrationPostList = params => {return axios.get(`${base}/red/demonstrationPost/list`,{params:params})};
// 党员示范新增
export const demonstrationPostAdd = params =>{return axios.post(`${base}/red/demonstrationPost`,params).then(res => res.data)}
// 修改展示状态
export const demonstrationPostShow = params =>{return axios.get(`${base}/red/demonstrationPost/updateStatus/`+params)};
// 党员示范修改
export const demonstrationPostUpdate =params =>{return axios.put(`${base}/red/demonstrationPost`,params).then(res =>res.data)};
// 查询党员示范详情
export const demonstrationPostQuery = params =>{return axios.get(`${base}/red/demonstrationPost/`+params)};
// 删除党员示范
export const demonstrationPostDelete = params =>{return axios.delete(`${base}/red/demonstrationPost/`+params)};

// 服务实景图管理列表
export const realisticViewList = params =>{return axios.get(`${base}/red/realisticView/list`,{params:params})};
// 新增
export const realisticViewAdd = params =>{return axios.post(`${base}/red/realisticView`,params).then(res => res.data)};
// 修改
export const realisticViewUpdate = params =>{return axios.put(`${base}/red/realisticView`,params).then(res => res.data)};
// 删除
export const realisticViewDelete = params =>{return axios.delete(`${base}/red/realisticView/`+params)};
// 获取详情
export const realisticViewQuery = params =>{return axios.get(`${base}/red/realisticView/`+params)};
// 修改状态
export const realisticViewShow = params =>{return axios.get(`${base}/red/realisticView/updateStatus/`+params)};

/**美丽阿姐管理 */
// 新增
export const addPrettySister = params =>{return axios.post(`${base}/basic/beautifulSister`,params).then(res => res.data)};
// 修改
export const editPrettySister = params =>{return axios.post(`${base}/basic/beautifulSister/edit`,params).then(res => res.data)};
// 删除
export const delPrettySister = (id) =>{return axios.delete(`${base}/basic/beautifulSister/${id}`).then(res => res.data)};
// 列表
export const listPrettySister = params =>{return axios.get(`${base}/basic/beautifulSister/list`,{params:params}).then(res => res.data)};
// 修改展示状态
export const statuPrettySister = (id) =>{return axios.get(`${base}/basic/beautifulSister/updateStatus/${id}`).then(res => res.data)};
// 获取美丽阿姐详细信息
export const getPrettySister = (id) =>{return axios.get(`${base}/basic/beautifulSister/${id}`).then(res => res.data)};

/**双报到党员 */
// 查询双报到党员列表
export const DoubleCheckList = params =>{return axios.get(`${base}/basic/doubleReporting/list`,{params:params}).then(res => res.data)};
// 新增双报到党员
export const addDoubleCheck = params =>{return axios.post(`${base}/basic/doubleReporting`,params).then(res => res.data)};
// 修改双报到党员
export const editDoubleCheck = params =>{return axios.put(`${base}/basic/doubleReporting`,params).then(res => res.data)};
// 获取双报到党员详细信息
export const getDoubleCheck = id =>{return axios.get(`${base}/basic/doubleReporting/${id}`).then(res => res.data)};
// 删除双报到党员
export const delDoubleCheck = (id) =>{return axios.delete(`${base}/basic/doubleReporting/${id}`).then(res => res.data)};

/**乡村振兴 */
// 新增东风名片
export const addDFCard = params =>{return axios.post(`${base}/xczx/businessCard`,params).then(res => res.data)};
// 修改东风名片
export const editDFCard = params =>{return axios.post(`${base}/xczx/businessCard/edit`,params).then(res => res.data)};
// 查询东风名片列表
export const getDFCardList = () =>{return axios.get(`${base}/xczx/businessCard/list`).then(res => res.data)};
// 查询东风大事记列表
export const getDThingsList = params =>{return axios.get(`${base}/xczx/memoirs/list`, {params}).then(res => res.data)};
// 新增东风大事记
export const addDThingsList = params =>{return axios.post(`${base}/xczx/memoirs`,params).then(res => res.data)};
// 修改东风大事记
export const editDThingsList = params =>{return axios.put(`${base}/xczx/memoirs`,params).then(res => res.data)};
// 获取东风大事记详细信息
export const getDThings = id =>{return axios.get(`${base}/xczx/memoirs/${id}`).then(res => res.data)};
// 删除东风大事记
export const delDThings = id =>{return axios.delete(`${base}/xczx/memoirs/${id}`).then(res => res.data)};
// 修改展示状态
export const statuDThings = id =>{return axios.get(`${base}/xczx/memoirs/updateStatus/${id}`).then(res => res.data)};
// 轮播图列表
export const getCarouselPList = () =>{return axios.get(`${base}/xczx/carouselChart/list`).then(res => res.data)};
// 新增轮播图
export const addCarouselP = params =>{return axios.post(`${base}/xczx/carouselChart`,params).then(res => res.data)};
// 修改轮播图
export const editCarouselP = params =>{return axios.put(`${base}/xczx/carouselChart`,params).then(res => res.data)};
// 删除轮播图
export const delCarouselP = id =>{return axios.delete(`${base}/xczx/carouselChart/${id}`).then(res => res.data)};
// 轮播图详细信息
export const getCarouselP = id =>{return axios.get(`${base}/xczx/carouselChart/${id}`).then(res => res.data)};
// 轮播视频列表
export const getCarouselVList = () =>{return axios.get(`${base}/xczx/carouselVideo/list`).then(res => res.data)};
// 新增-轮播视频
export const addCarouselV = params =>{return axios.post(`${base}/xczx/carouselVideo`,params).then(res => res.data)};
// 修改-轮播视频
export const editCarouselV = params =>{return axios.put(`${base}/xczx/carouselVideo`,params).then(res => res.data)};
// 删除-轮播视频
export const delCarouselV = id =>{return axios.delete(`${base}/xczx/carouselVideo/${id}`).then(res => res.data)};
// 轮播视频详细信息
export const getCarouselV = id =>{return axios.get(`${base}/xczx/carouselVideo/${id}`).then(res => res.data)};

/**林地基础信息管理 */
// 查询林地基础信息管理列表
export const getForestList = params =>{return axios.get(`${base}/basic/woodland/list`, {params}).then(res => res.data)};
// 统计
export const getForestTJ = () =>{return axios.get(`${base}/basic/woodland/statistics`).then(res => res.data)};