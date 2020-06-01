import './assets/style.less'
import * as d3 from 'd3'
import { query, prefix } from '@/util/element'
import { ellipsis } from '@/util/text.js'
import CONFIG from '@/config'
import { EdgeUtil, ServerNodeUtil, ClientNodeUtil } from '@/draw'
import transformData, { SERVER, CLIENT } from './transform'

export default class Callchain {
  container = null
  graph = null
  areasWrapper = null
  edgesWrapper = null
  nodesWrapper = null
  defs = null
  svg = null

  zoomSpace = null

  nodes = null
  edges = null

  simulation = null

  nodeElements = null
  edgeElements = null

  constructor (el = 'callchain') {
    this.container = query(el)
    this.setup()
  }

  setup () {
    this.createElement()
    this.createSymbol()
  }

  createElement () {
    this.svg = d3.select(this.container).append('svg').attr('id', prefix('svg')).attr('width', '1200').attr('height', 1200)
    this.zoomSpace = this.svg.append('g').attr('class', prefix('zoom-space'))
    this.graph = this.zoomSpace.append('g').attr('class', prefix('graph-wrapper'))
    this.areasWrapper = this.graph.append('g').attr('class', 'areas')
    this.edgesWrapper = this.graph.append('g').attr('class', 'edges')
    this.nodesWrapper = this.graph.append('g').attr('class', 'nodes')
  }

  createSymbol () {
    this.defs = this.svg.append('defs')
    const { colors, markerHeight, markerWidth } = CONFIG.marker
    Object.keys(colors).forEach((key) => {
      this.defs.call(
        EdgeUtil.drawSymbol,
        key.toUpperCase(),
        {
          markerHeight,
          markerWidth,
          color: colors[key]
        }
      )
    })
  }

  processData (data) {
    this.nodes = typeof CONFIG.transform === 'function' ? CONFIG.transform(data) : transformData(data)
    this.edges = this.nodes.reduce((pre, cur) => [...pre, ...cur.edges], [])
  }

  setupForce () {
    const { node: { radius } } = CONFIG
    // 图的居中位置计算
    const graph = {
      centerX: 1200 / 2,
      centerY: 1200 / 2
    }

    const xCoordinateScale = d3 // https://www.d3indepth.com/scales/
      .scalePow()
      .domain([6, 100, 1e6])
      .range([1e3, 2e3, 5e3])
      .clamp(true)
    const graphSize = this.nodes.length * this.edges.length
    // 每个节点之间的距离

    // eslint-disable-next-line no-unused-vars
    const desiredXPositionForLeafNodes = xCoordinateScale(graphSize)

    // 如果需要个性化调整布局，应该在 forces 中注册而不是在每次 tick 时修改节点位置
    this.simulation = d3.forceSimulation()
      .nodes(this.nodes)
      .force('link', // link(弹簧)力模型
        d3.forceLink()
          .id(node => node.id)
          .links(this.edges)
          .distance(radius + 20) // 设置两点之间距离
      )
      .force('x', // forceX and forceY cause elements to be attracted towards specified position(s)
        d3.forceX()
          .x(({ type }) => {
            return type === CLIENT ? 0 : graph.centerX
          })
      )
      .force('y',
        d3.forceY()
          .y(graph.centerY)
      )
      .force(
        'collide', // 碰撞力模型，防止节点重叠
        d3
          .forceCollide()
          .strength(0.7)
          .radius(radius + 20)
          .iterations(1)
      )
      .alpha(1)

    const { edge } = CONFIG

    this.simulation
      .on('tick', () => {
        this.nodeElements
          .attr('transform', node => {
            return `translate(${node.x}, ${node.y})`
          })

        this.edgeElements
          .attr('d', function ({ source, target }) {
            return `M ${source.x} ${source.y} L ${target.x} ${target.y}`
          })
          .attr('stroke', edge.color)
      })
      .on('end', function end (...args) {
        console.log('force end')
      })
  }

  uninstallForce () {
    this.simulation
      .force('X', null)
      .force('link', null)
      .on('tick', null)
      .on('end', null)
  }

  initNode () {
    // 因为每次数据都从服务端拉取新的数据，没有增量更新的情况
    // 所以不打算使用join、update、exit等方法来做到复用dom元素
    this.nodesWrapper
      .selectAll('.node')
      .remove()

    // 不使用箭头函数，避免拿不到 d3绑定的 this
    const that = this
    this.nodeElements = this.nodesWrapper
      .selectAll('.node')
      .data(this.nodes)
      .enter()
      .append('g')
      .attr('id', node => node.id)
      .each(function multipe (node) {
        const { type } = node
        const target = d3.select(this)
        if (type === SERVER) {
          that.processServerNode(target)
        } else if (type === CLIENT) {
          that.processClientNode(target)
          node.fx = 0 // To fix a node in a given position
        }
      })
  }

  processServerNode (nodeElement) {
    const { node } = CONFIG
    const className = `${SERVER.toLowerCase()} node `
    nodeElement
      .classed(className + 'clickable', true)
      .selectAll('path')
      .data(node => {
        return node.scaleReq
      })
      .enter()
      .append('path')
      .call(ServerNodeUtil.drawRing, {
        colors: node.colors,
        radius: node.radius,
        ringWidth: node.ringWidth
      })

    nodeElement
      .call(ServerNodeUtil.drawCircle, {
        radius: node.radius - node.ringWidth / 2,
        strokeWidth: node.ringWidth + 5
      })
      .call(ServerNodeUtil.drawText, { // 圆环内部文字 偏上
        text: (n) => ellipsis(node.internalTopText(n)),
        x: 0,
        y: 16
      })
      .call(ServerNodeUtil.drawText, { // 圆环底部文字
        text: (n) => ellipsis(node.externalText(n)),
        x: 0,
        y: node.radius + 20
      })
      .call(ServerNodeUtil.drawText, {
        text: (n) => ellipsis(node.internalBottomText(n)), // 圆环内部文字 偏下
        x: 0,
        y: -3
      })
  }

  processClientNode (nodeElement) {
    const { node } = CONFIG
    const className = `${CLIENT.toLowerCase()} node `
    nodeElement
      .classed(className, true)
      .call(ClientNodeUtil.drawIcon)
      .call(ServerNodeUtil.drawText, { // 圆环底部文字
        text: (n) => ellipsis(node.externalText(n)),
        x: 0,
        y: 20
      })
  }

  initEdge () {
    this.edgesWrapper
      .selectAll('.edge')
      .remove()

    this.edgeElements = this.edgesWrapper
      .selectAll('.edge')
      .data(this.edges)
      .enter()
      .append('path')
      .attr('class', 'edge')
      .attr('marker-end', 'url(#NORMAL)') // 应用箭头
  }

  setOptions (data) {
    this.processData(data)

    this.initNode()

    this.initEdge()

    this.setupForce()
  }

  destory () {
    this.uninstallForce()
    this.svg.remove()
  }

  render (data) {
    this.setOptions(data)
  }
}
