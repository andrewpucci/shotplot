module.exports = function(config) {

  // Layout aliases can make templates more portable
  config.addLayoutAlias('default', 'layouts/base.njk');

  // Add some utility filters
  config.addFilter("squash", require("./src/filters/squash.js") );

  // minify the html output
  config.addTransform("htmlmin", require("./src/utils/minify-html.js").default);

  // pass some assets right through
  config.addPassthroughCopy("./src/site/assets");
  config.addPassthroughCopy("./src/site/humans.txt");
  config.addPassthroughCopy("./src/site/robots.txt");

  return {
    dir: {
      input: "src/site",
      output: "dist",
      data: '_data'
    },
    templateFormats : ["njk", "md"],
    htmlTemplateEngine : "njk",
    markdownTemplateEngine : "njk",
    passthroughFileCopy: true,
  };
};
