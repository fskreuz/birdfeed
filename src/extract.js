const cheerio = require('cheerio')
const moment = require('moment')
const { twitter } = require('./constants')

const text = text => text.trim().replace(/[\r\n]/g, ' ').replace(/\s+/g, ' ')
const url = url => (new URL(url)).toString()
const date = ms => moment(ms).toISOString()

exports.extract = html => {
  const $ = cheerio.load(html)

  const id = url($('link[rel="canonical"]').attr('href'))
  const title = text($('title').text())
  const subtitle = text($('.ProfileHeaderCard-bio').text())

  // Find the latest timestamp from the tweets since the first tweet
  // is not guaranteed to be the latest. It might be a pinned tweet.
  const latestTweetTimestamp = $('.js-original-tweet .js-short-timestamp')
    .map((i, e) => parseInt($(e).data('time-ms'), 10))
    .get()
    .sort()
    .pop()

  const updated = date(latestTweetTimestamp)

  const entries = $('.js-original-tweet').map((i, e) => {
    const statusPath = $('.js-permalink', e).attr('href')
    const id = url(`${twitter}${statusPath}`)
    const profilePath = $('.js-action-profile', e).attr('href')
    const uri = url(`${twitter}${profilePath}`)
    const updated = date($('.js-short-timestamp', e).data('time-ms'))
    const name = text($('.fullname', e).text())

    // Now over to the ugly stuff...

    // Get the various kinds of tweets to define the title.
    // - Reply isn't part of the main stream, but I'll add it anyways.
    // - A quote is just a regular tweet, but treating it as a special one.
    const retweetContext = text($('.js-retweet-text', e).text())
    const pinnedContext = text($('.js-pinned-text', e).text())
    const replyContext = text($('.js-reply-text', e).text())
    const quoteName = text($('.QuoteTweet-fullname', e).text())
    const title = retweetContext ? `${retweetContext} ${name}`
      : pinnedContext ? `${name} ${pinnedContext}`
        : replyContext ? `${replyContext} ${name}`
          : quoteName ? `${name} Quoted ${quoteName}`
            : `${name} Tweeted`

    // Cheerio bug where doing css on empty collection throws instead of
    // returning undefined.
    let gif = ''
    try {
      gif = $('.PlayableMedia-player', e)
        .css('background-image')
        .replace(/^url\('(.+?)'\)$/, '$1')
    } catch (e) { }

    const jpeg = $('.js-adaptive-photo img', e).attr('src')
    const avatar = $('.js-action-profile-avatar', e)
      .attr('src')
      .replace('_bigger', '_400x400')
    const poster = url(gif || jpeg || avatar)

    // A tweet can contain hidden markup for quoted content which we don't need.
    const tweet = $('.js-tweet-text', e).contents()
      .not('.u-hidden')
      .map((i, e) => $(e).text())
      .get()
      .join(' ')
    const summary = `<img src="${poster}"><p>${text(tweet)}</p>`

    return { id, title, summary, updated, poster, author: { name, uri } }
  }).get()

  return { id, title, subtitle, updated, entries }
}
