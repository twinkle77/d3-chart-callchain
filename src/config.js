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
