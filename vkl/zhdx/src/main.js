import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// css样式引入
import './assets/css/index.css'
import './assets/js/rem.js'
// 若依树状
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
Vue.component('treeselect', Treeselect)
import comjs from '../src/assets/js/common.js'
Vue.prototype.comjs = comjs

import downloadQR from '../src/assets/js/downloadQR.js'
Vue.prototype.downloadQR = downloadQR

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

Vue.config.productionTip = false

import axios from 'axios'
Vue.prototype.$axios = axios
axios.defaults.baseURL = '/api'
let Authorization = localStorage.getItem('Authorization')
if (Authorization) {
	axios.defaults.headers.common['Authorization'] = JSON.parse(Authorization)
}
// http响应拦截器
axios.interceptors.response.use(data => {
	const code = data.data.code
	// if(code == '0' || code == '401' || code == '504' || code =='500') { //未登录
	if(code == '0' || code == '401' || code == '504' ) { //未登录
		router.replace({
			path: '/'
		})
	}
	return data
}, error => {
	// console.log('error',error)
	const code = error.code
	// const code = error.data.code
	if(code == 502) {}
	return Promise.reject(error)
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
