<h1 align="center">Welcome to d3-chart-callchain 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.0.1-blue.svg?cacheSeconds=2592000" />
</p>

> 用于服务与服务之间的调用关系

![image](https://github.com/twinkle77/d3-chart-callchain/blob/master/examples/demo.gif)

## Usage

```javascript
import Callchain from 'd3-chart-callchain'
const instance = new Callchain(document.body, {
  ...options,
  data: []
})

// render
instance.render()

// destory
instance.destory()

// update
instance.setOptions(newData)
```

## Config

```javascript
export default {
  transform: null, // 数据预处理
  marker: {
    colors: {
      active: '#1166BB',
      normal: '#999',
      selected: '#444'
    },
    markerHeight: 8,
    markerWidth: 8
  },
  node: {
    colors: ['#1BCA69', '#FF3A3A', '#FAB418'], // 圆环颜色
    radius: 60, // 节点半径
    ringWidth: 13, // 圆环宽度
    internalTopText ({ meta }) { return meta.averageTime },
    internalBottomText ({ meta }) { return meta.averageTime },
    externalText (node) { return node.name }
  },
  edge: {
    color: '#999'
  },
  zoom: {
    maxScale: 5, // 节点的最大缩放比例
    zoomDistance: 0.1, // 每次缩小放大的 增加比例
    moveDistance: 100 // 每次点击移动的距离
  },
  area: {
    edgeWidth: 8
  }
}
```

## Author

👤 **twinkle77**

* Github: [@twinkle77](https://github.com/twinkle77)

## Show your support

Give a ⭐️ if this project helped you!

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
