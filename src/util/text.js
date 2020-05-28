/**
 * 文本截取
 * @param {要截取的字符串} str
 * @param {超过30显示省略号} submit
 */
export function ellipsis (text, submit = 30) {
  if (text.length < submit) return text
  return `${text.substring(0, submit)}...`
}

export function getTextWidth (textEl) {
  return textEl.getComputedTextLength()
}
