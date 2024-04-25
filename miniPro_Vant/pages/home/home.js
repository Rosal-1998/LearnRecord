Page({
  data: {
    active: 0,
  },
  onLoad(){
    wx.hideHomeButton()
  },
  onChange(event) {
    // event.detail 的值为当前选中项的索引
    console.log(event.detail)
    this.setData({ active: event.detail })
  },
})
