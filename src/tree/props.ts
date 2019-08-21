import { HighchartsTreeConfig, TreeNodeData } from "../../types";
import TreeNode from "../core/TreeNode";
import Tree from "../core/Tree";
import { Chart, SVGElement, each } from "Highcharts";

// /// <reference path="highcharts/highcharts.d.ts" />
// namespace Highcharts {
//     export interface ElementObject {
//         added: boolean;
//     }
//     export interface ChartObject {
//         add(parent?: ElementObject): ElementObject;
//     }
// }

const SHAPE_OFFSET = 3;
const NODE_WIDTH_OFFSET = SHAPE_OFFSET * 2;

export function getStaticProps(
  config: HighchartsTreeConfig,
  styledMode: boolean
) {
  return styledMode
    ? {
        titleCss: {},
        textCss: {},
        tooltipStr: {
          style: "",
          class: `class="highcharts-tree-node-tooltip-inner"`
        },
        tooltipAttr: {
          class: "highcharts-tree-node-tooltip"
        },
        boxAttr: { zIndex: 0 },
        connectorAttr: {
          class: "highcharts-tree-connector"
        }
      }
    : {
        titleCss: {
          pointerEvents: "none",
          fontSize: "14px",
          color: config.node.textColor,
          fontWeight: "bold",
          textAlign: "center"
        },
        textCss: {
          fontSize: "13px",
          color: config.node.textColor,
          textOverflow: "ellipsis",
          pointerEvents: "none"
        },
        tooltipStr: {
          style: `border-radius: ${config.tooltip.borderRadius};
background-color: ${config.tooltip.backgroundColor};
color: ${config.tooltip.textColor};
font-size: 12px;
white-space: initial;
word-break: break-word;`,
          class: ""
        },
        tooltipAttr: {
          opacity: 0
        },
        boxAttr: {
          zIndex: 0,
          stroke: config.node.border.color, // basic
          "stroke-width": config.node.border.width // hyphenated
        },
        connectorAttr: {
          "stroke-width": config.connector.width,
          stroke: config.connector.color
        }
      };
}

export const DEFAULT_CONFIG: HighchartsTreeConfig = Object.freeze({
  node: {
    width: 200,
    height: 0, // null || 0 = auto-calculated
    marginX: 20,
    marginY: 20,
    textColor: "#454d59",
    backgroundColor: "#f2f2f2",
    backgroundColorToggle: "#cccccc",
    title: {
      marginTop: 4,
      marginDown: 4
    },
    padding: {
      x: 1.5,
      y: 1.5
    },
    content: {
      align: "left"
    },
    hover: {
      backgroundColor: "#d6d6d6",
      backgroundColorToggle: "#cccccc"
    },
    border: {
      width: 3,
      color: "#919191"
    },
    dataFormatter(data: string | number) {
      return data.toLocaleString();
    }
  },
  row: {
    height: 20,
    line: 2
  },
  tooltip: {
    enabled: false,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: "3px",
    textColor: "#fff",
    width: 0, // set 0 to use node width
    tooltipFormatter(item: TreeNodeData) {
      return (
        `${item.content.title}` +
        (item.content.data ? `<br>${item.content.data.join("<br>")}` : "")
      );
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
  }
});

interface TreeSeriesType<T extends TreeNodeData> {
  _tree: Tree<T>;
  _titleOffsetY: number;
  _config: HighchartsTreeConfig;
  _elements: SVGElement[];
  maxX: number;
  maxY: number;
  translate: () => void;
  chart: Chart;
}

export function drawNode<T extends TreeNodeData>(
  this: TreeSeriesType<T>,
  node: TreeNode<TreeNodeData>,
  staticProps: ReturnType<typeof getStaticProps>,
  highchartMajorVersion: number
) {
  const elements: SVGElement[] = this._elements;
  const config = this._config;
  const ren = this.chart.renderer;
  const colors = this.chart.options.colors;
  const styledMode = this.chart.styledMode;
  const box = {
    x:
      node.x * (config.node.width + config.node.marginX) +
      config.node.border.width / 2,
    y: node.y * (config.node.height + config.node.marginY) + this._titleOffsetY,
    w: config.node.width,
    h: config.node.height
  };

  // title, needs to be added to getBBox()

  const titleElement = ren
    .label(
      node.item.content.title + "",
      box.x + config.node.padding.x,
      box.y + config.node.padding.y + config.node.title.marginTop,
      "rect",
      undefined,
      undefined,
      undefined,
      undefined,
      "tree-node-title"
    )
    .attr({ zIndex: 1 })
    .add();

  /**
   * in this line, highcharts will get the computed style
   * so add it to RenderObject first
   * @link
   * https://github.com/highcharts/highcharts/blob/master/ts/parts/SvgRenderer.ts#L3716
   */
  const titleElementBBox = titleElement.getBBox();
  titleElement.css({
    ...staticProps.titleCss,
    width: box.w - NODE_WIDTH_OFFSET - config.node.padding.x * 2,
    textOverflow: "ellipsis"
  });
  // - center it
  titleElement.attr({ x: box.x + box.w / 2 - titleElementBBox.width / 2 });
  elements.push(titleElement);

  // rows
  const offsetTextByLegend = config.legend.enabled
    ? config.legend.nodeWidth
    : 0;
  const rowsY =
    titleElementBBox.height +
    config.node.title.marginTop +
    config.node.title.marginDown;
  if (node.item.content.data) {
    for (let i = 0; i < node.item.content.data.length; i++) {
      if (config.legend.enabled) {
        // legend box
        elements.push(
          ren
            .rect(
              box.x + config.node.padding.x,
              box.y + rowsY + config.row.height * i,
              config.legend.nodeWidth,
              config.row.height,
              0
            )
            .css({ pointerEvents: "none" })
            .attr(
              styledMode
                ? { class: `highcharts-tree-legend-${i}`, zIndex: 1 }
                : { fill: colors[i], zIndex: 1 }
            )
        );
      }

      const text = config.node.dataFormatter(node.item.content.data[i], i);
      const textAlign = config.node.content.align;
      const textElementWidth =
        box.w -
        offsetTextByLegend -
        NODE_WIDTH_OFFSET -
        config.node.padding.x * 2;
      const computedWidth =
        textAlign === "center" ? undefined : textElementWidth;
      const textElement = ren
        .label(
          text,
          box.x + offsetTextByLegend + config.node.padding.x,
          box.y + rowsY + config.row.height * i,
          "rect",
          undefined,
          undefined,
          undefined,
          undefined,
          "tree-node-data"
        )
        .attr({
          zIndex: 1,
          width: computedWidth
        })
        .add();
      textElement.css({
        ...staticProps.textCss,
        width: computedWidth
      });

      // - allign right
      // textElement.attr({x: box.x + box.w - textElement.width - config.row.marginX});
      if (textAlign === "center") {
        const textElementBBox = textElement.getBBox();
        textElement.attr({
          x: box.x + box.w / 2 - textElementBBox.width / 2
        });
      }
      elements.push(textElement);
    }
  }

  // calculate node height(if not set) based on rendered content
  if (
    typeof config.node.height === "undefined" ||
    config.node.height === null ||
    config.node.height < 1
  ) {
    config.node.height = box.h =
      rowsY + config.row.line * config.row.height + config.node.padding.y;
  }
  if (node === this._tree.root) {
    // region resize
    const { width, height } = this.chart.userOptions.chart;
    if (!width || !height) {
      let changed = false;
      const curWidth =
        this._tree.root.width * (config.node.width + config.node.marginX) +
        config.node.width +
        config.node.border.width;
      const curHeight =
        this._tree.root.height * (config.node.height + config.node.marginY) +
        config.node.height +
        config.legend.marginY +
        config.row.height +
        this._titleOffsetY;
      if (!width && curWidth !== this.chart.chartWidth) {
        changed = true;
        this.chart.container.parentElement.style.width = `${curWidth}px`;
      }
      if (!height && curHeight !== this.chart.chartHeight) {
        changed = true;
        this.chart.container.parentElement.style.height = `${curHeight}px`;
      }
      if (changed) {
        this._elements = elements;
        this.chart.setSize(curWidth, curHeight, false);
        return false;
      }
    }
    // endregion
  }

  // main box
  // console.log(box.x);
  let tooltipElement: SVGElement = null;
  if (config.tooltip.enabled) {
    let tooltipX = box.x + box.w;
    const tooltipW = config.tooltip.width || box.w;
    if (tooltipX + tooltipW > this.chart.chartWidth) {
      tooltipX = box.x - tooltipW;
    }
    const styleStr = `
min-height: ${box.h}px;
margin-left: -${SHAPE_OFFSET}px;
margin-top: -${SHAPE_OFFSET}px;
width: ${tooltipW}px;${staticProps.tooltipStr.style}`;

    tooltipElement = ren
      .label(
        `<div
${staticProps.tooltipStr.class}
style="${styleStr}">${config.tooltip.tooltipFormatter(node.item)}</div>`,
        tooltipX,
        box.y,
        "rect",
        undefined,
        undefined,
        true
      )
      .css({
        pointerEvents: "none"
      })
      .attr({
        ...staticProps.tooltipAttr,
        zIndex: 5
      })
      .add();
    elements.push(tooltipElement);
  }

  const boxElement = ren
    .rect(box.x, box.y, box.w, box.h, 3)
    .css({
      cursor: node.children.length < 1 ? "default" : "pointer"
    })
    .attr({
      ...staticProps.boxAttr,
      id: node.item.id,
      ...(styledMode
        ? {
            class: `highcharts-tree-box${node.toggle ? "" : " fold"}`
          }
        : {
            fill: node.toggle
              ? config.node.backgroundColor
              : config.node.backgroundColorToggle
          })
    })
    .on("mouseover", () => {
      if (styledMode) {
        if (tooltipElement) {
          tooltipElement.attr({
            class: "highcharts-tree-node-tooltip hover"
          });
        }
        return;
      }
      if (highchartMajorVersion > 5) {
        boxElement.animate(
          {
            fill: node.toggle
              ? config.node.hover.backgroundColor
              : config.node.hover.backgroundColorToggle
          },
          { duration: 300 }
        );
      } else {
        boxElement.attr({
          fill: node.toggle
            ? config.node.hover.backgroundColor
            : config.node.hover.backgroundColorToggle
        });
      }
      if (tooltipElement) {
        tooltipElement.animate({ opacity: 1 }, { duration: 300 });
      }
    })
    .on("mouseout", () => {
      if (styledMode) {
        if (tooltipElement) {
          tooltipElement.attr({
            class: "highcharts-tree-node-tooltip"
          });
        }
        return;
      }
      if (highchartMajorVersion > 5) {
        boxElement.animate(
          {
            fill: node.toggle
              ? config.node.backgroundColor
              : config.node.backgroundColorToggle
          },
          { duration: 300 }
        );
      } else {
        boxElement.attr({
          fill: node.toggle
            ? config.node.backgroundColor
            : config.node.backgroundColorToggle
        });
      }
      if (tooltipElement) {
        tooltipElement.animate({ opacity: 0 }, { duration: 300 });
      }
    });
  elements.push(boxElement);
  if (node.children.length > 0) {
    boxElement.on("click", () => {
      node.toggle = !node.toggle;
      this._tree.build();
      this.translate();
    });
  }

  // draw line to parent
  if (node.parent != null) {
    elements.push(
      ren
        .path([
          "M",
          box.x + box.w / 2,
          box.y,
          "L",
          box.x + box.w / 2,
          box.y - config.node.marginY / 2 - config.connector.width / 2
        ])
        .attr(staticProps.connectorAttr)
    );
  }

  if (node.toggle) {
    // draw line to children
    if (node.children.length > 0) {
      const nodeBottomMiddle = {
        x: box.x + box.w / 2,
        y: box.y + box.h
      };
      elements.push(
        ren
          .path([
            "M",
            nodeBottomMiddle.x,
            nodeBottomMiddle.y,
            "L",
            nodeBottomMiddle.x,
            nodeBottomMiddle.y + config.node.marginY / 2
          ])
          .attr(staticProps.connectorAttr)
      );

      // draw line over children
      if (node.children.length > 1) {
        const offsetX = config.node.width + config.node.marginX;
        const linePositionY = nodeBottomMiddle.y + config.node.marginY / 2;
        elements.push(
          ren
            .path([
              "M",
              node.getRightMostChild().x * offsetX +
                config.node.width / 2 -
                config.connector.width / 2 +
                config.node.border.width / 2,
              linePositionY,
              "L",
              node.getLeftMostChild().x * offsetX +
                config.node.width / 2 +
                config.connector.width / 2 +
                config.node.border.width / 2,
              linePositionY
            ])
            .attr(staticProps.connectorAttr)
        );
      }
    }

    each(node.children, drawNode); // FIXME remove each
  }

  this.maxX = Math.max(this.maxX, box.x + box.w);
  this.maxY = Math.max(this.maxY, box.y + box.h);

  return true;
}
