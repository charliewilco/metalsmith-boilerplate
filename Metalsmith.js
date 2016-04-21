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
const handlebars    = require('handlebars');
const hbsLayouts    = require('handlebars-layouts');

// Collects Partial Registration for Handlebars
const partialConfig = {
  header: 'partials/header',
  head: 'partials/head',
  nav: 'partials/nav',
  footer: 'partials/footer',
  default: 'default'
};

handlebars.registerHelper(hbsLayouts(handlebars));

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
    .use(ignore('drafts/**/*'))
    .metadata(configData)
    .use(layout({
      engine: 'handlebars',
      partials: partialConfig,
      rename: true,
    }))
    .use(collections({
      posts: {
        pattern: 'posts/*.md',
        sortBy: 'date',
        reverse: true
      },
      work: {
        pattern: 'work/*.md',
        sortBy: 'date',
        reverse: true
      },
      pages: {
        pattern: '*.md',
      }
    }))
    .use(excerpts({
      pruneLength: 160,
      pruneString: ''
    }))
    .use(permalinks({
      pattern: ':title',
      relative: false,
      linksets: [{
        match: { collection: 'posts' },
        pattern: 'blog/:title',
        date: 'mmddyy'
      }]
    }))
    .use(markdown())
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
      const f = files;
      if (err) {
        console.log(err);
      }
    });
};
