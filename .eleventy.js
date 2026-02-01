module.exports = function(config) {
  // Add some utility filters
  config.addFilter("squash", require("./src/filters/squash.js") );

  // minify the html output
  config.addTransform("htmlmin", require("./src/utils/minify-html.js"));

  // pass some assets right through
  config.addPassthroughCopy("./src/site/assets/img");
  config.addPassthroughCopy("./src/site/assets/favicon");
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
  };
};
