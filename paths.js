const paths = {
  build: './dist/',
  css: {
    src: './assets/stylesheets/index.css',
    all: './assets/stylesheets/**/*.css',
    dest: './dist/assets/stylesheets/'
  },
  js: {
    src: './assets/scripts/global.js',
    all: './assets/scripts/**/*.js',
    dest: './dist/assets/scripts/'
  },
  img: {
    src: './assets/images/**/*',
    dest: './dist/assets/images/'
  }
};

module.exports = paths;
