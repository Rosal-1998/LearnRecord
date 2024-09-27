//index.js
Page({
  data: {
    chartData1: {},
    chartData2: {},
    opts:{}
    //您可以通过修改 config-ucharts.js 文件中下标为 ['column'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
    // opts1: {
    //   color: [
    //     '#1890FF',
    //     '#91CB74',
    //     '#FAC858',
    //     '#EE6666',
    //     '#73C0DE',
    //     '#3CA272',
    //     '#FC8452',
    //     '#9A60B4',
    //     '#ea7ccc',
    //   ],
    //   padding: [15, 15, 0, 5],
    //   enableScroll: false,
    //   legend: {},
    //   xAxis: {
    //     disableGrid: true,
    //   },
    //   yAxis: {
    //     data: [
    //       {
    //         min: 0,
    //       },
    //     ],
    //   },
    //   extra: {
    //     column: {
    //       type: 'group',
    //       width: 30,
    //       activeBgColor: '#000000',
    //       activeBgOpacity: 0.08,
    //     },
    //   },
    // },
    // opts2: {
    //   rotate: false,
    //   rotateLock: false,
    //   color: [
    //     '#1890FF',
    //     '#91CB74',
    //     '#FAC858',
    //     '#EE6666',
    //     '#73C0DE',
    //     '#3CA272',
    //     '#FC8452',
    //     '#9A60B4',
    //     '#ea7ccc',
    //   ],
    //   padding: [5, 5, 5, 5],
    //   dataLabel: true,
    //   enableScroll: false,
    //   legend: {
    //     show: true,
    //     position: 'right',
    //     lineHeight: 25,
    //   },
    //   title: {
    //     name: '收益率',
    //     fontSize: 15,
    //     color: '#666666',
    //   },
    //   subtitle: {
    //     name: '70%',
    //     fontSize: 25,
    //     color: '#7cb5ec',
    //   },
    //   extra: {
    //     ring: {
    //       ringWidth: 60,
    //       activeOpacity: 0.5,
    //       activeRadius: 10,
    //       offsetAngle: 0,
    //       labelWidth: 15,
    //       border: false,
    //       borderWidth: 3,
    //       borderColor: '#FFFFFF',
    //     },
    //   },
    // },
  },

  getServerData() {
    //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
    let res = {
      categories: ['2018', '2019', '2020', '2021', '2022', '2023'],
      series: [
        {
          name: '目标值',
          data: [35, 36, 31, 33, 13, 34],
        },
        {
          name: '完成量',
          data: [18, 27, 21, 24, 6, 28],
        },
      ],
    }
    this.setData({ chartData1: JSON.parse(JSON.stringify(res)) })
    let res2 = {
      series: [
        {
          data: [
            { name: '一班', value: 50 },
            { name: '二班', value: 30 },
            { name: '三班', value: 20 },
            { name: '四班', value: 18 },
            { name: '五班', value: 8 },
          ],
        },
      ],
    }
    this.setData({ chartData2: JSON.parse(JSON.stringify(res2)) })
  },
  onShow() {
    this.getServerData()
  },
})
