<template>
	<div class="">
		<el-form :model="addForm" :inline="true" ref="addForm" :rules="addFormRules" class="addform add-signcent">
			<el-form-item v-for="(item,index) in reportform" :label="item.__config__.label" :prop="item.__vModel__" :key="index">
				<el-input v-model="item.__config__.defaultValue" :placeholder="item.placeholder" v-if="item.__config__.tagIcon == 'input'"></el-input>
				<el-select v-model="item.__config__.defaultValue" :placeholder="item.placeholder" v-else-if="item.__config__.tagIcon == 'select'">
					<el-option v-for="(items,index) in item.__slot__.options" :label="items.label" :value="items.value" :key="index"></el-option>
				</el-select>
				<el-input type="textarea" v-model="item.__config__.defaultValue" :placeholder="item.placeholder" v-else-if="item.__config__.tagIcon == 'textarea'"></el-input>
				<el-upload class="upload-demo" :action="item.action" :file-list="item.__config__.defaultValue || fillist"  v-else-if="item.__config__.tagIcon == 'upload'">
					<el-button size="small" type="primary">点击上传</el-button>
					<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
				</el-upload>
				<span v-else="">
					
				</span>
			</el-form-item>
		</el-form>
		<span style="margin-left: 680px;" class="btn add-btn" @click="handle">确认</span>
	</div>
</template>

<script>
	import { GetReportForm } from '../../api/api.js'
	export default{
		data(){
			return{
				addForm:{
					evtTypeId:'1',
					
				},
				addFormRules:{},
				
				reportform:[],
				fillist:[],
				arr:[
					{name: 'evtTypeId', value: 1},
					{name: 'evtTitle', value: '22'},
					{name: 'evtPlaceName', value: '222'},
					{name: 'evtDescription', value: '33'},
					{name: 'pictureAttachment', value: null},
					{name: 'videoAttachment', value: null},
					{name: 'audioAttachment', value: null},
				]
			}
		},
		mounted(){
			this.getreport()
			let obj = []
			var params = new Object()
			for(var i=0; i<this.arr.length;i++){
				var key_name = this.arr[i].name
				params[key_name] = this.arr[i].value
			}
			console.log(params,'this.arrthis.arr')
			let a ="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpblR5cGUiOiJsb2dpbiIsImxvZ2luSWQiOiJzeXNfdXNlcjoxNjg0MzkyMTc5ODY4MzYwNzA2Iiwicm5TdHIiOiJGUmZjbU1TMXVsUTg1WkhOMWw0SzFYRFl4OTFIZ0RsdyIsInVzZXJJZCI6MTY4NDM5MjE3OTg2ODM2MDcwNn0.HVoEdnDrpScue0OQu88h1ojdUoS5ZXcxheAAdoA4T3A"
			let b ="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpblR5cGUiOiJsb2dpbiIsImxvZ2luSWQiOiJzeXNfdXNlcjoxNjg0MzkyMTc5ODY4MzYwNzA2Iiwicm5TdHIiOiJGUmZjbU1TMXVsUTg1WkhOMWw0SzFYRFl4OTFIZ0RsdyIsInVzZXJJZCI6MTY4NDM5MjE3OTg2ODM2MDcwNn0.HVoEdnDrpScue0OQu88h1ojdUoS5ZXcxheAAdoA4T3A"
		},
		methods:{
			getreport:function(){
				let para = '1'
				GetReportForm(para).then((res)=>{
					console.log(res,'010')
					this.reportform = res.data.data.fields
					// console.log(this.reportform,'this.reportform')
				})
			},
			handle:function(){
				console.log(this.addForm,'01001010')
				console.log(this.reportform,'2222222222')
				let arr = []
				for(var i=0;i<this.reportform.length;i++){
					arr.push({
						name:this.reportform[i].__vModel__,
						value:this.reportform[i].__config__.defaultValue
					})
				}
				console.log(arr,'__vModel____vModel__')
				
			}
		}
	}
</script>

<style>
</style>