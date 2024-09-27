import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login.vue'
import Home from '../views/home.vue'
import Welcome from '../views/welcome.vue'
import Notice from '../views/notice/index.vue'
import Info from '../views/notice/info.vue'
import News from '../views/news/index.vue'
import Introduction from '../views/introduction.vue'

// 物业管理
import SerPerson from '../views/property/category.vue'
import Propertyer from '../views/property/property.vue'
import Kqdk from '../views/property/kqdk.vue'
import Work from '../views/property/work.vue'
import Service from '../views/property/service.vue'
import ServCont from '../views/property/sercont.vue'
import APatrol from '../views/property/patrol.vue'
import WPatLay from '../views/property/layout.vue'
import AEventlist from '../views/property/event.vue'
import Profile from '../views/property/profile.vue'
import Dynamicstate from '../views/property/dynamicstate.vue'
import Demonstrate from '../views/property/demonstrate.vue'
import Realisticpicture from '../views/property/realisticpicture.vue'

// 乡村振兴
import DFCard from '../views/village/dfCard.vue'
import DFThings from '../views/village/dfThings.vue'
import DFStatu from '../views/village/dfStatu.vue'
import Carousel from '../views/village/carousel.vue'

// 房、人、车管理
import Staff from '../views/base/staff.vue'
import Dagl from '../views/base/dagl.vue'
import House from '../views/base/house.vue'
import Resident from '../views/base/index.vue'
import Car from '../views/base/car.vue'
import Rhouse from '../views/base/rhouse.vue'
import Rexam from '../views/base/exam.vue'
import Rowner from '../views/base/owner.vue'
import Rownexam from '../views/base/ownexam.vue'
import Villagecondition from '../views/base/villagecondition.vue'
import Building from '../views/base/building.vue'
import Management from '../views/base/management.vue'
import Partymember from '../views/base/partymember.vue'
import Dynamics from '../views/base/builDynamics.vue'
import Equipment from '../views/base/equipment.vue'
import Points from '../views/base/points.vue'
import Comehpersonnel from '../views/base/comehpersonnel.vue'
import Carerecord from '../views/base/carerecord.vue'
import PrettySister from '../views/base/prettySister.vue'
import DoubleCheck from '../views/base/doubleCheck.vue'

// 道路管理
import DHome from '../views/road/index.vue'
import DOver from '../views/road/overview.vue'
import DPatrol from '../views/road/patrol.vue'
import DPatLay from '../views/road/layout.vue'
import DEventlist from '../views/road/event.vue'
import Diver from '../views/road/base.vue'

// 河道管理
import RHome from '../views/river/index.vue'
import ROver from '../views/river/overview.vue'
import River from '../views/river/base.vue'
import RPatrol from '../views/river/patrol.vue'
import RPatLay from '../views/river/layout.vue'
import REventlist from '../views/river/event.vue'
import RForest from '../views/river/forest.vue'

// 日常巡查管理
import Patrol from '../views/patrol/index.vue'
import PatLay from '../views/patrol/layout.vue'
// 人居环境管理
import Eventlist from '../views/environment/eventlist.vue'
import Demo from '../views/environment/demo.vue'

// 系统管理
import Depart from '../views/system/depart.vue'
import Role from '../views/system/role.vue'
import Post from '../views/system/person.vue'
import User from '../views/system/user.vue'
import Menu from '../views/system/menu.vue'
import LoginLog from '../views/system/loginlog.vue'
import CzLog from '../views/system/czlog.vue'
import Limit from '../views/system/limit.vue'
import Onlinjk from '../views/system/onlinejk.vue'
import Allot from '../views/system/allot.vue'

import VillReport from '../views/report/village.vue'
import WyReport from '../views/report/wy.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    hidden: true,
  },
  {
    path: '/Welcome',
    name: 'Welcome',
    component: Welcome,
    hidden: true,
  },
  {
    path: '/Introduction',
    name: 'Introduction',
    component: Introduction,
    hidden: true,
  },
  // 通知公告管理
  {
    path: '/',
    component: Home,
    name: '通知公告管理',
    iconCls: 'icon-tzgg',
    hidden: false,
    leaf: false,
    children: [
      {
        path: '/Notice',
        component: Notice,
        name: '通知公告(管)',
      },
      {
        path: '/Info',
        component: Info,
        name: '通知公告(看)',
      },
    ],
  },
  // 新闻动态1
  {
    path: '/',
    component: Home,
    name: '新闻动态',
    iconCls: 'icon-xwdt',
    hidden: false,
    leaf: true,
    children: [
      {
        path: '/News',
        component: News,
        name: '新闻动态1',
      },
    ],
  },
	// 党建引领
  // 基础信息
  {
    path: '/',
    component: Home,
    name: '基础信息',
    iconCls: 'icon-jcxx',
    hidden: false,
    leaf: false,
    children: [
      {
        path: '/Carerecord',
        component: Carerecord,
        name: '关怀记录',
      },
      {
        path: '/Dagl',
        component: Dagl,
        name: '档案列表',
      },
      {
        path: '/House',
        component: House,
        name: '房屋信息',
      },
      {
        path: '/Resident',
        component: Resident,
        name: '居民基础信息列表',
      },
      {
        path: '/Car',
        component: Car,
        name: '车辆信息列表',
      },
      {
        path: '/Rhouse',
        component: Rhouse,
        name: '房屋租赁列表',
      },
      {
        path: '/Rexam',
        component: Rexam,
        name: '租赁审核列表',
      },
      {
        path: '/Rowner',
        component: Rowner,
        name: '屋主列表',
      },
      {
        path: '/Rownexam',
        component: Rownexam,
        name: '屋主审核列表',
      },
      {
        path: '/Villagecondition',
        component: Villagecondition,
        name: '村情管理',
      },
      {
        path: '/Building',
        component: Building,
        name: '党建介绍',
      },
      {
        path: '/Management',
        component: Management,
        name: '党组织管理',
      },
      {
        path: '/Partymember',
        component: Partymember,
        name: '党员管理',
      },
      {
        path: '/PrettySister',
        component: PrettySister,
        name: '美丽阿姐管理',
      },
      {
        path: '/DoubleCheck',
        component: DoubleCheck,
        name: '双报到党员管理',
      },
      {
        path: '/Dynamics',
        component: Dynamics,
        name: '党建动态',
      },
      {
        path: '/Equipment',
        component: Equipment,
        name: '设备管理',
      },
      {
        path: '/Points',
        component: Points,
        name: '积分管理',
      },
      {
        path: '/Comehpersonnel',
        component: Comehpersonnel,
        name: '来沪人员管理费',
      },
      {
        path: '/Staff',
        component: Staff,
        name: '工作人员管理',
      },
    ],
  },
	// 乡村振兴
	{
  	path: '/',
  	component: Home,
  	name: '乡村振兴',
  	iconCls: 'icon-xcyl',
  	hidden: false,
  	leaf: false,
  	children:[
  		{
  			path: '/DFCard',
  			component: DFCard,
  			name: '东风名片',
  		},
  		{
  			path: '/DFThings',
  			component: DFThings,
  			name: '东风大事记',
  		},
  		{
  			path: '/DFStatu',
  			component: DFStatu,
  			name: '东风动态管理',
  		},
  		{
  			path: '/Carousel',
  			component: Carousel,
  			name: '轮播/视频管理',
  		},
  	]
  },
  // 乡村养老
  // {
  // 	path: '/',
  // 	component: Home,
  // 	name: '乡村养老',
  // 	iconCls: 'icon-xcyl',
  // 	hidden: false,
  // 	leaf: false,
  // 	children:[
  // 		{
  // 			path: '/Carerecord',
  // 			component: Carerecord,
  // 			name: '关怀记录',
  // 		},
  // 	]
  // },
  // 河道管理
  {
    path: '/',
    component: Home,
    name: '河道管理',
    iconCls: 'icon-rjhj',
    hidden: false,
    leaf: false,
    children: [
      {
        path: '/RHome',
        component: RHome,
        name: '河道管理首页',
      },
      {
        path: '/ROver',
        component: ROver,
        name: '河道数据总览',
      },
      {
        path: '/River',
        component: River,
        name: '河道基础信息',
      },
      {
        path: '/RPatrol',
        component: RPatrol,
        name: '河道巡查列表',
      },
      {
        path: '/RPatLay',
        component: RPatLay,
        name: '河道检查单模版',
      },
      {
        path: '/REventlist',
        component: REventlist,
        name: '河道事件列表',
      },
      {
        path: '/RForest',
        component: RForest,
        name: '林地基础信息',
      },
    ],
  },
  // 物业管理
  {
    path: '/',
    component: Home,
    name: '乡村物业管理',
    iconCls: 'icon-xcwy',
    hidden: false,
    leaf: false,
    children: [
      {
        path: '/Propertyer',
        component: Propertyer,
        name: '物业服务人员',
      },
      {
        path: '/SerPerson',
        component: SerPerson,
        name: '垃圾分类人员',
      },
      {
        path: '/Kqdk',
        component: Kqdk,
        name: '考勤打卡',
      },
      {
        path: '/Work',
        component: Work,
        name: '工作打卡',
      },
      {
        path: '/Service',
        component: Service,
        name: '物业服务列表',
      },
      {
        path: '/ServCont',
        component: ServCont,
        name: '服务内容管理',
      },
      {
        path: '/APatrol',
        component: APatrol,
        name: '安全巡查列表',
      },
      {
        path: '/WPatLay',
        component: WPatLay,
        name: '物业检查单模板',
      },
      {
        path: '/AEventlist',
        component: AEventlist,
        name: '安全事件列表',
      },
      {
        path: '/Profile',
        component: Profile,
        name: '简介管理',
      },
      {
        path: '/Dynamicstate',
        component: Dynamicstate,
        name: '动态管理',
      },
      {
        path: '/Demonstrate',
        component: Demonstrate,
        name: '党员示范岗管理',
      },
      {
        path: '/Realisticpicture',
        component: Realisticpicture,
        name: '服务实景图管理',
      },
    ],
  },
  // 日常巡查管理
  {
    path: '/',
    component: Home,
    name: '日常巡查管理',
    iconCls: 'icon-rcxc',
    hidden: false,
    leaf: false,
    children: [
      {
        path: '/Patrol',
        component: Patrol,
        name: '巡查列表',
      },
      {
        path: '/PatLay',
        component: PatLay,
        name: '检查单模版',
      },
    ],
  },
  // 系统管理
  {
    path: '/',
    component: Home,
    name: '系统管理',
    iconCls: 'icon-xtgl',
    hidden: false,
    leaf: false,
    children: [
      {
        path: '/Depart',
        component: Depart,
        name: '部门管理',
      },
      {
        path: '/User',
        component: User,
        name: '用户管理',
      },
      {
        path: '/Role',
        component: Role,
        name: '角色管理',
      },
      {
        path: '/Menu',
        component: Menu,
        name: '菜单管理',
      },
      {
        path: '/Onlinjk',
        component: Onlinjk,
        name: '在线用户监控',
      },
      {
        path: '/LoginLog',
        component: LoginLog,
        name: '登录日志',
      },
      {
        path: '/CzLog',
        component: CzLog,
        name: '操作日志',
      },
      {
        path: '/Limit',
        component: Limit,
        name: '更新授权',
      },
      {
        path: '/Allot',
        component: Allot,
        name: '事件自动分派管理',
      },
    ],
  },
  {
    path: '/',
    component: Home,
    name: '报表管理',
    iconCls: 'icon-xtgl',
    hidden: false,
    leaf: false,
    children: [
      {
        path: '/VillReport',
        component: VillReport,
        name: '东风村报表',
      },
      {
        path: '/WyReport',
        component: WyReport,
        name: '物业报表',
      },
    ],
  },

  // 道路管理
  {
    path: '/',
    component: Home,
    name: '道路管理',
    iconCls: 'icon-rcxc',
    hidden: false,
    leaf: false,
    children: [
      {
        path: '/DHome',
        component: DHome,
        name: '道路数据首页',
      },
      {
        path: '/DOver',
        component: DOver,
        name: '道路数据总览',
      },
      {
        path: '/Diver',
        component: Diver,
        name: '道路基础信息',
      },
      {
        path: '/DPatrol',
        component: DPatrol,
        name: '道路巡查列表',
      },
      {
        path: '/DPatLay',
        component: DPatLay,
        name: '道路检查单模版',
      },
      {
        path: '/DEventlist',
        component: DEventlist,
        name: '道路事件列表',
      },
    ],
  },
]

const router = new VueRouter({
  routes,
})

export default router
