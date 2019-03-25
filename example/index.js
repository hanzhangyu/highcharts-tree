import Highcharts from "highcharts";
import HighchartsExport from "highcharts/modules/exporting.js";
import HighchartsTree from "../lib/index";
import treeData from "./data";

HighchartsExport(Highcharts);
HighchartsTree(Highcharts);

const treeChartData = {
  legends: [
    { text: "Legend 1", type: "money" },
    { text: "Legend 2" },
    { text: "Legend 3", type: "percentage" }
  ],
  tree: treeData
};

const chartConfig = {
  chart: {
    type: "tree",
    config: {
      node: {
        width: 200,
        height: 0, // null || 0 = auto-calculated
        marginX: 20,
        marginY: 20,
        backgroundColor: "#f2f2f2",
        backgroundColorToggle: "#cccccc",
        title: {
          marginY: 4
        },
        content: {
          align: "left"
        },
        dataFormatter(data, index) {
          return data + index;
        }
      },
      row: {
        height: 20,
        line: 2
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0,0,0,0.6)",
        borderRadius: 3,
        textColor: "#fff",
        tooltipFormatter(item) {
          return `<h3>${item.content.title}</h3>${item.content.data.join("<br>")}`;
        }
      },
      connector: {
        color: "#bcbcbc",
        width: 4
      },
      legend: {
        enabled: true,
        nodeWidth: 20,
        marginX: 10,
        marginY: 25
      },
      textColor: "#454d59",
    },
    width: 0, // set 0 to auto size
    height: 0 // set 0 to auto size
  },
  series: [{ data: treeChartData }],
  title: { text: "Title", margin: 10 },
  // title: false,
  credits: { enabled: true },
  exporting: { enabled: true },
  // colors: ["#74D0C5", "#F2AC54", "#ECD868"]
};
document.addEventListener("DOMContentLoaded", () => {
  window.chart = Highcharts.chart("tree", chartConfig);

  document.querySelector("#btnRefresh").addEventListener("click", () => {
    // treeChartData.tree.forEach(function (item) {
    //     item.content.data[0] = new Date();
    // });
    // chartConfig.series[0].data[0] = treeChartData;
    window.chart = Highcharts.chart("tree", chartConfig);
  });
});
