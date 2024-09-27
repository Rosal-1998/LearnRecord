import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// css样式引入
import './assets/css/index.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

Vue.config.productionTip = false
import comjs from '../src/assets/js/common.js'
Vue.prototype.comjs = comjs
import "./assets/js/rem.js"

import axios from 'axios'
Vue.prototype.$axios = axios
axios.defaults.baseURL = '/api'

import * as echarts from 'echarts'
Vue.prototype.$echarts = echarts

let Authorization = localStorage.getItem('Authorization')
if (Authorization) {
	axios.defaults.headers.common['Authorization'] = JSON.parse(Authorization)
}
// http响应拦截器
axios.interceptors.response.use(data => {
	const code = data.data.code
	if(code == '0' || code == '401' || code == '504') { //未登录
		router.replace({
			path: '/'
		})
	}
	return data
}, error => {
	const code = error.data.code
	if(code == 502) {}
	return Promise.reject(error)
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
