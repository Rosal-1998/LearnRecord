Page({
  data: {
    active: 1,
  },
  onShow(){
    wx.hideHomeButton()
  },
  onChange(event) {
    // event.detail 的值为当前选中项的索引
    console.log(event.detail)
    this.setData({ active: event.detail })
  },
})
