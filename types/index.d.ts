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
    node?: {
        width?: number;
        height?: number;
        marginX?: number;
        marginY?: number;
        textColor?: string;
        backgroundColor?: string;
        backgroundColorToggle?: string;
        title?: {
            marginTop?: number;
            marginDown?: number;
        };
        padding?: {
            x?: number;
            y?: number;
        };
        content?: {
            align?: string;
        };
        hover?: {
            backgroundColor?: string;
            backgroundColorToggle?: string;
        };
        border?: {
            width?: number;
            color?: string;
        };
        dataFormatter?: (data?: string | number, index?: number) => string;
    };
    row?: {
        height?: number;
        line?: number;
    };
    tooltip?: {
        enabled?: boolean;
        backgroundColor?: string;
        borderRadius?: string;
        textColor?: string;
        width?: number;
        tooltipFormatter?: (item?: TreeNodeData) => string;
    };
    connector?: {
        color?: string;
        width?: number;
    };
    legend?: {
        enabled?: boolean;
        nodeWidth?: number;
        marginX?: number;
        marginY?: number;
    };
}
