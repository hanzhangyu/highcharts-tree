import { TreeNodeData, HighchartsTreeConfig } from "../types";
import TreeNode from "./TreeNode";
import Tree from "./Tree";

interface ElementObjectExtended extends Highcharts.ElementObject {
  added: boolean;
}

const SHAPE_OFFSET = 3;
const NODE_WIDTH_OFFSET = SHAPE_OFFSET * 2;

// @types/highcharts not support some method
export default (Highcharts: any) => {
  const highchartMajorVersion = Highcharts.version.split(".")[0];
  const defaultConfig: HighchartsTreeConfig = {
    horizontal: true,
    disableToggle: false,
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
  };

  const { seriesType, seriesTypes, each, merge } = Highcharts;

  seriesType(
    "tree",
    "pie",
    {
      config: defaultConfig
    },
    {
      init() {
        Highcharts.addEvent(Highcharts.Chart, "redraw", (e: Event) => {
          const chart = e.target;
          if (chart !== this.chart) return;
          // ignore setSize
          if (this._skipTranslate) {
            this._skipTranslate = false;
            return;
          }
          this._tree.build();
          this.translate();
        });
        Highcharts.addEvent(Highcharts.Chart, "destroy", (e: Event) => {
          const chart = e.target;
          if (chart !== this.chart) return;
          Highcharts.removeEvent(chart, "redraw");
          Highcharts.removeEvent(chart, "destroy");
        });
        seriesTypes.pie.prototype.init.apply(this, arguments);
        const { data } = this.options;
        if (
          data === null ||
          typeof data === "undefined" ||
          typeof data.tree === "undefined" ||
          data.tree === null
        ) {
          return;
        }
        this._config = merge(
          {},
          this.options.config,
          this.chart.userOptions.chart.config
        );
        this._tree = Tree.getTree({
          tree: this._tree,
          data: this.options.data.tree,
          horizontal: this._config.horizontal
        });
      },
      translate() {
        const data = this.options.data;
        const ren = this.chart.renderer;
        const config: HighchartsTreeConfig = this._config;
        // 0 is false, and _treeComputedNodeHeight is undefined initial
        config.node.height = config.node.height || this._treeComputedNodeHeight || 0;
        const colors = this.chart.options.colors;
        let maxX = 0;
        let maxY = 0;
        let elements: ElementObjectExtended[] = this._elements;

        const staticProps = ren.styledMode
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

        if (!elements) this._elements = elements = [];
        const drawNode = (node: TreeNode<TreeNodeData>) => {
          const box = {
            x:
              node.x * (config.node.width + config.node.marginX) +
              config.node.border.width / 2,
            y:
              node.y * (config.node.height + config.node.marginY) +
              this._titleOffsetY,
            w: config.node.width,
            h: config.node.height
          };

          // title, needs to be added to getBBox()

          const titleElement = ren
            .label(
              node.item.content.title,
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
          titleElement.css({
            ...staticProps.titleCss,
            width: box.w - NODE_WIDTH_OFFSET - config.node.padding.x * 2,
            textOverflow: "ellipsis"
          });
          // - center it
          titleElement.attr({ x: box.x + box.w / 2 - titleElement.width / 2 });
          elements.push(titleElement);

          // rows
          const offsetTextByLegend = config.legend.enabled
            ? config.legend.nodeWidth
            : 0;
          const rowsY =
            titleElement.height +
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
                      config.row.height
                    )
                    .css({ pointerEvents: "none" })
                    .attr(
                      ren.styledMode
                        ? { class: `highcharts-tree-legend-${i}`, zIndex: 1 }
                        : { fill: colors[i], zIndex: 1 }
                    )
                );
              }

              const text = config.node.dataFormatter(
                node.item.content.data[i],
                i
              );
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
                textElement.attr({
                  x: box.x + box.w / 2 - textElement.width / 2
                });
              }
              elements.push(textElement);
            }
          }

          // calculate node height(if not set) based on rendered content
          let needRedraw = false;
          if (
            typeof config.node.height === "undefined" ||
            config.node.height === null ||
            config.node.height < 1
          ) {
            config.node.height = box.h =
              rowsY +
              config.row.line * config.row.height +
              config.node.padding.y;
            this._treeComputedNodeHeight = config.node.height;
            needRedraw = true;
          }
          if (node === this._tree.root) {
            // region resize
            const { width, height } = this.chart.userOptions.chart;
            if (!width || !height) {
              let changed = false;
              const curWidth =
                this._tree.root.width *
                  (config.node.width + config.node.marginX) +
                config.node.width +
                config.node.border.width;
              const curHeight =
                this._tree.root.height *
                  (config.node.height + config.node.marginY) +
                config.node.height +
                config.legend.marginY +
                config.row.height +
                this._titleOffsetY;
              if (!width && curWidth !== this.chart.chartWidth) {
                changed = true;
                this.chart.renderTo.style.width = `${curWidth}px`;
              }
              if (!height && curHeight !== this.chart.chartHeight) {
                changed = true;
                this.chart.renderTo.style.height = `${curHeight}px`;
              }
              if (changed) {
                needRedraw = false;
                this._elements = elements;
                this._skipTranslate = true; // setSize will trigger redraw event
                this.chart.setSize(curWidth, curHeight, false);
                return false;
              }
            }
            // endregion
          }
          if (needRedraw) {
            this.translate();
            return false;
          }

          // main box
          // console.log(box.x);
          let tooltipElement: ElementObjectExtended = null;
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
              ...(ren.styledMode
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
              if (ren.styledMode) {
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
              if (ren.styledMode) {
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
          if (node.children.length > 0 && !config.disableToggle) {
            boxElement.on("click", () => {
              node.toggle = !node.toggle;
              this._tree.build();
              this.translate();
            });
          }

          // region draw connector line
          // draw line to parent
          if (node.parent != null) {
            if (config.horizontal) {
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
            } else {
              elements.push(
                ren
                  .path([
                    "M",
                    box.x,
                    box.y + box.h / 2,
                    "L",
                    box.x -
                      config.node.marginX / 2 -
                      config.connector.width / 2,
                    box.y + box.h / 2
                  ])
                  .attr(staticProps.connectorAttr)
              );
            }
          }

          if (node.toggle) {
            // draw line to children
            if (node.children.length > 0) {
              if (config.horizontal) {
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
                  const linePositionY =
                    nodeBottomMiddle.y + config.node.marginY / 2;
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
              } else {
                const nodeRightMiddle = {
                  x: box.x + box.w,
                  y: box.y + box.h / 2
                };
                elements.push(
                  ren
                    .path([
                      "M",
                      nodeRightMiddle.x,
                      nodeRightMiddle.y,
                      "L",
                      nodeRightMiddle.x + config.node.marginX / 2,
                      nodeRightMiddle.y
                    ])
                    .attr(staticProps.connectorAttr)
                );

                // draw line over children
                if (node.children.length > 1) {
                  const offsetY = config.node.height + config.node.marginY;
                  const linePositionX =
                    nodeRightMiddle.x + config.node.marginX / 2;
                  // bottom to top
                  elements.push(
                    ren
                      .path([
                        "M",
                        linePositionX,
                        node.getRightMostChild().y * offsetY +
                          config.node.height / 2 -
                          config.connector.width / 2 +
                          config.node.border.width / 2 +
                          this._titleOffsetY,
                        "L",
                        linePositionX,
                        node.getLeftMostChild().y * offsetY +
                          config.node.height / 2 -
                          config.connector.width / 2 +
                          config.node.border.width / 2 +
                          this._titleOffsetY
                      ])
                      .attr(staticProps.connectorAttr)
                  );
                }
              }
            }

            each(node.children, drawNode);
          }
          // endregion

          maxX = Math.max(maxX, box.x + box.w);
          maxY = Math.max(maxY, box.y + box.h);

          return true;
        };

        // clear the previous
        each(elements, (element: ElementObjectExtended) => {
          element.destroy();
        });
        this._elements = elements = [];

        if (
          data === null ||
          typeof data === "undefined" ||
          typeof data.tree === "undefined" ||
          data.tree === null
        ) {
          // error
          elements.push(
            ren.label("Invalid data.", 0, 0).css({
              fontSize: "14px",
              color: "#EE0000",
              fontWeight: "bold"
            })
          );
        } else {
          this._titleOffsetY = 0;
          if (this.chart.title) {
            const titleBox = this.chart.title.getBBox();
            this._titleOffsetY =
              titleBox.y + titleBox.height + this.chart.options.title.margin;
          }
          // draw tree
          if (!drawNode(this._tree.root)) {
            return;
          }

          // draw legend
          if (config.legend.enabled) {
            const legends = data.legends || [];
            let offsetX = 0;
            for (
              let i = 0;
              i < Math.min(legends.length, config.row.line);
              i++
            ) {
              elements.push(
                ren
                  .rect(
                    offsetX + config.legend.marginX,
                    maxY + config.legend.marginY,
                    config.legend.nodeWidth,
                    config.row.height
                  )
                  .attr(
                    ren.styledMode
                      ? { class: `highcharts-tree-legend-${i}` }
                      : { fill: colors[i] }
                  )
              );

              /*spacing between legend box and legend text*/
              offsetX += config.legend.nodeWidth + 5;

              const legendTextElement = ren
                .label(
                  legends[i].text,
                  offsetX + config.legend.marginX,
                  maxY + config.legend.marginY
                )
                .css(
                  ren.styledMode
                    ? {}
                    : {
                        fontSize: "14px",
                        color: config.node.textColor,
                        fontWeight: "bold"
                      }
                )
                .attr(
                  ren.styledMode
                    ? {
                        class: "highcharts-tree-legend-text",
                        zIndex: 1
                      }
                    : { zIndex: 1 }
                )
                .add();
              elements.push(legendTextElement);

              /*spacing between legends */
              offsetX += legendTextElement.width + 30;
            }
          }
        }

        each(elements, (element: ElementObjectExtended) => {
          if (element.added) return;
          element.add();
        });

        this._elements = elements;
      },

      animate() {
        return;
      },

      drawPoints() {
        return;
      },

      drawDataLabels() {
        return;
      }
    }
  );
};
