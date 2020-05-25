/**
 * 绘制箭头
 * 一个<marker>就是一个“独立的”图形，有自己的坐标系统
 * 通过marker-start: url(#ACTIVE)、marker-mid、marker-end进行引用
 * <marker> 元素自身不会 显示，但是可以把它放到 <defs> 元素中，因为它是存放可复用元素的
 * 添加了 refX 和 refY 属性指定哪个坐标（标记的坐标系统中）与路径的 开始坐标对齐
 * @param {element} defs
 * @param {string} id
 * @param {object} options
 */
export function drawSymbol (defs, id, { markerHeight, markerWidth, color }) {
  return defs
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
