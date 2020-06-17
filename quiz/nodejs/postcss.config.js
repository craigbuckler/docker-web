module.exports = (ctx) => {

  return {
    map: ctx.options.map,
    plugins: [
      require('postcss-import')(),
      require('cssnano')()
    ]
  };

};
