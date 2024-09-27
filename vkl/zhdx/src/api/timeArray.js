export function generateDates(startDateStr, endDateStr) {
  let startDate = new Date(startDateStr);
  let endDate = new Date(endDateStr);
  let dateArray = [];

  while (startDate <= endDate) {
      // dateArray.push(startDate.toISOString().split('T')[0]);
      // startDate.setDate(startDate.getDate() + 1);
      let year = startDate.getFullYear();
      let month = startDate.getMonth() + 1; // getMonth() 返回0-11，需要加1
      let day = startDate.getDate();
      // 补齐月份和日期的位数
      let monthStr = month < 10 ? '0' + month : month;
      let dayStr = day < 10 ? '0' + day : day;
      // 拼接日期字符串
      let dateStr = `${year}-${monthStr}-${dayStr}`;
      dateArray.push(dateStr);
      // 增加一天
      startDate.setDate(startDate.getDate() + 1);
  }

  return dateArray;
}