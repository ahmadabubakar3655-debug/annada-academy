module.exports = function (eleventyConfig) {
  // Copy these folders as-is into the final built site
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("assets");

  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    server: {
      port: 8080,
      host: "0.0.0.0"  // This makes it available on all network interfaces
    }
  };
};