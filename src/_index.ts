import { DEFAULT_CONFIG } from "./tree/props";
import Tree from "./core/Tree";

function HighchartsTree(Highcharts: any): void {
  const highchartMajorVersion: number = parseInt(
    Highcharts.version.split(".")[0],
    10
  );

  Highcharts.seriesType(
    "tree",
    "pie",
    {
      config: DEFAULT_CONFIG
    },
    {
      init() {
        Highcharts.addEvent(Highcharts.Chart, "redraw", (e: Event) => {
          const chart = e.target;
          if (chart !== this.chart) return;
          this._tree.build();
          this.translate();
        });
        Highcharts.addEvent(Highcharts.Chart, "destroy", (e: Event) => {
          const chart = e.target;
          if (chart !== this.chart) return;
          Highcharts.removeEvent(chart, "redraw");
          Highcharts.removeEvent(chart, "destroy");
        });
        Highcharts.seriesTypes.pie.prototype.init.apply(this, arguments);
        const { data } = this.options;
        if (
          data === null ||
          typeof data === "undefined" ||
          typeof data.tree === "undefined" ||
          data.tree === null
        ) {
          return;
        }
        this._tree = Tree.getTree(this._tree, this.options.data.tree);
      }
    }
  );
}

export default HighchartsTree;
