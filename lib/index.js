"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Tree_1 = __importDefault(require("./Tree"));
var SHAPE_OFFSET = 3;
var NODE_WIDTH_OFFSET = SHAPE_OFFSET * 2;
// @types/highcharts not support some method
exports.default = (function (Highcharts) {
    var highchartMajorVersion = Highcharts.version.split(".")[0];
    var defaultConfig = {
        node: {
            width: 200,
            height: 0,
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
            // @ts-ignore: Unused parameter index
            dataFormatter: function (data, index) {
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
            width: 0,
            tooltipFormatter: function (item) {
                return item.content.title + "<br>" + item.content.data.join("<br>");
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
    var seriesType = Highcharts.seriesType, seriesTypes = Highcharts.seriesTypes, each = Highcharts.each, merge = Highcharts.merge;
    seriesType("tree", "pie", {
        config: defaultConfig
    }, {
        init: function () {
            seriesTypes.pie.prototype.init.apply(this, arguments);
            var data = this.options.data;
            if (data === null ||
                typeof data === "undefined" ||
                typeof data.tree === "undefined" ||
                data.tree === null) {
                return;
            }
            this._tree = Tree_1.default.getTree(this._tree, this.options.data.tree);
        },
        translate: function () {
            var _this = this;
            this._config = merge({}, this.options.config, this.chart.userOptions.chart.config);
            var data = this.options.data;
            var ren = this.chart.renderer;
            var config = this._config;
            var colors = this.chart.options.colors;
            var maxX = 0;
            var maxY = 0;
            var elements = this._elements;
            var staticProps = ren.styledMode
                ? {
                    titleCss: {},
                    textCss: {},
                    tooltipStr: {
                        style: "",
                        class: "class=\"highcharts-tree-node-tooltip-inner\""
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
                        textOverflow: "ellipsis",
                        textAlign: "center"
                    },
                    textCss: {
                        fontSize: "13px",
                        color: config.node.textColor,
                        textOverflow: "ellipsis",
                        pointerEvents: "none"
                    },
                    tooltipStr: {
                        style: "border-radius: " + config.tooltip.borderRadius + ";\nbackground-color: " + config.tooltip.backgroundColor + ";\ncolor: " + config.tooltip.textColor + ";\nfont-size: 12px;\nwhite-space: initial;\nword-break: break-word;",
                        class: ""
                    },
                    tooltipAttr: {
                        opacity: 0
                    },
                    boxAttr: {
                        zIndex: 0,
                        stroke: config.node.border.color,
                        "stroke-width": config.node.border.width // hyphenated
                    },
                    connectorAttr: {
                        "stroke-width": config.connector.width,
                        stroke: config.connector.color
                    }
                };
            if (!elements)
                this._elements = elements = [];
            var drawNode = function (node) {
                var box = {
                    x: node.x * (config.node.width + config.node.marginX) +
                        config.node.border.width / 2,
                    y: node.y * (config.node.height + config.node.marginY) +
                        _this._titleOffsetY,
                    w: config.node.width,
                    h: config.node.height
                };
                // title, needs to be added to getBBox()
                var titleElement = ren
                    .label(node.item.content.title, box.x + config.node.padding.x, box.y + config.node.padding.y + config.node.title.marginTop, "rect", undefined, undefined, undefined, undefined, "tree-node-title")
                    .attr({ zIndex: 1 })
                    .add();
                /**
                 * in this line, highcharts will get the computed style
                 * so add it to RenderObject first
                 * @link
                 * https://github.com/highcharts/highcharts/blob/master/ts/parts/SvgRenderer.ts#L3716
                 */
                titleElement.css(__assign({}, staticProps.titleCss, { width: box.w - NODE_WIDTH_OFFSET - config.node.padding.x * 2 }));
                // - center it
                titleElement.attr({ x: box.x + box.w / 2 - titleElement.width / 2 });
                elements.push(titleElement);
                // rows
                var offsetTextByLegend = config.legend.enabled
                    ? config.legend.nodeWidth
                    : 0;
                var rowsY = titleElement.height +
                    config.node.title.marginTop +
                    config.node.title.marginDown;
                for (var i = 0; i < node.item.content.data.length; i++) {
                    if (config.legend.enabled) {
                        // legend box
                        elements.push(ren
                            .rect(box.x + config.node.padding.x, box.y + rowsY + config.row.height * i, config.legend.nodeWidth, config.row.height)
                            .css({ pointerEvents: "none" })
                            .attr(ren.styledMode
                            ? { class: "highcharts-tree-legend-" + i, zIndex: 1 }
                            : { fill: colors[i], zIndex: 1 }));
                    }
                    var text = config.node.dataFormatter(node.item.content.data[i], i);
                    var textAlign = config.node.content.align;
                    var textElementWidth = box.w -
                        offsetTextByLegend -
                        NODE_WIDTH_OFFSET -
                        config.node.padding.x * 2;
                    var computedWidth = textAlign === "center" ? undefined : textElementWidth;
                    var textElement = ren
                        .label(text, box.x + offsetTextByLegend + config.node.padding.x, box.y + rowsY + config.row.height * i, "rect", undefined, undefined, undefined, undefined, "tree-node-data")
                        .attr({
                        zIndex: 1,
                        width: computedWidth
                    })
                        .add();
                    textElement.css(__assign({}, staticProps.textCss, { width: computedWidth }));
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
                if (typeof config.node.height === "undefined" ||
                    config.node.height === null ||
                    config.node.height < 1) {
                    config.node.height = box.h =
                        rowsY +
                            config.row.line * config.row.height +
                            config.node.padding.y;
                }
                if (node === _this._tree.root) {
                    // region resize
                    var _a = _this.chart.userOptions.chart, width = _a.width, height = _a.height;
                    if (!width || !height) {
                        var changed = false;
                        var curWidth = _this._tree.root.width *
                            (config.node.width + config.node.marginX) +
                            config.node.width +
                            config.node.border.width;
                        var curHeight = _this._tree.root.height *
                            (config.node.height + config.node.marginY) +
                            config.node.height +
                            config.legend.marginY +
                            config.row.height +
                            _this._titleOffsetY;
                        if (!width && curWidth !== _this.chart.chartWidth) {
                            changed = true;
                            _this.chart.renderTo.style.width = curWidth + "px";
                        }
                        if (!height && curHeight !== _this.chart.chartHeight) {
                            changed = true;
                            _this.chart.renderTo.style.height = curHeight + "px";
                        }
                        if (changed) {
                            _this._elements = elements;
                            _this.chart.setSize(curWidth, curHeight, false);
                            return false;
                        }
                    }
                    // endregion
                }
                // main box
                // console.log(box.x);
                var tooltipElement = null;
                if (config.tooltip.enabled) {
                    var tooltipX = box.x + box.w;
                    var tooltipW = config.tooltip.width || box.w;
                    if (tooltipX + tooltipW > _this.chart.chartWidth) {
                        tooltipX = box.x - tooltipW;
                    }
                    var styleStr = "\nmin-height: " + box.h + "px;\nmargin-left: -" + SHAPE_OFFSET + "px;\nmargin-top: -" + SHAPE_OFFSET + "px;\nwidth: " + tooltipW + "px;" + staticProps.tooltipStr.style;
                    tooltipElement = ren
                        .label("<div\n" + staticProps.tooltipStr.class + "\nstyle=\"" + styleStr + "\">" + config.tooltip.tooltipFormatter(node.item) + "</div>", tooltipX, box.y, "rect", undefined, undefined, true)
                        .css({
                        pointerEvents: "none"
                    })
                        .attr(__assign({}, staticProps.tooltipAttr, { zIndex: 5 }))
                        .add();
                    elements.push(tooltipElement);
                }
                var boxElement = ren
                    .rect(box.x, box.y, box.w, box.h, 3)
                    .css({
                    cursor: node.children.length < 1 ? "default" : "pointer"
                })
                    .attr(__assign({}, staticProps.boxAttr, { id: node.item.id }, (ren.styledMode
                    ? {
                        class: "highcharts-tree-box" + (node.toggle ? "" : " fold")
                    }
                    : {
                        fill: node.toggle
                            ? config.node.backgroundColor
                            : config.node.backgroundColorToggle
                    })))
                    .on("mouseover", function () {
                    if (ren.styledMode) {
                        if (tooltipElement) {
                            tooltipElement.attr({
                                class: "highcharts-tree-node-tooltip hover"
                            });
                        }
                        return;
                    }
                    if (highchartMajorVersion > 5) {
                        boxElement.animate({
                            fill: node.toggle
                                ? config.node.hover.backgroundColor
                                : config.node.hover.backgroundColorToggle
                        }, { duration: 300 });
                    }
                    else {
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
                    .on("mouseout", function () {
                    if (ren.styledMode) {
                        if (tooltipElement) {
                            tooltipElement.attr({
                                class: "highcharts-tree-node-tooltip"
                            });
                        }
                        return;
                    }
                    if (highchartMajorVersion > 5) {
                        boxElement.animate({
                            fill: node.toggle
                                ? config.node.backgroundColor
                                : config.node.backgroundColorToggle
                        }, { duration: 300 });
                    }
                    else {
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
                    boxElement.on("click", function () {
                        node.toggle = !node.toggle;
                        _this._tree.build();
                        _this.translate();
                    });
                }
                // draw line to parent
                if (node.parent != null) {
                    elements.push(ren
                        .path([
                        "M",
                        box.x + box.w / 2,
                        box.y,
                        "L",
                        box.x + box.w / 2,
                        box.y - config.node.marginY / 2 - config.connector.width / 2
                    ])
                        .attr(staticProps.connectorAttr));
                }
                if (node.toggle) {
                    // draw line to children
                    if (node.children.length > 0) {
                        var nodeBottomMiddle = {
                            x: box.x + box.w / 2,
                            y: box.y + box.h
                        };
                        elements.push(ren
                            .path([
                            "M",
                            nodeBottomMiddle.x,
                            nodeBottomMiddle.y,
                            "L",
                            nodeBottomMiddle.x,
                            nodeBottomMiddle.y + config.node.marginY / 2
                        ])
                            .attr(staticProps.connectorAttr));
                        // draw line over children
                        if (node.children.length > 1) {
                            var offsetX = config.node.width + config.node.marginX;
                            var linePositionY = nodeBottomMiddle.y + config.node.marginY / 2;
                            elements.push(ren
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
                                .attr(staticProps.connectorAttr));
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
            each(elements, function (element) {
                element.destroy();
            });
            elements = [];
            if (data === null ||
                typeof data === "undefined" ||
                typeof data.tree === "undefined" ||
                data.tree === null) {
                // error
                elements.push(ren.label("Invalid data.", 0, 0).css({
                    fontSize: "14px",
                    color: "#EE0000",
                    fontWeight: "bold"
                }));
            }
            else {
                this._titleOffsetY = 0;
                if (this.chart.title) {
                    var titleBox = this.chart.title.getBBox();
                    this._titleOffsetY =
                        titleBox.y + titleBox.height + this.chart.options.title.margin;
                }
                // draw tree
                if (!drawNode(this._tree.root)) {
                    return;
                }
                // draw legend
                if (config.legend.enabled) {
                    var legends = data.legends || [];
                    var offsetX = 0;
                    for (var i = 0; i < Math.min(legends.length, config.row.line); i++) {
                        elements.push(ren
                            .rect(offsetX + config.legend.marginX, maxY + config.legend.marginY, config.legend.nodeWidth, config.row.height)
                            .attr(ren.styledMode
                            ? { class: "highcharts-tree-legend-" + i }
                            : { fill: colors[i] }));
                        /*spacing between legend box and legend text*/
                        offsetX += config.legend.nodeWidth + 5;
                        var legendTextElement = ren
                            .label(legends[i].text, offsetX + config.legend.marginX, maxY + config.legend.marginY)
                            .css(ren.styledMode
                            ? {}
                            : {
                                fontSize: "14px",
                                color: config.node.textColor,
                                fontWeight: "bold"
                            })
                            .attr(ren.styledMode
                            ? {
                                class: "highcharts-tree-legend-text",
                                zIndex: 1
                            }
                            : { zIndex: 1 })
                            .add();
                        elements.push(legendTextElement);
                        /*spacing between legends */
                        offsetX += legendTextElement.width + 30;
                    }
                }
            }
            each(elements, function (element) {
                if (element.added)
                    return;
                element.add();
            });
            this._elements = elements;
        },
        animate: function () {
            return;
        },
        drawPoints: function () {
            return;
        },
        drawDataLabels: function () {
            return;
        }
    });
});
//# sourceMappingURL=index.js.map