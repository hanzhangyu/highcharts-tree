"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Tree_1 = __importDefault(require("./Tree"));
// @types/highcharts not support some method
exports.default = (function (Highcharts) {
    var NODE_WIDTH_OFFSET = 6;
    var defaultConfig = {
        node: {
            width: 200,
            height: 0,
            marginX: 20,
            marginY: 20,
            backgroundColor: "#f2f2f2",
            backgroundColorToggle: "#cccccc",
            title: {
                marginY: 4
            },
            padding: {
                x: 0,
                y: 0,
            },
            content: {
                align: "center"
            }
        },
        row: {
            height: 20,
            line: 2
        },
        tooltip: {
            backgroundColor: "rgba(0,0,0,0.1)"
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
    var seriesType = Highcharts.seriesType, seriesTypes = Highcharts.seriesTypes, each = Highcharts.each, merge = Highcharts.merge;
    seriesType("tree", "pie", {
        config: defaultConfig
    }, {
        init: function () {
            console.log("init");
            seriesTypes.pie.prototype.init.apply(this, arguments);
            this._tree = Tree_1.default.getTree(this._tree, this.options.data[0].tree);
        },
        translate: function () {
            var _this = this;
            console.log("translate");
            this._config = merge({}, this.options.config, this.chart.userOptions.chart.config);
            var data = this.options.data[0];
            var ren = this.chart.renderer;
            var config = this._config;
            var colors = this.chart.options.colors;
            var maxX = 0;
            var maxY = 0;
            var elements = this._elements;
            if (!elements)
                this._elements = elements = [];
            var drawNode = function (node) {
                var formatRowValue = function (value) {
                    return value.toLocaleString();
                };
                var box = {
                    x: node.x * (config.node.width + config.node.marginX),
                    y: node.y * (config.node.height + config.node.marginY),
                    // w: config.node.width,
                    // h: config.node.height
                    w: config.node.width - config.node.padding.x,
                    h: config.node.height - config.node.padding.y
                };
                // title, needs to be added to getBBox()
                var titleElement = ren
                    .label(node.item.content.title, box.x, box.y + config.node.title.marginY, "rect")
                    .css({
                    pointerEvents: "none",
                    fontSize: "14px",
                    color: config.textColor,
                    fontWeight: "bold",
                    width: box.w - NODE_WIDTH_OFFSET,
                    textOverflow: "ellipsis",
                    textAlign: "center"
                })
                    .attr({ zIndex: 1 })
                    .add();
                // - center it
                titleElement.attr({ x: box.x + box.w / 2 - titleElement.width / 2 });
                elements.push(titleElement);
                // rows
                var offsetTextByLegend = config.legend.enabled
                    ? config.legend.nodeWidth
                    : 0;
                var rowsY = titleElement.height + config.node.title.marginY * 2;
                for (var i = 0; i < node.item.content.data.length; i++) {
                    if (config.legend.enabled) {
                        // legend box
                        elements.push(ren
                            .rect(box.x, box.y + rowsY + config.row.height * i, config.legend.nodeWidth, config.row.height)
                            .css({ pointerEvents: "none" })
                            .attr({ fill: colors[i], zIndex: 1 }));
                    }
                    var text = formatRowValue(node.item.content.data[i]);
                    var textAlign = config.node.content.align;
                    var textElementWidth = box.w - offsetTextByLegend - NODE_WIDTH_OFFSET;
                    var computedWidth = textAlign === "center" ? undefined : textElementWidth;
                    var textElement = ren
                        .label(text, box.x + offsetTextByLegend, box.y + rowsY + config.row.height * i, "rect")
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
                if (typeof config.node.height === "undefined" ||
                    config.node.height === null ||
                    config.node.height < 1) {
                    config.node.height = box.h =
                        rowsY + config.row.line * config.row.height;
                }
                if (node === _this._tree.root) {
                    var minChartWidth = _this._tree.root.width *
                        (config.node.width + config.node.marginX) +
                        config.node.width;
                    var minChartHeight = _this._tree.root.height *
                        (config.node.height + config.node.marginY) +
                        config.node.height;
                    var isGrowWidth = _this.chart.chartWidth < minChartWidth;
                    var isGrowHeight = _this.chart.chartHeight < minChartHeight;
                    if (isGrowWidth || isGrowHeight) {
                        if (isGrowWidth) {
                            _this.chart.renderTo.style.width = minChartWidth + "px";
                        }
                        if (isGrowHeight) {
                            _this.chart.renderTo.style.height = minChartHeight + "px";
                        }
                        _this._elements = elements;
                        _this.chart.setSize(isGrowWidth ? minChartWidth : null, isGrowHeight ? minChartHeight : null);
                        return false;
                    }
                }
                // main box
                // console.log(box.x);
                var tooltipElement = ren
                    .label(node.item.content.title + "<br>" + 123, box.x + box.w, box.y, "callout", undefined, undefined, true)
                    .css({
                    fontSize: "13px",
                    color: config.textColor,
                    whiteSpace: "normal",
                    pointerEvents: "none"
                })
                    .attr({
                    zIndex: 1,
                    fill: config.tooltip.backgroundColor,
                    height: box.h - NODE_WIDTH_OFFSET,
                    opacity: 0
                })
                    .add();
                elements.push(tooltipElement);
                var boxElement = ren
                    .rect(box.x, box.y, box.w, box.h, 3)
                    .css({ cursor: node.children.length < 1 ? "default" : "pointer" })
                    .attr({
                    fill: node.toggle
                        ? config.node.backgroundColor
                        : config.node.backgroundColorToggle,
                    zIndex: 0,
                    id: node.item.id
                })
                    .on("mouseover", function () {
                    tooltipElement.animate({
                        opacity: 1
                    }, { duration: 300 });
                })
                    .on("mouseout", function () {
                    tooltipElement.animate({
                        opacity: 0
                    }, { duration: 300 });
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
                        .attr({
                        "stroke-width": config.connector.width,
                        stroke: config.connector.color
                    }));
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
                            .attr({
                            "stroke-width": config.connector.width,
                            stroke: config.connector.color
                        }));
                        // draw line over children
                        if (node.children.length > 1) {
                            elements.push(ren
                                .path([
                                "M",
                                node.getRightMostChild().x *
                                    (config.node.width + config.node.marginX) +
                                    config.node.width / 2 -
                                    config.connector.width / 2,
                                nodeBottomMiddle.y + config.node.marginY / 2,
                                "L",
                                node.getLeftMostChild().x *
                                    (config.node.width + config.node.marginX) +
                                    config.node.width / 2 +
                                    config.connector.width / 2,
                                nodeBottomMiddle.y + config.node.marginY / 2
                            ])
                                .attr({
                                "stroke-width": config.connector.width,
                                stroke: config.connector.color
                            }));
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
                // draw tree
                if (!drawNode(this._tree.root))
                    return;
                // draw legend
                if (config.legend.enabled) {
                    var legends = data.legends || [];
                    var offsetX = 0;
                    for (var i = 0; i < Math.min(legends.length, config.row.line); i++) {
                        elements.push(ren
                            .rect(offsetX + config.legend.marginX, maxY + config.legend.marginY, config.legend.nodeWidth, config.row.height)
                            .attr({ fill: colors[i] }));
                        /*spacing between legend box and legend text*/
                        offsetX += config.legend.nodeWidth + 5;
                        var legendTextElement = ren
                            .label(legends[i].text, offsetX + config.legend.marginX, maxY + config.legend.marginY)
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