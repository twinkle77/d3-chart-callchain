import * as d3 from 'd3'
import { query, prefix } from '@/util/element'
import CONFIG from '@/config'
import { drawSymbol } from '@/draw'

export default class Callchain {
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
    const defs = this.graph.append('svg:defs')
    Object.keys(CONFIG.markerColors).forEach((key) => {
      drawSymbol(defs, key, CONFIG.markerColors[key])
    })
  }

  setOptions () {

  }

  destory () {

  }

  render () {

  }
}
