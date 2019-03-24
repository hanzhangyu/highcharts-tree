import anyTest, { TestInterface } from "ava";
import Dictionary from "../src/Dictionary";

const NAMESPACE = "Dictionary: ";

const test = anyTest as TestInterface<{
  dict: Dictionary<number, number>,
}>;

test.before(t => {
  t.context.dict = new Dictionary<number, number>();
  t.context.dict.set(0, 10);
  t.context.dict.set(1, 11);
});

test(`${NAMESPACE}test for get`, t => {
  t.is(t.context.dict.get(0), 10);
});

test(`${NAMESPACE}test for keys`, t => {
  t.deepEqual(t.context.dict.keys(), [0, 1]);
});

test(`${NAMESPACE}test for keys callback`, t => {
  const cbData: number[] = [];
  t.context.dict.keys((key: number) => cbData.push(key));
  t.deepEqual(cbData, [0, 1]);
});

test(`${NAMESPACE}test for containKeys`, t => {
  t.true(t.context.dict.containsKey(1));
  t.false(t.context.dict.containsKey(2));
});
