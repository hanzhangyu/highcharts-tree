export default class Dictionary<T, K> {
    private map = new Map();
    public set(key: T, value: K) {
        this.map.set(key, value);
    }

    public get(key: T): K {
        return this.map.get(key);
    }

    public keys(fn?: (key: T) => void): any[] {
        const result: T[] = [];
        const iterator = this.map.keys();
        for (const key of iterator) {
            result.push(key);
            if (fn) {
                fn(key);
            }
        }
        return result;
    }

    public containsKey(key: T) {
        return this.map.has(key);
    }
}
