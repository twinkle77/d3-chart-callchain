import * as d3 from 'd3'
import { query, prefix } from '@/util/element'
import CONFIG from '@/config'
import { drawSymbol } from '@/draw'
import transformData, { SERVER } from './transform'
import data from './data'

export default class Callchain {
  container = null

  svg = null

  zoomSpace = null

  graph = null

  areasWrapper = null

  edgesWrapper = null

  nodesWrapper = null

  defs = null

  nodes = null

  simulation = null

  nodeElements = null

  constructor (el = 'callchain') {
    this.container = query(el)
    this.setup()
  }

  setup () {
    this.createElement()
    this.createSymbol()
    this.setupForce()
  }

  createElement () {
    this.svg = d3.select(this.container)
      .append('svg')
      .attr('id', prefix('svg'))

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
      drawSymbol(this.defs, key.toUpperCase(), {
        markerHeight,
        markerWidth,
        color: colors[key]
      })
    })
  }

  processData (data) {
    this.nodes = typeof CONFIG.transform === 'function' ? CONFIG.transform(data) : transformData(data)
  }

  setupForce () {
    this.simulation = d3.forceSimulation()
    // this.simulation
    //   .on('tick', (...args) => { console.log(this.nodes) })
    //   .on('end', function end (...args) { console.log(args) })
    // console.log(this.nodes)
  }

  uninstallForce () {
    this.simulation.force('X', null)
  }

  setOptions () {
    this.processData(data)
    this.simulation.nodes(this.nodes)
    // this.simulation
    //   .on('tick', (...args) => { console.log(this.nodes) })
    //   .on('end', function end (...args) { console.log(args) })
    // console.log(this.nodes)

    this.nodeElements = this.nodesWrapper
      .selectAll('.node')
      .data(this.nodes)

    this.nodeElements
      .enter()
      .append('g')
      .attr('class', node => {
        let className = `${node.type.toLowerCase()} node `
        if (node.type === SERVER) {
          className += 'clickable'
        }
        return className
      })
      .attr('id', node => node.id)

    this.nodeElements
      .exit()
      .remove()
  }

  destory () {

  }

  render () {
    this.setOptions()
  }
}
