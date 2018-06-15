# Birdfeed

Serve Twitter user timelines and search results in Atom format.

Inspired by [TwitRSS.me](https://twitrss.me/) which is [written in Perl](https://github.com/ciderpunx/twitrssme).

## Live Demo

[https://birdfeed.now.sh/](https://birdfeed.now.sh/)

<small>The demo instance runs under [ZEIT's OSS plan](https://zeit.co/pricing) with limited resources, and whose code and logs [_are available to the public_](https://birdfeed.now.sh/_src). The demo may also be downed or taken down at any moment in time. **You have been warned**.</small>

## Development

```
npm install
npm run watch
```

## Deployment

Deploy to any Node-capable service and run `npm start`.

- For profiles: `https://yourdomain.com/u/TWITTER_USERNAME`
- For searches: `https://yourdomain.com/s/SEARCH_TERM`

## Technical details

The app does NOT use the Twitter API and does NOT require any API key. Instead, it _screenscrapes_ the publicly-available, no-JS version of `twitter.com`. Due to how `twitter.com` is rendered, there are a few limitations to the generated feed:

- Private profiles will return an empty feed.
- Tweets are copied as rendered on the timeline/search results.
- Only static images are used as preview images.
- GIFs only show first frame. Twitter only renders posters for GIFs.