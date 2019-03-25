# highcharts-tree

[![Build Status](https://www.travis-ci.org/hanzhangyu/highcharts-tree.svg?branch=master)](https://www.travis-ci.org/hanzhangyu/highcharts-tree)
[![Coverage Status](https://coveralls.io/repos/github/hanzhangyu/highcharts-tree/badge.svg?branch=master)](https://coveralls.io/github/hanzhangyu/highcharts-tree?branch=master)

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

![](./example/screenshot.png)

## Changelog

see [release](https://github.com/hanzhangyu/highcharts-tree/releases)
