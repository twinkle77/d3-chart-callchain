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
