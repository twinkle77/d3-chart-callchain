import * as d3 from 'd3'
import { getElementRect, getSvgBox } from '@/util/element.js'
import CONFIG from '@/config'

export default class Zoom {
    zoomTarget = null

    svg = null

    zoom = null
    zoomRect = null

    currentTransform = {
      x: 0,
      y: 0,
      k: 0
    }

    minTransform = {
      x: 0,
      y: 0,
      k: 0
    }

    zoomTo = null

    constructor (svg) {
      this.svg = svg
      this.zoomTarget = d3.select(svg.node().children[0])
      this.setupZoom()
    }

    setupZoom () {
      this.zoom = d3.zoom()
      this.svg.call(this.zoom)
      this.bindEvent()
      this.resizeHandler()
    }

    bindEvent () {
      this.zoom
        .on('zoom', () => {
          // 缩小、放大、移动画布
          const { k, x, y } = d3.event.transform
          // 记录当前的缩放比例以及画布的移动
          this.currentTransform.k = k
          this.currentTransform.x = x
          this.currentTransform.y = y
          // 更新视图
          this.zoomTarget.attr('transform', d3.event.transform.toString())
        })

      d3.select(window)
        .on('resize', this.resizeHandler.bind(this))

      d3.select(document.body)
        .on('click', this.keyboardHandler.bind(this))
    }

    // 窗口发生变化
    resizeHandler () {
      this.updateTransform()

      const { zoom } = CONFIG

      // 缩放到指定的倍数(不考虑当前缩放)，新的 k₁ = k
      this.svg.call(this.zoom.scaleTo, this.minTransform.k)
      // 限制缩放比例
      this.zoom.scaleExtent([this.minTransform.k, Math.max(1, zoom.maxScale)])
    }

    updateTransform () {
      const svgRect = getElementRect(this.svg.node())
      const realRect = getSvgBox(this.zoomTarget.node())

      // 计算缩小到svg能容纳g的最小比例
      if (
        realRect.width / svgRect.width > 1 ||
        realRect.height / svgRect.height > 1
      ) {
        this.minTransform.k =
          1 /
          Math.max(
            realRect.width / svgRect.width,
            realRect.height / svgRect.height
          )
      } else {
        this.minTransform.k = 1
      }

      // 限制移动区间
      this.zoom.translateExtent([
        [realRect.x, realRect.y],
        [
          realRect.width + realRect.x,
          realRect.height + realRect.y
        ]
      ])
    }

    // 移动画布
    keyboardHandler (action) {
      const { zoom } = CONFIG

      // 已到达最小缩放比例，无法移动
      if (this.currentTransform.k <= this.minTransform.k) return

      let currentX = this.currentTransform.x
      let currentY = this.currentTransform.y

      const step = zoom.moveDistance * this.currentTransform.k

      switch (action) {
        case 'UP':
          currentY += step
          break
        case 'DOWN':
          currentY -= step
          break
        case 'LEFT':
          currentX += step
          break
        case 'RIGHT':
          currentX -= step
          break
      }

      // 重置缩放
      this.svg.call(
        this.zoom.transform,
        d3.zoomIdentity
          .translate(currentX, currentY)
          .scale(this.currentTransform.k)
      )
    }

    // 画布缩小与放大
    zoomHandler (action) {
      const { zoom } = CONFIG

      let k = this.currentTransform.k
      const minK = this.minTransform.k

      switch (action) {
        case 'ZOOMOUT':
          k += zoom.zoomDistance
          k = Math.min(k, Math.max(1, zoom.maxScale))
          break
        case 'ZOOMIN':
          k -= zoom.zoomDistance
          k = Math.max(minK, k)
          break
      }

      this.svg.call(this.zoom.scaleTo, k)
    }

    // 支持定位到某节点
    zoomToTarget () {
      if (!this.zoomTo) return

      const { zoom } = CONFIG

      const { x, y } = this.zoomTo
      this.svg
        .transition()
        .call(this.zoom.scaleTo, Math.max(1, zoom.maxScale))
        .transition()
        .call(this.zoom.translateTo, x, y)
    }

    uninstallZoom () {
      this.zoom.on('zoom', null)
      d3.select(window)
        .on('resize', null)
    }
}
