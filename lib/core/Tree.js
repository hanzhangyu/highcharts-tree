"use strict";
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var TreeNode_1 = __importDefault(require("./TreeNode"));
var Dictionary_1 = __importDefault(require("./Dictionary"));
var Tree = /** @class */ (function () {
    function Tree(treeNode) {
        this.treeMod = 0;
        this.root = this.buildTree(treeNode);
    }
    Tree.getTree = function (tree, data) {
        return tree && tree.root ? tree : new Tree(data).build();
    };
    Tree.initializeNodes = function (node, depth) {
        var e_1, _a;
        if (depth === void 0) { depth = 0; }
        node.x = -1;
        node.y = depth;
        node.mod = 0;
        if (!node.toggle)
            return;
        try {
            for (var _b = __values(node.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                Tree.initializeNodes(child, depth + 1);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    Tree.checkForConflicts = function (node) {
        var nodeContour = new Dictionary_1.default();
        Tree.getLeftContour(node, 0, nodeContour);
        var sibling = node.getLeftMostSibling();
        var shiftValue = 0.0;
        while (sibling != null && sibling !== node) {
            var siblingContour = new Dictionary_1.default();
            Tree.getRightContour(sibling, 0, siblingContour);
            for (var level = node.y + 1; level <=
                Math.min(Math.max.apply(null, siblingContour.keys()), Math.max.apply(null, nodeContour.keys())); level++) {
                var distance = nodeContour.get(level) - siblingContour.get(level) - Tree.nodeSize;
                if (distance + shiftValue < Tree.treeDistance) {
                    shiftValue = Tree.treeDistance - distance;
                }
            }
            if (shiftValue > 0) {
                node.x += shiftValue;
                node.mod += shiftValue;
                // update the mod in nodeContour
                nodeContour.keys(function (key) {
                    nodeContour.set(key, nodeContour.get(key) + shiftValue);
                });
                Tree.centerNodesBetween(node, sibling);
                shiftValue = 0;
            }
            sibling = sibling.getNextSibling();
        }
    };
    Tree.getLeftContour = function (node, modSum, values) {
        var e_2, _a;
        if (!values.containsKey(node.y))
            values.set(node.y, node.x + modSum);
        else {
            values.set(node.y, Math.min(values.get(node.y), node.x + modSum));
        }
        modSum += node.mod;
        if (node.toggle) {
            try {
                for (var _b = __values(node.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    Tree.getLeftContour(child, modSum, values);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
    };
    Tree.getRightContour = function (node, modSum, values) {
        var e_3, _a;
        if (!values.containsKey(node.y))
            values.set(node.y, node.x + modSum);
        else {
            values.set(node.y, Math.max(values.get(node.y), node.x + modSum));
        }
        modSum += node.mod;
        if (node.toggle) {
            try {
                for (var _b = __values(node.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    Tree.getRightContour(child, modSum, values);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
    };
    Tree.centerNodesBetween = function (leftNode, rightNode) {
        var leftIndex = leftNode.parent.children.indexOf(rightNode);
        var rightIndex = leftNode.parent.children.indexOf(leftNode);
        var numNodesBetween = rightIndex - leftIndex - 1;
        if (numNodesBetween > 0) {
            var distanceBetweenNodes = (leftNode.x - rightNode.x) / (numNodesBetween + 1);
            for (var i = leftIndex + 1; i < rightIndex; i++) {
                var middleNode = leftNode.parent.children[i];
                var desiredX = rightNode.x + distanceBetweenNodes * (i - leftIndex);
                var offset = desiredX - middleNode.x;
                middleNode.x += offset;
                middleNode.mod += offset;
            }
            Tree.checkForConflicts(leftNode);
        }
    };
    Tree.prototype.build = function () {
        Tree.initializeNodes(this.root);
        this.calculateInitialX(this.root);
        this.calculateXWithMod(this.root);
        this.calculateFinalPositions(this.root);
        return this;
    };
    Tree.prototype.calculateInitialX = function (node) {
        var e_4, _a;
        if (node.toggle) {
            try {
                for (var _b = __values(node.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    this.calculateInitialX(child);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_4) throw e_4.error; }
            }
        }
        if (node.isLeaf() || !node.toggle) {
            // if there is a previous sibling in this set, set X to previous sibling + designated distance
            if (!node.isLeftMost()) {
                node.x =
                    node.getPreviousSibling().x + Tree.nodeSize + Tree.siblingDistance;
            }
            else
                node.x = 0; // if this is the first node in a set, set X to 0
        }
        else if (node.children.length === 1) {
            // if this is the first node in a set, set it's X value equal to it's child's X value
            if (node.isLeftMost()) {
                node.x = node.children[0].x;
            }
            else {
                node.x =
                    node.getPreviousSibling().x + Tree.nodeSize + Tree.siblingDistance;
                node.mod = node.x - node.children[0].x;
            }
        }
        else {
            var leftChild = node.getLeftMostChild();
            var rightChild = node.getRightMostChild();
            var mid = (leftChild.x + rightChild.x) / 2;
            if (node.isLeftMost()) {
                node.x = mid;
            }
            else {
                node.x =
                    node.getPreviousSibling().x + Tree.nodeSize + Tree.siblingDistance;
                node.mod = node.x - mid;
            }
        }
        if (node.children.length > 0 && !node.isLeftMost() && node.toggle) {
            // Since subtrees can overlap, check for conflicts and shift tree right if needed
            Tree.checkForConflicts(node);
        }
    };
    Tree.prototype.calculateXWithMod = function (node, modSum) {
        var e_5, _a;
        if (modSum === void 0) { modSum = 0; }
        node.x += modSum;
        if (node.x < 0 && node.x * -1 > this.treeMod)
            this.treeMod = node.x * -1;
        modSum += node.mod;
        if (node.toggle) {
            try {
                for (var _b = __values(node.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    this.calculateXWithMod(child, modSum);
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_5) throw e_5.error; }
            }
        }
    };
    Tree.prototype.calculateFinalPositions = function (node) {
        var e_6, _a;
        node.x += this.treeMod;
        if (node.toggle) {
            try {
                for (var _b = __values(node.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    this.calculateFinalPositions(child);
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_6) throw e_6.error; }
            }
        }
        if (node.isLeaf() || !node.toggle) {
            node.width = node.x;
            node.height = node.y;
        }
        else {
            var childWidths = node.children
                .map(function (n) { return n.width; })
                .sort(function (p1, p2) { return p2 - p1; });
            var childHeight = node.children
                .map(function (n) { return n.height; })
                .sort(function (p1, p2) { return p2 - p1; });
            node.width = childWidths[0];
            node.height = childHeight[0];
        }
    };
    // Build tree as linked list and return root node.
    Tree.prototype.buildTree = function (data, parent) {
        var _this = this;
        var currentNode = new TreeNode_1.default(data, parent);
        currentNode.children = data.children
            ? data.children.map(function (childData) {
                return _this.buildTree(childData, currentNode);
            })
            : [];
        return currentNode;
    };
    Tree.nodeSize = 1;
    Tree.siblingDistance = 0.0;
    Tree.treeDistance = 0.0;
    return Tree;
}());
exports.default = Tree;
//# sourceMappingURL=Tree.js.map