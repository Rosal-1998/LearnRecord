// 使用 Mock
var Mock = require('mockjs')
var data = Mock.mock({
    // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
    'list|1-100': [{
        // 属性 id 是一个自增数，起始值为 1，每次增 1
        'id|+1': 1
    }]
})
// 输出结果 将JavaScript对象转换为格式化的JSON字符串，并在控制台输出，null表示不使用自定义替换函数，4表示缩进为4个空格
console.log(JSON.stringify(data, null, 4))
//随机中文人名，不带c就是英文
console.log(Mock.mock('@cname'));
//随机ID
console.log(Mock.mock('@id'));
//随机中文标题，不带c就是英文
console.log(Mock.mock('@ctitle'));
//随机ip地址
console.log(Mock.mock('@ip'));
//随机图片地址
console.log(Mock.mock('@image'));
//随机url地址
console.log(Mock.mock('@url'));
//随机颜色，十六进制
console.log(Mock.mock('@color'));
//随机数值
console.log(Mock.mock('@integer'));
//随机日期
console.log(Mock.mock('@datetime'));
//随机字符串
console.log(Mock.mock('@string'));

//自行扩展占位符
Mock.Random.extend({
  cstore() {
      return this.pick([
          '宠物店',
          '美容店',
          '小吃店',
          '数码店',
          '快餐店'
      ]);
  }
});

console.log(Mock.mock('@cstore'));
