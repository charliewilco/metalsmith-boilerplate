const Metalsmith    = require('metalsmith');
const metadata      = require('metalsmith-metadata');
const excerpts      = require('metalsmith-better-excerpts');
const feed          = require('metalsmith-feed');
const writemetadata = require('metalsmith-writemetadata');
const collections   = require('metalsmith-collections');
const markdown      = require('metalsmith-markdown');
const layout        = require('metalsmith-layouts');
const ignore        = require('metalsmith-ignore');
const permalinks    = require('metalsmith-permalinks');
const pagination    = require('metalsmith-pagination');
const sitemap       = require('metalsmith-sitemap');
const config        = require('./config');
const paths         = require('./paths');

// Collects Partial Registration for Handlebars
const partialConfig = {
  header: 'partials/header',
  head: 'partials/head',
  nav: 'partials/nav',
  footer: 'partials/footer'
};

module.exports = function (production) {
  var configData;

  if (production) {
    configData = config.production;
  } else {
    configData = config.development;
  }

  return Metalsmith(__dirname)
    .clean(false)
    .source('./content')
    .metadata(configData)
    .use(ignore('drafts/**/*'))
    .use(markdown())

    .use(collections({
      posts: {
        pattern: 'posts/*.html',
        sortBy: 'date',
        reverse: true
      },
      pages: {
        pattern: '*.html',
        sortBy: 'priority'
      }
    }))
    .use(permalinks({
      pattern: 'blog/:title',
      relative: false
    }))
    .use(feed({ collection: 'posts' }))
    .use(excerpts({
      pruneLength: 160,
      pruneString: ''
    }))
    .use(pagination({
      'collections.posts': {
        perPage: 100,
        layout: 'collection.hbs',
        first: 'blog/index.html',
        path: 'blog/:num/index.html'
      }
    }))
    .use(layout({
      engine: 'handlebars',
      partials: partialConfig,
      default: 'index.hbs',
      rename: true,
    }))
    .use(writemetadata({
      bufferencoding: 'utf8',
      collections: {
        posts: {
          output: {
            asObject: true,
            path: 'blog/index.json',
            metadata: { type: 'list' }
          },
          ignorekeys: ['history', 'stats', 'next', 'template', 'previous', 'collection', 'mode'],
        }
      }
    }))
    .use(sitemap({
      hostname: configData.site.url,
      defaults: {
        lastModified: Date.now()
      }
    }))
    .destination(paths.build)
    .build(function (err, files) {
      if (err) {
        console.log(err + ' ' + files);
      }
    });
};
