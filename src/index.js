const express = require('express')
const request = require('request-promise-native')
const { twitter } = require('./constants')
const { extract } = require('./extract')
const { view } = require('./view')
const { render } = require('./render')

const port = process.env.PORT || 3000

const welcome = `
# Welcome to Birdfeed! ( ^-^)b

Serve Twitter user timelines and search results in Atom format.

To start using Birdfeed, do either of the following:

- For profiles: /u/TWITTER_USERNAME
- For searches: /s/SEARCH_TERM
`.slice(1)

const welcomeResponder = (req, res) => {
  res.setHeader('Content-Type', 'text/plain')
  res.send(welcome)
}

const responder = urlBuilder => async (req, res) => {
  try {
    // Now if JS had a more elegant way to pipe functions...
    const feed = render(view(extract(await request(urlBuilder(req.params)))))
    res.setHeader('Content-Type', 'application/atom+xml')
    res.send(`<?xml version="1.0" encoding="utf-8"?>\n${feed}`)
  } catch (e) {
    // If the request failed, it will return a statusCode. If not, our code
    // broke somewhere and it should be a 500.
    res.sendStatus(e.statusCode || 500)
  }
}

express()
  .get('/u/:username', responder(params => `${twitter}/${params.username}`))
  .get('/s/:query', responder(params => `${twitter}/search/${params.query}`))
  .get('/', welcomeResponder)
  .get('*', (req, res) => res.sendStatus(404))
  .listen(port, () => console.log('Aaand we have liftoff!  ( ^-^)b'))
