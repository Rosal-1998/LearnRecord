Page({
  data: {
    active: 2,
  },
  onShow(){
    wx.hideHomeButton()
  },
  onChange(event) {
    // event.detail 的值为当前选中项的索引
    this.setData({ active: event.detail })
  },
})
