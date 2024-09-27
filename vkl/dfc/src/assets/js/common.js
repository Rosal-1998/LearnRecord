import axios from "axios"
export default {
	// 下载文件
	downfile:function(url,type){
		axios.get(url, {
		    responseType: 'blob'
		}).then((res) => {
		    let filename;
				console.log('content-disposition',res.headers['content-disposition'])
		    if(res.headers['content-disposition'] != undefined){
					
				// debugger
		        // filename = decodeURIComponent((res.headers['content-disposition']).split('filename=')[0]).split(";")[0];
				filename = decodeURIComponent((res.headers['content-disposition']).split('filename=')[1].split(";")[1].split("''")[1]);
				console.log('filename',filename)
		    }else{
		        filename = new Date().getTime()+'.'+ type;
		    }
		    if (window.navigator.msSaveOrOpenBlob) {
		        // 兼容IE10
		        const blob = new Blob([res.data])
		        navigator.msSaveBlob(blob, filename)
		    } else {
		        let blob = res.data;
		        let reader = new FileReader();
		        reader.readAsDataURL(blob);
		        reader.onload = (e) => {
		            let a = document.createElement('a');
		            a.download = filename;
		            a.href = e.target.result;
		            document.body.appendChild(a);
		            a.click()
		            document.body.removeChild(a);
		        }
		    }
		});
	},
	// 上传文件
	chooseimg:function(val){
		let inputDOM;
		let isLt;
		inputDOM = this.$refs.jsx
		isLt = inputDOM.files[0].size / 1024 / 5 >= 1 && inputDOM.files[0].size / 1024 / 1024 / 10 <= 1;
		if (!isLt) {
			this.$message.error("上传文件大小不得小于5KB,不得大于10MB!");
		}else{
			// 获取类型结果
			let result = '';
			const flieArr = inputDOM.files[0].name.split('.');
			let suffix = flieArr[flieArr.length - 1];
			const wordlist = ['xls', 'xlsx'];
			result = wordlist.find(item => item === suffix);
			if (result) {
				this.filebox = inputDOM.files[0]
				inputDOM.value = '';
				this.uploadimg('1')
			}else{
				this.$message({
					message:'只允许上传Excel格式的文档',
					type:'error'
				})
			}
		}
		return isLt;
	},
	// 文件上传
	uploadimg:function(type){
		var random = new Date().getTime().toString();
		let formData = new FormData();
		formData.append("file",this.filebox);
		axios.post('/admin/sys_user/import?t='+random, formData ,{
			headers: {
				"Content-Type" :"multipart/form-data",
			},
			withCredentials:true,
		}).then((res) =>{
			if(res.data.code == 1){
				this.$message({
					message:res.data.msg,
					type:'success'
				})
				this.getlist('')
			}else {
				this.$message({
					message:res.data.msg,
					type:'error'
				})
			}
		}).catch((res) =>{
			console.log(res,'2')
		})
	},
	
}