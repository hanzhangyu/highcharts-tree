export default class TreeNode<T extends TreeDataNode> {
  public children: Array<TreeNode<T>>;

  public x: number;
  public y: number;
  public mod: number;
  public toggle: boolean = true;

  public width: number;
  public height: number;

  constructor(public item: T, public parent: TreeNode<T> = null) {
    this.x = 0;
    this.y = 0;
    this.mod = 0;
    this.width = 0;
    this.height = 0;
  }

  public isLeaf(): boolean {
    return !this.children || this.children.length < 1;
  }

  public isLeftMost(): boolean {
    return this.parent == null || this.parent.children[0] === this;
  }

  public isRightMost(): boolean {
    return (
      this.parent == null ||
      this.parent.children[this.parent.children.length - 1] === this
    );
  }

  public getPreviousSibling(): TreeNode<T> {
    if (this.parent == null || this.isLeftMost()) return null;

    return this.parent.children[this.parent.children.indexOf(this) - 1];
  }

  public getNextSibling(): TreeNode<T> {
    if (this.parent == null || this.isRightMost()) return null;

    return this.parent.children[this.parent.children.indexOf(this) + 1];
  }

  public getLeftMostSibling(): TreeNode<T> {
    if (this.parent == null) return null;

    if (this.isLeftMost()) return this;

    return this.parent.children[0];
  }

  public getLeftMostChild(): TreeNode<T> {
    return this.children && this.children.length > 0 ? this.children[0] : null;
  }

  public getRightMostChild(): TreeNode<T> {
    return this.children && this.children.length > 0
      ? this.children[this.children.length - 1]
      : null;
  }
}
