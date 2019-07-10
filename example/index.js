import treeData from "./data";
import "highcharts/css/highcharts.css";

async function foo() {
  const {Highcharts} = await import("./highcharts");
  console.log(Highcharts);
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
      styledMode: true,
      type: "tree",
      config: {
        node: {
          textColor: "#454d59", // ignored by stylemode
          width: 200,
          height: 0, // null || 0 = auto-calculated
          marginX: 20,
          marginY: 20,
          backgroundColor: "#f2f2f2", // ignored by stylemode
          backgroundColorToggle: "#cccccc", // ignored by stylemode
          title: {
            marginTop: 4
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
          backgroundColor: "rgba(0,0,0,0.6)", // ignored by stylemode
          borderRadius: "3px", // ignored by stylemode
          textColor: "#fff", // ignored by stylemode
          tooltipFormatter(item) {
            return `<h3>${item.content.title}</h3>${item.content.data && item.content.data.join("<br>")}`;
          }
        },
        connector: {
          color: "#bcbcbc", // ignored by stylemode
          width: 4
        },
        legend: {
          enabled: true,
          nodeWidth: 20,
          marginX: 10,
          marginY: 25
        },
      },
      width: 0, // set 0 to auto size
      height: 0 // set 0 to auto size
    },
    series: [{ data: treeChartData }],
    title: { text: "Title", margin: 10 },
    // title: false,
    credits: { enabled: true },
    exporting: { enabled: true },
  };
  window.chart = Highcharts.chart("tree", chartConfig);

  document.querySelector("#btnRefresh").addEventListener("click", () => {
    chartConfig.chart.config.node.width = 300;
    window.chart.redraw();
  });
}
document.addEventListener("DOMContentLoaded", foo);
