const Metalsmith    = require('metalsmith');
const metadata      = require('metalsmith-metadata');
const excerpts      = require('metalsmith-better-excerpts');
const feed          = require('metalsmith-feed');
const writemetadata = require('metalsmith-writemetadata');
const collections   = require('metalsmith-collections');
const markdown      = require('metalsmith-markdown');
const layout        = require('metalsmith-layouts');
const inPlace       = require('metalsmith-in-place');
const templates     = require('metalsmith-templates');
const ignore        = require('metalsmith-ignore');
const permalinks    = require('metalsmith-permalinks');
const drafts        = require('metalsmith-drafts');
const pagination    = require('metalsmith-pagination');
const metallic      = require('metalsmith-metallic');
const htmlMinifier  = require('metalsmith-html-minifier');
const sitemap       = require('metalsmith-sitemap');
const join          = require('path').join;
const config        = require('./config');
const paths         = require('./paths');

module.exports = function (production) {
  var configData;

  if (production) {
    configData = config.production;
  } else {
    configData = config.development;
  }

  console.log(configData);
  return Metalsmith(__dirname)
    .clean(false)
    .source('./content')
    .metadata(configData)
    .use(drafts())
    .use(ignore('drafts/**/*'))
    .use(templates({
      engine: 'handlebars',
      default: 'index.hbs',
      partials: {
        header: 'partials/header',
        head: 'partials/head',
        nav: 'partials/nav',
        footer: 'partials/footer'
      },
      pattern: '**/*.md',
      rename: true
    }))
    .use(collections({
      posts: {
        pattern: 'posts/*.md',
        sortBy: 'date',
        reverse: true
      },
      pages: {
        pattern: '*.md',
        sortBy: 'priority'
      }
    }))
    .use(metallic())
    .use(markdown())
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
        template: 'collection.hbs',
        first: 'blog/index.html',
        path: 'blog/:num/index.html'
      }
    }))
    .use(templates('handlebars'))
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
        console.log(err);
      }
    });
};
