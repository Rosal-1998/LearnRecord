module.exports = {
    plugins: {
        'postcss-pxtorem': {
            rootValue: 192, // 已设计稿宽度375px为例 vant用的是375的设计稿
            propList: ['*'],
        },
    },
};
