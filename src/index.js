import * as d3 from 'd3'
import { query, prefix } from '@/util/element'
import CONFIG from '@/config'
import { drawSymbol } from '@/draw'
import transformData from './transform'
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

  data = null

  constructor (el = 'callchain') {
    this.container = query(el)
    this.setup()
  }

  setup () {
    this.createElement()
    this.createSymbol()
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

    this.processData(data)
  }

  processData (data) {
    this.data = typeof CONFIG.transform === 'function' ? CONFIG.transform(data) : transformData(data)
    console.log(this.data)
  }

  setOptions () {

  }

  destory () {

  }

  render () {

  }
}
