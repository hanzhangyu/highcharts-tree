"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getStaticProps(config, styledMode) {
    return styledMode
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
}
exports.getStaticProps = getStaticProps;
exports.DEFAULT_CONFIG = Object.freeze({
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
        dataFormatter: function (data) {
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
            return ("" + item.content.title +
                (item.content.data ? "<br>" + item.content.data.join("<br>") : ""));
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
function drawTitle() { }
exports.drawTitle = drawTitle;
//# sourceMappingURL=props.js.map