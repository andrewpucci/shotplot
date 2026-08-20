const squash = require('./src/filters/squash');
const minifyHtml = require('./src/utils/minify-html');

module.exports = function eleventyConfig(config) {
  // Add some utility filters.
  config.addFilter('squash', squash);

  // Minify the HTML output.
  config.addTransform('htmlmin', minifyHtml);

  // Pass some assets right through.
  config.addPassthroughCopy('./src/site/assets/img');
  config.addPassthroughCopy('./src/site/assets/favicon');
  config.addPassthroughCopy('./src/site/_headers');
  config.addPassthroughCopy('./src/site/humans.txt');
  config.addPassthroughCopy('./src/site/robots.txt');

  return {
    dir: {
      input: 'src/site',
      output: 'dist',
      data: '_data',
    },
    templateFormats: ['njk', 'md'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
  };
};
