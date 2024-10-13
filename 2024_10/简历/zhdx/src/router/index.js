import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login.vue'
import Home from '../views/Home.vue'
import Index from '../views/index.vue'
// 课程管理
import Lesson from '../views/lesson/index.vue'
// 教务管理
import Plan from '../views/web/plan.vue'
import PendingPlan from '../views/web/pending.vue'
import ViewPlan from '../views/web/view.vue'
// 班务管理
import PendingClass from '../views/classaffairs/pending.vue'
import ViewClass from '../views/classaffairs/view.vue'
import DoneClass from '../views/classaffairs/done.vue'
import Notice from '../views/classaffairs/notice.vue'

// 系统管理
import Depart from '../views/system/depart.vue'
import Role from '../views/system/role.vue'
import Limit from '../views/system/limit.vue'
import User from '../views/system/user.vue'
import Menu from '../views/system/menu.vue'
import LoginLog from '../views/system/dlrz.vue'

Vue.use(VueRouter)

const routes = [{
		path: '/',
		name: 'Login',
		component: Login,
		hidden: true,
	},
	{
		path: '/Home',
		name: 'Home',
		component: Home,
		hidden: true,
	},
	
	// {
	// 	path: '/',
	// 	name: '首页',
	// 	component: Index,
	// 	hidden: true,
	// },
	// 课程管理
	{
		path: '/',
		component: Home,
		name: '课程管理',
		iconCls: 'course',
		hidden: false,
		leaf: false,
		children: [
			{
				path: '/Lesson',
				component: Lesson,
				name: '现场教学基地介绍',
			},
			{
				path: '/Index',
				component: Index,
				name: '首页',
			},
		],
		
	},
	
	// 教务系统
	{
		path: '/',
		component: Home,
		name: '教务系统',
		iconCls: 'teach',
		hidden: false,
		leaf: false,
		children: [
			{
				path: '/Plan',
				component: Plan,
				name: '培训计划管理',
			},
			{
				path: '/PendingPlan',
				component: PendingPlan,
				name: '待办培训计划',
			},
			{
				path: '/ViewPlan',
				component: ViewPlan,
				name: '查看培训计划',
			},
		],
	},
	// 班务管理
	{
		path: '/',
		component: Home,
		name: '班务管理',
		iconCls: 'class',
		hidden: false,
		leaf: false,
		children: [
			{
				path: '/PendingClass',
				component: PendingClass,
				name: '待办班次',
			},
			{
				path: '/ViewClass',
				component: ViewClass,
				name: '查看班次',
			},
			{
				path: '/DoneClass',
				component: DoneClass,
				name: '已办班次',
			},

			{
				path: '/Notice',
				component: Notice,
				name: '通知公告',
			},
		],
	},
	// 系统管理
	{
		path: '/',
		component: Home,
		name: '系统管理',
		iconCls: 'system',
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
				path: '/LoginLog',
				component: LoginLog,
				name: '登录日志',
			},
		],
	},
]

const router = new VueRouter({
	routes
})

export default router