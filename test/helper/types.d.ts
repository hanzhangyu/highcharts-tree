// interface TreeDataRowItem {
//     id: number;
//     parentId: number;
//     content: any;
// }
// type TreeDataRow = TreeDataRowItem[];

export interface TreeDataNode {
    id: number;
    content: {
        title: string | number,
        data: Array<string|number>,
    };
    children?: TreeDataNode[];
}
