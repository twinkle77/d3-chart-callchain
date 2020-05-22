export default {
  Margin: 20,
  Colors: [],
  markerColors: {
    ACTIVE: '#1166BB',
    NORMAL: '#999',
    SELECTED: '#444',
  },
  // 圆环颜色
  NodeColor: ['#1BCA69', '#FF3A3A', '#FAB418'],
  Client: 'client',
  CollideRadius: 135,
  // 节点半径
  NodeRadius: 60,
  // 圆环宽度
  RingWidth: 13,
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
  Id: 'referenceId',
}
