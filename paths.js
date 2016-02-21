const paths = {
  build: './dist/',
  css: {
    src: './assets/stylesheets/index.css',
    all: './assets/stylesheets/**/*.css',
    dest: './dist/assets/stylesheets/'
  },
  js: {
    src: './assets/scripts/global.js',
    dest: './dist/assets/scripts/'
  }
};

module.exports = paths;
