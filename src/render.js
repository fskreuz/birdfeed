const childFilter = v => v === 0 || (v && v !== true)

const attributes = a => Object.keys(a).map(k => ` ${k}="${a[k]}"`).join('')

const element = node => {
  const n = node.n
  const a = attributes(node.a)
  const c = node.c.map(exports.render).join('')
  return c ? `<${n}${a}>${c}</${n}>` : `<${n}${a}/>`
}

exports.n = (n, a = {}, ...c) => ({ n: n.toLowerCase(), a, c: c.filter(childFilter) })

exports.render = n => typeof n === 'string' ? n : element(n)
