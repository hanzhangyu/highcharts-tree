import Highcharts from "highcharts";
import HighchartsExport from "highcharts/modules/exporting.js";
import HighchartsTree from "../lib/index";
import "../css/highcharts-tree.scss";

HighchartsExport(Highcharts);
HighchartsTree(Highcharts);

export {Highcharts};
