declare const HighchartsTree: (Highcharts: any) => void;
export default HighchartsTree;

export interface TreeNodeData {
    id: number;
    content: {
        title: string | number,
        data: Array<string|number>,
    };
    children?: TreeNodeData[];
}

export interface HighchartsTreeConfig {
    horizontal?: boolean; // draw direction
    disableToggle?: boolean; // disable toggle node children
    node?: {
        width?: number; // node width
        height?: number; // null || 0 = auto-calculated
        marginX?: number; // node margin left and right
        marginY?: number; // node margin top and bottom
        textColor?: string; // color for title and content word in node
        backgroundColor?: string; // background-color for node
        backgroundColorToggle?: string; // background-color for node when toggled
        title?: {
            marginTop?: number; // margin-top for title
            marginDown?: number; // margin-bottom for title
        };
        padding?: {
            x?: number; // padding left and right for node
            y?: number; // padding top and bottom for node
        };
        content?: {
            align?: string; // text-align for content(left|center|right)
        };
        hover?: { // node background-color when hovered
            backgroundColor?: string;
            backgroundColorToggle?: string;
        };
        border?: { // border style
            width?: number;
            color?: string;
        };
        dataFormatter?: (data?: string | number, index?: number) => string; // format content data
    };
    row?: {
        height?: number; // content data height for one row
        line?: number; // row number, if content.data.length, show content.data.slice(0, line) only
    };
    tooltip?: {
        enabled?: boolean; // enable tooltip or not
        backgroundColor?: string; // background-color
        borderRadius?: string; // border-radius
        textColor?: string; // color
        width?: number; // tooltip width, set 0 to use node width
        tooltipFormatter?: (item?: TreeNodeData) => string; // format tooltip content
    };
    connector?: { // the connector between nodes
        color?: string;
        width?: number;
    };
    legend?: {
        enabled?: boolean;
        nodeWidth?: number; // width for legend in node content row
        marginX?: number; // margin between legend
        marginY?: number;
    };
}
