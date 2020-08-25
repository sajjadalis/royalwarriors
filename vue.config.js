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
    }
}