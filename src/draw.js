import * as d3 from 'd3'

export class EdgeUtil {
  /**
   * 绘制箭头
   * 一个<marker>就是一个“独立的”图形，有自己的坐标系统
   * 通过marker-start: url(#ACTIVE)、marker-mid、marker-end进行引用
   * <marker> 元素自身不会 显示，但是可以把它放到 <defs> 元素中，因为它是存放可复用元素的
   * 添加了 refX 和 refY 属性指定哪个坐标（标记的坐标系统中）与路径的 开始坐标对齐
   * @param {element} selection
   * @param {string} id
   * @param {object} options
   */
  static drawSymbol (selection, id, { markerHeight, markerWidth, color }) {
    return selection
      .append('marker')
      .attr('id', id)
      .attr('markerHeight', markerHeight)
      .attr('markerWidth', markerWidth)
      .attr('markerUnits', 'strokeWidth')
      .attr('orient', 'auto')
      .attr('refX', 0)
      .attr('refY', 0)
      .attr('viewBox', '-5 -5 10 10')
      .append('path')
      .attr('d', 'M 0,0 m -5,-5 L 5,0 L -5,5 Z')
      .attr('fill', color)
  }
}

export class ServerNodeUtil {
  static drawCircle (selection, { radius, strokeWidth }) {
    return selection
      .append('circle')
      .attr('r', radius)
      .classed('normal-ring', true)
      .attr('style', `stroke-width: ${strokeWidth + 5}px; fill: none`)
  }

  static drawText (selection, { text = '', x, y, className = 'text' }) {
    return selection
      .append('text')
      .attr('text-anchor', 'middle')
      .classed(className, true)
      .text(text)
      .attr('transform', `translate(${x}, ${y})`)
  }

  static drawRing (selection, { colors, radius, ringWidth }) {
    // 序数比例尺
    const colorsScale = d3.scaleOrdinal().range(colors)
    // 圆形数据生成函数
    const arc = d3
      .arc()
      .innerRadius(radius - ringWidth)
      .outerRadius(radius)
      .startAngle(d => d.startAngle)
      .endAngle(d => d.endAngle)
      // 饼图数据生成函数
    const pie = d3
      .pie()
      .value(d => d)
      .sort(null)

    selection
      .data(node => {
        return pie(node.scaleReq)
      })
      .attr('d', arc)
      .attr('fill', (_, i) => {
        return colorsScale(i)
      })
  }
}

export class ClientNodeUtil {
  static drawIcon (selection, icon = '&#xe640;') {
    selection
      .append('text')
      .attr('class', 'iconfont client')
      .attr('text-anchor', 'middle')
      .html(icon)
  }
}
