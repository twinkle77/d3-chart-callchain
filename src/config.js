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
  Margin: 20,
  Colors: [],
  Client: 'client',
  CollideRadius: 135,
  // 边颜色
  EdgeColor: '#999',
  // area边宽度
  AreaEdgeWidth: 8,
  // 节点的最大缩放比例
  MaxScaleK: 5,
  // 每次点击移动的距离
  MoveDistance: 100,
  // 每次缩小放大的 增加比例
  ZoomDistance: 0.1,
  // 信息面板配置. 传null标识不显示
  // PanelConfig: {
  //   width: 300
  // },
  PanelConfig: null,
  // 以xxx字段作为节点的索引id
  Id: 'referenceId'
}
