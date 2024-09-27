<script setup>
import { ref } from "vue";
import axios from "axios";
import chartFormat from "../../chartFormat.json";
import populationData from "../../population.json";
import wagesData from "../../wages.json";

const weatherOptions = ref({
  chart: {
    type: "line",
  },
  title: {
    text: "This Week Temperature ",
  },
  xAxis: {
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
  },
  yAxis: {
    title: {
      text: "Temperature (°C)",
    },
  },

  series: [
    {
      name: "Reggane",
      data: [
        16.0, 18.2, 23.1, 27.9, 32.2, 36.4, 39.8, 38.4, 35.5, 29.2, 22.0, 17.8,
      ],
    },
    {
      name: "Tallinn",
      data: [
        -2.9, -3.6, -0.6, 4.8, 10.2, 14.5, 17.6, 16.5, 12.0, 6.5, 2.0, -0.9,
      ],
    },
  ],
  tooltip: {
    // borderColor: null
    borderWidth: 2,
    formatter: function () {
      const tempDifference =
        weatherOptions.value.series[2].data[this.point.index];
      return `<b>${this.x}</b><br>${this.series.name}: ${this.y}<br>Temperature Difference: ${tempDifference}°C`;
    },
  },
});

const population = populationData
const wages = wagesData
const populationChart = structuredClone(chartFormat)
const wagesChart = structuredClone(chartFormat)

// // 查看两个表格信息以及原始信息是否正确
// console.log("population",population)
// console.log("wages",wages)
// console.log("populationChart",populationChart)
// console.log('wagesChart',wagesChart)


const checkInit = (chartData,id) => {
  if(chartData.init == 0 ){
    // 未初始化
    return 1
  }
  else{
    return 0
  }
};
const weather = ref({
  success: true,
  city: "南昌市",
  data: [
    {
      date: "2024-04-22",
      week: "星期一",
      type: "多云",
      low: "18°C",
      high: "25°C",
      fengxiang: "东北风",
      fengli: "1-3级",
      night: {
        type: "小雨",
        fengxiang: "西北风",
        fengli: "1-3级",
      },
    },
    {
      date: "2024-04-23",
      week: "星期二",
      type: "多云",
      low: "19°C",
      high: "26°C",
      fengxiang: "北风",
      fengli: "1-3级",
      night: {
        type: "晴",
        fengxiang: "东北风",
        fengli: "1-3级",
      },
    },
    {
      date: "2024-04-24",
      week: "星期三",
      type: "多云",
      low: "19°C",
      high: "26°C",
      fengxiang: "东北风",
      fengli: "1-3级",
      night: {
        type: "阴",
        fengxiang: "东北风",
        fengli: "1-3级",
      },
    },
    {
      date: "2024-04-25",
      week: "星期四",
      type: "中雨",
      low: "19°C",
      high: "22°C",
      fengxiang: "西北风",
      fengli: "1-3级",
      night: {
        type: "小雨",
        fengxiang: "西南风",
        fengli: "1-3级",
      },
    },
    {
      date: "2024-04-26",
      week: "星期五",
      type: "小雨",
      low: "20°C",
      high: "26°C",
      fengxiang: "西南风",
      fengli: "1-3级",
      night: {
        type: "阴",
        fengxiang: "西风",
        fengli: "1-3级",
      },
    },
    {
      date: "2024-04-27",
      week: "星期六",
      type: "小雨",
      low: "21°C",
      high: "28°C",
      fengxiang: "西北风",
      fengli: "1-3级",
      night: {
        type: "小雨",
        fengxiang: "西风",
        fengli: "3-4级",
      },
    },
    {
      date: "2024-04-28",
      week: "星期日",
      type: "小雨",
      low: "22°C",
      high: "28°C",
      fengxiang: "微风",
      fengli: "1-3级",
      night: {
        type: "小雨",
        fengxiang: "微风",
        fengli: "1-3级",
      },
    },
  ],
  air: {
    aqi: 43,
    aqi_level: 1,
    aqi_name: "优",
    co: "0",
    no2: "8",
    o3: "136",
    pm10: "32",
    "pm2.5": "17",
    so2: "6",
  },
  tip: "现在的温度比较舒适~",
});
const getWeather = () => {
  axios
    .get("https://api.vvhan.com/api/weather?city=南昌&type=week")
    .then((response) => {
      const weather = response.data;
      console.log('---',weather);
      TransData2Chart(weather, chartOptions);
    })
    .catch((error) => {
      console.log(error);
    });
};
// getWeather()
const TransPopulationData = (population, populationChart) => {
  const data = population;
  const initState = checkInit(populationChart,'population')
  if (initState) {
    populationChart.chart.type = "column";
    populationChart.xAxis.categories = Object.getOwnPropertyNames(data);
    const arr = Object.getOwnPropertyNames(
      data[populationChart.xAxis.categories[0]]
    );
    arr.forEach((item, index) => {
      populationChart.series.push({
        name: "",
        data: [],
      });
      populationChart.series[index].name = item;
      populationChart.series[index].data = Object.values(data).map(
        (data) => data[item]
      );
    });
    populationChart.init = 1;
  }
};
const TransData2Chart = (weather) => {
  // request version
  // const data = weather.data;
  // dead version
  const data = weather.value.data;
  weatherOptions.value.xAxis.categories = data.map((item) => item.date);
  weatherOptions.value.series[0].name = "lowTemp";
  weatherOptions.value.series[0].data = data.map((item) => {
    const matched = item.low.match(/^(\d+)/);
    return matched ? parseInt(matched[1], 10) : null;
  });
  weatherOptions.value.series[1].name = "highTemp";
  weatherOptions.value.series[1].data = data.map((item) => {
    const matched = item.high.match(/^(\d+)/);
    return matched ? parseInt(matched[1], 10) : null;
  });
  weatherOptions.value.series.push({
    name: "tempDifference",
    visible: false,
  });
  weatherOptions.value.series[2].data = weatherOptions.value.series[1].data.map(
    (high, index) => high - weatherOptions.value.series[0].data[index]
  );
};

const TransWagesData = (wages, wagesChart) => {
  const data = wages;
  const initState = checkInit(wagesChart,'wages')
  if (initState) {
    wagesChart.chart.type = "line";
    wagesChart.xAxis.categories = Object.getOwnPropertyNames(data);
    const arr = Object.getOwnPropertyNames(
      data[wagesChart.xAxis.categories[0]]
    );
    arr.forEach((item, index) => {
      wagesChart.series.push({
        name: "",
        data: [],
      });
      wagesChart.series[index].name = item;
      wagesChart.series[index].data = Object.values(data).map(
        (data) => data[item]
      );
    });
    wagesChart.init = 1;
  } else {
  }
};

TransData2Chart(weather, weatherOptions);
TransPopulationData(population, populationChart);
TransWagesData(wages,wagesChart)
// console.log(weather)
getWeather()
</script>


<template>
  <div class="about">
    <!-- <h1></h1> -->
    <highcharts :options="weatherOptions"></highcharts>
  </div>
  <div class="about">
    <highcharts :options="populationChart"></highcharts>
  </div>
  <div class="about">
    <highcharts :options="wagesChart"></highcharts>
  </div>
</template>




<style>
@media (min-width: 1024px) {
  .about {
    min-height: 50vh !important;
    display: flex;
    align-items: center;
  }
}
</style>



