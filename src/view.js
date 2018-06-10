const { n } = require('./render')
const xmlns = 'http://www.w3.org/2005/Atom'

exports.view = feed =>
  n('feed', { xmlns },
    n('id', {}, feed.id),
    n('title', {}, feed.title),
    n('subtitle', {}, feed.subtitle),
    n('updated', {}, feed.updated),
    ...feed.entries.map(entry =>
      n('entry', {},
        n('id', {}, entry.id),
        n('updated', {}, entry.updated),
        n('link', { rel: 'alternate', type: 'text/html', href: entry.id }),
        n('link', { rel: 'enclosure', type: 'image/jpeg', href: entry.avatar }),
        n('title', {}, entry.title),
        n('summary', {}, entry.summary),
        n('author', {},
          n('name', {}, entry.author.name),
          n('uri', {}, entry.author.uri)))))
