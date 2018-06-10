const express = require('express')
const request = require('request-promise-native')
const { twitterMobile } = require('./constants')
const { extract } = require('./extract')
const { view } = require('./view')
const { render } = require('./render')

const welcome = `
# Welcome to Birdfeed! ( ^-^)b

To start using Birdfeed, do either of the following:

- For profiles: /u/TWITTER_USERNAME
- For searches: /s/SEARCH_TERM
`.slice(1)

const welcomeResponder = (req, res) => {
  res.setHeader('Content-Type', 'text/plain')
  res.send(welcome)
}

const feedResponder = urlBuilder => async (req, res) => {
  try {
    const feed = render(view(extract(await request(urlBuilder(req.params)))))
    res.setHeader('Content-Type', 'application/atom+xml')
    res.send(`<?xml version="1.0" encoding="utf-8"?>\n${feed}`)
  } catch (e) {
    res.sendStatus(e.statusCode)
  }
}

express()
  .get('/u/:username', feedResponder(params => `${twitterMobile}/${params.username}`))
  .get('/s/:query', feedResponder(params => `${twitterMobile}/search/${params.query}`))
  .get('/', welcomeResponder)
  .get('*', (req, res) => res.sendStatus(404))
  .listen(3000, () => console.log('Aaand we have liftoff!  ( ^-^)b'))
