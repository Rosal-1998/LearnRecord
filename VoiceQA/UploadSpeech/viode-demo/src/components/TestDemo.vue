<template>
	<div class="question-answer">
		<div class="question">
			<h3>
				{{ questionList[questionIndex].question }}
			</h3>
			<el-button class="answer" :class="currt == index? 'activate':''" v-for="(item, index) in questionList[questionIndex].answer" :key="index">{{ item
				}}</el-button>
		</div>
	</div>
	<div class="select-box">
		<input type="file" @change="onFileChange"/>
        <el-button @click="uploadFile" :disabled="!selectedFile">上传答案</el-button>
		<!-- <el-upload ref="uploadRef" class="upload-demo" :auto-upload="false">
			<template #trigger>
				<el-button type="primary">select file</el-button>
			</template>
			<el-button class="ml-3" type="success" @click="submitUpload">
				upload to server
			</el-button>
		</el-upload> -->
	</div>
	<el-button @click = "changeQuestion('pre')" :disabled="questionIndex == 0"> 上一题 </el-button>
	<el-button @click = "changeQuestion('next')" :disabled="questionIndex == questionList.length-1"> 下一题 </el-button>
</template>

<script>
import axios from 'axios';

export default {
	name: 'TestDemo',
	props: {
		// msg: String
	},
	data() {
		return {
			currt: -1,
			questionIndex: 0,
			selectedFile: null,
			questionList: [{
				question: "_________,遥看瀑布挂前川的前一句是？",
				answer: ['飞流直下三千尺', '疑似银河落九天', '日照香炉生紫烟', '望庐山瀑布李白']
			}, {
				question: "飞流直下三千尺,_________的后一句是？",
				answer: ['疑似银河落九天', '遥看瀑布挂前川',  '望庐山瀑布李白','日照香炉生紫烟']
			}

			]
		}

	},methods: {
		changeQuestion(state){
			if(state == 'next'){
				this.questionIndex = this.questionIndex +1
			}else{
				this.questionIndex = this.questionIndex -1
			}
		},

                findMaxIndex(arr) {
                    let maxIndex = -1;
                    let maxValue = -Infinity;

                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i] > maxValue) {
                            maxValue = arr[i];
                            maxIndex = i;
                        }
                    }
                    console.log(maxIndex,'11111111111111')

                    return maxIndex;
                },
                onFileChange(event) {
                    this.selectedFile = event.target.files[0];
                },
                async uploadFile() {
                    if (!this.selectedFile) {
                        alert('Please select a file.');
                        return;
                    }

                    const formData = new FormData();
                    formData.append('audioFile', this.selectedFile);
                    formData.append('answerList', JSON.stringify(this.questionList[0].answer))

                    try {
                        const response = await axios.post('http://127.0.0.1:5000/upload', formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        });
                        console.table(response.data.result);
                        this.currt = this.findMaxIndex(response.data.result);
                
                        console.log('currt',this.currt)
                        this.updateStyles();
                        // alert('File uploaded successfully.');
                    } catch (error) {
                        // console.error(error);
                        // alert('An error occurred while uploading the file.');
                    }
                },
                updateStyles() {
                    // 获取所有 span 元素
                    const spans = document.querySelectorAll('span');
                    // 遍历每个 span 元素，并改变样式
                    spans.forEach((span, index) => {
                        span.classList.toggle('red', index === this.currt);
                    })}
            }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.question-answer {
	/* background-color: red; */
	width: 50%;
	height: 300px;
	margin: 10px auto;
	/* text-align: center; */
	border: #42b983 1px solid;
	border-radius: 10px;
}

/* .queq */
.answer {
	margin: 5px auto;
	display: block;
}
.activate{
	background-color: greenyellow;
}
h3 {
	margin: 40px 0 0;
}

ul {
	list-style-type: none;
	padding: 0;
}

li {
	display: inline-block;
	margin: 0 10px;
}

a {
	color: #42b983;
}
</style>
