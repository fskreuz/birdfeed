const XmlEntities = require('html-entities').XmlEntities
const { encode } = new XmlEntities()

const nameFilter = n => n.replace(/[^a-z-]/g, '')

const childFilter = v => v === 0 || (v && v !== true)

const attributes = a => Object.keys(a)
  .map(k => ` ${nameFilter(k)}="${encode(a[k])}"`).join('')

const element = node => {
  const n = nameFilter(node.n)
  const a = attributes(node.a)
  const c = node.c.map(exports.render).join('')
  return `<${n}${a}>${c}</${n}>`
}

exports.n = (n, a = {}, ...c) => ({ n: n, a, c: c.filter(childFilter) })

exports.render = n => typeof n === 'string' ? encode(n) : element(n)
