const cheerio = require('cheerio')
const { text, date, url } = require('./format')
const { twitter } = require('./constants')

exports.extract = html => {
  const $ = cheerio.load(html)

  const username = text($('.screen-name').text())
  const id = url(`${twitter}/${username}`)
  const title = text($('title').text())
  const subtitle = text($('.bio').text())
  const updated = date($('.tweet .timestamp').text())

  const entries = $('.tweet').map((i, e) => {
    const href = $(e).attr('href').split('?').shift().slice(1)
    const id = url(`${twitter}/${href}`)
    const avatar = $('.avatar img', e).attr('src').replace('_normal', '_400x400')

    const name = text($('.tweet-header .fullname', e).text())
    const replyContext = text($('.tweet-reply-context', e).text())
    const retweetContext = text($('.tweet-social-context', e).text())
    const username = text($('.tweet-header .username', e).text()).slice(1)
    const title = retweetContext ? `${retweetContext} ${username}`
      : replyContext ? `${name} ${replyContext[0].toLowerCase()}${replyContext.slice(1)}`
        : `${name} tweeted`

    const summary = text($('.tweet-container .tweet-text', e).text())
    const uri = url(`${twitter}/${username}`)
    const updated = date($('.timestamp', e).text())

    return { id, title, summary, updated, avatar, author: { name, uri } }
  }).get()

  return { id, title, subtitle, updated, entries }
}
