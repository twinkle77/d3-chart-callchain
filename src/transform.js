/* eslint-disable */

export const CLIENT = 'CLIENT'
export const SERVER = 'SERVER'
let CLIENT_ID = -1

class Node {
  constructor (type, id, name, meta) {
    this.type = type
    this.id = id
    this.name = name
    this.meta = meta
    this.edges = []
  }

  setEdges (edge) {
    this.edges.push(edge)
  }

}

class Edge {
  constructor (source, target) {
    this.source = source
    this.target = target
  }
}
/*
  构造一个这样的数据结构，下面的所有函数才能跑通
  [
    {
      id: 1,
      Edges: [],
      Type: 'client',
      scaleReq: null
    },
    {
      id: 2,
      Edges: []
      Type: 'Server',
      scaleReq: [成功的占比，失败的占比]
    }
  ]
*/
/**
 * 数据结构转换，转换成适用图的数据结果
 * @param {object} data
 */
export default function transformData (data) {
  const newData = []
  const map = new Map()

  data.forEach((item) => {
    let {
      root,
      referenceId: id,
      parentIds,
      serviceName: name,
      averageTime,
      errorPercent,
      startTime,
      endTime,
    } = item

    const meta = {
      averageTime,
      errorPercent,
      startTime,
      endTime,
      parentIds
    }

    if (root) {
      let clientId =  CLIENT_ID--
      // 伪造client节点
      newData.push(new Node(CLIENT, clientId, 'client', { parentIds: [] }))
      meta.parentIds.push(clientId)
    }

    const newNode = new Node(SERVER, id, name, meta)

    map.set(id, newNode)

    newData.push(newNode)
  })

  newData.forEach(node => {
    const { id, meta: { parentIds } } = node

    parentIds.forEach(pId => {
      node.setEdges(new Edge(id, pId))
    })
  })

  map.clear()

  return newData
}
