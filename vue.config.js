module.exports = {
    devServer: {
        host: 'localhost'
    },
    chainWebpack: config => {
      config
      .plugin('html')
      .tap(args => {
        args[0].title = '[PAk] The Royal Warriors Hunting Report'
        return args
      })
    },
    pwa: {
      themeColor: "#32ad8e",
      msTileColor: "#32ad8e",
      appleMobileWebAppCache: "yes",
      manifestOptions: {
        background_color: "#32ad8e"
      }
    }
}