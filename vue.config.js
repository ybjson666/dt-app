const express = require('express')
const app = express()

var apiRoutes = express.Router()

app.use('/api', apiRoutes)

module.exports = {
  lintOnSave: false,
  // publicPath: process.env.NODE_ENV === 'production' ? '' : '/',
  // outputDir: process.env.NODE_ENV === 'production' ? 'dist' : 'devdist',
  // lintOnSave: false,
  // assetsDir: 'static',
  productionSourceMap: false,
  devServer: {
    open: false,
    host: '0.0.0.0',
    port: '8080',
    https: false,
    hotOnly: false,
    // 代理
    proxy: {
      '/server': {
        // target: 'http://127.0.0.1:808/',
        target: 'https://app.tinntay.com/test',
        // target: 'https://app.tinntay.com/',
        // target: 'http://192.168.101.3/',
        changeOrigin: true,
        pathRewrite: {
          '^/server': ''
        }
      }
    }
  },
  chainWebpack: config => {
    // 发布模式
    config.when(process.env.NODE_ENV === 'production', config => {
      config
        .entry('app')
        .clear()
        .add('./src/main-prod.js')

      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios'
      })

      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })

    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config
        .entry('app')
        .clear()
        .add('./src/main-dev.js')

      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  },
  css: { sourceMap: true }
}
