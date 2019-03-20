// interface TreeDataRowItem {
//     id: number;
//     parentId: number;
//     content: any;
// }
// type TreeDataRow = TreeDataRowItem[];

interface TreeDataNode {
    id: number;
    content: any;
    children?: TreeDataNode[];
}
