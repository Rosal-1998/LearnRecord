const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
	outputDir: "admin", //打包路径
	publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
	transpileDependencies: true,
	// 部署后禁止查看源码
	productionSourceMap: false,
	chainWebpack(config) {
		// 正确写法以下方形式为准，判断一下环境
		config.devtool(process.env.NODE_ENV === 'production' ? false : 'source-map')
		config.plugin('html').tap((args) => {
			args[0].title = '新建区委党校智慧党校平台'
			return args
		})
	},
	devServer: {
		port: 8080,
		proxy: {
			'/api': {
				// target: 'http://192.168.2.105:8083/', //邓
				target: 'http://192.168.2.61:8080/', //曾
				changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
				pathRewrite: {
					'^/api': ''
				},
			},
		},
	},
})