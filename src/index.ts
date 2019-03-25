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
  const defaultConfig = {
    autoSize: {
      x: true,
      y: false,
    },
    node: {
      width: 200,
      height: 0, // null || 0 = auto-calculated
      marginX: 20,
      marginY: 20,
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
      }
    },
    row: {
      height: 20,
      line: 2
    },
    tooltip: {
      enabled: false,
      backgroundColor: "rgba(0,0,0,0.6)",
      borderRadius: 3,
      textColor: "#fff",
      width: 0, // set 0 to use node width
      tooltipFormatter(item: TreeDataNode) {
        return `${item.content.title}<br>${item.content.data.join("<br>")}`;
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
    currencySymbol: "$",
    currencySymbolOnLeft: true
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
        seriesTypes.pie.prototype.init.apply(this, arguments);
        this._tree = Tree.getTree(this._tree, this.options.data[0].tree);
      },
      translate() {
        this._config = merge(
          {},
          this.options.config,
          this.chart.userOptions.chart.config
        );
        const data = this.options.data[0];
        const ren = this.chart.renderer;
        const config = this._config;
        const colors = this.chart.options.colors;
        let maxX = 0;
        let maxY = 0;
        let elements: ElementObjectExtended[] = this._elements;

        if (!elements) this._elements = elements = [];
        const drawNode = (node: TreeNode<TreeDataNode>) => {
          const formatRowValue = (value: string | number) => {
            return value.toLocaleString();
          };

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
              "rect"
            )
            .css({
              pointerEvents: "none",
              fontSize: "14px",
              color: config.textColor,
              fontWeight: "bold",
              width: box.w - NODE_WIDTH_OFFSET - config.node.padding.x * 2,
              textOverflow: "ellipsis",
              textAlign: "center"
            })
            .attr({ zIndex: 1 })
            .add();
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
                  .attr({ fill: colors[i], zIndex: 1 })
              );
            }

            const text = formatRowValue(node.item.content.data[i]);
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
                "rect"
              )
              .css({
                fontSize: "13px",
                color: config.textColor,
                width: computedWidth,
                textOverflow: "ellipsis",
                pointerEvents: "none"
              })
              .attr({
                zIndex: 1,
                width: computedWidth
              })
              .add();

            // - allign right
            // textElement.attr({x: box.x + box.w - textElement.width - config.row.marginX});
            if (textAlign === "center") {
              textElement.attr({
                x: box.x + box.w / 2 - textElement.width / 2
              });
            }
            elements.push(textElement);
          }

          // calculate node height(if not set) based on rendered content
          if (
            typeof config.node.height === "undefined" ||
            config.node.height === null ||
            config.node.height < 1
          ) {
            config.node.height = box.h =
              rowsY +
              config.row.line * config.row.height +
              config.node.padding.y;
          }
          if (node === this._tree.root) {
            const {width, height} = this.chart.userOptions.chart;
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
                this._elements = elements;
                this.chart.setSize(curWidth, curHeight, false);
                return false;
              }
            }
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
            tooltipElement = ren
              .label(
                `<div style="
background-color: ${config.tooltip.backgroundColor};
color: ${config.tooltip.textColor};
font-size: 12px;
min-height: ${box.h}px;
margin-left: -${SHAPE_OFFSET}px;
margin-top: -${SHAPE_OFFSET}px;
width: ${tooltipW}px;
white-space: initial;
word-break: break-word;
">${config.tooltip.tooltipFormatter(node.item)}</div>`,
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
                zIndex: 5,
                opacity: 0
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
              fill: node.toggle
                ? config.node.backgroundColor
                : config.node.backgroundColorToggle,
              zIndex: 0,
              id: node.item.id,
              stroke: config.node.border.color, // basic
              "stroke-width": config.node.border.width // hyphenated
            })
            .on("mouseover", () => {
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
                .attr({
                  "stroke-width": config.connector.width,
                  stroke: config.connector.color
                })
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
                  .attr({
                    "stroke-width": config.connector.width,
                    stroke: config.connector.color
                  })
              );

              // draw line over children
              if (node.children.length > 1) {
                const offsetX = (config.node.width + config.node.marginX);
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
                    .attr({
                      "stroke-width": config.connector.width,
                      stroke: config.connector.color
                    })
                );
              }
            }

            each(node.children, drawNode);
          }

          maxX = Math.max(maxX, box.x + box.w);
          maxY = Math.max(maxY, box.y + box.h);

          return true;
        };

        // clear the previous
        // debugger;
        each(elements, (element: ElementObjectExtended) => {
          element.destroy();
        });
        elements = [];

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
                  .attr({ fill: colors[i] })
              );

              /*spacing between legend box and legend text*/
              offsetX += config.legend.nodeWidth + 5;

              const legendTextElement = ren
                .label(
                  legends[i].text,
                  offsetX + config.legend.marginX,
                  maxY + config.legend.marginY
                )
                .css({
                  fontSize: "14px",
                  color: config.textColor,
                  fontWeight: "bold"
                })
                .attr({ zIndex: 1 })
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
