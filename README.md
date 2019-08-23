# highcharts-tree

[![Build Status][ci-img]][ci-url]
[![Code coverage][cov-img]][cov-url]
[![Dev Dependency Status][dev-dep-img]][dev-dep-url]
[![NPM version][npm-ver-img]][npm-url]
[![NPM downloads][npm-dl-img]][npm-url]
[![NPM license][npm-lc-img]][npm-url]

## Why?

Tree chart for Highcharts.

Forked from https://github.com/skorunka/highcharts.tree. This Repo has not been updated for a long time, So I forked it, fixed some bugs, add some feature

## Require

[Highcharts](https://github.com/highcharts/highcharts) 5.0.0+

## Install from npm

```bash
npm i --save highcharts-tree
```

## Usage

Follow the three steps:

<!-- prettier-ignore-start -->
```javascript
import Highcharts from "highcharts";
// 1. import
import HighchartsTree from "highcharts-tree";
// 2. initiate plugin
HighchartsTree(Highcharts);
const chartConfig = {
  chart: {
    type: "tree",
    config: {
      // tree chart config
    },
    width: 0, // set 0 to auto size
    height: 0 // set 0 to auto size
  },
  series: [{
    data: {
      id: 1,
      content: { title: "title 1", data: ["data", "text"] },
      children: [{
        id: 2,
        content: { title: "title 2", data: ["data"] }
      },
      {
        id: 3,
        content: {title: "title 3",data: ["data"]}
      }]
    }
  }],
  title: { text: "Title" }
};
// 3. create
Highcharts.chart(idSelector, chartConfig);
```
<!-- prettier-ignore-end -->

### Styled Mode

> highcharts version >= 7.0.0

```js
import Highcharts from "highcharts";
import HighchartsTree from "highcharts-tree";
import "highcharts-tree/css/highcharts-tree.scss"; // 1. import css file

HighchartsTree(Highcharts);

const chartConfig = {
  chart: {
    styledMode: true // 2. use styled mode
    // ...
  }
  // ...
};
Highcharts.chart(idSelector, chartConfig);
```

more css selector see [highcharts-tree.scss](./css/highcharts-tree.scss)

## config

[HighchartsTreeConfig](./types/index.d.ts)

### Type Checking
```typescript
import { HighchartsTreeConfig } from "highcharts-tree/types";
const chartConfig: HighchartsTreeConfig = {/* ... */};
Highcharts.chart(idSelector, chartConfig);
```

## Demo

- [project example](https://github.com/hanzhangyu/highcharts-tree/tree/master/example)
- [codesandbox base](https://codesandbox.io/s/highcharts-tree-demo-dcegq?fontsize=14)
- [codesandbox simple](https://codesandbox.io/s/highcharts-tree-simple-zg23i?fontsize=14)
- [codesandbox stylemode](https://codesandbox.io/s/highcharts-tree-stylemode-7x1ou?fontsize=14)


## Screenshot

![][screenshot-img]

## Changelog

see [release](https://github.com/hanzhangyu/highcharts-tree/releases)

[ci-img]: https://img.shields.io/travis/hanzhangyu/highcharts-tree.svg?style=flat-square
[ci-url]: https://travis-ci.org/hanzhangyu/highcharts-tree
[cov-img]: https://img.shields.io/coveralls/hanzhangyu/highcharts-tree.svg?style=flat-square
[cov-url]: https://coveralls.io/github/hanzhangyu/highcharts-tree?branch=master
[dep-img]: https://img.shields.io/david/hanzhangyu/highcharts-tree.svg?style=flat-square
[dep-url]: https://david-dm.org/hanzhangyu/highcharts-tree
[dev-dep-img]: https://img.shields.io/david/dev/hanzhangyu/highcharts-tree.svg?style=flat-square
[dev-dep-url]: https://david-dm.org/hanzhangyu/highcharts-tree#info=devDependencies
[npm-ver-img]: https://img.shields.io/npm/v/highcharts-tree.svg?style=flat-square
[npm-dl-img]: https://img.shields.io/npm/dm/highcharts-tree.svg?style=flat-square
[npm-lc-img]: https://img.shields.io/npm/l/highcharts-tree.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/highcharts-tree
[screenshot-img]: https://raw.githubusercontent.com/hanzhangyu/highcharts-tree/test/example/screenshot.png
