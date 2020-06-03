import { selection } from 'd3'

/**
 * dom元素查找
 * @param {string | Element} el
 */
export function query (el) {
  if (typeof el === 'string') {
    const selected = document.querySelector(el)
    if (!selected) {
      // eslint-disable-next-line no-console
      process.env.NODE_ENV !== 'production' && console.error(`Cannot find element: ${el}`)
      const oDiv = document.createElement('div')
      oDiv.setAttribute('class', `d3-trace-${el}`)
      document.body.appendChild(oDiv)
      return oDiv
    }
    return selected
  }
  return el
}

const PREFIX = 'call-chain'
export function prefix (name) {
  return `${PREFIX}-${name}`
}

export function getElementRect (el) {
  return el.getBoundingClientRect()
}

// 以 SVGRect 对象的形式返回当前元素的位置 和边界。包含 x、y、width、height 属性，分 别代表坐标和能包含整个图形的最小矩形框。 边界不受笔画宽度、裁剪、蒙版、滤镜影响
export function getSvgBox (el) {
  return el.getBBox()
}
