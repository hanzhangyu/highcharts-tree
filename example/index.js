import Highcharts from "highcharts";
import HighchartsTree from "../lib/index";

HighchartsTree(Highcharts);

const treeChartData = {
  legends: [
    { text: "Legend 1", type: "money" },
    { text: "Legend 2" },
    { text: "Legend 3", type: "percentage" }
  ],
  tree: {
    id: 1,
    content: { title: "as222dfdsfddddddddddd22d1", data: ["date", "text"] },
    children: [
      {
        id: 2,
        content: { title: "123", data: ["date"] }
      },
      {
        id: 3,
        content: {
          title: "as222dfdsfddddddddddd22d1as222dfdsfddddddddddd22d1",
          data: ["date"]
        },
        children: [
          {
            id: 5,
            content: { title: "123", data: ["date"] }
          },
          {
            id: 6,
            content: {
              title: "as222dfdsfddddddddddd22d1as222dfdsfddddddddddd22d1",
              data: ["date"]
            }
          },
          {
            id: 7,
            content: {
              title: "as222dfdsfddddddddddd22d1as222dfdsfddddddddddd22d1",
              data: ["date"]
            }
          }
        ]
      },
      {
        id: 4,
        content: {
          title: "as222dfdsfddddddddddd22d1as222dfdsfddddddddddd22d1",
          data: ["date"]
        }
      }
    ]
  }
};

const chartConfig = {
  chart: {
    type: "tree",
    config: {
      node: {
        padding: {
          x: 10,
          y: 10
        },
        content: {
          align: "center"
        }
      },
      row: {
        line: 1
      },
      legend: {
        enabled: false
      }
    },
    width: 0,
    height: 0
  },
  series: [{ data: [treeChartData] }],
  title: { text: "" },
  credits: { enabled: false },
  exporting: { enabled: true },
  colors: ["#74D0C5", "#F2AC54", "#ECD868"]
};
window.Highcharts = Highcharts;
console.log(Highcharts);
document.addEventListener("DOMContentLoaded", () => {
  let chart = Highcharts.chart("tree", chartConfig);

  document.querySelector("#btnRefresh").addEventListener("click", () => {
    // treeChartData.tree.forEach(function (item) {
    //     item.content.data[0] = new Date();
    // });
    // chartConfig.series[0].data[0] = treeChartData;
    chart = Highcharts.chart("tree", chartConfig);
  });
});
