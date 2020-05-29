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
    this.edgeElements = this.nodes.reduce((pre, cur) => [...pre, ...cur.edges], [])
  }

  setupForce () {
    this.simulation = d3.forceSimulation()
      .force('charge', d3.forceManyBody())
      .nodes(this.nodes)
      .force('link',
        d3.forceLink()
          .id(node => node.id)
          .links(this.edgeElements)
      )

    this.simulation
      .on('tick', () => {
        this.nodeElements
          .attr('transform', node => {
            return `translate(${node.x}, ${node.y})`
          })
      })
      .on('end', function end (...args) { })
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
      .each(function multipe ({ type }) {
        const target = d3.select(this)
        if (type === SERVER) {
          that.processServerNode(target)
        } else if (type === CLIENT) {
          that.processClientNode(target)
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
    console.log(this.edgeElements)
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
