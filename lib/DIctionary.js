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
Object.defineProperty(exports, "__esModule", { value: true });
var Dictionary = /** @class */ (function () {
    function Dictionary() {
        this.map = new Map();
    }
    Dictionary.prototype.set = function (key, value) {
        this.map.set(key, value);
    };
    Dictionary.prototype.get = function (key) {
        return this.map.get(key);
    };
    Dictionary.prototype.keys = function (fn) {
        var e_1, _a;
        var result = [];
        var iterator = this.map.keys();
        try {
            for (var iterator_1 = __values(iterator), iterator_1_1 = iterator_1.next(); !iterator_1_1.done; iterator_1_1 = iterator_1.next()) {
                var key = iterator_1_1.value;
                result.push(key);
                if (fn) {
                    fn(key);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (iterator_1_1 && !iterator_1_1.done && (_a = iterator_1.return)) _a.call(iterator_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return result;
    };
    Dictionary.prototype.containsKey = function (key) {
        return this.map.has(key);
    };
    return Dictionary;
}());
exports.default = Dictionary;
//# sourceMappingURL=Dictionary.js.map