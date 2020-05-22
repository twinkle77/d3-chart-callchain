/**
 * 绘制箭头
 * @param {*} defs
 * @param {*} id
 * @param {*} fill
 */
export function drawSymbol (defs, id, fill) {
  return defs
    .append('svg:marker')
    .attr('id', id)
    .attr('markerHeight', 8)
    .attr('markerWidth', 8)
    .attr('markerUnits', 'strokeWidth')
    .attr('orient', 'auto')
    .attr('refX', 0)
    .attr('refY', 0)
    .attr('viewBox', '-5 -5 10 10')
    .append('svg:path')
    .attr('d', 'M 0,0 m -5,-5 L 5,0 L -5,5 Z')
    .attr('fill', fill)
}

// 绘制边
export function drawEdges () {

}

// 绘制边的扩展区域
export function drawAreas () {

}

// 绘制节点
export function drawNodes () {

}

// 绘制“客户端”节点
export function drawClientNode () {

}
