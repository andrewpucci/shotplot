const cacheBuster = require('@mightyplow/eleventy-plugin-cache-buster');

module.exports = function(config) {
  // Layout aliases can make templates more portable
  config.addLayoutAlias('default', 'layouts/base.njk');

  // Add some utility filters
  config.addFilter("squash", require("./src/filters/squash.js") );

  // minify the html output
  config.addTransform("htmlmin", require("./src/utils/minify-html.js"));

  // fingerprint css and js files
  config.addPlugin(cacheBuster({
    outputDirectory: 'dist',
    createResourceHash(outputDirectoy, url, target) {
      return Date.now();
    }
  }));

  // pass some assets right through
  config.addPassthroughCopy("./src/site/assets");
  config.addPassthroughCopy("./src/site/humans.txt");
  config.addPassthroughCopy("./src/site/robots.txt");

  return {
    dir: {
      input: "src/site",
      layouts: "_layouts",
      output: "dist",
      data: '_data'
    },
    templateFormats : ["njk", "md"],
    htmlTemplateEngine : "njk",
    markdownTemplateEngine : "njk",
    passthroughFileCopy: true,
  };
};
