"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TreeNode = /** @class */ (function () {
    function TreeNode(item, parent) {
        if (parent === void 0) { parent = null; }
        this.item = item;
        this.parent = parent;
        this.toggle = true;
        this.x = 0;
        this.y = 0;
        this.mod = 0;
        this.width = 0;
        this.height = 0;
    }
    TreeNode.prototype.isLeaf = function () {
        return !this.children || this.children.length < 1;
    };
    TreeNode.prototype.isLeftMost = function () {
        return this.parent == null || this.parent.children[0] === this;
    };
    TreeNode.prototype.isRightMost = function () {
        return (this.parent == null ||
            this.parent.children[this.parent.children.length - 1] === this);
    };
    TreeNode.prototype.getPreviousSibling = function () {
        if (this.parent == null || this.isLeftMost())
            return null;
        return this.parent.children[this.parent.children.indexOf(this) - 1];
    };
    TreeNode.prototype.getNextSibling = function () {
        if (this.parent == null || this.isRightMost())
            return null;
        return this.parent.children[this.parent.children.indexOf(this) + 1];
    };
    TreeNode.prototype.getLeftMostSibling = function () {
        if (this.parent == null)
            return null;
        if (this.isLeftMost())
            return this;
        return this.parent.children[0];
    };
    TreeNode.prototype.getLeftMostChild = function () {
        return this.children && this.children.length > 0 ? this.children[0] : null;
    };
    TreeNode.prototype.getRightMostChild = function () {
        return this.children && this.children.length > 0
            ? this.children[this.children.length - 1]
            : null;
    };
    return TreeNode;
}());
exports.default = TreeNode;
//# sourceMappingURL=TreeNode.js.map