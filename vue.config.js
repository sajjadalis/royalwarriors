module.exports = {
    devServer: {
        host: 'localhost'
    },
    chainWebpack: config => {
      config
      .plugin('html')
      .tap(args => {
        args[0].title = '[HL4] BOPOMOFO Hunting Report'
        return args
      })
    }
}