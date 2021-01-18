module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/styles/_variables.scss";`,
      },
    },
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: false,
      preload: "src/preload.js",
    },
  },
};
