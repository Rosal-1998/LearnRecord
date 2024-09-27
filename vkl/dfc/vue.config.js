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
      args[0].title = '数智乡村（东风村）综合管理系统'
      return args
    })
  },
  devServer: {
    port: 8080,
    proxy: {
      '/api': {
        // target: 'http://192.168.2.14:8083/', //代理地址 江
        // target:'http://192.168.2.61:8083/',  //代理地址 曾
        // target: "http://192.168.2.42:8083/", //代理地址 刘
        // target: "http://192.168.1.195:8083/", //代理地址 刘
        target:'http://192.168.2.105:8083/', //邓
        // target:'http://192.168.1.30:8083/', // 线上测试
        // target:'http://192.168.1.101:8083/', //祝
        // target:'http://dust.vkeline.com:1283/',
        // target: 'http://192.168.1.195:8083/', // 线上
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        pathRewrite: {
          '^/api': ''
        },
      },
    },
  },
})
