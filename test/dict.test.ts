import test from "ava";
import Tree from "../src/Tree";

const fn = () => "foo";

test("foo", t => {
  t.is(fn(), "foo");
});
