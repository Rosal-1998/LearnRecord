import axios from 'axios';

let base = '';
// 系统登出
export const login = params => { return axios.post(`${base}/login`, params).then(res => res.data)};
// 退出
export const logout = params => { return axios.post(`${base}/logout`).then(res => res.data)};

// 更新授权
// 获取授权信息
export const getLicense = params => { return VKrequest.get(`${base}/license/info`) };
// 授权状态
export const statusLicense = params => { return VKrequest.get(`${base}/license/status`) };



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
export const ResetPassword = params => { return axios.get(`${base}/system/user/resetPassword/`+ params )}; 


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

// 登录日志
export const LoginlogList = params => { return axios.get(`${base}/monitor/logininfor/list`, { params: params })};
// 导出
export const LoginlogExport = params =>{ return axios.post(`${base}/monitor/logininfor/export`, params).then(res => res.data)};
// 删除
export const DelLoginlog  = params =>{ return axios.delete(`${base}/monitor/logininfor/`+ params )}



/* 教务培训计划管理 */
// 查询教务培训计划管理列表 /jw/trainingPlan/list
export const getTrainingPlanList = params => { return axios.get(`${base}/jw/trainingPlan/list`, { params: params })};

// 新增教务培训计划管理 /jw/trainingPlan
export const addTrainPlan = params => { return axios.post(`${base}/jw/trainingPlan`, params).then(res => res.data)};

// 编辑教务培训计划管理 /jw/trainingPlan[PUT]
export const updateTrainPlan = params => { return axios.put(`${base}/jw/trainingPlan`, params).then(res => res.data)};

// 获取教务培训计划管理详细信息 /jw/trainingPlan/{id}
export const TrainPlanDetail = params => { return axios.get(`${base}/jw/trainingPlan/`+ params )};
// 删除教务培训计划管理 /jw/trainingPlan/{id} [DELETE]
export const deleteTrainPlan = params => { return axios.delete(`${base}/jw/trainingPlan/`+ params ).then(res => res.data)};
// 归档 / bw/shift/archivist
export const archiveTrainPlan = params => { return axios.get(`${base}/jw/trainingPlan/archivist`,{ params: params } )};


//获取实时课程安排 /jw/courseArrange/queryCourseList
export const getCourseListByPlanID = params => { return axios.get(`${base}/jw/courseArrange/queryCourseList`,{ params: params })};

// 新增实时课程/jw/courseArrange[post]
export const addCourse = params => { return axios.post(`${base}/jw/courseArrange`, params).then(res => res.data)};
// 编辑实时课程   /jw/courseArrange[PUT]
export const updateCourse = params => { return axios.put(`${base}/jw/courseArrange`, params).then(res => res.data)};
// 删除实时课程
export const deleteCourse = params => { return axios.delete(`${base}/jw/courseArrange/`+ params ).then(res => res.data)};
// 获取课程详情
export const courseDetail = params => { return axios.get(`${base}/jw/courseArrange/`+ params )};


// 导出教务课程安排列表
export const exportCourse = params => { return axios.post(`${base}/jw/courseArrange/export`, params).then(res => res.data)};



// 学员管理
// 查询学员列表 /bw/student/list
export const getStudentList = params => { return axios.get(`${base}/bw/student/list`, { params: params })};
// 删除学员 /bw/student/{ids}
export const deleteStudent = params => { return axios.delete(`${base}/bw/student/`+ params ).then(res => res.data)};
// 新增学员
export const addStudent = params => { return axios.post(`${base}/bw/student`, params).then(res => res.data)};

// 编辑学员
export const updateStudent = params => { return axios.put(`${base}/bw/student`, params).then(res => res.data)};

// 获取学员详细信息 /bw/student/
export const studentDetail = params => { return axios.get(`${base}/bw/student/`+ params )};



// 报到管理
// 查询报到列表 /bw/reportStatus/list
export const getReportList = params => { return axios.get(`${base}/bw/reportStatus/list`, { params: params })};
// 报到状态的修改 /bw/reportStatus/edit
export const updateReportStatus = params => {
  return axios.get(`${base}/bw/reportStatus/edit`, {params:params} ).then(res => res.data)};


// 班级相册管理
// 查询班级相册列表 /bw/classAlbum/list
export const getAlbumList = params => { return axios.get(`${base}/bw/classAlbum/list`, { params: params })};

// 删除相册 bw/classAlbum/{ids}
export const deleteAlbum = params => { return axios.delete(`${base}/bw/classAlbum/`+ params ).then(res => res.data)};

// 新增相册 /bw/classAlbum
export const addAlbum = params => { return axios.post(`${base}/bw/classAlbum`, params).then(res => res.data)};
// 编辑相册 /bw/classAlbum
export const updateAlbum = params => { return axios.put(`${base}/bw/classAlbum`, params).then(res => res.data)};
// 获取相册详情 /bw/classAlbum/
export const albumDetail = params => { return axios.get(`${base}/bw/classAlbum/`+ params )};




// 教学资料管理
// 查询教学资料列表 /bw/resourcesMaterial/list
export const getCourseWareList = params => { return axios.get(`${base}/bw/resourcesMaterial/list`, { params: params })};
// 删除教学资料 /bw/resourcesMaterial/{resourcesMaterialIds}
export const deleteCourseWare= params => { return axios.delete(`${base}/bw/resourcesMaterial/`+ params ).then(res => res.data)};
// 上传教学资料 /bw/resourcesMaterial
export const addCourseWare = params => { return axios.post(`${base}/bw/resourcesMaterial`, params).then(res => res.data)};

// 作业管理
// 查询作业管理列表 /bw/homework/list
export const getHomeworkList = params => { return axios.get(`${base}/bw/homework/list`, { params: params })};
// 删除作业 /bw/homework/{id}
export const deleteHomework= params => { return axios.delete(`${base}/bw/homework/`+ params ).then(res => res.data)};
// 催交作业 /bw/homework/urgeDelivery
export const pushHomeWork = params => { return axios.post(`${base}/bw/homework/urgeDelivery`, params).then(res => res.data)};
// 作业统计 /bw/homework/count
export const getHomeworkCount = params => { return axios.get(`${base}/bw/homework/count`, { params: params })};

// 作业类型管理
// 查询作业类型列表 /bw/homeworkType/list
export const getHomeworkTypeList = params => { return axios.get(`${base}/bw/homeworkType/list`, { params: params })};
// 删除作业类型 /bw/homeworkType/{homeworkTypeIds}
export const deleteHomeworkType = params => { return axios.delete(`${base}/bw/homeworkType/`+ params ).then(res => res.data)};
// 新增作业类型 /bw/homeworkType[post]
export const addHomeworkType = params => { return axios.post(`${base}/bw/homeworkType`, params).then(res => res.data)};
// 编辑作业类型 /bw/homeworkType[put]
export const updateHomeworkType = params => { return axios.put(`${base}/bw/homeworkType`, params).then(res => res.data)};
// 获取作业类型详情 /bw/homeworkType/{homeworkTypeId}
export const homeworkTypeDetail = params => { return axios.get(`${base}/bw/homeworkType/`+ params )};


// 教学评估
// 查询教学评估列表 /bw/evaluation/list
export const getEvalList = params => { return axios.get(`${base}/bw/evaluation/list`, { params: params })};
// 催交作业 /bw/evaluation/urgeDelivery
export const pushEval = params => { return axios.post(`${base}/bw/evaluation/urgeDelivery`, params).then(res => res.data)};
// 查询教学评估汇总表 /bw/evaluation/summaryList
export const getEvalSummaryList = params => { return axios.get(`${base}/bw/evaluation/summaryList`, { params: params })};


// 课程管理:现场教学基地介绍 
// 查询基地列表 /courseManagement/management/list
export const getBaseList = params => { return axios.get(`${base}/courseManagement/management/list`, { params: params })};
// 新增基地 /courseManagement/management
export const addBase = params => { return axios.post(`${base}/courseManagement/management`, params).then(res => res.data)};
// 编辑基地
export const updateBase = params => { return axios.put(`${base}/courseManagement/management`, params).then(res => res.data)};
// 获取基地详情 /courseManagement/management/
export const baseDetail = params => { return axios.get(`${base}/courseManagement/management/`+ params )};
// 删除相册 /courseManagement/management
export const deleteBase = params => { return axios.delete(`${base}/courseManagement/management/`+ params ).then(res => res.data)};

// 学生满意度调查管理
// 查询满意度列表  /bw/studentSatisfaction/list
export const getSatisfactionList = params => { return axios.get(`${base}/bw/studentSatisfaction/list`, { params: params })};
// 查询收集开关状态  /bw/studentSatisfaction/list
export const getSatisfactionStatus = params => { return axios.get(`${base}/bw/studentSatisfaction/satisfaction`, { params: params })};
// 催交满意度 /bw/studentSatisfaction/urgeDelivery
export const pushSatisfaction = params => { return axios.post(`${base}/bw/studentSatisfaction/urgeDelivery`, params).then(res => res.data)};
// 满意度调查的状态修改 /bw/studentSatisfaction/updateSatisfaction
export const updateSatisfactionStatus = params => {
  return axios.get(`${base}/bw/studentSatisfaction/updateSatisfaction`, {params:params} ).then(res => res.data)};
// 查询满意度汇总表 /bw/studentSatisfaction/summaryList
export const getSatisfactionSummaryList = params => { return axios.get(`${base}/bw/studentSatisfaction/summaryList`, { params: params })};


// 用餐管理
// 用餐管理列表 /menu/order/dailyOrderStatistics
export const getMenuList = params => { return axios.get(`${base}/menu/order/dailyOrderStatistics`, { params: params })};
// 查询培训日期 /menu/order/trainingDate
export const getMenuDateList = params => { return axios.get(`${base}/menu/order/trainingDate`, { params: params })};
// 报餐统计 /menu/order/mealReportingStatistics
export const getMenuReportList = params => { return axios.get(`${base}/menu/order/mealReportingStatistics`, { params: params })};
// 当日菜单 /menu/order/getInfo
export const getMenuInfoList = params => { return axios.get(`${base}/menu/order/getInfo`, { params: params })};
// 用餐评价 /menu/order/menuEvaluationSummaryList
export const getMenuEvalList = params => { return axios.get(`${base}/menu/order/menuEvaluationSummaryList`, { params: params })};


// 考勤管理
// 考勤管理 /bwAttendanceSheet/attendanceSheet/attendanceCount
export const getCheckinList = params => { return axios.get(`${base}/bwAttendanceSheet/attendanceSheet/attendanceCount`, { params: params })};
// 获取考勤详情 /bwAttendanceSheet/attendanceSheet/{id}
export const checkinDetail = params => { return axios.get(`${base}/bwAttendanceSheet/attendanceSheet/`+ params )};
// 新增或修改考勤规则 /attendanceRules/attendanceRules/saveOrUpdate
export const addCheckinRule = params => { return axios.post(`${base}/attendanceRules/attendanceRules/saveOrUpdate`, params).then(res => res.data)};
// 获取考情规则详情 /attendanceRules/attendanceRules
export const checkinRuleDetail = params => { return axios.get(`${base}/attendanceRules/attendanceRules/`+ params )};
// 下载考勤二维码 /bwAttendanceSheet/attendanceSheet/generateQrCode
export const downloadCheckinQR = params => { return axios.get(`${base}/bwAttendanceSheet/attendanceSheet/generateQrCode`, { params: params })};
// 导出考勤详细信息 /bwAttendanceSheet/attendanceSheet/exportById



// 通知公告
export const getNoticeList = params => { return axios.get(`${base}/system/notice/list`, { params: params })};