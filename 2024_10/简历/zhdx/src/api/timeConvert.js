// dateUtils.js
function formatDateString(dateStr) {
  // 移除逗号，并使用空格来分隔日期的各个部分
  return dateStr.replace(/,/g, '').replace(/\s+/g, ' ');
}
export function convertDateTimeManual(dateStr, timeStr) {
  // 解析日期字符串并创建日期对象
  // console.log('dateStr,timeStr',dateStr,timeStr)
  const [year, month, day] = dateStr.split('-').map(Number);
  
  // 解构时间字符串
  const [hour, minute, second] = timeStr.split(':').map(Number);
  let time  = new Date(year, month , day, hour, minute, second)
  
  // 返回包含年、月、日、时、分的对象
  return time
  // console.log('dateStr, timeStr',dateStr, timeStr)
  // const date = new Date(dateStr + 'T' + timeStr + '+08:00');
  
  // // 获取日期的组成部分
  // const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
  // const dateString = formatDateString(date.toLocaleDateString('en-US', options));
  
  // // 获取时间的组成部分
  // const timeString = date.toTimeString().split(' ')[0]; // 获取时间部分，不包括时区
  
  // // 构建完整的日期时间字符串
  // return `${dateString}${' '}${timeString} GMT+0800 (中国标准时间)`;
}