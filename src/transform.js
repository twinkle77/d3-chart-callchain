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
    this.scaleReq = [0.6, 0.4]
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

/**
 * 数据结构转换，转换成适用图的数据结果
 * @param {object} data
 */
export default function transformData (data) {
  const newData = []

  data.forEach((item) => {
    const {
      root,
      referenceId: id,
      parentIds,
      serviceName: name,
      averageTime,
      errorPercent,
      startTime,
      endTime
    } = item

    const meta = {
      averageTime,
      errorPercent,
      startTime,
      endTime,
      parentIds
    }

    if (root) {
      const clientId = CLIENT_ID--
      // 伪造client节点
      newData.push(new Node(CLIENT, clientId, 'client', { parentIds: [] }))
      meta.parentIds.push(clientId)
    }

    const newNode = new Node(SERVER, id, name, meta)

    newData.push(newNode)
  })

  newData.forEach(node => {
    const { id, meta: { parentIds } } = node

    parentIds.forEach(pId => {
      node.setEdges(new Edge(pId, id))
    })
  })

  return newData
}
